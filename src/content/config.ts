import { z, defineCollection } from "astro:content";

const blogSchema = z.object({
  title: z.string(),
  pubDate: z.date(),
  description: z.string().optional(),
  image: z
    .object({
      url: z.string(),
      alt: z.string(),
    })
    .optional(),
  tags: z.array(z.enum(["rust", "typescript", "svelte", "tailwindcss"])),
});

export type PostsCollection = z.infer<typeof blogSchema>;

const blog = defineCollection({
  type: "content",
  schema: blogSchema,
});

export const collections = { blog };
