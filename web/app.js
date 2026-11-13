(()=>{
'use strict';
const KEY='moneytrack.web.v2';
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4);
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const DOW=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const SYM={GHS:'GH₵',USD:'$',EUR:'€',GBP:'£',NGN:'₦',KES:'KSh',ZAR:'R',UGX:'USh',TZS:'TSh',XOF:'CFA',CAD:'C$',INR:'₹'};
const CURS=Object.keys(SYM);
const PAL=['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ec4899','#06b6d4','#f97316','#6366f1','#84cc16','#ef4444'];
const COLORS={SV:'#6366f1',BP:'#8b5cf6',SC:'#d946ef',GR:'#f59e0b',EO:'#f97316',FG:'#ec4899',DL:'#ef4444',HB:'#06b6d4',TR:'#22c55e',DS:'#3b82f6',HI:'#14b8a6',LE:'#0ea5e9',MM:'#64748b',FC:'#94a3b8',SB:'#10b981',AS:'#38bdf8',SI:'#0ea5e9',GC:'#fb7185',LR:'#a78bfa',OI:'#a3a3a3',FS:'#10b981',SF:'#f59e0b',HR:'#6366f1',ST:'#14b8a6',IV:'#ec4899',OD:'#84cc16',WD:'#ef4444',PN:'#94a3b8',TX:'#8e8e93',AD:'#8e8e93'};
const mk=(a)=>a.map(x=>({code:x[0],name:x[1],inc:!!x[2]}));
const DAILY_CATS=mk([['SV','Savings'],['BP','Big Purchases'],['SC','Shopping and Care'],['GR','Groceries and Home'],['EO','Eating Out and Fun'],['FG','Family and Giving'],['DL','Debt and Loans'],['HB','Home and Bills'],['TR','Transport and Travel'],['DS','Data and Subscriptions'],['HI','Health and Insurance'],['LE','Learning and Education'],['MM','Money Moves'],['FC','Fees and Charges'],['SB','Salary and Bonuses',1],['AS','Allowances and Coupons',1],['SI','Side Income',1],['GC','Gifts and Contributions',1],['LR','Loans Received',1],['OI','Other Income',1]]);
const RECORDS_CATS=mk([['WD','Withdrawals'],['PN','Penalties and Charges'],['FS','Future Savings',1],['SF','School Fees',1],['HR','House Rent',1],['ST','Short Term Savings',1],['IV','Investments',1],['OD','Other Deposits',1]]);
const SYS_CATS=[{code:'TX',name:'Transfer',inc:false,sys:true},{code:'AD',name:'Adjustment',inc:false,sys:true}];
const IC={
up:'<path d="M7 17L17 7M8 7h9v9"/>',down:'<path d="M17 7L7 17M16 17H7V8"/>',swap:'<path d="M7 7h12l-3-3M17 17H5l3 3"/>',
cal:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
home:'<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
wallet:'<path d="M3 7a2 2 0 0 1 2-2h12v4"/><path d="M3 7v11a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H5a2 2 0 0 1-2-2"/><circle cx="16.5" cy="14" r="1.2"/>',
chart:'<path d="M4 20V11M10 20V4M16 20v-6M22 20H2"/>',
list:'<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
plus:'<path d="M12 5v14M5 12h14"/>',
x:'<path d="M6 6l12 12M18 6L6 18"/>',
bank:'<path d="M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>',
card:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18M7 15h4"/>',
mobileMoney:'<rect x="7" y="3" width="10" height="18" rx="3"/><path d="M11 18h2"/>',
cash:'<rect x="3" y="6" width="18" height="12" rx="3"/><circle cx="12" cy="12" r="2.5"/>',
savings:'<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/>',
invest:'<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
back:'<path d="M15 5l-7 7 7 7"/>',
chev:'<path d="M6 9l6 6 6-6"/>',
play:'<path d="M8 5l11 7-11 7z" fill="currentColor"/>',
check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
search:'<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
del:'<path d="M21 5H9l-6 7 6 7h12z"/><path d="M13 9.5l4 5M17 9.5l-4 5"/>'
};
const ico=(n,s=22)=>`<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${IC[n]||''}</svg>`;
const WTYPES=[['bank','Bank account'],['card','Card'],['mobileMoney','Mobile money'],['cash','Cash at hand'],['savings','Savings'],['invest','Investment']];
const DAY=864e5;
const VER='9.0';
const SXB=`<button class="sx" data-close aria-label="Close">${ico('x',18)}</button>`;
const VW=()=>P().wallets.filter(w=>!w.hidden);

/* ---------- state ---------- */
function newProfile(name,kind,cur){return{id:uid(),name,kind,cur:cur||'GHS',cats:(kind==='records'?RECORDS_CATS:DAILY_CATS).map(c=>({...c})),wallets:[],txns:[]}}
function seed(){const d=newProfile('Daily','daily'),s=newProfile('Savings','records');return{v:2,profiles:[d,s],active:d.id,set:{theme:'auto'}}}
function fix(j){j.set=Object.assign({theme:'auto'},j.set);j.profiles.forEach(p=>{p.kind=p.kind==='records'?'records':'daily';p.cur=p.cur||'GHS';p.cats=p.cats&&p.cats.length?p.cats:(p.kind==='records'?RECORDS_CATS:DAILY_CATS).map(c=>({...c}));p.wallets=p.wallets||[];p.txns=p.txns||[]});if(!j.profiles.some(p=>p.id===j.active))j.active=j.profiles[0].id;return j}
function load(){try{const j=JSON.parse(localStorage.getItem(KEY));if(j&&Array.isArray(j.profiles)&&j.profiles.length)return fix(j)}catch(e){}return seed()}
let S=load();
const P=()=>S.profiles.find(p=>p.id===S.active)||S.profiles[0];
const rc=()=>P().kind==='records';
const cur=()=>P().cur;

let CAL=null;
function calGrid(){const {y,m}=CAL;const first=new Date(y,m,1),dim=new Date(y,m+1,0).getDate(),off=(first.getDay()+6)%7;const cnt={};for(const t of P().txns){const d=new Date(t.t);if(d.getFullYear()===y&&d.getMonth()===m){const k=d.getDate();cnt[k]=(cnt[k]||0)+1}}const td=sd(Date.now());let h='';for(let i=0;i<off;i++)h+='<i></i>';for(let d=1;d<=dim;d++){const ts=new Date(y,m,d).getTime();h+=`<button class="cd ${cnt[d]?'has':''} ${ts===td?'td':''} ${H.d===ts?'sel':''}" data-cd="${ts}"><b>${d}</b>${cnt[d]?`<em>${cnt[d]}</em>`:''}</button>`}return`<div class="cm"><button class="ib" data-cn="-1">${ico('back',18)}</button><b>${MONTHS[m]} ${y}</b><button class="ib" data-cn="1" style="transform:scaleX(-1)">${ico('back',18)}</button></div><div class="cw">${DOW.map(x=>`<span>${x[0]}</span>`).join('')}</div><div class="cgd">${h}</div>`}
function openCal(){const n=new Date();const b=H.d?new Date(H.d):n;CAL={y:b.getFullYear(),m:b.getMonth()};
 sheet(`<h2>Pick a date</h2><p class="sm" style="margin:-8px 0 12px">Days with entries show a count. Tap one to see exactly what happened.</p><div id="calb">${calGrid()}</div><div style="display:flex;gap:10px;margin-top:14px"><button class="btn soft" id="cto">Today</button><button class="btn soft" id="ccl">Show everything</button></div>${PAD}`,sh=>{
  sh.addEventListener('click',e=>{const n=e.target.closest('[data-cn]'),d=e.target.closest('[data-cd]');if(n){CAL.m+=+n.dataset.cn;if(CAL.m<0){CAL.m=11;CAL.y--}if(CAL.m>11){CAL.m=0;CAL.y++}$('#calb',sh).innerHTML=calGrid()}else if(d){H.d=+d.dataset.cd;H.n=120;closeSheet();render()}});
  $('#cto',sh).onclick=()=>{H.d=sd(Date.now());H.n=120;closeSheet();render()};
  $('#ccl',sh).onclick=()=>{H.d=null;H.m='all';H.n=120;closeSheet();render()}})}
var AFH=null,AFT=0,AFS='',AFN='';
function idb(){return new Promise((res,rej)=>{const r=indexedDB.open('mt',1);r.onupgradeneeded=()=>r.result.createObjectStore('k');r.onsuccess=()=>res(r.result);r.onerror=rej})}
async function idbGet(k){try{const d=await idb();return await new Promise(r=>{const q=d.transaction('k').objectStore('k').get(k);q.onsuccess=()=>r(q.result);q.onerror=()=>r()})}catch(e){}}
async function idbSet(k,v){try{const d=await idb();return await new Promise(r=>{const t=d.transaction('k','readwrite');t.objectStore('k').put(v,k);t.oncomplete=r;t.onerror=r})}catch(e){}}
async function afInit(){if(!window.showSaveFilePicker)return;try{AFH=await idbGet('fh')||null;if(AFH){AFN=AFH.name;AFS=(await AFH.queryPermission({mode:'readwrite'}))==='granted'?'on':'ask'}}catch(e){AFH=null}if(TAB==='settings')render()}
async function afWrite(){if(!AFH)return;try{if((await AFH.queryPermission({mode:'readwrite'}))!=='granted'){AFS='ask';return}const w=await AFH.createWritable();await w.write(dataJSON());await w.close();AFS='on';S.set.lastAuto=Date.now()}catch(e){AFS='ask'}}
async function afPick(){try{AFH=await showSaveFilePicker({suggestedName:'MoneyTrack-autosave.json',types:[{description:'MoneyTrack backup',accept:{'application/json':['.json']}}]});AFN=AFH.name;await idbSet('fh',AFH);await afWrite();render();toast('Auto-save is on')}catch(e){}}
async function afAllow(){try{if((await AFH.requestPermission({mode:'readwrite'}))==='granted'){await afWrite();render();toast('Auto-save is on')}}catch(e){}}
function autoCard(){if(!window.showSaveFilePicker)return`<p class="sm" style="line-height:1.55">Automatic saving to a folder is not allowed by iPhone or Android browsers. On a laptop (Chrome or Edge) this page can keep one backup file up to date by itself.<br><br>On your phone: tap Back up now, then Save to Files, pick iCloud Drive and keep replacing the same file. The app reminds you after every 15 new entries.</p>`;
 if(AFS==='on')return`<div class="svst"><i class="dot"></i><div class="m"><b>Saving to ${esc(AFN)}</b><span class="sm" style="display:block">Updated within seconds of every change${S.set.lastAuto?'. Last '+new Date(S.set.lastAuto).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'}):''}.</span></div></div><button class="btn soft" style="margin-top:12px" data-act="afstop">Stop auto-save</button>`;
 if(AFS==='ask')return`<p class="sm" style="line-height:1.55">Auto-save is set to ${esc(AFN)}, but the browser needs your OK again after reopening.</p><button class="btn acc" style="margin-top:12px" data-act="afallow">Allow and resume</button><button class="btn soft" style="margin-top:8px" data-act="afstop">Stop auto-save</button>`;
 return`<p class="sm" style="line-height:1.55">Pick a file once, ideally in iCloud Drive, Google Drive or Dropbox. After that it is rewritten automatically every time you add or change something.</p><button class="btn acc" style="margin-top:12px" data-act="afpick">Choose where to save</button>`}

const DOCK=()=>{const a=rc()?[['i','Deposit','down','var(--inc)'],['e','Withdraw','up','var(--exp)']]:[['e','Expense','up','var(--exp)'],['i','Income','down','var(--inc)']];return`<div class="dock rise" style="--i:2">${a.map(([k,n,ic,c])=>`<button class="g" data-act="qa" data-v="${k}" style="--c:${c}"><i>${ico(ic,20)}</i><span>${n}</span></button>`).join('')}<button class="g" data-act="qa" data-v="t" style="--c:var(--a2)"><i>${ico('swap',20)}</i><span>Transfer</span></button><button class="g" data-act="story" style="--c:var(--a3)"><i>${ico('play',18)}</i><span>Story</span></button></div>`};
function budgetCard(a){if(rc())return'';const b=P().bud||{};const keys=Object.keys(b);
 if(!keys.length)return card('Budget','<p class="sm" style="line-height:1.5;margin-bottom:12px">Set a monthly limit and always know what you can still spend.</p><button class="btn soft" data-act="budget">Set a budget</button>',{i:3});
 const now=new Date(),dim=new Date(now.getFullYear(),now.getMonth()+1,0).getDate(),left=dim-now.getDate()+1;const sp=Object.fromEntries(a.cats.map(x=>[x.k,x.v]));let top='';
 if(b.ALL){const rem=b.ALL-a.spent,f=a.spent/b.ALL;top=`<div class="bgt"><div><span class="sm">${rem>=0?'Left this month':'Over budget by'}</span><b class="${rem<0?'exp':''}">${money(Math.abs(rem))}</b></div>${pr(f,f>1?'var(--exp)':f>.8?'var(--a3)':'var(--inc)',(f>9.99?'999+':Math.round(f*100))+'%')}</div><p class="sm" style="margin-bottom:6px">${rem>0?`About ${money(rem/left)} a day for ${left} more ${left===1?'day':'days'}.`:`${money(a.spent)} of ${money(b.ALL)} used.`}</p>`}
 const rows=keys.filter(k=>k!=='ALL').map(k=>({k,b:b[k],v:sp[k]||0})).sort((x,y)=>y.v/y.b-x.v/x.b).slice(0,5).map(r=>{const f=r.v/r.b;const col=f>1?'var(--exp)':f>.8?'var(--a3)':(COLORS[r.k]||'var(--a1)');return`<div class="bgr"><div><span>${esc(cat(r.k).name)}</span><span class="${f>1?'exp':''}">${compact(r.v)} / ${compact(r.b)}</span></div>${trk(f,col)}</div>`}).join('');
 return card('Budget',top+rows,{i:3,a:'budget',al:'Edit'})}
function openBudget(){const p=P();const cs=p.cats.filter(c=>!c.inc&&c.code!=='SV'&&c.code!=='TX'&&c.code!=='AD');const b=p.bud||{};
 sheet(`<h2>Monthly budget</h2><p class="sm" style="margin:-8px 0 14px">Leave a box empty for no limit.</p><div class="lbl"><span>Whole month</span></div><input class="field" inputmode="decimal" data-b="ALL" placeholder="e.g. 3000" value="${b.ALL||''}"><div class="lbl" style="margin-top:16px"><span>By category</span></div>${cs.map(c=>`<div class="cr"><div class="tile" style="--c:${COLORS[c.code]||'#8e8e93'};width:40px;height:40px;border-radius:14px;font-size:12px">${esc(c.code)}</div><input class="field" inputmode="decimal" data-b="${esc(c.code)}" placeholder="${esc(c.name)}" value="${b[c.code]||''}"></div>`).join('')}<div class="sticky"><button class="btn acc" id="bsv">Save budget</button></div>`,sh=>{$('#bsv',sh).onclick=()=>{const o={};sh.querySelectorAll('[data-b]').forEach(i=>{const v=parseFloat(i.value);if(v>0)o[i.dataset.b]=v});P().bud=o;dirty();closeSheet();render();toast('Budget saved')}})}
function runRec(){let ch=false;const now=Date.now();for(const p of S.profiles){for(const r of p.rec||[]){let f=new Date(r.from),y=f.getFullYear(),m=f.getMonth();if(r.last){const q=r.last.split('-').map(Number);y=q[0];m=q[1]+1}
 for(let i=0;i<600;i++){if(m>11){m-=12;y++}const ts=new Date(y,m,Math.min(r.day,new Date(y,m+1,0).getDate()),9,0).getTime();if(ts>now)break;if(ts>=r.from&&p.wallets.some(x=>x.id===r.w)){p.txns.push({id:uid(),t:ts,k:r.k,c:r.c,a:r.a,m:r.m||'',w:r.w,to:''});ch=true}r.last=y+'-'+m;m++}}}if(ch)dirty();return ch}
function recCard(){const R=P().rec||[];return(R.length?R.map(r=>{const w=P().wallets.find(x=>x.id===r.w)||{name:'?'};return`<button class="row" data-act="recdel" data-id="${r.id}"><div class="tile" style="--c:${COLORS[r.c]||'#8e8e93'};width:40px;height:40px;border-radius:14px;font-size:12px">${esc(r.c)}</div><div class="m"><b>${esc(r.m||cat(r.c).name)}</b><span>${money(r.a)} on day ${r.day} · ${esc(w.name)}</span></div><span class="sm">Remove</span></button>`}).join(''):'<p class="sm" style="line-height:1.5;margin-bottom:6px">Rent, subscriptions, regular deposits. They are added by themselves on the day.</p>')+`<button class="btn soft" style="margin-top:12px" data-act="recnew">${ico('plus',18)} Add recurring</button>`}
function openRec(){const p=P();let k=rc()?'i':'e';const opts=()=>p.cats.filter(c=>c.inc===(k==='i')&&c.code!=='TX'&&c.code!=='AD').map(c=>`<option value="${esc(c.code)}">${esc(c.name)}</option>`).join('');
 sheet(`<h2>New recurring</h2><div class="seg" id="rk">${(rc()?[['i','Deposit'],['e','Withdraw']]:[['e','Expense'],['i','Income']]).map(([x,v],i)=>`<button class="${i?'':'on'}" data-k="${x}">${v}</button>`).join('')}</div><div class="lbl" style="margin-top:14px"><span>Amount</span></div><input class="field" id="ra" inputmode="decimal" placeholder="0.00"><div class="lbl" style="margin-top:14px"><span>Category</span></div><select class="field" id="rc">${opts()}</select><div class="lbl" style="margin-top:14px"><span>${LB().w1}</span></div><select class="field" id="rw">${p.wallets.map(w=>`<option value="${w.id}">${esc(w.name)}</option>`).join('')}</select><div class="lbl" style="margin-top:14px"><span>Memo</span></div><input class="field" id="rm" maxlength="60" placeholder="e.g. Rent"><div class="lbl" style="margin-top:14px"><span>Day of the month</span></div><select class="field" id="rd">${Array.from({length:31},(_,i)=>`<option>${i+1}</option>`).join('')}</select><div class="sticky"><button class="btn acc" id="rs">Save</button></div>`,sh=>{
  $('#rk',sh).onclick=e=>{const b=e.target.closest('[data-k]');if(!b)return;k=b.dataset.k;sh.querySelectorAll('#rk button').forEach(x=>x.classList.toggle('on',x===b));$('#rc',sh).innerHTML=opts()};
  $('#rs',sh).onclick=()=>{const a=parseFloat($('#ra',sh).value);if(!(a>0)){toast('Enter an amount');return}(p.rec=p.rec||[]).push({id:uid(),k,c:$('#rc',sh).value,a:Math.round(a*100)/100,w:$('#rw',sh).value,m:$('#rm',sh).value.trim(),day:+$('#rd',sh).value,from:sd(Date.now())});runRec();dirty();closeSheet();render();toast('Recurring saved')}})}
function comingCard(){const R=P().rec||[];if(!R.length)return'';const now=new Date();const nx=R.map(r=>{let y=now.getFullYear(),m=now.getMonth();const mk=(yy,mm)=>new Date(yy,mm,Math.min(r.day,new Date(yy,mm+1,0).getDate()),9);let d=mk(y,m);if(d<now)d=mk(y,m+1);return{r,d}}).sort((a,b)=>a.d-b.d).slice(0,3);
 return card('Coming up',nx.map(({r,d})=>`<div class="row"><div class="tile" style="--c:${COLORS[r.c]||'#8e8e93'};width:40px;height:40px;border-radius:14px;font-size:12px">${esc(r.c)}</div><div class="m"><b>${esc(r.m||cat(r.c).name)}</b><span>${d.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})}</span></div><div class="r ${r.k==='i'?'inc':''}">${money(r.k==='e'?-r.a:r.a,undefined,true)}</div></div>`).join(''),{i:4})}

async function hashPin(p){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('mt1:'+p));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function askPin(title,cb,canClose){const o=document.createElement('div');o.id='lock';o.className='lock';let v='';
 o.innerHTML=`${canClose?`<button class="sx" id="lc" style="position:absolute;top:calc(var(--safe-t) + 14px);right:16px;float:none">${ico('x',18)}</button>`:''}<div class="lk"><div class="lgo"></div><h2>${title}</h2><div class="pdots"><i></i><i></i><i></i><i></i></div><div class="kp">${[1,2,3,4,5,6,7,8,9,'',0,'del'].map(k=>k===''?'<span></span>':`<button data-k="${k}">${k==='del'?ico('del',24):k}</button>`).join('')}</div></div>`;
 document.body.appendChild(o);const dots=[...o.querySelectorAll('.pdots i')];const paint=()=>dots.forEach((d,i)=>d.classList.toggle('on',i<v.length));
 o.onclick=async e=>{if(e.target.closest('#lc')){o.remove();return}const b=e.target.closest('[data-k]');if(!b)return;buzz();const k=b.dataset.k;if(k==='del')v=v.slice(0,-1);else if(v.length<4)v+=k;paint();if(v.length===4){const r=await cb(v,o);if(r==='bad'){o.classList.add('shake');buzz();setTimeout(()=>{o.classList.remove('shake');v='';paint()},420)}else o.remove()}};return o}
function lockScreen(){if(!S.set.pin||document.getElementById('lock'))return;const o=askPin('Enter your PIN',async v=>(await hashPin(v))===S.set.pin?'ok':'bad',false);const f=document.createElement('button');f.className='lf';f.textContent='Forgot PIN?';f.onclick=()=>{if(confirm('Turn off the lock? Your data stays safe. Only do this on your own phone.')){S.set.pin=null;save();o.remove();render()}};o.querySelector('.lk').appendChild(f)}
async function pinSet(){const go=()=>askPin('Choose a PIN',v1=>{askPin('Repeat the PIN',async v2=>{if(v2!==v1)return'bad';S.set.pin=await hashPin(v1);save();render();toast('App lock is on')},true)},true);
 if(S.set.pin)askPin('Current PIN',async v=>{if((await hashPin(v))!==S.set.pin)return'bad';go();return'ok'},true);else go()}
function pinOff(){askPin('Enter PIN to turn off',async v=>{if((await hashPin(v))!==S.set.pin)return'bad';S.set.pin=null;save();render();toast('App lock is off')},true)}
function secCard(){return S.set.pin?`<div class="svst"><i class="dot"></i><div class="m"><b>App lock is on</b><span class="sm" style="display:block">Asks for your PIN when you open the app or come back after a minute.</span></div></div><button class="btn soft" style="margin-top:12px" data-act="pinset">Change PIN</button><button class="btn red" data-act="pinoff">Turn off</button>`:`<p class="sm" style="line-height:1.5">Ask for a 4 digit PIN when the app opens. It keeps casual snoopers out. Your data is not encrypted.</p><button class="btn soft" style="margin-top:12px" data-act="pinset">Set a PIN</button>`}
const dataJSON=()=>JSON.stringify({v:2,app:'MoneyTrack',profiles:S.profiles,active:S.active});

/* ---------- goals (tracking only, never touches balances) ---------- */
const GC=['#4f46e5','#0ea5e9','#10b981','#f59e0b','#ef4444','#ec4899','#8b5cf6','#14b8a6'];
const MSL=[25,50,75,100];
const gOf=()=>P().goals||(P().goals=[]);
const gBal=g=>g.log.reduce((x,e)=>e.k==='add'?x+e.a:e.k==='out'?x-e.a:x,0);
const gFrac=g=>Math.max(0,Math.min(1,gBal(g)/(g.target||1)));
const gDate=t=>new Date(t).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
function gMeta(g){const b=gBal(g);if(b>=g.target)return'Reached '+gDate(g.done||Date.now());
 if(g.date){const days=Math.ceil((g.date-Date.now())/DAY);const left=g.target-b;if(days<=0)return'Past the date. '+money(left)+' to go';const pm=left/Math.max(1,days/30.4);return`${days} ${days===1?'day':'days'} left · ${money(pm)} a month`}
 const last=g.log.filter(e=>e.k==='add').pop();if(!last)return'No money added yet';const d=Math.floor((Date.now()-last.t)/DAY);return d<=0?'Added today':`Last added ${d} ${d===1?'day':'days'} ago`}
function gPace(g){const b=gBal(g);if(b>=g.target)return'';const since=Date.now()-60*DAY;const net=g.log.filter(e=>e.t>=since).reduce((x,e)=>e.k==='add'?x+e.a:e.k==='out'?x-e.a:x,0);if(net<=0)return'';const perDay=net/60;const d=new Date(Date.now()+(g.target-b)/perDay*DAY);return'At your recent pace: '+d.toLocaleDateString('en-GB',{month:'short',year:'numeric'})}
function goalCard(g,i){const b=gBal(g),f=gFrac(g),done=b>=g.target;
 return`<section class="g card gcard rise" style="--i:${i};--c:${g.c}" data-act="goal" data-id="${g.id}"><div class="gtop"><div class="gring">${pr(f,g.c,Math.round(f*100)+'%')}</div><div class="gm"><b>${esc(g.name)}</b><span>${money(b)} of ${money(g.target)}</span><em>${gMeta(g)}</em></div></div><div class="gms">${MSL.map(m=>`<i class="${f*100>=m-.01?'on':''}">${m}%</i>`).join('')}</div>${done?'<div class="gwin">Goal reached. Congratulations!</div>':`<div class="gbtn"><button class="btn acc" data-act="gadd" data-id="${g.id}">Add money</button><button class="btn soft" data-act="gout" data-id="${g.id}">Withdraw</button></div>`}</section>`}
function vGoals(){const G=gOf().slice().sort((a,b)=>(gBal(a)>=a.target)-(gBal(b)>=b.target));const won=G.filter(g=>gBal(g)>=g.target).length;const tot=G.reduce((x,g)=>x+Math.max(0,gBal(g)),0);
 return ttl('Save toward something','Goals')+(G.length?`<section class="g card rise" style="--i:1"><div class="lbl"><span class="t">Saved across goals</span></div><div class="bigt2">${money(tot)}</div><div class="row2" style="display:flex;gap:8px;margin-top:10px"><span class="pill">${G.length} ${G.length===1?'goal':'goals'}</span><span class="pill inc">${won} reached</span></div><p class="sm" style="margin-top:12px;line-height:1.5">Goals are for tracking only. They never change your wallet balances.</p></section>`:'')+
 (G.length?G.map((g,i)=>goalCard(g,i+2)).join(''):card('',`<div class="empty"><h2>Set your first goal</h2><p>A house, a trip, a rainy day fund. Add money whenever you set some aside and watch it grow. It never touches your real balances.</p></div>`,{i:1}))+`<button class="btn acc rise" style="--i:9" data-act="gnew">${ico('plus',18)} New goal</button>`}
function goalsCard(){const G=gOf().filter(g=>gBal(g)<g.target).slice(0,3);if(!gOf().length)return card('Goals',`<p class="sm" style="line-height:1.5;margin-bottom:12px">Saving for something? Track a house, a trip or anything else. It never touches your balances.</p><button class="btn soft" data-act="gnew">${ico('plus',18)} Set a goal</button>`,{i:4});
 return card('Goals',(G.length?G.map(g=>`<button class="gmini" data-act="goal" data-id="${g.id}" style="--c:${g.c}"><div><b>${esc(g.name)}</b><span>${money(gBal(g))} of ${money(g.target)}</span></div><em>${Math.round(gFrac(g)*100)}%</em>${trk(gFrac(g),g.c)}</button>`).join(''):'<p class="sm">Every goal is reached. Time for a new one.</p>'),{i:4,a:'tab',av:'goals',al:'See all'})}
function openGoal(id){const g=gOf().find(x=>x.id===id);if(!g)return;const b=gBal(g),f=gFrac(g),done=b>=g.target;let run=0;
 const rows=g.log.slice().sort((x,y)=>x.t-y.t).map(e=>{if(e.k==='add')run+=e.a;else if(e.k==='out')run-=e.a;return{e,run}}).reverse().map(({e,run})=>{const lab=e.k==='add'?'Added':e.k==='out'?'Withdrew':'Goal reached';const cls=e.k==='add'?'inc':e.k==='out'?'exp':'';return`<div class="glog ${e.k}"><i></i><div class="m"><b>${lab}${e.k==='reach'?'. Congratulations!':''}</b><span>${gDate(e.t)}${e.m&&e.k!=='reach'?' · '+esc(e.m):''}${e.k!=='reach'?' · total '+compact(run):''}</span></div>${e.k==='reach'?'':`<div class="r ${cls}">${e.k==='add'?'+':'-'}${money(e.a)}</div><button class="gx" data-gl="${e.id}" aria-label="Remove">${ico('x',14)}</button>`}</div>`}).join('');
 const pace=gPace(g);
 sheet(`<h2 style="padding-right:50px">${esc(g.name)}</h2><div class="gdet" style="--c:${g.c}">${pr(f,g.c,Math.round(f*100)+'%')}<div><b>${money(b)}</b><span>of ${money(g.target)}</span><em>${gMeta(g)}</em></div></div><div class="gms" style="margin:14px 0">${MSL.map(m=>`<i class="${f*100>=m-.01?'on':''}">${m}%</i>`).join('')}</div>${pace?`<p class="sm" style="margin-bottom:14px">${pace}</p>`:''}${done?'<div class="gwin">Goal reached. Congratulations!</div>':`<div class="gbtn"><button class="btn acc" id="gga">Add money</button><button class="btn soft" id="ggo">Withdraw</button></div>`}<div class="lbl" style="margin-top:22px"><span>History</span></div><div class="g card" style="padding:4px 16px;border-radius:24px;box-shadow:none">${rows||'<p class="sm" style="padding:14px 0">Nothing yet.</p>'}</div><div style="display:flex;gap:10px;margin-top:16px"><button class="btn soft" id="gge" style="min-height:48px">Edit goal</button><button class="btn red" id="ggd" style="min-height:48px;margin:0">Delete</button></div>${PAD}`,sh=>{
  const ga=$('#gga',sh),go=$('#ggo',sh);if(ga)ga.onclick=()=>{closeSheet(true);openGoalTx(g.id,'add')};if(go)go.onclick=()=>{closeSheet(true);openGoalTx(g.id,'out')};
  $('#gge',sh).onclick=()=>{closeSheet(true);openGoalForm(g.id)};
  $('#ggd',sh).onclick=()=>{if(confirm('Delete this goal and its history? Your balances are not affected.')){P().goals=gOf().filter(x=>x.id!==g.id);dirty();closeSheet();render();toast('Goal deleted')}};
  sh.addEventListener('click',e=>{const x=e.target.closest('[data-gl]');if(!x)return;if(confirm('Remove this entry from the goal?')){g.log=g.log.filter(l=>l.id!==x.dataset.gl);const nb=gBal(g);if(nb<g.target&&g.done){g.done=null;g.log=g.log.filter(l=>l.k!=='reach')}dirty();closeSheet(true);openGoal(g.id);render()}})})}
function openGoalForm(id){const g=id?gOf().find(x=>x.id===id):null;let col=g?g.c:GC[gOf().length%GC.length];
 sheet(`<h2>${g?'Edit goal':'New goal'}</h2><div class="lbl"><span>What are you saving for?</span></div><input class="field" id="gn" maxlength="40" placeholder="e.g. House, Trip to Dubai" value="${g?esc(g.name):''}" autocomplete="off"><div class="lbl" style="margin-top:16px"><span>Target amount</span></div><input class="field" id="gt" inputmode="decimal" placeholder="0.00" value="${g?g.target:''}"><div class="lbl" style="margin-top:16px"><span>Target date (optional)</span></div><input class="field" type="date" id="gd" value="${g&&g.date?new Date(g.date-new Date(g.date).getTimezoneOffset()*6e4).toISOString().slice(0,10):''}">${g?'':`<div class="lbl" style="margin-top:16px"><span>Already saved (optional)</span></div><input class="field" id="gs" inputmode="decimal" placeholder="0.00">`}<div class="lbl" style="margin-top:16px"><span>Colour</span></div><div class="gcols" id="gcl">${GC.map(c=>`<button class="${c===col?'on':''}" data-c="${c}" style="background:${c}" aria-label="Colour"></button>`).join('')}</div><div class="sticky"><button class="btn acc" id="gsv">${g?'Save changes':'Create goal'}</button></div>`,sh=>{
  $('#gcl',sh).onclick=e=>{const b=e.target.closest('[data-c]');if(!b)return;col=b.dataset.c;sh.querySelectorAll('#gcl button').forEach(x=>x.classList.toggle('on',x===b))};
  $('#gsv',sh).onclick=()=>{const n=$('#gn',sh).value.trim(),t=parseFloat($('#gt',sh).value),dv=$('#gd',sh).value;if(n.length<2){toast('Give the goal a name');return}if(!(t>0)){toast('Enter a target amount');return}const date=dv?new Date(dv+'T23:59').getTime():0;
   if(g){g.name=n;g.target=t;g.date=date;g.c=col;const b=gBal(g);if(b>=g.target&&!g.done){g.done=Date.now();g.log.push({id:uid(),t:Date.now(),k:'reach',a:g.target,m:'Goal reached'})}else if(b<g.target&&g.done){g.done=null;g.log=g.log.filter(l=>l.k!=='reach')}}
   else{const ng={id:uid(),name:n,target:t,date,c:col,created:Date.now(),done:null,log:[]};const s0=parseFloat(($('#gs',sh)||{}).value);if(s0>0)ng.log.push({id:uid(),t:Date.now(),k:'add',a:Math.round(s0*100)/100,m:'Starting amount'});gOf().push(ng);if(gBal(ng)>=ng.target){ng.done=Date.now();ng.log.push({id:uid(),t:Date.now()+1,k:'reach',a:ng.target,m:'Goal reached'});dirty();closeSheet();TAB='goals';render();celebrate(ng);return}}
   dirty();closeSheet();if(TAB!=='goals'&&!g)TAB='goals';render();toast(g?'Goal updated':'Goal created')}})}
function openGoalTx(id,kind){const g=gOf().find(x=>x.id===id);if(!g)return;const out=kind==='out';let t=Date.now();
 const dt=()=>new Date(t-new Date(t).getTimezoneOffset()*6e4).toISOString().slice(0,16);
 const chips=()=>[[0,'Today'],[1,'Yesterday'],[2,'2 days ago']].map(([n,l])=>`<button class="chip ${sd(t)===sd(Date.now())-n*DAY?'on':''}" data-d="${n}">${l}</button>`).join('');
 sheet(`<h2>${out?'Withdraw from':'Add to'} ${esc(g.name)}</h2><p class="sm" style="margin:-6px 0 14px">${out?'This only updates the goal. It does not touch your wallets.':'This only updates the goal. It does not touch your wallets.'}</p><div class="lbl"><span>Amount</span></div><input class="field gamt" id="ga" inputmode="decimal" placeholder="0.00" autocomplete="off"><div class="lbl" style="margin-top:16px"><span>When</span></div><div class="chips" id="gdc" style="margin-bottom:8px">${chips()}</div><input class="field" type="datetime-local" id="gw" value="${dt()}"><div class="lbl" style="margin-top:16px"><span>Note (optional)</span></div><input class="field" id="gm" maxlength="60" placeholder="${out?'Why are you taking it out?':'e.g. December bonus'}" autocomplete="off"><div class="sticky"><button class="btn ${out?'red':'acc'}" id="gok">${out?'Withdraw':'Add money'}</button></div>`,sh=>{
  $('#gdc',sh).onclick=e=>{const b=e.target.closest('[data-d]');if(!b)return;const n=new Date(),x=new Date(n);x.setDate(n.getDate()-(+b.dataset.d));t=x.getTime();$('#gw',sh).value=dt();$('#gdc',sh).innerHTML=chips()};
  $('#gw',sh).onchange=()=>{const v=new Date($('#gw',sh).value).getTime();if(v){t=v;$('#gdc',sh).innerHTML=chips()}};
  $('#gok',sh).onclick=()=>{const a=Math.round(parseFloat($('#ga',sh).value)*100)/100;if(!(a>0)){toast('Enter an amount');return}if(out&&a>gBal(g)){toast('That is more than the goal holds');return}
   const before=gFrac(g)*100;g.log.push({id:uid(),t,k:kind,a,m:$('#gm',sh).value.trim()});g.log.sort((x,y)=>x.t-y.t);const bal=gBal(g);let reached=false;
   if(bal>=g.target&&!g.done){g.done=t;g.log.push({id:uid(),t:t+1,k:'reach',a:g.target,m:'Goal reached'});reached=true}else if(bal<g.target&&g.done){g.done=null;g.log=g.log.filter(l=>l.k!=='reach')}
   const after=Math.min(100,bal/g.target*100);const crossed=MSL.filter(x=>x<100&&before<x&&after>=x);dirty();closeSheet();render();
   if(reached)celebrate(g);else if(crossed.length)toast(`${crossed[crossed.length-1]}% of ${g.name}. Keep going!`);else toast(out?'Withdrawn from goal':'Added to goal')}})}
function celebrate(g){const o=document.createElement('div');o.className='cele';const cols=GC.concat(['#fff','#fde047']);
 o.innerHTML=`<div class="conf">${Array.from({length:44},(_,i)=>`<i style="left:${Math.random()*100}%;background:${cols[i%cols.length]};animation-delay:${(Math.random()*.7).toFixed(2)}s;--r:${Math.round(Math.random()*720-360)}deg;--x:${Math.round(Math.random()*120-60)}px"></i>`).join('')}</div><div class="cbox"><div class="ctr">${ico('check',40)}</div><h2>Goal reached!</h2><p><b>${esc(g.name)}</b></p><div class="cam">${money(g.target)}</div><p class="sm">Congratulations. You set this goal and you got there.</p><button class="btn acc" id="cok">Amazing</button></div>`;
 document.body.appendChild(o);buzz();const close=()=>{o.classList.add('out');setTimeout(()=>o.remove(),350)};$('#cok',o).onclick=close}
/* ---------- debts and loans (tracking only) ---------- */
const dOf=()=>P().debts||(P().debts=[]);
const dPaid=d=>d.pay.reduce((x,e)=>x+e.a,0);
const dLeft=d=>Math.max(0,Math.round((d.a-dPaid(d))*100)/100);
function dDue(d){if(dLeft(d)<=0)return'Settled';if(!d.due)return'No due date';const n=Math.ceil((d.due-Date.now())/DAY);return n<0?`Overdue by ${-n} ${-n===1?'day':'days'}`:n===0?'Due today':`Due in ${n} ${n===1?'day':'days'}`}
const dTot=k=>dOf().filter(d=>d.k===k).reduce((x,d)=>x+dLeft(d),0);
function debtCard(d,i){const f=dPaid(d)/d.a,L=dLeft(d)<=0,lent=d.k==='lent',col=lent?'var(--inc)':'var(--exp)',over=!L&&d.due&&d.due<Date.now();
 return`<section class="g card gcard rise" style="--i:${i};--c:${col}" data-act="debt" data-id="${d.id}"><div class="gtop"><div class="gring">${pr(f,col,Math.round(f*100)+'%')}</div><div class="gm"><b>${esc(d.who)}</b><span>${L?'Settled':money(dLeft(d))+(lent?' owed to you':' left to pay')}</span><em style="${over?'color:var(--exp)':''}">${dDue(d)}${d.m?' · '+esc(d.m):''}</em></div></div></section>`}
function vDebts(){const D=dOf().slice().sort((a,b)=>(dLeft(a)<=0)-(dLeft(b)<=0)||(a.due||9e15)-(b.due||9e15));
 return ttl('Who owes what','Debts')+`<section class="g card rise hsum" style="--i:1"><div class="hs3"><div><span>Owed to you</span><b class="inc">${money(dTot('lent'))}</b></div><div><span>You owe</span><b class="exp">${money(dTot('owe'))}</b></div></div><p class="sm" style="margin-top:12px;line-height:1.5">For tracking only. Debts never change your wallet balances.</p></section>`+
 (D.length?D.map((d,i)=>debtCard(d,i+2)).join(''):card('',`<div class="empty"><h2>Nobody owes anybody</h2><p>Lend money to a friend or borrow some, and keep track until it is paid back. Split bills from the entry screen land here too.</p></div>`,{i:2}))+`<button class="btn acc rise" style="--i:9" data-act="dnew">${ico('plus',18)} New debt</button>`}
function debtsCard(){const o=dOf().filter(d=>dLeft(d)>0);if(!o.length)return'';return card('Debts',`<div class="hs3"><div><span>Owed to you</span><b class="inc">${compact(dTot('lent'))}</b></div><div><span>You owe</span><b class="exp">${compact(dTot('owe'))}</b></div></div>${o.some(d=>d.due&&d.due<Date.now())?'<p class="sm" style="margin-top:10px;color:var(--exp)">Something is overdue.</p>':''}`,{i:4,a:'tab',av:'debts',al:'See all'})}
const dateVal=t=>t?new Date(t-new Date(t).getTimezoneOffset()*6e4).toISOString().slice(0,10):'';
function openDebtForm(id){const d=id?dOf().find(x=>x.id===id):null;let k=d?d.k:'lent';
 sheet(`<h2>${d?'Edit debt':'New debt'}</h2><div class="seg" id="dk"><button class="${k==='lent'?'on':''}" data-k="lent">They owe me</button><button class="${k==='owe'?'on':''}" data-k="owe">I owe them</button></div><div class="lbl" style="margin-top:14px"><span>Who</span></div><input class="field" id="dw" maxlength="40" placeholder="Name" value="${d?esc(d.who):''}" autocomplete="off"><div class="lbl" style="margin-top:16px"><span>Amount</span></div><input class="field" id="da" inputmode="decimal" placeholder="0.00" value="${d?d.a:''}"><div class="lbl" style="margin-top:16px"><span>Due date (optional)</span></div><input class="field" type="date" id="dd2" value="${d?dateVal(d.due):''}"><div class="lbl" style="margin-top:16px"><span>Note (optional)</span></div><input class="field" id="dn" maxlength="60" value="${d?esc(d.m||''):''}" autocomplete="off"><div class="sticky"><button class="btn acc" id="dsv">Save</button></div>`,sh=>{
  $('#dk',sh).onclick=e=>{const b=e.target.closest('[data-k]');if(!b)return;k=b.dataset.k;sh.querySelectorAll('#dk button').forEach(x=>x.classList.toggle('on',x===b))};
  $('#dsv',sh).onclick=()=>{const who=$('#dw',sh).value.trim(),a=Math.round(parseFloat($('#da',sh).value)*100)/100,dv=$('#dd2',sh).value,m=$('#dn',sh).value.trim();if(!who){toast('Add a name');return}if(!(a>0)){toast('Enter an amount');return}const due=dv?new Date(dv+'T23:59').getTime():0;
   if(d){if(a<dPaid(d)){toast('Less than already paid');return}Object.assign(d,{who,k,a,due,m})}else dOf().push({id:uid(),who,k,a,t:Date.now(),due,m,pay:[]});
   dirty();closeSheet();if(TAB!=='debts')TAB='debts';render();toast('Saved')}})}
function openDebt(id){const d=dOf().find(x=>x.id===id);if(!d)return;const lent=d.k==='lent',left=dLeft(d),f=dPaid(d)/d.a,col=lent?'var(--inc)':'var(--exp)';
 const rows=d.pay.slice().sort((a,b)=>b.t-a.t).map(p=>`<div class="glog add"><i></i><div class="m"><b>${lent?'Received':'Paid'}</b><span>${gDate(p.t)}${p.m?' · '+esc(p.m):''}</span></div><div class="r inc">${money(p.a)}</div><button class="gx" data-pl="${p.id}" aria-label="Remove">${ico('x',14)}</button></div>`).join('');
 sheet(`<h2 style="padding-right:50px">${esc(d.who)}</h2><div class="gdet" style="--c:${col}">${pr(f,col,Math.round(f*100)+'%')}<div><b>${money(left)}</b><span>${lent?'still owed to you':'left to pay'} of ${money(d.a)}</span><em>${dDue(d)}</em></div></div>${d.m?`<p class="sm" style="margin:12px 0 0">${esc(d.m)}</p>`:''}${left>0?`<div class="gbtn" style="margin-top:16px"><button class="btn acc" id="dpb">${lent?'Payment received':'Record payment'}</button><button class="btn soft" id="dst">Mark settled</button></div>`:'<div class="gwin" style="margin-top:16px">Settled</div>'}<div class="lbl" style="margin-top:22px"><span>History</span></div><div class="g card" style="padding:4px 16px;border-radius:24px;box-shadow:none">${rows||'<p class="sm" style="padding:14px 0">No payments yet.</p>'}</div><div style="display:flex;gap:10px;margin-top:16px"><button class="btn soft" id="dge" style="min-height:48px">Edit</button><button class="btn red" id="dgd" style="min-height:48px;margin:0">Delete</button></div>${PAD}`,sh=>{
  const pb=$('#dpb',sh),st=$('#dst',sh);if(pb)pb.onclick=()=>{closeSheet(true);openDebtPay(d.id)};
  if(st)st.onclick=()=>{d.pay.push({id:uid(),t:Date.now(),a:left,m:'Settled'});dirty();closeSheet(true);render();toast('Settled. Nice');openDebt(d.id)};
  $('#dge',sh).onclick=()=>{closeSheet(true);openDebtForm(d.id)};
  $('#dgd',sh).onclick=()=>{if(confirm('Delete this debt and its history?')){P().debts=dOf().filter(x=>x.id!==d.id);dirty();closeSheet();render();toast('Deleted')}};
  sh.addEventListener('click',e=>{const x=e.target.closest('[data-pl]');if(!x)return;if(confirm('Remove this payment?')){d.pay=d.pay.filter(p=>p.id!==x.dataset.pl);dirty();closeSheet(true);openDebt(d.id);render()}})})}
function openDebtPay(id){const d=dOf().find(x=>x.id===id);if(!d)return;const left=dLeft(d);
 sheet(`<h2>${d.k==='lent'?'Payment from':'Payment to'} ${esc(d.who)}</h2><p class="sm" style="margin:-6px 0 14px">${money(left)} left. This does not touch your wallets.</p><div class="lbl"><span>Amount</span></div><input class="field gamt" id="pa" inputmode="decimal" value="${left}" autocomplete="off"><div class="lbl" style="margin-top:16px"><span>Date</span></div><input class="field" type="date" id="pd" value="${dateVal(Date.now())}"><div class="lbl" style="margin-top:16px"><span>Note (optional)</span></div><input class="field" id="pn" maxlength="60" autocomplete="off"><div class="sticky"><button class="btn acc" id="pok">Save payment</button></div>`,sh=>{
  $('#pok',sh).onclick=()=>{const a=Math.round(parseFloat($('#pa',sh).value)*100)/100;if(!(a>0)){toast('Enter an amount');return}if(a>left){toast('More than what is left');return}d.pay.push({id:uid(),t:new Date($('#pd',sh).value+'T12:00').getTime()||Date.now(),a,m:$('#pn',sh).value.trim()});dirty();closeSheet(true);render();toast(dLeft(d)<=0?'Fully settled':'Payment saved');openDebt(d.id)}})}

/* ---------- subscriptions ---------- */
function recNext(r){const now=new Date();const mk=(y,m)=>new Date(y,m,Math.min(r.day,new Date(y,m+1,0).getDate()),9);let d=mk(now.getFullYear(),now.getMonth());if(d<now)d=mk(now.getFullYear(),now.getMonth()+1);return d}
function subDetect(){const have=new Set((P().rec||[]).map(r=>(r.m||'').toLowerCase()));const g={};const lim=Date.now()-190*DAY;
 for(const t of P().txns){if(t.k!=='e'||SYSC(t.c)||t.c==='SV'||!t.m||t.t<lim)continue;const k=t.m.trim().toLowerCase();(g[k]=g[k]||[]).push(t)}
 const out=[];for(const k in g){if(have.has(k))continue;const a=g[k];const ms=new Set(a.map(t=>mkey(t.t)));if(ms.size<3)continue;const last=a.slice().sort((x,y)=>y.t-x.t)[0];const amts=a.map(t=>t.a);if(Math.max(...amts)>Math.min(...amts)*1.25)continue;out.push(last)}return out.slice(0,4)}
function vSubs(){const R=P().rec||[];const ex=R.filter(r=>r.k==='e'),inc=R.filter(r=>r.k==='i');const mo=ex.reduce((x,r)=>x+r.a,0);const det=subDetect();
 const row=r=>{const d=recNext(r),n=Math.ceil((d-Date.now())/DAY),w=P().wallets.find(x=>x.id===r.w)||{name:'?'};return`<div class="row"><div class="tile" style="--c:${COLORS[r.c]||'#8e8e93'};width:40px;height:40px;border-radius:14px;font-size:12px">${esc(r.c)}</div><div class="m"><b>${esc(r.m||cat(r.c).name)}</b><span>${d.toLocaleDateString('en-GB',{day:'numeric',month:'short'})} · ${n<=0?'today':'in '+n+(n===1?' day':' days')} · ${esc(w.name)}</span></div><div class="r ${r.k==='i'?'inc':''}">${money(r.a)}</div><button class="gx" data-act="recdel" data-id="${r.id}" aria-label="Remove">${ico('x',14)}</button></div>`};
 return ttl('Repeats every month','Subscriptions')+`<section class="g card rise hsum" style="--i:1"><div class="hs3"><div><span>Per month</span><b class="exp">${compact(mo)}</b></div><div><span>Per year</span><b class="exp">${compact(mo*12)}</b></div><div><span>Active</span><b>${ex.length}</b></div></div></section>`+
 (ex.length?card('Payments',ex.sort((a,b)=>recNext(a)-recNext(b)).map(row).join(''),{i:2}):card('',`<div class="empty"><h2>No subscriptions yet</h2><p>Add the bills that repeat every month and they are logged for you on the day.</p></div>`,{i:2}))+
 (inc.length?card('Regular income',inc.map(row).join(''),{i:3}):'')+
 (det.length?card('Looks recurring',`<p class="sm" style="margin-bottom:6px">You paid these about every month. Tap to track them automatically.</p>`+det.map((t,i)=>`<button class="row" data-act="subadd" data-id="${t.id}"><div class="tile" style="--c:${COLORS[t.c]||'#8e8e93'};width:40px;height:40px;border-radius:14px;font-size:12px">${esc(t.c)}</div><div class="m"><b>${esc(t.m)}</b><span>${money(t.a)} around day ${new Date(t.t).getDate()}</span></div><span class="pill">Track</span></button>`).join(''),{i:4}):'')+
 `<button class="btn acc rise" style="--i:9" data-act="recnew">${ico('plus',18)} New recurring</button>`}

/* ---------- monthly report image ---------- */
async function drawReport(k){try{await document.fonts.load('800 60px Poppins');await document.fonts.load('600 30px Poppins')}catch(e){}
 const W=1080,HH=1350,cv=document.createElement('canvas');cv.width=W;cv.height=HH;const x=cv.getContext('2d');const cs=getComputedStyle(document.documentElement);const a1=cs.getPropertyValue('--a1').trim()||'#4f46e5',a2=cs.getPropertyValue('--a2').trim()||'#9333ea';
 const y=Math.floor(k/12),mo=k%12,L=LB();let sp=0,ea=0,sv=0,n=0;const by={};
 for(const t of P().txns){if(mkey(t.t)!==k)continue;const w=WM()[t.w];if(w&&w.hidden)continue;n++;if(t.k==='t'||SYSC(t.c))continue;if(t.k==='e'){if(t.c==='SV'&&!rc())sv+=t.a;else{sp+=t.a;by[t.c]=(by[t.c]||0)+t.a}}else if(t.c!=='LR')ea+=t.a}
 const mm=v=>{const h=S.set.hide;S.set.hide=false;const r=money(v);S.set.hide=h;return r};
 const g=x.createLinearGradient(0,0,W,HH);g.addColorStop(0,a1);g.addColorStop(1,a2);x.fillStyle=g;x.fillRect(0,0,W,HH);
 x.fillStyle='rgba(255,255,255,.10)';x.beginPath();x.arc(W-80,120,320,0,7);x.fill();x.beginPath();x.arc(60,HH-60,260,0,7);x.fill();
 x.fillStyle='#fff';x.textBaseline='alphabetic';x.font='600 34px Poppins,system-ui,sans-serif';x.globalAlpha=.8;x.fillText('MoneyTrack · '+esc2(P().name),80,120);x.globalAlpha=1;
 x.font='800 96px Poppins,system-ui,sans-serif';x.fillText(MONTHS[mo],80,250);x.font='600 44px Poppins,system-ui,sans-serif';x.globalAlpha=.8;x.fillText(String(y),80,310);x.globalAlpha=1;
 const stat=(lab,val,yy)=>{x.font='600 30px Poppins,system-ui,sans-serif';x.globalAlpha=.75;x.fillText(lab,80,yy);x.globalAlpha=1;x.font='800 70px Poppins,system-ui,sans-serif';x.fillText(val,80,yy+78)};
 stat(L.spend,mm(sp),420);stat(L.earn,mm(ea),600);stat(rc()?'Net':'Net',mm(ea-sp),780);
 const top=Object.entries(by).sort((a,b)=>b[1]-a[1]).slice(0,3);const mx=Math.max(1,...top.map(t=>t[1]));
 x.font='700 32px Poppins,system-ui,sans-serif';x.fillText(top.length?'Top categories':'',80,960);
 top.forEach(([c,v],i)=>{const yy=1000+i*84;x.font='600 30px Poppins,system-ui,sans-serif';x.fillText(cat(c).name,80,yy+30);x.textAlign='right';x.fillText(mm(v),W-80,yy+30);x.textAlign='left';x.fillStyle='rgba(255,255,255,.28)';x.fillRect(80,yy+44,W-160,10);x.fillStyle='#fff';x.fillRect(80,yy+44,(W-160)*v/mx,10)});
 x.font='600 28px Poppins,system-ui,sans-serif';x.globalAlpha=.7;x.fillText(n+' entries'+(sv>0?' · '+mm(sv)+' saved':''),80,HH-70);x.globalAlpha=1;return cv}
const esc2=s=>String(s).slice(0,24);
function openReport(){const mk=monthKeys();if(!mk.length){toast('Nothing to report yet');return}let k=mk.includes(mkey(Date.now()))?mkey(Date.now()):mk[0],cv=null;
 sheet(`<h2>Monthly report</h2><div class="chips" id="rpm" style="margin-bottom:12px">${mk.slice(0,12).map(m=>`<button class="chip ${m===k?'on':''}" data-m="${m}">${MONTHS[m%12].slice(0,3)} ${String(Math.floor(m/12)).slice(2)}</button>`).join('')}</div><img class="rpt" id="rpi" alt="Monthly report"><button class="btn acc" id="rps" style="margin-top:14px">Share image</button>${PAD}`,sh=>{
  const draw=async()=>{cv=await drawReport(k);$('#rpi',sh).src=cv.toDataURL('image/png')};draw();
  $('#rpm',sh).onclick=e=>{const b=e.target.closest('[data-m]');if(!b)return;k=+b.dataset.m;sh.querySelectorAll('#rpm .chip').forEach(x=>x.classList.toggle('on',x===b));draw()};
  $('#rps',sh).onclick=()=>{if(!cv)return;cv.toBlob(b=>shareFile('MoneyTrack-'+MONTHS[k%12]+'-'+Math.floor(k/12)+'.png',b,'image/png'))}})}

/* ---------- receipts ---------- */
function compressImg(file){return new Promise((res,rej)=>{const u=URL.createObjectURL(file),im=new Image();im.onload=()=>{const s=Math.min(1,900/Math.max(im.width,im.height));const c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);res(c.toDataURL('image/jpeg',.6))};im.onerror=rej;im.src=u})}
const rcHtml=()=>A.img?`<div class="rcp"><img src="${A.img}" alt="Receipt"><button class="chip" data-a="rcx">Remove</button></div>`:`<button class="chip" data-a="rcp">Add a photo</button>`;
/* ---------- payment cards ---------- */
const lastDigits=w=>{let h=0;for(const ch of w.id+w.name)h=(h*31+ch.charCodeAt(0))>>>0;return String(1000+h%9000)};
const CHIP='<svg class="pc-chip" viewBox="0 0 40 30"><defs><linearGradient id="chg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7e7ae"/><stop offset="1" stop-color="#c7a047"/></linearGradient></defs><rect width="40" height="30" rx="6" fill="url(#chg)"/><path d="M0 10h13v10H0M27 10h13v10H27M13 4h14v22H13" fill="none" stroke="rgba(90,60,0,.4)" stroke-width="1"/></svg>';
const NFC='<svg class="pc-nfc" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 6c3 3.5 3 8.5 0 12M12 4c4.5 4.5 4.5 11.5 0 16M16 2c6 5.500 6 14.500 0 20" transform="translate(-1 0)"/></svg>';
function wflow(w,from){let inn=0,out=0;for(const t of P().txns){if(t.t<from)continue;if(t.k==='i'&&t.w===w.id&&t.c!=='AD')inn+=t.a;else if(t.k==='e'&&t.w===w.id&&t.c!=='AD')out+=t.a;else if(t.k==='t'){if(t.w===w.id)out+=t.a;if(t.to===w.id)inn+=t.a}}return{inn,out}}
function payCard(w,o={}){const c=WCOL(w),b=BAL()[w.id],T=(WTYPES.find(t=>t[0]===w.type)||[])[1]||'';const tag=o.tag||'button';const at=o.attrs===undefined?`data-act="wallet" data-id="${w.id}"`:o.attrs;
 const st=o.stat?`<div class="pc-st"><span class="up">↑ ${compact(o.stat.inn,w.cur)}</span><span class="dn">↓ ${compact(o.stat.out,w.cur)}</span></div>`:'';
 const sp=o.spark?`<div class="pc-sp">${spark(o.spark,{h:56,c:'#fff',dot:false})}</div>`:'';
 return`<${tag} class="pcard ${o.mini?'mini':''} ${o.on?'on':''} ${o.cls||''}" ${at} data-v="${w.id}" style="--c:${c};--i:${o.i||0}"><i class="pc-glare"></i>${sp}<div class="pc-top"><span class="pc-name">${esc(w.name)}</span>${NFC}</div><div class="pc-mid">${CHIP}<span class="pc-num">•••• ${lastDigits(w)}</span></div><div class="pc-bot"><div class="pc-b"><small>${T} · ${w.cur}</small><b class="pc-bal ${o.fit?'fit':''}" ${o.cu?`data-cu="${b}" data-cur="${w.cur}"`:''}>${money(b,w.cur)}</b></div>${st}</div></${tag}>`}
