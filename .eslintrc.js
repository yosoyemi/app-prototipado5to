module.exports = {
  root: true,
  extends: '@react-native',
  ignorePatterns: ['android/', 'ios/', '.expo/'],
  overrides: [{files: ['jest.setup.js'], env: {jest: true}}],
};
