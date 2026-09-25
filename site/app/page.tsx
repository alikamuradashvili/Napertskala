'use client';

import { ArrowRight, Building2, Car, CheckCircle2, Clock3, Gift, Hammer, Languages, MapPin, Menu, MessageCircle, Phone, ShieldCheck, Truck, Wrench, X, Zap } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import AccountLink from '@/components/account-link';
import { serviceSlugs, serviceVisibilityKey, type ServiceSlug } from '@/lib/services';

type Lang = 'ka' | 'en';
type HomeCms = {content:Record<string,{ka:string;en:string}>;settings:Record<string,string>;gallery:Array<{url:string}>;galleries:Record<ServiceSlug,Array<{url:string}>>};

const content = {
  ka: {
    nav: ['მთავარი', 'სერვისები', 'ჩვენ შესახებ', 'კონტაქტი'], account: 'ადმინ პანელი',
    eyebrow: 'პროფესიონალური სამუშაო • გორი და მთელი საქართველო', titleA: 'ლითონს ვაძლევთ', titleB: 'ძლიერ ფორმას.',
    lead: 'ყველა ტიპის შედუღება, ელექტრო მომსახურება, ლაზერული ჭრა და ავტომობილის დიაგნოსტიკა — ერთი საიმედო გუნდისგან.',
    call: 'დაგვირეკეთ', quote: 'მოგვწერეთ WhatsApp-ზე', open: 'ვმუშაობთ ყოველდღე 10:00–23:00',
    stats: [['ყველა ტიპის', 'შედუღება'], ['სრული', 'ელექტრო სერვისი'], ['ადგილზე', 'გასვლა შეთანხმებით']],
    weldingEyebrow: 'მთავარი მიმართულება', weldingTitle: 'შედუღება, რომელიც უძლებს დროს',
    weldingText: 'ვმუშაობთ როგორც კერძო შეკვეთებზე, ისე სამშენებლო კომპანიებისა და საწარმოებისთვის. ვამზადებთ და ვაკეთებთ მონტაჟს ზუსტი მოთხოვნების მიხედვით.',
    weldingItems: ['ლითონის კონსტრუქციები', 'კიბეები, მოაჯირები და ჭიშკრები', 'მილები და სამრეწველო სამუშაოები', 'შეკეთება და ადგილზე შედუღება', 'სამშენებლო კომპანიების შეკვეთები', 'საწარმოების დამზადება და მონტაჟი'],
    servicesTitle: 'ყველა სერვისი ერთ სივრცეში', servicesLead: 'პრაქტიკული გადაწყვეტა სახლისთვის, ბიზნესისთვის და ავტომობილისთვის.',
    services: [['შედუღება', 'ყველა ტიპის შედუღება, კონსტრუქციების დამზადება, შეკეთება და მონტაჟი.', 'Welding'], ['ელექტრო მომსახურება', 'სახლის ელექტრობა, სამფაზიანი სისტეები, დიდი ქარხნების ელექტრო სამუშაოები და ელექტროძრავების მომსახურება.', 'Electrical'], ['ლაზერული ჭრა და გრავირება', 'ხის სუვენირები, საჩუქრები, დეკორატიული პანოები და პერსონალური გრავირება თქვენი დიზაინით.', 'Laser gifts'], ['ექსკავატორით მომსახურება', 'მიწის სამუშაოები, თხრილები, მოსწორება, დატვირთვა და ობიექტის მომზადება შეთანხმებით.', 'Excavator'], ['ევაკუატორით მომსახურება', 'ავტომობილის გადაყვანა გორში და სხვა ლოკაციებზე წინასწარი შეთანხმებით.', 'Towing'], ['ავტო დიაგნოსტიკა', 'ავტომობილის საბაზისო კომპიუტერული და ელექტრო დიაგნოსტიკა.', 'Diagnostics']],
    whyTitle: 'რატომ ნაპერწკალა?',
    why: [['ერთი გუნდი, ბევრი შესაძლებლობა', 'რთული ამოცანებისთვის რამდენიმე სპეციალისტის ძებნა აღარ დაგჭირდებათ.'], ['მობილური მომსახურება', 'ძირითადად გორში ვართ, თუმცა შეთანხმებით სხვა ლოკაციაზეც მოვალთ.'], ['კომპანიებთან თანამშრომლობა', 'ვიღებთ მასშტაბურ შეკვეთებს სამშენებლო კომპანიებისა და საწარმოებისთვის.'], ['ორენოვანი კომუნიკაცია', 'გესაუბრებით ქართულად და ინგლისურად.']],
    ctaTitle: 'გაქვთ სამუშაო? დავიწყოთ საუბარი.', ctaText: 'გამოგვიგზავნეთ ფოტო ან მოკლე აღწერა WhatsApp-ზე და მიიღეთ სწრაფი პასუხი.',
    location: 'გორი • სხვა ლოკაციები შეთანხმებით', hours: 'ყოველდღე • 10:00–23:00', footer: 'ნაპერწკალა — შედუღება და ტექნიკური მომსახურება', chat: 'მოგვწერეთ',
  },
  en: {
    nav: ['Home', 'Services', 'About', 'Contact'], account: 'Admin panel',
    eyebrow: 'Professional workmanship • Gori and across Georgia', titleA: 'We shape metal', titleB: 'to last.',
    lead: 'All types of welding, electrical services, laser cutting and basic car diagnostics — from one reliable team.',
    call: 'Call us', quote: 'Message on WhatsApp', open: 'Open daily 10:00–23:00',
    stats: [['All types of', 'welding'], ['Complete', 'electrical service'], ['On-site', 'visits by agreement']],
    weldingEyebrow: 'Our main expertise', weldingTitle: 'Welding built to stand the test of time',
    weldingText: 'We handle private jobs as well as projects for construction companies and factories, with fabrication and installation tailored to your requirements.',
    weldingItems: ['Metal structures', 'Stairs, railings and gates', 'Pipe and industrial welding', 'Repairs and mobile welding', 'Construction company projects', 'Factory fabrication and installation'],
    servicesTitle: 'Every service in one place', servicesLead: 'Practical technical solutions for your home, business and vehicle.',
    services: [['Welding', 'All welding types, custom metal fabrication, repair and installation.', 'Welding'], ['Electrical services', 'Home wiring, three-phase systems, electrical work for large factories and electric-motor service.', 'Electrical'], ['Laser cutting & engraving', 'Wooden souvenirs, gifts, decorative panels and personalized engraving made from your design.', 'Laser gifts'], ['Excavator service', 'Earthworks, trenches, leveling, loading and site preparation by agreement.', 'Excavator'], ['Towing service', 'Vehicle transport in Gori and other locations by prior agreement.', 'Towing'], ['Car diagnostics', 'Basic computer and electrical diagnostics for passenger vehicles.', 'Diagnostics']],
    whyTitle: 'Why Napertskala?',
    why: [['One team, many capabilities', 'No need to coordinate several specialists for a complex technical job.'], ['Mobile service', 'Based in Gori, with travel to other locations available by agreement.'], ['Built for business', 'We take on larger projects for construction companies and factories.'], ['Bilingual communication', 'We can assist you in Georgian and English.']],
    ctaTitle: 'Have a job in mind? Let’s talk.', ctaText: 'Send a photo or a short description on WhatsApp and get a quick response.',
    location: 'Gori • Other locations by agreement', hours: 'Every day • 10:00–23:00', footer: 'Napertskala — welding and technical services', chat: 'Chat with us',
  },
};

