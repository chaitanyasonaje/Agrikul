/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Make sure your CSS is processed
  reactStrictMode: true,
  env: {
    OPENWEATHER_API_KEY: 'fb9f1b8d148ed744cac451d71809b015',
    AGMARKET_API_KEY: '579b464db66ec23bdd00000133aabad8568e42b946f3b97839580c08'
  }
};

module.exports = nextConfig; 