'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { Check, Languages, LockKeyhole, RefreshCw, Save, Search, ShieldCheck, Trash2, UserPlus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

type Role = 'user' | 'admin' | 'super_admin';
type Status = 'active' | 'disabled';
type User = { id:string; name:string; email:string; role:Role; status:Status; googleConnected:boolean; createdAt:number };
type Directory = { user:User; users:User[] };
type Change = { user:User; action:'update_user'; role:Role; status:Status } | { user:User; action:'delete_user' };
type Lang = 'ka' | 'en';

const copy = {
  ka: {
    title:'მომხმარებლები', lead:'მართეთ ანგარიშები, როლები და საიტზე წვდომა.', add:'მომხმარებლის დამატება',
    user:'მომხმარებელი', admin:'ადმინისტრატორი', super_admin:'სუპერ ადმინი', active:'აქტიური', disabled:'გამორთული',
    role:'როლი', status:'სტატუსი', allRoles:'ყველა როლი', allStatuses:'ყველა სტატუსი', search:'მოძებნეთ სახელით ან ელფოსტით',
    name:'სახელი და გვარი', email:'ელფოსტა', password:'პაროლი (მინიმუმ 10 სიმბოლო)', method:'შესვლის მეთოდი', passwordMethod:'ელფოსტა და პაროლი', googleMethod:'მხოლოდ Google',
    googleHelp:'Google-ით შესვლა წინასწარ უნდა იყოს გამართული. მომხმარებელმა ზუსტად ამ ელფოსტით უნდა გაიაროს ავტორიზაცია.',
    addHelp:'ანგარიში შეიქმნება საიტზე. მოწვევის ელფოსტა ავტომატურად არ იგზავნება — შესვლის მონაცემები უსაფრთხოდ გაუზიარეთ მომხმარებელს.',
    accessHelp:'მომხმარებელი — მხოლოდ საჯარო საიტი. ადმინისტრატორი — ტექსტები და ფოტოები. სუპერ ადმინი — მომხმარებლების მართვაც.',
    protection:'თქვენს ანგარიშზე როლისა და სტატუსის შეცვლა შეზღუდულია. ბოლო აქტიური სუპერ ადმინის წაშლა, გამორთვა ან დაქვეითება შეუძლებელია.',
    you:'თქვენ', protected:'დაცული ანგარიში', save:'ცვლილებების შენახვა', cancel:'გაუქმება', remove:'წაშლა', refresh:'განახლება', loading:'მომხმარებლები იტვირთება…', busy:'გთხოვთ, დაელოდოთ…',
    empty:'მომხმარებლები ვერ მოიძებნა.', emptyHelp:'შეცვალეთ საძიებო სიტყვა ან ფილტრები.', clear:'ფილტრების გასუფთავება', count:'ანგარიში',
    created:'მომხმარებელი დაემატა. გაუზიარეთ შესვლის მონაცემები უსაფრთხოდ.', saved:'როლი და სტატუსი შენახულია.', deleted:'ანგარიში წაიშალა. მისი ტექსტები და ფოტოები შენარჩუნებულია.',
    error:'ოპერაცია ვერ შესრულდა. სცადეთ ხელახლა.', forbidden:'ამ გვერდზე წვდომა მხოლოდ სუპერ ადმინს აქვს.',
    confirm:'დაადასტურეთ ცვლილება', confirmDelete:'წაიშალოს ანგარიში?', deleteHelp:'ანგარიში და მისი სესიები სამუდამოდ წაიშლება. ატვირთული ფოტოები და საიტის ტექსტები დარჩება.',
    sessionHelp:'როლის ან სტატუსის შეცვლისას მიმდინარე სესიები დასრულდება. გამორთული ანგარიში ვეღარ შევა საიტზე.',
    connected:'Google დაკავშირებულია', notConnected:'Google არ არის დაკავშირებული',
  },
  en: {
    title:'Users', lead:'Manage accounts, roles and access to your website.', add:'Add user',
    user:'User', admin:'Admin', super_admin:'Super Admin', active:'Active', disabled:'Disabled',
    role:'Role', status:'Status', allRoles:'All roles', allStatuses:'All statuses', search:'Search by name or email',
    name:'Full name', email:'Email', password:'Password (at least 10 characters)', method:'Sign-in method', passwordMethod:'Email and password', googleMethod:'Google only',
    googleHelp:'Google sign-in must be configured first. The user must sign in with this exact email address.',
    addHelp:'This creates an account on the site. No invitation email is sent automatically; share sign-in details securely.',
    accessHelp:'User: public site only. Admin: content and photos. Super Admin: also manages users.',
    protection:'Your own role and status are locked. The last active Super Admin cannot be deleted, disabled or demoted.',
    you:'You', protected:'Protected account', save:'Save changes', cancel:'Cancel', remove:'Delete', refresh:'Refresh', loading:'Loading users…', busy:'Please wait…',
    empty:'No users found.', emptyHelp:'Try another search or change the filters.', clear:'Clear filters', count:'accounts',
    created:'User added. Share their sign-in details securely.', saved:'Role and status saved.', deleted:'Account deleted. Its content and photos were preserved.',
    error:'Could not complete the request. Please try again.', forbidden:'Only a Super Admin can access this page.',
    confirm:'Confirm account changes', confirmDelete:'Delete this account?', deleteHelp:'The account and its sessions will be permanently deleted. Uploaded photos and site content will remain.',
    sessionHelp:'Changing role or status signs the user out of existing sessions. Disabled accounts cannot sign in.',
    connected:'Google connected', notConnected:'Google not connected',
  },
};

