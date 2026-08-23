// Vercel Serverless Handler Entry Point
const main = require('./main');

// Export the default handler from main.js
module.exports = main.default;
module.exports.default = main.default;
