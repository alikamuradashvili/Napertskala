import { getDb, json } from '@/lib/server';

export async function GET() {
  const db = await getDb();
  const content = await db.prepare('SELECT key,value_ka,value_en FROM site_content').all<{key:string;value_ka:string;value_en:string}>();
  const settings = await db.prepare('SELECT key,value FROM settings').all<{key:string;value:string}>();
  const gallery = await db.prepare(`SELECT m.id,m.filename,m.alt_ka,m.alt_en FROM gallery_items g JOIN media m ON m.id=g.media_id WHERE g.gallery='welding' ORDER BY g.sort_order,m.created_at`).all<{id:string;filename:string;alt_ka:string;alt_en:string}>();
  return json({ content:Object.fromEntries((content.results??[]).map((r)=>[r.key,{ka:r.value_ka,en:r.value_en}])), settings:Object.fromEntries((settings.results??[]).map((r)=>[r.key,r.value])), gallery:(gallery.results??[]).map((m)=>({...m,url:`/api/media/${m.id}`})) },200,{'Cache-Control':'public, max-age=30'});
}
