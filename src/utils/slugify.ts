import { slug as slugger } from "github-slugger";
import type { CollectionEntry } from "astro:content";

export const slugifyStr = (str: string) => slugger(str);

type PostEntry = CollectionEntry<"posts">;
type PostData = PostEntry["data"];

const normalizeSlugValue = (value?: string) =>
  value ? value.replace(/^\/+|\/+$/g, "") : undefined;

const slugify = (post: PostEntry | PostData) => {
  const explicitSlug =
    "data" in post
      ? normalizeSlugValue(post.slug) || normalizeSlugValue(post.data.postslug)
      : normalizeSlugValue(post.postslug);

  const title = "data" in post ? post.data.title : post.title;

  return explicitSlug ? slugger(explicitSlug) : slugger(title);
};

export const slugifyAll = (arr: string[]) => arr.map(str => slugifyStr(str));

export default slugify;
