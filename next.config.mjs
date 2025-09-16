/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    images: {
    domains: [
      'picsum.photos',        // Lorem Picsum
      'source.unsplash.com',  // Unsplash (if you switch back)
      'images.unsplash.com',  // Unsplash CDN
      'your-domain.com',      // Your own domain
    ],
    },
};

export default nextConfig;
