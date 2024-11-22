module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest", // Transforma arquivos TypeScript
  },
  transformIgnorePatterns: ["/node_modules/(?!(bcrypt-ts)/)"], // Exclua bcrypt-ts do ignore
};
