const C='mt-v17';
const A=['./','index.html','styles.css','app.js','manifest.webmanifest','fonts/poppins-latin-400-normal.woff2','fonts/poppins-latin-500-normal.woff2','fonts/poppins-latin-600-normal.woff2','fonts/poppins-latin-700-normal.woff2','fonts/poppins-latin-800-normal.woff2','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(A.map(u=>new Request(u,{cache:'reload'})))))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
  e.respondWith(fetch(new Request(r.url,{cache:'no-store',credentials:'same-origin'})).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))));
});
