import fs from 'node:fs/promises'
import path from 'node:path'

const ROOT_DIR = path.resolve(new URL('..', import.meta.url).pathname)
const SNAPSHOT_PATH = path.join(ROOT_DIR, 'src', 'data', 'github-org-repo-heatmap.json')
const GRAPHQL_ENDPOINT = 'https://api.github.com/graphql'
const HEATMAP_SOURCE = 'github-graphql'

const ORGANIZATION_QUERY = `
  query OrganizationRepositories($org: String!, $cursor: String) {
    organization(login: $org) {
      repositories(
        first: 100
        after: $cursor
        orderBy: { field: CREATED_AT, direction: ASC }
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          name
          createdAt
          visibility
          isPrivate
        }
      }
    }
  }
`

function toDateOnly(date) {
  return date.toISOString().slice(0, 10)
}

function addDays(date, days) {
  const copy = new Date(date)
  copy.setUTCDate(copy.getUTCDate() + days)
  return copy
}

function getUtcToday() {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
}

function getLastYearRange() {
  const endDate = getUtcToday()
  const startDate = addDays(endDate, -364)
  return { startDate, endDate }
}

function getLevel(count) {
  if (count === 0) return 0
  if (count <= 2) return 1
  if (count <= 5) return 2
  if (count <= 10) return 3
  return 4
}

function parseEnvValue(raw) {
  const trimmed = raw.trim()
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

async function loadEnvFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8')
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) {
        continue
      }
      const separatorIndex = trimmed.indexOf('=')
      if (separatorIndex === -1) {
        continue
      }
      const key = trimmed.slice(0, separatorIndex).trim()
      if (!key || process.env[key] != null) {
        continue
      }
      process.env[key] = parseEnvValue(trimmed.slice(separatorIndex + 1))
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return
    }
    throw error
  }
}

async function loadLocalEnv() {
  await loadEnvFile(path.join(ROOT_DIR, '.env'))
  await loadEnvFile(path.join(ROOT_DIR, '.env.local'))
}

async function readSnapshot() {
  try {
    const content = await fs.readFile(SNAPSHOT_PATH, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return null
    }
    throw error
  }
}

async function writeSnapshot(snapshot) {
  await fs.mkdir(path.dirname(SNAPSHOT_PATH), { recursive: true })
  await fs.writeFile(SNAPSHOT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8')
}

function createEmptySnapshot(organization = '') {
  const { startDate, endDate } = getLastYearRange()
  return {
    organization,
    source: HEATMAP_SOURCE,
    generatedAt: new Date().toISOString(),
    rangeStart: toDateOnly(startDate),
    rangeEnd: toDateOnly(endDate),
    total: {},
    repos: [],
  }
}

async function githubGraphql(token, variables) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'litos-org-repositories-created-per-day',
    },
    body: JSON.stringify({
      query: ORGANIZATION_QUERY,
      variables,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`GitHub API error ${response.status}: ${text}`)
  }

  const json = await response.json()
  if (Array.isArray(json.errors) && json.errors.length > 0) {
    throw new Error(JSON.stringify(json.errors, null, 2))
  }

  return json.data
}

async function fetchOrganizationRepositories(org, token) {
  const repositories = []
  let cursor = null
  let hasNextPage = true

  while (hasNextPage) {
    const data = await githubGraphql(token, { org, cursor })
    const connection = data.organization?.repositories

    if (!connection) {
      throw new Error(`Organization not found or token has no access: ${org}`)
    }

    repositories.push(...connection.nodes)
    hasNextPage = connection.pageInfo.hasNextPage
    cursor = connection.pageInfo.endCursor
  }

  return repositories
}

function buildDailyRepositoryReport(organization, repositories) {
  const { startDate, endDate } = getLastYearRange()
  const countsByDate = new Map()

  for (let date = new Date(startDate); date <= endDate; date = addDays(date, 1)) {
    countsByDate.set(toDateOnly(date), 0)
  }

  for (const repo of repositories) {
    const createdAt = new Date(repo.createdAt)
    if (createdAt < startDate || createdAt > addDays(endDate, 1)) {
      continue
    }

    const date = repo.createdAt.slice(0, 10)
    if (!countsByDate.has(date)) {
      continue
    }

    countsByDate.set(date, (countsByDate.get(date) ?? 0) + 1)
  }

  const total = {}
  const repos = []

  for (const [date, count] of countsByDate.entries()) {
    const year = date.slice(0, 4)
    total[year] ??= 0
    total[year] += count
    repos.push({
      date,
      count,
      level: getLevel(count),
    })
  }

  return {
    organization,
    source: HEATMAP_SOURCE,
    generatedAt: new Date().toISOString(),
    rangeStart: toDateOnly(startDate),
    rangeEnd: toDateOnly(endDate),
    total,
    repos,
  }
}

async function main() {
  await loadLocalEnv()

  const organization = process.env.GITHUB_ORG?.trim() ?? ''
  const token = process.env.GITHUB_TOKEN?.trim() ?? ''
  const existingSnapshot = await readSnapshot()

  if (!organization || !token) {
    if (existingSnapshot) {
      console.warn('[heatmap] Missing GITHUB_ORG or GITHUB_TOKEN. Using committed snapshot.')
      return
    }

    console.warn('[heatmap] Missing GITHUB_ORG or GITHUB_TOKEN and no snapshot found. Writing empty fallback snapshot.')
    await writeSnapshot(createEmptySnapshot(organization))
    return
  }

  try {
    const repositories = await fetchOrganizationRepositories(organization, token)
    const snapshot = buildDailyRepositoryReport(organization, repositories)
    await writeSnapshot(snapshot)
    console.log(`[heatmap] Updated repo heatmap snapshot for ${organization} with ${repositories.length} accessible repositories.`)
  } catch (error) {
    if (existingSnapshot) {
      console.warn(`[heatmap] Failed to refresh snapshot. Keeping committed snapshot. ${error instanceof Error ? error.message : String(error)}`)
      return
    }

    console.warn(`[heatmap] Failed to refresh snapshot and no snapshot exists. Writing empty fallback. ${error instanceof Error ? error.message : String(error)}`)
    await writeSnapshot(createEmptySnapshot(organization))
  }
}

await main()
