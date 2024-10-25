module.exports = function (api) {
  
  api.cache(true);

  const env = process.env.APP_ENV || 'development';

  return {
    presets: ['babel-preset-expo'],
  };
};
