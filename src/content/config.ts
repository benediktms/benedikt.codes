import { glob } from "astro/loaders";
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
  tags: z.array(
    z.enum(["rust", "typescript", "svelte", "tailwindcss", "algorithms"]),
  ),
});

export type PostsCollection = z.infer<typeof blogSchema>;

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: blogSchema,
});

export const collections = { blog };
