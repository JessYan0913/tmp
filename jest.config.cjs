const path = require('path')

module.exports = {
  roots: [path.resolve(__dirname, 'src')],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js|jsx)', '**/?(*.)+(spec|test).+(ts|tsx|js|jsx)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
}