(()=>{const rs=()=>document.querySelectorAll('.pcard[style*="--ry"]').forEach(c=>{c.style.removeProperty('--ry');c.style.removeProperty('--rx');c.style.setProperty('--go','.3')});
 document.addEventListener('pointermove',e=>{const c=e.target.closest&&e.target.closest('.pcard');if(!c)return;if(e.pointerType==='touch'&&!e.pressure)return;const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;c.style.setProperty('--ry',((x-.5)*12).toFixed(1)+'deg');c.style.setProperty('--rx',((.5-y)*12).toFixed(1)+'deg');c.style.setProperty('--gx',(x*100).toFixed(0)+'%');c.style.setProperty('--gy',(y*100).toFixed(0)+'%');c.style.setProperty('--go','.75')});
 ['pointerup','pointercancel','pointerleave'].forEach(n=>document.addEventListener(n,rs,true));document.addEventListener('pointerout',e=>{if(e.target.closest&&e.target.closest('.pcard')&&!(e.relatedTarget&&e.target.closest('.pcard').contains(e.relatedTarget)))rs()})})();

/* ---------- undo, templates, swipe ---------- */
function delTx(id){const t=P().txns.find(x=>x.id===id);if(!t)return;P().txns=P().txns.filter(x=>x.id!==id);dirty();render();toast('Deleted',()=>{P().txns.push(t);dirty();render()})}
const tOf=()=>P().tpl||(P().tpl=[]);
function useTpl(t){const w=WM()[t.w]?t.w:(VW()[0]||{}).id;if(!w)return;const n={id:uid(),t:Date.now(),k:t.k,c:t.c,a:t.a,m:t.m||'',w,to:''};P().txns.push(n);dirty();buzz();okAnim();render();toast('Added '+money(n.k==='e'?-n.a:n.a,undefined,true)+' '+(n.m||cat(n.c).name),()=>{P().txns=P().txns.filter(x=>x.id!==n.id);dirty();render()})}
const lastTx=()=>P().txns.filter(t=>t.k!=='t'&&!SYSC(t.c)).sort((a,b)=>b.t-a.t)[0];
function quickCard(){const last=lastTx(),T=tOf();if(!last&&!T.length)return'';
 return`<div class="qrow rise" style="--i:2"><div class="lbl"><span class="t">Quick add</span></div><div class="chips">${last?`<button class="chip qa" data-act="repeat"><b>↻</b> ${esc((last.m||cat(last.c).name).slice(0,16))} <em>${compact(last.a)}</em></button>`:''}${T.map(t=>`<button class="chip qa" data-act="tpl" data-id="${t.id}">${esc((t.m||cat(t.c).name).slice(0,16))} <em>${compact(t.a)}</em></button>`).join('')}<button class="chip qa ghost" data-act="tpls">${ico('plus',14)} Templates</button></div></div>`}
