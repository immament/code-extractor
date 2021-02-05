/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

module.exports = {
  coverageDirectory: 'coverage',

  coverageProvider: 'v8',

  rootDir: 'src',

  testEnvironment: 'node',

  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    // '**/?(*.)+(spec|test).[tj]s?(x)',
  ],
  preset: 'ts-jest',
};
