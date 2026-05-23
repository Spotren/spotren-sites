import type { ImageMetadata } from 'astro'
import type { CaseData, Case, PolaroidVariant } from '~/types'
import type { SiteLocale } from '~/lib/i18n'

// Auto-import all images under the cases directory.
const caseModules = import.meta.glob<{ default: ImageMetadata }>('../assets/cases/**/*.{webp,jpg,jpeg,png}', { eager: true })

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
        title: 'Ningbo · Jardim Botanico',
        icon: { type: 'emoji', value: '🌼' },
        description: 'Era o comeco da primavera, entao fui ver as cerejeiras.',
        date: '2026-03-07',
        travel: '',
        cases: getCases('2026-03-07-botanicalGarden', 'Cerejeiras no jardim botanico no comeco da primavera', ['3x4', '3x4', '3x4', '3x4', '3x4', '3x4']),
      },
      {
        title: 'Perto de Casa',
        icon: { type: 'emoji', value: '🖼️' },
        description: 'Voltei para casa no feriado, dei uma volta e aproveitei o conforto de estar por perto.',
        date: '2026-02-20',
        travel: '',
        cases: getCases('2026-02-20-hometown', 'Uma caminhada tranquila perto de casa', ['4x3', '4x3', '4x3', '4x3', '4x3', '4x3']),
      },
      {
        title: 'Ningbo · Passeio com um Colega',
        icon: { type: 'emoji', value: '🎲' },
        description:
          'Um colega veio para Ningbo no fim de semana. Visitamos a antiga escola e um cafe de jogos. Gostei muito das borboletas preservadas e, mesmo sem jogar muito, Salem 1692 foi especialmente divertido.',
        date: '2026-01-10',
        travel: '',
        cases: getCases('2026-01-10-classmate', 'Um passeio em Ningbo com um colega', ['4x5', '4x5', '4x5', '4x5']),
      },
      {
        title: 'App Dazz',
        icon: { type: 'emoji', value: '🏙️' },
        description: 'Registrei alguns visuais com o app Dazz e o resultado ficou muito bom.',
        date: '2025-12-11',
        travel: '',
        cases: getCases('2025-12-11-dazz', 'App Dazz', ['4x3', '4x3']),
      },
      {
        title: 'Um Gato Fofo na Casa de um Amigo',
        icon: { type: 'emoji', value: '🐈' },
        description: 'Fofo demais. Um gato realmente excelente.',
        date: '2025-06-21',
        travel: '',
        cases: getCases('2025-06-21-cat', 'Um gato fofo na casa de um amigo', ['4x3', '4x3', '4x3', '4x3', '4x3', '4x3']),
      },
      {
        title: 'Ningbo · Lago Dongqian',
        icon: { type: 'emoji', value: '🚴' },
        description: 'Pedalei ao redor do lago Dongqian. Minhas pernas reclamaram, mas a paisagem compensou.',
        date: '2025-03-01',
        travel: '',
        cases: getCases('2025-03-01-dongqianhu', 'Ningbo · Lago Dongqian', ['4x5', '1x1', '4x3']),
      },
      {
        title: 'Ningbo · Zhoushan',
        icon: { type: 'emoji', value: '🏞️' },
        description: '',
        date: '2024-09-07',
        travel: '',
        cases: getCases('2024-09-07-zhoushan', 'Ningbo · Zhoushan', ['4x3', '4x3']),
      },
    ]
  }

  return [
    {
      title: 'Ningbo · Botanical Garden',
      icon: { type: 'emoji', value: '🌼' },
      description: 'It was early spring, so I went to see the cherry blossoms.',
      date: '2026-03-07',
      travel: '',
      cases: getCases('2026-03-07-botanicalGarden', 'Early spring cherry blossoms at the botanical garden', ['3x4', '3x4', '3x4', '3x4', '3x4', '3x4']),
    },
    {
      title: 'Around Home',
      icon: { type: 'emoji', value: '🖼️' },
      description: 'I went home for the holiday, wandered around a bit, and enjoyed the comfort of home.',
      date: '2026-02-20',
      travel: '',
      cases: getCases('2026-02-20-hometown', 'A relaxed walk around home', ['4x3', '4x3', '4x3', '4x3', '4x3', '4x3']),
    },
    {
      title: 'Ningbo · Day Out with a Classmate',
      icon: { type: 'emoji', value: '🎲' },
      description:
        'A classmate came to Ningbo for the weekend. We visited our old school and a board game cafe. I loved the butterfly specimens there, and even though I do not usually play board games, Salem 1692 was especially fun. We talked a lot and had a great time.',
      date: '2026-01-10',
      travel: '',
      cases: getCases('2026-01-10-classmate', 'A day out in Ningbo with a classmate', ['4x5', '4x5', '4x5', '4x5']),
    },
    {
      title: 'Dazz App',
      icon: { type: 'emoji', value: '🏙️' },
        description: 'I captured a few visuals with the Dazz camera app, and the results were pretty good.',
      date: '2025-12-11',
      travel: '',
      cases: getCases('2025-12-11-dazz', 'Dazz App', ['4x3', '4x3']),
    },
    {
      title: "A Cute Cat at a Friend's Place",
      icon: { type: 'emoji', value: '🐈' },
      description: 'Way too adorable (*^ω^*). Truly an excellent cat.',
      date: '2025-06-21',
      travel: '',
      cases: getCases('2025-06-21-cat', "A cute cat at a friend's place", ['4x3', '4x3', '4x3', '4x3', '4x3', '4x3']),
    },
    {
      title: 'Ningbo · Dongqian Lake',
      icon: { type: 'emoji', value: '🚴' },
      description: 'I biked around Dongqian Lake. My legs cramped a few times, but the scenery was beautiful.',
      date: '2025-03-01',
      travel: '',
      cases: getCases('2025-03-01-dongqianhu', 'Ningbo · Dongqian Lake', ['4x5', '1x1', '4x3']),
    },
    {
      title: 'Ningbo · Zhoushan',
      icon: { type: 'emoji', value: '🏞️' },
      description: '',
      date: '2024-09-07',
      travel: '',
      cases: getCases('2024-09-07-zhoushan', 'Ningbo · Zhoushan', ['4x3', '4x3']),
    },
  ]
}
