const siteMetadata = {
  title: 'Domokos Tar - Home',
  author: 'Domokos Tar',
  headerTitle: 'Domokos Tar',
  description:
    "I record things here, that I've learned on the way, and a place to explore things!",
  language: 'en-us',
  theme: 'system',
  siteUrl: 'https://domokostar.net/',
  siteRepo: 'https://github.com/domokost/tailwind-nextjs-starter-blog',
  siteLogo: '/static/images/logo.png',
  image: '/static/images/avatar.png',
  socialBanner: '/static/images/twitter-card.png',
  email: 'domokos@tar.io',
  github: 'https://github.com/domokost',
  twitter: 'https://twitter.com/domokost',
  facebook: '',
  youtube: '',
  linkedin: 'https://www.linkedin.com/in/domokost',
  locale: 'en-US',
  analytics: {
    plausibleDataDomain: '',
    simpleAnalytics: false,
    umamiWebsiteId: '',
    posthogProjectApiKey: '',
    googleAnalyticsId: '',
  },
  newsletter: {
    provider: 'convertkit',
  },
  comments: {
    provider: 'giscus',
    giscusConfig: {
      repo: import.meta.env.PUBLIC_GISCUS_REPO || '',
      repositoryId: import.meta.env.PUBLIC_GISCUS_REPOSITORY_ID || '',
      category: import.meta.env.PUBLIC_GISCUS_CATEGORY || '',
      categoryId: import.meta.env.PUBLIC_GISCUS_CATEGORY_ID || '',
      mapping: 'pathname',
      reactions: '1',
      metadata: '0',
      theme: 'preferred_color_scheme',
      darkTheme: 'transparent_dark',
      themeURL: '',
      lang: 'en',
    },
  },
}

export default siteMetadata
