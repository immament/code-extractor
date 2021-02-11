/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

const {pathsToModuleNameMapper} = require('ts-jest/utils');
const {compilerOptions} = require('./tsconfig.json');

console.log(
  pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  })
);

module.exports = {
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  //coverageReporters: ['clover'],
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.test.[jt]s?(x)',
    // '**/?(*.)+(spec|test).[tj]s?(x)',
  ],
  preset: 'ts-jest',
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: '<rootDir>/',
    }),
    '^src/(.*)$': '<rootDir>/src/$1',
  },
};
