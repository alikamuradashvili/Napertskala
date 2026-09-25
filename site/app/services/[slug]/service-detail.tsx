'use client';

import {
  ArrowLeft,
  ArrowRight,
  Calculator as CalculatorIcon,
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
  Truck,
  Wrench,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import AccountLink from '@/components/account-link';
import { builtInServicePhotos, parseHiddenBuiltInPhotos, serviceSlugs, serviceVisibilityKey, type ServiceSlug } from '@/lib/services';

type Lang = 'ka' | 'en';
type GalleryItem = {id:string;filename:string;alt_ka:string;alt_en:string;url:string};
type SiteCms = {settings:Record<string,string>;gallery:GalleryItem[];galleries:Record<ServiceSlug,GalleryItem[]>};

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
  towing: {
    icon: Truck,
    ka: {
      label: 'ავტომობილის გადაყვანა',
      title: 'ევაკუატორით მომსახურება',
      lead: 'Mercedes-Benz Sprinter ევაკუატორით დაზიანებული, გაუმართავი ან არამოძრავი ავტომობილის უსაფრთხოდ გადაყვანა გორში და სხვა ლოკაციებზე.',
      summary: 'ფასი ითვლება გასვლის, მანძილის, ავტომობილის მდგომარეობისა და ჩატვირთვის სირთულის მიხედვით.',
      features: [['ავტომობილის გადაყვანა', 'მსუბუქი ავტომობილის უსაფრთხო ტრანსპორტირება.'], ['გაუმართაობისას დახმარება', 'გზაზე გაფუჭებული ავტომობილის გადაყვანა სასურველ ადგილამდე.'], ['გორი და სხვა ლოკაციები', 'გასვლა წინასწარი შეთანხმებით.'], ['ფასის წინასწარი შეფასება', 'მოგვწერეთ ადგილმდე მანძილი და ავტომობილის მდგომარეობა.']],
      process: [['დაგვიკავშირდით', 'გვითხარით ავტომობილის მარკა, მდგომარეობა და ზუსტი ლოკაცია.'], ['ფასის შეფასება', 'ვაზუსტებთ მანძილსა და ჩატვირთვის პირობებს.'], ['გასვლა', 'ევაკუატორი მოდის შეთანხმებულ დროს.'], ['გადაყვანა', 'ავტომობილი უსაფრთხოდ გადაგვყავს მითითებულ ადგილზე.']],
    },
    en: {
      label: 'Vehicle transport', title: 'Towing service',
      lead: 'Safe transport for damaged, disabled or non-running vehicles with our Mercedes-Benz Sprinter evacuator in Gori and other locations.',
      summary: 'Pricing depends on dispatch, distance, vehicle condition and loading difficulty.',
      features: [['Vehicle transport', 'Safe flatbed transport for passenger vehicles.'], ['Breakdown recovery', 'Transport from the roadside to your selected destination.'], ['Gori and other locations', 'Travel outside Gori is available by prior agreement.'], ['Price estimate', 'Send the route and vehicle condition for an initial estimate.']],
      process: [['Contact us', 'Send the vehicle make, condition and exact location.'], ['Estimate', 'We confirm distance and loading conditions.'], ['Dispatch', 'The tow truck arrives at the agreed time.'], ['Transport', 'We safely deliver the vehicle to the requested location.']],
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
];
const laserGallery = [
  { src: '/services/laser-cutting/engraved-skewer-set-grill-wide.jpeg', ka: 'ლაზერით გრავირებული შამფურების კომპლექტი მაყალთან', en: 'Laser engraved skewer set with grill', tall: false },
  { src: '/services/laser-cutting/engraved-skewer-set-grill-close.jpeg', ka: 'ქართული ორნამენტით გრავირებული შამფურები', en: 'Skewers engraved with Georgian ornament', tall: false },
  { src: '/services/laser-cutting/engraved-skewer-set-finished.jpeg', ka: 'გრავირებული შამფურის კომპლექტი', en: 'Engraved skewer set', tall: true },
  { src: '/services/laser-cutting/laser-engraving-process.jpeg', ka: 'ლაზერული გრავირების პროცესი', en: 'Laser engraving process', tall: false },
  { src: '/services/laser-cutting/motsamkvrelo-engraved-panel.jpeg', ka: 'ხეზე ამოტვიფრული დეკორატიული პანო', en: 'Engraved wooden decorative panel', tall: true },
  { src: '/services/laser-cutting/engraved-skewer-set-outdoor.jpeg', ka: 'საჩუქრის კომპლექტი ქართული ორნამენტით', en: 'Gift set with Georgian ornament', tall: false },
  { src: '/services/laser-cutting/motsamkvrelo-design-black-white.jpeg', ka: 'ლაზერისთვის მომზადებული დიზაინი', en: 'Design prepared for laser engraving', tall: true },
];
const serviceHeroImages: Record<ServiceSlug, { src: string; ka: string; en: string; real: boolean }> = {
  welding: { src: '/services/welding/canopy-frame-installation.jpg', ka: 'ნაპერწკალას მიერ დამზადებული ლითონის კონსტრუქცია', en: 'Steel structure fabricated by Napertskala', real: true },
  electrical: { src: '/services/electrical/electrical-panel-service.png', ka: 'ელექტრო მომსახურების სამუშაო', en: 'Electrical service work', real: false },
  'laser-cutting': { src: '/services/laser-cutting/laser-engraving-process.jpeg', ka: 'ნაპერწკალას ლაზერული გრავირების სამუშაო', en: 'Laser engraving work by Napertskala', real: true },
  excavator: { src: '/services/excavator/excavator-earthwork-service.png', ka: 'ექსკავატორით მიწის სამუშაოები', en: 'Excavator earthwork service', real: false },
  towing: { src: '/services/towing/mercedes-sprinter-tow-truck-service.png', ka: 'Mercedes-Benz Sprinter ევაკუატორი', en: 'Mercedes-Benz Sprinter towing service', real: false },
  diagnostics: { src: '/services/diagnostics/car-diagnostics-service.png', ka: 'ავტომობილის კომპიუტერული დიაგნოსტიკა', en: 'Car computer diagnostics service', real: false },
};
const labels = {
  ka: { back: 'მთავარზე დაბრუნება', details: 'რას ვაკეთებთ', process: 'როგორ ვმუშაობთ', calculator: 'კალკულატორი', calculatorLead: 'ამ სერვისის ინდივიდუალურ კალკულატორს შემდეგ ეტაპზე ავაწყობთ.', calculatorNote: 'აქ ჩაიდება ზომები, მასალა ან სხვა მონაცემები, რომლებიც ფასის დათვლას სჭირდება.', work: 'შესრულებული სამუშაოები', workLead: 'ფოტოებზე წარმოდგენილია ნაპერწკალას მიერ შესრულებული რეალური სამუშაოები.', other: 'სერვისები', call: 'დაგვირეკეთ', whatsapp: 'მოგვწერეთ WhatsApp-ზე', cta: 'განიხილეთ თქვენი სამუშაო ჩვენთან', ctaText: 'გამოგვიგზავნეთ ფოტო, ზომები ან მოკლე აღწერა და დაგიკავშირდებით პირობების შესათანხმებლად.', location: 'გორი • სხვა ლოკაციები შეთანხმებით', hours: 'ყოველდღე • 10:00–23:00' },
  en: { back: 'Back to home', details: 'What we do', process: 'How we work', calculator: 'Calculator', calculatorLead: 'We will build the individual calculator for this service in the next step.', calculatorNote: 'This area will contain dimensions, material or other inputs needed for price calculation.', work: 'Completed work', workLead: 'These photos show real projects completed by Napertskala.', other: 'Services', call: 'Call us', whatsapp: 'Message on WhatsApp', cta: 'Tell us about your job', ctaText: 'Send photos, dimensions or a short description and we will contact you to discuss the work.', location: 'Gori • Other locations by agreement', hours: 'Every day • 10:00–23:00' },
};
const defaultMapUrl = 'https://www.google.com/maps/place/%E1%83%9C%E1%83%90%E1%83%9E%E1%83%94%E1%83%A0%E1%83%AC%E1%83%99%E1%83%90%E1%83%9A%E1%83%90/@42.0474674,44.1001749,15.75z/data=!4m6!3m5!1s0x4044993500e2b44b:0x94ca73743c8ad05a!8m2!3d42.0486285!4d44.0977862!16s%2Fg%2F11zysksb52';
const servicePhoneKeys: Record<ServiceSlug, string> = {
  welding: 'phone_welding',
  electrical: 'phone_electrical',
  'laser-cutting': 'phone_laser_cutting',
  excavator: 'phone_excavator',
  towing: 'phone_towing',
  diagnostics: 'phone_diagnostics',
};
const defaultServicePhones: Record<ServiceSlug, string> = {
  welding: '+995574814088',
  electrical: '568 88 41 35',
  'laser-cutting': '568 88 41 35',
  excavator: '',
  towing: '',
  diagnostics: '568 88 41 35',
};
const toWhatsappNumber = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 9 && digits.startsWith('5') ? `995${digits}` : digits;
};

type CalculatorField = { key: string; ka: string; en: string; unitKa: string; unitEn: string; min: number; max: number; step: number; defaultValue: number };
type CalculatorChoiceOption = { value: string; ka: string; en: string; categories?: string[] };
type CalculatorChoice = { key: string; ka: string; en: string; dependsOn?: string; options: CalculatorChoiceOption[] };
type CalculatorPreset = {
  base: number;
  fields: CalculatorField[];
  choices?: CalculatorChoice[];
  ka: { title: string; lead: string; note: string; formula: string };
  en: { title: string; lead: string; note: string; formula: string };
  calculate: (values: Record<string, number>, choices: Record<string, string>) => number;
};

const calculatorPresets: Record<ServiceSlug, CalculatorPreset> = {
  welding: {
    base: 30,
    fields: [
      { key: 'areaSize', ka: 'ზომა / მოცულობა', en: 'Size / volume', unitKa: 'ერთ.', unitEn: 'unit', min: 1, max: 50, step: 1, defaultValue: 1 },
      { key: 'material', ka: 'მასალის საბაზრო ფასი', en: 'Market material cost', unitKa: '₾', unitEn: 'GEL', min: 0, max: 10000, step: 10, defaultValue: 150 },
      { key: 'complexity', ka: 'ნაკეთობის სირთულე', en: 'Build complexity', unitKa: '/5', unitEn: '/5', min: 1, max: 5, step: 1, defaultValue: 3 },
      { key: 'distance', ka: 'გასვლა გორიდან', en: 'Travel from Gori', unitKa: 'კმ', unitEn: 'km', min: 0, max: 300, step: 5, defaultValue: 0 },
    ],
    choices: [
      { key: 'category', ka: 'სამუშაოს კატეგორია', en: 'Work category', options: [
        { value: 'home_yard', ka: 'სახლი / ეზო (კვების ობიექტი, მცირე საწარმო)', en: 'Home / yard (food venue, small workshop)' },
        { value: 'factory', ka: 'ქარხანა / საწარმო', en: 'Factory / industrial' },
        { value: 'equipment', ka: 'ტექნიკა', en: 'Machinery' },
      ] },
      { key: 'item', ka: 'ქვეფილტრი / სამუშაო', en: 'Subcategory / work', dependsOn: 'category', options: [
        { value: 'repair', ka: 'მცირე შეკეთება', en: 'Small repair', categories: ['home_yard', 'equipment'] },
        { value: 'brazier', ka: 'მაყლის აწყობა', en: 'Brazier build', categories: ['home_yard'] },
        { value: 'gazebo', ka: 'ფანჩატურის აწყობა', en: 'Gazebo build', categories: ['home_yard'] },
        { value: 'railing', ka: 'მოაჯირი', en: 'Railing', categories: ['home_yard'] },
        { value: 'gate', ka: 'ჭიშკარი / კარი', en: 'Gate / door', categories: ['home_yard', 'factory'] },
        { value: 'stairs', ka: 'კიბე', en: 'Stairs', categories: ['home_yard', 'factory'] },
        { value: 'canopy', ka: 'ფარდული / გადახურვა', en: 'Canopy / cover', categories: ['home_yard', 'factory'] },
        { value: 'frame', ka: 'ლითონის ჩარჩო', en: 'Steel frame', categories: ['factory'] },
        { value: 'pipes', ka: 'მილები / კომუნიკაცია', en: 'Pipes / utility line', categories: ['factory'] },
        { value: 'factoryPart', ka: 'საწარმოს დეტალი', en: 'Factory part', categories: ['factory'] },
        { value: 'equipmentPart', ka: 'მძიმე ტექნიკის დეტალი', en: 'Heavy equipment part', categories: ['equipment', 'factory'] },
        { value: 'bucket', ka: 'კოვშის / სამაგრის დადუღება', en: 'Bucket / mount welding', categories: ['equipment'] },
      ] },
      { key: 'materialSource', ka: 'მასალა', en: 'Material', options: [
        { value: 'ours', ka: 'ჩვენი მასალით', en: 'Our material' },
        { value: 'client', ka: 'კლიენტის მოტანილი', en: 'Client brings material' },
      ] },
      { key: 'materialCondition', ka: 'მასალის მდგომარეობა', en: 'Material condition', options: [
        { value: 'new', ka: 'ახალი', en: 'New' },
        { value: 'used', ka: 'მეორადი', en: 'Used' },
      ] },
    ],
    ka: {
      title: 'შედუღების უხეში ფასის კალკულატორი',
      lead: 'აირჩიეთ სამუშაოს კატეგორია, ქვეფილტრი, მასალა, ზომა, სირთულე და გასვლის მანძილი.',
      note: 'ეს არის დაახლოებითი უხეში დათვლა. შედუღების საბოლოო ფასი მაინც ინდივიდუალურად ზუსტდება ფოტოს, ზომების, მასალის, დატვირთვის და ადგილზე პირობების მიხედვით. თუ ჩვენი მასალით ვაწყობთ, მუდმივი პარტნიორი კომპანია მასალას შეღავათიან ფასად გვაძლევს, ამიტომ ხშირად კლიენტისთვის უფრო იაფი გამოდის, ვიდრე ცალკე ყიდვა.',
      formula: 'ფასი ითვლება მინიმუმიდან + სამუშაოს მოცულობა × ნივთის ტარიფი × კატეგორიის/სირთულის კოეფიციენტი + მასალა + გასვლა. მძიმე ტექნიკა იწყება 100₾-დან.',
    },
    en: {
      title: 'Rough welding price calculator',
      lead: 'Choose category, subcategory, material, size, complexity and travel distance.',
      note: 'This is a rough initial estimate. Final welding price is still confirmed individually from photos, dimensions, material, load and site conditions. When we build with our material, a long-term partner company gives us discounted material prices, so it can often be cheaper for the customer than buying separately.',
      formula: 'Price uses a minimum + work volume × item rate × category/complexity factor + material + travel. Heavy equipment starts from 100 GEL.',
    },
    calculate: (v, c) => {
      const starts: Record<string, number> = { repair: 30, brazier: 60, gazebo: 180, railing: 80, gate: 100, stairs: 150, canopy: 180, frame: 120, pipes: 120, factoryPart: 200, equipmentPart: 100, bucket: 120 };
      const volumeRates: Record<string, number> = { repair: 35, brazier: 55, gazebo: 120, railing: 65, gate: 85, stairs: 120, canopy: 130, frame: 80, pipes: 90, factoryPart: 130, equipmentPart: 140, bucket: 160 };
      const categoryFactors: Record<string, number> = { home_yard: 1, factory: 1.35, equipment: 1.45 };
      const complexityFactor = 0.85 + (v.complexity || 1) * 0.15;
      const conditionFactor = c.materialCondition === 'used' ? 1.1 : 1;
      const item = c.item || 'repair';
      const labor = (v.areaSize || 1) * (volumeRates[item] || 60) * (categoryFactors[c.category] || 1) * complexityFactor * conditionFactor;
      const material = c.materialSource === 'client' ? 0 : (v.material || 0) * (c.materialCondition === 'used' ? 0.68 : 0.88);
      const materialHandling = c.materialSource === 'client' ? (c.materialCondition === 'used' ? 20 : 0) : (v.material ? 15 : 0);
      return (starts[item] || 50) + labor + material + materialHandling + (v.distance || 0) * 1.5;
    },
  },
  electrical: {
    base: 25,
    fields: [
      { key: 'points', ka: 'წერტილების რაოდენობა', en: 'Electrical points', unitKa: 'ც', unitEn: 'pcs', min: 1, max: 120, step: 1, defaultValue: 4 },
      { key: 'hours', ka: 'დიაგნოსტიკა/მონტაჟი', en: 'Diagnostics/install hours', unitKa: 'სთ', unitEn: 'h', min: 0, max: 30, step: 1, defaultValue: 1 },
      { key: 'material', ka: 'მასალის ღირებულება', en: 'Material cost', unitKa: '₾', unitEn: 'GEL', min: 0, max: 5000, step: 10, defaultValue: 80 },
    ],
    choices: [
      { key: 'workType', ka: 'სამუშაოს ტიპი', en: 'Work type', options: [
        { value: 'new_only', ka: 'მხოლოდ ახალი მონტაჟი', en: 'New installation only' },
        { value: 'old_demolition_new', ka: 'ძველის დემონტაჟი + ახალი მონტაჟი', en: 'Remove old + install new' },
      ] },
    ],
    ka: { title: 'ელექტრო მომსახურების კალკულატორი', lead: 'აირჩიეთ მხოლოდ ახალი მონტაჟია თუ ძველის დემონტაჟიც საჭიროა, შემდეგ დათვალეთ წერტილები, სამუშაო დრო და მასალა.', note: 'ქარხნის, სამფაზიანი სისტემისა და რთული გაუმართაობის ფასი ინდივიდუალურად ზუსტდება.', formula: 'მხოლოდ ახალი: 25₾ დაწყება + 25₾/წერტილი + 45₾/სთ + მასალა. დემონტაჟი + ახალი: 35₾ დაწყება + 45₾/წერტილი + 60₾/სთ + მასალა' },
    en: { title: 'Electrical service calculator', lead: 'Choose whether this is new installation only or removing old wiring before new installation, then estimate points, work time and material.', note: 'Factory, three-phase and complex fault work is confirmed individually.', formula: 'New only: 25 GEL start + 25 GEL/point + 45 GEL/hour + material. Remove old + new: 35 GEL start + 45 GEL/point + 60 GEL/hour + material' },
    calculate: (v, c) => c.workType === 'old_demolition_new'
      ? 35 + v.points * 45 + v.hours * 60 + v.material
      : 25 + v.points * 25 + v.hours * 45 + v.material,
  },
  'laser-cutting': {
    base: 20,
    fields: [
      { key: 'width', ka: 'სიგანე', en: 'Width', unitKa: 'სმ', unitEn: 'cm', min: 5, max: 100, step: 1, defaultValue: 30 },
      { key: 'height', ka: 'სიმაღლე', en: 'Height', unitKa: 'სმ', unitEn: 'cm', min: 5, max: 100, step: 1, defaultValue: 40 },
      { key: 'quantity', ka: 'რაოდენობა', en: 'Quantity', unitKa: 'ც', unitEn: 'pcs', min: 1, max: 10000, step: 1, defaultValue: 1 },
      { key: 'design', ka: 'დიზაინის მომზადება', en: 'Design preparation', unitKa: '₾', unitEn: 'GEL', min: 0, max: 500, step: 10, defaultValue: 30 },
    ],
    ka: { title: 'ლაზერული ჭრის და გრავირების კალკულატორი', lead: 'შეიყვანეთ ზომა, რაოდენობა და დიზაინის მომზადების ღირებულება.', note: 'მასალის ტიპი, სისქე და გრავირების სირთულე საბოლოო ფასს ცვლის.', formula: '20₾ დაწყება + ფართობი × რაოდენობა × 0.08₾ + დიზაინი' },
    en: { title: 'Laser cutting and engraving calculator', lead: 'Enter size, quantity and design preparation cost.', note: 'Material type, thickness and engraving complexity can change the final price.', formula: '20 GEL start + area × quantity × 0.08 GEL + design' },
    calculate: (v) => 20 + v.width * v.height * v.quantity * 0.08 + v.design,
  },
  excavator: {
    base: 80,
    fields: [
      { key: 'hours', ka: 'ტექნიკის მუშაობა', en: 'Machine hours', unitKa: 'სთ', unitEn: 'h', min: 1, max: 40, step: 1, defaultValue: 2 },
      { key: 'distance', ka: 'გასვლა გორიდან', en: 'Travel from Gori', unitKa: 'კმ', unitEn: 'km', min: 0, max: 300, step: 5, defaultValue: 0 },
      { key: 'loading', ka: 'დატვირთვა/გაწმენდა', en: 'Loading/cleanup', unitKa: 'სთ', unitEn: 'h', min: 0, max: 20, step: 1, defaultValue: 0 },
    ],
    ka: { title: 'ექსკავატორის მომსახურების კალკულატორი', lead: 'შეიყვანეთ სამუშაო საათები, გასვლა და დამატებითი დატვირთვა/გაწმენდა.', note: 'ფასი დამოკიდებულია მისასვლელზე, მიწის ტიპზე და სამუშაოს მოცულობაზე.', formula: '80₾ დაწყება + 120₾/სთ + 2₾/კმ + 70₾ დამატებითი საათი' },
    en: { title: 'Excavator service calculator', lead: 'Enter machine hours, travel and extra loading/cleanup time.', note: 'Price depends on access, soil type and job volume.', formula: '80 GEL start + 120 GEL/hour + 2 GEL/km + 70 GEL extra hour' },
    calculate: (v) => 80 + v.hours * 120 + v.distance * 2 + v.loading * 70,
  },
  towing: {
    base: 50,
    fields: [
      { key: 'distance', ka: 'გადაყვანის მანძილი', en: 'Transport distance', unitKa: 'კმ', unitEn: 'km', min: 0, max: 500, step: 1, defaultValue: 10 },
      { key: 'loading', ka: 'რთული ჩატვირთვა', en: 'Difficult loading', unitKa: 'სთ', unitEn: 'h', min: 0, max: 10, step: 1, defaultValue: 0 },
    ],
    ka: { title: 'ევაკუატორის ფასის კალკულატორი', lead: 'შეიყვანეთ გადაყვანის მანძილი და რთული ჩატვირთვის დრო.', note: 'ეს არის სავარაუდო ფასი; საბოლოო ღირებულება დამოკიდებულია ავტომობილის მდგომარეობასა და მისადგომზე.', formula: '50₾ გასვლა + 3₾/კმ + 40₾ რთული ჩატვირთვის საათზე' },
    en: { title: 'Towing price calculator', lead: 'Enter transport distance and difficult-loading time.', note: 'This is an estimate; final price depends on vehicle condition and access.', formula: '50 GEL dispatch + 3 GEL/km + 40 GEL per difficult-loading hour' },
    calculate: (v) => 50 + v.distance * 3 + v.loading * 40,
  },
  diagnostics: {
    base: 40,
    fields: [
      { key: 'scan', ka: 'კომპიუტერული დიაგნოსტიკა', en: 'Computer scan', unitKa: 'ც', unitEn: 'pcs', min: 1, max: 5, step: 1, defaultValue: 1 },
      { key: 'electrical', ka: 'ელექტრო შემოწმება', en: 'Electrical check', unitKa: 'სთ', unitEn: 'h', min: 0, max: 8, step: 1, defaultValue: 1 },
      { key: 'distance', ka: 'გასვლა', en: 'Travel', unitKa: 'კმ', unitEn: 'km', min: 0, max: 200, step: 5, defaultValue: 0 },
    ],
    ka: { title: 'ავტო დიაგნოსტიკის კალკულატორი', lead: 'დათვალეთ კომპიუტერული სკანი, ელექტრო შემოწმება და გასვლა.', note: 'ეს არ მოიცავს ყველა მექანიკურ შეკეთებას; საბოლოო ღირებულება პრობლემის მიხედვით ზუსტდება.', formula: '40₾ სკანი + 35₾/სთ ელექტრო შემოწმება + 1.5₾/კმ' },
    en: { title: 'Car diagnostics calculator', lead: 'Estimate computer scan, electrical check and travel.', note: 'This does not include every mechanical repair; final price depends on the problem.', formula: '40 GEL scan + 35 GEL/hour electrical check + 1.5 GEL/km' },
    calculate: (v) => v.scan * 40 + v.electrical * 35 + v.distance * 1.5,
  },
};

type WeldingField = { key: string; ka: string; en: string; unitKa: string; unitEn: string; min: number; max: number; step: number; defaultValue: number };
type WeldingItem = {
  value: string;
  ka: string;
  en: string;
  categories: string[];
  range: [number, number];
  fields: WeldingField[];
  measure: (values: Record<string, number>) => number;
};

const weldingCategories = [
  { value: 'home_yard', ka: 'სახლი / ეზო (კვების ობიექტი, მცირე საწარმო)', en: 'Home / yard (food venue, small workshop)' },
  { value: 'factory', ka: 'ქარხანა / საწარმო', en: 'Factory / industrial' },
  { value: 'equipment', ka: 'ტექნიკა', en: 'Machinery' },
];

const weldingItems: WeldingItem[] = [
  { value: 'repair', ka: 'მცირე შეკეთება', en: 'Small repair', categories: ['home_yard', 'equipment'], range: [30, 180], fields: [{ key: 'length', ka: 'დეტალის სიგრძე', en: 'Part length', unitKa: 'მ', unitEn: 'm', min: 0, max: 10, step: 0.1, defaultValue: 0.6 }, { key: 'width', ka: 'დეტალის სიგანე', en: 'Part width', unitKa: 'მ', unitEn: 'm', min: 0, max: 10, step: 0.1, defaultValue: 0.3 }], measure: (v) => Math.max(1, (v.length || 0) * (v.width || 0) / 0.25) },
  { value: 'brazier', ka: 'მაყლის აწყობა', en: 'Brazier build', categories: ['home_yard'], range: [350, 800], fields: [{ key: 'length', ka: 'სიგრძე', en: 'Length', unitKa: 'მ', unitEn: 'm', min: 0, max: 10, step: 0.1, defaultValue: 0.9 }, { key: 'width', ka: 'სიგანე', en: 'Width', unitKa: 'მ', unitEn: 'm', min: 0, max: 10, step: 0.1, defaultValue: 0.45 }, { key: 'height', ka: 'სიმაღლე', en: 'Height', unitKa: 'მ', unitEn: 'm', min: 0, max: 10, step: 0.1, defaultValue: 0.7 }], measure: (v) => Math.max(1, (2 * ((v.length || 0) * (v.width || 0) + (v.length || 0) * (v.height || 0) + (v.width || 0) * (v.height || 0))) / 2.3) },
  { value: 'gazebo', ka: 'ფანჩატურის აწყობა', en: 'Gazebo build', categories: ['home_yard'], range: [900, 4500], fields: [{ key: 'length', ka: 'სიგრძე', en: 'Length', unitKa: 'მ', unitEn: 'm', min: 0, max: 10, step: 0.1, defaultValue: 3 }, { key: 'width', ka: 'სიგანე', en: 'Width', unitKa: 'მ', unitEn: 'm', min: 0, max: 10, step: 0.1, defaultValue: 3 }], measure: (v) => Math.max(1, (v.length || 0) * (v.width || 0)) },
  { value: 'railing', ka: 'მოაჯირი', en: 'Railing', categories: ['home_yard'], range: [120, 1600], fields: [{ key: 'length', ka: 'მოაჯირის სიგრძე', en: 'Railing length', unitKa: 'მ', unitEn: 'm', min: 0, max: 10, step: 0.1, defaultValue: 4 }, { key: 'height', ka: 'სიმაღლე', en: 'Height', unitKa: 'მ', unitEn: 'm', min: 0, max: 10, step: 0.1, defaultValue: 1 }], measure: (v) => Math.max(1, (v.length || 0) * (v.height || 1)) },
  { value: 'gate', ka: 'ჭიშკარი / კარი', en: 'Gate / door', categories: ['home_yard', 'factory'], range: [350, 8000], fields: [{ key: 'width', ka: 'სიგანე', en: 'Width', unitKa: 'მ', unitEn: 'm', min: 0, max: 10, step: 0.1, defaultValue: 1 }, { key: 'height', ka: 'სიმაღლე', en: 'Height', unitKa: 'მ', unitEn: 'm', min: 0, max: 10, step: 0.1, defaultValue: 2 }], measure: (v) => Math.max(1, (v.width || 0) * (v.height || 0)) },
  { value: 'stairs', ka: 'კიბე', en: 'Stairs', categories: ['home_yard', 'factory'], range: [700, 5000], fields: [{ key: 'steps', ka: 'საფეხურები', en: 'Steps', unitKa: 'ც', unitEn: 'pcs', min: 3, max: 40, step: 1, defaultValue: 10 }, { key: 'width', ka: 'სიგანე', en: 'Width', unitKa: 'მ', unitEn: 'm', min: 0, max: 10, step: 0.1, defaultValue: 1 }], measure: (v) => Math.max(1, (v.steps || 0) * (v.width || 1) / 3) },
  { value: 'canopy', ka: 'ფარდული / გადახურვა', en: 'Canopy / cover', categories: ['home_yard', 'factory'], range: [800, 1600], fields: [{ key: 'length', ka: 'სიგრძე', en: 'Length', unitKa: 'მ', unitEn: 'm', min: 0, max: 10, step: 0.1, defaultValue: 6 }, { key: 'width', ka: 'სიგანე', en: 'Width', unitKa: 'მ', unitEn: 'm', min: 0, max: 10, step: 0.1, defaultValue: 6 }, { key: 'height', ka: 'სიმაღლე', en: 'Height', unitKa: 'მ', unitEn: 'm', min: 0, max: 10, step: 0.1, defaultValue: 2 }], measure: (v) => Math.max(1, (v.length || 0) * (v.width || 0) / 2.7 + ((v.length || 0) + (v.width || 0)) * (v.height || 0) / 5.5) },
  { value: 'frame', ka: 'ლითონის ჩარჩო', en: 'Steel frame', categories: ['factory'], range: [250, 4000], fields: [{ key: 'length', ka: 'სიგრძე', en: 'Length', unitKa: 'მ', unitEn: 'm', min: 0, max: 10, step: 0.1, defaultValue: 5 }, { key: 'width', ka: 'სიგანე', en: 'Width', unitKa: 'მ', unitEn: 'm', min: 0, max: 10, step: 0.1, defaultValue: 2 }], measure: (v) => Math.max(1, (v.length || 0) * (v.width || 0)) },
  { value: 'pipes', ka: 'მილები / კომუნიკაცია', en: 'Pipes / utility line', categories: ['factory'], range: [180, 2500], fields: [{ key: 'length', ka: 'მილების სიგრძე', en: 'Pipe length', unitKa: 'მ', unitEn: 'm', min: 0, max: 10, step: 0.1, defaultValue: 8 }, { key: 'joints', ka: 'შეერთებები', en: 'Joints', unitKa: 'ც', unitEn: 'pcs', min: 1, max: 80, step: 1, defaultValue: 4 }], measure: (v) => Math.max(1, (v.length || 0) / 3 + (v.joints || 0) / 2) },
  { value: 'factoryPart', ka: 'საწარმოს დეტალი', en: 'Factory part', categories: ['factory'], range: [250, 4500], fields: [{ key: 'length', ka: 'დეტალის სიგრძე', en: 'Part length', unitKa: 'მ', unitEn: 'm', min: 0, max: 10, step: 0.1, defaultValue: 1.2 }, { key: 'width', ka: 'დეტალის სიგანე', en: 'Part width', unitKa: 'მ', unitEn: 'm', min: 0, max: 10, step: 0.1, defaultValue: 0.8 }], measure: (v) => Math.max(1, (v.length || 0) * (v.width || 0) / 0.35) },
  { value: 'equipmentPart', ka: 'მძიმე ტექნიკის დეტალი', en: 'Heavy equipment part', categories: ['equipment', 'factory'], range: [100, 3500], fields: [{ key: 'length', ka: 'დეტალის სიგრძე', en: 'Part length', unitKa: 'მ', unitEn: 'm', min: 0, max: 10, step: 0.1, defaultValue: 1 }, { key: 'width', ka: 'დეტალის სიგანე', en: 'Part width', unitKa: 'მ', unitEn: 'm', min: 0, max: 10, step: 0.1, defaultValue: 0.6 }], measure: (v) => Math.max(1, (v.length || 0) * (v.width || 0) / 0.3) },
  { value: 'bucket', ka: 'კოვშის / სამაგრის დადუღება', en: 'Bucket / mount welding', categories: ['equipment'], range: [120, 4000], fields: [{ key: 'length', ka: 'დაზიანებული ადგილის სიგრძე', en: 'Damaged area length', unitKa: 'მ', unitEn: 'm', min: 0, max: 10, step: 0.1, defaultValue: 0.8 }, { key: 'width', ka: 'დაზიანებული ადგილის სიგანე', en: 'Damaged area width', unitKa: 'მ', unitEn: 'm', min: 0, max: 10, step: 0.1, defaultValue: 0.4 }], measure: (v) => Math.max(1, (v.length || 0) * (v.width || 0) / 0.22) },
  { value: 'custom', ka: 'სხვა შეკვეთა', en: 'Custom order', categories: ['home_yard', 'factory', 'equipment'], range: [100, Infinity], fields: [{ key: 'length', ka: 'სიგრძე', en: 'Length', unitKa: 'მ', unitEn: 'm', min: 0, max: 10, step: 0.1, defaultValue: 2 }, { key: 'width', ka: 'სიგანე', en: 'Width', unitKa: 'მ', unitEn: 'm', min: 0, max: 10, step: 0.1, defaultValue: 1 }], measure: (v) => Math.max(1, (v.length || 0) * (v.width || 1)) },
];

function WeldingPriceCalculator({ lang, whatsapp }: { lang: Lang; whatsapp: string }) {
  const [category, setCategory] = useState('home_yard');
  const items = weldingItems.filter((item) => item.categories.includes(category));
  const [itemValue, setItemValue] = useState(items[0]?.value ?? 'repair');
  const selectedItem = items.find((item) => item.value === itemValue) ?? items[0] ?? weldingItems[0];
  const [materialSource, setMaterialSource] = useState<'ours' | 'client'>('ours');
  const [materialCondition, setMaterialCondition] = useState<'new' | 'used'>('new');
  const [values, setValues] = useState<Record<string, number>>({});

  useEffect(() => { if (!items.some((item) => item.value === itemValue)) setItemValue(items[0]?.value ?? 'repair'); }, [items, itemValue]);
  useEffect(() => {
    setValues((current) => ({ ...Object.fromEntries(selectedItem.fields.map((field) => [field.key, field.defaultValue])), material: current.material ?? 250, complexity: current.complexity ?? 3, distance: current.distance ?? 0 }));
  }, [selectedItem]);

  const update = (key: string, value: number) => setValues((current) => ({ ...current, [key]: value }));
  const factorByCategory: Record<string, number> = { home_yard: 1, factory: 1.32, equipment: 1.42 };
  const complexityFactor = 0.85 + (values.complexity || 3) * 0.14;
  const conditionFactor = materialCondition === 'used' ? 1.5 : 1;
  const measure = selectedItem.measure(values);
  const scale = Math.min(2.4, Math.max(0.75, measure / 3));
  const material = materialSource === 'ours' ? (values.material || 0) * (materialCondition === 'used' ? 0.68 : 0.88) : 0;
  const travel = (values.distance || 0) * 1.5;
  const rawMin = (selectedItem.range[0] * scale * (factorByCategory[category] || 1) * complexityFactor + material + travel) * conditionFactor;
  const rawMax = (selectedItem.range[1] * scale * (factorByCategory[category] || 1) * (complexityFactor + 0.22) + material + travel) * conditionFactor;
  const gateWidth = values.width || 1;
  const gateHeight = values.height || 2;
  const gateArea = gateWidth * gateHeight;
  const gateSlidingExtra = Math.max(0, gateWidth - 4);
  const gateMin = (350 + Math.max(0, gateArea - 2) * 210 + gateSlidingExtra * 360) * (factorByCategory[category] || 1) * complexityFactor + material + travel;
  const gateMax = (520 + Math.max(0, gateArea - 2) * 300 + gateSlidingExtra * 450) * (factorByCategory[category] || 1) * (complexityFactor + 0.22) + material + travel;
  const cappedGateMin = Math.max(350, Math.min(8000, Math.round(gateMin * conditionFactor)));
  const minPrice = selectedItem.value === 'brazier' ? Math.max(350, Math.min(800, Math.round(rawMin))) : selectedItem.value === 'gate' ? cappedGateMin : Math.max(selectedItem.range[0], Math.round(rawMin));
  const maxPrice = selectedItem.value === 'brazier' ? Math.max(minPrice + 80, Math.min(800, Math.round(rawMax))) : selectedItem.value === 'gate' ? Math.max(minPrice, Math.min(8000, Math.round(gateMax * conditionFactor))) : Math.max(minPrice + 50, Math.round(rawMax));
  const priceRangeText = Number.isFinite(maxPrice) ? `${minPrice} - ${maxPrice} ₾` : `${minPrice}₾ - ∞`;
  const baseRangeText = Number.isFinite(selectedItem.range[1]) ? `${selectedItem.range[0]}-${selectedItem.range[1]}₾` : `${selectedItem.range[0]}₾ - ∞`;
  const sharedFields: WeldingField[] = [
    ...(materialSource === 'ours' ? [{ key: 'material', ka: 'მასალის საბაზრო ღირებულება', en: 'Market material cost', unitKa: '₾', unitEn: 'GEL', min: 0, max: 10000, step: 10, defaultValue: 250 }] : []),
    { key: 'complexity', ka: 'სირთულე', en: 'Complexity', unitKa: '/5', unitEn: '/5', min: 1, max: 5, step: 1, defaultValue: 3 },
    { key: 'distance', ka: 'გასვლა გორიდან', en: 'Travel from Gori', unitKa: 'კმ', unitEn: 'km', min: 0, max: 300, step: 5, defaultValue: 0 },
  ];
  const fields = [...selectedItem.fields, ...sharedFields];
  const message = encodeURIComponent(`${lang === 'ka' ? 'შედუღების ფასის რეინჯი' : 'Welding price range'}\n${lang === 'ka' ? 'კატეგორია' : 'Category'}: ${weldingCategories.find((item) => item.value === category)?.[lang]}\n${lang === 'ka' ? 'სამუშაო' : 'Work'}: ${selectedItem[lang]}\n${fields.map((field) => `${field[lang]}: ${values[field.key] ?? field.defaultValue} ${lang === 'ka' ? field.unitKa : field.unitEn}`).join('\n')}\n${lang === 'ka' ? 'დაახლოებით' : 'Approx'}: ${priceRangeText}`);

  return <section id="calculator" className="border-y border-white/10 bg-[#0e0f11] py-16 sm:py-20"><div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[.68fr_1.32fr] lg:items-start lg:px-8"><div><p className="mb-4 text-xs font-extrabold uppercase tracking-[.24em] text-orange-500">{lang === 'ka' ? 'ფასის რეინჯი' : 'Price range'}</p><h2 className="text-3xl font-black sm:text-5xl">{lang === 'ka' ? 'შედუღების უხეში კალკულატორი' : 'Rough welding calculator'}</h2><p className="mt-5 text-lg leading-8 text-zinc-400">{lang === 'ka' ? 'აირჩიეთ კატეგორია და ქვეფილტრი. კალკულატორი მხოლოდ იმ ზომებს გთხოვთ, რაც ამ კონკრეტულ სამუშაოს სჭირდება.' : 'Choose a category and subcategory. The calculator asks only for dimensions needed for that work.'}</p><p className="mt-5 rounded-2xl border border-orange-500/25 bg-orange-500/10 p-4 text-sm font-bold leading-6 text-orange-200">{lang === 'ka' ? 'ფასი ჩანს რეინჯად, რადგან საბოლოო ღირებულება მასალაზე, ადგილზე პირობებზე და ნახაზის/ფოტოს დეტალებზეა დამოკიდებული.' : 'Price is shown as a range because final cost depends on material, site conditions and photo/drawing details.'}</p></div><div className="rounded-3xl border border-white/10 bg-[#090a0b] p-5 shadow-2xl shadow-black/20 sm:p-7"><div className="space-y-4"><ChoiceBlock title={lang === 'ka' ? 'კატეგორია' : 'Category'} options={weldingCategories} value={category} onChange={setCategory} lang={lang} /><ChoiceBlock title={lang === 'ka' ? 'ქვეფილტრი / სამუშაო' : 'Subcategory / work'} options={items.map((item) => ({ value: item.value, ka: item.ka, en: item.en, meta: Number.isFinite(item.range[1]) ? `${item.range[0]}-${item.range[1]}₾` : `${item.range[0]}₾ - ∞` }))} value={selectedItem.value} onChange={setItemValue} lang={lang} /><ChoiceBlock title={lang === 'ka' ? 'მასალა' : 'Material'} options={[{ value: 'ours', ka: 'ჩვენი მასალით', en: 'Our material' }, { value: 'client', ka: 'კლიენტის მოტანილი', en: 'Client brings material' }]} value={materialSource} onChange={(value) => setMaterialSource(value as 'ours' | 'client')} lang={lang} /><ChoiceBlock title={lang === 'ka' ? 'მასალის მდგომარეობა' : 'Material condition'} options={[{ value: 'new', ka: 'ახალი', en: 'New' }, { value: 'used', ka: 'მეორადი', en: 'Used' }]} value={materialCondition} onChange={(value) => setMaterialCondition(value as 'new' | 'used')} lang={lang} /></div><div className="mt-5 grid gap-5 md:grid-cols-2">{fields.map((field) => <NumberField key={`${selectedItem.value}-${field.key}`} field={field} value={values[field.key] ?? field.defaultValue} lang={lang} onChange={(value) => update(field.key, value)} />)}</div><div className="mt-6 rounded-2xl bg-orange-500 p-5 text-black sm:flex sm:items-end sm:justify-between sm:gap-6"><div><span className="flex items-center gap-2 text-sm font-black uppercase tracking-[.18em] text-black/60"><CalculatorIcon className="h-4 w-4" />{lang === 'ka' ? 'დაახლოებით' : 'Approximate'}</span><strong className="mt-2 block text-4xl font-black">{priceRangeText}</strong><span className="mt-1 block text-sm font-black text-black/60">{baseRangeText} {lang === 'ka' ? 'საწყისი რეინჯი ამ სამუშაოზე' : 'base range for this work'}</span></div><a href={`${whatsapp}?text=${message}`} target="_blank" rel="noreferrer" className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-black text-white transition hover:bg-zinc-900 sm:mt-0 sm:w-auto"><MessageCircle className="h-5 w-5 text-[#25D366]" />{lang === 'ka' ? 'გაგზავნა WhatsApp-ზე' : 'Send on WhatsApp'}</a></div><p className="mt-4 text-sm leading-6 text-zinc-500">{lang === 'ka' ? 'ეს არის უხეში დათვლა. ჩვენი მასალით მუშაობისას პარტნიორი კომპანიის ფასდაკლება გათვალისწინებულია, ამიტომ ხშირად უფრო იაფი გამოდის. საბოლოო ფასი ზუსტდება ფოტოს, ზომების და სამუშაოს ნახვის შემდეგ.' : 'This is a rough estimate. When using our material, partner-company discounts are included, so it is often cheaper. Final price is confirmed after photos, dimensions and job review.'}</p></div></div></section>;
}

function ChoiceBlock({ title, options, value, onChange, lang }: { title: string; options: Array<{ value: string; ka: string; en: string; meta?: string }>; value: string; onChange: (value: string) => void; lang: Lang }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[.035] p-4"><span className="mb-3 block text-sm font-black">{title}</span><div className="flex flex-wrap gap-2">{options.map((option) => { const selected = value === option.value; return <button key={option.value} type="button" onClick={() => onChange(option.value)} className={`min-h-11 rounded-xl border px-3 py-2 text-left text-xs font-black leading-5 transition sm:text-sm ${selected ? 'border-orange-500 bg-orange-500 text-black shadow-lg shadow-orange-500/15' : 'border-white/10 bg-black/25 text-zinc-300 hover:border-orange-500/45 hover:text-white'}`}><span className="block">{lang === 'ka' ? option.ka : option.en}</span>{option.meta && <span className={`mt-1 block text-[10px] ${selected ? 'text-black/60' : 'text-orange-400'}`}>{option.meta}</span>}</button>; })}</div></div>;
}

function NumberField({ field, value, lang, onChange }: { field: WeldingField; value: number; lang: Lang; onChange: (value: number) => void }) {
  return <label className="block rounded-2xl border border-white/10 bg-white/[.035] p-4"><span className="flex items-center justify-between gap-3 text-sm font-black"><span>{field[lang]}</span><span className="text-orange-400">{value} {lang === 'ka' ? field.unitKa : field.unitEn}</span></span><input type="range" min={field.min} max={field.max} step={field.step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-4 w-full accent-orange-500" /><input type="number" min={field.min} max={field.max} step={field.step} value={value} onChange={(event) => onChange(Number(event.target.value) || 0)} className="mt-3 h-11 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-sm font-bold outline-none transition focus:border-orange-500" /></label>;
}

function PriceCalculator({ slug, lang, whatsapp }: { slug: ServiceSlug; lang: Lang; whatsapp: string }) {
  if (slug === 'welding') return <WeldingPriceCalculator lang={lang} whatsapp={whatsapp} />;
  const preset = calculatorPresets[slug];
  const [values, setValues] = useState<Record<string, number>>(() => Object.fromEntries(preset.fields.map((field) => [field.key, field.defaultValue])));
  const [choices, setChoices] = useState<Record<string, string>>(() => Object.fromEntries((preset.choices ?? []).map((choice) => [choice.key, choice.options[0]?.value ?? ''])));
  const visibleOptions = (choice: CalculatorChoice, source: Record<string, string>) => {
    const parentValue = choice.dependsOn ? source[choice.dependsOn] : '';
    return choice.dependsOn ? choice.options.filter((option) => !option.categories || option.categories.includes(parentValue)) : choice.options;
  };
  useEffect(() => {
    setValues(Object.fromEntries(preset.fields.map((field) => [field.key, field.defaultValue])));
    setChoices(Object.fromEntries((preset.choices ?? []).map((choice) => [choice.key, choice.options[0]?.value ?? ''])));
  }, [preset]);
  const copy = preset[lang];
  const activeChoices = (preset.choices ?? []).reduce<Record<string, string>>((current, choice) => {
    const options = visibleOptions(choice, current);
    current[choice.key] = options.some((option) => option.value === choices[choice.key]) ? choices[choice.key] : options[0]?.value ?? '';
    return current;
  }, {});
  const total = Math.max(0, Math.round(preset.calculate(values, activeChoices)));
  const update = (key: string, value: number) => setValues((current) => ({ ...current, [key]: value }));
  const updateChoice = (key: string, value: string) => setChoices((current) => {
    const next = { ...current, [key]: value };
    (preset.choices ?? []).forEach((choice) => {
      const options = visibleOptions(choice, next);
      if (options.length && !options.some((option) => option.value === next[choice.key])) next[choice.key] = options[0].value;
    });
    return next;
  });
  const fieldLines = preset.fields.map((field) => `${lang === 'ka' ? field.ka : field.en}: ${values[field.key] ?? 0} ${lang === 'ka' ? field.unitKa : field.unitEn}`);
  const choiceLines = (preset.choices ?? []).map((choice) => {
    const options = visibleOptions(choice, activeChoices);
    const option = options.find((item) => item.value === activeChoices[choice.key]) ?? options[0];
    return `${lang === 'ka' ? choice.ka : choice.en}: ${option ? (lang === 'ka' ? option.ka : option.en) : ''}`;
  });
  const message = encodeURIComponent(`${copy.title}\n${[...choiceLines, ...fieldLines].join('\n')}\n${lang === 'ka' ? 'დაახლოებით' : 'Approx'}: ${total} GEL`);

  return (
    <section id="calculator" className="border-y border-white/10 bg-[#0e0f11] py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[.72fr_1.28fr] lg:items-start lg:px-8">
        <div>
          <p className="mb-4 text-xs font-extrabold uppercase tracking-[.24em] text-orange-500">{lang === 'ka' ? 'ფასის კალკულატორი' : 'Price calculator'}</p>
          <h2 className="text-3xl font-black sm:text-5xl">{copy.title}</h2>
          <p className="mt-5 text-lg leading-8 text-zinc-400">{copy.lead}</p>
          <p className="mt-5 rounded-2xl border border-orange-500/25 bg-orange-500/10 p-4 text-sm font-bold leading-6 text-orange-200">{copy.formula}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-[#090a0b] p-5 shadow-2xl shadow-black/20 sm:p-7">
          {Boolean(preset.choices?.length) && <div className="mb-5 space-y-4">
            {preset.choices?.map((choice) => (
              <div key={choice.key} className="rounded-2xl border border-white/10 bg-white/[.035] p-4">
                <span className="mb-3 block text-sm font-black">{lang === 'ka' ? choice.ka : choice.en}</span>
                <div className="flex flex-wrap gap-2">
                  {visibleOptions(choice, activeChoices).map((option) => {
                    const selected = (activeChoices[choice.key] ?? option.value) === option.value;
                    return (
                      <button key={option.value} type="button" onClick={() => updateChoice(choice.key, option.value)} className={`min-h-11 rounded-xl border px-3 py-2 text-left text-xs font-black leading-5 transition sm:text-sm ${selected ? 'border-orange-500 bg-orange-500 text-black shadow-lg shadow-orange-500/15' : 'border-white/10 bg-black/25 text-zinc-300 hover:border-orange-500/45 hover:text-white'}`}>
                        {lang === 'ka' ? option.ka : option.en}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>}
          <div className="grid gap-5 md:grid-cols-2">
            {preset.fields.map((field) => {
              const value = values[field.key] ?? field.defaultValue;
              return (
                <label key={field.key} className="block rounded-2xl border border-white/10 bg-white/[.035] p-4">
                  <span className="flex items-center justify-between gap-3 text-sm font-black">
                    <span>{lang === 'ka' ? field.ka : field.en}</span>
                    <span className="text-orange-400">{value} {lang === 'ka' ? field.unitKa : field.unitEn}</span>
                  </span>
                  <input type="range" min={field.min} max={field.max} step={field.step} value={value} onChange={(event) => update(field.key, Number(event.target.value))} className="mt-4 w-full accent-orange-500" />
                  <input type="number" min={field.min} max={field.max} step={field.step} value={value} onChange={(event) => update(field.key, Number(event.target.value) || 0)} className="mt-3 h-11 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-sm font-bold outline-none transition focus:border-orange-500" />
                </label>
              );
            })}
          </div>
          <div className="mt-6 rounded-2xl bg-orange-500 p-5 text-black sm:flex sm:items-end sm:justify-between sm:gap-6">
            <div>
              <span className="flex items-center gap-2 text-sm font-black uppercase tracking-[.18em] text-black/60"><CalculatorIcon className="h-4 w-4" />{lang === 'ka' ? 'დაახლოებით' : 'Approximate'}</span>
              <strong className="mt-2 block text-4xl font-black">{total} ₾</strong>
            </div>
            <a href={`${whatsapp}?text=${message}`} target="_blank" rel="noreferrer" className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-black text-white transition hover:bg-zinc-900 sm:mt-0 sm:w-auto">
              <MessageCircle className="h-5 w-5 text-[#25D366]" />
              {lang === 'ka' ? 'გაგზავნა WhatsApp-ზე' : 'Send on WhatsApp'}
            </a>
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-500">{copy.note}</p>
        </div>
      </div>
    </section>
  );
}

export default function ServiceDetail({ slug }: { slug: ServiceSlug }) {
  const [lang, setLang] = useState<Lang>('ka');
  const galleryRef = useRef<HTMLDivElement>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [cms, setCms] = useState<SiteCms | null>(null);
  useEffect(() => { fetch('/api/site').then((r) => r.ok ? r.json() : null).then((value: unknown) => value && setCms(value as SiteCms)).catch(() => {}); }, []);
  const phone = cms?.settings?.[servicePhoneKeys[slug]] || defaultServicePhones[slug] || cms?.settings?.phone || '+995574814088';
  const whatsapp = `https://wa.me/${toWhatsappNumber(phone)}`;
  const mapUrl = cms?.settings?.map_url || defaultMapUrl;
  const logoSrc = cms?.settings?.logo_media_id ? `/api/media/${cms.settings.logo_media_id}` : '/logo.jpg';
  const service = services[slug];
  const copy = service[lang];
  const ui = labels[lang];
  const Icon = service.icon;
  const heroImage = serviceHeroImages[slug];
  const serviceEnabled = (value: ServiceSlug) => cms?.settings?.[serviceVisibilityKey(value)] !== 'false';
  const hiddenBuiltInPhotos = new Set(parseHiddenBuiltInPhotos(cms?.settings?.hidden_builtin_photos));
  const serviceGallery = builtInServicePhotos[slug].filter((item) => !hiddenBuiltInPhotos.has(item.src));
  const uploadedGallery = cms?.galleries?.[slug] ?? (slug === 'welding' ? cms?.gallery ?? [] : []);
  const visibleGallery = [...serviceGallery, ...uploadedGallery.map((item) => ({ src:item.url, ka:item.alt_ka || item.filename, en:item.alt_en || item.filename, tall:false }))];
  const scrollGallery = (direction: -1 | 1) => setGalleryIndex((current)=>(current+direction+visibleGallery.length)%visibleGallery.length);
  useEffect(() => { if(visibleGallery.length<2)return;const timer=window.setInterval(()=>setGalleryIndex((current)=>(current+1)%visibleGallery.length),3600);return()=>window.clearInterval(timer); }, [visibleGallery.length]);
  useEffect(() => { const container=galleryRef.current;if(!container)return;const items=container.querySelectorAll<HTMLElement>('[data-gallery-photo]');const first=items[0];const target=items[galleryIndex];if(first&&target)container.scrollTo({left:target.offsetLeft-first.offsetLeft,behavior:'smooth'}); }, [galleryIndex]);

  if(cms&&!serviceEnabled(slug))return <main className="grid min-h-screen place-items-center bg-[#090a0b] px-5 text-center text-white"><div className="max-w-xl"><Icon className="mx-auto h-16 w-16 text-orange-500"/><h1 className="mt-6 text-4xl font-black">{lang==='ka'?'სერვისი დროებით გამორთულია':'This service is temporarily unavailable'}</h1><p className="mt-4 leading-7 text-zinc-400">{lang==='ka'?'სხვა ხელმისაწვდომი სერვისების სანახავად დაბრუნდით მთავარ გვერდზე.':'Return to the homepage to see the services that are currently available.'}</p><a href="/" className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-orange-500 px-6 font-black text-black"><ArrowLeft className="h-4 w-4"/>{lang==='ka'?'მთავარ გვერდზე':'Back to homepage'}</a></div></main>;

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
            <div className="relative"><div className="absolute -inset-8 rounded-[3rem] bg-orange-500/10 blur-3xl"/><div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-orange-400/25"><Image src={heroImage.src} alt={lang === 'ka' ? heroImage.ka : heroImage.en} fill priority sizes="(max-width: 1024px) 100vw, 48vw" className="object-cover"/><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-6 pt-20 pb-6"><p className="text-sm font-bold text-orange-300">{heroImage.real ? (lang === 'ka' ? 'რეალური შესრულებული სამუშაო' : 'Real completed project') : (lang === 'ka' ? 'სერვისის ვიზუალური მაგალითი' : 'Service visual example')}</p></div></div></div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0e0f11] py-16 sm:py-20"><div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[.72fr_1.28fr] lg:px-8"><div><p className="text-xs font-extrabold uppercase tracking-[.24em] text-orange-500">Napertskala</p><p className="mt-5 text-lg leading-8 text-zinc-400">{copy.summary}</p><div className="mt-7 space-y-3 text-sm font-bold text-zinc-300"><a href={mapUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 transition hover:text-orange-400"><MapPin className="h-5 w-5 text-orange-500" />{ui.location}<span className="text-xs text-orange-400">Google Maps</span></a><p className="flex items-center gap-3"><Clock3 className="h-5 w-5 text-orange-500" />{ui.hours}</p></div></div><div><h2 className="mb-8 text-3xl font-black sm:text-5xl">{ui.details}</h2><div className="grid gap-3 sm:grid-cols-2">{copy.features.map(([title, description]) => <article key={title} className="rounded-2xl border border-white/10 bg-white/[.035] p-6"><CheckCircle2 className="mb-5 h-6 w-6 text-orange-500"/><h3 className="text-lg font-black">{title}</h3><p className="mt-3 leading-7 text-zinc-400">{description}</p></article>)}</div></div></div></section>

      <section className="py-20 sm:py-28"><div className="mx-auto max-w-7xl px-5 lg:px-8"><h2 className="text-4xl font-black sm:text-6xl">{ui.process}</h2><div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-4">{copy.process.map(([title, description], index) => { const StepIcon = [FileText, Ruler, Hammer, ShieldCheck][index]; return <article key={title} className="bg-[#090a0b] p-7"><div className="mb-8 flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-500 text-black"><StepIcon className="h-5 w-5"/></span><span className="text-sm font-black text-zinc-700">0{index + 1}</span></div><h3 className="text-xl font-black">{title}</h3><p className="mt-3 leading-7 text-zinc-400">{description}</p></article>})}</div></div></section>

      <PriceCalculator slug={slug} lang={lang} whatsapp={whatsapp} />

      {visibleGallery.length>0 && <section className="bg-[#111214] py-20 sm:py-28"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-3xl"><p className="mb-4 text-xs font-extrabold uppercase tracking-[.24em] text-orange-500">Portfolio</p><h2 className="text-4xl font-black sm:text-6xl">{ui.work}</h2><p className="mt-5 text-lg leading-8 text-zinc-400">{ui.workLead}</p></div><div className="flex flex-wrap items-center gap-3"><span className="mr-1 flex items-center gap-3 text-sm font-bold text-zinc-400"><span className="grid h-10 min-w-10 place-items-center rounded-full bg-orange-500 text-black">{visibleGallery.length}</span>{lang==='ka'?'ფოტო იცვლება ავტომატურად':'Photos change automatically'}</span><button type="button" onClick={()=>scrollGallery(-1)} className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-orange-500 hover:bg-orange-500 hover:text-black" aria-label={lang==='ka'?'წინა ფოტო':'Previous photo'}><ArrowLeft className="h-5 w-5"/></button><button type="button" onClick={()=>scrollGallery(1)} className="grid h-12 w-12 place-items-center rounded-full bg-orange-500 text-black transition hover:bg-orange-400" aria-label={lang==='ka'?'შემდეგი ფოტო':'Next photo'}><ArrowRight className="h-5 w-5"/></button></div></div><p className="mb-4 flex items-center gap-2 text-sm font-bold text-orange-300"><ArrowRight className="h-4 w-4"/>{lang==='ka'?'ფოტო ავტომატურად იცვლება ყოველ რამდენიმე წამში':'The photo advances automatically every few seconds'}</p><div ref={galleryRef} tabIndex={0} onKeyDown={(event)=>{if(event.key==='ArrowLeft')scrollGallery(-1);if(event.key==='ArrowRight')scrollGallery(1);}} className="gallery-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto rounded-3xl pb-5 outline-none focus-visible:ring-2 focus-visible:ring-orange-500" aria-label={ui.work}>{visibleGallery.map((item, index) => <figure data-gallery-photo key={`${item.src}-${index}`} className={`group relative aspect-[4/3] w-[86vw] max-w-[760px] shrink-0 snap-start overflow-hidden rounded-3xl border bg-black transition ${index===galleryIndex?'border-orange-500/60':'border-white/10'}`}><Image src={item.src} alt={lang === 'ka' ? item.ka : item.en} fill sizes="(max-width: 640px) 86vw, 760px" className="object-cover transition duration-500 group-hover:scale-105" unoptimized={item.src.startsWith('/api/')} /><div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-transparent"/><figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-7"><span className="mb-2 block text-[10px] font-black uppercase tracking-[.22em] text-orange-400">{String(index + 1).padStart(2,'0')} / {String(visibleGallery.length).padStart(2,'0')}</span><strong className="text-sm leading-6 sm:text-lg">{lang === 'ka' ? item.ka : item.en}</strong></figcaption></figure>)}</div><div className="mt-5 flex max-w-full gap-2 overflow-x-auto pb-2" aria-label={lang==='ka'?'ფოტოს არჩევა':'Choose photo'}>{visibleGallery.map((item,index)=><button type="button" key={`thumb-${item.src}-${index}`} onClick={()=>setGalleryIndex(index)} className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${galleryIndex===index?'border-orange-500 opacity-100':'border-transparent opacity-50 hover:opacity-90'}`} aria-label={`${lang==='ka'?'ფოტო':'Photo'} ${index+1}`}><Image src={item.src} alt="" fill sizes="96px" className="object-cover" unoptimized={item.src.startsWith('/api/')} /></button>)}</div></div></section>}

      <section className="py-20 sm:py-28"><div className="mx-auto max-w-7xl px-5 lg:px-8"><h2 className="mb-10 text-3xl font-black sm:text-5xl">{ui.other}</h2><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{serviceSlugs.filter((item) => item !== slug && serviceEnabled(item)).map((item) => { const OtherIcon = services[item].icon; return <a key={item} href={`/services/${item}`} className="group relative rounded-3xl border border-white/10 bg-white/[.035] p-7 transition hover:-translate-y-1 hover:border-orange-500/40"><OtherIcon className="mb-8 h-9 w-9 text-orange-500"/><h3 className="pr-10 text-xl font-black">{services[item][lang].title}</h3><ArrowRight className="absolute right-7 bottom-7 h-5 w-5 text-orange-500 transition group-hover:translate-x-1"/></a>})}</div></div></section>

      <section className="px-5 pb-24 lg:px-8"><div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-orange-500 p-8 text-black sm:p-14"><div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[48px] border-black/5"/><div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end"><div><h2 className="max-w-3xl text-4xl font-black leading-tight sm:text-6xl">{ui.cta}</h2><p className="mt-5 max-w-2xl text-lg font-medium text-black/70">{ui.ctaText}</p></div><div className="flex flex-col gap-3"><a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex h-14 min-w-64 items-center justify-center gap-2 rounded-full bg-black px-7 font-bold text-white hover:bg-zinc-900"><MessageCircle className="h-5 w-5 text-[#25D366]"/>{ui.whatsapp}</a><a href={`tel:${phone}`} className="inline-flex h-14 items-center justify-center gap-2 rounded-full border-2 border-black/20 px-7 font-extrabold"><Phone className="h-5 w-5"/>{phone}</a></div></div></div></section>

      <footer className="border-t border-white/10 py-10"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 sm:flex-row sm:items-center sm:justify-between lg:px-8"><a href="/" className="flex items-center gap-3"><Image src={logoSrc} alt="Napertskala" width={42} height={42} className="h-11 w-11 rounded-full object-cover" unoptimized={logoSrc.startsWith('/api/')}/><div><strong className="block">ნაპერწკალა / Napertskala</strong><span className="text-xs text-zinc-500">Welding & technical services</span></div></a><div className="text-sm text-zinc-500 sm:text-right"><p><a href={mapUrl} target="_blank" rel="noreferrer" className="transition hover:text-orange-400">{ui.location}</a> · {ui.hours}</p><a href="/privacy" className="mt-2 inline-block transition hover:text-orange-400">{lang === 'ka' ? 'კონფიდენციალურობის პოლიტიკა' : 'Privacy Policy'}</a></div></div></footer>
      <a href={whatsapp} target="_blank" rel="noreferrer" aria-label={ui.whatsapp} className="fixed right-5 bottom-5 z-40 flex h-14 items-center gap-3 rounded-full bg-[#25D366] px-4 text-sm font-black text-black shadow-[0_12px_40px_rgba(37,211,102,.3)] transition hover:scale-105 sm:pr-6"><MessageCircle className="h-6 w-6"/><span className="hidden sm:inline">WhatsApp</span></a>
    </main>
  );
}
