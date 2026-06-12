module.exports = {
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "jsx", "json", "node"],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)"
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "backend/**/*.{js,jsx}",
    "!**/node_modules/**",
    "!**/public/**",
    "!**/uploads/**"
  ],
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules/"]
};
