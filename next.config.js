/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'export',   // 👈 tells Next.js to generate static files
    images: {
        unoptimized: true, // GitHub Pages can't handle Next.js Image optimization
    },
    basePath: process.env.NODE_ENV === 'production' ? '/kali-o-kobita' : '',
    assetPrefix: process.env.NODE_ENV === 'production' ? '/kali-o-kobita/' : '',
}

module.exports = nextConfig
