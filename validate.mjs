import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=import.meta.dirname;const data=JSON.parse(fs.readFileSync(root+'/trip-data.json'));const html=fs.readFileSync(root+'/index.html','utf8');
assert.equal(data.days.length,5);assert.equal(data.hotels.length,4);
for(const d of data.days){assert.ok(d.stops.length>=6);assert.ok(fs.statSync(`${root}/day-${d.id}-map.png`).size>1000);const max=[0,2,5,5,6,3][d.id];for(const s of d.stops){for(const p of s[1].match(/\d+/g))assert.ok(Number(p)<=max,`Day ${d.id}: bad point ${p}`);assert.match(s[0],/^\d{2}:\d{2}–\d{2}:\d{2}$/);}}
for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){const u=match[1].replaceAll('&amp;','&');if(!/^https?:/.test(u)){assert.ok(fs.existsSync(root+'/'+u),`Missing ${u}`);}else{const url=new URL(u);assert.equal(url.protocol,'https:');if(url.pathname==='/maps/dir/'){assert.equal(url.searchParams.get('api'),'1');assert.ok(url.searchParams.get('origin'));assert.ok(url.searchParams.get('destination'));assert.ok((url.searchParams.get('waypoints')?.split('|').length||0)<=3);if(url.searchParams.get('travelmode')==='transit')assert.ok(!url.searchParams.has('waypoints'));}}}
for(const f of ['fuji.jpg','tokyo.jpg','kamakura.jpg']){const b=fs.readFileSync(root+'/'+f);assert.equal(b[0],255);assert.equal(b[1],216);}
assert.ok(!/tomyeung|bossapp|C:\\Users|booking confirmation|passport/i.test(html));
const scope='https://example.github.io/tokyo-trip-2026/';const events={};const stores=new Map();let networkCalls=0;let reply;
const caches={open:async name=>{if(!stores.has(name))stores.set(name,new Map());const m=stores.get(name);return {addAll:async files=>{for(const f of files){assert.ok(fs.existsSync(root+'/'+(f==='./'?'index.html':f)));m.set(new URL(f,scope).href,new Response('cached '+f));}},match:async req=>m.get(typeof req==='string'?req:req.url)?.clone()};},keys:async()=>[...stores.keys()],delete:async k=>stores.delete(k)};
const self={registration:{scope},location:{origin:'https://example.github.io'},clients:{claim:async()=>{}},skipWaiting:async()=>{},addEventListener:(name,fn)=>events[name]=fn};
vm.runInNewContext(fs.readFileSync(root+'/sw.js','utf8'),{self,caches,URL,Response,fetch:async()=>{networkCalls++;throw Error('offline');}});
let pending;events.install({waitUntil:p=>pending=p});await pending;events.activate({waitUntil:p=>pending=p});await pending;
events.message({data:{type:'CHECK_CACHE'},source:{postMessage:v=>reply=v},waitUntil:p=>pending=p});await pending;assert.equal(reply.type,'CACHE_READY');
for(const p of ['','index.html','style.css','app.js','day-1-map.png','day-5-map.png','fuji.jpg']){events.fetch({request:{url:scope+p,method:'GET',mode:p?'cors':'navigate'},respondWith:p=>pending=p});const res=await pending;assert.equal(res.status,200);assert.match(await res.text(),/^cached /);}
assert.equal(networkCalls,0,'Offline core requests must be cache hits');events.fetch({request:{url:scope+'unvisited',method:'GET',mode:'navigate'},respondWith:p=>pending=p});assert.match(await (await pending).text(),/index.html/);
let intercepted=false;events.fetch({request:{url:'https://www.google.com/maps',method:'GET'},respondWith:()=>intercepted=true});assert.equal(intercepted,false);
console.log('PASS: 5 days / 60 time slots / map numbers / local assets / navigation URL parameters / privacy scan / service worker install, ready message, offline assets, navigation fallback and external-link isolation.');
