import { resolve } from 'path';
import { readFileSync } from 'fs';
import { yamlParse } from 'yaml-cfn';
import { Configuration } from 'webpack';

/* eslint-disable */
const { compilerOptions } = require('./tsconfig.json');
/* eslint-enable */

const conf = {
  prodMode: process.env.NODE_ENV === 'production',
  templatePath: '../../template.yaml',
};

/**
 * Config for layer aliases
 */
const tsPaths: any = {};

Object.keys(compilerOptions.paths).forEach((item) => {
  tsPaths[item] = resolve(__dirname, compilerOptions.paths[item][0]);
});

/**
 * Config for parsing functions
 */
const cfn: any = yamlParse(readFileSync(conf.templatePath, 'utf-8'));

const entries = Object.values(cfn.Resources)
  .filter((resource: any) => resource.Type === 'AWS::Serverless::Function')
  .filter(
    (resource: any) =>
      (resource.Properties.Runtime && resource.Properties.Runtime.startsWith('nodejs')) ||
      (!resource.Properties.Runtime &&
        cfn.Globals.Function.Runtime &&
        cfn.Globals.Function.Runtime.startsWith('nodejs'))
  )
  .map((resource: any) => ({
    sourceFile: resource.Properties.Handler.split('.')[0],
    CodeUriDir: resource.Properties.CodeUri.split('/').splice(3).join('/'),
  }))
  .reduce(
    (resources, resource) =>
      Object.assign(resources, {
        [`${resource.CodeUriDir}/${resource.sourceFile}`]: `./src/${resource.CodeUriDir}${resource.sourceFile}.ts`,
      }),
    {}
  );

const config: Configuration = {
  entry: entries,
  target: 'node',
  mode: conf.prodMode ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: tsPaths,
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  devtool: 'source-map',
  plugins: [],
};

export default config;
