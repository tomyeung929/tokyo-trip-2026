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
