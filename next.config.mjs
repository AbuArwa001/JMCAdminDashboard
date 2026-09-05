/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        RENDER_API_URL: process.env.RENDER_API_URL,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '8000',
                pathname: '/media/**',
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '8000',
                pathname: '/static/**',
            },
            {
                protocol: 'http',
                hostname: 'jamiagive.com',
                port: '80',
                pathname: '/static/**',
            },
            {
                protocol: 'http',
                hostname: 'jamiagive.com',
                port: '443',
                pathname: '/media/**',
            },
            {
                protocol: 'https',
                hostname: 'jmcdonations.s3.amazonaws.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