function openTpls(){const T=tOf();sheet(`<h2>Quick templates</h2><p class="sm" style="margin:-6px 0 14px;line-height:1.5">Tap a template on Today to log it instantly. Make one by switching on "Save as quick template" when you add an entry, or from any entry's details.</p>${T.length?T.map(t=>`<div class="row"><div class="tile" style="--c:${COLORS[t.c]||'#8e8e93'};width:40px;height:40px;border-radius:14px;font-size:12px">${esc(t.c)}</div><div class="m"><b>${esc(t.m||cat(t.c).name)}</b><span>${money(t.k==='e'?-t.a:t.a,undefined,true)} · ${esc((WM()[t.w]||{}).name||'')}</span></div><button class="gx" data-tx="${t.id}" aria-label="Remove">${ico('x',14)}</button></div>`).join(''):'<p class="sm" style="padding:10px 0">No templates yet.</p>'}${PAD}`,sh=>{sh.addEventListener('click',e=>{const x=e.target.closest('[data-tx]');if(!x)return;P().tpl=tOf().filter(t=>t.id!==x.dataset.tx);dirty();closeSheet(true);openTpls();render()})})}
const swRow=(t,m)=>`<div class="sw"><div class="swa"><button data-act="dup" data-id="${t.id}">${ico('plus',18)}<span>Copy</span></button><button class="red" data-act="swdel" data-id="${t.id}">${ico('del',18)}<span>Delete</span></button></div>${txRow(t,m)}</div>`;
(()=>{let el=null,x0=0,y0=0,dx=0,lock=0,base=0;const R=s=>s.querySelector('.row');const setX=(s,x)=>{R(s).style.transform=`translateX(${x}px)`;s.style.setProperty('--sw',-x+'px')};
 document.addEventListener('touchstart',e=>{const s=e.target.closest('.sw');document.querySelectorAll('.sw.open').forEach(o=>{if(o!==s){o.classList.remove('open');setX(o,0)}});if(!s)return;el=s;x0=e.touches[0].clientX;y0=e.touches[0].clientY;dx=0;lock=0;base=s.classList.contains('open')?-150:0},{passive:true});
 document.addEventListener('touchmove',e=>{if(!el)return;const t=e.touches[0],mx=t.clientX-x0,my=t.clientY-y0;if(!lock){if(Math.abs(mx)>8&&Math.abs(mx)>Math.abs(my)*1.4)lock=1;else if(Math.abs(my)>8)lock=2}if(lock!==1)return;dx=Math.max(-170,Math.min(0,base+mx));R(el).style.transition='none';setX(el,dx)},{passive:true});
 document.addEventListener('touchend',()=>{if(!el)return;R(el).style.transition='';if(lock===1){const o=dx<-70;el.classList.toggle('open',o);setX(el,o?-150:0)}el=null});
 document.addEventListener('click',e=>{const s=e.target.closest('.sw');if(s&&s.classList.contains('open')&&e.target.closest('.row')){e.stopPropagation();e.preventDefault();s.classList.remove('open');setX(s,0)}},true)})();

/* ---------- insights extras ---------- */
function placeCards(r,exp,d){const inR=P().txns.filter(t=>t.t>=r.from&&t.t<r.to&&inFlow(t));const m={};for(const t of inR){if(!t.m)continue;const k=t.m.trim().toLowerCase();const o=m[k]||(m[k]={n:t.m.trim(),v:0,c:0,cat:t.c});o.v+=t.a;o.c++}
 const pl=Object.values(m).sort((a,b)=>b.v-a.v).slice(0,5),mx=pl[0]?pl[0].v:1;const big=inR.slice().sort((a,b)=>b.a-a.a).slice(0,5),bm=big[0]?big[0].a:1;
 const t0=inR.length?Math.min(...inR.map(t=>t.t)):r.from;const days=Math.max(1,Math.ceil((Math.min(r.to,Date.now())-Math.max(r.from,t0))/DAY));const act=new Set(inR.map(t=>sd(t.t))).size;
 return card(exp?'Top places':'Top sources',pl.length?hbars(pl.map(x=>({code:x.cat,name:x.n,v:x.v,c:COLORS[x.cat]||'#8e8e93',val:compact(x.v)+' · '+x.c+'x'})),mx):'<p class="sm">Add notes to your entries to see where the money goes.</p>',{i:10})+
 card('Averages',`<div class="hs3"><div><span>Per day</span><b>${compact(d.tot/days)}</b></div><div><span>Per entry</span><b>${compact(d.n?d.tot/d.n:0)}</b></div><div><span>Active days</span><b>${act}/${days}</b></div></div>`,{i:11})+
 card('Biggest entries',big.length?big.map(t=>txRow(t,bm)).join(''):'<p class="sm">Nothing yet.</p>',{i:12})}
let LASTSAVE=0;
function saveStatus(){const n=S.profiles.reduce((a,p)=>a+p.txns.length,0);const lb=S.set.lastBackup;const old=!lb||Date.now()-lb>14*DAY;return`<div class="svst ${old?'warn':''}"><i class="dot"></i><div class="m"><b>Saved on this device</b><span class="sm" style="display:block">${n.toLocaleString()} entries stored. Every entry is saved the moment you tap Save${LASTSAVE?'. Last save '+new Date(LASTSAVE).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'}):''}.</span><span class="sm" style="display:block;margin-top:4px">${lb?'Last backup file: '+new Date(lb).toLocaleDateString('en-GB',{day:'numeric',month:'short'}):'No backup file yet'}${old?'. Back up now to be extra safe.':'.'}</span></div></div><button class="btn soft" style="margin-top:12px" data-act="backupnow">Back up now</button>`}
function doBackupNow(){shareFile('MoneyTrack-backup.json',dataJSON(),'application/json').then(()=>{S.set.lastBackup=Date.now();S.set.bkN=totN();save();if(TAB==='today'||TAB==='settings')render()})}
function save(){try{const j=JSON.stringify(S);localStorage.setItem(KEY,j);if(localStorage.getItem(KEY)!==j)throw 0;LASTSAVE=Date.now();clearTimeout(AFT);if(AFH)AFT=setTimeout(afWrite,1200);return true}catch(e){toast('Storage is full. Export a backup.');return false}}
addEventListener('pagehide',save);document.addEventListener('visibilitychange',()=>{if(document.hidden)save()});
let _bal=null,_wm=null,_cm=null;
function dirty(){_bal=_wm=_cm=null;save()}
const WM=()=>_wm||(_wm=Object.fromEntries(P().wallets.map(w=>[w.id,w])));
const CM=()=>_cm||(_cm=Object.fromEntries(P().cats.concat(SYS_CATS).map(c=>[c.code,c])));
const cat=c=>CM()[c]||{code:c,name:c,inc:false};
function BAL(){if(_bal)return _bal;const b={};P().wallets.forEach(w=>b[w.id]=+w.open||0);for(const t of P().txns){if(t.k==='i'){if(t.w in b)b[t.w]+=t.a}else if(t.k==='e'){if(t.w in b)b[t.w]-=t.a}else{if(t.w in b)b[t.w]-=t.a;if(t.to in b)b[t.to]+=t.a}}return _bal=b}
const nf=n=>Math.abs(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const HIDE=()=>!!(S&&S.set&&S.set.hide);
const money=(n,c,sign)=>{c=c||cur();return(n<0?'-':sign&&n>0?'+':'')+(SYM[c]||c+' ')+(HIDE()?'••••':nf(n))};
const compact=(n,c,sign)=>{c=c||cur();const a=Math.abs(n);const t=a>=1e6?(a/1e6).toFixed(2).replace(/\.?0+$/,'')+'M':a>=1e4?(a/1e3).toFixed(1).replace(/\.0$/,'')+'K':nf(a);return(n<0?'-':sign&&n>0?'+':'')+(SYM[c]||c+' ')+(HIDE()?'••••':t)};
const sd=d=>{d=new Date(d);d.setHours(0,0,0,0);return d.getTime()};
const LB=()=>rc()?{inc:'Deposit',exp:'Withdraw',earn:'Deposited',spend:'Withdrawn',wal:'Plans',w1:'Plan',tot:'Total saved'}:{inc:'Income',exp:'Expense',earn:'Earned',spend:'Spent',wal:'Wallets',w1:'Wallet',tot:'Total balance'};
const WCOL=w=>PAL[Math.max(0,P().wallets.indexOf(w))%PAL.length];

/* ---------- ui helpers ---------- */
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function toast(m,u){let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast g';document.body.appendChild(t)}t.textContent='';const sp=document.createElement('span');sp.textContent=m;t.appendChild(sp);if(u){const b=document.createElement('button');b.className='tu';b.textContent='Undo';b.onclick=()=>{t.classList.remove('on');u()};t.appendChild(b)}requestAnimationFrame(()=>t.classList.add('on'));clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('on'),u?5500:2600)}
function buzz(){try{navigator.vibrate&&navigator.vibrate(12)}catch(e){}}
function okAnim(){const o=document.createElement('div');o.className='ok';o.innerHTML=`<div class="g">${ico('check',54)}</div>`;document.body.appendChild(o);setTimeout(()=>o.remove(),1000)}
function fmtCU(v,mode,c){if(mode==='num')return nf(v);if(mode==='compact')return compact(v,c);if(mode==='csign')return compact(v,c,true);if(mode==='int')return Math.round(v).toLocaleString('en-US');if(mode==='pct')return Math.round(v)+'%';return money(v,c)}
function countUps(root){root.querySelectorAll('[data-cu]').forEach(el=>{const to=parseFloat(el.dataset.cu)||0,mode=el.dataset.mode,c=el.dataset.cur;const pre=el.dataset.pre||'';if(reduce){el.textContent=pre+fmtCU(to,mode,c);return}const t0=performance.now(),dur=1100;const f=now=>{const p=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-p,4);el.textContent=pre+fmtCU(to*e,mode,c);if(p<1)requestAnimationFrame(f);else fit(el)};f(t0);requestAnimationFrame(f)})}
function fit(el){if(!el)return;el.style.fontSize='';let n=0;while(el.scrollWidth>el.clientWidth+1&&n++<16){el.style.fontSize=(parseFloat(getComputedStyle(el).fontSize)*.93)+'px'}}
function fitAll(root){root.querySelectorAll('.fit').forEach(fit)}
function play(root){root.classList.remove('go');requestAnimationFrame(()=>requestAnimationFrame(()=>{root.classList.add('go');fitAll(root);countUps(root)}))}
function applyVibe(){const v=S.set.vibe;document.documentElement.dataset.vibe=!v?'nova':v==='aurora'?'glass':v}
function applyTheme(){applyVibe();const t=S.set.theme;const dark=t==='dark'||(t==='auto'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=dark?'dark':'light';document.querySelectorAll('meta[name=theme-color]').forEach(m=>m.remove());const m=document.createElement('meta');m.name='theme-color';m.content=dark?'#000000':'#ffffff';document.head.appendChild(m)}
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',applyTheme);

/* ---------- analytics ---------- */
const SYSC=c=>c==='TX'||c==='AD';
const inCur=t=>{const w=WM()[t.w];return !w||(w.cur===cur()&&!w.hidden)};
const isSpend=t=>t.k==='e'&&!SYSC(t.c)&&inCur(t)&&(rc()||t.c!=='SV');
const isEarn=t=>t.k==='i'&&!SYSC(t.c)&&inCur(t)&&(rc()||t.c!=='LR');
const isSave=t=>!rc()&&t.k==='e'&&t.c==='SV'&&inCur(t);
const isLoan=t=>!rc()&&t.k==='i'&&t.c==='LR'&&inCur(t);
const colorOf=k=>rc()?PAL[Math.max(0,P().wallets.findIndex(w=>w.id===k))%PAL.length]:(COLORS[k]||'#8e8e93');
const nameOf=k=>rc()?((WM()[k]||{}).name||'Plan'):cat(k).name;
function range(p){const now=new Date(),td=sd(now);let from,to=td+DAY;
 if(p==='m')from=new Date(now.getFullYear(),now.getMonth(),1).getTime();
 else if(p==='q')from=td-89*DAY;
 else if(p==='y')from=new Date(now.getFullYear(),0,1).getTime();
 else from=P().txns.length?sd(Math.min(...P().txns.map(t=>t.t))):td-29*DAY;
 return{from,to}}
function analyze(from,to){
 const sp=[],ea=[],sv=[],ln=[];
 for(const t of P().txns){if(t.t<from||t.t>=to)continue;if(isSpend(t))sp.push(t);else if(isEarn(t))ea.push(t);else if(isSave(t))sv.push(t);else if(isLoan(t))ln.push(t)}
 const sum=a=>a.reduce((s,t)=>s+t.a,0);
 const spent=sum(sp),earned=sum(ea),saved=sum(sv),borrowed=sum(ln);
 const src=rc()?ea:sp,gk=t=>rc()?t.w:t.c;
 const by={};src.forEach(t=>by[gk(t)]=(by[gk(t)]||0)+t.a);
 const cats=Object.entries(by).map(([k,v])=>({k,v})).sort((a,b)=>b.v-a.v);
 const wd=Array(7).fill(0);sp.forEach(t=>{wd[(new Date(t.t).getDay()+6)%7]+=t.a});
 const days={};sp.forEach(t=>{const k=sd(t.t);days[k]=(days[k]||0)+t.a});
 const last=Math.min(to,sd(Date.now())+DAY);const nDays=Math.max(1,Math.round((last-from)/DAY));
 let nospend=0,streak=0,best=0;for(let d=from;d<last;d+=DAY){if(!days[d]){nospend++;streak++;best=Math.max(best,streak)}else streak=0}
 let bigDay=null;Object.entries(days).forEach(([k,v])=>{if(!bigDay||v>bigDay.v)bigDay={k:+k,v}});
 const small=sp.filter(t=>t.a<100);
 const memos={};src.forEach(t=>{const m=(t.m||'').trim().toLowerCase();if(!m)return;const o=memos[m]||(memos[m]={m:t.m.trim(),v:0,n:0});o.v+=t.a;o.n++});
 const topMemos=Object.values(memos).sort((a,b)=>b.v-a.v).slice(0,5);
 const biggest=src.reduce((b,t)=>!b||t.a>b.a?t:b,null);
 const depMonths=new Set(ea.map(t=>{const d=new Date(t.t);return d.getFullYear()*12+d.getMonth()}));
 return{spent,earned,saved,borrowed,cats,wd,days,nDays,nospend,best,bigDay,smallPct:sp.length?small.length/sp.length*100:0,smallSpendPct:spent?small.reduce((s,t)=>s+t.a,0)/spent*100:0,count:sp.length,nEarn:ea.length,topMemos,biggest,avg:spent/nDays,from,last,depMonths}}
function monthSeries(n){const now=new Date();const out=[];for(let i=n-1;i>=0;i--){const a=new Date(now.getFullYear(),now.getMonth()-i,1),b=new Date(now.getFullYear(),now.getMonth()-i+1,1);const r=analyze(a.getTime(),b.getTime());const by={};r.cats.forEach(c=>by[c.k]=c.v);out.push({l:MONTHS[a.getMonth()].slice(0,3),inc:r.earned,exp:r.spent,sv:r.saved,by,dep:r.nEarn>0})}return out}
function balSeries(ids,n,unit){
 const b=BAL();const set=new Set(ids);let curB=ids.reduce((s,i)=>s+(b[i]||0),0);
 const now=new Date(),td=sd(now);const idx=t=>unit==='d'?n-1-Math.floor((td-sd(t))/DAY):n-1-((now.getFullYear()-new Date(t).getFullYear())*12+now.getMonth()-new Date(t).getMonth());
 const delta=Array(n).fill(0);
 for(const t of P().txns){let net=0;if(t.k==='i'&&set.has(t.w))net=t.a;else if(t.k==='e'&&set.has(t.w))net=-t.a;else if(t.k==='t'){if(set.has(t.w))net-=t.a;if(set.has(t.to))net+=t.a}if(!net)continue;const i=idx(t.t);if(i>=0&&i<n)delta[i]+=net}
 const out=Array(n).fill(0);let run=curB;for(let i=n-1;i>=0;i--){out[i]=run;run-=delta[i]}return out}
function cumulative(){const now=new Date(),y=now.getFullYear(),m=now.getMonth();const dim=new Date(y,m+1,0).getDate();const cu=Array(dim).fill(0),pv=Array(dim).fill(0);const a=new Date(y,m,1).getTime(),b=new Date(y,m+1,1).getTime(),pa=new Date(y,m-1,1).getTime();for(const t of P().txns){if(!isSpend(t))continue;if(t.t>=a&&t.t<b)cu[new Date(t.t).getDate()-1]+=t.a;else if(t.t>=pa&&t.t<a){const d=new Date(t.t).getDate()-1;if(d<dim)pv[d]+=t.a}}for(let i=1;i<dim;i++){cu[i]+=cu[i-1];pv[i]+=pv[i-1]}return{cur:cu.slice(0,now.getDate()),prv:pv,dim}}

/* ---------- chart builders ---------- */
const WAVEP='M0 16 Q150 0 300 16 T600 16 T900 16 T1200 16 V40 H0Z';
const waves=lv=>`<div class="waves" style="--lv:${lv}"><div class="body"></div><svg class="wv" viewBox="0 0 1200 32" preserveAspectRatio="none" style="--d:9s"><path d="${WAVEP}"/></svg><svg class="wv b" viewBox="0 0 1200 32" preserveAspectRatio="none" style="--d:14s;top:4px"><path d="${WAVEP}"/></svg></div>`;
function spark(v,o={}){const w=o.w||300,h=o.h||70,c=o.c||'var(--a1)';v=v&&v.length?v:[0];const mx=Math.max(...v),mn=Math.min(...v),r=mx-mn||1;const X=i=>v.length>1?i/(v.length-1)*w:w/2;const Y=x=>h-8-((x-mn)/r)*(h-18);
 const d=v.map((x,i)=>(i?'L':'M')+X(i).toFixed(1)+' '+Y(x).toFixed(1)).join(' ');const id='g'+uid();const l=v.length-1;
 return`<svg class="sp" viewBox="0 0 ${w} ${h}" ${o.s||''}><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity=".32"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></linearGradient></defs>${o.pv?`<path class="pv" d="${o.pv}"/>`:''}${o.fill===false?'':`<path class="ar" d="${d} L${X(l)} ${h} L0 ${h}Z" fill="url(#${id})"/>`}<path class="ln" pathLength="1" d="${d}" stroke="${c}"/>${o.dot===false?'':`<circle class="dot pulse" cx="${X(l)}" cy="${Y(v[l])}" r="4" fill="${c}"/><circle class="dot" cx="${X(l)}" cy="${Y(v[l])}" r="4.5" fill="${c}" stroke="var(--bg)" stroke-width="2"/>`}</svg>`}
function multi(series,h=110){const w=300;const all=series.flatMap(s=>s.v);const mx=Math.max(...all,1),mn=0;const n=Math.max(...series.map(s=>s.v.length));
 return`<svg class="sp" viewBox="0 0 ${w} ${h}">${series.map(s=>{const d=s.v.map((x,i)=>(i?'L':'M')+(i/(n-1||1)*w).toFixed(1)+' '+(h-8-((x-mn)/(mx-mn||1))*(h-18)).toFixed(1)).join(' ');return`<path class="ln" pathLength="1" d="${d}" stroke="${s.c}"/>`}).join('')}</svg>`}
function rings(items){const R=[44,33,22];return`<svg viewBox="0 0 100 100" class="rg">${items.map((it,i)=>`<circle class="rt" cx="50" cy="50" r="${R[i]}"/><circle class="rf" cx="50" cy="50" r="${R[i]}" pathLength="100" style="--d:${(Math.max(.015,Math.min(1,it.f))*100).toFixed(1)};--i:${i};stroke:${it.c}"/>`).join('')}</svg>`}
function donutHtml(segs,total,midHtml){let start=0;const d=segs.map((s,i)=>{const pct=s.v/(total||1)*100;const o=`<circle class="sgm" style="--d:${pct.toFixed(2)};--i:${i};stroke:${s.c};stroke-dashoffset:${(-start).toFixed(2)}" cx="21" cy="21" r="15.9155" pathLength="100"/>`;start+=pct;return o}).join('');
 return`<div class="donut"><svg viewBox="0 0 42 42"><circle cx="21" cy="21" r="15.9155" stroke="var(--chip)"/>${d}</svg><div class="mid">${midHtml}</div></div>`}
function hbars(items,mx){return items.map((it,i)=>`<div class="hb" style="--c:${it.c}"><div class="tile">${esc(it.code)}</div><div class="mm"><div><span>${esc(it.name)}</span><span>${it.val}</span></div><div class="tr"><i style="--w:${Math.max(2,it.v/(mx||1)*100).toFixed(1)}%;--i:${i}"></i></div></div></div>`).join('')}
const trk=(f,c)=>`<div class="tr" style="margin-top:10px"><i style="--w:${Math.max(2,Math.min(1,f)*100).toFixed(1)}%;--c:${c||'var(--acc)'}"></i></div>`;
const pr=(f,c,t)=>`<div class="pr" style="margin-top:6px"><svg viewBox="0 0 42 42"><circle class="rt" cx="21" cy="21" r="15.9155"/><circle class="rf" cx="21" cy="21" r="15.9155" pathLength="100" style="--d:${(Math.max(.01,Math.min(1,f))*100).toFixed(1)};stroke:${c}"/></svg><b>${t}</b></div>`;
const card=(t,b,o={})=>`<section class="g card rise ${o.cls||''}" style="--i:${o.i||0}">${t?`<div class="lbl"><span class="t">${t}</span>${o.a?`<b data-act="${o.a}" data-v="${o.av||''}">${o.al}</b>`:(o.r||'')}</div>`:''}${b}</section>`;
function barsHtml(items,o={}){const mx=Math.max(1,...items.map(x=>Math.max(...x.vals)));return`<div class="bars" style="height:${o.h||150}px">${items.map((it,i)=>`<div class="c ${it.hi?'hi':''}"><div class="p">${it.vals.map((v,j)=>`<i style="--h:${Math.max(1.5,v/mx*100)}%;--i:${i};background:${it.cols[j]};${o.w?`max-width:${o.w}px`:''}"></i>`).join('')}</div><em>${it.l}</em></div>`).join('')}</div>`}

/* ---------- shell and views ---------- */
let TAB='today',PER='m',H={q:'',f:'all',w:'all',n:120,m:'cur'};
const view=()=>$('#view');
const TABIDX={today:0,wallets:1,insights:3,history:4};
function shell(){
 const w=LB().wal;const tabs=[['today','Today','home'],['wallets',w,'wallet'],['insights','Insights','chart'],['history','History','list']];
 $('#app').innerHTML=`<aside class="side g"><h2>MoneyTrack</h2>${tabs.map(t=>`<button class="t" data-act="tab" data-v="${t[0]}" data-tn="${t[0]}">${ico(t[2])}<span class="tl">${t[1]}</span></button>`).join('')}<button class="t" data-act="tab" data-v="settings" data-tn="settings">${ico('gear')}Settings</button><button class="btn acc" data-act="add">${ico('plus',20)} New entry</button></aside>
 <main><header class="top"><button class="pp g" data-act="profiles"><i class="av" id="pav"></i><span id="pnm"></span>${ico('chev',16)}</button><div class="acts"><button class="ib g" id="eyb" data-act="hide" aria-label="Hide amounts">${ico('eye',18)}</button><button class="ib g" data-act="story" aria-label="Story">${ico('play',18)}</button><button class="ib g" data-act="tab" data-v="settings" aria-label="Settings">${ico('gear',20)}</button></div></header><div id="view"></div></main>
 <nav class="tabbar g"><span class="lens" id="lens"></span><button class="t" data-act="tab" data-v="today" data-tn="today">${ico('home')}Today</button><button class="t" data-act="tab" data-v="wallets" data-tn="wallets">${ico('wallet')}<span class="tl">${w}</span></button><button class="fab" data-act="add" aria-label="New entry">${ico('plus',28)}</button><button class="t" data-act="tab" data-v="insights" data-tn="insights">${ico('chart')}Insights</button><button class="t" data-act="tab" data-v="history" data-tn="history">${ico('list')}History</button></nav>`}
function chrome(){const p=P();document.documentElement.dataset.kind=p.kind;$('#pav').textContent=p.name.trim().slice(0,1).toUpperCase();$('#pnm').textContent=p.name;
 document.querySelectorAll('[data-tn]').forEach(b=>b.classList.toggle('on',b.dataset.tn===TAB));const eb=$('#eyb');if(eb)eb.classList.toggle('on',HIDE());
 document.querySelectorAll('.tl').forEach(s=>{if(s.parentNode.dataset.tn==='wallets')s.textContent=LB().wal});
 const l=$('#lens');if(TABIDX[TAB]!=null){l.style.opacity=1;l.style.setProperty('--i',TABIDX[TAB])}else l.style.opacity=0}
function setTab(t){TAB=t;render();const a=$('#app');if(a)a.scrollTop=0}
function render(){const v=view();if(!v)return;chrome();const f={today:vToday,wallets:vWallets,insights:vInsights,history:vHistory,settings:vSettings,cats:vCats,goals:vGoals,debts:vDebts,subs:vSubs}[TAB];v.innerHTML=f();play(v)}
const ttl=(sub,t)=>`<div class="ttl rise"><small>${sub}</small><h1>${t}</h1></div>`;

function txRow(t,mx){const w=WM()[t.w],c=cat(t.k==='t'?'TX':t.c);let title,sub,amt,cls='',code=t.c;
 const tm=new Date(t.t).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});
 if(t.k==='t'){title=t.m||'Transfer';sub=`${esc(w?w.name:'?')} to ${esc((WM()[t.to]||{}).name||'?')} · ${tm}`;amt=money(t.a,w&&w.cur);code='TX'}
 else{title=t.m||c.name;sub=`${esc(c.name)} · ${esc(w?w.name:'')} · ${tm}`;amt=money(t.k==='e'?-t.a:t.a,w&&w.cur,true);cls=t.k==='e'?'':'inc'}
 const col=t.k==='t'?'#8e8e93':(COLORS[code]||'#8e8e93');const f=mx?Math.sqrt(t.a/mx)*100:0;
 return`<button class="row" data-act="edit" data-id="${t.id}" style="--c:${col};--w:${f.toFixed(0)}"><div class="tile">${esc(String(code).slice(0,2))}</div><div class="m"><b>${esc(title)}</b><span>${sub}</span></div><div class="r ${cls}">${amt}</div><i class="mb"></i></button>`}

