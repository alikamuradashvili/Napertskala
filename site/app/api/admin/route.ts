import { audit, getDb, json, publicUser, requireAdmin, verifyOrigin } from '@/lib/server';
import { manageUsers } from '@/lib/user-management';

export async function GET(request: Request) {
  const auth = await requireAdmin(request); if ('error' in auth) return auth.error; const db = await getDb();
  const content = await db.prepare('SELECT key,value_ka,value_en,updated_at FROM site_content ORDER BY key').all();
  const settings = await db.prepare('SELECT key,value,updated_at FROM settings ORDER BY key').all();
  const media = await db.prepare(`SELECT m.id,m.filename,m.content_type,m.size,m.alt_ka,m.alt_en,m.created_at,
    CASE WHEN g.media_id IS NULL THEN 0 ELSE 1 END AS in_gallery,g.sort_order AS gallery_order
    FROM media m LEFT JOIN gallery_items g ON g.media_id=m.id AND g.gallery='welding'
    ORDER BY CASE WHEN g.sort_order IS NULL THEN 1 ELSE 0 END,g.sort_order,m.created_at DESC`).all();
  return json({ user:publicUser(auth.user), content:content.results??[], settings:settings.results??[], media:(media.results??[]).map((m:any)=>({...m,url:`/api/media/${m.id}`})) });
}

export async function PATCH(request: Request) {
  if (!verifyOrigin(request)) return json({error:'Invalid request origin'},403);
  const auth = await requireAdmin(request); if ('error' in auth) return auth.error; const db = await getDb(); const body = await request.json().catch(()=>({})) as Record<string,any>; const action=String(body.action??'');
  if (action === 'save_content') {
    const items = Array.isArray(body.items) ? body.items : []; if (items.length>40) return json({error:'Too many content fields'},400); const now=Date.now();
    for (const item of items) { const key=String(item.key??'').replace(/[^a-z0-9_]/g,'').slice(0,64); if(!key) continue; const ka=String(item.value_ka??'').slice(0,4000); const en=String(item.value_en??'').slice(0,4000); await db.prepare(`INSERT INTO site_content(key,value_ka,value_en,updated_by,updated_at) VALUES(?,?,?,?,?) ON CONFLICT(key) DO UPDATE SET value_ka=excluded.value_ka,value_en=excluded.value_en,updated_by=excluded.updated_by,updated_at=excluded.updated_at`).bind(key,ka,en,auth.user.id,now).run(); }
    await audit(auth.user.id,'save_content','site',null,{count:items.length}); return json({ok:true});
  }
  if (action === 'save_settings') {
    const allowed = new Set(['phone','facebook','hours','location','logo_media_id','hero_media_id']); const values=body.values&&typeof body.values==='object'?body.values:{}; const now=Date.now();
    for (const [key,value] of Object.entries(values)) { if(!allowed.has(key)) continue; await db.prepare(`INSERT INTO settings(key,value,updated_by,updated_at) VALUES(?,?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_by=excluded.updated_by,updated_at=excluded.updated_at`).bind(key,String(value??'').slice(0,1000),auth.user.id,now).run(); }
    await audit(auth.user.id,'save_settings','site'); return json({ok:true});
  }
  if (action === 'update_gallery') {
    const ids = Array.isArray(body.ids) ? body.ids.map((value:any)=>String(value)).filter(Boolean).slice(0,100) : [];
    if (new Set(ids).size !== ids.length) return json({error:'Gallery contains duplicate images.'},400);
    if (ids.length) {
      const placeholders=ids.map(()=>'?').join(',');
      const found=await db.prepare(`SELECT id FROM media WHERE id IN (${placeholders})`).bind(...ids).all<{id:string}>();
      if ((found.results??[]).length !== ids.length) return json({error:'One or more gallery images could not be found.'},400);
    }
    await db.prepare("DELETE FROM gallery_items WHERE gallery='welding'").run();
    if (ids.length) await db.batch(ids.map((id:string,index:number)=>db.prepare("INSERT INTO gallery_items(media_id,gallery,sort_order,created_at) VALUES(?,'welding',?,?)").bind(id,index,Date.now())));
    await audit(auth.user.id,'update_gallery','gallery','welding',{count:ids.length}); return json({ok:true});
  }
  if (['create_user','update_user','delete_user'].includes(action)) return manageUsers(request, body);
  return json({error:'Unknown action'},400);
}
