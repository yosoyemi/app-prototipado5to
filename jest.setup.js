jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
}));
jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);
jest.mock('react-native-get-random-values', () => {
  Object.defineProperty(global, 'crypto', {
    value: require('node:crypto').webcrypto,
    configurable: true,
  });
  return {};
});
