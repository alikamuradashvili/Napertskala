import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://napertskala.ge'),
  title: 'ნაპერწკალა | Napertskala — შედუღება და ტექნიკური მომსახურება',
  description: 'ყველა ტიპის შედუღება, ელექტრო მომსახურება, სამრეწველო დანადგარები და ავტო დიაგნოსტიკა გორში და საქართველოს მასშტაბით.',
  alternates: { canonical: '/' },
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png' }],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'ნაპერწკალა | Napertskala',
    description: 'პროფესიონალური შედუღება და ტექნიკური მომსახურება — გორი და მთელი საქართველო.',
    url: '/',
    siteName: 'ნაპერწკალა | Napertskala',
    locale: 'ka_GE',
    type: 'website',
    images: [{ url: '/logo.jpg', width: 1254, height: 1254, alt: 'ნაპერწკალა — Napertskala' }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const businessData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://napertskala.ge/#business',
    name: 'ნაპერწკალა',
    alternateName: 'Napertskala',
    url: 'https://napertskala.ge/',
    logo: 'https://napertskala.ge/logo.jpg',
    image: 'https://napertskala.ge/logo.jpg',
    telephone: '+995568884135',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Gori',
      addressRegion: 'Shida Kartli',
      postalCode: '1414',
      addressCountry: 'GE',
    },
    areaServed: { '@type': 'Country', name: 'Georgia' },
    sameAs: ['https://www.facebook.com/profile.php?id=61589481147761'],
    hasMap: 'https://maps.app.goo.gl/7jSzVvmDWJkMUuYNA',
  };

  return <html lang="ka"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessData) }} />{children}</body></html>;
}
