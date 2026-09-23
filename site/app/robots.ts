import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/login', '/setup'],
    },
    sitemap: 'https://napertskala.ge/sitemap.xml',
    host: 'https://napertskala.ge',
  };
}
