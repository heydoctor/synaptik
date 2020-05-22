module.exports = {
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  testEnvironment: 'jsdom',
  moduleDirectories: ['<rootDir>/src', 'node_modules'],
  modulePaths: ['<rootDir>/src/'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testMatch: ['**/*.spec.(tsx|ts)'],
  transform: { '^.+\\.(ts|tsx|)$': 'babel-jest' },
};
