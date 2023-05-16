module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setupJest.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!@angular)',
    'login.component.spec.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/main.ts',
    '!src/polyfills.ts',
    '!src/**/*.module.ts',
    '!src/environments/**/*.ts',
  ],
};
