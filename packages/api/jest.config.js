/** @type {import('jest').Config} */
const config = {
  testEnvironment: "node",
  preset: "ts-jest",
  moduleNameMapper: {
    "^@caring-compass/(.*?)/src/(.*)$": "<rootDir>/../$1/src/$2",
    "^@caring-compass/(.*)$": "<rootDir>/../$1/src"
  },
  transformIgnorePatterns: [
    "node_modules/(?!(superjson|@caring-compass)/)"
  ],
  setupFilesAfterEnv: [
    "<rootDir>/src/__tests__/setup.ts"
  ],
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": ["ts-jest", {
      useESM: true,
      tsconfig: "tsconfig.json"
    }]
  },
  extensionsToTreatAsEsm: [".ts", ".tsx", ".mts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testTimeout: 10000,
  verbose: true,
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"]
  }
}

module.exports = config