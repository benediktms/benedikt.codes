import { z, defineCollection } from "astro:content";

const postsCollectionSchema = z.object({
  title: z.string(),
  pubDate: z.date(),
  description: z.string().optional(),
  image: z
    .object({
      url: z.string(),
      alt: z.string(),
    })
    .optional(),
  tags: z.array(z.enum(["rust", "typescript"])),
});

export type PostsCollection = z.infer<typeof postsCollectionSchema>;

const postsCollection = defineCollection({
  type: "content",
  schema: postsCollectionSchema,
});

export const collections = {
  blog: postsCollection,
};
