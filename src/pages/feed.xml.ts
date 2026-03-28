import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import siteMetadata from '../data/siteMetadata'

export async function GET(context: any) {
  const posts = await getCollection('blog', ({ data }) => data.draft !== true)
  const sorted = posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())

  return rss({
    title: siteMetadata.title,
    description: siteMetadata.description,
    site: context.site || siteMetadata.siteUrl,
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary || '',
      link: `/blog/${post.slug}/`,
    })),
  })
}
