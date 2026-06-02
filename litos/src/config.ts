import type {
  AnalyticsConfig,
  CasesConfig,
  CommentConfig,
  GithubConfig,
  Link,
  PostConfig,
  ProjectConfig,
  Site,
  SkillsShowcaseConfig,
  SocialLink,
  TagsConfig,
} from '~/types'
import { loadSiteData } from './lib/load-site-data'
import { defaultSiteLocale, type SiteLocale, withLocalePath } from './lib/i18n'

type NewSiteConfig = {
  title: string
  description: string
  introduce: string
  sessionInvalidPrefixLabel: string
  sessionInvalidLinkLabel: string
  existingSiteLabel: string
  existingSiteLinkLabel: string
  checkoutSelfLinkLabel: string
  checkoutCustomerLinkLabel: string
}

type MySiteConfig = {
  title: string
  description: string
  introduce: string
  sessionInvalidPrefixLabel: string
  sessionInvalidLinkLabel: string
  appCardLabel: string
  appCardLinkLabel: string
}

type HomeConfig = {
  title: string
  subtitle: string
  intro: string
  socialLabel: string
  gmnReportLabel: string
  sitesTitle: string
  sitesDescription: string
  skillsTitle: string
  skillsDescription: string
  skillsSubheading: string
  pageSpeedScores: {
    performance: string
    accessibility: string
    bestPractices: string
    seo: string
  }
  postsTitle: string
  pinnedLabel: string
  recentLabel: string
  postsSummary: (count: number, isPinned: boolean) => string
}

type UiConfig = {
  rssFeedLabel: string
  languageSwitcherLabel: string
  languageOptionEnglish: string
  languageOptionPortuguese: string
  githubSourceLabel: string
  searchLabel: string
  searchTitle: string
  searchPlaceholder: string
  searchExact: string
  searchTypePrompt: string
  searchNoResults: string
  searchNoResultsDev: string
  commentsTitle: string
  tagsTotal: (count: number) => string
  postsTotal: (count: number) => string
  tagsEmpty: string
  tagBackLabel: string
  taggedPosts: (count: number) => string
  projectsStars: string
  projectsForks: string
  projectsWebsite: string
  projectsGithub: string
  casesEmpty: string
  backToTop: string
  recommendedPostTitle: string
  viewPostsTaggedWith: (tag: string) => string
  socialAriaLabel: (name: string) => string
  heatmapDateLocale: string
  heatmapDateFormat: 'long' | 'numeric' | 'dot' | 'long-pt'
  heatmapRestDay: string
  heatmapSiteSingular: string
  heatmapSitePlural: string
}

type LocaleConfig = {
  SITE: Site
  HEADER_LINKS: Link[]
  FOOTER_LINKS: Link[]
  SOCIAL_LINKS: SocialLink[]
  SKILLSSHOWCASE_CONFIG: SkillsShowcaseConfig
  GITHUB_CONFIG: GithubConfig
  POSTS_CONFIG: PostConfig
  COMMENT_CONFIG: CommentConfig
  TAGS_CONFIG: TagsConfig
  PROJECTS_CONFIG: ProjectConfig
  CASES_CONFIG: CasesConfig
  NEW_SITE_CONFIG: NewSiteConfig
  MY_SITE_CONFIG: MySiteConfig
  ANALYTICS_CONFIG: AnalyticsConfig
  HOME_CONFIG: HomeConfig
  UI: UiConfig
}

const SITE_SHARED = {
  website: 'https://litos.vercel.app/',
  base: '/',
  author: 'Spotren',
  ogImage: '/og-image.webp',
  transition: false,
  themeAnimation: true,
} as const

const SHARED_SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'github',
    url: 'https://github.com/Spotren',
    icon: 'icon-[ri--github-fill]',
    count: 24,
  },
  {
    name: 'linkedin',
    url: 'https://www.linkedin.com/company/spotren/about/',
    icon: 'icon-[ri--linkedin-fill]',
  },
  {
    name: 'instagram',
    url: 'https://www.instagram.com/ndex.br/',
    icon: 'icon-[ri--instagram-line]',
  },
]

