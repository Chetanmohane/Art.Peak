/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: '5.imimg.com' },
      { protocol: 'https', hostname: 'i.etsystatic.com' },
      { protocol: 'https', hostname: 'cms.cloudinary.vpsvc.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'tapmo.in' },
      { protocol: 'https', hostname: 'print-on-click.in' },
      { protocol: 'https', hostname: 'nameplateshop.com' },
      { protocol: 'https', hostname: 'www.giftingbonsai.com' },
      { protocol: 'https', hostname: '*.fna.fbcdn.net' },
      { protocol: 'https', hostname: 'scontent.cdninstagram.com' },
      { protocol: 'https', hostname: '*.cdninstagram.com' },
      { protocol: 'https', hostname: 'instagram.fbho*.fna.fbcdn.net' },
    ],
  },
};

export default nextConfig;