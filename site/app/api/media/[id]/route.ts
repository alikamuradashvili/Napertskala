import { env } from 'cloudflare:workers';
import { getDb } from '@/lib/server';

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const {id}=await context.params;const db=await getDb();const row=await db.prepare('SELECT object_key,content_type FROM media WHERE id=?').bind(id).first<{object_key:string;content_type:string}>();if(!row)return new Response('Not found',{status:404});const object=await env.FILES.get(row.object_key);if(!object)return new Response('Not found',{status:404});return new Response(object.body,{headers:{'Content-Type':row.content_type,'Cache-Control':'public, max-age=86400','ETag':object.httpEtag}});
}
