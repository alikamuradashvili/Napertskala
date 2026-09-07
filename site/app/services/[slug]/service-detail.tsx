'use client';

import {
  ArrowLeft,
  ArrowRight,
  Car,
  CheckCircle2,
  Clock3,
  FileText,
  Gift,
  Hammer,
  Languages,
  MapPin,
  MessageCircle,
  Phone,
  Ruler,
  ShieldCheck,
  Wrench,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import AccountLink from '@/components/account-link';

type Lang = 'ka' | 'en';
const serviceSlugs = ['welding', 'electrical', 'laser-cutting', 'excavator', 'diagnostics'] as const;
type ServiceSlug = (typeof serviceSlugs)[number];

type Copy = {
  label: string;
  title: string;
  lead: string;
  summary: string;
  features: [string, string][];
  process: [string, string][];
};

type Service = {
  icon: typeof Wrench;
  ka: Copy;
  en: Copy;
};

const services: Record<ServiceSlug, Service> = {
  welding: {
    icon: Wrench,
    ka: {
      label: 'მთავარი მიმართულება',
      title: 'ყველა ტიპის შედუღება და ლითონის სამუშაოები',
      lead: 'ვაკეთებთ მცირე შეკეთებიდან დიდ ლითონის კონსტრუქციებამდე — კერძო პირებისთვის, სამშენებლო კომპანიებისა და საწარმოებისთვის.',
      summary: 'სამუშაოს ვგეგმავთ ზომების, დატვირთვისა და გამოყენების გარემოს მიხედვით. საჭიროების შემთხვევაში ადგილზე მოვდივართ, ვამზადებთ დეტალებს და ვასრულებთ მონტაჟს.',
      features: [
        ['ლითონის კონსტრუქციები', 'ფარდულები, კიბეები, მოაჯირები, ჭიშკრები, ჩარჩოები და შეკვეთით დამზადებული კონსტრუქციები.'],
        ['მძიმე ტექნიკის შეკეთება', 'ექსკავატორის კოვშების, სამაგრებისა და დატვირთული ლითონის დეტალების აღდგენა და გამაგრება.'],
        ['სამრეწველო დამზადება', 'მძიმე ჩარჩოები, ფორმები და სპეციალური ლითონის დეტალები საწარმოებისა და მშენებლობისთვის.'],
        ['ადგილზე შედუღება', 'შეთანხმებით გავდივართ ობიექტზე გორში და სხვა ლოკაციებზე.'],
        ['მონტაჟი და დასრულება', 'დამზადებული კონსტრუქციის აწყობა, მონტაჟი და სამუშაოს საბოლოო შემოწმება.'],
        ['შეკეთება და გამაგრება', 'დაზიანებული ნაკერების, ბზარებისა და მეტალის ელემენტების საიმედო აღდგენა.'],
      ],
      process: [['ფოტო და აღწერა', 'გამოგვიგზავნეთ სამუშაოს ფოტო ან მოკლე აღწერა WhatsApp-ზე.'], ['გაზომვა და შეფასება', 'ვაზუსტებთ ზომებს, მასალას, ადგილმდებარეობასა და სამუშაოს მოცულობას.'], ['დამზადება', 'ვჭრით, ვაწყობთ და ვადუღებთ კონსტრუქციას შეთანხმებული მოთხოვნებით.'], ['მონტაჟი და ჩაბარება', 'ვაკეთებთ მონტაჟს, ვამოწმებთ შედეგს და გაბარებთ დასრულებულ სამუშაოს.']],
    },
    en: {
      label: 'Our main expertise',
      title: 'All types of welding and metalwork',
      lead: 'From small repairs to large steel structures for homeowners, construction companies and industrial clients.',
      summary: 'Every job is planned around dimensions, load and operating conditions. When needed, we visit the site, fabricate the components and complete the installation.',
      features: [
        ['Steel structures', 'Canopies, stairs, railings, gates, frames and made-to-order metal structures.'],
        ['Heavy-equipment repair', 'Repair and reinforcement of excavator buckets, mounts and high-load metal components.'],
        ['Industrial fabrication', 'Heavy frames, forms and special metal components for factories and construction.'],
        ['Mobile welding', 'On-site visits in Gori and other locations are available by agreement.'],
        ['Installation and finishing', 'Assembly, installation and final inspection of the completed structure.'],
        ['Repair and reinforcement', 'Reliable restoration of damaged welds, cracks and metal elements.'],
      ],
      process: [['Photo and description', 'Send a photo or a short job description through WhatsApp.'], ['Measure and estimate', 'We confirm dimensions, material, location and the scope of work.'], ['Fabrication', 'We cut, assemble and weld the structure to the agreed requirements.'], ['Install and hand over', 'We install, inspect and hand over the completed work.']],
    },
  },
  electrical: {
    icon: Zap,
    ka: {
      label: 'სახლებისთვის, ბიზნესისა და ქარხნებისთვის',
      title: 'სამფაზიანი და საყოფაცხოვრებო ელექტრო მომსახურება',
      lead: 'სახლის ელექტრობიდან დიდი ქარხნის ელექტრო სისტემებამდე — სამფაზიანი ქსელები, სამრეწველო ელექტრობა და დიდი ელექტროძრავების მომსახურება.',
      summary: 'ვმუშაობთ საცხოვრებელ, კომერციულ და საწარმოო ობიექტებზე. ვასრულებთ ელექტრო მონტაჟს, დიაგნოსტიკასა და შეკეთებას, მათ შორის დიდი ქარხნების სამფაზიან სისტემებსა და ელექტროძრავებზე. სამუშაოს მოცულობას ვათანხმებთ ობიექტისა და მოწყობილობის მოთხოვნების მიხედვით.',
      features: [['სამფაზიანი ელექტრობა', 'სამფაზიანი ელექტრო ქსელებისა და მოწყობილობების მონტაჟი, შემოწმება და გაუმართაობის აღმოფხვრა.'], ['ქარხნის ელექტრო სისტემები', 'დიდი ქარხნებისა და საწარმოო სივრცეების ელექტრო გაყვანილობისა და დანადგარების ელექტრო ნაწილების მომსახურება.'], ['დიდი ელექტროძრავები', 'სამრეწველო ელექტროძრავების შემოწმება, დიაგნოსტიკა და მომსახურება — სამუშაოს მოცულობა თანხმდება მოწყობილობის მიხედვით.'], ['ფარები და ავტომატები', 'გამანაწილებელი ფარების, დამცავი ავტომატებისა და შესაბამისი კომპონენტების მონტაჟი და შეკეთება.'], ['გაუმართაობის პოვნა', 'მოკლე ჩართვის, დენის დაკარგვისა და გადატვირთვის მიზეზის დიაგნოსტიკა.'], ['ახალი გაყვანილობა', 'ელექტრო ხაზების დაგეგმვა და მონტაჟი სახლში, კომერციულ სივრცესა და საწარმოში.'], ['როზეტები და განათება', 'როზეტების, ჩამრთველებისა და სანათების მონტაჟი ან შეცვლა.'], ['ობიექტზე გასვლა', 'მომსახურება გორში და სხვა ლოკაციებზე წინასწარი შეთანხმებით.']],
      process: [['ობიექტისა და სამუშაოს აღწერა', 'გამოგვიგზავნეთ ობიექტის ან მოწყობილობის ფოტოები, მოდელი და სამუშაოს მოკლე აღწერა.'], ['დიაგნოსტიკა', 'ადგილზე ვამოწმებთ სისტემას და ვადგენთ სამუშაოს მოცულობასა თუ გაუმართაობის მიზეზს.'], ['შეთანხმება', 'გაცნობებთ საჭირო სამუშაოს, მასალებსა და ვადას.'], ['შესრულება', 'ვაკეთებთ მონტაჟს ან შეკეთებას და ვამოწმებთ სისტემას.']],
    },
    en: {
      label: 'For homes, businesses and factories',
      title: 'Three-phase and home electrical services',
      lead: 'From home wiring to large factory electrical systems — three-phase power, industrial electrical work and large electric-motor service.',
      summary: 'We work on residential, commercial and industrial sites. Our electrical installation, diagnostics and repair services include three-phase systems and electric motors in large factories. The scope of work is agreed around the site and equipment requirements.',
      features: [['Three-phase electrical work', 'Installation, inspection and fault finding for three-phase electrical systems and equipment.'], ['Factory electrical systems', 'Service for wiring and the electrical components of equipment in large factories and production spaces.'], ['Large electric motors', 'Inspection, diagnostics and servicing of industrial electric motors, with the scope agreed for each machine.'], ['Panels and breakers', 'Installation and repair of distribution panels, protective breakers and related components.'], ['Fault finding', 'Diagnosis of short circuits, power loss and overload problems.'], ['New wiring', 'Planning and installation of circuits for homes, commercial premises and factories.'], ['Sockets and lighting', 'Installation or replacement of sockets, switches and lighting.'], ['Site visits', 'Service in Gori and other locations by prior agreement.']],
      process: [['Site and job details', 'Send site or equipment photos, the model and a short description of the work.'], ['Diagnostics', 'We inspect the system on site to establish the scope or identify the fault.'], ['Agreement', 'We explain the required work, materials and timing before starting.'], ['Completion', 'We complete the installation or repair and test the system.']],
    },
  },
  excavator: {
    icon: Hammer,
    ka: {
      label: 'მიწისა და ობიექტის სამუშაოები',
      title: 'ექსკავატორით მომსახურება',
      lead: 'ვასრულებთ მიწის სამუშაოებს ექსკავატორით — თხრილები, მოსწორება, დატვირთვა და ობიექტის მომზადება შეთანხმებით.',
      summary: 'სამუშაო იგეგმება ლოკაციის, მოცულობის და მისასვლელი პირობების მიხედვით. გამოგვიგზავნეთ ფოტო, მისამართი და მოკლე აღწერა, რომ სწრაფად შევაფასოთ საჭირო დრო და პირობები.',
      features: [
        ['თხრილების გაჭრა', 'საძირკვლის, კომუნიკაციის ან სხვა დანიშნულების თხრილების მომზადება.'],
        ['მიწის მოსწორება', 'ეზოს, სამშენებლო ადგილის ან სამუშაო სივრცის გასწორება შეთანხმებული დონით.'],
        ['დატვირთვა და გაწმენდა', 'მიწის, ნარჩენი მასალის ან სხვა მასალის დატვირთვა და ადგილის მოწესრიგება.'],
        ['ობიექტის მომზადება', 'სამშენებლო ან სამეურნეო სამუშაოს დაწყებამდე ტერიტორიის მომზადება.'],
        ['კომუნიკაციის არხები', 'წყლის, ელექტრო ან სხვა კომუნიკაციისთვის საჭირო არხების ამოღება.'],
        ['გასვლა შეთანხმებით', 'ვმუშაობთ გორში და სხვა ლოკაციებზე წინასწარი შეთანხმებით.'],
      ],
      process: [['ფოტო და მისამართი', 'გამოგვიგზავნეთ ლოკაციის ფოტო, მისამართი და სამუშაოს მოკლე აღწერა.'], ['მოცულობის შეფასება', 'ვაზუსტებთ მისასვლელს, მიწის ტიპს, მოცულობას და საჭირო ტექნიკას.'], ['დროის შეთანხმება', 'გითანხმებთ სამუშაო დროს, პირობებს და სავარაუდო ხანგრძლივობას.'], ['შესრულება', 'ვასრულებთ მიწის სამუშაოს და ვამოწმებთ შეთანხმებულ შედეგს.']],
    },
    en: {
      label: 'Earthworks and site work',
      title: 'Excavator service',
      lead: 'Excavator work for earthworks, trenches, leveling, loading and site preparation by agreement.',
      summary: 'Each job is planned around the location, scope and access conditions. Send a photo, address and short description so we can quickly estimate time and conditions.',
      features: [
        ['Trench digging', 'Preparation of trenches for foundations, utilities or other site needs.'],
        ['Ground leveling', 'Leveling yards, construction areas or workspaces to the agreed level.'],
        ['Loading and cleanup', 'Loading soil, leftover material or other materials and tidying the site.'],
        ['Site preparation', 'Preparing the area before construction or agricultural work begins.'],
        ['Utility channels', 'Digging channels for water, electrical or other utility lines.'],
        ['Visits by agreement', 'Service in Gori and other locations by prior agreement.'],
      ],
      process: [['Photo and address', 'Send the location photo, address and a short job description.'], ['Scope estimate', 'We confirm access, soil type, volume and the equipment needed.'], ['Schedule agreement', 'We agree on timing, conditions and estimated duration.'], ['Completion', 'We complete the earthwork and check the agreed result.']],
    },
  },
  diagnostics: {
    icon: Car,
    ka: {
      label: 'ავტომობილისთვის',
      title: 'საბაზისო ავტო და ელექტრო დიაგნოსტიკა',
      lead: 'ავტომობილის ელექტრო პრობლემებისა და კომპიუტერში დაფიქსირებული შეცდომების პირველადი შემოწმება.',
      summary: 'ვკითხულობთ შეცდომის კოდებს, ვამოწმებთ ელექტრო სიმპტომებს და გეხმარებით პრობლემის მიმართულების დადგენაში. მომსახურება არ მოიცავს ყველა მექანიკურ შეკეთებას.',
      features: [['კომპიუტერული შემოწმება', 'ავტომობილის სისტემებში დაფიქსირებული შეცდომის კოდების წაკითხვა.'], ['ელექტრო დიაგნოსტიკა', 'ელექტრო პრობლემებისა და არასტაბილური კავშირების პირველადი შემოწმება.'], ['აკუმულატორი და დამუხტვა', 'აკუმულატორისა და დამუხტვის სისტემის ძირითადი მაჩვენებლების შეფასება.'], ['ინდიკატორების შემოწმება', 'დაფაზე ანთებული გაფრთხილების მიზეზის საწყისი დიაგნოსტიკა.'], ['პრობლემის მიმართულება', 'შემოწმების შედეგების ახსნა და შემდგომი ნაბიჯის რეკომენდაცია.'], ['წინასწარი ჩაწერა', 'ვმუშაობთ წინასწარი შეთანხმებით ყოველდღე 10:00–23:00.']],
      process: [['სიმპტომის აღწერა', 'გვითხარით ავტომობილის მოდელი და რა პრობლემა შეამჩნიეთ.'], ['დაკავშირება', 'ვაერთებთ სადიაგნოსტიკო მოწყობილობას და ვკითხულობთ მონაცემებს.'], ['შემოწმება', 'ვამოწმებთ შესაბამის ელექტრო ნიშნებსა და კავშირებს.'], ['შედეგი', 'გიხსნით ნაპოვნ შეცდომებს და შესაძლო შემდეგ ნაბიჯებს.']],
    },
    en: {
      label: 'For your vehicle',
      title: 'Basic car and electrical diagnostics',
      lead: 'Initial inspection of vehicle electrical problems and fault codes recorded by the onboard computer.',
      summary: 'We read fault codes, inspect electrical symptoms and help identify the likely direction of the problem. This service does not include every type of mechanical repair.',
      features: [['Computer scan', 'Reading fault codes recorded in the vehicle systems.'], ['Electrical diagnostics', 'Initial inspection of electrical issues and unstable connections.'], ['Battery and charging', 'Basic assessment of battery and charging-system readings.'], ['Warning lights', 'Initial diagnosis of dashboard warning indicators.'], ['Clear next steps', 'Explanation of the findings and a recommendation for what to do next.'], ['By appointment', 'Available by prior arrangement every day from 10:00 to 23:00.']],
      process: [['Describe the symptom', 'Tell us the vehicle model and what problem you noticed.'], ['Connect', 'We connect the diagnostic device and read the available data.'], ['Inspect', 'We check the relevant electrical signs and connections.'], ['Results', 'We explain the detected faults and possible next steps.']],
    },
  },
  'laser-cutting': {
    icon: Gift,
    ka: {
      label: 'საჩუქრები და სუვენირები',
      title: 'ლაზერული ჭრა, გრავირება და ხის სუვენირები',
      lead: 'ვამზადებთ პერსონალურ საჩუქრებს, სუვენირებს, დეკორატიულ პანოებს და გრავირებულ ნივთებს თქვენი იდეით ან მზად დიზაინით.',
      summary: 'ლაზერით ვჭრით და ვგრავირებთ ხესა და შესაბამის მასალებს. შეგვიძლია დავამზადოთ ქართული ორნამენტებით გაფორმებული პანოები, შამფურის კომპლექტები, სახელობითი საჩუქრები და მცირე სერიები ბიზნესისთვის.',
      features: [
        ['ხის სუვენირები', 'ქართული თემატიკის დეკორატიული ნივთები, პანოები, მაგიდის აქსესუარები და სამახსოვრო საჩუქრები.'],
        ['პერსონალური გრავირება', 'სახელი, ტექსტი, ლოგო, თარიღი ან ორნამენტი თქვენს ნივთზე ან ჩვენ მიერ დამზადებულ პროდუქტზე.'],
        ['საჩუქრები შეკვეთით', 'დაბადების დღე, ქორწილი, ნათლობა, კორპორატიული საჩუქარი ან ტურისტული სუვენირი.'],
        ['დიზაინის მომზადება', 'ვმუშაობთ თქვენი ფაილით ან ვამზადებთ დიზაინს იდეის, ფოტოსა და ტექსტის მიხედვით.'],
        ['ლაზერული ჭრა', 'ზუსტი ჭრა მცირე დეტალებისთვის, დეკორატიული ფორმებისთვის და აწყობადი ხის ნივთებისთვის.'],
        ['მცირე სერიები', 'შესაძლებელია ერთეული ნამუშევარი ან რამდენიმე ცალი ერთნაირი პროდუქტის დამზადება.'],
      ],
      process: [['იდეა ან ფოტო', 'გამოგვიგზავნეთ იდეა, ზომა, ტექსტი ან მაგალითის ფოტო WhatsApp-ზე.'], ['დიზაინის შეთანხმება', 'ვაზუსტებთ მასალას, ზომას, წარწერას და საბოლოო ვიზუალს.'], ['ჭრა და გრავირება', 'ვამზადებთ ნამუშევარს ლაზერით შეთანხმებული დიზაინის მიხედვით.'], ['ჩაბარება', 'ვამოწმებთ დეტალებს და გაბარებთ დასრულებულ საჩუქარს ან სუვენირს.']],
    },
    en: {
      label: 'Gifts and souvenirs',
      title: 'Laser cutting, engraving and wooden souvenirs',
      lead: 'Personal gifts, souvenirs, decorative panels and engraved items made from your idea or a ready design.',
      summary: 'We laser cut and engrave wood and suitable materials. We can make Georgian ornament panels, skewer sets, named gifts and small batches for businesses.',
      features: [
        ['Wooden souvenirs', 'Georgian-themed decorative pieces, panels, desk accessories and memorable gifts.'],
        ['Personal engraving', 'Names, text, logos, dates or ornaments on your item or on a product we make.'],
        ['Custom gifts', 'For birthdays, weddings, baptisms, corporate gifts or tourist souvenirs.'],
        ['Design preparation', 'We can work from your file or prepare a design from an idea, photo and text.'],
        ['Laser cutting', 'Precise cutting for small details, decorative shapes and assembled wooden pieces.'],
        ['Small batches', 'One custom item or several matching products can be made by agreement.'],
      ],
      process: [['Idea or photo', 'Send your idea, size, text or reference photo through WhatsApp.'], ['Approve design', 'We confirm material, dimensions, inscription and final look.'], ['Cut and engrave', 'We produce the piece by laser according to the approved design.'], ['Hand over', 'We check the details and hand over the finished gift or souvenir.']],
    },
  },
};

const gallery = [
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
];
const laserGallery = [
  { src: '/services/laser-cutting/engraved-skewer-set-finished.jpeg', ka: 'გრავირებული შამფურის კომპლექტი', en: 'Engraved skewer set', tall: true },
  { src: '/services/laser-cutting/laser-engraving-process.jpeg', ka: 'ლაზერული გრავირების პროცესი', en: 'Laser engraving process', tall: false },
  { src: '/services/laser-cutting/motsamkvrelo-engraved-panel.jpeg', ka: 'ხეზე ამოტვიფრული დეკორატიული პანო', en: 'Engraved wooden decorative panel', tall: true },
  { src: '/services/laser-cutting/engraved-skewer-set-outdoor.jpeg', ka: 'საჩუქრის კომპლექტი ქართული ორნამენტით', en: 'Gift set with Georgian ornament', tall: false },
  { src: '/services/laser-cutting/motsamkvrelo-design-black-white.jpeg', ka: 'ლაზერისთვის მომზადებული დიზაინი', en: 'Design prepared for laser engraving', tall: true },
];

const labels = {
  ka: { back: 'მთავარზე დაბრუნება', details: 'რას ვაკეთებთ', process: 'როგორ ვმუშაობთ', calculator: 'კალკულატორი', calculatorLead: 'ამ სერვისის ინდივიდუალურ კალკულატორს შემდეგ ეტაპზე ავაწყობთ.', calculatorNote: 'აქ ჩაიდება ზომები, რაოდენობა, მასალა ან სხვა მონაცემები, რომლებიც ფასის დათვლას სჭირდება.', work: 'შესრულებული სამუშაოები', workLead: 'ფოტოებზე წარმოდგენილია ნაპერწკალას მიერ შესრულებული რეალური სამუშაოები.', other: 'სხვა სერვისები', call: 'დაგვირეკეთ', whatsapp: 'მოგვწერეთ WhatsApp-ზე', cta: 'განიხილეთ თქვენი სამუშაო ჩვენთან', ctaText: 'გამოგვიგზავნეთ ფოტო, ზომები ან მოკლე აღწერა და დაგიკავშირდებით პირობების შესათანხმებლად.', location: 'გორი • სხვა ლოკაციები შეთანხმებით', hours: 'ყოველდღე • 10:00–23:00' },
  en: { back: 'Back to home', details: 'What we do', process: 'How we work', calculator: 'Calculator', calculatorLead: 'We will build the individual calculator for this service in the next step.', calculatorNote: 'This area will contain dimensions, quantity, material or other inputs needed for price calculation.', work: 'Completed work', workLead: 'These photos show real projects completed by Napertskala.', other: 'Other services', call: 'Call us', whatsapp: 'Message on WhatsApp', cta: 'Tell us about your job', ctaText: 'Send photos, dimensions or a short description and we will contact you to discuss the work.', location: 'Gori • Other locations by agreement', hours: 'Every day • 10:00–23:00' },
};
const servicePhoneKeys: Record<ServiceSlug, string> = {
  welding: 'phone_welding',
  electrical: 'phone_electrical',
  'laser-cutting': 'phone_laser_cutting',
  excavator: 'phone_excavator',
  diagnostics: 'phone_diagnostics',
};
const defaultServicePhones: Record<ServiceSlug, string> = {
  welding: '+995574814088',
  electrical: '568 88 41 35',
  'laser-cutting': '568 88 41 35',
  excavator: '',
  diagnostics: '568 88 41 35',
};
const toWhatsappNumber = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 9 && digits.startsWith('5') ? `995${digits}` : digits;
};

