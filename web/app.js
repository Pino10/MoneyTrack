(()=>{
'use strict';
const KEY='moneytrack.web.v1';
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4);
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const DOW=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const SYM={GHS:'GH₵',USD:'$',EUR:'€',GBP:'£',NGN:'₦',KES:'KSh',ZAR:'R',UGX:'USh',TZS:'TSh',XOF:'CFA',CAD:'C$',INR:'₹'};
const CURS=['GHS','USD','EUR','GBP','NGN','KES','ZAR','UGX','TZS','XOF','CAD','INR'];
const COLORS={SV:'#0a84ff',SG:'#bf5af2',FD:'#ff9f0a',FG:'#ff375f',HB:'#40c8e0',DL:'#ff453a',TR:'#30b455',SU:'#5e5ce6',HL:'#00b5ad',FM:'#8e8e93',SB:'#17a867',AS:'#32ade6',GC:'#ff6482',LR:'#ac8e68',TX:'#8e8e93',AD:'#8e8e93'};
const DEF_CATS=[
['SV','Savings',0],['SG','Shopping and Gadgets',0],['FD','Food and Dining',0],['FG','Family and Giving',0],['HB','Home and Bills',0],['DL','Debt and Loans',0],['TR','Transport and Travel',0],['SU','Subscriptions',0],['HL','Health and Learning',0],['FM','Fees and Misc',0],
['SB','Salary and Bonuses',1],['AS','Allowances and Side Income',1],['GC','Gifts and Contributions',1],['LR','Loans Received',1]
].map(a=>({code:a[0],name:a[1],inc:!!a[2]}));
const SYS_CATS=[{code:'TX',name:'Transfer',inc:false,sys:true},{code:'AD',name:'Adjustment',inc:false,sys:true}];
const IC={
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
back:'<path d="M15 5l-7 7 7 7"/>',
trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
play:'<path d="M8 5l11 7-11 7z" fill="currentColor"/>',
check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
search:'<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
del:'<path d="M21 5H9l-6 7 6 7h12z"/><path d="M13 9.5l4 5M17 9.5l-4 5"/>'
};
const ico=(n,s=22)=>`<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${IC[n]||''}</svg>`;
const WTYPES=[['bank','Bank account'],['card','Card'],['mobileMoney','Mobile money'],['cash','Cash at hand'],['savings','Savings']];

/* ---------- state ---------- */
function seed(){return{v:1,wallets:[],txns:[],cats:DEF_CATS.map(c=>({...c})),set:{theme:'auto',cur:'GHS'}}}
function load(){try{const j=JSON.parse(localStorage.getItem(KEY));if(j&&j.wallets&&j.txns){j.cats=j.cats||DEF_CATS.map(c=>({...c}));j.set=Object.assign({theme:'auto',cur:'GHS'},j.set);return j}}catch(e){}return seed()}
let S=load();
let saveT;
function save(){clearTimeout(saveT);saveT=setTimeout(()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){toast('Storage is full. Export a backup.')}},200)}
let _bal=null,_wm=null,_cm=null;
function dirty(){_bal=_wm=_cm=null;save()}
const WM=()=>_wm||(_wm=Object.fromEntries(S.wallets.map(w=>[w.id,w])));
const CM=()=>_cm||(_cm=Object.fromEntries(S.cats.concat(SYS_CATS).map(c=>[c.code,c])));
const cat=c=>CM()[c]||{code:c,name:c,inc:false};
function BAL(){if(_bal)return _bal;const b={};S.wallets.forEach(w=>b[w.id]=+w.open||0);for(const t of S.txns){if(t.k==='i'){if(t.w in b)b[t.w]+=t.a}else if(t.k==='e'){if(t.w in b)b[t.w]-=t.a}else{if(t.w in b)b[t.w]-=t.a;if(t.to in b)b[t.to]+=t.a}}return _bal=b}
const nf=n=>Math.abs(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const money=(n,cur,sign)=>{cur=cur||S.set.cur;return(n<0?'-':sign&&n>0?'+':'')+(SYM[cur]||cur+' ')+nf(n)};
const compact=(n,cur,sign)=>{cur=cur||S.set.cur;const a=Math.abs(n);const t=a>=1e6?(a/1e6).toFixed(2).replace(/\.?0+$/,'')+'M':a>=1e4?(a/1e3).toFixed(1).replace(/\.0$/,'')+'K':nf(a);return(n<0?'-':sign&&n>0?'+':'')+(SYM[cur]||cur+' ')+t};
const sd=d=>{d=new Date(d);d.setHours(0,0,0,0);return d.getTime()};
const DAY=864e5;

/* ---------- ui helpers ---------- */
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function toast(m){let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast glass';document.body.appendChild(t)}t.textContent=m;requestAnimationFrame(()=>t.classList.add('on'));clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('on'),2400)}
function buzz(){try{navigator.vibrate&&navigator.vibrate(12)}catch(e){}}
function okAnim(){const o=document.createElement('div');o.className='ok';o.innerHTML=`<div class="glass">${ico('check',54)}</div>`;document.body.appendChild(o);setTimeout(()=>o.remove(),1000)}
function fmtCU(v,mode,cur){if(mode==='num')return nf(v);if(mode==='compact')return compact(v,cur);if(mode==='csign')return compact(v,cur,true);if(mode==='int')return Math.round(v).toLocaleString('en-US');if(mode==='pct')return Math.round(v)+'%';return money(v,cur)}
function countUps(root){root.querySelectorAll('[data-cu]').forEach(el=>{const to=parseFloat(el.dataset.cu)||0,mode=el.dataset.mode,cur=el.dataset.cur;const pre=el.dataset.pre||'';if(reduce){el.textContent=pre+fmtCU(to,mode,cur);return}const t0=performance.now(),dur=1100;const f=now=>{const p=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-p,4);el.textContent=pre+fmtCU(to*e,mode,cur);if(p<1)requestAnimationFrame(f);else fit(el)};f(t0);requestAnimationFrame(f)})}
function fit(el){el.style.fontSize='';let n=0;while(el.scrollWidth>el.clientWidth+1&&n++<14){el.style.fontSize=(parseFloat(getComputedStyle(el).fontSize)*.92)+'px'}}
function fitAll(root){root.querySelectorAll('.fit').forEach(fit)}
function play(root){root.classList.remove('go');requestAnimationFrame(()=>requestAnimationFrame(()=>{root.classList.add('go');countUps(root);fitAll(root)}))}

/* ---------- theme ---------- */
function applyTheme(){const t=S.set.theme;const dark=t==='dark'||(t==='auto'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=dark?'dark':'light';const m=$('#tc');if(m)m.content=dark?'#000000':'#ffffff'}
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',applyTheme);

/* ---------- analytics ---------- */
const inCur=t=>{const w=WM()[t.w];return !w||w.cur===S.set.cur};
const isSpend=t=>t.k==='e'&&t.c!=='TX'&&t.c!=='AD'&&inCur(t);
const isEarn=t=>t.k==='i'&&t.c!=='TX'&&t.c!=='AD'&&inCur(t);
function range(p){const now=new Date(),td=sd(now);let from,to=td+DAY;
 if(p==='m')from=new Date(now.getFullYear(),now.getMonth(),1).getTime();
 else if(p==='q')from=td-89*DAY;
 else if(p==='y')from=new Date(now.getFullYear(),0,1).getTime();
 else{from=S.txns.length?sd(Math.min(...S.txns.map(t=>t.t))):td-29*DAY}
 return{from,to}}
function analyze(from,to){
 const sp=[],ea=[];for(const t of S.txns){if(t.t<from||t.t>=to)continue;if(isSpend(t))sp.push(t);else if(isEarn(t))ea.push(t)}
 const spent=sp.reduce((s,t)=>s+t.a,0),earned=ea.reduce((s,t)=>s+t.a,0);
 const byCat={};sp.forEach(t=>byCat[t.c]=(byCat[t.c]||0)+t.a);
 const cats=Object.entries(byCat).map(([c,v])=>({c,v})).sort((a,b)=>b.v-a.v);
 const wd=Array(7).fill(0);sp.forEach(t=>{const d=(new Date(t.t).getDay()+6)%7;wd[d]+=t.a});
 const days={};sp.forEach(t=>{const k=sd(t.t);days[k]=(days[k]||0)+t.a});
 const last=Math.min(to,sd(Date.now())+DAY);const nDays=Math.max(1,Math.round((last-from)/DAY));
 let nospend=0,streak=0,best=0;const flags=[];
 for(let d=from;d<last;d+=DAY){const z=!days[d];flags.push(z);if(z){nospend++;streak++;best=Math.max(best,streak)}else streak=0}
 let bigDay=null;Object.entries(days).forEach(([k,v])=>{if(!bigDay||v>bigDay.v)bigDay={k:+k,v}});
 const small=sp.filter(t=>t.a<100);
 const memos={};sp.forEach(t=>{const m=(t.m||'').trim().toLowerCase();if(!m)return;const o=memos[m]||(memos[m]={m:t.m.trim(),v:0,n:0});o.v+=t.a;o.n++});
 const topMemos=Object.values(memos).sort((a,b)=>b.v-a.v).slice(0,5);
 const biggest=sp.reduce((b,t)=>!b||t.a>b.a?t:b,null);
 return{spent,earned,cats,wd,nDays,nospend,best,flags,bigDay,smallN:small.length,smallPct:sp.length?small.length/sp.length*100:0,smallSpendPct:spent?small.reduce((s,t)=>s+t.a,0)/spent*100:0,count:sp.length,topMemos,biggest,avg:spent/nDays,from,last}}
function monthly(n){const now=new Date();const out=[];for(let i=n-1;i>=0;i--){const a=new Date(now.getFullYear(),now.getMonth()-i,1),b=new Date(now.getFullYear(),now.getMonth()-i+1,1);const r=analyze(a.getTime(),b.getTime());out.push({l:MONTHS[a.getMonth()].slice(0,3),inc:r.earned,exp:r.spent})}return out}
function cumulative(){const now=new Date(),y=now.getFullYear(),m=now.getMonth();const dim=new Date(y,m+1,0).getDate();const cur=Array(dim).fill(0),prv=Array(dim).fill(0);const a=new Date(y,m,1).getTime(),b=new Date(y,m+1,1).getTime(),pa=new Date(y,m-1,1).getTime();for(const t of S.txns){if(!isSpend(t))continue;if(t.t>=a&&t.t<b)cur[new Date(t.t).getDate()-1]+=t.a;else if(t.t>=pa&&t.t<a){const d=new Date(t.t).getDate()-1;if(d<dim)prv[d]+=t.a}}
 for(let i=1;i<dim;i++){cur[i]+=cur[i-1];prv[i]+=prv[i-1]}const td=now.getDate();return{cur:cur.slice(0,td),prv,dim}}

/* ---------- views ---------- */
let TAB='today',PER='m',H={q:'',f:'all',w:'all',n:60};
const view=()=>$('#view');
function shell(){
 const tabs=[['today','Today','home'],['wallets','Wallets','wallet'],['insights','Insights','chart'],['history','History','list']];
 $('#app').innerHTML=`<aside class="side"><h2>MoneyTrack</h2>${tabs.map(t=>`<button class="t" data-act="tab" data-v="${t[0]}">${ico(t[2])}${t[1]}</button>`).join('')}<button class="t" data-act="tab" data-v="settings">${ico('gear')}Settings</button><button class="btn" data-act="add">${ico('plus',20)} New entry</button></aside>
 <main id="view"></main>
 <nav class="tabbar glass"><button class="t" data-act="tab" data-v="today">${ico('home')}Today</button><button class="t" data-act="tab" data-v="wallets">${ico('wallet')}Wallets</button><button class="fab" data-act="add" aria-label="New entry">${ico('plus',28)}</button><button class="t" data-act="tab" data-v="insights">${ico('chart')}Insights</button><button class="t" data-act="tab" data-v="history">${ico('list')}History</button></nav>`}
function setTab(t){TAB=t;document.querySelectorAll('[data-act=tab]').forEach(b=>b.classList.toggle('on',b.dataset.v===t));render();scrollTo(0,0)}
function render(){const v=view();if(!v)return;const f={today:vToday,wallets:vWallets,insights:vInsights,history:vHistory,settings:vSettings,cats:vCats}[TAB];v.innerHTML=f();play(v)}
const hd=(sub,title,acts)=>`<div class="hd rise"><div style="min-width:0">${sub?`<small>${sub}</small>`:''}<h1>${title}</h1></div><div class="acts">${acts||''}</div></div>`;
const gearBtn=`<button class="ib" data-act="tab" data-v="settings" aria-label="Settings">${ico('gear',20)}</button>`;

function txRow(t,i){const w=WM()[t.w],c=cat(t.k==='t'?'TX':t.c);let title,sub,amt,cls,code=t.c;
 const tm=new Date(t.t).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});
 if(t.k==='t'){title=t.m||'Transfer';sub=`${esc(w?w.name:'?')} to ${esc((WM()[t.to]||{}).name||'?')} · ${tm}`;amt=money(t.a,w&&w.cur);cls='';code='TX'}
 else{title=t.m||c.name;sub=`${esc(c.name)} · ${esc(w?w.name:'')} · ${tm}`;amt=money(t.k==='e'?-t.a:t.a,w&&w.cur,true);cls=t.k==='e'?'':'inc'}
 return`<button class="row rise" style="--i:${Math.min(i||0,8)}" data-act="edit" data-id="${t.id}"><div class="tile" style="--c:${COLORS[code]||'#8e8e93'}">${esc(code.slice(0,2))}</div><div class="m"><b>${esc(title)}</b><span>${sub}</span></div><div class="r ${cls}">${amt}</div></button>`}

