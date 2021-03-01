const rootPathPrefix = '<rootDir>/packages/search/';

const config = {
  displayName: 'search',
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  rootDir: '../..',
  roots: [rootPathPrefix + '/src/'],
  testEnvironment: 'node',
  testMatch: [rootPathPrefix + '/src/**/__tests__/**/*.test.ts?(x)'],

  // modulePaths: ['<rootDir>/packages/'],
  moduleNameMapper: {
    '^@lib2/(.*)$': '<rootDir>/packages/search/src/lib/$1',
    '^@tests2/(.*)$': '<rootDir>/packages/search/src/tests/$1',
    //'^@imm/ts-common/(.*)$': '<rootDir>/packages/ts-common/$1',
    '^@tests/(.*)$': '<rootDir>/packages/ts-common/src/tests/$1', // from ts-common
    '^@lib/(.*)$': '<rootDir>/packages/ts-common/src/lib/$1', // from ts-common
  },

  moduleDirectories: [rootPathPrefix + 'src', 'node_modules'],
  modulePathIgnorePatterns: [
    rootPathPrefix + 'build',
    rootPathPrefix + 'coverage',
  ],
};

module.exports = config;
