import type { ImageMetadata } from 'astro'
import type { CaseData, Case, PolaroidVariant } from '~/types'
import type { SiteLocale } from '~/lib/i18n'

// Auto-import all images under the cases directory.
const caseModules = import.meta.glob<{ default: ImageMetadata }>('../assets/cases/**/*.{webp,jpg,jpeg,png,avif}', { eager: true })

/**
 * Get a sorted list of cases by directory name.
 * @param dir - Directory name, for example '2025-06-21-cat'
 * @param alt - Image alt text
 * @param variants - Variant for each image, mapped by index
 */
function getCases(dir: string, alt: string, variants: PolaroidVariant[]): Case[] {
  return Object.entries(caseModules)
    .filter(([path]) => path.includes(`/${dir}/`))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, mod], index) => {
      const img = mod.default
      return {
        src: img,
        alt,
        width: img.width,
        height: img.height,
        variant: variants[index] || '4x3',
      }
    })
}

export function getCasesList(locale: SiteLocale = 'en'): CaseData[] {
  if (locale === 'pt') {
    return [
      {
        title: 'Valdeci José · VallMaQ',
        icon: { type: 'emoji', value: '🛠️' },
        description: 'Conseguiu mais demanda por seus serviços de conserto de máquinas de lavar em Andradina, interior de SP.',
        date: '2026-03-07',
        travel: '',
        cases: getCases('2026-03-07-vallmaq', 'Valdeci José, da VallMaQ, conta como conseguiu mais demanda por seus serviços de conserto de máquinas de lavar em Andradina, interior de SP.', ['3x4']),
      },
    ]
  }

  return [
    {
      title: 'Valdeci José · VallMaQ',
      icon: { type: 'emoji', value: '🛠️' },
      description: 'He gained more demand for his washing machine repair services in Andradina, in the interior of São Paulo state.',
      date: '2026-03-07',
      travel: '',
      cases: getCases('2026-03-07-vallmaq', 'Valdeci José, from VallMaQ, explains how he managed to increase demand for his washing machine repair services in Andradina, in the interior of São Paulo state.', ['3x4', '3x4', '3x4', '3x4', '3x4', '3x4']),
    },
  ]
}
