/**
 * Webpack configuration for Vercel Serverless
 * Uses ts-loader with transpileOnly for out-of-rootDir support (required for api/index.ts at src/api/)
 */
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/api/index.ts',
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
      // Redirect class-transformer/storage (used by @nestjs/mapped-types@2.1.1)
      // to the actual file available in class-transformer@0.5.1
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
    express: 'commonjs express',
    'body-parser': 'commonjs body-parser',
    'reflect-metadata': 'commonjs reflect-metadata',
  },
  node: {
    __dirname: false,
    __filename: false,
  },
};