function empty(){return`${ttl('Welcome','Let’s set up '+esc(P().name))}${card('',`<div class="empty"><h2>${rc()?'Track your savings plans':'Track your daily money'}</h2><p>${rc()?'Add a plan for each policy or savings account, then record every deposit.':'Create a wallet, then log what comes in and goes out.'}<br>Everything stays on this device.</p><button class="btn acc" data-act="newwallet">${ico('wallet',20)} Create ${rc()?'a plan':'a wallet'}</button><button class="btn soft" data-act="import">Import CSV</button><button class="btn soft" data-act="restore">Restore a backup</button></div>`,{i:1})}`}

const totN=()=>S.profiles.reduce((a,p)=>a+p.txns.length,0);
function logNudge(){if(rc()||P().txns.length<6||new Date().getHours()<17||P().txns.some(t=>sd(t.t)===sd(Date.now())))return'';return`<button class="g card rise" style="--i:1;display:flex;align-items:center;gap:14px;width:100%;padding:16px" data-act="add"><div class="wic" style="--c:var(--a3)">${ico('plus',20)}</div><div style="flex:1;min-width:0;text-align:left"><b style="display:block;font-size:14.5px">Nothing logged today</b><span class="sm">Tap to add what you spent.</span></div></button>`}
function nudge(){return updNudge()+logNudge()+nudgeB()}
function nudgeB(){const lb=S.set.lastBackup;const n=P().txns.length;if(n<20||AFS==='on'||(lb&&Date.now()-lb<14*DAY&&totN()-(S.set.bkN||0)<15))return'';return`<button class="g card rise" style="--i:1;display:flex;align-items:center;gap:14px;width:100%;padding:16px" data-act="backup"><div class="wic" style="--c:var(--a2)">${ico('savings',18)}</div><div style="flex:1;min-width:0"><b style="display:block;font-size:14.5px">Back up your data</b><span class="sm">${lb?'Last backup was a while ago.':'You have not backed up yet.'} Tap to save a file.</span></div></button>`}
const hst=rows=>`<div class="hstats">${rows.map(([l,v])=>`<div><span>${l}</span><b>${v}</b></div>`).join('')}</div>`;
function noteCard(){if(rc()){const co=consistency(),ms=range('m'),a=analyze(ms.from,ms.to);const txt=a.earned>0?`You have deposited <b>${money(a.earned)}</b> this month${co.streak?`, a <b>${co.streak}-month</b> streak. Keep it going.`:'.'}`:`No deposit yet this month. ${co.streak?`Your <b>${co.streak}-month</b> streak is waiting.`:'Record one to start a streak.'}`;return`<div class="g note rise" style="--i:3;--c:${a.earned>0?'var(--inc)':'var(--a3)'}"><i>${ico(a.earned>0?'check':'plus',20)}</i><p>${txt}</p></div>`}
 const now=new Date(),dd=now.getDate(),ms=range('m'),a=analyze(ms.from,ms.to);const pa=analyze(new Date(now.getFullYear(),now.getMonth()-1,1).getTime(),new Date(now.getFullYear(),now.getMonth()-1,dd+1).getTime());let txt,ic,col;
 if(pa.spent>0&&a.spent>0){const df=(a.spent-pa.spent)/pa.spent*100;txt=`You have spent <b>${Math.abs(df).toFixed(0)}% ${df>0?'more':'less'}</b> than at this point last month.`;col=df>0?'var(--exp)':'var(--inc)';ic=df>0?'up':'down'}else if(a.cats[0]){txt=`<b>${esc(cat(a.cats[0].k).name)}</b> leads your spending this month at ${money(a.cats[0].v)}.`;col='var(--a1)';ic='chart'}else return'';
 return`<div class="g note rise" style="--i:3;--c:${col}"><i>${ico(ic,20)}</i><p>${txt}</p></div>`}
function heroCard(label,total,ser,lv,pills,stats){const c=cur();return`<section class="g card hero rise" style="--i:1">${waves(lv)}<div class="lbl"><span class="t">${label}</span></div><div class="big fit"><small>${esc(SYM[c]||c)}</small><span data-cu="${total}" data-mode="num">${nf(total)}</span></div><div class="row2">${pills}</div>${stats||''}${spark(ser,{h:80})}</section>`}
function stripHtml(ser12){const b=BAL();const all=VW().slice().sort((x,y)=>b[y.id]-b[x.id]);const a=range('m');return`<div class="pcs rise" style="--i:2">${all.map((w,i)=>payCard(w,{i,stat:wflow(w,a.from),cu:true})).join('')}</div>`}
function vToday(){
 const now=new Date(),h=now.getHours();const g=h<12?'Good morning':h<18?'Good afternoon':'Good evening';
 const date=now.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});
 if(!P().wallets.length)return empty();
 return rc()?todayRec(g,date):todayDaily(g,date)}
function todayDaily(g,date){
 const b=BAL(),c=cur();const ids=VW().filter(w=>w.cur===c).map(w=>w.id);const total=ids.reduce((s,i)=>s+b[i],0);
 const s90=balSeries(ids,90,'d'),ser=s90.slice(-30);const mx=Math.max(...s90,total,1),mn=Math.min(...s90,total);const lv=Math.max(14,Math.min(88,(total-mn)/((mx-mn)||1)*70+16));
 const ms=range('m'),a=analyze(ms.from,ms.to);const delta=ser[ser.length-1]-ser[0];
 const pills=`<span class="pill ${delta>=0?'inc':'exp'}">${delta>=0?'▲':'▼'} ${compact(Math.abs(delta))} in 30 days</span><span class="pill">${VW().length} ${VW().length===1?'wallet':'wallets'}</span>`;
 const mxr=Math.max(a.earned,a.spent,a.saved,1);
 const wk=analyze(sd(Date.now())-6*DAY,sd(Date.now())+DAY);const td=sd(Date.now());
 const wb=[];for(let i=6;i>=0;i--){const d0=td-i*DAY;const dd=new Date(d0);wb.push({l:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dd.getDay()].slice(0,1),vals:[wk.days[d0]||0],cols:[i===0?'var(--a1)':'color-mix(in srgb,var(--a1) 35%,transparent)'],hi:i===0})}
 const wmax=Math.max(1,...wb.map(x=>x.vals[0]));
 const cu=cumulative();const top=a.cats.slice(0,5);const tm=top.length?top[0].v:1;
 const recs=P().txns.slice().sort((x,y)=>y.t-x.t).slice(0,6);const rmx=Math.max(1,...recs.map(t=>t.a));
 const left=heroCard(LB().tot,total,ser,lv,pills,hst([['Spent today',compact(wk.days[td]||0)],['Last 7 days',compact(wk.spent)],['This month',compact(a.spent)]]))+DOCK()+quickCard()+noteCard()+budgetCard(a)+stripHtml(false)+
 card('This month',`<div class="flex">${rings([{f:a.earned/mxr,c:'var(--inc)'},{f:a.spent/mxr,c:'var(--exp)'},{f:a.saved/mxr,c:'var(--sav)'}])}<div class="rgl"><div style="--c:var(--inc)"><i></i><p><span>Earned</span><b class="inc" data-cu="${a.earned}" data-mode="compact" data-cur="${c}">${compact(a.earned)}</b></p></div><div style="--c:var(--exp)"><i></i><p><span>Spent</span><b class="exp" data-cu="${a.spent}" data-mode="compact" data-cur="${c}">${compact(a.spent)}</b></p></div><div style="--c:var(--sav)"><i></i><p><span>Saved</span><b class="sav" data-cu="${a.saved}" data-mode="compact" data-cur="${c}">${compact(a.saved)}</b></p></div></div></div>`,{i:3,a:'tab',av:'insights',al:'Insights'});
 const right=comingCard()+goalsCard()+debtsCard()+card('Recent',recs.length?recs.map(t=>txRow(t,rmx)).join(''):'<p class="sm">No entries yet. Tap + to add one.</p>',{i:8,a:'tab',av:'history',al:'See all'})+card('Last 7 days',barsHtml(wb,{h:120,w:26}).replace(/<em>/g,'<em>')+`<p class="sm" style="margin-top:10px">Today: <b style="color:var(--fg)">${money(wk.days[td]||0)}</b> · average ${money(wk.spent/7)} a day</p>`,{i:4}).replace('style="height:120px"','style="height:120px"')+
 card('Spending pace',paceSvg(cu)+`<div class="sm" style="display:flex;justify-content:space-between;margin-top:8px"><span>Solid: this month</span><span>Dashed: last month</span></div>`,{i:5})+
 card('Top categories',top.length?hbars(top.map(x=>({code:x.k,name:cat(x.k).name,v:x.v,c:COLORS[x.k]||'#8e8e93',val:compact(x.v)})),tm):'<p class="sm">No spending yet this month.</p>',{i:6,a:'tab',av:'insights',al:'More'})+
 `<button class="story-card rise" style="--i:7" data-act="story"><div class="pl">${ico('play',20)}</div><div><b>Your ${MONTHS[new Date().getMonth()]} story</b><span>Six quick slides about your money</span></div></button>`;
 return ttl(date,g)+nudge()+`<div class="cols"><div>${left}</div><div>${right}</div></div>`}

function paceSvg(cu){const W=320,Hh=96,max=Math.max(1,...cu.cur,...cu.prv);const X=i=>i/(cu.dim-1)*W,Y=v=>Hh-6-(v/max)*(Hh-14);
 const p=arr=>arr.map((v,i)=>(i?'L':'M')+X(i).toFixed(1)+' '+Y(v).toFixed(1)).join(' ');
 const curP=cu.cur.length>1?p(cu.cur):`M0 ${Y(0)} L2 ${Y(cu.cur[0]||0)}`;const last=Math.max(0,cu.cur.length-1);const id='p'+uid();
 return`<svg class="sp" viewBox="0 0 ${W} ${Hh}"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--a1)" stop-opacity=".3"/><stop offset="1" stop-color="var(--a1)" stop-opacity="0"/></linearGradient></defs><path class="pv" d="${p(cu.prv)}"/><path class="ar" d="${curP} L${X(last)} ${Hh} L0 ${Hh}Z" fill="url(#${id})"/><path class="ln" pathLength="1" d="${curP}" stroke="var(--a1)"/><circle class="dot pulse" cx="${X(last)}" cy="${Y(cu.cur[last]||0)}" r="4" fill="var(--a1)"/><circle class="dot" cx="${X(last)}" cy="${Y(cu.cur[last]||0)}" r="4.5" fill="var(--a1)" stroke="var(--bg)" stroke-width="2"/></svg>`}

function consistency(){const m=monthSeries(12);let streak=0;for(let i=m[11].dep?11:10;i>=0&&m[i].dep;i--)streak++;const n=m.filter(x=>x.dep).length;
 return{m,streak,n,html:`<div class="dotsr">${m.map((x,i)=>`<i class="${x.dep?'n':''}" style="--i:${i}" title="${x.l}"></i>`).join('')}</div><p class="sm" style="margin-top:12px"><b style="color:var(--fg)" data-cu="${streak}" data-mode="int">${streak}</b> ${streak===1?'month':'months'} in a row · ${n} of the last 12 months had deposits</p>`}}
function stackedMonths(n){const m=monthSeries(n);const ws=P().wallets;const mx=Math.max(1,...m.map(x=>x.inc));
 const top=ws.map(w=>({w,t:m.reduce((s,x)=>s+(x.by[w.id]||0),0)})).sort((a,b)=>b.t-a.t).slice(0,5).map(x=>x.w);
 return`<div class="bars" style="height:150px">${m.map((x,i)=>{const segs=top.map(w=>({v:x.by[w.id]||0,c:colorOf(w.id)}));const other=x.inc-segs.reduce((s,q)=>s+q.v,0);if(other>0.5)segs.push({v:other,c:'#94a3b8'});return`<div class="c ${i===n-1?'hi':''}"><div class="p st" style="height:100%;justify-content:flex-start">${segs.filter(s=>s.v>0).map(s=>`<i style="--h:${(s.v/mx*100).toFixed(1)}%;--i:${i};background:${s.c}"></i>`).join('')}</div><em>${x.l}</em></div>`}).join('')}</div><div class="chips" style="margin-top:12px;flex-wrap:wrap">${top.map(w=>`<span class="pill"><i style="width:8px;height:8px;border-radius:50%;background:${colorOf(w.id)}"></i>${esc(w.name)}</span>`).join('')}</div>`}
function todayRec(g,date){
 const b=BAL(),c=cur();const ids=VW().filter(w=>w.cur===c).map(w=>w.id);const total=ids.reduce((s,i)=>s+b[i],0);
 const ser=balSeries(ids,18,'m');const goal=VW().reduce((s,w)=>s+(w.goal||0),0);const lv=goal>0?Math.min(90,Math.max(14,total/goal*80+10)):Math.max(24,Math.min(88,total/(Math.max(...ser,1))*72+14));
 const ms=range('m'),a=analyze(ms.from,ms.to);const co=consistency();
 const pills=`<span class="pill inc">+${compact(a.earned)} this month</span><span class="pill">${VW().length} ${VW().length===1?'plan':'plans'}</span>`;
 const recs=P().txns.slice().sort((x,y)=>y.t-x.t).slice(0,6);const rmx=Math.max(1,...recs.map(t=>t.a));
 const left=heroCard(LB().tot,total,ser,lv,pills,hst([['This month',compact(a.earned)],['Streak',co.streak+(co.streak===1?' mo':' mos')],['Plans',VW().length]]))+DOCK()+quickCard()+noteCard()+stripHtml(true)+goalsCard()+debtsCard()+card('Consistency',co.html,{i:3})+comingCard();
 const right=card('Recent deposits',recs.length?recs.map(t=>txRow(t,rmx)).join(''):'<p class="sm">No entries yet. Tap + to record one.</p>',{i:4,a:'tab',av:'history',al:'See all'})+card('Monthly deposits',stackedMonths(12),{i:5})+`<button class="story-card rise" style="--i:6" data-act="story"><div class="pl">${ico('play',20)}</div><div><b>Your savings story</b><span>Five quick slides about your plans</span></div></button>`;
 return ttl(date,g)+nudge()+`<div class="cols"><div>${left}</div><div>${right}</div></div>`}

