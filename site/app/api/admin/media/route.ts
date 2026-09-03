import { env } from 'cloudflare:workers';
import { audit, getDb, json, requireAdmin, verifyOrigin } from '@/lib/server';

export async function POST(request: Request) {
  if(!verifyOrigin(request))return json({error:'Invalid request origin'},403); const auth=await requireAdmin(request);if('error'in auth)return auth.error;
  const form=await request.formData();const file=form.get('file');if(!(file instanceof File))return json({error:'Choose an image to upload.'},400);
  if(!['image/jpeg','image/png','image/webp','image/avif'].includes(file.type))return json({error:'Use JPG, PNG, WebP, or AVIF images.'},400); if(file.size>8*1024*1024)return json({error:'Image must be smaller than 8 MB.'},400);
  const id=crypto.randomUUID();const extension=(file.name.split('.').pop()||'img').replace(/[^a-z0-9]/gi,'').toLowerCase();const objectKey=`media/${id}.${extension}`;
  await env.FILES.put(objectKey,await file.arrayBuffer(),{httpMetadata:{contentType:file.type}});const db=await getDb();const now=Date.now();await db.prepare('INSERT INTO media(id,object_key,filename,content_type,size,alt_ka,alt_en,uploaded_by,created_at) VALUES(?,?,?,?,?,?,?,?,?)').bind(id,objectKey,file.name,file.type,file.size,String(form.get('altKa')??'').slice(0,300),String(form.get('altEn')??'').slice(0,300),auth.user.id,now).run();
  if(String(form.get('addToGallery')??'')==='true'){const last=await db.prepare("SELECT COALESCE(MAX(sort_order),-1) AS position FROM gallery_items WHERE gallery='welding'").first<{position:number}>();await db.prepare("INSERT INTO gallery_items(media_id,gallery,sort_order,created_at) VALUES(?,'welding',?,?)").bind(id,Number(last?.position??-1)+1,now).run();}
  await audit(auth.user.id,'upload_media','media',id,{filename:file.name,size:file.size,addToGallery:String(form.get('addToGallery')??'')==='true'});return json({ok:true,id,url:`/api/media/${id}`},201);
}

export async function DELETE(request: Request) {
  if(!verifyOrigin(request))return json({error:'Invalid request origin'},403);const auth=await requireAdmin(request);if('error'in auth)return auth.error;const id=new URL(request.url).searchParams.get('id');if(!id)return json({error:'Missing media id'},400);const db=await getDb();const row=await db.prepare('SELECT object_key FROM media WHERE id=?').bind(id).first<{object_key:string}>();if(!row)return json({error:'Image not found'},404);
  const used=await db.prepare("SELECT COUNT(*) AS count FROM settings WHERE key IN ('logo_media_id','hero_media_id') AND value=?").bind(id).first<{count:number}>();if(Number(used?.count??0)>0)return json({error:'This image is in use. Choose a different logo or hero image first.'},409);await env.FILES.delete(row.object_key);await db.prepare('DELETE FROM media WHERE id=?').bind(id).run();await audit(auth.user.id,'delete_media','media',id);return json({ok:true});
}
