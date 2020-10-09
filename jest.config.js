module.exports = {
  setupFiles: ['./.jest/setEnvVars.js']
}

module.exports = {
  roots: ['.'],
  setupFiles: ['./.jest/setEnvVars.js'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  }
}
