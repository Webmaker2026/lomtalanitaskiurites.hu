import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8'};
// Local preview only; Apache rules are independently configured in .htaccess.
http.createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(/(?:^|\/)\.|^\/(?:tools|docs|node_modules|artifacts)(?:\/|$)/.test(pathname)){res.writeHead(403);res.end();return;}
  let file=path.resolve(root,'.'+pathname);
  if(!file.startsWith(root+path.sep)){file=path.join(root,'index.html');}
  const info=await stat(file);
  if(info.isDirectory())file=path.join(file,'index.html');
  const body=await readFile(file);
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(body);
 }catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(await readFile('404.html'));}
}).listen(4173,'127.0.0.1',()=>console.log('Local preview: http://127.0.0.1:4173'));
