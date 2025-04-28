module.exports = {
    preset: '@shelf/jest-mongodb',
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    coverageThreshold: {
      global: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },
    reporters: [
      'default',
      [
        'jest-html-reporters',
        {
          publicPath: './coverage',
          filename: 'report.html',
          expand: true,
        },
      ],
    ],
  };