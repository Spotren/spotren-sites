export type RepoHeatmapLevel = 0 | 1 | 2 | 3 | 4

export type RepoHeatmapDay = {
  date: string
  count: number
  level: RepoHeatmapLevel
}

export type RepoHeatmapSnapshot = {
  organization: string
  source: 'github-graphql'
  generatedAt: string
  rangeStart: string
  rangeEnd: string
  total: Record<string, number>
  repos: RepoHeatmapDay[]
}

const HEATMAP_WEEKS = 53
const HEATMAP_DAYS = HEATMAP_WEEKS * 7

function toDateOnly(date: Date) {
  return date.toISOString().slice(0, 10)
}

function addDays(date: Date, days: number) {
  const copy = new Date(date)
  copy.setUTCDate(copy.getUTCDate() + days)
  return copy
}

function getUtcToday() {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
}

function parseDateOnly(value: string) {
  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }
  const parsed = new Date(`${trimmed}T00:00:00.000Z`)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function normalizeLevel(value: number): RepoHeatmapLevel {
  if (value <= 0) return 0
  if (value >= 4) return 4
  if (value === 3) return 3
  if (value === 2) return 2
  return 1
}

export function createEmptyRepoHeatmapSnapshot(endDate = getUtcToday()): RepoHeatmapSnapshot {
  const rangeEnd = toDateOnly(endDate)
  const rangeStart = toDateOnly(addDays(endDate, -364))

  return {
    organization: '',
    source: 'github-graphql',
    generatedAt: '',
    rangeStart,
    rangeEnd,
    total: {},
    repos: [],
  }
}

export function normalizeRepoHeatmapSnapshot(input: unknown): RepoHeatmapSnapshot {
  const fallback = createEmptyRepoHeatmapSnapshot()
  if (!input || typeof input !== 'object') {
    return fallback
  }

  const record = input as Record<string, unknown>
  const repos = Array.isArray(record.repos)
    ? record.repos.flatMap((item): RepoHeatmapDay[] => {
        if (!item || typeof item !== 'object') {
          return []
        }

        const day = item as Record<string, unknown>
        const date = typeof day.date === 'string' ? day.date.trim() : ''
        const count = typeof day.count === 'number' && Number.isFinite(day.count) ? Math.max(0, Math.floor(day.count)) : 0
        const level = typeof day.level === 'number' && Number.isFinite(day.level) ? normalizeLevel(day.level) : 0

        if (!date) {
          return []
        }

        return [{ date, count, level }]
      })
    : []

  const rangeEndDate = parseDateOnly(typeof record.rangeEnd === 'string' ? record.rangeEnd : '') ?? getUtcToday()
  const fallbackFromEnd = createEmptyRepoHeatmapSnapshot(rangeEndDate)

  const total = record.total && typeof record.total === 'object' && !Array.isArray(record.total)
    ? Object.fromEntries(
        Object.entries(record.total as Record<string, unknown>).flatMap(([year, value]) => {
          if (typeof value !== 'number' || !Number.isFinite(value)) {
            return []
          }
          return [[year, Math.max(0, Math.floor(value))]]
        }),
      )
    : {}

  return {
    organization: typeof record.organization === 'string' ? record.organization.trim() : '',
    source: 'github-graphql',
    generatedAt: typeof record.generatedAt === 'string' ? record.generatedAt.trim() : '',
    rangeStart: typeof record.rangeStart === 'string' && record.rangeStart.trim() ? record.rangeStart.trim() : fallbackFromEnd.rangeStart,
    rangeEnd: typeof record.rangeEnd === 'string' && record.rangeEnd.trim() ? record.rangeEnd.trim() : fallbackFromEnd.rangeEnd,
    total,
    repos,
  }
}

export function buildRepoHeatmapGrid(snapshot: RepoHeatmapSnapshot): RepoHeatmapDay[] {
  const normalized = normalizeRepoHeatmapSnapshot(snapshot)
  const rangeEndDate = parseDateOnly(normalized.rangeEnd) ?? getUtcToday()
  const gridStart = addDays(rangeEndDate, -(HEATMAP_DAYS - 1))
  const repoMap = new Map(normalized.repos.map((repo) => [repo.date, repo]))

  return Array.from({ length: HEATMAP_DAYS }, (_, index) => {
    const date = toDateOnly(addDays(gridStart, index))
    return repoMap.get(date) ?? { date, count: 0, level: 0 }
  })
}
