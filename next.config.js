const { withExpo } = require("@expo/next-adapter");

/** @type {import('next').NextConfig} */
const nextConfig = withExpo({
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    "react-native",
    "react-native-web",
    "expo",
    "solito",
    // Add more React Native / Expo packages here...
  ],
  experimental: {
    forceSwcTransforms: true,
  },
  async rewrites() {
    return [
      {
        source: "/time",
        destination: "/",
      }
    ];
  },
});

module.exports = nextConfig;