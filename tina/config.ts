import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Set these in a local .env file or CI environment when you connect TinaCloud.
  clientId:
    process.env.PUBLIC_TINA_CLIENT_ID || process.env.TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",

  search: {
    tina: {
      indexerToken: process.env.TINA_SEARCH_TOKEN || "",
      stopwordLanguages: ["deu"],
    },
    indexBatchSize: 100,
    maxSearchIndexFieldLength: 100,
  },

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "post",
        label: "Beiträge",
        path: "src/content/posts",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Titel",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Beschreibung",
            ui: {
              component: "textarea",
            },
            required: true,
          },
          {
            type: "datetime",
            name: "date",
            label: "Veroeffentlichungsdatum",
            required: true,
          },
          {
            type: "boolean",
            name: "published",
            label: "Veroeffentlicht",
            required: false,
          },
          {
            type: "boolean",
            name: "draft",
            label: "Entwurf",
            required: false,
          },
          {
            type: "boolean",
            name: "featured",
            label: "Hervorgehoben",
            required: false,
          },
          {
            type: "string",
            name: "author",
            label: "Verfasser",
            required: false,
          },
          {
            type: "image",
            name: "image",
            label: "Titelbild",
            required: false,
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
            description: "Optionaler URL-Slug mit fuehrendem Slash, z. B. /witr.",
            required: false,
          },
          {
            type: "string",
            name: "postslug",
            label: "Legacy Post-Slug",
            description: "Optionales Alt-Feld fuer den URL-Slug.",
            required: false,
          },
          {
            type: "string",
            list: true,
            name: "category",
            label: "Kategorien",
            required: false,
          },
          {
            type: "string",
            list: true,
            name: "tags",
            label: "Schlagwoerter",
          },
          {
            type: "string",
            name: "type",
            label: "Legacy Typ",
            required: false,
          },
          {
            type: "string",
            list: true,
            name: "post_format",
            label: "Legacy Post-Format",
            required: false,
          },
          {
            type: "string",
            list: true,
            name: "timeline_notification",
            label: "Legacy Timeline Notification",
            required: false,
          },
          {
            type: "rich-text",
            label: "Inhalt",
            name: "body",
            isBody: true,
          },
        ],
        ui: {
          router: ({ document }) => {
            const rawSlug =
              document.slug || document.postslug || document._sys.filename;
            const normalized = String(rawSlug).replace(/^\/+|\/+$/g, "");
            return `/${normalized}`;
          },
          itemProps: (item) => {
            const status = item.draft
              ? "📝 Entwurf"
              : item.published === false
                ? "🔒 Unveröffentlicht"
                : "✅ Veröffentlicht";
            const cats =
              Array.isArray(item.category) && item.category.length > 0
                ? ` · ${item.category.join(", ")}`
                : "";
            const date = item.date
              ? ` · ${new Date(item.date).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })}`
              : "";
            return {
              label: `${item.title || item._sys?.filename || "—"}  [${status}${cats}${date}]`,
            };
          },
        },
      },
    ],
  },
});
