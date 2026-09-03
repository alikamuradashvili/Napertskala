import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ნაპერწკალა | Napertskala — შედუღება და ტექნიკური მომსახურება',
  description: 'ყველა ტიპის შედუღება, ელექტრო მომსახურება, სამრეწველო დანადგარები და ავტო დიაგნოსტიკა გორში და საქართველოს მასშტაბით.',
  openGraph: { title: 'ნაპერწკალა | Napertskala', description: 'პროფესიონალური შედუღება და ტექნიკური მომსახურება — გორი და მთელი საქართველო.', type: 'website' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ka"><body>{children}</body></html>;
}
