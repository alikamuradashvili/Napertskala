import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ServiceDetail from './service-detail';

const serviceSlugs = ['welding', 'electrical', 'laser-cutting', 'excavator', 'towing', 'diagnostics'] as const;
type ServiceSlug = (typeof serviceSlugs)[number];

const metadataBySlug: Record<ServiceSlug, { title: string; description: string }> = {
  welding: {
    title: 'შედუღების მომსახურება | Napertskala',
    description: 'ყველა ტიპის შედუღება, ლითონის კონსტრუქციები, მძიმე ტექნიკის შეკეთება, დამზადება და მონტაჟი.',
  },
  electrical: {
    title: 'სამფაზიანი და სამრეწველო ელექტრობა | Napertskala',
    description: 'სახლის ელექტრობა, სამფაზიანი სისტემები, დიდი ქარხნების ელექტრო მომსახურება და სამრეწველო ელექტროძრავები. მონტაჟი, დიაგნოსტიკა და შეკეთება.',
  },
  diagnostics: {
    title: 'ავტო დიაგნოსტიკა | Napertskala',
    description: 'ავტომობილის საბაზისო კომპიუტერული და ელექტრო დიაგნოსტიკა გორში.',
  },
  'laser-cutting': {
    title: 'ლაზერული ჭრა, გრავირება და სუვენირები | Napertskala',
    description: 'ხის სუვენირები, საჩუქრები, დეკორატიული პანოები და პერსონალური ლაზერული გრავირება გორში.',
  },
  excavator: {
    title: 'ექსკავატორით მომსახურება | Napertskala',
    description: 'მიწის სამუშაოები, თხრილები, მოსწორება, დატვირთვა და ობიექტის მომზადება გორში და შეთანხმებით სხვა ლოკაციებზე.',
  },
  towing: {
    title: 'ევაკუატორით მომსახურება | Napertskala',
    description: 'ავტომობილის უსაფრთხო გადაყვანა გორში და სხვა ლოკაციებზე წინასწარი შეთანხმებით.',
  },
};

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!serviceSlugs.includes(slug as ServiceSlug)) return {};
  return metadataBySlug[slug as ServiceSlug];
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!serviceSlugs.includes(slug as ServiceSlug)) notFound();
  return <ServiceDetail slug={slug as ServiceSlug} />;
}