async function api<T>(options?: RequestInit): Promise<T> {
  const response = await fetch('/api/admin/users', { cache:'no-store', ...options });
  if (response.status === 401) { window.location.replace('/login'); throw new Error('Please sign in again.'); }
  if (response.status === 403) { window.location.replace('/admin'); throw new Error('Super Admin access required.'); }
  const result = await response.json().catch(() => null) as (T & {error?:string}) | null;
  if (!response.ok || !result) throw new Error(result?.error || 'Could not load users. Please try again.');
  return result;
}

export default function UsersPanel() {
  const [lang, setLang] = useState<Lang>('ka');
  const t = copy[lang];
  const [data, setData] = useState<Directory | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [google, setGoogle] = useState(false);
  const [pending, setPending] = useState<Change | null>(null);
  const mutationLock = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setData(await api<Directory>()); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not load users.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function mutate(body:Record<string, unknown>, success:string, onSuccess:()=>void) {
    if (mutationLock.current) return;
    mutationLock.current = true;
    setBusy(true); setError(''); setNotice('');
    try {
      await api({ method:'PATCH', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify(body) });
      onSuccess(); setNotice(success); await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : t.error); }
    finally { mutationLock.current = false; setBusy(false); }
  }

  async function create(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const element = event.currentTarget; // React clears currentTarget after the handler yields.
    const form = new FormData(element);
    await mutate({ action:'create_user', name:form.get('name'), email:form.get('email'), password:form.get('password'), role:form.get('role'), status:form.get('status'), useGoogle:google }, t.created, () => {
      element.reset(); setGoogle(false); setShowCreate(false); setQuery(''); setRoleFilter('all'); setStatusFilter('all');
    });
  }

  const visible = data?.users.filter(user =>
    `${user.name} ${user.email}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()) &&
    (roleFilter === 'all' || user.role === roleFilter) && (statusFilter === 'all' || user.status === statusFilter),
  ) ?? [];
  const owners = data?.users.filter(user => user.role === 'super_admin' && user.status === 'active').length ?? 0;

  return <section lang={lang}>
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-500 text-black"><Users /></span><h1 className="text-3xl font-black sm:text-4xl">{t.title}</h1></div><p className="mt-3 text-zinc-400">{t.lead}</p></div>
      <div className="flex flex-wrap gap-2"><Button variant="outline" className="h-11" onClick={() => setLang(lang === 'ka' ? 'en' : 'ka')} aria-label="Change language"><Languages />{lang === 'ka' ? 'EN' : 'ქარ'}</Button><Button className="h-11 px-4 font-bold" disabled={!data || busy} onClick={() => setShowCreate(!showCreate)} aria-expanded={showCreate} aria-controls="create-user"><UserPlus />{showCreate ? t.cancel : t.add}</Button></div>
    </div>
    <p className="mt-6 text-sm leading-6 text-zinc-400">{t.accessHelp}</p>
    <div className="mt-3 flex gap-3 rounded-xl border border-orange-500/20 bg-orange-500/5 p-4 text-sm leading-6 text-orange-200"><LockKeyhole className="mt-1 h-4 w-4 shrink-0"/><p>{t.protection}</p></div>
    {error && !pending && <div role="alert" className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</div>}
    {notice && <div role="status" className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300"><Check className="h-5 w-5 shrink-0"/>{notice}</div>}

    {showCreate && <form id="create-user" onSubmit={create} className="mt-6 rounded-2xl border border-white/10 bg-[#111214] p-5 sm:p-6">
      <h2 className="text-xl font-bold">{t.add}</h2><p className="mt-2 text-sm leading-6 text-zinc-400">{t.addHelp}</p>
      <fieldset disabled={busy} className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <label className="space-y-2 text-sm"><span>{t.name}</span><Input className="h-11" name="name" required minLength={2} maxLength={120} autoComplete="name" /></label>
        <label className="space-y-2 text-sm"><span>{t.email}</span><Input className="h-11" name="email" type="email" required maxLength={254} autoComplete="off" /></label>
        <label className="space-y-2 text-sm"><span>{t.method}</span><NativeSelect className="w-full [&_select]:h-11" value={google ? 'google' : 'password'} onChange={event => setGoogle(event.target.value === 'google')}><NativeSelectOption value="password">{t.passwordMethod}</NativeSelectOption><NativeSelectOption value="google">{t.googleMethod}</NativeSelectOption></NativeSelect></label>
        {!google && <label className="space-y-2 text-sm"><span>{t.password}</span><Input className="h-11" name="password" type="password" required minLength={10} maxLength={1024} autoComplete="new-password" /></label>}
        <label className="space-y-2 text-sm"><span>{t.role}</span><RoleSelect name="role" defaultValue="user" lang={lang}/></label>
        <label className="space-y-2 text-sm"><span>{t.status}</span><StatusSelect name="status" defaultValue="active" lang={lang}/></label>
      </fieldset>
      {google && <p className="mt-4 text-sm leading-6 text-orange-300">{t.googleHelp}</p>}
      <Button type="submit" disabled={busy} className="mt-5 h-11 px-5 font-bold"><UserPlus/>{busy ? t.busy : t.add}</Button>
    </form>}

    <div className="mt-8 flex flex-wrap items-end gap-3">
      <label className="min-w-48 flex-1"><span className="sr-only">{t.search}</span><div className="relative"><Search className="absolute left-3 top-3 h-5 w-5 text-zinc-500"/><Input className="h-11 pl-10" value={query} onChange={event => setQuery(event.target.value)} placeholder={t.search}/></div></label>
      <NativeSelect aria-label={t.role} className="[&_select]:h-11" value={roleFilter} onChange={event => setRoleFilter(event.target.value)}><NativeSelectOption value="all">{t.allRoles}</NativeSelectOption>{(['user','admin','super_admin'] as const).map(role => <NativeSelectOption key={role} value={role}>{t[role]}</NativeSelectOption>)}</NativeSelect>
      <NativeSelect aria-label={t.status} className="[&_select]:h-11" value={statusFilter} onChange={event => setStatusFilter(event.target.value)}><NativeSelectOption value="all">{t.allStatuses}</NativeSelectOption><NativeSelectOption value="active">{t.active}</NativeSelectOption><NativeSelectOption value="disabled">{t.disabled}</NativeSelectOption></NativeSelect>
      <Button variant="outline" className="h-11" disabled={loading || busy} onClick={() => { setError(''); void load(); }}><RefreshCw className={loading ? 'animate-spin' : ''}/>{t.refresh}</Button>
    </div>
    {loading && !data ? <p role="status" className="py-12 text-zinc-400">{t.loading}</p> : data && <>
      <p className="my-4 text-xs text-zinc-500" aria-live="polite">{visible.length} / {data.users.length} {t.count}</p>
      <div className="space-y-3" aria-busy={busy || loading}>
        {visible.map(user => <UserCard key={`${user.id}:${user.role}:${user.status}`} user={user} lang={lang} protectedAccount={user.id === data.user.id || (owners === 1 && user.role === 'super_admin' && user.status === 'active')} isMe={user.id === data.user.id} busy={busy || loading} onChange={change => { setError(''); setPending(change); }}/>) }
        {visible.length === 0 && <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center"><Users className="mx-auto mb-3 text-zinc-500"/><h2 className="font-bold">{t.empty}</h2><p className="mt-2 text-sm text-zinc-400">{t.emptyHelp}</p><Button variant="outline" className="mt-4" onClick={() => { setQuery(''); setRoleFilter('all'); setStatusFilter('all'); }}>{t.clear}</Button></div>}
      </div>
    </>}

    <AlertDialog open={Boolean(pending)} onOpenChange={open => { if (!open && !busy) { setPending(null); setError(''); } }}>
      <AlertDialogContent className="border border-white/10 bg-[#111214] text-white sm:max-w-lg">
        <AlertDialogHeader><AlertDialogTitle>{pending?.action === 'delete_user' ? t.confirmDelete : t.confirm}</AlertDialogTitle><AlertDialogDescription className="break-all text-zinc-400">{pending?.user.name} — {pending?.user.email}</AlertDialogDescription></AlertDialogHeader>
        {pending?.action === 'update_user' ? <div className="space-y-3 text-sm"><p>{t.role}: <strong>{t[pending.user.role]} → {t[pending.role]}</strong></p><p>{t.status}: <strong>{t[pending.user.status]} → {t[pending.status]}</strong></p><p className="leading-6 text-zinc-400">{t.sessionHelp}</p></div> : <p className="text-sm leading-6 text-zinc-400">{t.deleteHelp}</p>}
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
        <AlertDialogFooter><Button variant="outline" disabled={busy} onClick={() => { setPending(null); setError(''); }}>{t.cancel}</Button><Button disabled={busy} variant={pending?.action === 'delete_user' ? 'destructive' : 'default'} onClick={() => {
          if (!pending) return;
          const body = pending.action === 'delete_user' ? { action:pending.action, userId:pending.user.id } : { action:pending.action, userId:pending.user.id, role:pending.role, status:pending.status };
          void mutate(body, pending.action === 'delete_user' ? t.deleted : t.saved, () => setPending(null));
        }}>{busy ? t.busy : pending?.action === 'delete_user' ? t.remove : t.save}</Button></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </section>;
}

function RoleSelect({ lang, ...props }: React.ComponentProps<'select'> & {lang:Lang}) {
  return <NativeSelect {...props} size="default" className="w-full [&_select]:h-11">{(['user','admin','super_admin'] as const).map(role => <NativeSelectOption key={role} value={role}>{copy[lang][role]}</NativeSelectOption>)}</NativeSelect>;
}
function StatusSelect({ lang, ...props }: React.ComponentProps<'select'> & {lang:Lang}) {
  return <NativeSelect {...props} size="default" className="w-full [&_select]:h-11"><NativeSelectOption value="active">{copy[lang].active}</NativeSelectOption><NativeSelectOption value="disabled">{copy[lang].disabled}</NativeSelectOption></NativeSelect>;
}

function UserCard({ user, lang, protectedAccount, isMe, busy, onChange }: { user:User; lang:Lang; protectedAccount:boolean; isMe:boolean; busy:boolean; onChange:(change:Change)=>void }) {
  const t = copy[lang];
  const [role, setRole] = useState<Role>(user.role);
  const [status, setStatus] = useState<Status>(user.status);
  const dirty = role !== user.role || status !== user.status;
  return <article className="rounded-2xl border border-white/10 bg-[#111214] p-5">
    <div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><h2 className="flex flex-wrap items-center gap-2 font-bold"><span className="break-all">{user.name}</span>{isMe && <span className="rounded-full bg-orange-500/10 px-2 py-1 text-xs text-orange-400">{t.you}</span>}</h2><p className="mt-1 break-all text-sm text-zinc-400">{user.email}</p><p className="mt-2 text-xs text-zinc-500">{user.googleConnected ? t.connected : t.notConnected}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${user.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-300'}`}>{t[user.status]}</span></div>
    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_auto_auto] xl:items-end">
      <label className="space-y-2 text-xs text-zinc-400"><span>{t.role}</span><RoleSelect lang={lang} value={role} disabled={protectedAccount || busy} onChange={event => setRole(event.target.value as Role)}/></label>
      <label className="space-y-2 text-xs text-zinc-400"><span>{t.status}</span><StatusSelect lang={lang} value={status} disabled={protectedAccount || busy} onChange={event => setStatus(event.target.value as Status)}/></label>
      <Button className="h-11" disabled={!dirty || protectedAccount || busy} onClick={() => onChange({ action:'update_user', user, role, status })}><Save/>{t.save}</Button>
      <Button className="h-11" variant="destructive" disabled={protectedAccount || busy} aria-label={`${t.remove}: ${user.email}`} onClick={() => onChange({ action:'delete_user', user })}><Trash2/>{t.remove}</Button>
    </div>
    {protectedAccount && <p className="mt-3 flex items-center gap-2 text-xs text-orange-300"><ShieldCheck className="h-4 w-4"/>{t.protected}</p>}
  </article>;
}
