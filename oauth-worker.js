const CLIENT_ID = "Ov23lixSUuT8gXi179Dk";
const CLIENT_SECRET = "8b221c3da005727789fc1409f405fa9b561547fb";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/auth") {
      return Response.redirect(
        `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo`,
        302
      );
    }

    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      const response = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code }),
      });
      const data = await response.json();
      const token = data.access_token;

      if (!token) {
        return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
      }

      return new Response(
        `<script>
          window.opener.postMessage(
            'authorization:github:success:{"token":"${token}","provider":"github"}',
            '*'
          );
          window.close();
        </script>`,
        { headers: { "Content-Type": "text/html" } }
      );
    }

    return new Response("Not found", { status: 404 });
  }
};