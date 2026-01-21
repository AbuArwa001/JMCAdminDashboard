/** @type {import('next').NextConfig} */
const nextConfig = {
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
        ],
    },
};

export default nextConfig;
