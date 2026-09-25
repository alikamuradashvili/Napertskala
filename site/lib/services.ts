export const serviceSlugs = ['welding', 'electrical', 'laser-cutting', 'excavator', 'towing', 'diagnostics'] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

export const serviceOptions: ReadonlyArray<{ slug: ServiceSlug; label: string; labelKa: string }> = [
  { slug: 'welding', label: 'Welding', labelKa: 'შედუღება' },
  { slug: 'electrical', label: 'Electrical services', labelKa: 'ელექტრო მომსახურება' },
  { slug: 'laser-cutting', label: 'Laser cutting & engraving', labelKa: 'ლაზერული ჭრა და გრავირება' },
  { slug: 'excavator', label: 'Excavator service', labelKa: 'ექსკავატორით მომსახურება' },
  { slug: 'towing', label: 'Towing service', labelKa: 'ევაკუატორით მომსახურება' },
  { slug: 'diagnostics', label: 'Car diagnostics', labelKa: 'ავტო დიაგნოსტიკა' },
];

export function isServiceSlug(value: unknown): value is ServiceSlug {
  return typeof value === 'string' && serviceSlugs.includes(value as ServiceSlug);
}

export function serviceVisibilityKey(slug: ServiceSlug) {
  return `service_${slug.replace('-', '_')}_enabled`;
}

export type BuiltInServicePhoto = { src: string; ka: string; en: string; tall: boolean };

export const builtInServicePhotos: Record<ServiceSlug, BuiltInServicePhoto[]> = {
  welding: [
    { src: '/services/welding/custom-brazier-welded-finished.jpeg', ka: 'შეკვეთით დამზადებული მაყალი ხის თაროებით', en: 'Custom welded brazier with wooden shelves', tall: false },
    { src: '/services/welding/canopy-frame-installation.jpg', ka: 'ლითონის ფარდულის კონსტრუქციის მონტაჟი', en: 'Steel canopy structure installation', tall: false },
    { src: '/services/welding/equipment-bucket-repair-2.jpg', ka: 'მძიმე ტექნიკის კოვშის აღდგენა', en: 'Heavy-equipment bucket restoration', tall: true },
    { src: '/services/welding/spiral-staircase-complete.jpg', ka: 'დასრულებული სპირალური კიბე', en: 'Completed spiral staircase', tall: true },
    { src: '/services/welding/industrial-frame-fabrication-2.jpg', ka: 'სამრეწველო ლითონის ჩარჩოების დამზადება', en: 'Industrial steel-frame fabrication', tall: false },
    { src: '/services/welding/canopy-beams-fabrication.jpg', ka: 'ფარდულის კოჭების დამზადება', en: 'Canopy beam fabrication', tall: true },
    { src: '/services/welding/equipment-bucket-repair-1.jpg', ka: 'ექსკავატორის დეტალის შედუღება და გამაგრება', en: 'Excavator component welding and reinforcement', tall: false },
    { src: '/services/welding/canopy-frame-complete.jpg', ka: 'შეღებილი ფარდულის ჩარჩო', en: 'Painted canopy frame', tall: false },
    { src: '/services/welding/industrial-frame-fabrication-1.jpg', ka: 'შეკვეთით დამზადებული მძიმე ჩარჩო', en: 'Custom heavy steel frame', tall: true },
    { src: '/services/welding/canopy-frame-progress.jpg', ka: 'ლითონის კონსტრუქცია სამუშაო პროცესში', en: 'Steel structure in progress', tall: false },
    { src: '/services/welding/spiral-staircase-detail.jpg', ka: 'სპირალური კიბის დასრულებული დეტალი', en: 'Finished spiral staircase detail', tall: true },
    { src: '/services/welding/industrial-frame-fabrication-3.jpg', ka: 'ლითონის ფორმები საწარმოსთვის', en: 'Steel forms for industrial use', tall: false },
    { src: '/services/welding/canopy-frame-painted.jpg', ka: 'მომზადებული და შეღებილი კონსტრუქცია', en: 'Prepared and painted structure', tall: false },
  ],
  'laser-cutting': [
    { src: '/services/laser-cutting/personalized-georgian-skewer-sets-display-1.jpeg', ka: 'პერსონალური გრავირებით დამზადებული შამფურების კომპლექტები', en: 'Skewer sets with personalized Georgian engraving', tall: true },
    { src: '/services/laser-cutting/personalized-georgian-skewer-sets-display-2.jpeg', ka: 'ქართული თემატიკის გრავირებული შამფურების კოლექცია', en: 'Collection of Georgian-themed engraved skewer sets', tall: true },
    { src: '/services/laser-cutting/engraved-skewer-set-grill-wide.jpeg', ka: 'ლაზერით გრავირებული შამფურების კომპლექტი მაყალთან', en: 'Laser engraved skewer set with grill', tall: false },
    { src: '/services/laser-cutting/engraved-skewer-set-grill-close.jpeg', ka: 'ქართული ორნამენტით გრავირებული შამფურები', en: 'Skewers engraved with Georgian ornament', tall: false },
    { src: '/services/laser-cutting/engraved-skewer-set-finished.jpeg', ka: 'გრავირებული შამფურის კომპლექტი', en: 'Engraved skewer set', tall: true },
    { src: '/services/laser-cutting/laser-engraving-process.jpeg', ka: 'ლაზერული გრავირების პროცესი', en: 'Laser engraving process', tall: false },
    { src: '/services/laser-cutting/motsamkvrelo-engraved-panel.jpeg', ka: 'ხეზე ამოტვიფრული დეკორატიული პანო', en: 'Engraved wooden decorative panel', tall: true },
    { src: '/services/laser-cutting/engraved-skewer-set-outdoor.jpeg', ka: 'საჩუქრის კომპლექტი ქართული ორნამენტით', en: 'Gift set with Georgian ornament', tall: false },
    { src: '/services/laser-cutting/motsamkvrelo-design-black-white.jpeg', ka: 'ლაზერისთვის მომზადებული დიზაინი', en: 'Design prepared for laser engraving', tall: true },
  ],
  electrical: [],
  excavator: [],
  towing: [
    { src: '/services/towing/mercedes-sprinter-tow-truck-service.png', ka: 'Mercedes-Benz Sprinter ევაკუატორი', en: 'Mercedes-Benz Sprinter towing service', tall: false },
    { src: '/services/towing/tow-truck-service.png', ka: 'ევაკუატორით ავტომობილის გადაყვანა', en: 'Vehicle transport by tow truck', tall: false },
  ],
  diagnostics: [],
};

export function parseHiddenBuiltInPhotos(value: string | undefined) {
  if (!value) return [] as string[];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [] as string[];
  }
}
