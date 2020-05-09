module.exports = {
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  testEnvironment: 'jsdom',
  moduleDirectories: ['<rootDir>/src', 'node_modules'],
  modulePaths: ['<rootDir>/src/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['**/*.spec.(tsx)', '**/*.spec.(ts|js)'],
  transform: { '^.+\\.(ts|tsx|jsx|js)$': 'babel-jest' },
  transformIgnorePatterns: ['/node_modules/(?!molekule).+\\.js$'],
};
