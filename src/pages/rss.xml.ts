import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context: any) {
  const posts = await getCollection("blog");

  return rss({
    title: "benedikt.codes",
    description: "Personal blog about tech and other things",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/posts/${post.filePath}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
