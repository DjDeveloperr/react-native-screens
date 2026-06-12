module.exports = {
  preset: '@react-native/jest-preset',
  moduleDirectories: ['node_modules', '<rootDir>/TVOSExample/node_modules'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@apps/(.*)$': '<rootDir>/apps/src/$1',
    '^@apps$': '<rootDir>/apps/src',
    '^@assets/(.*)\\.(bmp|gif|jpg|jpeg|png|psd|svg|webp)$': '<rootDir>/jest/asset-stub.js',
    '^@assets/(.*)$': '<rootDir>/apps/assets/$1',
    '^@nativescript/react-native$': '<rootDir>/jest/nativescript-react-native.js',
    '^react-native-gesture-handler$': '<rootDir>/jest/react-native-gesture-handler.js',
    '^react-native-reanimated$': '<rootDir>/jest/react-native-reanimated.js',
    '^react-native-screens$': '<rootDir>/src',
    '^react-native-screens/(.*)$': '<rootDir>/src/$1',
  },
  modulePathIgnorePatterns: ['FabricExample'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/lib/',
    '<rootDir>/react-navigation/',
  ],
};
