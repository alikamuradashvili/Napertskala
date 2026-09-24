import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://napertskala.ge'),
  title: 'ნაპერწკალა | Napertskala — შედუღება და ტექნიკური მომსახურება',
  description: 'ყველა ტიპის შედუღება, ელექტრო მომსახურება, სამრეწველო დანადგარები და ავტო დიაგნოსტიკა გორში და საქართველოს მასშტაბით.',
  verification: { google: 'CmIemAXUbvSbTYnRIzZV8BlzPXjS0EVgT4LetLk5a3I' },
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
    hasMap: 'https://www.google.com/maps/place/%E1%83%9C%E1%83%90%E1%83%9E%E1%83%94%E1%83%A0%E1%83%AC%E1%83%99%E1%83%90%E1%83%9A%E1%83%90/@42.0474674,44.1001749,15.75z/data=!4m6!3m5!1s0x4044993500e2b44b:0x94ca73743c8ad05a!8m2!3d42.0486285!4d44.0977862!16s%2Fg%2F11zysksb52',
  };

  return <html lang="ka">
    <head>
      <title>ნაპერწკალა | Napertskala — შედუღება და ტექნიკური მომსახურება</title>
      <meta name="description" content="ყველა ტიპის შედუღება, ელექტრო მომსახურება, ლაზერული ჭრა, ევაკუატორი და ავტო დიაგნოსტიკა გორში და საქართველოს მასშტაბით." />
      <meta name="google-site-verification" content="CmIemAXUbvSbTYnRIzZV8BlzPXjS0EVgT4LetLk5a3I" />
      <link rel="canonical" href="https://napertskala.ge/" />
      <link rel="icon" href="/favicon.png" type="image/png" />
      <link rel="apple-touch-icon" href="/favicon.png" />
      <meta property="og:title" content="ნაპერწკალა | Napertskala" />
      <meta property="og:description" content="პროფესიონალური შედუღება და ტექნიკური მომსახურება — გორი და მთელი საქართველო." />
      <meta property="og:url" content="https://napertskala.ge/" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://napertskala.ge/logo.jpg" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessData) }} />
    </head>
    <body>{children}</body>
  </html>;
}
