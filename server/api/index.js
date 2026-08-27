/**
 * Vercel Serverless Entry Point — Swift Safe Energy API
 *
 * Loads the prebuilt NestJS bundle (server/dist/api/index.js) and forwards
 * every incoming Vercel request to it. The bundle is produced by:
 *
 *     npm run build:vercel
 *
 * which runs `webpack --config webpack.vercel.js` and emits a single
 * UMD module at `dist/api/index.js`. That module's default export is the
 * `vercelHandler` defined in `src/main.ts`, which:
 *   1. Bootstraps the full NestJS application (AppModule)
 *   2. Configures global /v1 prefix, CORS, ValidationPipe, Swagger
 *   3. Hands the underlying Express instance off to the Vercel req/res
 *
 * Authentication and JWT signing are 100% delegated to NestJS
 * (AuthService.login → Prisma → bcrypt → JwtModule). There are NO
 * hardcoded credentials in this file.
 *
 * Environment variables expected on Vercel (sse-api project):
 *   DATABASE_URL                Neon PostgreSQL connection string
 *   JWT_SECRET                  HMAC secret for signing access tokens
 *   CORS_ORIGIN                 Allowed origin (e.g. https://sse-website.vercel.app)
 *   FRONTEND_URL                Fallback if CORS_ORIGIN is unset
 *   CLOUDINARY_CLOUD_NAME       Cloudinary cloud (for media uploads)
 *   CLOUDINARY_API_KEY          Cloudinary API key
 *   CLOUDINARY_API_SECRET       Cloudinary API secret
 */

const path = require('path');
const fs = require('fs');

const REPO_ROOT = path.resolve(__dirname, '..');
const BUNDLE_PATH = path.join(REPO_ROOT, 'dist', 'api', 'index.js');
const PRISMA_DEPLOY_DIR = path.join(REPO_ROOT, '.prisma-deploy', 'client');
const PRISMA_ENGINE_RHEL = path.join(
  PRISMA_DEPLOY_DIR,
  'libquery_engine-rhel-openssl-3.0.x.so.node',
);

// ---------------------------------------------------------------------------
// 1. Pre-flight: make sure the bundle exists, fail loudly otherwise.
// ---------------------------------------------------------------------------
if (!fs.existsSync(BUNDLE_PATH)) {
  // Provide a clear diagnostic instead of a generic 500 from Vercel.
  // Returning a function keeps this module signature-stable for Vercel.
  module.exports = async function missingBundle(_req, res) {
    res.status(500).json({
      error: 'NestJS bundle not found',
      hint:
        'Run `npm run build:vercel` inside server/ before deploying. ' +
        'The expected artifact is ' + BUNDLE_PATH,
    });
  };
  return;
}

// ---------------------------------------------------------------------------
// 2. Point Prisma at the deployed query engine binary.
//    The NestJS bundle inlines @prisma/client and reads PRISMA_QUERY_ENGINE_BINARY
//    at runtime to locate the native engine. We ship the rhel-openssl-3.0.x
//    engine inside `.prisma-deploy/client/`, which is the matching Vercel
//    (Amazon Linux 2 / AL2023) build target.
// ---------------------------------------------------------------------------
if (!process.env.PRISMA_QUERY_ENGINE_BINARY && fs.existsSync(PRISMA_ENGINE_RHEL)) {
  process.env.PRISMA_QUERY_ENGINE_BINARY = PRISMA_ENGINE_RHEL;
}

// ---------------------------------------------------------------------------
// 3. Lightweight CORS preflight at the edge. The full CORS policy is also
//    configured inside NestJS via `app.enableCors(...)` in src/main.ts, but
//    handling OPTIONS here shaves a cold-start round-trip.
// ---------------------------------------------------------------------------
function setCors(res) {
  const origin =
    process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With',
  );
  res.setHeader('Access-Control-Max-Age', '86400');
}

// ---------------------------------------------------------------------------
// 4. Load the NestJS bundle (UMD, default export = vercelHandler).
// ---------------------------------------------------------------------------
const bundle = require(BUNDLE_PATH);
const nestHandler =
  (bundle && (bundle.default || bundle.vercelHandler || bundle)) ||
  (() => {
    throw new Error('NestJS bundle did not export a handler function');
  });

// ---------------------------------------------------------------------------
// 5. Vercel entry: short-circuit OPTIONS, otherwise delegate to NestJS.
// ---------------------------------------------------------------------------
module.exports = async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  return nestHandler(req, res);
};