function vWallets(){
 const L=LB();
 if(!P().wallets.length)return ttl(L.wal,'Your '+L.wal.toLowerCase())+card('',`<div class="empty"><h2>No ${L.wal.toLowerCase()} yet</h2><p>Add your first ${L.w1.toLowerCase()}.</p><button class="btn acc" data-act="newwallet">Create ${L.w1.toLowerCase()}</button></div>`,{i:1});
 const b=BAL(),ws=VW();const c=cur();const same=ws.filter(w=>w.cur===c);const tot=same.reduce((x,w)=>x+b[w.id],0);const pos=same.reduce((x,w)=>x+Math.max(0,b[w.id]),0)||1;const a=range('m');
 const ser=balSeries(same.map(w=>w.id),30,'d');const dl=ser[ser.length-1]-ser[0];
 const top=`<section class="g card nw rise" style="--i:1"><div class="lbl"><span class="t">${L.tot}</span></div><div class="big fit" data-cu="${tot}" data-cur="${c}">${money(tot,c)}</div><div class="row2"><span class="pill ${dl>=0?'inc':'exp'}">${dl>=0?'▲':'▼'} ${compact(Math.abs(dl))} in 30 days</span><span class="pill">${ws.length} ${(ws.length===1?L.w1:L.wal).toLowerCase()}</span></div><div class="alloc">${same.map(w=>`<i style="flex:${Math.max(.02,Math.max(0,b[w.id])/pos)};background:${WCOL(w)}"></i>`).join('')}</div><div class="legend">${same.map(w=>`<span><i style="background:${WCOL(w)}"></i>${esc(w.name)} ${Math.round(Math.max(0,b[w.id])/pos*100)}%</span>`).join('')}</div></section>`;
 const cards=ws.slice().sort((x,y)=>b[y.id]-b[x.id]).map((w,i)=>{let inn=0,out=0;for(const t of P().txns){if(t.t<a.from)continue;if(t.k==='i'&&t.w===w.id&&t.c!=='AD')inn+=t.a;else if(t.k==='e'&&t.w===w.id&&t.c!=='AD')out+=t.a;else if(t.k==='t'){if(t.w===w.id)out+=t.a;if(t.to===w.id)inn+=t.a}}
  const col=WCOL(w);const s2=rc()?balSeries([w.id],12,'m'):balSeries([w.id],45,'d');const g=w.goal>0?Math.max(0,Math.min(1,b[w.id]/w.goal)):null;
  return`<div class="pcw rise" style="--i:${i+2}">${payCard(w,{i,stat:{inn,out},spark:s2,cu:true,fit:true,cls:'big'})}${g!=null?`<div class="pcg"><span>${Math.round(g*100)}% of ${money(w.goal,w.cur)}</span>${trk(g,col)}</div>`:''}</div>`}).join('');
 return ttl(L.wal,'Your '+L.wal.toLowerCase())+top+`<div class="wlist">${cards}</div><button class="btn soft rise" style="--i:9" data-act="newwallet">${ico('plus',18)} Add ${L.w1.toLowerCase()}</button>${hiddenCard()}`}
function hiddenCard(){const hs=P().wallets.filter(w=>w.hidden);if(!hs.length)return'';return`<section class="g card rise" style="--i:10;margin-top:14px"><div class="lbl"><span class="t">Hidden (${hs.length})</span></div>${hs.map(w=>`<div class="row"><div class="wic">${ico(w.type,18)}</div><div class="m"><b>${esc(w.name)}</b><span>Not in totals or insights</span></div><button class="pill" data-act="unhide" data-id="${w.id}">Show</button></div>`).join('')}</section>`}

function heatHtml(){const td=sd(Date.now());const an=analyze(td-34*DAY,td+DAY);const mx=Math.max(1,...Object.values(an.days));const first=new Date(td-34*DAY);const off=(first.getDay()+6)%7;
 let h=`<div class="hd7">${DOW.map(d=>`<span>${d.slice(0,1)}</span>`).join('')}</div><div class="heat">`;for(let i=0;i<off;i++)h+='<i style="visibility:hidden"></i>';
 for(let i=0;i<35;i++){const d0=td-(34-i)*DAY;const v=an.days[d0]||0;h+=`<i class="${v?'o':'z'} ${d0===td?'td':''}" style="--i:${i};--o:${(v?.15+.85*Math.sqrt(v/mx):0).toFixed(2)};--c:var(--exp)" title="${money(v)}"></i>`}
 return h+'</div><p class="sm" style="margin-top:10px">Green days: nothing spent. Red days: darker means heavier.</p>'}


function vInsights(){return rc()?vInsightsRec():vFlow()}
let FLOW='e';
const inFlow=t=>FLOW==='e'?(isSpend(t)||(S.set.incl&&isSave(t))):(isEarn(t)||(S.set.incl&&isLoan(t)));
function flowData(from,to){const m={};let tot=0,n=0;for(const t of P().txns){if(t.t<from||t.t>=to||!inFlow(t))continue;m[t.c]=(m[t.c]||0)+t.a;tot+=t.a;n++}return{tot,n,cats:Object.entries(m).map(([k,v])=>({k,v})).sort((a,b)=>b.v-a.v)}}
function flowMonths(n){const now=new Date(),o=[];for(let i=n-1;i>=0;i--){const a=new Date(now.getFullYear(),now.getMonth()-i,1),b=new Date(now.getFullYear(),now.getMonth()-i+1,1);const by={};let tot=0;for(const t of P().txns){if(t.t>=a.getTime()&&t.t<b.getTime()&&inFlow(t)){by[t.c]=(by[t.c]||0)+t.a;tot+=t.a}}o.push({l:MONTHS[a.getMonth()].slice(0,3),tot,by})}return o}
function prevRange(p,r){const len=r.to-r.from;if(p==='a')return null;if(p==='m'){const d=new Date(r.from);return{from:new Date(d.getFullYear(),d.getMonth()-1,1).getTime(),to:r.from}}if(p==='y'){const d=new Date(r.from);return{from:new Date(d.getFullYear()-1,0,1).getTime(),to:r.from}}return{from:r.from-len,to:r.from}}
function vFlow(){
 const r=range(PER),d=flowData(r.from,r.to),c=cur(),exp=FLOW==='e';const prg=prevRange(PER,r);const pd=prg?flowData(prg.from,prg.to):null;
 const col=exp?'var(--exp)':'var(--inc)';const fm=flowMonths(12),f6=fm.slice(-6);
 const delta=pd&&pd.tot?((d.tot-pd.tot)/pd.tot*100):null;const good=delta==null?null:(exp?delta<=0:delta>=0);
 const pl={w:'the week before',m:'last month',q:'the 90 days before',y:'last year'}[PER];
 const lastD=Math.min(r.to,sd(Date.now())+DAY);const days=Math.max(1,Math.round((lastD-r.from)/DAY));
 // highlights
 const hl=[];
 if(delta!=null)hl.push([good?'var(--inc)':'var(--exp)',`${exp?'Spending':'Income'} is ${delta>=0?'up':'down'} ${Math.abs(delta).toFixed(0)}% on ${pl}.`]);
 if(d.cats[0])hl.push(['var(--a1)',`${esc(cat(d.cats[0].k).name)} is your biggest ${exp?'expense':'income'}: ${Math.round(d.cats[0].v/d.tot*100)}% of the total.`]);
 if(d.n)hl.push(['var(--a2)',`About ${money(d.tot/days)} a day over ${days} days, ${d.n} entries.`]);
 if(exp&&PER==='m'){const now=new Date(),dm=new Date(now.getFullYear(),now.getMonth()+1,0).getDate(),dd=now.getDate();hl.push(['var(--a3)',`At this pace the month ends near ${money(d.tot/dd*dm)}.`])}

 const an=analyze(r.from,r.to);const net=an.earned-an.spent;const rate=an.earned>0?net/an.earned:0;
 const cfm=(()=>{const now=new Date(),o=[];for(let i=5;i>=0;i--){const a0=new Date(now.getFullYear(),now.getMonth()-i,1),b0=new Date(now.getFullYear(),now.getMonth()-i+1,1);const x=analyze(a0.getTime(),b0.getTime());o.push({l:MONTHS[a0.getMonth()].slice(0,3),e:x.earned,s:x.spent})}return o})();
 const cash=card('Cash flow',`<div class="bgt"><div><span class="sm">Net for this period</span><b class="${net<0?'exp':'inc'}">${money(net,undefined,true)}</b></div>${pr(Math.abs(rate),net<0?'var(--exp)':'var(--inc)',(Math.abs(rate)>9.99?'999+':Math.round(rate*100))+'%')}</div><p class="sm" style="margin:2px 0 12px">${an.earned>0?(rate>=0?`You kept ${Math.round(rate*100)}% of what came in.`:`You spent ${Math.round(-rate*100)}% more than came in.`):'No income in this period.'}</p>`+barsHtml(cfm.map((m,i)=>({l:m.l,vals:[m.e,m.s],cols:['var(--inc)','var(--exp)'],hi:i===5})),{h:130,w:14})+`<div class="sm lgd"><span><i style="background:var(--inc)"></i>Earned</span><span><i style="background:var(--exp)"></i>Spent</span><span>Last 6 months</span></div>`,{i:5});
 const mv=(()=>{if(!pd)return'';const pm=Object.fromEntries(pd.cats.map(x=>[x.k,x.v])),cm=Object.fromEntries(d.cats.map(x=>[x.k,x.v]));const ks=[...new Set([...Object.keys(pm),...Object.keys(cm)])].map(k=>({k,df:(cm[k]||0)-(pm[k]||0)})).filter(x=>Math.abs(x.df)>0).sort((a,b)=>Math.abs(b.df)-Math.abs(a.df)).slice(0,4);if(!ks.length)return'';return card('What changed',ks.map(x=>{const bad=exp?x.df>0:x.df<0;return`<div class="row"><div class="tile" style="--c:${colorOf(x.k)};width:40px;height:40px;border-radius:14px;font-size:12px">${esc(x.k)}</div><div class="m"><b>${esc(cat(x.k).name)}</b><span>vs ${pl}</span></div><div class="r ${bad?'exp':'inc'}">${x.df>0?'+':'-'}${compact(Math.abs(x.df))}</div></div>`}).join(''),{i:5})})();
 // hour histogram
 const hrs=Array(6).fill(0);for(const t of P().txns){if(t.t>=r.from&&t.t<r.to&&inFlow(t))hrs[Math.floor(new Date(t.t).getHours()/4)]+=t.a}
 const hl6=['12a','4a','8a','12p','4p','8p'],hm=hrs.indexOf(Math.max(...hrs));
 // weekday
 const wd=Array(7).fill(0);for(const t of P().txns){if(t.t>=r.from&&t.t<r.to&&inFlow(t))wd[(new Date(t.t).getDay()+6)%7]+=t.a}const wm=wd.indexOf(Math.max(...wd));
 const segs=d.cats.slice(0,6).map(x=>({v:x.v,c:colorOf(x.k),k:x.k}));const rest=d.cats.slice(6).reduce((s,x)=>s+x.v,0);if(rest>0)segs.push({v:rest,c:'#8e8e93',k:'_',other:true});
 const list=d.cats.length?d.cats.map(x=>{const cc=colorOf(x.k);const sv=f6.map(m=>m.by[x.k]||0);return`<button class="row cl" data-act="catd" data-id="${esc(x.k)}"><div class="tile" style="--c:${cc};width:42px;height:42px;border-radius:15px;font-size:12px">${esc(x.k)}</div><div class="m"><b>${esc(cat(x.k).name)}</b><span>${Math.round(x.v/d.tot*100)}% of ${exp?'spending':'income'}</span>${trk(x.v/d.cats[0].v,cc)}</div><div class="cs">${spark(sv,{h:30,dot:false,fill:false,c:cc})}</div><div class="r"><b>${compact(x.v)}</b></div></button>`}).join(''):'<p class="sm">Nothing in this period.</p>';
 return ttl(exp?'Where your money goes':'Where your money comes from','Insights')+
 `<div class="seg rise" style="margin-bottom:10px;--i:1"><button class="${exp?'on':''}" data-act="flow" data-v="e">Expenses</button><button class="${!exp?'on':''}" data-act="flow" data-v="i">Income</button></div>
 <div class="seg rise" style="margin-bottom:14px;--i:1">${[['w','Week'],['m','Month'],['y','Year'],['a','All time']].map(([k,v])=>`<button class="${PER===k?'on':''}" data-act="per" data-v="${k}">${v}</button>`).join('')}</div>
 <section class="g card hero2 rise" style="--i:2;--fc:${col}"><div class="sm">${exp?'Spent':'Earned'}</div><div class="bigt fit" data-cu="${d.tot}" data-mode="compact" data-cur="${c}">${compact(d.tot,c)}</div><div class="dl">${delta==null?`<span class="pill">${d.n} entries</span>`:`<span class="pill ${good?'inc':'exp'}">${delta>=0?'▲':'▼'} ${Math.abs(delta).toFixed(0)}%</span><span class="sm">vs ${pl}</span>`}</div>${spark(fm.map(m=>m.tot),{h:84,c:col})}<div class="sm" style="display:flex;justify-content:space-between"><span>${fm[0].l}</span><span>Last 12 months</span><span>${fm[11].l}</span></div></section>
 <button class="btn acc rise" style="--i:3" data-act="addflow">${ico('plus',18)} Add ${exp?'an expense':'income'}</button>
 <div class="cols"><div>${card('Highlights',hl.length?hl.map(h=>`<div class="hlr" style="--c:${h[0]}"><i></i><span>${h[1]}</span></div>`).join(''):'<p class="sm">Add a few entries to see highlights.</p>',{i:4})}
 ${cash}${mv}${card(exp?'Expense categories':'Income categories',list,{i:5,r:'<span class="sm">Tap one to see its entries</span>'})}
 ${card('Share',d.cats.length?donutHtml(segs,d.tot||1,`<span class="sm">${exp?'Spent':'Earned'}</span><b class="fit" style="max-width:96px;overflow:hidden">${compact(d.tot)}</b>`)+`<div class="leg" style="margin-top:12px">${segs.map(s=>`<div class="row" style="--c:${s.c}"><i></i><span class="n">${s.other?'Other':esc(nameOf(s.k))}</span><span class="v">${Math.round(s.v/d.tot*100)}%</span></div>`).join('')}</div>`:'<p class="sm">Nothing yet.</p>',{i:6})}</div>
 <div>${card('Last 12 months',barsHtml(fm.map((m,i)=>({l:m.l,vals:[m.tot],cols:[col],hi:i===11}))),{i:6})}
 ${card('By weekday',barsHtml(wd.map((v,i)=>({l:DOW[i],vals:[v],cols:[i===wm&&d.tot?col:'color-mix(in srgb,'+col+' 30%,transparent)'],hi:i===wm&&d.tot})),{h:120,w:26}),{i:7,r:d.tot?`<span class="sm">Peak: ${DOW[wm]}</span>`:''})}
 ${card('Time of day',barsHtml(hrs.map((v,i)=>({l:hl6[i],vals:[v],cols:[i===hm&&d.tot?'var(--a2)':'color-mix(in srgb,var(--a2) 30%,transparent)'],hi:i===hm&&d.tot})),{h:110,w:34}),{i:8})}
 ${exp?card('Last 5 weeks',heatHtml(),{i:9}):''}${placeCards(r,exp,d)}
 ${card('Counting',`<label class="row" style="cursor:pointer"><div class="m"><b>Include savings and loans</b><span>${exp?'Count money put into Savings as spending':'Count loans received as income'}</span></div><button class="seg" style="padding:0;min-width:64px" data-act="incl"><span class="${S.set.incl?'on':''}" style="padding:8px 14px;border-radius:12px;font-weight:700;background:${S.set.incl?'var(--a1)':'var(--chip)'};color:${S.set.incl?'#fff':'var(--fg)'}">${S.set.incl?'On':'Off'}</span></button></label>`,{i:10})}</div></div>`}
function openCat(code){
 const r=range(PER);const L=P().txns.filter(t=>t.t>=r.from&&t.t<r.to&&inFlow(t)&&t.c===code).sort((a,b)=>b.t-a.t);const tot=L.reduce((s,t)=>s+t.a,0);const mx=Math.max(1,...L.map(t=>t.a));
 sheet(`<h2>${esc(cat(code).name)}</h2><p class="sm" style="margin:-8px 0 14px">${L.length} ${L.length===1?'entry':'entries'} · ${money(tot)}</p><button class="btn acc" id="ca">${ico('plus',18)} Add to ${esc(cat(code).name)}</button><div class="g card" style="padding:6px 16px;margin-top:14px;border-radius:26px;box-shadow:none">${L.slice(0,200).map(t=>txRow(t,mx)).join('')||'<p class="sm" style="padding:14px 0">Nothing here.</p>'}</div>${PAD}`,sh=>{$('#ca',sh).onclick=()=>{closeSheet(true);openAdd(null,{k:FLOW,c:code})}})}
function vInsightsRec(){
 const r=range(PER),a=analyze(r.from,r.to),c=cur(),b=BAL();const mo=monthSeries(12);const co=consistency();
 const labels={m:'This month',y:'This year',a:'All time'};if(!labels[PER])PER='y';
 const prg=prevRange(PER,r);const pa=prg?analyze(prg.from,prg.to):null;const delta=pa&&pa.earned?((a.earned-pa.earned)/pa.earned*100):null;
 const ids=VW().filter(w=>w.cur===c).map(w=>w.id);const total=ids.reduce((x,i)=>x+b[i],0);const gser=balSeries(ids,12,'m');
 const pl={m:'last month',y:'last year'}[PER];
 const hero=`<section class="g card hero2 rise" style="--i:2;--fc:var(--inc)"><div class="sm">Deposited ${labels[PER].toLowerCase()}</div><div class="bigt fit" data-cu="${a.earned}" data-mode="compact" data-cur="${c}">${compact(a.earned,c)}</div><div class="dl">${delta==null?`<span class="pill">${a.nEarn||0} deposits</span>`:`<span class="pill ${delta>=0?'inc':'exp'}">${delta>=0?'▲':'▼'} ${Math.abs(delta).toFixed(0)}%</span><span class="sm">vs ${pl}</span>`}</div>${spark(gser,{h:84,c:'var(--inc)'})}<div class="sm" style="display:flex;justify-content:space-between"><span>${mo[0].l}</span><span>Total saved ${compact(total,c)}</span><span>${mo[11].l}</span></div></section>`;
 const wdep={};for(const t of P().txns){if(t.t>=r.from&&t.t<r.to&&t.k==='i'&&t.c!=='AD'&&t.c!=='TX')wdep[t.w]=(wdep[t.w]||0)+t.a}
 const plans=VW().slice().sort((x,y)=>b[y.id]-b[x.id]).map(w=>{const col=colorOf(w.id);const g=w.goal>0?Math.min(1,Math.max(0,b[w.id]/w.goal)):null;return`<button class="row cl" data-act="wallet" data-id="${w.id}" style="--c:${col}"><div class="wic">${ico(w.type,18)}</div><div class="m"><b>${esc(w.name)}</b><span>${wdep[w.id]?'+'+compact(wdep[w.id],w.cur)+' '+labels[PER].toLowerCase():'No deposits '+labels[PER].toLowerCase()}</span>${g!=null?trk(g,col):''}</div><div class="r"><b>${compact(b[w.id],w.cur)}</b>${g!=null?`<span class="sm" style="display:block">${Math.round(g*100)}%</span>`:''}</div></button>`}).join('');
 const since=new Date();since.setMonth(since.getMonth()-6);const dep6={};for(const t of P().txns){if(t.t>=since.getTime()&&t.k==='i'&&t.c!=='AD'&&t.c!=='TX')dep6[t.w]=(dep6[t.w]||0)+t.a}
 const goals=VW().filter(w=>w.goal>0);
 const goalRows=goals.map(w=>{const left=w.goal-b[w.id],avg=(dep6[w.id]||0)/6;let eta;if(left<=0)eta='Goal reached';else if(avg<=0)eta='Add deposits to see a forecast';else{const mm=Math.ceil(left/avg);const d=new Date();d.setMonth(d.getMonth()+mm);eta='At this pace: '+d.toLocaleDateString('en-GB',{month:'short',year:'numeric'})}const f=Math.max(0,Math.min(1,b[w.id]/w.goal));
  return`<div class="gr">${pr(f,colorOf(w.id),Math.round(f*100)+'%')}<div class="m"><b>${esc(w.name)}</b><span class="sm" style="display:block">${money(b[w.id],w.cur)} of ${money(w.goal,w.cur)}</span><span class="eta">${eta}</span></div></div>`}).join('');
 const goalCard=card('Goals and forecast',goals.length?goalRows:'<p class="sm" style="line-height:1.5">Open a plan and set a goal to see how close you are and when you will get there.</p>',{i:4});
 const segs=Object.entries(wdep).sort((x,y)=>y[1]-x[1]).map(([k,v])=>({v,c:colorOf(k),k}));const dt=segs.reduce((x,y)=>x+y.v,0)||1;
 const don=segs.length?`<div class="flex">${donutHtml(segs,dt,`<span class="sm">Deposited</span><b class="fit" style="max-width:96px;overflow:hidden">${compact(dt)}</b>`)}<div class="leg">${segs.slice(0,6).map(s2=>`<div class="row" style="--c:${s2.c}"><i></i><span class="n">${esc(nameOf(s2.k))}</span><span class="v">${Math.round(s2.v/dt*100)}%</span></div>`).join('')}</div></div>`:'<p class="sm">No deposits in this period.</p>';
 const avgM=a.depMonths.size?a.earned/a.depMonths.size:0;const bm=mo.reduce((x,m)=>m.inc>x.inc?m:x,mo[0]);const wTot=a.spent;let pen=0;for(const t of P().txns){if(t.t>=r.from&&t.t<r.to&&t.k==='e'&&t.c==='PN')pen+=t.a}
 const hab=`<div class="hab rise" style="--i:6"><div class="g"><span>Deposit streak</span><b data-cu="${co.streak}" data-mode="int">${co.streak}</b><span>months in a row</span>${trk(co.streak/12,'var(--inc)')}</div><div class="g"><span>Average month</span><b class="fit" data-cu="${avgM}" data-mode="compact" data-cur="${c}">${compact(avgM)}</b><span>${a.depMonths.size} active months</span>${trk(Math.min(1,a.depMonths.size/12),'var(--a1)')}</div><div class="g"><span>Best month</span><b class="fit" data-cu="${bm.inc}" data-mode="compact" data-cur="${c}">${compact(bm.inc)}</b><span>${bm.l} of the last 12</span>${trk(bm.inc?1:0,'var(--a2)')}</div><div class="g"><span>Biggest deposit</span><b class="fit" data-cu="${a.biggest?a.biggest.a:0}" data-mode="compact" data-cur="${c}">${a.biggest?compact(a.biggest.a):'None'}</b><span>${a.biggest?esc(a.biggest.m||nameOf(a.biggest.w)):''}</span>${trk(a.earned&&a.biggest?a.biggest.a/a.earned:0,'var(--a3)')}</div></div>`;
 const out=wTot>0?card('Taken out',`<div class="bgt"><div><span class="sm">Withdrawn ${labels[PER].toLowerCase()}</span><b class="exp">${money(wTot)}</b></div></div>${pen>0?`<p class="sm" style="margin-top:6px">Includes ${money(pen)} in penalties and charges.</p>`:''}`,{i:7}):'';
 const note=a.earned>0?card('Keep going',`<div class="hlr" style="--c:var(--inc)"><i></i><span>At about ${money(avgM)} a month you would add ${money(avgM*12)} over the next year.</span></div><div class="hlr" style="--c:var(--a1)"><i></i><span>${co.streak>0?`You are on a ${co.streak}-month deposit streak.`:'Deposit this month to start a streak.'}</span></div>`,{i:3}):'';
 return ttl('Your savings','Insights')+
 `<div class="seg rise" style="margin-bottom:14px;--i:1">${Object.entries(labels).map(([k,v])=>`<button class="${PER===k?'on':''}" data-act="per" data-v="${k}">${v}</button>`).join('')}</div>
 <div class="cols"><div>${hero}${note}${card('Your plans',plans||'<p class="sm">No plans.</p>',{i:4})}${goalCard}</div><div>${card('Deposits by month',stackedMonths(12),{i:5})}${card('Growth by plan',multi(P().wallets.slice(0,6).map(w=>({v:balSeries([w.id],18,'m'),c:colorOf(w.id)})))+`<div class="chips" style="margin-top:12px;flex-wrap:wrap">${P().wallets.slice(0,6).map(w=>`<span class="pill"><i style="width:8px;height:8px;border-radius:50%;background:${colorOf(w.id)}"></i>${esc(w.name)}</span>`).join('')}</div>`,{i:5})}${card('Where deposits went',don,{i:6})}${card('Consistency',co.html,{i:6})}${hab}${out}</div></div>`}

const mkey=t=>{const d=new Date(t);return d.getFullYear()*12+d.getMonth()};
const mlabel=k=>MONTHS[k%12]+' '+Math.floor(k/12);
function monthKeys(){const set=new Set(P().txns.map(t=>mkey(t.t)));return[...set].sort((a,b)=>b-a)}
function vHistory(){
 const L=LB();const mk=monthKeys();if(H.m==='cur'){const nk=mkey(Date.now());H.m=mk.includes(nk)?nk:(mk[0]!=null?mk[0]:'all')}
 return ttl('Everything you logged','History')+
 `<div class="search rise" style="--i:1">${ico('search',18)}<input class="field" id="q" placeholder="Search memo, category or amount" value="${esc(H.q)}"></div>
 <div class="chips rise" style="margin-bottom:8px;--i:2"><button class="chip ${H.m==='all'?'on':''}" data-act="hm" data-v="all">All time</button>${mk.map(k=>`<button class="chip ${H.m===k?'on':''}" data-act="hm" data-v="${k}">${MONTHS[k%12].slice(0,3)} ${String(Math.floor(k/12)).slice(2)}</button>`).join('')}</div>
 <div class="chips rise" style="margin-bottom:12px;--i:3">${[['all','All'],['e',L.exp+'s'],['i',rc()?'Deposits':'Income'],['t','Transfers']].map(([k,v])=>`<button class="chip ${H.f===k?'on':''}" data-act="hf" data-v="${k}">${v}</button>`).join('')}${P().wallets.length>1?P().wallets.map(w=>`<button class="chip ${H.w===w.id?'on':''}" data-act="hw" data-v="${H.w===w.id?'all':w.id}">${esc(w.name)}</button>`).join(''):''}</div>
 <div class="chips rise" style="margin-bottom:12px;--i:3"><button class="chip ${H.d?'on':''}" data-act="cal" style="display:inline-flex;align-items:center;gap:6px">${ico('cal',15)} ${H.d?new Date(H.d).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',year:'numeric'}):'Pick a date'}</button>${H.d?'<button class="chip" data-act="calclear">Clear date</button>':''}<button class="chip" data-act="hsort">Sort: ${({new:'Newest',old:'Oldest',big:'Largest',small:'Smallest'})[H.s||'new']}</button></div>
 ${histFilters()}${histSummary()}
 <div id="hl">${histList()}</div>`}