function vToday(){
 const now=new Date(),h=now.getHours();const g=h<12?'Good morning':h<18?'Good afternoon':'Good evening';
 const date=now.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});
 if(!S.wallets.length)return hd(date,g,gearBtn)+`<div class="card empty rise" style="--i:1"><h2>Welcome to MoneyTrack</h2><p>Your data stays on this device. Create a wallet to start, or bring in your CSV export.</p><button class="btn acc" data-act="newwallet">${ico('wallet',20)} Create a wallet</button><button class="btn soft" data-act="import">Import CSV</button></div>`;
 const b=BAL();const cur=S.set.cur;const total=S.wallets.filter(w=>w.cur===cur).reduce((s,w)=>s+b[w.id],0);
 const ms=range('m'),a=analyze(ms.from,ms.to);const mx=Math.max(a.spent,a.earned,1);
 const cu=cumulative();const rec=S.txns.slice().sort((x,y)=>y.t-x.t).slice(0,6);
 return hd(date,g,`<button class="ib" data-act="story" aria-label="Story">${ico('play',18)}</button>${gearBtn}`)+
 `<div class="card glass hero rise" style="--i:1"><div class="lbl">Total balance</div><div class="big fit"><small>${esc(SYM[cur]||cur)}</small><span data-cu="${total}" data-mode="num" id="tot">${nf(total)}</span></div>
 <div class="duo"><div><div class="sm">In this month</div><div class="v inc" data-cu="${a.earned}" data-cur="${cur}">${money(a.earned)}</div><div class="track"><i style="--w:${a.earned/mx*100}%;background:var(--inc)"></i></div></div><div><div class="sm">Out this month</div><div class="v exp" data-cu="${a.spent}" data-cur="${cur}">${money(a.spent)}</div><div class="track"><i style="--w:${a.spent/mx*100}%;background:var(--exp)"></i></div></div></div></div>
 <div class="strip rise" style="--i:2">${S.wallets.map(w=>`<button class="wc" data-act="wallet" data-id="${w.id}"><div class="t"><div class="wic">${ico(w.type,18)}</div><span>${esc(w.name)}</span></div><div class="a" data-cu="${b[w.id]}" data-cur="${w.cur}">${money(b[w.id],w.cur)}</div></button>`).join('')}<button class="wc" data-act="newwallet" style="display:grid;place-items:center;color:var(--mut);flex-basis:110px">${ico('plus',26)}<span class="sm">Wallet</span></button></div>
 <div class="card rise" style="--i:3"><div class="lbl">Spending pace<span class="sm">${MONTHS[now.getMonth()]}</span></div>${lineSvg(cu)}</div>
 <button class="story-card rise" style="--i:4" data-act="story"><div class="pl">${ico('play',20)}</div><div><b>Your ${MONTHS[now.getMonth()]} story</b><span>Six quick slides about your money</span></div></button>
 <div class="card rise" style="--i:5"><div class="lbl">Recent<b data-act="tab" data-v="history">See all</b></div>${rec.length?rec.map((t,i)=>txRow(t,i)).join(''):'<p class="sm" style="padding:10px 0">No entries yet. Tap + to add one.</p>'}</div>`}

