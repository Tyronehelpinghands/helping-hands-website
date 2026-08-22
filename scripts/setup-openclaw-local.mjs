/**
 * Eenmalige lokale OpenClaw-koppeling voor Helping Hands.
 * Run vanuit de website-root:
 *   node scripts/setup-openclaw-local.mjs
 *
 * Schrijft hooks.token (apart van het Gateway-token) en vult .env.local.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ocPath = path.join(os.homedir(), ".openclaw", "openclaw.json");
const hooksFile = path.join(os.homedir(), ".openclaw", "hooks.token");
const envPath = path.join(process.cwd(), ".env.local");

if (!fs.existsSync(ocPath)) {
  console.error("Geen ~/.openclaw/openclaw.json gevonden.");
  process.exit(1);
}

const cfg = JSON.parse(fs.readFileSync(ocPath, "utf8"));
const gatewayToken = String(cfg.gateway?.auth?.token ?? "");
let hooksToken = String(cfg.hooks?.token ?? "");
if (!hooksToken || hooksToken === gatewayToken) {
  hooksToken = crypto.randomBytes(24).toString("hex");
}

cfg.hooks = {
  ...(cfg.hooks ?? {}),
  enabled: true,
  path: "/hooks",
  token: hooksToken,
  defaultSessionKey: "hook:helping-hands-website",
  allowedAgentIds: ["main"],
};

fs.writeFileSync(ocPath, `${JSON.stringify(cfg, null, 2)}\n`);
fs.writeFileSync(hooksFile, hooksToken);

let env = "";
try {
  env = fs.readFileSync(envPath, "utf8");
} catch {
  env = "";
}
const lines = env.split(/\r?\n/);
function setEnv(key, value) {
  const row = `${key}=${value}`;
  const index = lines.findIndex((line) => line.startsWith(`${key}=`));
  if (index >= 0) lines[index] = row;
  else lines.push(row);
}
setEnv("OPENCLAW_GATEWAY_URL", "http://127.0.0.1:18789");
setEnv("OPENCLAW_HOOKS_TOKEN", hooksToken);
setEnv("OPENCLAW_AGENT_ID", "main");
setEnv("OPENCLAW_CONTACT_FORWARD", "true");
fs.writeFileSync(envPath, `${lines.filter((line, i, arr) => !(line === "" && arr[i - 1] === "")).join("\n").replace(/\n*$/, "")}\n`);

console.log("OpenClaw hooks ingeschakeld.");
console.log("Website .env.local bijgewerkt (OPENCLAW_*).");
console.log("Herstart daarna: OpenClaw Gateway + next dev.");
console.log("Start Gateway: node C:\\HelpingHandsAI\\openclaw\\openclaw.mjs gateway run");
