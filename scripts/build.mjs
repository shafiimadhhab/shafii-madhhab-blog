import { spawnSync } from "node:child_process";

const clientId =
  process.env.PUBLIC_TINA_CLIENT_ID || process.env.TINA_CLIENT_ID || "";
const token = process.env.TINA_TOKEN || "";

const missing = [];

if (!clientId) {
  missing.push("PUBLIC_TINA_CLIENT_ID (or TINA_CLIENT_ID)");
}

if (!token) {
  missing.push("TINA_TOKEN");
}

if (missing.length > 0) {
  console.error("");
  console.error("TinaCMS production build is not configured.");
  console.error(`Missing: ${missing.join(", ")}`);
  console.error("");
  console.error("Add these values in your deployment environment, then redeploy.");
  console.error(
    "Cloudflare: Workers & Pages -> your project -> Settings -> Environment variables"
  );
  console.error("");
  process.exit(1);
}

const env = {
  ...process.env,
  PUBLIC_TINA_CLIENT_ID: clientId,
};

const pnpmCommand = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

const run = (args) => {
  const result = spawnSync(pnpmCommand, args, {
    stdio: "inherit",
    env,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

run(["exec", "tinacms", "build"]);
run(["exec", "astro", "build"]);
