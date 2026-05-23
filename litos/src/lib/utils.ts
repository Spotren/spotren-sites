import type { CollectionEntry } from 'astro:content'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { type SiteLocale } from '~/lib/i18n'

export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes))
}

// 文章按时间排序
export function postsSort(posts: CollectionEntry<'posts'>[]) {
  return posts.slice().sort((a, b) => {
    const dateA = a.data.updatedDate ?? a.data.pubDate
    const dateB = b.data.updatedDate ?? b.data.pubDate
    return new Date(dateB).getTime() - new Date(dateA).getTime()
  })
}

// 日期格式化类型
export type DateFormat = 'default' | 'dot' | 'short' | 'iso' | 'chinese'

// 日期格式化函数
export const formatDate = (date: Date, format: DateFormat = 'default', locale: SiteLocale = 'en'): string => {
  const browserLocale = locale === 'pt' ? 'pt-BR' : 'en-US'

  switch (format) {
    case 'dot':
      // 2020.03.03 格式
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}.${month}.${day}`

    case 'short':
      return date.toLocaleDateString(browserLocale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })

    case 'iso':
      // 2020-03-03 格式
      return date.toISOString().split('T')[0]

    case 'chinese':
      return date.toLocaleDateString(browserLocale, {
        year: 'numeric',
        month: locale === 'pt' ? '2-digit' : 'long',
        day: 'numeric',
      })

    case 'default':
    default:
      return date.toLocaleDateString(browserLocale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
  }
}
