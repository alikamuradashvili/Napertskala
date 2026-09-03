'use client';

import { ArrowRight, Building2, Car, CheckCircle2, Clock3, Languages, MapPin, Menu, MessageCircle, Phone, ShieldCheck, Sparkles, Wrench, X, Zap } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import AccountLink from '@/components/account-link';

type Lang = 'ka' | 'en';

const content = {
  ka: {
    nav: ['მთავარი', 'შედუღება', 'სერვისები', 'ჩვენ შესახებ', 'კონტაქტი'], account: 'ადმინ პანელი',
    eyebrow: 'პროფესიონალური სამუშაო • გორი და მთელი საქართველო', titleA: 'ლითონს ვაძლევთ', titleB: 'ძლიერ ფორმას.',
    lead: 'ყველა ტიპის შედუღება, ელექტრო მომსახურება, სამრეწველო დანადგარები და ავტომობილის დიაგნოსტიკა — ერთი საიმედო გუნდისგან.',
    call: 'დაგვირეკეთ', quote: 'მოგვწერეთ WhatsApp-ზე', open: 'ვმუშაობთ ყოველდღე 10:00–23:00',
    stats: [['ყველა ტიპის', 'შედუღება'], ['სრული', 'ელექტრო სერვისი'], ['ადგილზე', 'გასვლა შეთანხმებით']],
    weldingEyebrow: 'მთავარი მიმართულება', weldingTitle: 'შედუღება, რომელიც უძლებს დროს',
    weldingText: 'ვმუშაობთ როგორც კერძო შეკვეთებზე, ისე სამშენებლო კომპანიებისა და საწარმოებისთვის. ვამზადებთ და ვაკეთებთ მონტაჟს ზუსტი მოთხოვნების მიხედვით.',
    weldingItems: ['ლითონის კონსტრუქციები', 'კიბეები, მოაჯირები და ჭიშკრები', 'მილები და სამრეწველო სამუშაოები', 'შეკეთება და ადგილზე შედუღება', 'სამშენებლო კომპანიების შეკვეთები', 'საწარმოების დამზადება და მონტაჟი'],
    servicesTitle: 'ყველა სერვისი ერთ სივრცეში', servicesLead: 'პრაქტიკული გადაწყვეტა სახლისთვის, ბიზნესისთვის და ავტომობილისთვის.',
    services: [['შედუღება', 'ყველა ტიპის შედუღება, კონსტრუქციების დამზადება, შეკეთება და მონტაჟი.', 'Welding'], ['ელექტრო მომსახურება', 'სახლის ელექტრობა, სამფაზიანი სისტემები, დიდი ქარხნების ელექტრო სამუშაოები და ელექტროძრავების მომსახურება.', 'Electrical'], ['აგრეგატები და დანადგარები', 'დიდი გენერატორებისა და სამრეწველო დანადგარების მომსახურება.', 'Industrial'], ['ავტო დიაგნოსტიკა', 'ავტომობილის საბაზისო კომპიუტერული და ელექტრო დიაგნოსტიკა.', 'Diagnostics']],
    whyTitle: 'რატომ ნაპერწკალა?',
    why: [['ერთი გუნდი, ბევრი შესაძლებლობა', 'რთული ამოცანებისთვის რამდენიმე სპეციალისტის ძებნა აღარ დაგჭირდებათ.'], ['მობილური მომსახურება', 'ძირითადად გორში ვართ, თუმცა შეთანხმებით სხვა ლოკაციაზეც მოვალთ.'], ['კომპანიებთან თანამშრომლობა', 'ვიღებთ მასშტაბურ შეკვეთებს სამშენებლო კომპანიებისა და საწარმოებისთვის.'], ['ორენოვანი კომუნიკაცია', 'გესაუბრებით ქართულად და ინგლისურად.']],
    ctaTitle: 'გაქვთ სამუშაო? დავიწყოთ საუბარი.', ctaText: 'გამოგვიგზავნეთ ფოტო ან მოკლე აღწერა WhatsApp-ზე და მიიღეთ სწრაფი პასუხი.',
    location: 'გორი • სხვა ლოკაციები შეთანხმებით', hours: 'ყოველდღე • 10:00–23:00', footer: 'ნაპერწკალა — შედუღება და ტექნიკური მომსახურება', chat: 'მოგვწერეთ',
  },
  en: {
    nav: ['Home', 'Welding', 'Services', 'About', 'Contact'], account: 'Admin panel',
    eyebrow: 'Professional workmanship • Gori and across Georgia', titleA: 'We shape metal', titleB: 'to last.',
    lead: 'All types of welding, electrical services, industrial equipment and basic car diagnostics — from one reliable team.',
    call: 'Call us', quote: 'Message on WhatsApp', open: 'Open daily 10:00–23:00',
    stats: [['All types of', 'welding'], ['Complete', 'electrical service'], ['On-site', 'visits by agreement']],
    weldingEyebrow: 'Our main expertise', weldingTitle: 'Welding built to stand the test of time',
    weldingText: 'We handle private jobs as well as projects for construction companies and factories, with fabrication and installation tailored to your requirements.',
    weldingItems: ['Metal structures', 'Stairs, railings and gates', 'Pipe and industrial welding', 'Repairs and mobile welding', 'Construction company projects', 'Factory fabrication and installation'],
    servicesTitle: 'Every service in one place', servicesLead: 'Practical technical solutions for your home, business and vehicle.',
    services: [['Welding', 'All welding types, custom metal fabrication, repair and installation.', 'Welding'], ['Electrical services', 'Home wiring, three-phase systems, electrical work for large factories and electric-motor service.', 'Electrical'], ['Generators & equipment', 'Service for large generators and industrial equipment.', 'Industrial'], ['Car diagnostics', 'Basic computer and electrical diagnostics for passenger vehicles.', 'Diagnostics']],
    whyTitle: 'Why Napertskala?',
    why: [['One team, many capabilities', 'No need to coordinate several specialists for a complex technical job.'], ['Mobile service', 'Based in Gori, with travel to other locations available by agreement.'], ['Built for business', 'We take on larger projects for construction companies and factories.'], ['Bilingual communication', 'We can assist you in Georgian and English.']],
    ctaTitle: 'Have a job in mind? Let’s talk.', ctaText: 'Send a photo or a short description on WhatsApp and get a quick response.',
    location: 'Gori • Other locations by agreement', hours: 'Every day • 10:00–23:00', footer: 'Napertskala — welding and technical services', chat: 'Chat with us',
  },
};