const SKILLSSHOWCASE_CONFIG: SkillsShowcaseConfig = {
  SKILLS_ENABLED: true,
  SKILLS_DATA: [
    {
      direction: 'left',
      skills: [
        { name: 'JavaScript', icon: 'icon-[skill-icons--javascript]', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
        { name: 'CSS', icon: 'icon-[skill-icons--css]', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
        { name: 'HTML', icon: 'icon-[skill-icons--html]', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
        { name: 'TypeScript', icon: 'icon-[skill-icons--typescript]', url: 'https://www.typescriptlang.org/' },
        { name: 'Sass', icon: 'icon-[skill-icons--sass]', url: 'https://sass-lang.com/' },
        { name: 'Ubuntu', icon: 'icon-[skill-icons--ubuntu-dark]', url: 'https://ubuntu.com/' },
        { name: 'Git', icon: 'icon-[skill-icons--git]', url: 'https://git-scm.com/' },
      ],
    },
    {
      direction: 'right',
      skills: [
        { name: 'Astro', icon: 'icon-[skill-icons--astro]', url: 'https://astro.build/' },
        { name: 'Node.js', icon: 'icon-[skill-icons--nodejs-dark]', url: 'https://nodejs.org/' },
        { name: 'React', icon: 'icon-[skill-icons--react-dark]', url: 'https://react.dev/' },
        { name: 'Tailwind CSS', icon: 'icon-[skill-icons--tailwindcss-dark]', url: 'https://tailwindcss.com/' },
        { name: 'Vercel', icon: 'icon-[skill-icons--vercel-dark]', url: 'https://vercel.com/' },
        { name: 'VS Code', icon: 'icon-[skill-icons--vscode-dark]', url: 'https://code.visualstudio.com/' },
      ],
    },
  ],
}

const GITHUB_CONFIG: GithubConfig = {
  ENABLED: true,
  GITHUB_USERNAME: 'RafyWP',
  TOOLTIP_ENABLED: true,
}

const ANALYTICS_CONFIG: AnalyticsConfig = {
  vercount: {
    enabled: true,
  },
  umami: {
    enabled: false,
    websiteId: 'Your websiteId in umami',
    serverUrl: 'https://cloud.umami.is/script.js',
  },
}

export function getLocaleConfig(locale: SiteLocale = defaultSiteLocale): LocaleConfig {
  const siteData = loadSiteData(locale)

  const SITE: Site = {
    ...SITE_SHARED,
    title: siteData.site.title,
    description: siteData.site.description,
    lang: siteData.site.lang,
  }

  const POSTS_CONFIG: PostConfig = {
    title: siteData.posts.title,
    description: siteData.posts.description,
    introduce: siteData.posts.introduce,
    author: siteData.posts.author,
    homePageConfig: {
      size: 3,
      type: 'minimal',
    },
    postPageConfig: {
      size: 10,
      type: 'image',
      coverLayout: 'right',
    },
    tagsPageConfig: {
      size: 10,
      type: 'time-line',
    },
    ogImageUseCover: false,
    postType: 'metaOnly',
    imageDarkenInDark: true,
    readMoreText: siteData.posts.readMoreText,
    prevPageText: siteData.posts.prevPageText,
    nextPageText: siteData.posts.nextPageText,
    tocText: siteData.posts.tocText,
    backToPostsText: siteData.posts.backToPostsText,
    nextPostText: siteData.posts.nextPostText,
    prevPostText: siteData.posts.prevPostText,
    recommendText: siteData.posts.recommendText,
    wordCountView: true,
  }

  const TAGS_CONFIG: TagsConfig = {
    title: siteData.tags.title,
    description: siteData.tags.description,
    introduce: siteData.tags.introduce,
  }

  const PROJECTS_CONFIG: ProjectConfig = {
    title: siteData.projects.title,
    description: siteData.projects.description,
    introduce: siteData.projects.introduce,
  }

  const CASES_CONFIG: CasesConfig = {
    title: siteData.cases.title,
    description: siteData.cases.description,
    introduce: siteData.cases.introduce,
  }

  const NEW_SITE_CONFIG: NewSiteConfig = {
    title: siteData.newSite.title,
    description: siteData.newSite.description,
    introduce: siteData.newSite.introduce,
    sessionInvalidPrefixLabel: siteData.newSite.sessionInvalidPrefixLabel,
    sessionInvalidLinkLabel: siteData.newSite.sessionInvalidLinkLabel,
    existingSiteLabel: siteData.newSite.existingSiteLabel,
    existingSiteLinkLabel: siteData.newSite.existingSiteLinkLabel,
    checkoutSelfLinkLabel: siteData.newSite.checkoutSelfLinkLabel,
    checkoutCustomerLinkLabel: siteData.newSite.checkoutCustomerLinkLabel,
  }

  const COMMENT_CONFIG: CommentConfig = {
    enabled: true,
    system: 'gitalk',
    gitalk: {
      clientID: import.meta.env.PUBLIC_GITHUB_CLIENT_ID,
      clientSecret: import.meta.env.PUBLIC_GITHUB_CLIENT_SECRET,
      repo: 'gitalk-comment',
      owner: 'RafyWP',
      admin: ['RafyWP'],
      language: siteData.comments.language,
      perPage: 5,
      pagerDirection: 'last',
      createIssueManually: false,
      distractionFreeMode: false,
      enableHotKey: true,
    },
  }

  const HOME_CONFIG: HomeConfig = {
    title: siteData.home.title,
    subtitle: siteData.home.subtitle,
    intro: siteData.home.intro,
    socialLabel: siteData.home.socialLabel,
    gmnReportLabel: siteData.home.gmnReportLabel,
    sitesTitle: siteData.home.sitesTitle,
    sitesDescription: siteData.home.sitesDescription,
    skillsTitle: siteData.home.skillsTitle,
    skillsDescription: siteData.home.skillsDescription,
    skillsSubheading: siteData.home.skillsSubheading,
    pageSpeedScores: siteData.home.pageSpeedScores,
    postsTitle: siteData.home.postsTitle,
    pinnedLabel: siteData.home.pinnedLabel,
    recentLabel: siteData.home.recentLabel,
    postsSummary: (count, isPinned) => {
      if (locale === 'pt') {
        return `${isPinned ? siteData.home.pinnedLabel : siteData.home.recentLabel}: ${count} ${count === 1 ? siteData.ui.postSingular : siteData.ui.postPlural} ${siteData.home.postsSummarySuffix}`
      }

      return `${isPinned ? siteData.home.pinnedLabel : siteData.home.recentLabel} ${count} ${count === 1 ? siteData.ui.postSingular : siteData.ui.postPlural}, ${siteData.home.postsSummarySuffix}`
    },
  }

  const UI: UiConfig = {
    rssFeedLabel: siteData.ui.rssFeedLabel,
    languageSwitcherLabel: siteData.ui.languageSwitcherLabel,
    languageOptionEnglish: siteData.ui.languageOptionEnglish,
    languageOptionPortuguese: siteData.ui.languageOptionPortuguese,
    githubSourceLabel: siteData.ui.githubSourceLabel,
    searchLabel: siteData.ui.searchLabel,
    searchTitle: siteData.ui.searchTitle,
    searchPlaceholder: siteData.ui.searchPlaceholder,
    searchExact: siteData.ui.searchExact,
    searchTypePrompt: siteData.ui.searchTypePrompt,
    searchNoResults: siteData.ui.searchNoResults,
    searchNoResultsDev: siteData.ui.searchNoResultsDev,
    commentsTitle: siteData.ui.commentsTitle,
    tagsTotal: (count) => `${count} ${count === 1 ? siteData.ui.tagSingular : siteData.ui.tagPlural} ${siteData.ui.totalSuffix}`,
    postsTotal: (count) => `${count} ${count === 1 ? siteData.ui.postSingular : siteData.ui.postPlural} ${siteData.ui.totalSuffix}`,
    tagsEmpty: siteData.ui.tagsEmpty,
    tagBackLabel: siteData.ui.tagBackLabel,
    taggedPosts: (count) => `${count} ${count === 1 ? siteData.ui.postSingular : siteData.ui.postPlural}`,
    projectsStars: siteData.ui.projectsStars,
    projectsForks: siteData.ui.projectsForks,
    projectsWebsite: siteData.ui.projectsWebsite,
    projectsGithub: siteData.ui.projectsGithub,
    casesEmpty: siteData.ui.casesEmpty,
    backToTop: siteData.ui.backToTop,
    recommendedPostTitle: siteData.ui.recommendedPostTitle,
    viewPostsTaggedWith: (tag) => `${siteData.ui.viewPostsTaggedWithPrefix} ${tag}`,
    socialAriaLabel: (name) => `${siteData.ui.socialAriaLabelPrefix} ${name}`,
    heatmapDateLocale: siteData.ui.heatmapDateLocale,
    heatmapDateFormat: siteData.ui.heatmapDateFormat,
    heatmapRestDay: siteData.ui.heatmapRestDay,
    heatmapSiteSingular: siteData.ui.heatmapSiteSingular,
    heatmapSitePlural: siteData.ui.heatmapSitePlural,
  }

  const MY_SITE_CONFIG: MySiteConfig = {
    title: siteData.mySite.title,
    description: siteData.mySite.description,
    introduce: siteData.mySite.introduce,
    sessionInvalidPrefixLabel: siteData.mySite.sessionInvalidPrefixLabel,
    sessionInvalidLinkLabel: siteData.mySite.sessionInvalidLinkLabel,
    appCardLabel: siteData.mySite.appCardLabel,
    appCardLinkLabel: siteData.mySite.appCardLinkLabel,
  }

  return {
    SITE,
    HEADER_LINKS: [
      { name: POSTS_CONFIG.title, url: withLocalePath(locale, '/posts') },
    ],
    FOOTER_LINKS: [
      { name: HOME_CONFIG.title, url: withLocalePath(locale, '/') },
      { name: POSTS_CONFIG.title, url: withLocalePath(locale, '/posts') },
      { name: TAGS_CONFIG.title, url: withLocalePath(locale, '/tags') },
    ],
    SOCIAL_LINKS: SHARED_SOCIAL_LINKS,
    SKILLSSHOWCASE_CONFIG,
    GITHUB_CONFIG,
    POSTS_CONFIG,
    COMMENT_CONFIG,
    TAGS_CONFIG,
    PROJECTS_CONFIG,
    CASES_CONFIG,
    NEW_SITE_CONFIG,
    MY_SITE_CONFIG,
    ANALYTICS_CONFIG,
    HOME_CONFIG,
    UI,
  }
}

export const SITE = getLocaleConfig(defaultSiteLocale).SITE
export const HEADER_LINKS = getLocaleConfig(defaultSiteLocale).HEADER_LINKS
export const FOOTER_LINKS = getLocaleConfig(defaultSiteLocale).FOOTER_LINKS
export const SOCIAL_LINKS = SHARED_SOCIAL_LINKS
export { SKILLSSHOWCASE_CONFIG, GITHUB_CONFIG, ANALYTICS_CONFIG }
export const POSTS_CONFIG = getLocaleConfig(defaultSiteLocale).POSTS_CONFIG
export const COMMENT_CONFIG = getLocaleConfig(defaultSiteLocale).COMMENT_CONFIG
export const TAGS_CONFIG = getLocaleConfig(defaultSiteLocale).TAGS_CONFIG
export const PROJECTS_CONFIG = getLocaleConfig(defaultSiteLocale).PROJECTS_CONFIG
export const CASES_CONFIG = getLocaleConfig(defaultSiteLocale).CASES_CONFIG
export const NEW_SITE_CONFIG = getLocaleConfig(defaultSiteLocale).NEW_SITE_CONFIG
