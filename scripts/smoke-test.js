/**
 * Post-Deployment Automated Smoke Test Script
 * Run against deployed environment (e.g. node scripts/smoke-test.js https://site-time.vercel.app)
 */
const http = require("http");
const https = require("https");

const baseUrl = process.argv[2] || "http://localhost:3000";

console.log(`🚀 Running Post-Deploy Smoke Tests against: ${baseUrl}`);

const endpoints = [
  { path: "/api/health", expectedStatus: 200, label: "Health Check Endpoint" },
  { path: "/api/ready", expectedStatus: [200, 503], label: "Readiness Check Endpoint" },
  { path: "/api/version", expectedStatus: 200, label: "Version Check Endpoint" },
  { path: "/", expectedStatus: 200, label: "Landing Page" },
  { path: "/vagas", expectedStatus: 200, label: "Public Vitrine / Vagas Page" },
  { path: "/dashboard", expectedStatus: [200, 302, 307], label: "Protected Dashboard Route (Redirect/Auth)" },
];

let passed = 0;
let failed = 0;

async function checkEndpoint(item) {
  return new Promise((resolve) => {
    const url = new URL(item.path, baseUrl);
    const client = url.protocol === "https:" ? https : http;

    const req = client.get(url, (res) => {
      const allowedStatuses = Array.isArray(item.expectedStatus) ? item.expectedStatus : [item.expectedStatus];
      if (allowedStatuses.includes(res.statusCode)) {
        console.log(`  ✅ [PASS] ${item.label} (${item.path}) -> Status ${res.statusCode}`);
        passed++;
      } else {
        console.error(`  ❌ [FAIL] ${item.label} (${item.path}) -> Expected ${item.expectedStatus}, got ${res.statusCode}`);
        failed++;
      }
      resolve();
    });

    req.on("error", (err) => {
      console.error(`  ❌ [FAIL] ${item.label} (${item.path}) -> Request Error: ${err.message}`);
      failed++;
      resolve();
    });

    req.setTimeout(5000, () => {
      req.destroy();
      console.error(`  ❌ [FAIL] ${item.label} (${item.path}) -> Timeout (5000ms)`);
      failed++;
      resolve();
    });
  });
}

async function run() {
  for (const item of endpoints) {
    await checkEndpoint(item);
  }

  console.log("\n==========================================");
  console.log(`📊 Smoke Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log("==========================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

run();
