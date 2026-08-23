/**
 * Vercel Serverless Function Entry Point
 *
 * Vercel 识别 server/api/index.js 为 api/index 函数
 * 委托给编译后的 NestJS vercelHandler 处理请求
 */

const path = require('path');

// 获取编译后的 NestJS main.js 路径
const mainPath = path.resolve(__dirname, '..', 'dist', 'main');

// 加载 NestJS vercelHandler
let vercelHandler;
try {
  const main = require(mainPath);
  vercelHandler = main.default || main;

  if (typeof vercelHandler !== 'function') {
    throw new Error('vercelHandler is not a function');
  }
} catch (error) {
  console.error('Failed to load NestJS handler:', error.message);
  vercelHandler = (req, res) => {
    res.status(500).json({
      statusCode: 500,
      message: 'Failed to initialize NestJS application',
      error: error.message,
    });
  };
}

// Vercel Serverless Handler Export
module.exports = async function handler(req, res) {
  try {
    await vercelHandler(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
};
