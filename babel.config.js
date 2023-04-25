module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      require.resolve("expo-router/babel"),
      require.resolve("react-native-reanimated/plugin"),
      require.resolve("nativewind/babel"),
    ],
  };
};
