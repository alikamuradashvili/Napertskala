'use client';

import { useEffect, useState } from 'react';
import { canAccessAdmin, canSignIn } from '@/lib/access';

export default function AccountLink({ lang, className }: { lang: 'ka' | 'en'; className?: string }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const response = await fetch('/api/auth/me', { cache: 'no-store' });
        const result = response.ok ? await response.json() as { user?: { role?: unknown; status?: unknown } } | null : null;
        if (active) { setIsAdmin(canAccessAdmin(result?.user)); setSignedIn(canSignIn(result?.user)); }
      } catch { if (active) { setIsAdmin(false); setSignedIn(false); } }
    };
    void refresh();
    window.addEventListener('focus', refresh);
    window.addEventListener('pageshow', refresh);
    return () => { active = false; window.removeEventListener('focus', refresh); window.removeEventListener('pageshow', refresh); };
  }, []);
  if (signedIn && !isAdmin) return <button type="button" className={className} disabled={busy} onClick={async () => {
    setBusy(true);
    try { const response = await fetch('/api/auth/logout', { method: 'POST' }); if (response.ok) window.location.reload(); }
    finally { setBusy(false); }
  }}>{lang === 'ka' ? 'გასვლა' : 'Log out'}</button>;
  const label = isAdmin ? (lang === 'ka' ? 'ადმინ პანელი' : 'Admin panel') : (lang === 'ka' ? 'შესვლა' : 'Log in');
  return <a href={isAdmin ? '/admin' : '/login'} className={className} aria-label={label}><span className="sm:hidden">{isAdmin ? (lang === 'ka' ? 'პანელი' : 'Panel') : label}</span><span className="hidden sm:inline">{label}</span></a>;
}
