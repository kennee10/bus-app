module.exports = function(api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        // 'expo-router/babel', // include if neededcls
        'react-native-reanimated/plugin', // Must be listed last
      ],
    };
  };
  