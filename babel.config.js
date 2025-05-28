module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ["module-resolver", {
        alias: {
          "@features": "./features",
          "@shared-components": "./shared-components",
          "@services": "./services",
          "@hooks": "./hooks",
          "@contexts": "./contexts"
        },
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }]
    ],
  };
}; 