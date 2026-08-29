import 'reflect-metadata';
import * as fs from 'fs';
import * as path from 'path';
import vercelHandler from './main';

/**
 * Vercel serverless entry — bundles into a single self-contained
 * `api/index.js` function via webpack. No dynamic requires at runtime, so
 * Vercel's nft tracing can bundle everything and the function works without
 * node_modules being separately shipped.
 */

// Point Prisma at the RHEL query engine shipped in .prisma-deploy (git-tracked).
const engine = path.join(
  __dirname,
  '..',
  '.prisma-deploy',
  'client',
  'libquery_engine-rhel-openssl-3.0.x.so.node',
);
if (!process.env.PRISMA_QUERY_ENGINE_BINARY && fs.existsSync(engine)) {
  process.env.PRISMA_QUERY_ENGINE_BINARY = engine;
}

function setCors(res: any): void {
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

const handler = async (req: any, res: any): Promise<void> => {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  return vercelHandler(req, res);
};

export default handler;
