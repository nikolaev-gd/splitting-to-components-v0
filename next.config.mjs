/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'oaidalleapiprodscus.blob.core.windows.net',
          port: '',
          pathname: '/private/**',
        },
        // Add any other image sources you're using
      ],
    },
    // ... any other existing configurations
  };
  
  export default nextConfig;