function lineSvg(cu){const W=320,Hh=96,max=Math.max(1,...cu.cur,...cu.prv);const X=i=>i/(cu.dim-1)*W,Y=v=>Hh-6-(v/max)*(Hh-14);
 const p=(arr)=>arr.map((v,i)=>(i?'L':'M')+X(i).toFixed(1)+' '+Y(v).toFixed(1)).join(' ');
 const curP=cu.cur.length>1?p(cu.cur):'M0 '+Y(0)+' L1 '+Y(cu.cur[0]||0);
 const last=cu.cur.length-1;const area=cu.cur.length>1?curP+` L${X(last)} ${Hh} L0 ${Hh}Z`:'';
 return`<svg class="line" viewBox="0 0 ${W} ${Hh}" width="100%" style="display:block;overflow:visible"><defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a84ff" stop-opacity=".28"/><stop offset="1" stop-color="#0a84ff" stop-opacity="0"/></linearGradient></defs><path class="pv" d="${p(cu.prv)}"/>${area?`<path class="ar" d="${area}"/>`:''}<path class="ln" pathLength="1" d="${curP}"/>${cu.cur.length?`<circle cx="${X(last)}" cy="${Y(cu.cur[last])}" r="4.5" fill="#0a84ff"/>`:''}</svg><div class="sm" style="display:flex;justify-content:space-between;margin-top:8px"><span>Solid: this month</span><span>Dashed: last month</span></div>`}

function vWallets(){
 const b=BAL();const a=range('m');const an=analyze(a.from,a.to);
 return hd('Where your money lives','Wallets',`<button class="ib" data-act="newwallet" aria-label="New wallet">${ico('plus',20)}</button>`)+
 (S.wallets.length?`<div class="cols"><div>${S.wallets.map((w,i)=>{let inn=0,out=0;for(const t of S.txns){if(t.t<a.from)continue;if(t.k==='i'&&t.w===w.id&&t.c!=='AD')inn+=t.a;else if(t.k==='e'&&t.w===w.id&&t.c!=='AD')out+=t.a;else if(t.k==='t'){if(t.w===w.id)out+=t.a;if(t.to===w.id)inn+=t.a}}const mx=Math.max(inn,out,1);
  return`<button class="card rise" style="--i:${i+1};display:block;width:100%;text-align:left" data-act="wallet" data-id="${w.id}"><div class="t" style="display:flex;align-items:center;gap:12px;margin-bottom:18px"><div class="wic">${ico(w.type,20)}</div><div style="min-width:0;flex:1"><b style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(w.name)}</b><span class="sm">${(WTYPES.find(t=>t[0]===w.type)||[])[1]} · ${w.cur}</span></div></div><div class="big fit" style="font-size:34px" data-cu="${b[w.id]}" data-cur="${w.cur}">${money(b[w.id],w.cur)}</div><div class="duo"><div><div class="sm">In</div><div class="track"><i style="--w:${inn/mx*100}%;background:var(--inc)"></i></div></div><div><div class="sm">Out</div><div class="track"><i style="--w:${out/mx*100}%;background:var(--exp)"></i></div></div></div></button>`}).join('')}</div></div>`:
 `<div class="card empty rise"><h2>No wallets yet</h2><p>Add a bank account, card, mobile money, cash or savings.</p><button class="btn acc" data-act="newwallet">Create a wallet</button></div>`)}

