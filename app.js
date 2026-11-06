const tabs=[...document.querySelectorAll('[data-day]')];
const panels=[...document.querySelectorAll('.day-panel')];
function showDay(id){if(!panels.some(p=>p.id===`day-${id}`))id='1';panels.forEach(p=>p.hidden=p.id!==`day-${id}`);tabs.forEach(t=>{if(t.dataset.day===id)t.setAttribute('aria-current','true');else t.removeAttribute('aria-current');});}
function syncHash(){const m=location.hash.match(/^#day-([1-5])$/);if(m)showDay(m[1]);}
showDay(location.hash.match(/^#day-([1-5])$/)?.[1]||'1');
tabs.forEach(t=>t.addEventListener('click',()=>showDay(t.dataset.day)));window.addEventListener('hashchange',syncHash);
const dialog=document.querySelector('#map-dialog');let mapTrigger;
document.querySelectorAll('[data-map]').forEach(b=>b.addEventListener('click',()=>{mapTrigger=b;document.querySelector('#map-large').src=b.dataset.map;document.querySelector('#map-large').alt=b.getAttribute('aria-label');document.querySelector('#map-title').textContent=b.getAttribute('aria-label');dialog.showModal();}));
document.querySelector('#close-map').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>mapTrigger?.focus());
document.querySelectorAll('[data-check]').forEach(c=>{try{c.checked=localStorage.getItem('trip-check-'+c.dataset.check)==='1';}catch{}c.addEventListener('change',()=>{try{localStorage.setItem('trip-check-'+c.dataset.check,c.checked?'1':'0');}catch{}});});
let cached=false;const status=document.querySelector('#offline-status');
function updateStatus(){status.textContent=cached?(navigator.onLine?'已備妥離線閱讀 · 外部導航需上網':'離線模式 · 行程及地圖可閱讀'):(navigator.onLine?'正在準備離線內容…':'未確認離線儲存，請連線後重試');}
window.addEventListener('online',updateStatus);window.addEventListener('offline',updateStatus);
if('serviceWorker' in navigator && location.protocol!=='file:'){
 navigator.serviceWorker.addEventListener('message',e=>{if(e.data?.type==='CACHE_READY'){cached=true;updateStatus();}});
 navigator.serviceWorker.register('./sw.js').then(()=>navigator.serviceWorker.ready).then(r=>r.active?.postMessage({type:'CHECK_CACHE'})).catch(()=>{status.textContent='未能啟用離線儲存；請保持連線閱讀';});
}else{status.textContent='此瀏覽器未啟用離線儲存；請保持連線閱讀';}
const hotelChoice=document.querySelector('#return-hotel');
const hotelReturn=document.querySelector('#return-hotel-link');
const hotelQueries={tokyo:'Sotetsu Grand Fresa Tokyo Bay Ariake 3-6-6',fuji:'Super Hotel Fujikawaguchiko Natural Hot Spring 3062-5 Funatsu'};
function setHotel(value){hotelChoice.value=value;hotelReturn.href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(hotelQueries[value]);hotelReturn.setAttribute('aria-label',value==='fuji'?'導航返河口湖超級酒店（需上網）':'導航返有明相鐵酒店（需上網）');}
const japanDate=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
setHotel(japanDate>='2026-11-10'&&japanDate<='2026-11-12'?'fuji':'tokyo');
hotelChoice.addEventListener('change',()=>setHotel(hotelChoice.value));
tabs.forEach(t=>t.addEventListener('click',()=>setHotel(Number(t.dataset.day)>=3?'fuji':'tokyo')));
const initialDay=location.hash.match(/^#day-([1-5])$/);if(initialDay)setHotel(Number(initialDay[1])>=3?'fuji':'tokyo');
window.addEventListener('hashchange',()=>{const d=location.hash.match(/^#day-([1-5])$/);if(d)setHotel(Number(d[1])>=3?'fuji':'tokyo');});
document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{const feedback=document.querySelector('#copy-feedback');try{await navigator.clipboard.writeText(b.dataset.copy);b.textContent='已複製 ✓';feedback.textContent='已複製日文酒店名。';}catch{feedback.textContent='未能自動複製，請長按酒店日文名稱選取及複製。';}}));
