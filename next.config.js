/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
    output: 'export',   // 👈 tells Next.js to generate static files
    images: {
        unoptimized: true, // GitHub Pages can't handle Next.js Image optimization
    },
    /*basePath: '/kali-o-kobita', // if not deploying at root
    assetPrefix: '/kali-o-kobita/', // important for assets*/
}

module.exports = nextConfig