function vInsights(){
 const r=range(PER),a=analyze(r.from,r.to),cur=S.set.cur;
 const labels={m:'This month',q:'90 days',y:'This year',a:'All time'};
 const mo=monthly(12),mm=Math.max(1,...mo.map(m=>Math.max(m.inc,m.exp)));
 const wdm=Math.max(1,...a.wd),wdTop=a.wd.indexOf(Math.max(...a.wd)),wdLow=a.wd.indexOf(Math.min(...a.wd));
 let start=0;const tot=a.spent||1;const top=a.cats.slice(0,6);const rest=a.cats.slice(6).reduce((s,c)=>s+c.v,0);const segs=top.concat(rest?[{c:'FM',v:rest,other:true}]:[]);
 const donut=segs.map((s,i)=>{const pct=s.v/tot*100;const o=`<circle class="seg" style="--d:${pct.toFixed(2)};--i:${i};stroke:${s.other?'#8e8e93':COLORS[s.c]};stroke-dashoffset:${(-start).toFixed(2)}" cx="21" cy="21" r="15.9155"/>`;start+=pct;return o}).join('');
 const net=a.earned-a.spent;
 return hd('How you spend','Insights',gearBtn)+
 `<div class="seg rise" style="margin-bottom:14px;--i:1">${Object.entries(labels).map(([k,v])=>`<button class="${PER===k?'on':''}" data-act="per" data-v="${k}">${v}</button>`).join('')}</div>
 <div class="kpis rise" style="--i:2"><div class="card"><div class="sm">Spent</div><b class="exp fit" data-cu="${a.spent}" data-mode="compact" data-cur="${cur}">${compact(a.spent)}</b></div><div class="card"><div class="sm">Earned</div><b class="inc fit" data-cu="${a.earned}" data-mode="compact" data-cur="${cur}">${compact(a.earned)}</b></div><div class="card"><div class="sm">Net</div><b class="fit ${net>=0?'inc':'exp'}" data-cu="${net}" data-mode="csign" data-cur="${cur}">${compact(net,cur,true)}</b></div></div>
 <div class="cols"><div>
 <div class="card rise" style="--i:3"><div class="lbl">Last 12 months<span class="sm">in vs out</span></div><div class="bars">${mo.map((m,i)=>`<div class="c ${i===11?'hi':''}"><div class="p"><i style="--h:${m.inc/mm*100}%;--i:${i};background:var(--inc)"></i><i style="--h:${m.exp/mm*100}%;--i:${i};background:var(--exp)"></i></div><em>${m.l}</em></div>`).join('')}</div></div>
 <div class="card rise" style="--i:4"><div class="lbl">Where it goes</div>${a.cats.length?`<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;justify-content:center"><div class="donut"><svg viewBox="0 0 42 42"><circle cx="21" cy="21" r="15.9155" stroke="var(--surf2)"/>${donut}</svg><div class="mid"><span class="sm">Spent</span><b data-cu="${a.spent}" data-mode="compact" data-cur="${cur}" class="fit" style="max-width:90px;overflow:hidden;white-space:nowrap">${compact(a.spent)}</b></div></div><div class="leg" style="min-width:160px">${segs.map(s=>{const c=cat(s.c);return`<div class="row" style="--c:${s.other?'#8e8e93':COLORS[s.c]}"><i></i><span class="n">${s.other?'Other':esc(c.name)}</span><span class="v">${Math.round(s.v/tot*100)}%</span></div>`}).join('')}</div></div>`:'<p class="sm">No spending in this period.</p>'}</div>
 </div><div>
 <div class="card rise" style="--i:5"><div class="lbl">By weekday${a.spent?`<span class="sm">Most on ${DOW[wdTop]}, least on ${DOW[wdLow]}</span>`:''}</div><div class="bars" style="height:120px">${a.wd.map((v,i)=>`<div class="c ${i===wdTop&&a.spent?'hi':''}"><div class="p"><i style="--h:${v/wdm*100}%;--i:${i};background:${i===wdTop&&a.spent?'var(--acc)':'var(--surf2)'};max-width:26px"></i></div><em>${DOW[i]}</em></div>`).join('')}</div></div>
 <div class="rise" style="--i:6"><div class="lbl" style="margin:6px 4px 10px">Your habits</div><div class="hab">
 <div><span>No-spend days</span><b data-cu="${a.nospend}" data-mode="int">${a.nospend}</b><span>of ${a.nDays} days. Best run: ${a.best}</span></div>
 <div><span>Daily average</span><b class="fit" data-cu="${a.avg}" data-mode="compact" data-cur="${cur}">${compact(a.avg)}</b><span>${a.count} purchases in total</span></div>
 <div><span>Small purchases</span><b data-cu="${a.smallPct}" data-mode="pct">${Math.round(a.smallPct)}%</b><span>of purchases are under ${SYM[cur]||cur}100 but make up only ${a.smallSpendPct.toFixed(1)}% of spending</span></div>
 <div><span>Heaviest day</span><b class="fit" data-cu="${a.bigDay?a.bigDay.v:0}" data-mode="compact" data-cur="${cur}">${a.bigDay?compact(a.bigDay.v):'None'}</b><span>${a.bigDay?new Date(a.bigDay.k).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}):''}</span></div></div></div>
 <div class="card rise" style="--i:7;margin-top:14px"><div class="lbl">Top repeat spends</div>${a.topMemos.length?a.topMemos.map(m=>`<div class="row"><div class="m"><b>${esc(m.m)}</b><span>${m.n} ${m.n===1?'time':'times'}</span></div><div class="r">${money(m.v)}</div></div>`).join(''):'<p class="sm">Nothing yet.</p>'}</div>
 </div></div>`}

function vHistory(){
 return hd('Everything you logged','History',gearBtn)+
 `<div class="search rise" style="--i:1">${ico('search',18)}<input class="field" id="q" placeholder="Search memo or category" value="${esc(H.q)}"></div>
 <div class="chips rise" style="margin-bottom:6px;--i:2">${[['all','All'],['e','Expenses'],['i','Income'],['t','Transfers']].map(([k,v])=>`<button class="chip ${H.f===k?'on':''}" data-act="hf" data-v="${k}">${v}</button>`).join('')}${S.wallets.length>1?`<button class="chip ${H.w==='all'?'on':''}" data-act="hw" data-v="all">All wallets</button>`+S.wallets.map(w=>`<button class="chip ${H.w===w.id?'on':''}" data-act="hw" data-v="${w.id}">${esc(w.name)}</button>`).join(''):''}</div>
 <div id="hl" class="rise" style="--i:3">${histList()}</div>`}
function histList(){
 const q=H.q.trim().toLowerCase();
 let L=S.txns.filter(t=>(H.f==='all'||t.k===H.f)&&(H.w==='all'||t.w===H.w||t.to===H.w)&&(!q||(t.m||'').toLowerCase().includes(q)||cat(t.c).name.toLowerCase().includes(q)||String(t.a).includes(q)));
 L.sort((a,b)=>b.t-a.t);const total=L.length;L=L.slice(0,H.n);
 if(!total)return'<p class="sm" style="text-align:center;padding:40px 0">Nothing found.</p>';
 let out='',cur='',dayTot=0;const groups=[];
 for(const t of L){const k=sd(t.t);if(!groups.length||groups[groups.length-1].k!==k)groups.push({k,items:[]});groups[groups.length-1].items.push(t)}
 const td=sd(Date.now());
 out=groups.map(g=>{const net=g.items.reduce((s,t)=>s+(t.k==='i'?t.a:t.k==='e'?-t.a:0),0);const lab=g.k===td?'Today':g.k===td-DAY?'Yesterday':new Date(g.k).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',year:new Date(g.k).getFullYear()===new Date().getFullYear()?undefined:'numeric'});return`<div class="day"><span>${lab}</span><span>${net?money(net,undefined,true):''}</span></div>${g.items.map(t=>txRow(t,0).replace(' rise','')).join('')}`}).join('');
 if(total>L.length)out+=`<button class="btn soft" style="margin-top:18px" data-act="more">Show more (${total-L.length} left)</button>`;
 return out}

function vSettings(){
 const st=S.set;
 return hd('Make it yours','Settings')+
 `<div class="card rise" style="--i:1"><div class="lbl">Appearance</div><div class="seg">${[['auto','Auto'],['light','White'],['dark','Dark']].map(([k,v])=>`<button class="${st.theme===k?'on':''}" data-act="theme" data-v="${k}">${v}</button>`).join('')}</div></div>
 <div class="card rise" style="--i:2"><div class="lbl">Main currency</div><select class="field" id="curSel">${CURS.map(c=>`<option ${c===st.cur?'selected':''}>${c}</option>`).join('')}</select><p class="sm" style="margin-top:8px">Totals and insights count wallets in this currency.</p></div>
 <div class="card set rise" style="--i:3"><div class="lbl">Data</div>
 <button class="row" data-act="cats"><div class="m"><b>Categories</b><span>Rename or add. Letters and numbers only</span></div>${ico('back',18).replace('<svg','<svg style="transform:rotate(180deg)"')}</button>
 <button class="row" data-act="import"><div class="m"><b>Import CSV</b><span>Same format as your old app export. Duplicates are skipped</span></div></button>
 <button class="row" data-act="export"><div class="m"><b>Export CSV</b><span>${S.txns.length.toLocaleString()} entries, a full backup</span></div></button>
 <button class="row" data-act="wipe"><div class="m"><b class="exp">Erase everything</b><span>Removes all wallets and entries from this device</span></div></button></div>
 <div class="card rise" style="--i:4"><div class="lbl">Install</div><p class="sm" style="line-height:1.5">iPhone: open in Safari, tap Share, then Add to Home Screen.<br>Android: open in Chrome, tap the menu, then Install app.<br>Your data is stored only on this device. Export a CSV now and then as a backup.</p><div id="inst"></div></div>`}

function vCats(){
 const row=c=>`<div class="cr"><div class="tile" style="--c:${COLORS[c.code]||'#8e8e93'};width:38px;height:38px;border-radius:13px">${esc(c.code)}</div><input class="field" data-cat="${esc(c.code)}" value="${esc(c.name)}" maxlength="24"></div>`;
 return`<div class="hd rise"><div style="min-width:0"><h1>Categories</h1></div><div class="acts"><button class="ib" data-act="tab" data-v="settings">${ico('back',20)}</button></div></div>
 <div class="card rise" style="--i:1"><div class="lbl">Expenses</div>${S.cats.filter(c=>!c.inc).map(row).join('')}<button class="btn soft" data-act="newcat" data-v="e" style="margin-top:8px">Add expense category</button></div>
 <div class="card rise" style="--i:2"><div class="lbl">Income</div>${S.cats.filter(c=>c.inc).map(row).join('')}<button class="btn soft" data-act="newcat" data-v="i" style="margin-top:8px">Add income category</button></div>
 <p class="sm" id="cerr" style="padding:0 6px"></p>`}

/* ---------- sheets ---------- */
let SH=null;
function sheet(html,mount){closeSheet(true);const L=$('#layer');L.innerHTML=`<div class="scrim"></div><div class="sheet" role="dialog"><div class="grab"></div>${html}</div>`;const sc=$('.scrim',L),sh=$('.sheet',L);sc.onclick=()=>closeSheet();SH=sh;requestAnimationFrame(()=>requestAnimationFrame(()=>{sc.classList.add('on');sh.classList.add('on')}));mount&&mount(sh);return sh}
function closeSheet(now){const L=$('#layer');const sc=$('.scrim',L),sh=$('.sheet',L);SH=null;if(!sh)return;if(now){L.innerHTML='';return}sc.classList.remove('on');sh.classList.remove('on');setTimeout(()=>{if(!SH)L.innerHTML=''},420)}
const cleanOK=s=>/^[A-Za-z0-9][A-Za-z0-9 ]{1,23}$/.test(s.trim());

let A=null;
function openAdd(t,pre){
 const d=new Date();const defW=S.wallets[0]&&S.wallets[0].id;
 A=t?{edit:t.id,k:t.k,amt:String(t.a),w:t.w,to:t.to||'',c:t.c,m:t.m||'',t:t.t}:Object.assign({edit:null,k:'e',amt:'',w:defW,to:'',c:'',m:'',t:d.getTime()},pre||{});
 if(!S.wallets.length){toast('Create a wallet first');TAB='wallets';setTab('wallets');return openWallet()}
 sheet(addHtml(),mountAdd)}
function addHtml(){
 const cs=S.cats.filter(c=>c.inc===(A.k==='i'));
 const dt=new Date(A.t-new Date(A.t).getTimezoneOffset()*6e4).toISOString().slice(0,16);
 const w=WM()[A.w];
 return`<h2>${A.edit?'Edit entry':'New entry'}</h2>
 <div class="seg" style="margin-bottom:6px">${[['e','Expense'],['i','Income'],['t','Transfer']].map(([k,v])=>`<button class="${A.k===k?'on':''}" data-a="k" data-v="${k}">${v}</button>`).join('')}</div>
 <div class="amt"><div class="big"><span id="amtv" class="${A.k==='i'?'inc':A.k==='e'?'exp':''}">${esc(SYM[(w||{}).cur||S.set.cur]||'')}${A.amt||'0'}</span></div><small id="amtn"></small></div>
 <div class="kp">${[1,2,3,4,5,6,7,8,9,'.',0,'del'].map(k=>`<button data-a="key" data-v="${k}" aria-label="${k}">${k==='del'?ico('del',24):k}</button>`).join('')}</div>
 <div class="lbl">${A.k==='t'?'From':'Wallet'}</div><div class="chips" style="margin-bottom:12px">${S.wallets.map(x=>`<button class="chip ${A.w===x.id?'on':''}" data-a="w" data-v="${x.id}">${esc(x.name)}</button>`).join('')}</div>
 ${A.k==='t'?`<div class="lbl">To</div><div class="chips" style="margin-bottom:12px">${S.wallets.filter(x=>x.id!==A.w).map(x=>`<button class="chip ${A.to===x.id?'on':''}" data-a="to" data-v="${x.id}">${esc(x.name)}</button>`).join('')||'<span class="sm">Add another wallet to transfer.</span>'}</div>`:`<div class="lbl">Category</div><div class="cg">${cs.map(c=>`<button class="${A.c===c.code?'on':''}" style="--c:${COLORS[c.code]||'#8e8e93'}" data-a="c" data-v="${c.code}"><div class="tile" style="--c:${COLORS[c.code]||'#8e8e93'}">${esc(c.code)}</div><span>${esc(c.name)}</span></button>`).join('')}</div>`}
 <div class="lbl">Memo</div><input class="field" id="memo" placeholder="What was it for?" maxlength="80" value="${esc(A.m)}" autocomplete="off"><div class="chips" id="sug" style="margin:8px 0 12px"></div>
 <div class="lbl">When</div><input class="field" type="datetime-local" id="when" value="${dt}" style="margin-bottom:16px">
 <button class="btn" data-a="save">${A.edit?'Save changes':'Save'}</button>${A.edit?`<button class="btn red" data-a="del">Delete entry</button>`:''}`}
function mountAdd(sh){
 const memo=$('#memo',sh),when=$('#when',sh);
 const sug=()=>{const q=memo.value.trim().toLowerCase();const el=$('#sug',sh);if(!q){el.innerHTML='';return}const m={};for(const t of S.txns){const k=(t.m||'').trim();if(!k||!k.toLowerCase().startsWith(q)||k.toLowerCase()===q)continue;const o=m[k]||(m[k]={k,n:0,c:t.c});o.n++}el.innerHTML=Object.values(m).sort((a,b)=>b.n-a.n).slice(0,4).map(o=>`<button class="chip" data-a="sug" data-v="${esc(o.k)}" data-c="${o.c}">${esc(o.k)}</button>`).join('')};
 memo.oninput=()=>{A.m=memo.value;sug()};
 when.onchange=()=>{const v=new Date(when.value).getTime();if(v)A.t=v};
 sh.onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,v=b.dataset.v;
  if(a==='key'){buzz();let s=A.amt;if(v==='del')s=s.slice(0,-1);else if(v==='.'){if(!s.includes('.'))s=(s||'0')+'.'}else{if(s.includes('.')&&s.split('.')[1].length>=2)return;if(s.length>=11)return;s=s==='0'?String(v):s+v}A.amt=s;const w=WM()[A.w];$('#amtv',sh).textContent=(SYM[(w||{}).cur||S.set.cur]||'')+(s||'0');fit($('#amtv',sh).parentNode)}
  else if(a==='sug'){A.m=v;memo.value=v;if(A.k!=='t'&&!A.c&&b.dataset.c)A.c=b.dataset.c;redraw(sh)}
  else if(a==='save')saveAdd();
  else if(a==='del'){if(confirm('Delete this entry?')){S.txns=S.txns.filter(t=>t.id!==A.edit);dirty();closeSheet();render();toast('Deleted')}}
  else{if(a==='k'){A.k=v;if(v!=='t'){const cs=S.cats.filter(c=>c.inc===(v==='i'));if(!cs.find(c=>c.code===A.c))A.c=''}}
   else if(a==='w'){A.w=v;if(A.to===v)A.to=''}else if(a==='to')A.to=v;else if(a==='c')A.c=v;
   redraw(sh)}};
 sug()}
function redraw(sh){const top=sh.scrollTop;const amt=A.amt,m=A.m;sh.innerHTML='<div class="grab"></div>'+addHtml();mountAdd(sh);sh.scrollTop=top}
function saveAdd(){
 const a=parseFloat(A.amt);if(!(a>0)){toast('Enter an amount');buzz();return}
 if(A.k==='t'){if(!A.to){toast('Choose where it goes');return}}else if(!A.c){toast('Pick a category');return}
 const t={id:A.edit||uid(),t:A.t,k:A.k,c:A.k==='t'?'TX':A.c,a:Math.round(a*100)/100,m:(A.m||'').trim(),w:A.w,to:A.k==='t'?A.to:''};
 if(A.edit){const i=S.txns.findIndex(x=>x.id===A.edit);S.txns[i]=t}else S.txns.push(t);
 dirty();closeSheet();okAnim();buzz();render()}

function openWallet(w){
 if(!w){sheet(`<h2>New wallet</h2><div class="lbl">Name</div><input class="field" id="wn" placeholder="e.g. Fidelity Bank" maxlength="24" autocomplete="off"><div class="err" id="we"></div><div class="lbl" style="margin-top:16px">Type</div><div class="cg" id="wt">${WTYPES.map(([k,v],i)=>`<button class="${i===0?'on':''}" data-t="${k}" style="--c:var(--acc)"><div class="wic">${ico(k,20)}</div><span>${v}</span></button>`).join('')}</div><div class="lbl">Currency</div><select class="field" id="wc">${CURS.map(c=>`<option ${c===S.set.cur?'selected':''}>${c}</option>`).join('')}</select><div class="lbl" style="margin-top:16px">Money already in it</div><input class="field" id="wo" inputmode="decimal" placeholder="0.00"><div style="height:18px"></div><button class="btn" id="wsave">Create wallet</button>`,sh=>{
  let type='bank';$('#wt',sh).onclick=e=>{const b=e.target.closest('[data-t]');if(!b)return;type=b.dataset.t;sh.querySelectorAll('#wt button').forEach(x=>x.classList.toggle('on',x===b))};
  $('#wsave',sh).onclick=()=>{const n=$('#wn',sh).value.trim();if(!cleanOK(n)){$('#we',sh).textContent='Use 2 to 24 letters or numbers.';return}if(S.wallets.some(x=>x.name.toLowerCase()===n.toLowerCase())){$('#we',sh).textContent='You already have a wallet with that name.';return}const o=parseFloat($('#wo',sh).value)||0;S.wallets.push({id:uid(),name:n,type,cur:$('#wc',sh).value,open:o});dirty();closeSheet();okAnim();render()}});return}
 const b=BAL()[w.id];
 sheet(`<h2>${esc(w.name)}</h2><p class="sm" style="margin:-8px 0 14px">${(WTYPES.find(t=>t[0]===w.type)||[])[1]} · ${w.cur}</p><div class="card" style="text-align:center"><div class="sm">Balance</div><div class="big fit" style="font-size:38px">${money(b,w.cur)}</div></div>
 <button class="btn acc" id="wadd">${ico('plus',18)} Add entry</button><button class="btn soft" id="wxf">Transfer money</button><div class="lbl" style="margin-top:20px">Set actual balance</div><input class="field" id="wb" inputmode="decimal" placeholder="${nf(b)}"><button class="btn soft" id="wset" style="margin-top:10px">Match this balance</button><p class="sm" style="margin:8px 4px 0">Adds one adjustment entry so the balance equals what is really in the wallet.</p><div class="lbl" style="margin-top:20px">Rename</div><input class="field" id="wr" value="${esc(w.name)}" maxlength="24"><button class="btn soft" id="wren" style="margin-top:10px">Save name</button><div class="err" id="we"></div><button class="btn red" id="wdel" style="margin-top:20px">Delete wallet</button>`,sh=>{
  $('#wadd',sh).onclick=()=>{closeSheet(true);openAdd(null,{w:w.id})};
  $('#wxf',sh).onclick=()=>{closeSheet(true);openAdd(null,{w:w.id,k:'t'})};
  $('#wset',sh).onclick=()=>{const v=parseFloat($('#wb',sh).value);if(isNaN(v)){toast('Type the real balance');return}const d=Math.round((v-b)*100)/100;if(!d){toast('Already matches');return}S.txns.push({id:uid(),t:Date.now(),k:d>0?'i':'e',c:'AD',a:Math.abs(d),m:'Balance adjustment',w:w.id,to:''});dirty();closeSheet();okAnim();render()};
  $('#wren',sh).onclick=()=>{const n=$('#wr',sh).value.trim();if(!cleanOK(n)){$('#we',sh).textContent='Use 2 to 24 letters or numbers.';return}if(S.wallets.some(x=>x.id!==w.id&&x.name.toLowerCase()===n.toLowerCase())){$('#we',sh).textContent='That name is taken.';return}w.name=n;dirty();closeSheet();render();toast('Renamed')};
  $('#wdel',sh).onclick=()=>{const n=S.txns.filter(t=>t.w===w.id||t.to===w.id).length;if(confirm(`Delete ${w.name} and its ${n} entries?`)){S.wallets=S.wallets.filter(x=>x.id!==w.id);S.txns=S.txns.filter(t=>t.w!==w.id&&t.to!==w.id);dirty();closeSheet();render();toast('Wallet deleted')}}})}

/* ---------- CSV ---------- */
function parseCSV(s){const rows=[];let r=[],f='',q=false;for(let i=0;i<s.length;i++){const c=s[i];if(q){if(c==='"'){if(s[i+1]==='"'){f+='"';i++}else q=false}else f+=c}else if(c==='"')q=true;else if(c===','){r.push(f);f=''}else if(c==='\n'||c==='\r'){if(c==='\r'&&s[i+1]==='\n')i++;r.push(f);f='';if(r.length>1||r[0]!=='')rows.push(r);r=[]}else f+=c}
 if(f!==''||r.length){r.push(f);rows.push(r)}return rows}
function mapCat(raw,inc){const r=raw.trim().toLowerCase();const p=(...a)=>a.some(x=>r.startsWith(x));
 if(r==='transfer')return'TX';
 if(inc){if(p('salary','bonus'))return'SB';if(p('coupon','side','allowance'))return'AS';if(p('gift'))return'GC';if(p('loan'))return'LR';return'GC'}
 if(p('saving','emergency'))return'SV';if(p('big purchase','clothing'))return'SG';if(p('grocer','entertainment'))return'FD';if(p('support'))return'FG';if(p('housing','utilit','moves'))return'HB';if(p('borrow'))return'DL';if(p('transport','travel'))return'TR';if(p('data'))return'SU';if(p('health','education'))return'HL';return'FM'}
function parseDate(s){const m=/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})\s*(AM|PM)?$/i.exec(s.trim());if(m){let h=+m[4]%12;if((m[6]||'').toUpperCase()==='PM')h+=12;return new Date(+m[3],+m[1]-1,+m[2],h,+m[5]).getTime()}const t=Date.parse(s);return isNaN(t)?0:t}
function guessType(n){n=n.toLowerCase();if(/saving/.test(n))return'savings';if(/momo|mobile|mtn|vodafone|airtel|telecel|mpesa|m-pesa/.test(n))return'mobileMoney';if(/card|visa|master/.test(n))return'card';if(/cash/.test(n))return'cash';return'bank'}
function importCSV(text){
 const rows=parseCSV(text.replace(/^﻿/,''));if(rows.length<2)return null;
 const h=rows[0].map(x=>x.trim().toLowerCase());const ix=k=>h.indexOf(k);
 const iD=ix('date'),iT=ix('type'),iC=ix('category'),iA=ix('amount'),iM=ix('memo'),iW=ix('wallet'),iCu=ix('currency');
 if([iD,iT,iC,iA,iW].some(i=>i<0))return null;
 const wasEmpty=!S.wallets.length;
 const wm={};S.wallets.forEach(w=>wm[w.name.toLowerCase()]=w);
 const key=t=>[Math.floor(t.t/1000),t.k,Math.round(t.a*100),t.m,t.w].join('|');
 const seen=new Set(S.txns.map(key));let added=0,skipped=0,bad=0;
 const nameMap={};S.cats.forEach(c=>nameMap[c.inc+'|'+c.name.toLowerCase()]=c.code);
 for(let n=1;n<rows.length;n++){const r=rows[n];if(r.length<h.length-1){bad++;continue}
  const t0=parseDate(r[iD]),amt=parseFloat(String(r[iA]).replace(/,/g,''));if(!t0||isNaN(amt)||!amt){bad++;continue}
  const inc=r[iT].trim().toLowerCase()==='income';const wn=(r[iW]||'').trim()||'Imported';let w=wm[wn.toLowerCase()];
  if(!w){w={id:uid(),name:wn,type:guessType(wn),cur:(iCu>=0&&r[iCu]||S.set.cur).trim()||S.set.cur,open:0};S.wallets.push(w);wm[wn.toLowerCase()]=w}
  const raw=r[iC]||'';const code=nameMap[inc+'|'+raw.trim().toLowerCase()]||mapCat(raw,inc);
  const t={id:uid(),t:t0,k:inc?'i':'e',c:code,a:Math.abs(amt),m:iM>=0?(r[iM]||'').trim():'',w:w.id,to:''};
  const k=key(t);if(seen.has(k)){skipped++;continue}seen.add(k);S.txns.push(t);added++}
 if(wasEmpty&&S.wallets[0])S.set.cur=S.wallets[0].cur;
 dirty();return{added,skipped,bad}}
function exportCSV(){
 const q=s=>'"'+String(s).replace(/"/g,'""')+'"';const p=n=>String(n).padStart(2,'0');
 const ds=ms=>{const d=new Date(ms);let h=d.getHours();const ap=h>=12?'PM':'AM';h=h%12||12;return`${p(d.getMonth()+1)}/${p(d.getDate())}/${d.getFullYear()} ${h}:${p(d.getMinutes())} ${ap}`};
 const L=['"Date","Type","Category","Amount","Currency","Memo","Wallet"'];const W=WM();
 for(const t of S.txns.slice().sort((a,b)=>b.t-a.t)){const w=W[t.w]||{name:'',cur:S.set.cur};
  if(t.k==='t'){const to=W[t.to];L.push([q(ds(t.t)),q('Expense'),q('Transfer'),q('-'+t.a.toFixed(2)),q(w.cur),q(t.m),q(w.name)].join(','));if(to)L.push([q(ds(t.t)),q('Income'),q('Transfer'),q(t.a.toFixed(2)),q(to.cur),q(t.m),q(to.name)].join(','))}
  else L.push([q(ds(t.t)),q(t.k==='i'?'Income':'Expense'),q(cat(t.c).name),q((t.k==='i'?'':'-')+t.a.toFixed(2)),q(w.cur),q(t.m),q(w.name)].join(','))}
 return L.join('\n')}
async function doExport(){const text=exportCSV();const f=new File([text],'MoneyTrack-export.csv',{type:'text/csv'});
 try{if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f]});return}}catch(e){if(e&&e.name==='AbortError')return}
 const a=document.createElement('a');a.href=URL.createObjectURL(f);a.download=f.name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
function pickFile(){const i=document.createElement('input');i.type='file';i.accept='.csv,text/csv,text/plain';i.onchange=async()=>{const f=i.files[0];if(!f)return;const r=importCSV(await f.text());if(!r){toast('That file does not look like a MoneyTrack CSV');return}okAnim();toast(`Added ${r.added.toLocaleString()}, skipped ${r.skipped.toLocaleString()} duplicates`);setTab(TAB==='settings'?'today':TAB)};i.click()}

/* ---------- story ---------- */
function storyData(){const now=new Date();let a0=new Date(now.getFullYear(),now.getMonth(),1),a1=new Date(now.getFullYear(),now.getMonth()+1,1);let an=analyze(a0.getTime(),a1.getTime());if(!an.spent){a0=new Date(now.getFullYear(),now.getMonth()-1,1);a1=new Date(now.getFullYear(),now.getMonth(),1);an=analyze(a0.getTime(),a1.getTime())}if(!an.spent)return null;
 const p0=new Date(a0.getFullYear(),a0.getMonth()-1,1);const pv=analyze(p0.getTime(),a0.getTime());an.month=MONTHS[a0.getMonth()];an.prev=pv.spent;an.dim=new Date(a0.getFullYear(),a0.getMonth()+1,0).getDate();return an}
function openStory(){
 const d=storyData();if(!d){toast('Add a few expenses first');return}const cur=S.set.cur;
 const diff=d.prev?(d.spent-d.prev)/d.prev*100:null;const tc=d.cats[0],c0=cat(tc.c);const wdTop=d.wd.indexOf(Math.max(...d.wd)),wm=Math.max(...d.wd);const net=d.earned-d.spent;
 const dots=Array.from({length:d.dim},(_,i)=>`<i class="${d.flags[i]===true?'n':''}" style="--i:${i}"></i>`).join('');
 const slides=[
 {g:'#0a84ff',h:`<h3>Your ${d.month}</h3><div class="huge fit" data-cu="${d.spent}" data-cur="${cur}">${money(d.spent)}</div><p>was spent across <b>${d.count}</b> purchases.${diff===null?'':` That is <b>${Math.abs(diff).toFixed(0)}% ${diff>0?'more':'less'}</b> than the month before.`}</p>`},
 {g:COLORS[tc.c],h:`<h3>Your biggest category</h3><div class="ring"><svg viewBox="0 0 42 42" width="170" height="170"><circle cx="21" cy="21" r="15.9155" stroke="var(--surf2)"/><circle class="fg" style="--d:${(tc.v/d.spent*100).toFixed(1)};stroke:${COLORS[tc.c]}" cx="21" cy="21" r="15.9155" stroke-linecap="round"/></svg><div class="tile" style="--c:${COLORS[tc.c]}">${tc.c}</div></div><div class="huge" style="font-size:40px;white-space:normal;letter-spacing:-1px">${esc(c0.name)}</div><p><b data-cu="${tc.v}" data-cur="${cur}">${money(tc.v)}</b>, which is <b data-cu="${tc.v/d.spent*100}" data-mode="pct">${Math.round(tc.v/d.spent*100)}%</b> of everything you spent.</p>`},
 {g:'#5e5ce6',h:`<h3>Your spending day</h3><div class="huge">${['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][wdTop]}s</div><div class="bars" style="height:140px;margin-top:26px">${d.wd.map((v,i)=>`<div class="c ${i===wdTop?'hi':''}"><div class="p"><i style="--h:${v/wm*100}%;--i:${i};max-width:30px;background:${i===wdTop?'var(--acc)':'var(--surf2)'}"></i></div><em>${DOW[i]}</em></div>`).join('')}</div><p>Quietest day: <b>${['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][d.wd.indexOf(Math.min(...d.wd))]}</b>.</p>`},
 {g:'#ff375f',h:`<h3>Your biggest purchase</h3><div class="huge fit" data-cu="${d.biggest.a}" data-cur="${cur}">${money(d.biggest.a)}</div><p><b>${esc(d.biggest.m||cat(d.biggest.c).name)}</b> on ${new Date(d.biggest.t).toLocaleDateString('en-GB',{day:'numeric',month:'long'})}.</p>`},
 {g:'#17a867',h:`<h3>Days you spent nothing</h3><div class="huge"><span data-cu="${d.nospend}" data-mode="int">${d.nospend}</span> <span style="font-size:.4em;color:var(--mut)">days</span></div><div class="dots">${dots}</div><p>Longest quiet run: <b>${d.best} ${d.best===1?'day':'days'}</b>. Green dots are no-spend days.</p>`},
 {g:net>=0?'#17a867':'#ff453a',h:`<h3>The bottom line</h3><div class="huge fit ${net>=0?'inc':'exp'}" data-cu="${net}" data-cur="${cur}" data-pre="${net>=0?'+':''}">${money(net,cur,true)}</div><p>You earned <b>${money(d.earned)}</b> and spent <b>${money(d.spent)}</b> in ${d.month}.${net>=0?' You kept the difference. Nice.':' Next month is a fresh start.'}</p>`}];
 const L=$('#layer');let i=0;
 L.innerHTML=`<div class="story"><div class="pb">${slides.map(()=>'<div><i></i></div>').join('')}</div><button class="ib x" data-s="x">${ico('x',20)}</button><div class="sl" id="sl"></div></div>`;
 const st=$('.story',L);requestAnimationFrame(()=>st.classList.add('on'));
 const show=n=>{i=n;st.querySelectorAll('.pb div').forEach((b,k)=>{b.className=k<n?'d':k===n?'a':'';const x=b.firstChild;const c=x.cloneNode();b.replaceChild(c,x);c.onanimationend=()=>{if(i===n)next()}});const sl=$('#sl',st);sl.style.setProperty('--g',slides[n].g);sl.innerHTML=slides[n].h;sl.className='sl';play(sl)};
 const next=()=>{i<slides.length-1?show(i+1):close()};const prev=()=>show(Math.max(0,i-1));
 const close=()=>{st.classList.remove('on');setTimeout(()=>{L.innerHTML=''},350)};
 st.onclick=e=>{if(e.target.closest('[data-s=x]'))return close();const x=e.clientX/innerWidth;x<.35?prev():next()};
 st.onpointerdown=()=>st.classList.add('paused');st.onpointerup=st.onpointercancel=()=>st.classList.remove('paused');
 show(0)}

/* ---------- events ---------- */
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act,v=b.dataset.v,id=b.dataset.id;
 switch(a){
 case'tab':setTab(v);break;
 case'add':openAdd();break;
 case'edit':{const t=S.txns.find(x=>x.id===id);t&&openAdd(t);break}
 case'wallet':openWallet(WM()[id]);break;
 case'newwallet':openWallet();break;
 case'story':openStory();break;
 case'per':PER=v;render();break;
 case'hf':H.f=v;H.n=60;render();break;
 case'hw':H.w=v;H.n=60;render();break;
 case'more':H.n+=60;$('#hl').innerHTML=histList();$('#hl').classList.add('go');break;
 case'theme':S.set.theme=v;save();applyTheme();render();break;
 case'cats':setTab('cats');break;
 case'import':pickFile();break;
 case'export':doExport();break;
 case'wipe':if(confirm('Erase all wallets and entries on this device? Export a CSV first if you want a backup.')&&confirm('Really erase everything?')){const th=S.set.theme;S=seed();S.set.theme=th;dirty();setTab('today');toast('Everything erased')}break;
 case'newcat':{const inc=v==='i';sheet(`<h2>New ${inc?'income':'expense'} category</h2><input class="field" id="cn" placeholder="e.g. Pets" maxlength="24"><div class="err" id="ce"></div><div style="height:16px"></div><button class="btn" id="cs">Add</button>`,sh=>{$('#cs',sh).onclick=()=>{const n=$('#cn',sh).value.trim();if(!cleanOK(n)){$('#ce',sh).textContent='Use 2 to 24 letters or numbers.';return}if(S.cats.some(c=>c.name.toLowerCase()===n.toLowerCase())){$('#ce',sh).textContent='That category exists.';return}let code=n.replace(/[^A-Za-z0-9]/g,'').slice(0,2).toUpperCase();let k=2;while(S.cats.concat(SYS_CATS).some(c=>c.code===code)){code=n.replace(/[^A-Za-z0-9]/g,'').slice(0,1).toUpperCase()+(k++)}S.cats.push({code,name:n,inc});COLORS[code]=COLORS[code]||['#0a84ff','#bf5af2','#ff9f0a','#30b455','#ff375f','#5e5ce6'][S.cats.length%6];dirty();closeSheet();render()}});break}
 }});
document.addEventListener('input',e=>{
 if(e.target.id==='q'){H.q=e.target.value;H.n=60;$('#hl').innerHTML=histList();$('#hl').classList.add('go')}
});
document.addEventListener('change',e=>{
 if(e.target.id==='curSel'){S.set.cur=e.target.value;save();toast('Main currency set')}
 const c=e.target.dataset&&e.target.dataset.cat;if(c){const n=e.target.value.trim();const ce=$('#cerr');const cc=S.cats.find(x=>x.code===c);if(!cleanOK(n)){ce.textContent='Names use letters and numbers only, 2 to 24 characters.';e.target.value=cc.name;return}if(S.cats.some(x=>x.code!==c&&x.name.toLowerCase()===n.toLowerCase())){ce.textContent='That name is already used.';e.target.value=cc.name;return}cc.name=n;ce.textContent='';dirty();toast('Saved')}
});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'){if($('.story'))$('.story .x').click();else closeSheet()}
 if(SH&&A&&document.activeElement.tagName!=='INPUT'&&document.activeElement.tagName!=='SELECT'){if(/^[0-9.]$/.test(e.key)||e.key==='Backspace'){const k=e.key==='Backspace'?'del':e.key;const b=SH.querySelector(`[data-a=key][data-v="${k}"]`);b&&b.click()}else if(e.key==='Enter'){const s=SH.querySelector('[data-a=save]');s&&s.click()}}
});
let dp;addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;const el=$('#inst');if(el)el.innerHTML='<button class="btn acc" id="ib" style="margin-top:12px">Install app</button>'});
document.addEventListener('click',e=>{if(e.target.id==='ib'&&dp){dp.prompt();dp=null}});
addEventListener('resize',()=>fitAll(document));

/* ---------- boot ---------- */
applyTheme();shell();setTab('today');
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
window.__mt={S:()=>S,importCSV,render,setTab};
})();
