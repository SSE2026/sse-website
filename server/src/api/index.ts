/**
 * Vercel Serverless Entry Point
 *
 * Must be inside src/ so NestJS builder includes it in dist/.
 * Compiled to dist/api/index.js, picked up by Vercel as the serverless function.
 * Import path '../main' resolves to dist/main.js (same build output).
 */
// Re-export the handler from the compiled NestJS app.
// Use __dirname-aware require to work after NestJS copies this file.
const path = require('path');
const handler = require(path.resolve(process.cwd(), 'dist', 'main'));
export default handler.default;
