/**
 * Cloudflare Worker — GitHub OAuth handler for Decap CMS
 *
 * Routes handled:
 *   GET /auth      — redirects the browser to GitHub's OAuth authorization page
 *   GET /callback  — exchanges the OAuth code for an access token and posts it
 *                    back to the Decap CMS window via postMessage
 *
 * All other requests are served from the static Astro build (./dist) via the
 * ASSETS binding configured in wrangler.jsonc.
 *
 * Required secrets (set with `wrangler secret put`):
 *   GITHUB_CLIENT_ID
 *   GITHUB_CLIENT_SECRET
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ── /auth ──────────────────────────────────────────────────────────────────
    // Kick off the GitHub OAuth flow by redirecting to GitHub's authorization URL.
    if (url.pathname === "/auth") {
      const params = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        scope: "repo,user",
        state: "decap",
      });
      return Response.redirect(
        `https://github.com/login/oauth/authorize?${params}`,
        302
      );
    }

    // ── /callback ──────────────────────────────────────────────────────────────
    // GitHub redirects here after the user authorizes. Exchange the code for a
    // token and post it back to the Decap CMS opener window.
    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");

      if (!code) {
        return new Response("Missing code parameter", { status: 400 });
      }

      // Exchange the authorization code for an access token.
      const tokenResponse = await fetch(
        "https://github.com/login/oauth/access_token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            client_id: env.GITHUB_CLIENT_ID,
            client_secret: env.GITHUB_CLIENT_SECRET,
            code,
          }),
        }
      );

      const tokenData = await tokenResponse.json();

      if (tokenData.error) {
        return new Response(
          `OAuth error: ${tokenData.error_description || tokenData.error}`,
          { status: 400 }
        );
      }

      const token = tokenData.access_token;

      // Build the postMessage payload that Decap CMS expects.
      // Format: "authorization:github:success:<json>"
      const payload =
        "authorization:github:success:" +
        JSON.stringify({ token, provider: "github" });

      // JSON.stringify the whole payload so it becomes a safe JS string literal
      // we can embed inside the script tag below.
      const safePayload = JSON.stringify(payload);

      const html = `<!DOCTYPE html>
<html>
  <head><meta charset="utf-8" /></head>
  <body>
    <p>Authentifizierung erfolgreich. Dieses Fenster schließt sich gleich...</p>
    <script>
      (function () {
        function receiveMessage(e) {
          window.opener.postMessage(${safePayload}, e.origin);
        }
        window.addEventListener("message", receiveMessage, false);
        // Tell the opener we are ready; it will reply with a message that
        // triggers receiveMessage above.
        window.opener.postMessage("authorizing:github", "*");
      })();
    </script>
  </body>
</html>`;

      return new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // ── Static assets ──────────────────────────────────────────────────────────
    // All other requests are served from the Astro build output (./dist).
    return env.ASSETS.fetch(request);
  },
};