const defaultPhone = '+995574814088';
const defaultFacebook = 'https://www.facebook.com/profile.php?id=61589481147761';
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

export default function Home() {
  const [lang, setLang] = useState<Lang>('ka');
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicePhotoIndex, setServicePhotoIndex] = useState(0);
  const [cms, setCms] = useState<{content:Record<string,{ka:string;en:string}>;settings:Record<string,string>;gallery:Array<{url:string}>} | null>(null);
  useEffect(() => { fetch('/api/site').then((r) => r.ok ? r.json() : null).then((value:unknown) => value && setCms(value as {content:Record<string,{ka:string;en:string}>;settings:Record<string,string>;gallery:Array<{url:string}>})).catch(() => {}); }, []);
  const rotatingWeldingPhotos = [...weldingSlides, ...(cms?.gallery ?? []).map((item)=>item.url)];
  useEffect(() => { const timer=window.setInterval(()=>setServicePhotoIndex((current)=>(current+1)%rotatingWeldingPhotos.length),3200); return()=>window.clearInterval(timer); }, [rotatingWeldingPhotos.length]);
  const pick = (key:string, fallback:string) => cms?.content?.[key]?.[lang] || fallback;
  const t = { ...content[lang], titleA: pick('hero_title_a', content[lang].titleA), titleB: pick('hero_title_b', content[lang].titleB), lead: pick('hero_lead', content[lang].lead), weldingTitle: pick('welding_title', content[lang].weldingTitle), weldingText: pick('welding_text', content[lang].weldingText), servicesTitle: pick('services_title', content[lang].servicesTitle), ctaTitle: pick('cta_title', content[lang].ctaTitle), ctaText: pick('cta_text', content[lang].ctaText), hours: cms?.settings?.hours || content[lang].hours, location: cms?.settings?.location || content[lang].location };
  const phone = cms?.settings?.phone || defaultPhone;
  const whatsapp = `https://wa.me/${phone.replace(/\D/g, '')}`;
  const facebook = cms?.settings?.facebook || defaultFacebook;
  const logoSrc = cms?.settings?.logo_media_id ? `/api/media/${cms.settings.logo_media_id}` : '/logo.jpg';
  const heroSrc = cms?.settings?.hero_media_id ? `/api/media/${cms.settings.hero_media_id}` : logoSrc;
  const icons = [Wrench, Zap, Building2, Car];
  const serviceSlugs = ['welding', 'electrical', 'industrial', 'diagnostics'];
  const go = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#090a0b] text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#090a0b]/88 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <button onClick={() => go('home')} className="flex items-center gap-3 text-left" aria-label="Napertskala home">
            <Image src={logoSrc} alt="Napertskala" width={48} height={48} className="h-12 w-12 rounded-full border border-orange-400/30 object-cover" priority unoptimized={logoSrc.startsWith('/api/')} />
            <div><strong className="block text-lg leading-none tracking-wide">ნაპერწკალა</strong><span className="text-[10px] uppercase tracking-[0.28em] text-orange-400">Napertskala</span></div>
          </button>
          <nav className="hidden items-center gap-7 lg:flex">{t.nav.map((item, i) => <button key={item} onClick={() => go(['home','welding','services','about','contact'][i])} className="text-sm text-zinc-300 transition hover:text-orange-400">{item}</button>)}</nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(lang === 'ka' ? 'en' : 'ka')} className="flex h-10 items-center gap-2 rounded-full border border-white/15 px-3 text-xs font-bold transition hover:border-orange-400/60" aria-label="Change language"><Languages className="h-4 w-4" />{lang === 'ka' ? 'EN' : 'ქარ'}</button>
            <AccountLink lang={lang} className="hidden rounded-full bg-orange-500 px-5 py-2.5 text-xs font-bold text-black transition hover:bg-orange-400 sm:block" />
            <button onClick={() => setMenuOpen(!menuOpen)} className="grid h-10 w-10 place-items-center lg:hidden" aria-label="Open menu">{menuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
        {menuOpen && <nav className="border-t border-white/10 bg-[#0d0e10] px-5 py-5 lg:hidden">{t.nav.map((item, i) => <button key={item} onClick={() => go(['home','welding','services','about','contact'][i])} className="block w-full border-b border-white/5 py-3 text-left">{item}</button>)}<AccountLink lang={lang} className="mt-4 block text-orange-400" /></nav>}
      </header>

      <section id="home" className="relative flex min-h-[92vh] items-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_35%,rgba(249,115,22,.18),transparent_32%),linear-gradient(120deg,#090a0b_25%,#111214_100%)]" />
        <div className="spark-grid absolute inset-0 opacity-25" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:px-8">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-400/25 bg-orange-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-orange-300"><Sparkles className="h-4 w-4" />{t.eyebrow}</div>
            <h1 className="max-w-4xl text-5xl font-black leading-[.98] tracking-[-0.045em] sm:text-7xl lg:text-[88px]">{t.titleA}<br/><span className="steel-text">{t.titleB}</span></h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-400 sm:text-xl">{t.lead}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><a href={`tel:${phone}`} className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-orange-500 px-7 font-extrabold text-black transition hover:-translate-y-0.5 hover:bg-orange-400"><Phone className="h-5 w-5" />{t.call}</a><a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 font-bold transition hover:border-orange-400/60 hover:bg-white/10"><MessageCircle className="h-5 w-5 text-[#25D366]" />{t.quote}</a></div>
            <div className="mt-7 flex items-center gap-2 text-sm text-zinc-500"><Clock3 className="h-4 w-4 text-orange-400" />{t.open}</div>
          </div>
          <div className="relative mx-auto w-full max-w-[520px]"><div className="absolute -inset-10 rounded-full bg-orange-500/10 blur-3xl" /><Image src={heroSrc} alt="Napertskala welding" width={780} height={780} priority className="relative aspect-square w-full rounded-full border border-orange-400/25 object-cover shadow-[0_0_80px_rgba(249,115,22,.15)]" unoptimized={heroSrc.startsWith('/api/')} /></div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0e0f11]"><div className="mx-auto grid max-w-7xl divide-y divide-white/10 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-8">{t.stats.map(([big,small]) => <div key={small} className="flex items-center gap-4 py-7 sm:px-7 first:pl-0"><CheckCircle2 className="h-7 w-7 shrink-0 text-orange-500"/><div><strong className="block text-xl">{big}</strong><span className="text-sm text-zinc-500">{small}</span></div></div>)}</div></section>

      <section id="welding" className="relative py-24 sm:py-32"><div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[.8fr_1.2fr] lg:px-8"><div><p className="mb-4 text-xs font-extrabold uppercase tracking-[.24em] text-orange-500">{t.weldingEyebrow}</p><h2 className="text-4xl font-black leading-tight sm:text-6xl">{t.weldingTitle}</h2><p className="mt-6 text-lg leading-8 text-zinc-400">{t.weldingText}</p></div><div className="grid gap-3 sm:grid-cols-2">{t.weldingItems.map((item,i) => <div key={item} className="group flex min-h-28 items-start gap-4 rounded-2xl border border-white/10 bg-white/[.035] p-5 transition hover:-translate-y-1 hover:border-orange-500/35"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange-500/10 text-sm font-black text-orange-400">0{i+1}</span><span className="pt-2 font-bold leading-6">{item}</span></div>)}</div></div></section>

      <section id="services" className="bg-[#111214] py-24 sm:py-32"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="mb-12 max-w-3xl"><h2 className="text-4xl font-black sm:text-6xl">{t.servicesTitle}</h2><p className="mt-5 text-lg text-zinc-400">{t.servicesLead}</p></div><div className="grid gap-4 md:grid-cols-2">{t.services.map(([title,desc,tag],i) => { const Icon=icons[i]; return <a key={title} href={`/services/${serviceSlugs[i]}`} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0c0e] p-7 transition hover:-translate-y-1 hover:border-orange-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 sm:p-9">{i === 0 && <div className="relative -mx-7 -mt-7 mb-7 aspect-[2.15/1] overflow-hidden border-b border-white/10 sm:-mx-9 sm:-mt-9"><Image key={rotatingWeldingPhotos[servicePhotoIndex]} src={rotatingWeldingPhotos[servicePhotoIndex]} alt={lang === 'ka' ? `ნაპერწკალას შედუღების სამუშაო ${servicePhotoIndex+1}` : `Napertskala welding project ${servicePhotoIndex+1}`} fill sizes="(max-width: 768px) 100vw, 50vw" className="service-card-photo object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100" unoptimized={rotatingWeldingPhotos[servicePhotoIndex].startsWith('/api/')} /><div className="absolute inset-0 bg-gradient-to-t from-[#0b0c0e] via-transparent to-transparent"/><span className="absolute right-4 top-4 rounded-full bg-black/75 px-3 py-1 text-[10px] font-black text-orange-300">{String(servicePhotoIndex+1).padStart(2,'0')} / {String(rotatingWeldingPhotos.length).padStart(2,'0')}</span></div>}<div className="mb-10 flex items-center justify-between"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-orange-500 text-black"><Icon className="h-7 w-7"/></span><span className="text-[10px] font-bold uppercase tracking-[.22em] text-zinc-600">{tag}</span></div><h3 className="text-2xl font-black">{title}</h3><p className="mt-3 max-w-md pr-8 leading-7 text-zinc-400">{desc}</p><ArrowRight className="absolute bottom-8 right-8 h-5 w-5 text-orange-500 transition group-hover:translate-x-1"/></a>})}</div></div></section>

      <section id="about" className="py-24 sm:py-32"><div className="mx-auto max-w-7xl px-5 lg:px-8"><h2 className="mb-12 text-4xl font-black sm:text-6xl">{t.whyTitle}</h2><div className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-2">{t.why.map(([title,desc],i) => <div key={title} className="bg-[#090a0b] p-7 sm:p-10"><div className="mb-5 text-orange-500">{i===0?<ShieldCheck/>:i===1?<MapPin/>:i===2?<Building2/>:<Languages/>}</div><h3 className="text-xl font-black">{title}</h3><p className="mt-3 leading-7 text-zinc-400">{desc}</p></div>)}</div></div></section>

      <section id="contact" className="px-5 pb-24 lg:px-8"><div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-orange-500/25 bg-orange-500 p-8 text-black sm:p-14"><div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[50px] border-black/5"/><div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end"><div><h2 className="max-w-3xl text-4xl font-black leading-tight sm:text-6xl">{t.ctaTitle}</h2><p className="mt-5 max-w-2xl text-lg font-medium text-black/70">{t.ctaText}</p><div className="mt-7 flex flex-wrap gap-5 text-sm font-bold"><span className="flex items-center gap-2"><MapPin className="h-4 w-4"/>{t.location}</span><span className="flex items-center gap-2"><Clock3 className="h-4 w-4"/>{t.hours}</span></div></div><div className="flex flex-col gap-3"><a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex h-14 min-w-64 items-center justify-center gap-2 rounded-full bg-black px-7 font-bold text-white hover:bg-zinc-900"><MessageCircle className="h-5 w-5 text-[#25D366]"/>{t.quote}</a><a href={`tel:${phone}`} className="inline-flex h-14 items-center justify-center gap-2 rounded-full border-2 border-black/20 px-7 font-extrabold"><Phone className="h-5 w-5"/>{phone}</a></div></div></div></section>

      <footer className="border-t border-white/10 py-10"><div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 sm:flex-row sm:items-center sm:justify-between lg:px-8"><div className="flex items-center gap-3"><Image src={logoSrc} alt="Napertskala" width={42} height={42} className="h-11 w-11 rounded-full object-cover" unoptimized={logoSrc.startsWith('/api/')}/><div><strong className="block">ნაპერწკალა / Napertskala</strong><span className="text-xs text-zinc-500">{t.footer}</span></div></div><div className="flex gap-3"><a href={facebook} target="_blank" rel="noreferrer" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-xl font-black hover:border-orange-500">f</a><a href={whatsapp} target="_blank" rel="noreferrer" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 hover:border-orange-500"><MessageCircle className="h-5 w-5"/></a><a href={`tel:${phone}`} className="grid h-11 w-11 place-items-center rounded-full border border-white/10 hover:border-orange-500"><Phone className="h-5 w-5"/></a></div></div></footer>

      <a href={whatsapp} target="_blank" rel="noreferrer" aria-label={t.chat} className="fixed bottom-5 right-5 z-40 flex h-14 items-center gap-3 rounded-full bg-[#25D366] px-4 text-sm font-black text-black shadow-[0_12px_40px_rgba(37,211,102,.3)] transition hover:scale-105 sm:pr-6"><MessageCircle className="h-6 w-6"/><span className="hidden sm:inline">{t.chat}</span></a>
    </main>
  );
}
