/**
 * Cloudflare Worker that serves the static Astro build and generated Tina admin.
 */

export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
