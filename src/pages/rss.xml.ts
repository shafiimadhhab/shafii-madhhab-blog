import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import getSortedPosts from "@utils/getSortedPosts";
import slugify from "@utils/slugify";
import { SITE } from "@config";

export async function GET() {
  const posts = await getCollection("posts");
  const sortedPosts = getSortedPosts(posts);
  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: sortedPosts.map(post => ({
      link: `posts/${slugify(post)}`,
      title: post.data.title,
      description: post.data.description,
      pubDate: new Date(post.data.date),
    })),
  });
}
