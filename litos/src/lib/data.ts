import { getCollection, type CollectionEntry } from 'astro:content'
import type { SiteLocale } from '~/lib/i18n'

// 文章按时间排序
export function postsSort(posts: CollectionEntry<'posts'>[]) {
  return posts.slice().sort((a, b) => {
    const dateA = a.data.updatedDate ?? a.data.pubDate
    const dateB = b.data.updatedDate ?? b.data.pubDate
    return new Date(dateB).getTime() - new Date(dateA).getTime()
  })
}

export function getPostLocale(post: CollectionEntry<'posts'>): SiteLocale {
  return post.id.startsWith('pt/') ? 'pt' : 'en'
}

export function getPostSlug(post: CollectionEntry<'posts'>): string {
  return post.id.replace(/^(en|pt)\//, '')
}

// 获取所有非草稿文章，按时间排序
export async function getAllPosts(locale?: SiteLocale): Promise<CollectionEntry<'posts'>[]> {
  const allPosts = await getCollection('posts')
  return postsSort(
    allPosts.filter((post) => {
      if (post.data.draft) return false
      if (!locale) return true
      return getPostLocale(post) === locale
    })
  )
}

// 获取所有置顶文章
export async function getPinnedPosts(locale?: SiteLocale): Promise<CollectionEntry<'posts'>[]> {
  const allPosts = await getCollection('posts')
  const pinnedPosts = allPosts.filter((post) => post.data.pinned)
  return postsSort(locale ? pinnedPosts.filter((post) => getPostLocale(post) === locale) : pinnedPosts)
}

// 获取最新的固定数量的文章
export async function getNumPosts(size: number, locale?: SiteLocale): Promise<CollectionEntry<'posts'>[]> {
  const allPosts = await getAllPosts(locale)
  return allPosts.slice(0, size)
}

// 获取标签
export async function getAllTags(locale?: SiteLocale): Promise<Record<string, number>> {
  const allPosts = await getAllPosts(locale)
  const tags = allPosts.flatMap((post) => post.data.tags || [])
  return tags.reduce(
    (acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
}

// 获取project
export async function getAllProjects(): Promise<CollectionEntry<'projects'>[]> {
  const allProjects = await getCollection('projects')
  return allProjects.filter((project) => !project.data.draft)
}
