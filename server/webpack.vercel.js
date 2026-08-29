/**
 * Webpack configuration for Vercel Serverless
 * Bundles the entire NestJS application for serverless deployment
 */
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: './src/vercel-entry.ts',
  target: 'node',
  output: {
    // Output directly as the Vercel serverless function (api/index.js).
    path: path.resolve(__dirname, 'api'),
    filename: 'index.js',
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@prisma/client$': path.resolve(__dirname, '.prisma-deploy', 'client', 'index.js'),
      // Optional NestJS subpackages not used by this app (only referenced by @nestjs/core).
      '@nestjs/websockets/socket-module': path.resolve(__dirname, 'stubs', 'empty.js'),
      '@nestjs/microservices/microservices-module': path.resolve(__dirname, 'stubs', 'empty.js'),
      '@nestjs/microservices': path.resolve(__dirname, 'stubs', 'empty.js'),
    },
    fallback: {
      'class-transformer/storage': path.resolve(
        __dirname,
        'node_modules',
        'class-transformer',
        'cjs',
        'storage.js'
      ),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            compilerOptions: {
              rootDir: '.',
            },
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  // NOTE: keep the bundle self-contained. Externalizing @nestjs/*/express
  // breaks the Vercel function because nft cannot trace requires inside the
  // dynamically-loaded bundle, so node_modules is missing at runtime → 405.
  externals: {},
  node: {
    __dirname: false,
    __filename: false,
  },
};