function histFilters(){const n=(H.c?1:0)+(H.min>0?1:0)+(H.max>0?1:0)+(H.r?1:0);
 return`<div class="chips rise" style="margin-bottom:12px;--i:3"><button class="chip ${H.fo||n?'on':''}" data-act="hfo">Filters${n?' ('+n+')':''}</button>${H.q.trim()?'<span class="sm" style="align-self:center">Searching all time</span>':''}</div>`+(H.fo?`<section class="g card" style="margin-bottom:14px"><div class="lbl"><span>Category</span></div><select class="field" id="hfc"><option value="">All categories</option>${P().cats.filter(c=>!SYSC(c.code)).map(c=>`<option value="${esc(c.code)}" ${H.c===c.code?'selected':''}>${esc(c.name)}</option>`).join('')}</select><div class="lbl" style="margin-top:14px"><span>Amount between</span></div><div style="display:flex;gap:10px"><input class="field" id="hmin" inputmode="decimal" placeholder="Min" value="${H.min>0?H.min:''}"><input class="field" id="hmax" inputmode="decimal" placeholder="Max" value="${H.max>0?H.max:''}"></div><div class="chips" style="margin-top:14px"><button class="chip ${H.r?'on':''}" data-act="hrc">With receipt</button>${n?'<button class="chip" data-act="hclr">Clear filters</button>':''}</div></section>`:'')}
function histRefresh(){$('#hl').innerHTML=histList();const h=document.querySelector('.hsum');if(h)h.outerHTML=histSummary();countUps($('#hl'))}
function histSummary(){const all=histFilter();let inn=0,out=0,big=null;for(const t of all){if(SYSC(t.c)||t.k==='t')continue;if(t.k==='i')inn+=t.a;else{out+=t.a;if(!big||t.a>big.a)big=t}}
 let glance='';if(typeof H.m==='number'){const y=Math.floor(H.m/12),mo=H.m%12,dim=new Date(y,mo+1,0).getDate(),v=Array(dim).fill(0);for(const t of P().txns){if(t.k==='e'&&!SYSC(t.c)){const d=new Date(t.t);if(d.getFullYear()===y&&d.getMonth()===mo&&(H.w==='all'||t.w===H.w))v[d.getDate()-1]+=t.a}}const mx=Math.max(1,...v);
  glance=`<div class="dbars">${v.map((x,i)=>{const ts=new Date(y,mo,i+1).getTime();return`<button data-act="hday" data-v="${ts}" class="${H.d===ts?'on':''}" aria-label="Day ${i+1}"><i style="height:${Math.max(4,x/mx*100)}%"></i></button>`}).join('')}</div><div class="dax"><span>1</span><span>Tap a day to see it</span><span>${dim}</span></div>`}
 return`<section class="g card rise hsum" style="--i:4"><div class="hs3"><div><span>${rc()?'Deposits':'In'}</span><b class="inc">${compact(inn)}</b></div><div><span>${rc()?'Withdrawals':'Out'}</span><b class="exp">${compact(out)}</b></div><div><span>Net</span><b class="${inn-out<0?'exp':'inc'}">${compact(inn-out)}</b></div></div>${glance}${big?`<div class="hbig"><span>Biggest</span><b>${esc(big.m||cat(big.c).name)}</b><em>${money(big.a)}</em></div>`:''}<div class="hmeta"><span class="sm">${all.length.toLocaleString()} ${all.length===1?'entry':'entries'} shown</span><button class="pill" data-act="hexport">Export these</button></div></section>`}
function hExport(){const q=v=>'"'+String(v).replace(/"/g,'""')+'"';const rows=[['Date','Type','Category','Wallet','Amount','Memo']];for(const t of histFilter()){const w=WM()[t.w];rows.push([new Date(t.t).toISOString().slice(0,16).replace('T',' '),t.k==='i'?'Income':t.k==='e'?'Expense':'Transfer',t.k==='t'?'Transfer':cat(t.c).name,w?w.name:'',t.a,t.m||''])}shareFile('MoneyTrack-history.csv',rows.map(r=>r.map(q).join(',')).join('\n'),'text/csv')}
function histFilter(){const q=H.q.trim().toLowerCase();return P().txns.filter(t=>(q||(H.d?sd(t.t)===H.d:(H.m==='all'||mkey(t.t)===H.m)))&&(H.f==='all'||t.k===H.f)&&(H.w==='all'||t.w===H.w||t.to===H.w)&&(!H.c||t.c===H.c)&&(!(H.min>0)||t.a>=H.min)&&(!(H.max>0)||t.a<=H.max)&&(!H.r||t.img)&&(!q||(t.m||'').toLowerCase().includes(q)||cat(t.c).name.toLowerCase().includes(q)||String(t.a).includes(q)||((WM()[t.w]||{}).name||'').toLowerCase().includes(q))).sort(H.s==='old'?(a,b)=>a.t-b.t:H.s==='big'?(a,b)=>b.a-a.a:H.s==='small'?(a,b)=>a.a-b.a:(a,b)=>b.t-a.t)}
function histList(){
 const all=histFilter();const total=all.length;const L=all.slice(0,H.n);
 if(!total)return'<p class="sm" style="text-align:center;padding:40px 0">Nothing found.</p>';
 const rmx=Math.max(1,...L.map(t=>t.a));const months=[];
 if(H.s==='big'||H.s==='small'||H.s==='old'&&false)return`<div class="g card" style="padding:6px 16px;border-radius:26px">${L.map(t=>swRow(t,rmx)).join('')}</div>`+(total>L.length?`<button class="btn soft" style="margin-top:18px" data-act="more">Show more (${total-L.length} left)</button>`:'');
 for(const t of L){const mk=mkey(t.t);let m=months[months.length-1];if(!m||m.k!==mk){m={k:mk,days:[],items:[]};months.push(m)}m.items.push(t);const dk=sd(t.t);let d=m.days[m.days.length-1];if(!d||d.k!==dk){d={k:dk,items:[]};m.days.push(d)}d.items.push(t)}
 const td=sd(Date.now());
 let out=months.map(m=>{const full=all.filter(t=>mkey(t.t)===m.k);const inn=full.filter(t=>t.k==='i'&&!SYSC(t.c)).reduce((s,t)=>s+t.a,0),outv=full.filter(t=>t.k==='e'&&!SYSC(t.c)).reduce((s,t)=>s+t.a,0),mx=Math.max(inn,outv,1);
  const head=`<section class="g card" style="padding:18px;margin:6px 0 18px"><div class="lbl"><span class="t">${mlabel(m.k)}</span><span class="sm">${full.length} ${full.length===1?'entry':'entries'}</span></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:16px"><div><span class="sm">${rc()?'Deposits':'In'}</span><b class="inc" style="display:block;font-size:18px" data-cu="${inn}" data-mode="compact" data-cur="${cur()}">${compact(inn)}</b>${trk(inn/mx,'var(--inc)')}</div><div><span class="sm">${rc()?'Withdrawals':'Out'}</span><b class="exp" style="display:block;font-size:18px" data-cu="${outv}" data-mode="compact" data-cur="${cur()}">${compact(outv)}</b>${trk(outv/mx,'var(--exp)')}</div></div></section>`;
  const days=m.days.map(g=>{const net=g.items.reduce((x,t)=>x+(t.k==='i'?t.a:t.k==='e'?-t.a:0),0);const dt=new Date(g.k);const lab=g.k===td?'Today':g.k===td-DAY?'Yesterday':dt.toLocaleDateString('en-GB',{weekday:'long'});
   return`<div class="dgrp"><div class="dhead"><div class="dbadge"><b>${dt.getDate()}</b><span>${MONTHS[dt.getMonth()].slice(0,3)}</span></div><div class="dtx"><b>${lab}</b><span>${dt.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})} · ${g.items.length} ${g.items.length===1?'entry':'entries'}</span></div><div class="dnet ${net>0?'inc':net<0?'exp':''}">${net?money(net,undefined,true):''}</div></div><div class="g dcard">${g.items.map(t=>swRow(t,rmx)).join('')}</div></div>`}).join('');
  return (typeof H.m==='number'?'':head)+days}).join('');
 if(total>L.length)out+=`<button class="btn soft" style="margin-top:18px" data-act="more">Show more (${total-L.length} left)</button>`;
 return out}

const SR=(act,ic,col,t,sub,o={})=>`<button class="srow" data-act="${act}"${o.id?` data-id="${o.id}"`:''}${o.v?` data-v="${o.v}"`:''}><i style="--c:${col}">${ico(ic,18)}</i><div class="m"><b class="${o.cls||''}">${t}</b>${sub?`<span>${sub}</span>`:''}</div>${o.r||`<em>${ico('chev',16)}</em>`}</button>`;
const SG=(t,body,i)=>`<div class="sgrp rise" style="--i:${i}"><div class="sgt">${t}</div><div class="g sbox">${body}</div></div>`;
function vSettings(){
 const st=S.set,p=P(),n=p.txns.length;const cv=(st.vibe==='aurora'?'glass':st.vibe)||'nova';
 const vibes=[['nova','Nova','linear-gradient(135deg,#4f46e5,#9333ea)'],['liquid','Liquid','linear-gradient(135deg,#0a84ff,#5e5ce6 55%,#64d2ff)'],['glass','Glass','linear-gradient(135deg,#60a5fa,#c4b5fd)'],['sunset','Sunset','linear-gradient(135deg,#f97316,#ec4899)'],['ocean','Ocean','linear-gradient(135deg,#0284c7,#0d9488)'],['berry','Berry','linear-gradient(135deg,#c026d3,#7c3aed)'],['mono','Mono','linear-gradient(135deg,#18181b,#a1a1aa)']];
 return ttl('Make it yours','Settings')+
 `<section class="g card sprof rise" style="--i:1"><div class="av big">${esc(p.name.slice(0,1).toUpperCase())}</div><div class="m"><b>${esc(p.name)}</b><span>${p.kind==='records'?'Savings records':'Daily spending'} · ${n.toLocaleString()} entries · ${S.profiles.length} ${S.profiles.length===1?'profile':'profiles'}</span></div></section>
 <div class="sbtns rise" style="--i:1"><button class="btn soft" data-act="profiles">Switch profile</button><button class="btn soft" data-act="manage" data-id="${p.id}">Rename or delete</button></div>`+
 (UPD?`<button class="g card updc rise" data-act="refresh" style="--i:1"><b>New version ready</b><span>Tap to update now. Your data stays.</span></button>`:'')+
 SG('Look',`<div class="sblk"><div class="seg">${[['auto','Auto'],['light','White'],['dark','Dark']].map(([k,v])=>`<button class="${st.theme===k?'on':''}" data-act="theme" data-v="${k}">${v}</button>`).join('')}</div></div><div class="sblk"><div class="vibes2">${vibes.map(([k,nm,g])=>`<button class="vb2 ${cv===k?'on':''}" data-act="vibe" data-v="${k}"><i style="background:${g}"></i><span>${nm}</span></button>`).join('')}</div></div>`,2)+
 SG('Protect your data',`<div class="sblk">${saveStatus()}</div>${SR('restore','down','#6366f1','Restore a backup','Pick your backup file. A CSV is added to this profile instead')}<div class="sblk"><div class="lbl"><span>Auto-save to a file</span></div>${autoCard()}</div><div class="sblk"><div class="lbl"><span>App lock</span></div>${secCard()}</div>`,3)+
 SG('Money',SR('tpls','plus','#0ea5e9','Quick templates',tOf().length?tOf().length+' saved':'One-tap entries you use often')+SR('tab','swap','#10b981','Debts and loans',dOf().filter(d=>dLeft(d)>0).length?dOf().filter(d=>dLeft(d)>0).length+' open':'Who owes you, who you owe',{v:'debts'})+SR('tab','list','#ec4899','Subscriptions',(P().rec||[]).length?(P().rec||[]).length+' repeating':'Bills that repeat every month',{v:'subs'})+SR('report','chart','#6366f1','Monthly report','Make a shareable summary image')+SR('hide','eye','#64748b','Hide amounts',S.set.hide?'On. Balances show as dots':'Off. Tap the eye on any page')+SR('tab','savings','#f59e0b','Goals',gOf().length?gOf().length+(gOf().length===1?' goal':' goals'):'Save toward a house, a trip, anything',{v:'goals'})+(rc()?'':SR('budget','chart','#f59e0b','Monthly budget',p.bud&&Object.keys(p.bud).length?'Edit your limits':'Set limits for the month'))+`<div class="sblk"><div class="lbl"><span>Recurring entries</span></div>${recCard()}</div>${SR('cats','list','#8b5cf6','Categories','Rename or add. Letters and numbers only')}<div class="sblk"><div class="lbl"><span>Currency for ${esc(p.name)}</span></div><select class="field" id="curSel">${CURS.map(c=>`<option ${c===p.cur?'selected':''}>${c}</option>`).join('')}</select></div>${SR('import','down','#0ea5e9','Import CSV into '+esc(p.name),'Your old app format. Duplicates are skipped')}${SR('export','up','#14b8a6','Export '+esc(p.name)+' as CSV',n.toLocaleString()+' entries')}`,4)+
 SG('Advanced',SR('wipe','del','#ef4444','Erase this profile','Removes its wallets and entries',{cls:'exp'})+SR('reset','del','#ef4444','Reset the whole app','Start fresh, then restore your backup file',{cls:'exp'}),5)+
 SG('About',`<div class="sblk"><b>MoneyTrack ${VER}</b><p class="sm" style="margin-top:4px;line-height:1.5">Open source. Your data lives only on this device.</p></div>${SR('chkupd','swap','#0ea5e9','Check for updates','Looks for a newer version')}${SR('refresh','swap','#6366f1','Force refresh the app','Use this if something looks out of date. Data is not touched')}<div class="sblk"><p class="sm" style="line-height:1.55">iPhone: open in Safari, tap Share, then Add to Home Screen. Android: open in Chrome, menu, Install app.</p><div id="inst"></div></div>`,6)}

let UPD=false;
async function checkUpdate(manual){try{const r=await fetch('version.json?'+Date.now(),{cache:'no-store'});const j=await r.json();UPD=j.v!==VER;if(UPD&&!manual&&!document.querySelector('#layer .sheet')&&performance.now()<30000&&localStorage.getItem('mt-autoupd')!==j.v){localStorage.setItem('mt-autoupd',j.v);hardRefresh();return}if(manual)toast(UPD?'New version '+j.v+' is ready':'You are on the latest version ('+VER+')');if((UPD||manual)&&(TAB==='today'||TAB==='settings'))render()}catch(e){if(manual)toast('Could not check. Are you online?')}}
async function hardRefresh(){toast('Updating...');try{const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister()));const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)));await Promise.all(['./','index.html','styles.css','app.js','sw.js','manifest.webmanifest','version.json'].map(f=>fetch(f,{cache:'reload'}).catch(()=>0)))}catch(e){}location.reload()}
function openReset(){sheet(`<h2>Reset the whole app</h2><p class="sm" style="line-height:1.55;margin:-6px 0 16px">This erases every profile, wallet, entry, budget and setting on this device and gives you a fresh app. Afterwards you can restore your backup file.</p><button class="btn soft" data-act="backup">Back up first</button><div class="lbl" style="margin-top:20px"><span>Type RESET to continue</span></div><input class="field" id="rsi" autocapitalize="characters" autocomplete="off" placeholder="RESET"><div class="sticky"><button class="btn red" id="rsb" disabled>Erase and start fresh</button></div>`,sh=>{const i=$('#rsi',sh),b=$('#rsb',sh);i.oninput=()=>{b.disabled=i.value.trim().toUpperCase()!=='RESET'};b.onclick=async()=>{try{localStorage.removeItem(KEY)}catch(e){}try{await idbSet('fh',null)}catch(e){}AFH=null;AFS='';S=seed();PER='m';H={q:'',f:'all',w:'all',n:120,m:'cur'};_bal=_wm=_cm=null;save();closeSheet();applyTheme();shell();TAB='today';render();scrollTo(0,0);toast('Reset done. Restore your backup from here')}})}
function updNudge(){return UPD?`<button class="g card updc rise" data-act="refresh" style="--i:0"><b>New version ready</b><span>Tap to update. Your data stays.</span></button>`:''}

function vCats(){
 const p=P();const row=c=>`<div class="cr"><div class="tile" style="--c:${COLORS[c.code]||'#8e8e93'};width:40px;height:40px;border-radius:14px;font-size:12px">${esc(c.code)}</div><input class="field" data-cat="${esc(c.code)}" value="${esc(c.name)}" maxlength="24"></div>`;
 return`<div class="top" style="position:static"><div class="ttl" style="margin:0"><h1>Categories</h1></div><button class="ib g" data-act="tab" data-v="settings">${ico('back',20)}</button></div>`+
 card(rc()?'Withdrawals':'Expenses',p.cats.filter(c=>!c.inc).map(row).join('')+`<button class="btn soft" data-act="newcat" data-v="e" style="margin-top:8px">Add category</button>`,{i:1})+
 card(rc()?'Deposits':'Income',p.cats.filter(c=>c.inc).map(row).join('')+`<button class="btn soft" data-act="newcat" data-v="i" style="margin-top:8px">Add category</button>`,{i:2})+`<p class="sm" id="cerr" style="padding:0 8px"></p>`}

/* ---------- sheets ---------- */
let SH=null;const PAD='<div class="pad"></div>';
function sheet(html,mount){closeSheet(true);if(!HS){try{history.pushState({mt:1},'')}catch(e){}HS=true}const L=$('#layer');L.innerHTML=`<div class="scrim"></div><div class="sheet" role="dialog">${SXB}<div class="grab"></div>${html}</div>`;const sc=$('.scrim',L),sh=$('.sheet',L);sc.onclick=()=>closeSheet();SH=sh;dragClose(sh);requestAnimationFrame(()=>requestAnimationFrame(()=>{sc.classList.add('on');sh.classList.add('on')}));syncLock();mount&&mount(sh);return sh}
let _sy=0,_lk=false;
function syncLock(){const open=!!document.querySelector('#layer .sheet');const a=$('#app');if(a)a.classList.toggle('sl0',open)}
function dragClose(sh){let y0=0,dy=0,on=false;const g=sh.querySelector('.grab');if(!g)return;
 g.addEventListener('touchstart',e=>{y0=e.touches[0].clientY;dy=0;on=true;sh.style.transition='none'},{passive:true});
 g.addEventListener('touchmove',e=>{if(!on)return;dy=Math.max(0,e.touches[0].clientY-y0);sh.style.transform=`translate3d(0,${dy}px,0)`},{passive:true});
 const end=()=>{if(!on)return;on=false;sh.style.transition='';if(dy>100){sh.style.transform='';closeSheet()}else sh.style.transform=''};
 g.addEventListener('touchend',end);g.addEventListener('touchcancel',end)}
let HS=false;
function closeSheet(now){if(!now&&HS){HS=false;try{history.back()}catch(e){}}_close(now)}
window.addEventListener('popstate',()=>{if(HS){HS=false;_close(false)}});
function _close(now){setTimeout(syncLock,now?0:480);const L=$('#layer');const sc=$('.scrim',L),sh=$('.sheet',L);SH=null;if(!sh)return;if(now){L.innerHTML='';return}sc.classList.remove('on');sh.classList.remove('on');setTimeout(()=>{if(!SH)L.innerHTML=''},450)}
const cleanW=s=>/^[A-Za-z0-9][A-Za-z0-9 ()&'.\-]{1,39}$/.test(s.trim());
const cleanOK=s=>/^[A-Za-z0-9][A-Za-z0-9 ]{1,23}$/.test(s.trim());

let A=null;
function openAdd(t,pre){
 if(!P().wallets.length){toast('Create a '+LB().w1.toLowerCase()+' first');setTab('wallets');return openWallet()}
 const defW=(VW()[0]||P().wallets[0]).id;
 A=t?{edit:t.id,k:t.k,amt:String(t.a),w:t.w,to:t.to||'',c:t.c,m:t.m||'',t:t.t,img:t.img||'',sp:''}:Object.assign({edit:null,k:rc()?'i':'e',amt:'',w:defW,to:'',c:'',m:'',t:Date.now(),img:'',sp:''},pre||{});
 A.s=(t||(pre&&pre.amt))?2:1;
 sheet(addHtml(),mountAdd).classList.add('tall')}
const KS=()=>rc()?[['i','Deposit'],['e','Withdraw'],['t','Transfer']]:[['e','Expense'],['i','Income'],['t','Transfer']];
const OPS={'+':'+','-':'\u2212','*':'\u00d7','/':'\u00f7'};
const hasOp=x=>/[+\-*/]/.test(x||'');
function calc(x){x=String(x||'').replace(/[+\-*\/]+$/,'');if(!x)return 0;const t=x.split(/([+\-*\/])/).filter(q=>q!=='');const n=[parseFloat(t[0])],o=[];for(let i=1;i<t.length;i+=2){const op=t[i],v=parseFloat(t[i+1]);if(op==='*')n[n.length-1]*=v;else if(op==='/')n[n.length-1]/=v;else{o.push(op);n.push(v)}}let r=n[0];o.forEach((op,i)=>{r=op==='+'?r+n[i+1]:r-n[i+1]});return Math.round(r*100)/100}
const fmtAmt1=x=>{x=x||'0';const p=x.split('.');return Number(p[0]||0).toLocaleString('en-US')+(x.includes('.')?'.'+(p[1]||''):'')};
const fmtAmt=x=>!hasOp(x)?fmtAmt1(x):String(x).split(/([+\-*\/])/).filter(q=>q!=='').map(q=>OPS[q]?' '+OPS[q]+' ':fmtAmt1(q)).join('');
const amtSz=x=>x.length<=8?'s1':x.length<=11?'s2':'s3';
function freqH(cs){const fq={};for(const t of P().txns.slice(-500)){if(t.k===A.k&&t.c)fq[t.c]=(fq[t.c]||0)+1}const top=Object.entries(fq).sort((a,b)=>b[1]-a[1]).map(e=>e[0]).filter(k=>cs.some(c=>c.code===k)).slice(0,4);return top.length?`<div class="lbl"><span>Frequent</span></div><div class="chips" style="margin-bottom:16px">${top.map(k=>`<button class="chip ${A.c===k?'on':''}" data-a="c" data-v="${k}">${esc(cat(k).name)}</button>`).join('')}</div>`:''}
const walChips=()=>P().wallets.filter(x=>!x.hidden||x.id===A.w).map(x=>payCard(x,{mini:1,on:A.w===x.id,attrs:`data-a="w" data-v="${x.id}"`})).join('');
const toChips=()=>A.k!=='t'?'':`<div class="lbl"><span>To</span></div><div class="pcs mini" style="margin-bottom:16px">${P().wallets.filter(x=>x.id!==A.w&&(!x.hidden||x.id===A.to)).map(x=>payCard(x,{mini:1,on:A.to===x.id,attrs:`data-a="to" data-v="${x.id}"`})).join('')||'<span class="sm">Add another '+LB().w1.toLowerCase()+' to transfer.</span>'}</div>`;
function catSec(){if(A.k==='t')return'';const cs=P().cats.filter(c=>c.inc===(A.k==='i'));return`${freqH(cs)}<div class="lbl"><span>Category</span></div><div class="cg">${cs.map(c=>{const col=COLORS[c.code]||'#8e8e93';return`<button class="${A.c===c.code?'on':''}" style="--c:${col}" data-a="c" data-v="${c.code}"><div class="tile" style="--c:${col}">${esc(c.code)}</div><span>${esc(c.name)}</span></button>`}).join('')}</div>${A.k==='e'&&!A.edit?`<div class="lbl"><span>Split with (optional)</span></div><input class="field" id="spl" placeholder="Names, e.g. Ama, Kofi" value="${esc(A.sp||'')}" autocomplete="off"><p class="sm" style="margin:6px 4px 14px">Everyone pays an equal share. What they owe you is tracked in Debts.</p>`:''}`}
const dayChips=()=>[[0,'Today'],[1,'Yesterday'],[2,'2 days ago']].map(([n,l])=>`<button class="chip ${sd(A.t)===sd(Date.now())-n*DAY?'on':''}" data-a="day" data-v="${n}">${l}</button>`).join('');
function addHtml(){
 const L=LB();const dt=new Date(A.t-new Date(A.t).getTimezoneOffset()*6e4).toISOString().slice(0,16);
 return`<div class="ad"><div class="adh"><h2>${A.edit?'Edit entry':'New entry'}</h2><div class="seg" id="aks">${KS().map(([k,v])=>`<button class="${A.k===k?'on':''}" data-a="k" data-v="${k}">${v}</button>`).join('')}</div></div>
 <div class="stage"><div class="track ${A.s===2?'s2':''}" id="atr">
 <section class="pg"><div class="amtbox s1"><small id="asym"></small><span id="amtv"></span></div><div class="amtsub" id="asub"></div><div class="kp">${[[1,2,3,'/'],[4,5,6,'*'],[7,8,9,'-'],['.',0,'del','+']].flat().map(k=>`<button data-a="key" data-v="${k}" class="${OPS[k]?'op':''}" aria-label="${k}">${k==='del'?ico('del',24):OPS[k]||k}</button>`).join('')}</div><div class="foot"><button class="btn acc" data-a="next">Continue</button></div></section>
 <section class="pg"><div class="scr" id="ascr"><button class="recap" data-a="back"><span id="rcap"></span><em>Change amount</em></button>
 <div class="lbl"><span>${A.k==='t'?'From':L.w1}</span></div><div class="pcs mini" id="awr" style="margin-bottom:16px">${walChips()}</div><div id="ato">${toChips()}</div><div id="acat">${catSec()}</div>
 <div class="lbl"><span>Note</span></div><input class="field" id="memo" placeholder="What was it for?" maxlength="80" value="${esc(A.m)}" autocomplete="off"><div class="chips" id="sug" style="margin:8px 0 16px"></div>
 <div class="lbl"><span>Receipt (optional)</span></div><div id="arc" style="margin-bottom:16px">${rcHtml()}</div><input type="file" id="rcf" accept="image/*" hidden>${A.edit||A.k==='t'?'':`<div class="chips" style="margin:-4px 0 16px"><button class="chip ${A.tp?'on':''}" data-a="tp">Save as quick template</button></div>`}<div class="lbl"><span>When</span></div><div class="chips" id="adc" style="margin-bottom:8px">${dayChips()}</div><input class="field" type="datetime-local" id="when" value="${dt}"><div style="height:16px"></div></div>
 <div class="foot"><button class="btn acc" data-a="save">${A.edit?'Save changes':'Save entry'}</button>${A.edit?'<button class="btn red" data-a="del">Delete entry</button>':'<button class="btn ghost" data-a="again">Save and add another</button>'}</div></section>
 </div></div></div>`}
function mountAdd(sh){
 const memo=$('#memo',sh),when=$('#when',sh),tr=$('#atr',sh);
 const sug=()=>{const q=memo.value.trim().toLowerCase();const el=$('#sug',sh);if(!q){el.innerHTML='';return}const m={};for(const t of P().txns){const k=(t.m||'').trim();if(!k||!k.toLowerCase().startsWith(q)||k.toLowerCase()===q)continue;const o=m[k]||(m[k]={k,n:0,c:t.c});o.n++}el.innerHTML=Object.values(m).sort((a,b)=>b.n-a.n).slice(0,4).map(o=>`<button class="chip" data-a="sug" data-v="${esc(o.k)}" data-c="${o.c}">${esc(o.k)}</button>`).join('')};
 const paint=()=>{const w=WM()[A.w],t2=WM()[A.to];const f=fmtAmt(A.amt);const bx=$('.amtbox',sh);bx.className='amtbox '+amtSz(f)+(A.k==='i'?' inc':A.k==='e'?' exp':'');$('#amtv',sh).textContent=f;const ev=hasOp(A.amt)?'= '+fmtAmt1(String(calc(A.amt))):'';const sy=SYM[(w||{}).cur||cur()]||'';$('#asym',sh).textContent=sy;$('#rcap',sh).textContent=sy+(hasOp(A.amt)?fmtAmt1(String(calc(A.amt))):f);$('#asub',sh).textContent=(ev?ev+'  ·  ':'')+(A.k==='t'?`${w?w.name:''}${t2?' to '+t2.name:''}`:(A.k==='i'?'into ':'from ')+(w?w.name:''))};
 memo.oninput=()=>{A.m=memo.value;sug()};
 when.onchange=()=>{const v=new Date(when.value).getTime();if(v){A.t=v;$('#adc',sh).innerHTML=dayChips()}};
 sh.onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,v=b.dataset.v;
  if(a==='key'){buzz();let x=A.amt;const seg=x.split(/[+\-*\/]/).pop();if(v==='del')x=x.slice(0,-1);else if(OPS[v]){if(!x)return;x=/[+\-*\/]$/.test(x)?x.slice(0,-1)+v:x+v}else if(v==='.'){if(!seg.includes('.'))x=(seg===''?x+'0':x||'0')+'.'}else{if(seg.includes('.')&&seg.split('.')[1].length>=2)return;if(seg.replace('.','').length>=10||x.length>=26)return;x=seg==='0'?x.slice(0,-1)+String(v):x+v}A.amt=x;paint()}
  else if(a==='next'){if(hasOp(A.amt))A.amt=String(calc(A.amt));if(!(parseFloat(A.amt)>0)){toast('Enter an amount');buzz();return}A.s=2;tr.classList.add('s2');$('#ascr',sh).scrollTop=0}
  else if(a==='back'){A.s=1;tr.classList.remove('s2')}
  else if(a==='k'){A.k=v;if(v!=='t'&&!P().cats.find(c=>c.code===A.c&&c.inc===(v==='i')))A.c='';sh.querySelectorAll('#aks button').forEach(x=>x.classList.toggle('on',x.dataset.v===v));$('#ato',sh).innerHTML=toChips();$('#acat',sh).innerHTML=catSec();paint()}
  else if(a==='w'){A.w=v;if(A.to===v)A.to='';sh.querySelectorAll('#awr .pcard').forEach(x=>x.classList.toggle('on',x.dataset.v===v));$('#ato',sh).innerHTML=toChips();paint()}
  else if(a==='to'){A.to=v;sh.querySelectorAll('#ato .pcard').forEach(x=>x.classList.toggle('on',x.dataset.v===v));paint()}
  else if(a==='tp'){A.tp=!A.tp;$('[data-a=tp]',sh).classList.toggle('on',A.tp)}
  else if(a==='c'){A.c=v;sh.querySelectorAll('#acat [data-a=c]').forEach(x=>x.classList.toggle('on',x.dataset.v===v))}
  else if(a==='sug'){A.m=v;memo.value=v;const cc=b.dataset.c;if(A.k!=='t'&&!A.c&&cc&&P().cats.find(c=>c.code===cc&&c.inc===(A.k==='i'))){A.c=cc;$('#acat',sh).innerHTML=catSec()}sug()}
  else if(a==='day'){const n=new Date(),x=new Date(n);x.setDate(n.getDate()-(+v));A.t=x.getTime();when.value=new Date(A.t-new Date(A.t).getTimezoneOffset()*6e4).toISOString().slice(0,16);$('#adc',sh).innerHTML=dayChips()}
  else if(a==='rcp')$('#rcf',sh).click();
  else if(a==='rcx'){A.img='';$('#arc',sh).innerHTML=rcHtml()}
  else if(a==='save')saveAdd(false);
  else if(a==='again')saveAdd(true);
  else if(a==='del'){const id0=A.edit;closeSheet();delTx(id0)}};
 sh.addEventListener('input',e=>{if(e.target.id==='spl')A.sp=e.target.value});
 $('#rcf',sh).onchange=async e=>{const f=e.target.files[0];if(!f)return;try{A.img=await compressImg(f);$('#arc',sh).innerHTML=rcHtml()}catch(x){toast('Could not read that photo')}e.target.value=''};
 const aw=$('#awr',sh),on0=aw&&aw.querySelector('.on');if(on0)aw.scrollLeft=Math.max(0,on0.offsetLeft-16);
 paint();sug()}