export default function ServiceDetail({ slug }: { slug: ServiceSlug }) {
  const [lang, setLang] = useState<Lang>('ka');
  const galleryRef = useRef<HTMLDivElement>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [cms, setCms] = useState<{ settings: Record<string, string>; gallery: Array<{id:string;filename:string;alt_ka:string;alt_en:string;url:string}> } | null>(null);
  useEffect(() => { fetch('/api/site').then((r) => r.ok ? r.json() : null).then((value: unknown) => value && setCms(value as { settings: Record<string, string>; gallery: Array<{id:string;filename:string;alt_ka:string;alt_en:string;url:string}> })).catch(() => {}); }, []);
  const phone = cms?.settings?.[servicePhoneKeys[slug]] || defaultServicePhones[slug] || cms?.settings?.phone || '+995574814088';
  const whatsapp = `https://wa.me/${toWhatsappNumber(phone)}`;
  const logoSrc = cms?.settings?.logo_media_id ? `/api/media/${cms.settings.logo_media_id}` : '/logo.jpg';
  const service = services[slug];
  const copy = service[lang];
  const ui = labels[lang];
  const Icon = service.icon;
  const serviceEnabled = (value: ServiceSlug) => cms?.settings?.[`service_${value.replace('-', '_')}_enabled`] !== 'false';
  const serviceGallery = slug === 'laser-cutting' ? laserGallery : gallery;
  const visibleGallery = [...serviceGallery, ...(slug === 'welding' ? (cms?.gallery ?? []).map((item) => ({ src:item.url, ka:item.alt_ka || item.filename, en:item.alt_en || item.filename, tall:false })) : [])];
  const scrollGallery = (direction: -1 | 1) => setGalleryIndex((current)=>(current+direction+visibleGallery.length)%visibleGallery.length);
  useEffect(() => { if(!['welding','laser-cutting'].includes(slug)||visibleGallery.length<2)return;const timer=window.setInterval(()=>setGalleryIndex((current)=>(current+1)%visibleGallery.length),3600);return()=>window.clearInterval(timer); }, [slug,visibleGallery.length]);
  useEffect(() => { const container=galleryRef.current;if(!container)return;const items=container.querySelectorAll<HTMLElement>('[data-gallery-photo]');const first=items[0];const target=items[galleryIndex];if(first&&target)container.scrollTo({left:target.offsetLeft-first.offsetLeft,behavior:'smooth'}); }, [galleryIndex]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#090a0b] text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#090a0b]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <a href="/" className="flex items-center gap-3" aria-label="Napertskala home">
            <Image src={logoSrc} alt="Napertskala" width={48} height={48} priority className="h-12 w-12 rounded-full border border-orange-400/30 object-cover" unoptimized={logoSrc.startsWith('/api/')} />
            <div><strong className="block text-lg leading-none tracking-wide">ნაპერწკალა</strong><span className="text-[10px] uppercase tracking-[.28em] text-orange-400">Napertskala</span></div>
          </a>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(lang === 'ka' ? 'en' : 'ka')} className="flex h-10 items-center gap-2 rounded-full border border-white/15 px-3 text-xs font-bold transition hover:border-orange-400/60" aria-label="Change language"><Languages className="h-4 w-4" />{lang === 'ka' ? 'EN' : 'ქარ'}</button>
            <AccountLink lang={lang} className="flex h-10 shrink-0 items-center rounded-full bg-orange-500 px-3 text-xs font-bold text-black hover:bg-orange-400" />
            <a href={`tel:${phone}`} className="hidden h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-extrabold transition hover:border-orange-400 sm:flex"><Phone className="h-4 w-4" />{ui.call}</a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_24%,rgba(249,115,22,.18),transparent_35%),linear-gradient(125deg,#090a0b_35%,#141517_100%)]" />
        <div className="spark-grid absolute inset-0 opacity-20" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <a href="/" className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-zinc-400 transition hover:text-orange-400"><ArrowLeft className="h-4 w-4" />{ui.back}</a>
          <div className="grid gap-12 lg:grid-cols-[1.03fr_.97fr] lg:items-center">
            <div>
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-orange-400/25 bg-orange-400/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[.2em] text-orange-300"><Icon className="h-4 w-4" />{copy.label}</div>
              <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-[-.04em] sm:text-7xl">{copy.title}</h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl">{copy.lead}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row"><a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 font-extrabold text-black transition hover:-translate-y-0.5"><MessageCircle className="h-5 w-5" />{ui.whatsapp}</a><a href={`tel:${phone}`} className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 font-bold transition hover:border-orange-400/60"><Phone className="h-5 w-5 text-orange-400" />{phone}</a></div>
            </div>
            {slug === 'welding' || slug === 'laser-cutting' ? <div className="relative"><div className="absolute -inset-8 rounded-[3rem] bg-orange-500/10 blur-3xl"/><div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-orange-400/25"><Image src={slug === 'welding' ? '/services/welding/canopy-frame-installation.jpg' : '/services/laser-cutting/laser-engraving-process.jpeg'} alt={slug === 'welding' ? (lang === 'ka' ? 'ნაპერწკალას მიერ დამზადებული ლითონის კონსტრუქცია' : 'Steel structure fabricated by Napertskala') : (lang === 'ka' ? 'ნაპერწკალას ლაზერული გრავირების სამუშაო' : 'Laser engraving work by Napertskala')} fill priority sizes="(max-width: 1024px) 100vw, 48vw" className="object-cover"/><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-6 pt-20 pb-6"><p className="text-sm font-bold text-orange-300">{lang === 'ka' ? 'რეალური შესრულებული სამუშაო' : 'Real completed project'}</p></div></div></div> : <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-[2rem] border border-orange-400/20 bg-[radial-gradient(circle,rgba(249,115,22,.18),transparent_55%)]"><div className="absolute inset-0 spark-grid opacity-20"/><Icon className="relative h-36 w-36 text-orange-500" strokeWidth={1}/></div>}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0e0f11] py-16 sm:py-20"><div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[.72fr_1.28fr] lg:px-8"><div><p className="text-xs font-extrabold uppercase tracking-[.24em] text-orange-500">Napertskala</p><p className="mt-5 text-lg leading-8 text-zinc-400">{copy.summary}</p><div className="mt-7 space-y-3 text-sm font-bold text-zinc-300"><p className="flex items-center gap-3"><MapPin className="h-5 w-5 text-orange-500" />{ui.location}</p><p className="flex items-center gap-3"><Clock3 className="h-5 w-5 text-orange-500" />{ui.hours}</p></div></div><div><h2 className="mb-8 text-3xl font-black sm:text-5xl">{ui.details}</h2><div className="grid gap-3 sm:grid-cols-2">{copy.features.map(([title, description]) => <article key={title} className="rounded-2xl border border-white/10 bg-white/[.035] p-6"><CheckCircle2 className="mb-5 h-6 w-6 text-orange-500"/><h3 className="text-lg font-black">{title}</h3><p className="mt-3 leading-7 text-zinc-400">{description}</p></article>)}</div></div></div></section>

      <section className="py-20 sm:py-28"><div className="mx-auto max-w-7xl px-5 lg:px-8"><h2 className="text-4xl font-black sm:text-6xl">{ui.process}</h2><div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-4">{copy.process.map(([title, description], index) => { const StepIcon = [FileText, Ruler, Hammer, ShieldCheck][index]; return <article key={title} className="bg-[#090a0b] p-7"><div className="mb-8 flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-500 text-black"><StepIcon className="h-5 w-5"/></span><span className="text-sm font-black text-zinc-700">0{index + 1}</span></div><h3 className="text-xl font-black">{title}</h3><p className="mt-3 leading-7 text-zinc-400">{description}</p></article>})}</div></div></section>

      <section id="calculator" className="border-y border-white/10 bg-[#0e0f11] py-16 sm:py-20"><div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[.78fr_1.22fr] lg:items-center lg:px-8"><div><p className="mb-4 text-xs font-extrabold uppercase tracking-[.24em] text-orange-500">{ui.calculator}</p><h2 className="text-3xl font-black sm:text-5xl">{ui.calculator}</h2><p className="mt-5 text-lg leading-8 text-zinc-400">{ui.calculatorLead}</p></div><div className="rounded-3xl border border-dashed border-orange-500/35 bg-orange-500/[.06] p-6 sm:p-8"><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-orange-500 text-black"><Icon className="h-7 w-7"/></span><div><strong className="block text-xl font-black">{copy.title}</strong><p className="mt-2 leading-7 text-zinc-400">{ui.calculatorNote}</p></div></div></div></div></section>

      {(slug === 'welding' || slug === 'laser-cutting') && <section className="bg-[#111214] py-20 sm:py-28"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-3xl"><p className="mb-4 text-xs font-extrabold uppercase tracking-[.24em] text-orange-500">Portfolio</p><h2 className="text-4xl font-black sm:text-6xl">{ui.work}</h2><p className="mt-5 text-lg leading-8 text-zinc-400">{ui.workLead}</p></div><div className="flex flex-wrap items-center gap-3"><span className="mr-1 flex items-center gap-3 text-sm font-bold text-zinc-400"><span className="grid h-10 min-w-10 place-items-center rounded-full bg-orange-500 text-black">{visibleGallery.length}</span>{lang==='ka'?'ფოტო იცვლება ავტომატურად':'Photos change automatically'}</span><button type="button" onClick={()=>scrollGallery(-1)} className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-orange-500 hover:bg-orange-500 hover:text-black" aria-label={lang==='ka'?'წინა ფოტო':'Previous photo'}><ArrowLeft className="h-5 w-5"/></button><button type="button" onClick={()=>scrollGallery(1)} className="grid h-12 w-12 place-items-center rounded-full bg-orange-500 text-black transition hover:bg-orange-400" aria-label={lang==='ka'?'შემდეგი ფოტო':'Next photo'}><ArrowRight className="h-5 w-5"/></button></div></div><p className="mb-4 flex items-center gap-2 text-sm font-bold text-orange-300"><ArrowRight className="h-4 w-4"/>{lang==='ka'?'ფოტო ავტომატურად იცვლება ყოველ რამდენიმე წამში':'The photo advances automatically every few seconds'}</p><div ref={galleryRef} tabIndex={0} onKeyDown={(event)=>{if(event.key==='ArrowLeft')scrollGallery(-1);if(event.key==='ArrowRight')scrollGallery(1);}} className="gallery-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto rounded-3xl pb-5 outline-none focus-visible:ring-2 focus-visible:ring-orange-500" aria-label={ui.work}>{visibleGallery.map((item, index) => <figure data-gallery-photo key={`${item.src}-${index}`} className={`group relative aspect-[4/3] w-[86vw] max-w-[760px] shrink-0 snap-start overflow-hidden rounded-3xl border bg-black transition ${index===galleryIndex?'border-orange-500/60':'border-white/10'}`}><Image src={item.src} alt={lang === 'ka' ? item.ka : item.en} fill sizes="(max-width: 640px) 86vw, 760px" className="object-cover transition duration-500 group-hover:scale-105" unoptimized={item.src.startsWith('/api/')} /><div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-transparent"/><figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-7"><span className="mb-2 block text-[10px] font-black uppercase tracking-[.22em] text-orange-400">{String(index + 1).padStart(2,'0')} / {String(visibleGallery.length).padStart(2,'0')}</span><strong className="text-sm leading-6 sm:text-lg">{lang === 'ka' ? item.ka : item.en}</strong></figcaption></figure>)}</div><div className="mt-5 flex max-w-full gap-2 overflow-x-auto pb-2" aria-label={lang==='ka'?'ფოტოს არჩევა':'Choose photo'}>{visibleGallery.map((item,index)=><button type="button" key={`thumb-${item.src}-${index}`} onClick={()=>setGalleryIndex(index)} className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${galleryIndex===index?'border-orange-500 opacity-100':'border-transparent opacity-50 hover:opacity-90'}`} aria-label={`${lang==='ka'?'ფოტო':'Photo'} ${index+1}`}><Image src={item.src} alt="" fill sizes="96px" className="object-cover" unoptimized={item.src.startsWith('/api/')} /></button>)}</div></div></section>}

      <section className="py-20 sm:py-28"><div className="mx-auto max-w-7xl px-5 lg:px-8"><h2 className="mb-10 text-3xl font-black sm:text-5xl">{ui.other}</h2><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{serviceSlugs.filter((item) => item !== slug && serviceEnabled(item)).map((item) => { const OtherIcon = services[item].icon; return <a key={item} href={`/services/${item}`} className="group relative rounded-3xl border border-white/10 bg-white/[.035] p-7 transition hover:-translate-y-1 hover:border-orange-500/40"><OtherIcon className="mb-8 h-9 w-9 text-orange-500"/><h3 className="pr-10 text-xl font-black">{services[item][lang].title}</h3><ArrowRight className="absolute right-7 bottom-7 h-5 w-5 text-orange-500 transition group-hover:translate-x-1"/></a>})}</div></div></section>

      <section className="px-5 pb-24 lg:px-8"><div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-orange-500 p-8 text-black sm:p-14"><div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[48px] border-black/5"/><div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end"><div><h2 className="max-w-3xl text-4xl font-black leading-tight sm:text-6xl">{ui.cta}</h2><p className="mt-5 max-w-2xl text-lg font-medium text-black/70">{ui.ctaText}</p></div><div className="flex flex-col gap-3"><a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex h-14 min-w-64 items-center justify-center gap-2 rounded-full bg-black px-7 font-bold text-white hover:bg-zinc-900"><MessageCircle className="h-5 w-5 text-[#25D366]"/>{ui.whatsapp}</a><a href={`tel:${phone}`} className="inline-flex h-14 items-center justify-center gap-2 rounded-full border-2 border-black/20 px-7 font-extrabold"><Phone className="h-5 w-5"/>{phone}</a></div></div></div></section>

      <footer className="border-t border-white/10 py-10"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 sm:flex-row sm:items-center sm:justify-between lg:px-8"><a href="/" className="flex items-center gap-3"><Image src={logoSrc} alt="Napertskala" width={42} height={42} className="h-11 w-11 rounded-full object-cover" unoptimized={logoSrc.startsWith('/api/')}/><div><strong className="block">ნაპერწკალა / Napertskala</strong><span className="text-xs text-zinc-500">Welding & technical services</span></div></a><p className="text-sm text-zinc-500">{ui.location} · {ui.hours}</p></div></footer>
      <a href={whatsapp} target="_blank" rel="noreferrer" aria-label={ui.whatsapp} className="fixed right-5 bottom-5 z-40 flex h-14 items-center gap-3 rounded-full bg-[#25D366] px-4 text-sm font-black text-black shadow-[0_12px_40px_rgba(37,211,102,.3)] transition hover:scale-105 sm:pr-6"><MessageCircle className="h-6 w-6"/><span className="hidden sm:inline">WhatsApp</span></a>
    </main>
  );
}
