/**
 * Webpack configuration for Vercel Serverless
 * Bundles the entire NestJS application for serverless deployment
 */
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: './src/main.ts',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist', 'api'),
    filename: 'index.js',
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
  resolve: {
    extensions: ['.ts', '.js'],
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
  externals: {
    '@nestjs/core': 'commonjs @nestjs/core',
    '@nestjs/common': 'commonjs @nestjs/common',
    '@nestjs/platform-express': 'commonjs @nestjs/platform-express',
    'express': 'commonjs express',
    'body-parser': 'commonjs body-parser',
    'reflect-metadata': 'commonjs reflect-metadata',
  },
  node: {
    __dirname: false,
    __filename: false,
  },
};
