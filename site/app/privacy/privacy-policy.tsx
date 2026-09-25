'use client';

import { ArrowLeft, Languages, LockKeyhole, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

type Lang = 'ka' | 'en';

const policy = {
  ka: {
    title: 'კონფიდენციალურობის პოლიტიკა',
    intro: 'ეს პოლიტიკა განმარტავს, როგორ აგროვებს, იყენებს, ინახავს და იცავს ნაპერწკალა თქვენს პერსონალურ მონაცემებს napertskala.ge-ის გამოყენებისას.',
    updated: 'ბოლო განახლება: 25 სექტემბერი, 2026',
    back: 'მთავარ გვერდზე დაბრუნება',
    contact: 'კონფიდენციალურობის საკითხზე დაგვიკავშირდით',
    call: 'დარეკვა',
    whatsapp: 'WhatsApp-ზე მოწერა',
    sections: [
      ['1. ვინ ვართ', 'მონაცემთა დამუშავებაზე პასუხისმგებელია ნაპერწკალა, ტექნიკური მომსახურების მიმწოდებელი გორში, საქართველო. ვებგვერდია napertskala.ge.'],
      ['2. რა მონაცემებს ვაგროვებთ', 'საჯარო გვერდების ნახვა ანგარიშის გარეშე შეგიძლიათ. ავტორიზებული მომხმარებლებისა და ადმინისტრატორებისთვის შეიძლება შევინახოთ სახელი, ელფოსტა, ანგარიშის როლი და სტატუსი, ანგარიშის შექმნის დრო და Google-ით შესვლის იდენტიფიკატორი. პაროლი ინახება მხოლოდ კრიპტოგრაფიულად დამუშავებული ჰეშისა და უნიკალური salt-ის სახით და არა ღია ტექსტად. ადმინისტრირებისას შეიძლება შევინახოთ ატვირთული ფაილის სახელი, ტიპი, ზომა, აღწერა, ატვირთვის ავტორი და უსაფრთხოების/ცვლილებების ჟურნალი.'],
      ['3. რისთვის ვიყენებთ მონაცემებს', 'მონაცემებს ვიყენებთ ანგარიშის იდენტიფიცირებისა და ავტორიზაციისთვის, ადმინისტრაციული ფუნქციების დასაცავად, ვებგვერდის კონტენტის სამართავად, თაღლითობისა და არასანქცირებული წვდომის თავიდან ასაცილებლად, ტექნიკური პრობლემების მოსაგვარებლად და თქვენთან მოთხოვნილი კომუნიკაციისთვის. მონაცემებს არ ვყიდით.'],
      ['4. Google-ით შესვლა', 'Google-ით შესვლისას ვითხოვთ მხოლოდ openid, email და profile მონაცემებს. Google გვაწვდის ანგარიშის უნიკალურ იდენტიფიკატორს, სახელსა და ელფოსტას. შესვლა ხელმისაწვდომია მხოლოდ წინასწარ ავტორიზებული ანგარიშებისთვის. Google-ის მიერ მონაცემების დამუშავება ასევე ექვემდებარება Google-ის საკუთარ წესებს.'],
      ['5. ქუქი-ფაილები', 'ვიყენებთ მხოლოდ აუცილებელ ქუქი-ფაილებს: უსაფრთხო სესიის ქუქის ავტორიზაციის შესანარჩუნებლად და დროებით OAuth state ქუქის Google-ით შესვლის უსაფრთხოდ დასასრულებლად. სესია მოქმედებს მაქსიმუმ 14 დღე. ამჟამად არ ვიყენებთ სარეკლამო ან ანალიტიკურ ქუქი-ფაილებს.'],
      ['6. შენახვა და მომსახურების მომწოდებლები', 'ვებგვერდი იყენებს Cloudflare-ის ინფრასტრუქტურას, მათ შორის D1 მონაცემთა ბაზასა და R2 ფაილების საცავს. Google ამუშავებს მონაცემებს Google-ით შესვლისას. ამ მომწოდებლებმა მონაცემები შეიძლება დაამუშაონ საქართველოს ფარგლებს გარეთ, მათი უსაფრთხოებისა და კონფიდენციალურობის პირობების შესაბამისად.'],
      ['7. შენახვის ვადები', 'სესიის ჩანაწერი ინახება მაქსიმუმ 14 დღე ან გამოსვლამდე/გაუქმებამდე. ანგარიშის მონაცემები ინახება ანგარიშის მოქმედების პერიოდში. ატვირთული მედია ინახება გამოქვეყნებამდე ან წაშლამდე. უსაფრთხოებისა და ადმინისტრაციული მოქმედებების ჟურნალები ინახება იმდენ ხანს, რამდენიც გონივრულად საჭიროა სისტემის დაცვისა და ცვლილებების ისტორიისთვის.'],
      ['8. მონაცემთა გაზიარება და გარე ბმულები', 'მონაცემებს ვუზიარებთ მხოლოდ იმ ტექნიკურ მომწოდებლებს, რომლებიც საჭიროა ვებგვერდისა და ავტორიზაციის მუშაობისთვის, ან როცა ამას კანონი მოითხოვს. WhatsApp-ის, Facebook-ისა და Google Maps-ის ბმულებზე გადასვლის შემდეგ მონაცემებს შესაბამისი პლატფორმა საკუთარი პოლიტიკის მიხედვით ამუშავებს.'],
      ['9. უსაფრთხოება', 'ვიყენებთ დაშიფრულ კავშირს, უსაფრთხო და HttpOnly სესიის ქუქის, ჰეშირებულ სესიის ტოკენებს, წვდომის როლებსა და პაროლის უსაფრთხო ჰეშირებას. თუმცა ინტერნეტით მონაცემთა გადაცემისა და შენახვის არც ერთი მეთოდი არ არის აბსოლუტურად უსაფრთხო.'],
      ['10. თქვენი უფლებები', 'საქართველოს მოქმედი კანონმდებლობის ფარგლებში შეგიძლიათ მოითხოვოთ ინფორმაცია თქვენი მონაცემების დამუშავების შესახებ, მონაცემებზე წვდომა, მათი გასწორება, განახლება, დამუშავების შეწყვეტა, წაშლა ან განადგურება, როდესაც ამის სამართლებრივი საფუძველი არსებობს. ასევე შეგიძლიათ გაასაჩივროთ მონაცემთა დამუშავება კანონით დადგენილი წესით. მოთხოვნის დასადასტურებლად შეიძლება დაგვჭირდეს თქვენი ვინაობის შემოწმება.'],
      ['11. არასრულწლოვნები', 'ვებგვერდის ანგარიშები განკუთვნილი არ არის ბავშვებისთვის და ჩვენ შეგნებულად არ ვაგროვებთ არასრულწლოვანთა პერსონალურ მონაცემებს.'],
      ['12. პოლიტიკის ცვლილება', 'ამ პოლიტიკას შეიძლება პერიოდულად შევცვალოთ. განახლებული ვერსია გამოქვეყნდება ამ გვერდზე ახალი თარიღით. მნიშვნელოვანი ცვლილებების შემთხვევაში დამატებით შეტყობინებას გამოვიყენებთ, როცა ეს გონივრულად შესაძლებელია.'],
    ],
  },
  en: {
    title: 'Privacy Policy',
    intro: 'This policy explains how Napertskala collects, uses, stores and protects personal data when you use napertskala.ge.',
    updated: 'Last updated: September 25, 2026',
    back: 'Back to home',
    contact: 'Contact us about privacy',
    call: 'Call us',
    whatsapp: 'Message on WhatsApp',
    sections: [
      ['1. Who we are', 'The controller responsible for the processing described here is Napertskala, a technical services provider based in Gori, Georgia. Our website is napertskala.ge.'],
      ['2. Data we collect', 'Public pages can be viewed without an account. For authorized users and administrators, we may store a name, email address, account role and status, account creation time and a Google sign-in identifier. Passwords are stored only as a cryptographic hash with a unique salt, never as plain text. Administration may also record uploaded file names, types, sizes, descriptions, uploader identity and security/change logs.'],
      ['3. How we use data', 'We use data to identify and authenticate accounts, protect administrative functions, manage website content, prevent fraud and unauthorized access, troubleshoot technical issues and respond to communications you request. We do not sell personal data.'],
      ['4. Google sign-in', 'Google sign-in requests only the openid, email and profile scopes. Google provides a unique account identifier, name and email address. Sign-in is available only to accounts authorized in advance. Google also processes information under its own privacy terms.'],
      ['5. Cookies', 'We use essential cookies only: a secure session cookie to keep authorized users signed in and a temporary OAuth state cookie to complete Google sign-in safely. A session lasts no longer than 14 days. We do not currently use advertising or analytics cookies.'],
      ['6. Storage and service providers', 'The website uses Cloudflare infrastructure, including D1 database and R2 file storage. Google processes information during Google sign-in. These providers may process data outside Georgia in accordance with their security and privacy terms.'],
      ['7. Retention', 'Session records are retained for no longer than 14 days or until logout/revocation. Account data is kept while the account remains active. Uploaded media is kept while published or until deleted. Security and administrative logs are kept for as long as reasonably needed to protect the system and preserve a change history.'],
      ['8. Sharing and external links', 'We share data only with technical providers needed to operate the website and authentication, or where required by law. After following links to WhatsApp, Facebook or Google Maps, those platforms process information under their own policies.'],
      ['9. Security', 'We use encrypted connections, Secure and HttpOnly session cookies, hashed session tokens, role-based access and secure password hashing. No method of internet transmission or storage can be guaranteed completely secure.'],
      ['10. Your rights', 'Subject to applicable Georgian law, you may request information about processing, access to your data, correction or updating, and the suspension, deletion or destruction of data where a legal basis applies. You may also challenge processing through the procedures provided by law. We may need to verify your identity before completing a request.'],
      ['11. Children', 'Website accounts are not intended for children, and we do not knowingly collect personal data from minors.'],
      ['12. Changes to this policy', 'We may update this policy periodically. The revised version will appear on this page with a new date. Where reasonably possible, we will provide additional notice of material changes.'],
    ],
  },
} as const;

export default function PrivacyPolicy() {
  const [lang, setLang] = useState<Lang>('ka');
  const t = policy[lang];
  const phone = '+995568884135';

  return <main className="min-h-screen bg-[#090a0b] text-white">
    <header className="border-b border-white/10 bg-[#0d0e10]">
      <div className="mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <a href="/" className="flex items-center gap-3">
          <Image src="/logo.jpg" alt="Napertskala" width={48} height={48} className="h-12 w-12 rounded-full border border-orange-400/30 object-cover" priority />
          <div><strong className="block leading-none">ნაპერწკალა</strong><span className="text-[10px] uppercase tracking-[.22em] text-orange-400">Napertskala</span></div>
        </a>
        <button type="button" onClick={() => setLang(lang === 'ka' ? 'en' : 'ka')} className="flex h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-bold transition hover:border-orange-400" aria-label="Change language">
          <Languages className="h-4 w-4" />{lang === 'ka' ? 'English' : 'ქართული'}
        </button>
      </div>
    </header>

    <section className="border-b border-white/10 bg-[#111214]">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20 lg:px-8">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-orange-500 text-black"><ShieldCheck className="h-7 w-7" /></span>
        <h1 className="mt-7 max-w-4xl text-3xl font-black leading-tight sm:text-5xl">{t.title}</h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">{t.intro}</p>
        <p className="mt-5 text-sm font-bold text-orange-400">{t.updated}</p>
      </div>
    </section>

    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[1fr_280px] lg:px-8 lg:py-16">
      <article className="min-w-0 space-y-10">
        {t.sections.map(([title, text]) => <section key={title}>
          <h2 className="text-xl font-black sm:text-2xl">{title}</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-400 sm:text-base sm:leading-8">{text}</p>
        </section>)}
      </article>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-orange-500/25 bg-orange-500/10 p-5">
          <LockKeyhole className="h-6 w-6 text-orange-400" />
          <h2 className="mt-4 text-lg font-black">{t.contact}</h2>
          <p className="mt-2 text-sm text-zinc-400">Gori, Georgia<br />+995 568 88 41 35</p>
          <div className="mt-5 grid gap-3">
            <a href={`tel:${phone}`} className="flex h-11 items-center justify-center gap-2 rounded-full bg-orange-500 text-sm font-black text-black hover:bg-orange-400"><Phone className="h-4 w-4" />{t.call}</a>
            <a href={`https://wa.me/${phone.replace('+', '')}`} target="_blank" rel="noreferrer" className="flex h-11 items-center justify-center gap-2 rounded-full border border-white/15 text-sm font-black hover:border-[#25D366] hover:text-[#25D366]"><MessageCircle className="h-4 w-4" />{t.whatsapp}</a>
          </div>
        </div>
      </aside>
    </div>

    <footer className="border-t border-white/10 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <span className="text-sm text-zinc-500">© 2026 Napertskala</span>
        <a href="/" className="flex items-center gap-2 text-sm font-bold text-zinc-300 hover:text-orange-400"><ArrowLeft className="h-4 w-4" />{t.back}</a>
      </div>
    </footer>
  </main>;
}
