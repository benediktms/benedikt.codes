import { z, defineCollection } from "astro:content";

const postsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string().nullish(),
    image: z
      .object({
        url: z.string(),
        alt: z.string(),
      })
      .nullish(),
    tags: z.array(z.enum(["rust", "typescript"])),
  }),
});

export const collections = {
  blog: postsCollection,
};