const defaultFacebook = 'https://www.facebook.com/profile.php?id=61589481147761';
const defaultMapUrl = 'https://www.google.com/maps/place/%E1%83%9C%E1%83%90%E1%83%9E%E1%83%94%E1%83%A0%E1%83%AC%E1%83%99%E1%83%90%E1%83%9A%E1%83%90/@42.0474674,44.1001749,15.75z/data=!4m6!3m5!1s0x4044993500e2b44b:0x94ca73743c8ad05a!8m2!3d42.0486285!4d44.0977862!16s%2Fg%2F11zysksb52';
const satelliteMapUrl = 'https://www.google.com/maps/@?api=1&map_action=map&center=42.0486285%2C44.0977862&zoom=19&basemap=satellite';
const mapEmbedUrl = 'https://maps.google.com/maps?q=42.0486285%2C44.0977862&t=k&z=18&output=embed';
const weldingSlides = [
  '/services/welding/canopy-frame-installation.jpg',
  '/services/welding/equipment-bucket-repair-2.jpg',
  '/services/welding/spiral-staircase-complete.jpg',
  '/services/welding/industrial-frame-fabrication-2.jpg',
  '/services/welding/canopy-beams-fabrication.jpg',
  '/services/welding/equipment-bucket-repair-1.jpg',
  '/services/welding/canopy-frame-complete.jpg',
  '/services/welding/industrial-frame-fabrication-1.jpg',
  '/services/welding/canopy-frame-progress.jpg',
  '/services/welding/spiral-staircase-detail.jpg',
  '/services/welding/industrial-frame-fabrication-3.jpg',
  '/services/welding/canopy-frame-painted.jpg',
];
const laserSlides = [
  '/services/laser-cutting/engraved-skewer-set-finished.jpeg',
  '/services/laser-cutting/laser-engraving-process.jpeg',
  '/services/laser-cutting/motsamkvrelo-engraved-panel.jpeg',
  '/services/laser-cutting/engraved-skewer-set-outdoor.jpeg',
  '/services/laser-cutting/motsamkvrelo-design-black-white.jpeg',
];
const electricalSlides = ['/services/electrical/electrical-panel-service.png'];
const excavatorSlides = ['/services/excavator/excavator-earthwork-service.png'];
const towingSlides = ['/services/towing/mercedes-sprinter-tow-truck-service.png'];
const diagnosticsSlides = ['/services/diagnostics/car-diagnostics-service.png'];