function saveAdd(again){
 const a=calc(A.amt);if(!(a>0)){toast('Enter an amount');buzz();return}
 if(A.k==='t'){if(!A.to){toast('Choose where it goes');return}}else if(!A.c){toast('Pick a category');return}
 const t={id:A.edit||uid(),t:A.t,k:A.k,c:A.k==='t'?'TX':A.c,a:Math.round(a*100)/100,m:(A.m||'').trim(),w:A.w,to:A.k==='t'?A.to:''};if(A.img)t.img=A.img;
 if(A.edit){const i=P().txns.findIndex(x=>x.id===A.edit);P().txns[i]=t}else P().txns.push(t);
 if(A.tp&&!A.edit&&A.k!=='t')tOf().push({id:uid(),k:t.k,c:t.c,a:t.a,m:t.m,w:t.w});
 const wasEdit=!!A.edit;let dmade=[];let note='';if(!A.edit&&A.k==='e'&&A.sp){const nm=A.sp.split(',').map(x=>x.trim()).filter(Boolean).slice(0,8);if(nm.length){const sh2=Math.round(t.a/(nm.length+1)*100)/100;nm.forEach(n=>{const dd={id:uid(),who:n,k:'lent',a:sh2,t:t.t,due:0,m:t.m||cat(t.c).name,pay:[]};dOf().push(dd);dmade.push(dd.id)});note=`${nm.length===1?nm[0]+' owes':nm.length+' people owe'} you ${money(sh2)}${nm.length>1?' each':''}`}}
 let warn='';if(t.k==='e'&&!SYSC(t.c)&&t.c!=='SV'&&!rc()){const bud=P().bud||{},mk=mkey(t.t);const spent=f=>P().txns.filter(x=>x.k==='e'&&!SYSC(x.c)&&x.c!=='SV'&&mkey(x.t)===mk&&f(x)).reduce((q,x)=>q+x.a,0);const chk=(lim,v,nm)=>{if(!(lim>0))return;const f=v/lim;if(f>=1)warn=`Over your ${nm} limit by ${money(v-lim)}`;else if(f>=.8&&!warn)warn=`${Math.round(f*100)}% of your ${nm} limit used`};chk(bud[t.c],spent(x=>x.c===t.c),cat(t.c).name);chk(bud.ALL,spent(()=>true),'monthly')}
 dirty();buzz();
 if(again){const k=A.k,w=A.w;render();toast('Saved. Add the next one');closeSheet(true);openAdd(null,{k,w});return}
 closeSheet();okAnim();render();toast(warn||note||'Saved on this device ('+P().txns.length.toLocaleString()+' entries)',wasEdit?null:()=>{P().txns=P().txns.filter(x=>x.id!==t.id);if(dmade.length)P().debts=dOf().filter(x=>!dmade.includes(x.id));dirty();render()})}

function openDetail(t){
 const w=WM()[t.w]||{name:'?',cur:cur()},c=cat(t.k==='t'?'TX':t.c);const col=t.k==='t'?'#8e8e93':(COLORS[t.c]||'#8e8e93');const d=new Date(t.t);
 const amt=t.k==='t'?money(t.a,w.cur):money(t.k==='e'?-t.a:t.a,w.cur,true);const kind=t.k==='t'?'Transfer':t.k==='i'?LB().inc:LB().exp;
 const row=(a,b)=>`<div class="row"><div class="m"><span style="margin:0">${a}</span><b>${b}</b></div></div>`;
 sheet(`<div style="text-align:center;margin:8px 0 18px"><div class="tile" style="--c:${col};margin:0 auto 12px;width:58px;height:58px;border-radius:20px;font-size:18px">${esc(String(t.k==='t'?'TX':t.c).slice(0,2))}</div><div class="big ${t.k==='i'?'inc':t.k==='e'?'exp':''}" style="font-size:clamp(34px,10vw,46px);font-weight:800;letter-spacing:-1.5px;white-space:nowrap">${amt}</div><p class="sm" style="margin-top:6px">${esc(t.m||c.name)}</p></div>${t.img?`<img class="rpimg" src="${t.img}" alt="Receipt">`:''}<div class="card" style="background:var(--chip);box-shadow:none;border:0;padding:6px 18px">${row('Type',kind)}${t.k==='t'?'':row('Category',esc(c.name))}${row(t.k==='t'?'From':LB().w1,esc(w.name))}${t.k==='t'?row('To',esc((WM()[t.to]||{}).name||'?')):''}${row('Date',d.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})+' at '+d.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}))}${t.m?row('Memo',esc(t.m)):''}</div><div class="sticky"><button class="btn acc" id="de">${ico('edit',18)} Edit</button><button class="btn soft" id="dr">Repeat this entry</button><button class="btn soft" id="dtp">Save as quick template</button><button class="btn red" id="dd">Delete</button></div>`,sh=>{
  $('#de',sh).onclick=()=>{closeSheet(true);openAdd(t)};
  $('#dr',sh).onclick=()=>{closeSheet(true);openAdd(null,{k:t.k,w:t.w,to:t.to||'',c:t.c,m:t.m||'',amt:String(t.a),t:Date.now()})};
  $('#dtp',sh).onclick=()=>{if(t.k==='t'){toast('Transfers cannot be templates');return}tOf().push({id:uid(),k:t.k,c:t.c,a:t.a,m:t.m||'',w:t.w});dirty();closeSheet();render();toast('Saved as a quick template')};
  $('#dd',sh).onclick=()=>{closeSheet();delTx(t.id)}})}

function openWallet(w){
 const L=LB();
 if(!w){const defT=rc()?'savings':'bank';sheet(`<h2>New ${L.w1.toLowerCase()}</h2><div class="lbl"><span>Name</span></div><input class="field" id="wn" placeholder="${rc()?'e.g. Hollard Savings':'e.g. Fidelity Bank'}" maxlength="40" autocomplete="off"><div class="err" id="we"></div><div class="lbl" style="margin-top:16px"><span>Type</span></div><div class="cg" id="wt">${WTYPES.map(([k,v])=>`<button class="${k===defT?'on':''}" data-t="${k}" style="--c:var(--a1)"><div class="wic">${ico(k,20)}</div><span>${v}</span></button>`).join('')}</div><div class="lbl"><span>Currency</span></div><select class="field" id="wc">${CURS.map(c=>`<option ${c===cur()?'selected':''}>${c}</option>`).join('')}</select><div class="lbl" style="margin-top:16px"><span>Money already in it</span></div><input class="field" id="wo" inputmode="decimal" placeholder="0.00">${rc()?`<div class="lbl" style="margin-top:16px"><span>Goal (optional)</span></div><input class="field" id="wg" inputmode="decimal" placeholder="0.00">`:''}<div class="sticky"><button class="btn acc" id="wsave">Create ${L.w1.toLowerCase()}</button></div>`,sh=>{
  let type=defT;$('#wt',sh).onclick=e=>{const b=e.target.closest('[data-t]');if(!b)return;type=b.dataset.t;sh.querySelectorAll('#wt button').forEach(x=>x.classList.toggle('on',x===b))};
  $('#wsave',sh).onclick=()=>{const n=$('#wn',sh).value.trim();if(!cleanW(n)){$('#we',sh).textContent='Use 2 to 40 letters, numbers or spaces.';return}if(P().wallets.some(x=>x.name.toLowerCase()===n.toLowerCase())){$('#we',sh).textContent='You already have one with that name.';return}const o=parseFloat($('#wo',sh).value)||0;const g=rc()?(parseFloat($('#wg',sh).value)||0):0;P().wallets.push({id:uid(),name:n,type,cur:$('#wc',sh).value,open:o,goal:g});dirty();closeSheet();okAnim();render();toast('Created')}});return}
 const b=BAL()[w.id];
 sheet(`<h2>${esc(w.name)}</h2><p class="sm" style="margin:-8px 0 14px">${(WTYPES.find(t=>t[0]===w.type)||[])[1]} · ${w.cur}</p>${payCard(w,{tag:'div',attrs:'',stat:wflow(w,range('m').from),cls:'big'})}<div class="hs3" style="margin:14px 0 4px"><div><span>In this month</span><b class="inc">${compact(wflow(w,range('m').from).inn,w.cur)}</b></div><div><span>Out this month</span><b class="exp">${compact(wflow(w,range('m').from).out,w.cur)}</b></div><div><span>Entries</span><b>${P().txns.filter(t=>t.w===w.id||t.to===w.id).length}</b></div></div>
 <button class="btn acc" id="wadd">${ico('plus',18)} Add entry</button><button class="btn soft" id="wxf">Transfer money</button>
 <div class="lbl" style="margin-top:20px"><span>Set actual balance</span></div><input class="field" id="wb" inputmode="decimal" placeholder="${nf(b)}"><button class="btn soft" id="wset" style="margin-top:10px">Match this balance</button><p class="sm" style="margin:8px 4px 0">Adds one adjustment entry so the balance equals what is really there.</p>
 ${rc()?`<div class="lbl" style="margin-top:20px"><span>Goal</span></div><input class="field" id="wg" inputmode="decimal" value="${w.goal||''}" placeholder="0.00"><button class="btn soft" id="wgs" style="margin-top:10px">Save goal</button>`:''}
 <button class="btn soft" id="whd" style="margin-top:20px">${ico('eye',18)} ${w.hidden?'Show in totals again':'Hide from totals and lists'}</button><p class="sm" style="margin:8px 4px 0">A hidden ${L.w1.toLowerCase()} stays in History but is left out of totals and insights.</p>
 <div class="lbl" style="margin-top:20px"><span>Rename</span></div><input class="field" id="wr" value="${esc(w.name)}" maxlength="40"><button class="btn soft" id="wren" style="margin-top:10px">Save name</button><div class="err" id="we"></div>${P().wallets.length>1?`<button class="btn soft" id="wmg" style="margin-top:20px">Merge into another ${L.w1.toLowerCase()}</button><p class="sm" style="margin:8px 4px 0">Moves every entry and the opening balance into the one you pick, then removes this one.</p>`:''}<button class="btn red" id="wdel" style="margin-top:20px">Delete ${L.w1.toLowerCase()}</button>${PAD}`,sh=>{
  $('#wadd',sh).onclick=()=>{closeSheet(true);openAdd(null,{w:w.id})};
  $('#wxf',sh).onclick=()=>{closeSheet(true);openAdd(null,{w:w.id,k:'t'})};
  $('#wset',sh).onclick=()=>{const v=parseFloat($('#wb',sh).value);if(isNaN(v)){toast('Type the real balance');return}const d=Math.round((v-b)*100)/100;if(!d){toast('Already matches');return}P().txns.push({id:uid(),t:Date.now(),k:d>0?'i':'e',c:'AD',a:Math.abs(d),m:'Balance adjustment',w:w.id,to:''});dirty();closeSheet();okAnim();render()};
  $('#whd',sh).onclick=()=>{w.hidden=!w.hidden;dirty();closeSheet();render();toast(w.hidden?'Hidden':'Visible again')};
  const gs=$('#wgs',sh);if(gs)gs.onclick=()=>{w.goal=parseFloat($('#wg',sh).value)||0;dirty();closeSheet();render();toast('Goal saved')};
  $('#wren',sh).onclick=()=>{const n=$('#wr',sh).value.trim();if(!cleanW(n)){$('#we',sh).textContent='Use 2 to 40 letters, numbers or spaces.';return}if(P().wallets.some(x=>x.id!==w.id&&x.name.toLowerCase()===n.toLowerCase())){$('#we',sh).textContent='That name is taken.';return}w.name=n;dirty();closeSheet();render();toast('Renamed')};
  const mg=$('#wmg',sh);if(mg)mg.onclick=()=>{const o=P().wallets.filter(x=>x.id!==w.id);sheet(`<h2>Merge ${esc(w.name)} into</h2>${o.map(x=>`<button class="row" data-m="${x.id}"><div class="m"><b>${esc(x.name)}</b><span>${money(BAL()[x.id],x.cur)}</span></div></button>`).join('')}${PAD}`,s2=>{s2.onclick=e=>{const b=e.target.closest('[data-m]');if(!b)return;const tg=WM()[b.dataset.m];if(!tg||!confirm(`Move all of ${w.name} into ${tg.name}?`))return;P().txns.forEach(t=>{if(t.w===w.id)t.w=tg.id;if(t.to===w.id)t.to=tg.id});P().txns=P().txns.filter(t=>!(t.k==='t'&&t.w===t.to));tg.open=(tg.open||0)+(w.open||0);P().wallets=P().wallets.filter(x=>x.id!==w.id);_bal=_wm=_cm=null;dirty();closeSheet();okAnim();render();toast('Merged')}})};
  $('#wdel',sh).onclick=()=>{const n=P().txns.filter(t=>t.w===w.id||t.to===w.id).length;if(confirm(`Delete ${w.name} and its ${n} entries?`)){P().wallets=P().wallets.filter(x=>x.id!==w.id);P().txns=P().txns.filter(t=>t.w!==w.id&&t.to!==w.id);dirty();closeSheet();render();toast('Deleted')}}})}

function openProfiles(){
 const rows=S.profiles.map(q=>{const old=S.active;const tot=q.wallets.length;let bal=0;{const sv=S.active;S.active=q.id;_bal=_wm=_cm=null;const b=BAL();bal=q.wallets.filter(w=>w.cur===q.cur).reduce((s,w)=>s+b[w.id],0);S.active=sv;_bal=_wm=_cm=null}return`<div class="pfw"><button class="pf ${q.id===S.active?'on':''}" data-id="${q.id}" style="${q.kind==='records'?'--a1:#10b981;--a2:#14b8a6':''}"><i class="av">${esc(q.name.slice(0,1).toUpperCase())}</i><div class="m"><b>${esc(q.name)}</b><span>${q.kind==='records'?'Savings records':'Daily spending'} · ${tot} ${q.kind==='records'?'plans':'wallets'} · ${compact(bal,q.cur)}</span></div></button><button class="pfe" data-edit="${q.id}" aria-label="Rename">${ico('edit',18)}</button></div>`}).join('');
 sheet(`<h2>Profiles</h2>${rows}<button class="btn soft" id="np">${ico('plus',18)} New profile</button>${PAD}`,sh=>{sh.onclick=e=>{const ed=e.target.closest('[data-edit]');if(ed){openManage(S.profiles.find(q=>q.id===ed.dataset.edit));return}const b=e.target.closest('.pf');if(b){switchProfile(b.dataset.id);closeSheet();return}if(e.target.closest('#np'))openNewProfile()}})}
function switchProfile(id){if(id===S.active)return;S.active=id;PER=P().kind==='records'?'y':'m';H={q:'',f:'all',w:'all',n:120,m:'cur'};_bal=_wm=_cm=null;save();shell();if(TAB==='cats')TAB='settings';render();scrollTo(0,0)}
function openNewProfile(){
 sheet(`<h2>New profile</h2><div class="lbl"><span>Name</span></div><input class="field" id="pn" placeholder="e.g. Business" maxlength="24" autocomplete="off"><div class="err" id="pe"></div><div class="lbl" style="margin-top:16px"><span>Kind</span></div><div class="seg" id="pk"><button class="on" data-k="daily">Daily spending</button><button data-k="records">Savings records</button></div><p class="sm" style="margin:8px 4px 0">Daily spending tracks income and expenses. Savings records keeps a log of deposits into plans, like policies and savings accounts.</p><div class="lbl" style="margin-top:16px"><span>Currency</span></div><select class="field" id="pc">${CURS.map(c=>`<option ${c===cur()?'selected':''}>${c}</option>`).join('')}</select><div class="sticky"><button class="btn acc" id="pcr">Create profile</button></div>`,sh=>{
  let kind='daily';$('#pk',sh).onclick=e=>{const b=e.target.closest('[data-k]');if(!b)return;kind=b.dataset.k;sh.querySelectorAll('#pk button').forEach(x=>x.classList.toggle('on',x===b))};
  $('#pcr',sh).onclick=()=>{const n=$('#pn',sh).value.trim();if(!cleanOK(n)){$('#pe',sh).textContent='Use 2 to 24 letters or numbers.';return}if(S.profiles.some(p=>p.name.toLowerCase()===n.toLowerCase())){$('#pe',sh).textContent='That name is taken.';return}const p=newProfile(n,kind,$('#pc',sh).value);S.profiles.push(p);closeSheet(true);switchProfile(p.id);S.active=p.id;save();okAnim();toast('Profile created')}})}
function openManage(p){p=p||P();
 sheet(`<h2>${esc(p.name)}</h2><div class="lbl"><span>Rename</span></div><input class="field" id="rn" value="${esc(p.name)}" maxlength="24"><div class="err" id="re"></div><button class="btn soft" id="rs" style="margin-top:10px">Save name</button>${S.profiles.length>1?`<button class="btn red" id="rd" style="margin-top:20px">Delete this profile</button>`:'<p class="sm" style="margin-top:14px">You need at least one profile.</p>'}${PAD}`,sh=>{
  $('#rs',sh).onclick=()=>{const n=$('#rn',sh).value.trim();if(!cleanOK(n)){$('#re',sh).textContent='Use 2 to 24 letters or numbers.';return}if(S.profiles.some(q=>q!==p&&q.name.toLowerCase()===n.toLowerCase())){$('#re',sh).textContent='That name is taken.';return}p.name=n;dirty();closeSheet();render();toast('Renamed')};
  const rd=$('#rd',sh);if(rd)rd.onclick=()=>{if(confirm(`Delete ${p.name} with ${p.txns.length} entries? This cannot be undone.`)){S.profiles=S.profiles.filter(q=>q!==p);S.active=S.profiles[0].id;dirty();closeSheet(true);shell();setTab('settings');toast('Profile deleted')}}})}

/* ---------- CSV and backup ---------- */
function parseCSV(s){const rows=[];let r=[],f='',q=false;for(let i=0;i<s.length;i++){const c=s[i];if(q){if(c==='"'){if(s[i+1]==='"'){f+='"';i++}else q=false}else f+=c}else if(c==='"')q=true;else if(c===','){r.push(f);f=''}else if(c==='\n'||c==='\r'){if(c==='\r'&&s[i+1]==='\n')i++;r.push(f);f='';if(r.length>1||r[0]!=='')rows.push(r);r=[]}else f+=c}
 if(f!==''||r.length){r.push(f);rows.push(r)}return rows}
function mapCat(raw,inc,kind){const r=raw.trim().toLowerCase();const p=(...a)=>a.some(x=>r.startsWith(x));
 if(r==='transfer')return'TX';
 if(kind==='records'){if(inc){if(p('future'))return'FS';if(p('fee','school'))return'SF';if(p('rent','house'))return'HR';if(p('saving'))return'ST';if(p('invest'))return'IV';return'OD'}return p('withdraw')?'WD':'PN'}
 if(inc){if(p('salary','bonus'))return'SB';if(p('coupon','allowance'))return'AS';if(p('side','tips','dividend','invest'))return'SI';if(p('gift','award'))return'GC';if(p('loan','borrow'))return'LR';return'OI'}
 if(p('saving','emergency','future'))return'SV';if(p('big purchase','furniture'))return'BP';if(p('clothing','shopping','fitness','pet'))return'SC';if(p('grocer','food'))return'GR';if(p('entertainment','eating'))return'EO';if(p('support','gift'))return'FG';if(p('borrow','repay','lend'))return'DL';if(p('housing','utilit','bills','rent'))return'HB';if(p('transport','travel'))return'TR';if(p('data'))return'DS';if(p('health'))return'HI';if(p('education','learn'))return'LE';if(p('moves'))return'MM';return'FC'}
