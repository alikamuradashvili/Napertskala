import type { Metadata } from 'next';
import PrivacyPolicy from './privacy-policy';

export const metadata: Metadata = {
  title: 'კონფიდენციალურობის პოლიტიკა | Privacy Policy | Napertskala',
  description: 'ნაპერწკალას პერსონალური მონაცემების დაცვისა და კონფიდენციალურობის პოლიტიკა ქართულად და ინგლისურად.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return <PrivacyPolicy />;
}