export default function Home() {
  const [lang, setLang] = useState<Lang>('ka');
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicePhotoIndex, setServicePhotoIndex] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [cms, setCms] = useState<HomeCms | null>(null);
  useEffect(() => { fetch('/api/site').then((r) => r.ok ? r.json() : null).then((value:unknown) => value && setCms(value as HomeCms)).catch(() => {}); }, []);
  const rotatingWeldingPhotos = [...weldingSlides, ...(cms?.gallery ?? []).map((item)=>item.url)];
  const servicePhotoGroups: Record<string, string[]> = { welding: rotatingWeldingPhotos, electrical: electricalSlides, 'laser-cutting': laserSlides, excavator: excavatorSlides, towing: towingSlides, diagnostics: diagnosticsSlides };
  useEffect(() => { const timer=window.setInterval(()=>setServicePhotoIndex((current)=>(current+1)%rotatingWeldingPhotos.length),3200); return()=>window.clearInterval(timer); }, [rotatingWeldingPhotos.length]);
  const pick = (key:string, fallback:string) => cms?.content?.[key]?.[lang] || fallback;
  const t = { ...content[lang], titleA: pick('hero_title_a', content[lang].titleA), titleB: pick('hero_title_b', content[lang].titleB), lead: pick('hero_lead', content[lang].lead), weldingTitle: pick('welding_title', content[lang].weldingTitle), weldingText: pick('welding_text', content[lang].weldingText), servicesTitle: pick('services_title', content[lang].servicesTitle), ctaTitle: pick('cta_title', content[lang].ctaTitle), ctaText: pick('cta_text', content[lang].ctaText), hours: cms?.settings?.hours || content[lang].hours, location: cms?.settings?.location || content[lang].location };
  const facebook = cms?.settings?.facebook || defaultFacebook;
  const mapUrl = cms?.settings?.map_url || defaultMapUrl;
  const logoSrc = cms?.settings?.logo_media_id ? `/api/media/${cms.settings.logo_media_id}` : '/logo.jpg';
  const heroSrc = cms?.settings?.hero_media_id ? `/api/media/${cms.settings.hero_media_id}` : logoSrc;
  const icons = [Wrench, Zap, Gift, Hammer, Truck, Car];
  const serviceEnabled = (slug: ServiceSlug) => cms?.settings?.[serviceVisibilityKey(slug)] !== 'false';
  const servicePhotos = (slug: ServiceSlug) => {if(slug==='welding')return rotatingWeldingPhotos;const uploaded=(cms?.galleries?.[slug]??[]).map(item=>item.url);return [...(servicePhotoGroups[slug]??[]),...uploaded];};
  const navTargets = ['home', 'services', 'about', 'contact'];
  const go = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); };
  useEffect(() => {
    const updateActiveSection = () => {
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 80) {
        setActiveSection('contact');
        return;
      }
      const viewportStart = 96;
      const viewportEnd = window.innerHeight;
      const current = navTargets.reduce((active, id) => {
        const element = document.getElementById(id);
        if (!element) return active;
        const rect = element.getBoundingClientRect();
        const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportEnd) - Math.max(rect.top, viewportStart));
        if (visibleHeight <= active.visibleHeight) return active;
        return { id, visibleHeight };
      }, { id: 'home', visibleHeight: 0 });
      setActiveSection(current.id);
    };
    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#090a0b] text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#090a0b]/88 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-5 lg:px-8">
          <button onClick={() => go('home')} className="flex items-center gap-3 text-left" aria-label="Napertskala home">
            <Image src={logoSrc} alt="Napertskala" width={48} height={48} className="h-10 w-10 rounded-full border border-orange-400/30 object-cover sm:h-12 sm:w-12" priority unoptimized={logoSrc.startsWith('/api/')} />
            <div><strong className="block text-base leading-none tracking-wide sm:text-lg">ნაპერწკალა</strong><span className="text-[9px] uppercase tracking-[0.22em] text-orange-400 sm:text-[10px] sm:tracking-[0.28em]">Napertskala</span></div>
          </button>
          <nav className="hidden items-center gap-2 lg:flex">{t.nav.map((item, i) => { const active = activeSection === navTargets[i]; return <button key={item} onClick={() => go(navTargets[i])} aria-current={active ? 'page' : undefined} className={`rounded-full px-4 py-2 text-sm font-bold transition ${active ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20' : 'text-zinc-300 hover:bg-white/5 hover:text-orange-400'}`}>{item}</button>; })}</nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(lang === 'ka' ? 'en' : 'ka')} className="flex h-10 items-center gap-1.5 rounded-full border border-white/15 px-3 text-xs font-bold transition hover:border-orange-400/60" aria-label="Change language"><Languages className="h-4 w-4" />{lang === 'ka' ? 'EN' : 'ქარ'}</button>
            <AccountLink lang={lang} className="hidden rounded-full bg-orange-500 px-5 py-2.5 text-xs font-bold text-black transition hover:bg-orange-400 sm:block" />
            <button onClick={() => setMenuOpen(!menuOpen)} className="grid h-10 w-10 place-items-center lg:hidden" aria-label="Open menu">{menuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
        {menuOpen && <nav className="border-t border-white/10 bg-[#0d0e10] px-5 py-5 lg:hidden">{t.nav.map((item, i) => { const active = activeSection === navTargets[i]; return <button key={item} onClick={() => go(navTargets[i])} aria-current={active ? 'page' : undefined} className={`mb-2 flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${active ? 'border-orange-500 bg-orange-500 text-black' : 'border-white/5 bg-white/[.03] text-zinc-300 hover:border-orange-500/40'}`}><span>{item}</span>{active && <span className="h-2 w-2 rounded-full bg-black" />}</button>; })}<AccountLink lang={lang} className="mt-4 block text-orange-400" /></nav>}
      </header>

      <section id="home" className="relative flex min-h-[78svh] items-center overflow-hidden pt-16 sm:min-h-[82vh] sm:pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_35%,rgba(249,115,22,.18),transparent_32%),linear-gradient(120deg,#090a0b_25%,#111214_100%)]" />
        <div className="spark-grid absolute inset-0 opacity-25" />
        <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-12 text-center sm:px-5 sm:py-20 lg:px-8">
          <div className="relative w-full max-w-[260px] sm:max-w-[360px]"><div className="absolute -inset-8 rounded-full bg-orange-500/10 blur-3xl sm:-inset-10" /><Image src={heroSrc} alt="Napertskala" width={780} height={780} priority className="relative aspect-square w-full rounded-full border border-orange-400/25 object-cover shadow-[0_0_80px_rgba(249,115,22,.15)]" unoptimized={heroSrc.startsWith('/api/')} /></div>
          <h1 className="mt-7 text-3xl font-black leading-tight sm:mt-9 sm:text-5xl">ნაპერწკალა</h1>
          <p className="mt-3 text-base font-bold text-zinc-300 sm:text-xl">{lang === 'ka' ? 'დაგვირეკეთ ან მოგვწერეთ' : 'Call or message us'}</p>
          <button onClick={() => go('services')} className="mt-7 inline-flex h-12 w-full max-w-sm items-center justify-center gap-2 rounded-full bg-orange-500 px-6 text-sm font-extrabold text-black transition hover:-translate-y-0.5 hover:bg-orange-400 sm:h-14 sm:text-base"><MessageCircle className="h-5 w-5" />{lang === 'ka' ? 'სერვისის არჩევა' : 'Choose a service'}</button>
          <div className="mt-5 flex items-center gap-2 text-xs text-zinc-500 sm:mt-7 sm:text-sm"><Clock3 className="h-4 w-4 shrink-0 text-orange-400" />{t.open}</div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0e0f11]"><div className="mx-auto grid max-w-7xl divide-y divide-white/10 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-5 lg:px-8">{t.stats.map(([big,small]) => <div key={small} className="flex items-center gap-3 py-5 sm:gap-4 sm:py-7 sm:px-7 first:pl-0"><CheckCircle2 className="h-6 w-6 shrink-0 text-orange-500 sm:h-7 sm:w-7"/><div><strong className="block text-lg sm:text-xl">{big}</strong><span className="text-sm text-zinc-500">{small}</span></div></div>)}</div></section>

      <section id="welding" className="relative py-16 sm:py-32"><div className="mx-auto grid max-w-7xl gap-10 px-4 sm:gap-14 sm:px-5 lg:grid-cols-[.8fr_1.2fr] lg:px-8"><div><p className="mb-4 text-xs font-extrabold uppercase tracking-[.24em] text-orange-500">{t.weldingEyebrow}</p><h2 className="text-3xl font-black leading-tight sm:text-6xl">{t.weldingTitle}</h2><p className="mt-5 text-base leading-7 text-zinc-400 sm:mt-6 sm:text-lg sm:leading-8">{t.weldingText}</p></div><div className="grid gap-3 sm:grid-cols-2">{t.weldingItems.map((item,i) => <div key={item} className="group flex min-h-20 items-start gap-3 rounded-2xl border border-white/10 bg-white/[.035] p-4 transition hover:-translate-y-1 hover:border-orange-500/35 sm:min-h-28 sm:gap-4 sm:p-5"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-orange-500/10 text-xs font-black text-orange-400 sm:h-10 sm:w-10 sm:text-sm">0{i+1}</span><span className="pt-1 text-sm font-bold leading-6 sm:pt-2 sm:text-base">{item}</span></div>)}</div></div></section>

      <section id="services" className="bg-[#111214] py-16 sm:py-32"><div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8"><div className="mb-8 max-w-3xl sm:mb-12"><h2 className="text-3xl font-black sm:text-6xl">{t.servicesTitle}</h2><p className="mt-4 text-base leading-7 text-zinc-400 sm:mt-5 sm:text-lg">{t.servicesLead}</p></div><div className="grid gap-4 md:grid-cols-2">{t.services.map(([title,desc,tag],i) => ({ title, desc, tag, Icon: icons[i], slug: serviceSlugs[i] })).filter((service) => serviceEnabled(service.slug)).map(({ title, desc, tag, Icon, slug }) => {const photos=servicePhotos(slug);const servicePhoto=photos.length?photos[servicePhotoIndex%photos.length]:null;return <a key={title} href={`/services/${slug}`} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0c0e] p-5 transition hover:-translate-y-1 hover:border-orange-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 sm:rounded-3xl sm:p-9">{servicePhoto&&<div className="relative -mx-5 -mt-5 mb-5 aspect-[1.8/1] overflow-hidden border-b border-white/10 sm:-mx-9 sm:-mt-9 sm:mb-7 sm:aspect-[2.15/1]"><Image key={servicePhoto} src={servicePhoto} alt={lang==='ka'?`${title} — შესრულებული სამუშაო`:`${title} — completed project`} fill sizes="(max-width: 768px) 100vw, 50vw" className="service-card-photo object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100" unoptimized={servicePhoto.startsWith('/api/')} /><div className="absolute inset-0 bg-gradient-to-t from-[#0b0c0e] via-transparent to-transparent"/><span className="absolute right-3 top-3 rounded-full bg-black/75 px-3 py-1 text-[10px] font-black text-orange-300 sm:right-4 sm:top-4">{String((servicePhotoIndex%photos.length)+1).padStart(2,'0')} / {String(photos.length).padStart(2,'0')}</span></div>}<div className="mb-7 flex items-center justify-between sm:mb-10"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-500 text-black sm:h-14 sm:w-14"><Icon className="h-6 w-6 sm:h-7 sm:w-7"/></span><span className="text-[10px] font-bold uppercase tracking-[.22em] text-zinc-600">{tag}</span></div><h3 className="text-xl font-black sm:text-2xl">{title}</h3><p className="mt-3 max-w-md pr-7 text-sm leading-6 text-zinc-400 sm:pr-8 sm:text-base sm:leading-7">{desc}</p><ArrowRight className="absolute bottom-6 right-6 h-5 w-5 text-orange-500 transition group-hover:translate-x-1 sm:bottom-8 sm:right-8"/></a>})}</div></div></section>

      <section id="about" className="py-16 sm:py-32"><div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8"><h2 className="mb-8 text-3xl font-black sm:mb-12 sm:text-6xl">{t.whyTitle}</h2><div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:rounded-3xl md:grid-cols-2">{t.why.map(([title,desc],i) => <div key={title} className="bg-[#090a0b] p-5 sm:p-10"><div className="mb-4 text-orange-500 sm:mb-5">{i===0?<ShieldCheck/>:i===1?<MapPin/>:i===2?<Building2/>:<Languages/>}</div><h3 className="text-lg font-black sm:text-xl">{title}</h3><p className="mt-3 text-sm leading-6 text-zinc-400 sm:text-base sm:leading-7">{desc}</p></div>)}</div></div></section>

      <section aria-labelledby="location-title" className="px-4 pb-16 sm:px-5 sm:pb-24 lg:px-8"><div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[.65fr_1.35fr] lg:items-stretch"><div className="flex flex-col justify-center rounded-2xl border border-white/10 bg-[#111214] p-6 sm:rounded-3xl sm:p-10"><p className="text-xs font-extrabold uppercase tracking-[.24em] text-orange-500">{lang === 'ka' ? 'ჩვენი ლოკაცია' : 'Our location'}</p><h2 id="location-title" className="mt-4 text-3xl font-black sm:text-5xl">{lang === 'ka' ? 'ნაპერწკალა — გორი' : 'Napertskala — Gori'}</h2><p className="mt-4 leading-7 text-zinc-400">{lang === 'ka' ? 'რუკაზე მონიშნულია ნაპერწკალას ზუსტი მდებარეობა. დააჭირეთ რუკას 3D სატელიტური ხედის გასახსნელად.' : 'The map marks Napertskala’s exact location. Click the map to open the 3D satellite view.'}</p><a href={mapUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-orange-500 px-5 text-sm font-black text-black transition hover:bg-orange-400"><MapPin className="h-5 w-5"/>{lang === 'ka' ? 'ადგილის გვერდის გახსნა' : 'Open place listing'}</a></div><div className="relative min-h-80 overflow-hidden rounded-2xl border border-orange-500/25 bg-zinc-900 sm:min-h-[430px] sm:rounded-3xl"><iframe src={mapEmbedUrl} title={lang === 'ka' ? 'ნაპერწკალას მდებარეობა Google Maps-ზე' : 'Napertskala location on Google Maps'} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" className="pointer-events-none absolute inset-0 h-full w-full border-0"/><div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10"/><a href={satelliteMapUrl} target="_blank" rel="noreferrer" aria-label={lang === 'ka' ? 'ნაპერწკალას 3D სატელიტური რუკის გახსნა' : 'Open Napertskala in 3D satellite view'} className="absolute inset-0 flex items-end justify-center p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-500 sm:justify-end sm:p-7"><span className="inline-flex items-center gap-2 rounded-full bg-black/85 px-5 py-3 text-sm font-black text-white shadow-2xl backdrop-blur transition hover:bg-orange-500 hover:text-black"><MapPin className="h-5 w-5"/>{lang === 'ka' ? '3D სატელიტური რუკა' : '3D satellite map'}</span></a></div></div></section>

      <section id="contact" className="px-4 pb-20 sm:px-5 sm:pb-24 lg:px-8"><div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl border border-orange-500/25 bg-orange-500 p-6 text-black sm:rounded-[2rem] sm:p-14"><div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[50px] border-black/5"/><div className="relative grid gap-8 sm:gap-10 lg:grid-cols-[1fr_auto] lg:items-end"><div><h2 className="max-w-3xl text-3xl font-black leading-tight sm:text-6xl">{lang === 'ka' ? 'დაგვიკავშირდით სერვისის მიხედვით' : 'Contact us by service'}</h2><p className="mt-4 max-w-2xl text-base font-medium leading-7 text-black/70 sm:mt-5 sm:text-lg">{lang === 'ka' ? 'აირჩიეთ რა სამუშაო გჭირდებათ და შიდა გვერდზე დაგხვდებათ შესაბამისი ნომერი და WhatsApp.' : 'Choose the work you need and the service page will show the right phone and WhatsApp.'}</p><div className="mt-6 flex flex-col gap-3 text-sm font-bold sm:mt-7 sm:flex-row sm:flex-wrap sm:gap-5"><a href={mapUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full bg-black/10 px-3 py-2 transition hover:bg-black/20"><MapPin className="h-4 w-4 shrink-0"/>{t.location}<span className="text-xs font-black text-black/50">Google Maps</span></a><span className="flex items-center gap-2"><Clock3 className="h-4 w-4 shrink-0"/>{t.hours}</span></div></div><div className="flex flex-col gap-3"><button type="button" onClick={() => go('services')} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-bold text-white hover:bg-zinc-900 sm:h-14 sm:min-w-64 sm:px-7 sm:text-base"><MessageCircle className="h-5 w-5 text-[#25D366]"/>{lang === 'ka' ? 'სერვისის არჩევა' : 'Choose a service'}</button><a href={mapUrl} target="_blank" rel="noreferrer" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-black/20 px-5 text-sm font-black text-black transition hover:bg-black/10 sm:h-14 sm:min-w-64 sm:px-7 sm:text-base"><MapPin className="h-5 w-5"/>{lang === 'ka' ? 'Google რუკაზე ნახვა' : 'View on Google Maps'}</a></div></div></div></section>

      <footer className="border-t border-white/10 py-8 sm:py-10"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 lg:px-8"><div className="flex items-center gap-3"><Image src={logoSrc} alt="Napertskala" width={42} height={42} className="h-10 w-10 rounded-full object-cover sm:h-11 sm:w-11" unoptimized={logoSrc.startsWith('/api/')}/><div><strong className="block text-sm sm:text-base">ნაპერწკალა / Napertskala</strong><a href={mapUrl} target="_blank" rel="noreferrer" className="text-xs text-zinc-500 transition hover:text-orange-400">{t.location}</a><a href="/privacy" className="mt-1 block text-xs text-zinc-500 transition hover:text-orange-400">{lang === 'ka' ? 'კონფიდენციალურობის პოლიტიკა' : 'Privacy Policy'}</a></div></div><div className="flex gap-3"><a href={facebook} target="_blank" rel="noreferrer" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-xl font-black hover:border-orange-500">f</a><a href={mapUrl} target="_blank" rel="noreferrer" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 hover:border-orange-500" aria-label={lang === 'ka' ? 'ლოკაცია Google Maps-ზე' : 'Location on Google Maps'}><MapPin className="h-5 w-5"/></a><button type="button" onClick={() => go('services')} className="grid h-11 w-11 place-items-center rounded-full border border-white/10 hover:border-orange-500" aria-label={lang === 'ka' ? 'სერვისების ნახვა' : 'View services'}><MessageCircle className="h-5 w-5"/></button><button type="button" onClick={() => go('services')} className="grid h-11 w-11 place-items-center rounded-full border border-white/10 hover:border-orange-500" aria-label={lang === 'ka' ? 'სერვისების ნახვა' : 'View services'}><Phone className="h-5 w-5"/></button></div></div></footer>

      <button type="button" onClick={() => go('services')} aria-label={lang === 'ka' ? 'სერვისის არჩევა' : 'Choose a service'} className="fixed bottom-5 right-5 z-40 flex h-14 items-center gap-3 rounded-full bg-[#25D366] px-4 text-sm font-black text-black shadow-[0_12px_40px_rgba(37,211,102,.3)] transition hover:scale-105 sm:pr-6"><MessageCircle className="h-6 w-6"/><span className="hidden sm:inline">{lang === 'ka' ? 'სერვისები' : 'Services'}</span></button>
    </main>
  );
}
