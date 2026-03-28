import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    lastmod: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    summary: z.string().optional(),
    images: z.array(z.string()).optional(),
    authors: z.array(z.string()).optional(),
    layout: z.string().default('PostLayout'),
    bibliography: z.string().optional(),
    canonicalUrl: z.string().optional(),
  }),
})

const authors = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    avatar: z.string().optional(),
    occupation: z.string().optional(),
    company: z.string().optional(),
    email: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    layout: z.string().optional(),
  }),
})

export const collections = { blog, authors }
