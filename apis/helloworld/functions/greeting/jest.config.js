/* eslint-disable */
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.json');
/* eslint-enable */

module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['ts', 'js'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>',
  }),
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/__tests__/**/*.[jt]s?(x)'],
  testPathIgnorePatterns: ['dist/'],
  testEnvironment: 'node',
};
