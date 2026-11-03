import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.ico':'image/x-icon','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.gif':'image/gif','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
 try{
  let relative=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(relative.split('/').some(s=>s.startsWith('.'))){res.writeHead(403);res.end();return;}
  if(relative.endsWith('/'))relative+='index.html';
  const full=path.resolve(root,'.'+relative);
  if(!full.startsWith(root+path.sep)||!fs.existsSync(full)||!fs.statSync(full).isFile()){res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(full)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
  if(req.method==='HEAD'){res.end();return;}
  fs.createReadStream(full).pipe(res);
 }catch{res.writeHead(400);res.end('Bad request');}
});
server.listen(4173,'127.0.0.1',()=>console.log('Portfolio preview: http://127.0.0.1:4173'));
