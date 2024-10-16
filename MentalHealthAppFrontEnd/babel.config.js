module.exports = function (api) {
  
  api.cache(true);

  const env = process.env.APP_ENV || 'development';

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv', 
        {
        moduleName: '@env',
        path: `.env.${env}`,
        allowUndefined: false,
        },
      ],
    ]
  };
};
