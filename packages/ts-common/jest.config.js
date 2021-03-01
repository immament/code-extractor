const rootPathPrefix = '<rootDir>/packages/ts-common/';

module.exports = {
  displayName: 'ts-common',
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  rootDir: '../..',
  roots: [rootPathPrefix + '/src/'],
  testEnvironment: 'node',
  testMatch: [rootPathPrefix + '/src/**/__tests__/**/*.test.ts?(x)'],

  moduleNameMapper: {
    '^@tests/(.*)$': rootPathPrefix + 'src/tests/$1',
    '^@lib/(.*)$': rootPathPrefix + 'src/lib/$1',
    '^src/(.*)$': rootPathPrefix + 'src/$1',
  },
  modulePathIgnorePatterns: [
    rootPathPrefix + 'build',
    rootPathPrefix + 'coverage',
  ],
};
