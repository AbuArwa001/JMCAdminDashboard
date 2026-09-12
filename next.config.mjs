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
                hostname: 'donations-api.jamiamosque.co.ke',
                port: '80',
                pathname: '/**',
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
            {
                protocol: 'https',
                hostname: 'donations-api.jamiamosque.co.ke',
                port: '',
                pathname: '/**',
            },
        ],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    async rewrites() {
        return [
            {
                source: "/firebase-messaging-sw.js",
                destination: "/api/firebase-messaging-sw",
            },
        ];
    },
};

export default nextConfig;
