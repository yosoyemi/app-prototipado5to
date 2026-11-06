module.exports = {
  preset: '@react-native/jest-preset',
  testTimeout: 60000,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|@reduxjs|react-redux|redux|redux-thunk|reselect|immer|react-native-safe-area-context|react-native-screens)/)',
  ],
};
