module.exports = {
  coverageDirectory: "<rootDir>/imports/tests/coverage/",
  collectCoverageFrom: [
    "**/ui/components/**/*.{js,jsx}",
    "!**/node_modules/**"
  ],
  setupFiles: ["raf/polyfill", "<rootDir>/imports/tests/setupTests.js"],
  snapshotSerializers: ["enzyme-to-json/serializer"],
  moduleFileExtensions: ["js", "jsx"],
  modulePaths: [
    "<rootDir>/node_modules/",
    "<rootDir>/node_modules/jest-meteor-stubs/lib/"
  ],
  moduleNameMapper: {
    "meteor/(.*)": "<rootDir>/imports/tests/mocks/$1.js",
    "^(.*):(.*)$": "$1_$2"
  },
  unmockedModulePathPatterns: ["/^imports\\/.*\\.jsx?$/", "/^node_modules/"]
};
