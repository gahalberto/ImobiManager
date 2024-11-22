module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest", // Transforma arquivos TypeScript
  },
  transformIgnorePatterns: ["/node_modules/(?!(bcrypt-ts)/)"], // Exclua bcrypt-ts do ignore
};