function parseDate(s){const m=/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})\s*(AM|PM)?$/i.exec(s.trim());if(m){let h=+m[4]%12;if((m[6]||'').toUpperCase()==='PM')h+=12;return new Date(+m[3],+m[1]-1,+m[2],h,+m[5]).getTime()}const t=Date.parse(s);return isNaN(t)?0:t}
function guessType(n,kind){n=n.toLowerCase();if(kind==='records'){return/prudential|hollard|master|invest|insur|trust|policy|pension/.test(n)?'invest':'savings'}if(/saving/.test(n))return'savings';if(/momo|mobile|mtn|vodafone|airtel|telecel|mpesa|m-pesa/.test(n))return'mobileMoney';if(/card|visa|master/.test(n))return'card';if(/cash/.test(n))return'cash';return'bank'}
function importInto(p,text){
 const rows=parseCSV(text.replace(/^﻿/,''));if(rows.length<2)return null;
 const h=rows[0].map(x=>x.trim().toLowerCase());const ix=k=>h.indexOf(k);
 const iD=ix('date'),iT=ix('type'),iC=ix('category'),iA=ix('amount'),iM=ix('memo'),iW=ix('wallet'),iCu=ix('currency');
 if([iD,iT,iC,iA,iW].some(i=>i<0))return null;
 const wasEmpty=!p.wallets.length;const wm={};p.wallets.forEach(w=>wm[w.name.toLowerCase()]=w);
 const key=t=>[Math.floor(t.t/1000),t.k,Math.round(t.a*100),t.m,t.w].join('|');
 const seen=new Set(p.txns.map(key));let added=0,skipped=0,bad=0;
 const nameMap={};p.cats.forEach(c=>nameMap[c.inc+'|'+c.name.toLowerCase()]=c.code);
 for(let n=1;n<rows.length;n++){const r=rows[n];if(r.length<h.length-1){bad++;continue}
  const t0=parseDate(r[iD]),amt=parseFloat(String(r[iA]).replace(/,/g,''));if(!t0||isNaN(amt)||!amt){bad++;continue}
  const inc=r[iT].trim().toLowerCase()==='income';const wn=((r[iW]||'').trim()||'Imported').slice(0,40);let w=wm[wn.toLowerCase()];
  if(!w){w={id:uid(),name:wn,type:guessType(wn,p.kind),cur:((iCu>=0&&r[iCu])||p.cur).trim()||p.cur,open:0,goal:0};p.wallets.push(w);wm[wn.toLowerCase()]=w}
  const raw=r[iC]||'';const code=nameMap[inc+'|'+raw.trim().toLowerCase()]||mapCat(raw,inc,p.kind);
  const t={id:uid(),t:t0,k:inc?'i':'e',c:code,a:Math.abs(amt),m:iM>=0?(r[iM]||'').trim():'',w:w.id,to:''};
  const k=key(t);if(seen.has(k)){skipped++;continue}seen.add(k);p.txns.push(t);added++}
 if(wasEmpty&&p.wallets[0])p.cur=p.wallets[0].cur;
 return{added,skipped,bad}}
function exportCSV(){
 const q=s=>'"'+String(s).replace(/"/g,'""')+'"';const p=n=>String(n).padStart(2,'0');
 const ds=ms=>{const d=new Date(ms);let h=d.getHours();const ap=h>=12?'PM':'AM';h=h%12||12;return`${p(d.getMonth()+1)}/${p(d.getDate())}/${d.getFullYear()} ${h}:${p(d.getMinutes())} ${ap}`};
 const L=['"Date","Type","Category","Amount","Currency","Memo","Wallet"'];const W=WM();
 for(const t of P().txns.slice().sort((a,b)=>b.t-a.t)){const w=W[t.w]||{name:'',cur:cur()};
  if(t.k==='t'){const to=W[t.to];L.push([q(ds(t.t)),q('Expense'),q('Transfer'),q('-'+t.a.toFixed(2)),q(w.cur),q(t.m),q(w.name)].join(','));if(to)L.push([q(ds(t.t)),q('Income'),q('Transfer'),q(t.a.toFixed(2)),q(to.cur),q(t.m),q(to.name)].join(','))}
  else L.push([q(ds(t.t)),q(t.k==='i'?'Income':'Expense'),q(cat(t.c).name),q((t.k==='i'?'':'-')+t.a.toFixed(2)),q(w.cur),q(t.m),q(w.name)].join(','))}
 return L.join('\n')}
async function shareFile(name,text,type){const f=new File([text],name,{type});
 try{if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f]});return}}catch(e){if(e&&e.name==='AbortError')return}
 const a=document.createElement('a');a.href=URL.createObjectURL(f);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
let _pf=null;
const readFile=f=>new Promise((res,rej)=>{if(f.text)return f.text().then(res,rej);const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsText(f)});
function pickFile(accept,cb){if(!_pf){_pf=document.createElement('input');_pf.type='file';_pf.style.cssText='position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0';document.body.appendChild(_pf)}
 _pf.accept='.json,.csv,application/json,text/csv,text/plain';_pf.value='';
 _pf.onchange=async()=>{const f=_pf.files&&_pf.files[0];if(!f)return;toast('Reading file...');try{cb(await readFile(f))}catch(e){toast('Could not read that file')}};_pf.click()}
function handleText(text){const t=text.trim();if(t.startsWith('{')){return restoreText(text)}const r=importInto(P(),text);if(!r){toast('That file does not look like a MoneyTrack CSV');return}dirty();okAnim();toast(`Added ${r.added.toLocaleString()}, skipped ${r.skipped.toLocaleString()} duplicates`);setTab(TAB==='settings'?'today':TAB)}
function doImport(){pickFile('*/*',handleText)}
function restoreText(text){let j;try{j=JSON.parse(text);if(!j||!Array.isArray(j.profiles)||!j.profiles.length)throw 0}catch(e){toast('That is not a MoneyTrack backup');return}
 const sum=j.profiles.map(p=>`<div class="row"><div class="m"><b>${esc(p.name||'Profile')}</b><span>${(p.wallets||[]).length} ${p.kind==='records'?'plans':'wallets'} · ${(p.txns||[]).length.toLocaleString()} entries</span></div></div>`).join('');
 sheet(`<h2>Restore this backup?</h2><p class="sm" style="margin:-6px 0 12px;line-height:1.5">This replaces your current profiles, wallets and entries. Your look and settings stay.</p><div class="card" style="background:var(--chip);box-shadow:none;border:0;padding:6px 16px">${sum}</div><div class="sticky"><button class="btn acc" id="rok">Replace my data</button><button class="btn soft" data-close>Cancel</button></div>`,sh=>{$('#rok',sh).onclick=()=>doRestoreNow(j)})}
function doRestoreNow(j){const keep=S.set;S=fix({v:2,profiles:j.profiles,active:j.active});S.set=Object.assign({theme:'auto'},keep);_bal=_wm=_cm=null;save();closeSheet(true);applyTheme();shell();TAB='today';render();okAnim();toast('Backup restored')}
function openRestore(){sheet(`<h2>Restore a backup</h2><p class="sm" style="margin:-6px 0 14px;line-height:1.5">Pick your MoneyTrack backup file. If the picker is slow or does not open, paste the backup text below instead.</p><button class="btn acc" id="rpick">Choose backup file</button><div class="lbl" style="margin-top:22px"><span>Or paste the backup text</span></div><textarea class="field" id="rpaste" rows="4" placeholder="Paste the contents of the backup file" style="resize:none"></textarea><button class="btn soft" id="rgo" style="margin-top:12px">Restore from pasted text</button>${PAD}`,sh=>{$('#rpick',sh).onclick=()=>pickFile('',t=>{closeSheet(true);handleText(t)});$('#rgo',sh).onclick=()=>{const t=$('#rpaste',sh).value.trim();if(!t){toast('Paste the backup text first');return}closeSheet(true);handleText(t)}})}
function doRestore(){openRestore()}

/* ---------- story ---------- */
function storyData(){const now=new Date();let a0=new Date(now.getFullYear(),now.getMonth(),1),a1=new Date(now.getFullYear(),now.getMonth()+1,1);let an=analyze(a0.getTime(),a1.getTime());const key=rc()?'earned':'spent';if(!an[key]){a0=new Date(now.getFullYear(),now.getMonth()-1,1);a1=new Date(now.getFullYear(),now.getMonth(),1);an=analyze(a0.getTime(),a1.getTime())}if(!an[key])return null;
 const p0=new Date(a0.getFullYear(),a0.getMonth()-1,1);const pv=analyze(p0.getTime(),a0.getTime());an.month=MONTHS[a0.getMonth()];an.prev=pv[key];an.dim=new Date(a0.getFullYear(),a0.getMonth()+1,0).getDate();an.m0=a0.getTime();return an}
function openStory(){
 const d=storyData();if(!d){toast(rc()?'Record a deposit first':'Add a few expenses first');return}const c=cur();const R=rc();
 const key=R?d.earned:d.spent;const diff=d.prev?(key-d.prev)/d.prev*100:null;const tc=d.cats[0];const name0=nameOf(tc.k);const col0=colorOf(tc.k);
 const days=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
 const slides=[];
 slides.push({g:'#3b82f6',h:`<h3>${R?'Saved in '+d.month:'Your '+d.month}</h3><div class="huge fit" data-cu="${key}" data-cur="${c}">${money(key)}</div><p>${R?`went into your plans across <b>${d.nEarn}</b> deposits.`:`was spent across <b>${d.count}</b> purchases.`}${diff===null?'':` That is <b>${Math.abs(diff).toFixed(0)}% ${diff>0?'more':'less'}</b> than the month before.`}</p>`});
 slides.push({g:col0,h:`<h3>${R?'Your biggest plan':'Your biggest category'}</h3><div class="ring1"><svg viewBox="0 0 42 42" width="170" height="170"><circle cx="21" cy="21" r="15.9155" stroke="var(--chip)"/><circle class="fg" style="--d:${(tc.v/key*100).toFixed(1)};stroke:${col0}" cx="21" cy="21" r="15.9155" pathLength="100" stroke-linecap="round"/></svg><div class="tile" style="--c:${col0}">${esc(R?name0.slice(0,2).toUpperCase():tc.k)}</div></div><div class="huge" style="font-size:38px;white-space:normal;letter-spacing:-1px">${esc(name0)}</div><p><b data-cu="${tc.v}" data-cur="${c}">${money(tc.v)}</b>, which is <b data-cu="${tc.v/key*100}" data-mode="pct">${Math.round(tc.v/key*100)}%</b> of the month.</p>`});
 if(!R&&d.cats.length>1){slides.push({g:'#6366f1',h:`<h3>Your top 5</h3><div style="margin-top:6px">${hbars(d.cats.slice(0,5).map(x=>({code:x.k,name:cat(x.k).name,v:x.v,c:'#fff',val:compact(x.v)})),d.cats[0].v)}</div><p>These five made up <b>${Math.round(d.cats.slice(0,5).reduce((a,x)=>a+x.v,0)/key*100)}%</b> of the month.</p>`})}
 if(R){const co=consistency();const mo=monthSeries(12);const bm=mo.reduce((b,m)=>m.inc>b.inc?m:b,mo[0]);const avg=co.n?mo.reduce((s,m)=>s+m.inc,0)/co.n:0;
  slides.push({g:'#10b981',h:`<h3>Your consistency</h3><div class="huge"><span data-cu="${co.streak}" data-mode="int">${co.streak}</span> <span style="font-size:.4em;color:var(--mut)">${co.streak===1?'month':'months'}</span></div><div class="dotsr">${mo.map((m,i)=>`<i class="${m.dep?'n':''}" style="--i:${i}"></i>`).join('')}</div><p>You deposited in <b>${co.n} of the last 12 months</b>. Green dots are months with a deposit.</p>`});
  slides.push({g:'#f59e0b',h:`<h3>Your best month</h3><div class="huge fit" data-cu="${bm.inc}" data-cur="${c}">${money(bm.inc)}</div><div class="bars" style="height:130px;margin-top:24px">${mo.map((m,i)=>`<div class="c ${m===bm?'hi':''}"><div class="p"><i style="--h:${Math.max(2,m.inc/(bm.inc||1)*100)}%;--i:${i};max-width:20px;background:${m===bm?'var(--a1)':'var(--chip)'}"></i></div><em>${m.l.slice(0,1)}</em></div>`).join('')}</div><p><b>${bm.l}</b> was your strongest month of the last twelve.</p>`});
  slides.push({g:'#6366f1',h:`<h3>If you keep this pace</h3><div class="huge fit" data-cu="${avg*12}" data-cur="${c}">${money(avg*12)}</div><p>That is about <b>${money(avg)}</b> a month, saved over the next twelve months.</p>`})}
 else{const wm=Math.max(...d.wd),wt=d.wd.indexOf(wm),net=d.earned-d.spent-d.saved;
  slides.push({g:'#8b5cf6',h:`<h3>Your spending day</h3><div class="huge">${days[wt]}s</div><div class="bars" style="height:140px;margin-top:26px">${d.wd.map((v,i)=>`<div class="c ${i===wt?'hi':''}"><div class="p"><i style="--h:${Math.max(2,v/wm*100)}%;--i:${i};max-width:30px;background:${i===wt?'var(--a1)':'var(--chip)'}"></i></div><em>${DOW[i]}</em></div>`).join('')}</div><p>Quietest day: <b>${days[d.wd.indexOf(Math.min(...d.wd))]}</b>.</p>`});
  slides.push({g:'#ec4899',h:`<h3>Your biggest purchase</h3><div class="huge fit" data-cu="${d.biggest.a}" data-cur="${c}">${money(d.biggest.a)}</div><p><b>${esc(d.biggest.m||cat(d.biggest.c).name)}</b> on ${new Date(d.biggest.t).toLocaleDateString('en-GB',{day:'numeric',month:'long'})}.</p>`});
  const flags=[];for(let i=0;i<d.dim;i++){const d0=d.m0+i*DAY;flags.push(d0<=Date.now()&&!d.days[d0])}
  slides.push({g:'#10b981',h:`<h3>Days you spent nothing</h3><div class="huge"><span data-cu="${d.nospend}" data-mode="int">${d.nospend}</span> <span style="font-size:.4em;color:var(--mut)">days</span></div><div class="dotsr">${flags.map((f,i)=>`<i class="${f?'n':''}" style="--i:${i}"></i>`).join('')}</div><p>Longest quiet run: <b>${d.best} ${d.best===1?'day':'days'}</b>. Green dots are no-spend days.</p>`});
  slides.push({g:net>=0?'#10b981':'#ef4444',h:`<h3>The bottom line</h3><div class="huge fit ${net>=0?'inc':'exp'}" data-cu="${net}" data-cur="${c}" data-pre="${net>=0?'+':''}">${money(net,c,true)}</div><p>You earned <b>${money(d.earned)}</b>, spent <b>${money(d.spent)}</b> and put <b>${money(d.saved)}</b> into savings in ${d.month}.</p>`})}
 slides.push({g:'#4f46e5',h:`<h3>That is a wrap</h3><div class="huge" style="font-size:46px;white-space:normal;line-height:1.1;letter-spacing:-1.5px">Keep it going.</div><p>Log things as they happen and next month's story gets even better.</p><button class="btn" data-s="x" style="margin-top:28px;background:#fff;color:#111">Done</button>`});
 const L=$('#layer');let i=0;
 L.innerHTML=`<div class="story"><div class="pb">${slides.map(()=>'<div><i></i></div>').join('')}</div><button class="ib g x" data-s="x">${ico('x',20)}</button><div class="sl" id="sl"></div></div>`;
 const st=$('.story',L);requestAnimationFrame(()=>st.classList.add('on'));
 const show=n=>{i=n;st.querySelectorAll('.pb div').forEach((b,k)=>{b.className=k<n?'d':k===n?'a':'';const x=b.firstChild;const cc=x.cloneNode();b.replaceChild(cc,x);cc.onanimationend=()=>{if(i===n)next()}});const sl=$('#sl',st);st.style.setProperty('--g',slides[n].g);sl.innerHTML=slides[n].h;play(sl)};
 const next=()=>{i<slides.length-1?show(i+1):close()};const prev=()=>show(Math.max(0,i-1));
 const close=()=>{st.classList.remove('on');setTimeout(()=>{L.innerHTML=''},350)};
 st.onclick=e=>{if(e.target.closest('[data-s=x]'))return close();e.clientX/innerWidth<.35?prev():next()};
 st.onpointerdown=()=>st.classList.add('paused');st.onpointerup=st.onpointercancel=()=>st.classList.remove('paused');
 show(0)}

/* ---------- events ---------- */
document.addEventListener('click',e=>{
 if(e.target.closest('[data-close]')){closeSheet();return}
 const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act,v=b.dataset.v,id=b.dataset.id;
 switch(a){
 case'tab':setTab(v);break;
 case'add':openAdd();break;
 case'edit':{const t=P().txns.find(x=>x.id===id);t&&openDetail(t);break}
 case'unhide':{const w=WM()[id];if(w){w.hidden=false;dirty();render()}break}
 case'wallet':openWallet(WM()[id]);break;
 case'newwallet':openWallet();break;
 case'story':openStory();break;
 case'profiles':openProfiles();break;
 case'newprofile':openNewProfile();break;
 case'manage':openManage(S.profiles.find(x=>x.id===id));break;
 case'switch':switchProfile(id);break;
 case'per':PER=v;render();break;
 case'flow':FLOW=v;render();break;
 case'incl':S.set.incl=!S.set.incl;dirty();render();break;
 case'catd':openCat(id);break;
 case'addflow':openAdd(null,{k:FLOW});break;
 case'cal':openCal();break;
 case'goal':openGoal(id);break;
 case'gadd':openGoalTx(id,'add');break;
 case'gout':openGoalTx(id,'out');break;
 case'gnew':openGoalForm();break;
 case'repeat':{const l=lastTx();l&&useTpl(l);break}
 case'tpl':{const t=tOf().find(x=>x.id===id);t&&useTpl(t);break}
 case'tpls':openTpls();break;
 case'dup':{const t=P().txns.find(x=>x.id===id);t&&openAdd(null,{k:t.k,w:t.w,to:t.to||'',c:t.c,m:t.m||'',amt:String(t.a),t:Date.now()});break}
 case'swdel':delTx(id);break;
 case'hide':S.set.hide=!S.set.hide;save();render();toast(S.set.hide?'Amounts hidden':'Amounts shown');break;
 case'report':openReport();break;
 case'debt':openDebt(id);break;
 case'dnew':openDebtForm();break;
 case'hfo':H.fo=!H.fo;render();break;
 case'hrc':H.r=!H.r;render();break;
 case'hclr':H.c='';H.min=0;H.max=0;H.r=false;render();break;
 case'subadd':{const t=P().txns.find(x=>x.id===id);if(t){const n=new Date();(P().rec=P().rec||[]).push({id:uid(),k:'e',c:t.c,a:t.a,w:t.w,m:t.m,day:new Date(t.t).getDate(),from:sd(Date.now()),last:n.getFullYear()+'-'+n.getMonth()});dirty();render();toast('Now tracked every month')}break}
 case'reset':openReset();break;
 case'refresh':hardRefresh();break;
 case'chkupd':checkUpdate(true);break;
 case'hday':H.d=H.d===+v?null:+v;H.n=120;render();break;
 case'hexport':hExport();break;
 case'pinset':pinSet();break;
 case'pinoff':pinOff();break;
 case'qa':openAdd(null,{k:v});break;
 case'budget':openBudget();break;
 case'recnew':openRec();break;
 case'recdel':if(confirm('Stop this recurring entry? Past entries stay.')){P().rec=(P().rec||[]).filter(r=>r.id!==id);dirty();render()}break;
 case'calclear':H.d=null;H.n=120;render();break;
 case'hsort':H.s=({new:'old',old:'big',big:'small',small:'new'})[H.s||'new'];H.n=120;render();break;
 case'afpick':afPick();break;
 case'afallow':afAllow();break;
 case'afstop':AFH=null;AFS='';idbSet('fh',null);render();break;
 case'hf':H.f=v;H.n=120;render();break;
 case'hw':H.w=v;H.n=120;render();break;
 case'hm':H.m=v==='all'?'all':+v;H.n=120;render();break;
 case'more':H.n+=120;$('#hl').innerHTML=histList();countUps($('#hl'));break;
 case'vibe':S.set.vibe=v;save();applyTheme();render();break;
 case'backupnow':doBackupNow();break;
 case'theme':S.set.theme=v;save();applyTheme();render();break;
 case'cats':setTab('cats');break;
 case'import':doImport();break;
 case'export':shareFile('MoneyTrack-'+P().name.replace(/\s+/g,'')+'.csv',exportCSV(),'text/csv');break;
 case'backup':doBackupNow();break;
 case'restore':doRestore();break;
 case'wipe':if(confirm(`Erase everything in ${P().name}? Back up first if you want a copy.`)&&confirm('Really erase it?')){const p=P();p.wallets=[];p.txns=[];dirty();setTab('today');toast('Erased')}break;
 case'newcat':{const inc=v==='i';sheet(`<h2>New category</h2><input class="field" id="cn" placeholder="e.g. Pets" maxlength="24"><div class="err" id="ce"></div><div class="sticky"><button class="btn acc" id="cs">Add</button></div>`,sh=>{$('#cs',sh).onclick=()=>{const n=$('#cn',sh).value.trim();if(!cleanOK(n)){$('#ce',sh).textContent='Use 2 to 24 letters or numbers.';return}if(P().cats.some(c=>c.name.toLowerCase()===n.toLowerCase())){$('#ce',sh).textContent='That category exists.';return}const base=n.replace(/[^A-Za-z0-9]/g,'').toUpperCase();let code=base.slice(0,2),k=2;while(P().cats.concat(SYS_CATS).some(c=>c.code===code))code=base.slice(0,1)+(k++);P().cats.push({code,name:n,inc});COLORS[code]=COLORS[code]||PAL[P().cats.length%PAL.length];dirty();closeSheet();render()}});break}
 }});
document.addEventListener('input',e=>{const id=e.target.id;if(id==='q'){H.q=e.target.value;H.n=120;histRefresh()}else if(id==='hmin'){H.min=parseFloat(e.target.value)||0;histRefresh()}else if(id==='hmax'){H.max=parseFloat(e.target.value)||0;histRefresh()}});document.addEventListener('change',e=>{if(e.target.id==='hfc'){H.c=e.target.value;histRefresh()}});
document.addEventListener('change',e=>{
 if(e.target.id==='curSel'){P().cur=e.target.value;dirty();toast('Currency set')}
 const c=e.target.dataset&&e.target.dataset.cat;if(c){const n=e.target.value.trim();const ce=$('#cerr');const cc=P().cats.find(x=>x.code===c);if(!cleanOK(n)){ce.textContent='Names use letters and numbers only, 2 to 24 characters.';e.target.value=cc.name;return}if(P().cats.some(x=>x.code!==c&&x.name.toLowerCase()===n.toLowerCase())){ce.textContent='That name is already used.';e.target.value=cc.name;return}cc.name=n;ce.textContent='';dirty();toast('Saved')}
});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'){if($('.story'))$('.story .x').click();else closeSheet()}
 if(SH&&A&&SH.querySelector('[data-a=save]')&&!/INPUT|SELECT/.test(document.activeElement.tagName)){if(/^[0-9.]$/.test(e.key)||e.key==='Backspace'){const k=e.key==='Backspace'?'del':e.key;const b=SH.querySelector(`[data-a=key][data-v="${k}"]`);b&&b.click()}else if(e.key==='Enter'){SH.querySelector('[data-a=save]').click()}}
});
let dp;addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;const el=$('#inst');if(el)el.innerHTML='<button class="btn acc" id="ib" style="margin-top:12px">Install app</button>'});
document.addEventListener('click',e=>{if(e.target.id==='ib'&&dp){dp.prompt();dp=null}});
addEventListener('resize',()=>fitAll(document));

/* ---------- boot ---------- */
PER=P().kind==='records'?'y':'m';runRec();applyTheme();shell();render();lockScreen();var HID=0;document.addEventListener('visibilitychange',()=>{if(document.hidden){HID=Date.now();return}if(S.set.pin&&HID&&Date.now()-HID>60000)lockScreen();if(runRec()&&TAB!=='settings')render()});
if('serviceWorker' in navigator&&location.protocol.startsWith('http')){const had=!!navigator.serviceWorker.controller;let rl=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(had&&!rl){rl=true;location.reload()}});addEventListener('load',()=>navigator.serviceWorker.register('sw.js').then(r=>r.update()).catch(()=>{}))}
addEventListener('load',()=>setTimeout(checkUpdate,1500));document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkUpdate()});
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
afInit();
try{if(!S.set.lq){S.set.lq=1;S.set.vibe='liquid';save();applyTheme()}}catch(e){}
const _ap=document.getElementById('app');if(_ap)_ap.addEventListener('scroll',()=>{const t=document.querySelector('.top');if(t)t.classList.toggle('stuck',_ap.scrollTop>6)},{passive:true});
try{const q=new URLSearchParams(location.search);if(q.get('tab')==='goals')setTab('goals');const ad=q.get('add');if(ad){setTimeout(()=>openAdd(null,{k:ad}),300)}if(q.has('add')||q.has('tab'))history.replaceState(null,'',location.pathname)}catch(e){}
window.__mt={restoreText,S:()=>S,P,importInto,render,setTab,save,dirty,switchProfile,exportCSV,load:()=>load(),shell};
})();
