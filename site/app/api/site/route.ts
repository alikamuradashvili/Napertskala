import { getDb, json } from '@/lib/server';
import { serviceSlugs, type ServiceSlug } from '@/lib/services';

export async function GET() {
  const db = await getDb();
  const content = await db.prepare('SELECT key,value_ka,value_en FROM site_content').all<{key:string;value_ka:string;value_en:string}>();
  const settings = await db.prepare('SELECT key,value FROM settings').all<{key:string;value:string}>();
  const gallery = await db.prepare(`SELECT g.gallery,m.id,m.filename,m.alt_ka,m.alt_en FROM gallery_items g JOIN media m ON m.id=g.media_id ORDER BY g.gallery,g.sort_order,m.created_at`).all<{gallery:string;id:string;filename:string;alt_ka:string;alt_en:string}>();
  const galleries=serviceSlugs.reduce((result,slug)=>{result[slug]=[];return result;},{} as Record<ServiceSlug,Array<{id:string;filename:string;alt_ka:string;alt_en:string;url:string}>>);
  for(const item of gallery.results??[]){if(item.gallery in galleries)galleries[item.gallery as ServiceSlug].push({id:item.id,filename:item.filename,alt_ka:item.alt_ka,alt_en:item.alt_en,url:`/api/media/${item.id}`});}
  return json({ content:Object.fromEntries((content.results??[]).map((r)=>[r.key,{ka:r.value_ka,en:r.value_en}])), settings:Object.fromEntries((settings.results??[]).map((r)=>[r.key,r.value])), galleries, gallery:galleries.welding },200,{'Cache-Control':'no-store'});
}
