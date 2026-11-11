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
const VER='3.0';
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
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));return true}catch(e){toast('Storage is full. Export a backup.');return false}}
addEventListener('pagehide',save);document.addEventListener('visibilitychange',()=>{if(document.hidden)save()});
let _bal=null,_wm=null,_cm=null;
function dirty(){_bal=_wm=_cm=null;save()}
const WM=()=>_wm||(_wm=Object.fromEntries(P().wallets.map(w=>[w.id,w])));
const CM=()=>_cm||(_cm=Object.fromEntries(P().cats.concat(SYS_CATS).map(c=>[c.code,c])));
const cat=c=>CM()[c]||{code:c,name:c,inc:false};
function BAL(){if(_bal)return _bal;const b={};P().wallets.forEach(w=>b[w.id]=+w.open||0);for(const t of P().txns){if(t.k==='i'){if(t.w in b)b[t.w]+=t.a}else if(t.k==='e'){if(t.w in b)b[t.w]-=t.a}else{if(t.w in b)b[t.w]-=t.a;if(t.to in b)b[t.to]+=t.a}}return _bal=b}
const nf=n=>Math.abs(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const money=(n,c,sign)=>{c=c||cur();return(n<0?'-':sign&&n>0?'+':'')+(SYM[c]||c+' ')+nf(n)};
const compact=(n,c,sign)=>{c=c||cur();const a=Math.abs(n);const t=a>=1e6?(a/1e6).toFixed(2).replace(/\.?0+$/,'')+'M':a>=1e4?(a/1e3).toFixed(1).replace(/\.0$/,'')+'K':nf(a);return(n<0?'-':sign&&n>0?'+':'')+(SYM[c]||c+' ')+t};
const sd=d=>{d=new Date(d);d.setHours(0,0,0,0);return d.getTime()};
const LB=()=>rc()?{inc:'Deposit',exp:'Withdraw',earn:'Deposited',spend:'Withdrawn',wal:'Plans',w1:'Plan',tot:'Total saved'}:{inc:'Income',exp:'Expense',earn:'Earned',spend:'Spent',wal:'Wallets',w1:'Wallet',tot:'Total balance'};
const WCOL=w=>PAL[Math.max(0,P().wallets.indexOf(w))%PAL.length];

/* ---------- ui helpers ---------- */
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function toast(m){let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast g';document.body.appendChild(t)}t.textContent=m;requestAnimationFrame(()=>t.classList.add('on'));clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('on'),2600)}
function buzz(){try{navigator.vibrate&&navigator.vibrate(12)}catch(e){}}
function okAnim(){const o=document.createElement('div');o.className='ok';o.innerHTML=`<div class="g">${ico('check',54)}</div>`;document.body.appendChild(o);setTimeout(()=>o.remove(),1000)}
function fmtCU(v,mode,c){if(mode==='num')return nf(v);if(mode==='compact')return compact(v,c);if(mode==='csign')return compact(v,c,true);if(mode==='int')return Math.round(v).toLocaleString('en-US');if(mode==='pct')return Math.round(v)+'%';return money(v,c)}
function countUps(root){root.querySelectorAll('[data-cu]').forEach(el=>{const to=parseFloat(el.dataset.cu)||0,mode=el.dataset.mode,c=el.dataset.cur;const pre=el.dataset.pre||'';if(reduce){el.textContent=pre+fmtCU(to,mode,c);return}const t0=performance.now(),dur=1100;const f=now=>{const p=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-p,4);el.textContent=pre+fmtCU(to*e,mode,c);if(p<1)requestAnimationFrame(f);else fit(el)};f(t0);requestAnimationFrame(f)})}
function fit(el){if(!el)return;el.style.fontSize='';let n=0;while(el.scrollWidth>el.clientWidth+1&&n++<16){el.style.fontSize=(parseFloat(getComputedStyle(el).fontSize)*.93)+'px'}}
function fitAll(root){root.querySelectorAll('.fit').forEach(fit)}
function play(root){root.classList.remove('go');requestAnimationFrame(()=>requestAnimationFrame(()=>{root.classList.add('go');countUps(root);fitAll(root)}))}
function applyTheme(){const t=S.set.theme;const dark=t==='dark'||(t==='auto'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=dark?'dark':'light';document.querySelectorAll('meta[name=theme-color]').forEach(m=>m.remove());const m=document.createElement('meta');m.name='theme-color';m.content=dark?'#000000':'#ffffff';document.head.appendChild(m)}
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
 <main><header class="top"><button class="pp g" data-act="profiles"><i class="av" id="pav"></i><span id="pnm"></span>${ico('chev',16)}</button><div class="acts"><button class="ib g" data-act="story" aria-label="Story">${ico('play',18)}</button><button class="ib g" data-act="tab" data-v="settings" aria-label="Settings">${ico('gear',20)}</button></div></header><div id="view"></div></main>
 <nav class="tabbar g"><span class="lens" id="lens"></span><button class="t" data-act="tab" data-v="today" data-tn="today">${ico('home')}Today</button><button class="t" data-act="tab" data-v="wallets" data-tn="wallets">${ico('wallet')}<span class="tl">${w}</span></button><button class="fab" data-act="add" aria-label="New entry">${ico('plus',28)}</button><button class="t" data-act="tab" data-v="insights" data-tn="insights">${ico('chart')}Insights</button><button class="t" data-act="tab" data-v="history" data-tn="history">${ico('list')}History</button></nav>`}
function chrome(){const p=P();document.documentElement.dataset.kind=p.kind;$('#pav').textContent=p.name.trim().slice(0,1).toUpperCase();$('#pnm').textContent=p.name;
 document.querySelectorAll('[data-tn]').forEach(b=>b.classList.toggle('on',b.dataset.tn===TAB));
 document.querySelectorAll('.tl').forEach(s=>{if(s.parentNode.dataset.tn==='wallets')s.textContent=LB().wal});
 const l=$('#lens');if(TABIDX[TAB]!=null){l.style.opacity=1;l.style.setProperty('--i',TABIDX[TAB])}else l.style.opacity=0}
function setTab(t){TAB=t;render();scrollTo(0,0)}
function render(){const v=view();if(!v)return;chrome();const f={today:vToday,wallets:vWallets,insights:vInsights,history:vHistory,settings:vSettings,cats:vCats}[TAB];v.innerHTML=f();play(v)}
const ttl=(sub,t)=>`<div class="ttl rise"><small>${sub}</small><h1>${t}</h1></div>`;

function txRow(t,mx){const w=WM()[t.w],c=cat(t.k==='t'?'TX':t.c);let title,sub,amt,cls='',code=t.c;
 const tm=new Date(t.t).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});
 if(t.k==='t'){title=t.m||'Transfer';sub=`${esc(w?w.name:'?')} to ${esc((WM()[t.to]||{}).name||'?')} · ${tm}`;amt=money(t.a,w&&w.cur);code='TX'}
 else{title=t.m||c.name;sub=`${esc(c.name)} · ${esc(w?w.name:'')} · ${tm}`;amt=money(t.k==='e'?-t.a:t.a,w&&w.cur,true);cls=t.k==='e'?'':'inc'}
 const col=t.k==='t'?'#8e8e93':(COLORS[code]||'#8e8e93');const f=mx?Math.sqrt(t.a/mx)*100:0;
 return`<button class="row" data-act="edit" data-id="${t.id}" style="--c:${col};--w:${f.toFixed(0)}"><div class="tile">${esc(String(code).slice(0,2))}</div><div class="m"><b>${esc(title)}</b><span>${sub}</span></div><div class="r ${cls}">${amt}</div><i class="mb"></i></button>`}

function empty(){return`${ttl('Welcome','Let’s set up '+esc(P().name))}${card('',`<div class="empty"><h2>${rc()?'Track your savings plans':'Track your daily money'}</h2><p>${rc()?'Add a plan for each policy or savings account, then record every deposit.':'Create a wallet, then log what comes in and goes out.'}<br>Everything stays on this device.</p><button class="btn acc" data-act="newwallet">${ico('wallet',20)} Create ${rc()?'a plan':'a wallet'}</button><button class="btn soft" data-act="import">Import CSV</button><button class="btn soft" data-act="restore">Restore a backup</button></div>`,{i:1})}`}

function nudge(){const lb=S.set.lastBackup;const n=P().txns.length;if(n<20||(lb&&Date.now()-lb<14*DAY))return'';return`<button class="g card rise" style="--i:1;display:flex;align-items:center;gap:14px;width:100%;padding:16px" data-act="backup"><div class="wic" style="--c:var(--a2)">${ico('savings',18)}</div><div style="flex:1;min-width:0"><b style="display:block;font-size:14.5px">Back up your data</b><span class="sm">${lb?'Last backup was a while ago.':'You have not backed up yet.'} Tap to save a file.</span></div></button>`}
function heroCard(label,total,ser,lv,pills){const c=cur();return`<section class="g card hero rise" style="--i:1">${waves(lv)}<div class="lbl"><span class="t">${label}</span></div><div class="big fit"><small>${esc(SYM[c]||c)}</small><span data-cu="${total}" data-mode="num">${nf(total)}</span></div><div class="row2">${pills}</div>${spark(ser,{h:96})}</section>`}
function stripHtml(ser12){const b=BAL();const all=VW().slice().sort((x,y)=>b[y.id]-b[x.id]);const ws=all.slice(0,4);
 return`<div class="wgrid rise" style="--i:2">${ws.map(w=>{const c=WCOL(w);const g=rc()&&w.goal>0;const s=ser12?balSeries([w.id],12,'m'):balSeries([w.id],30,'d');
  return`<button class="g wc" data-act="wallet" data-id="${w.id}" style="--c:${c}"><div class="t"><div class="wic">${ico(w.type,18)}</div><span>${esc(w.name)}</span>${g?pr(b[w.id]/w.goal,c,Math.min(100,Math.round(b[w.id]/w.goal*100))+'%').replace('margin-top:6px','margin:0 0 0 auto;width:38px;height:38px'):''}</div><div class="a" data-cu="${b[w.id]}" data-cur="${w.cur}">${money(b[w.id],w.cur)}</div>${spark(s,{h:56,c,dot:false})}</button>`}).join('')}${all.length>4?`<button class="g wc add" data-act="tab" data-v="wallets">${ico('wallet',24)}<span class="sm">See all ${all.length}</span></button>`:''}</div>`}

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
 const left=heroCard(LB().tot,total,ser,lv,pills)+stripHtml(false)+
 card('This month',`<div class="flex">${rings([{f:a.earned/mxr,c:'var(--inc)'},{f:a.spent/mxr,c:'var(--exp)'},{f:a.saved/mxr,c:'var(--sav)'}])}<div class="rgl"><div style="--c:var(--inc)"><i></i><p><span>Earned</span><b class="inc" data-cu="${a.earned}" data-mode="compact" data-cur="${c}">${compact(a.earned)}</b></p></div><div style="--c:var(--exp)"><i></i><p><span>Spent</span><b class="exp" data-cu="${a.spent}" data-mode="compact" data-cur="${c}">${compact(a.spent)}</b></p></div><div style="--c:var(--sav)"><i></i><p><span>Saved</span><b class="sav" data-cu="${a.saved}" data-mode="compact" data-cur="${c}">${compact(a.saved)}</b></p></div></div></div>`,{i:3,a:'tab',av:'insights',al:'Insights'});
 const right=card('Last 7 days',barsHtml(wb,{h:120,w:26}).replace(/<em>/g,'<em>')+`<p class="sm" style="margin-top:10px">Today: <b style="color:var(--fg)">${money(wk.days[td]||0)}</b> · average ${money(wk.spent/7)} a day</p>`,{i:4}).replace('style="height:120px"','style="height:120px"')+
 card('Spending pace',paceSvg(cu)+`<div class="sm" style="display:flex;justify-content:space-between;margin-top:8px"><span>Solid: this month</span><span>Dashed: last month</span></div>`,{i:5})+
 card('Top categories',top.length?hbars(top.map(x=>({code:x.k,name:cat(x.k).name,v:x.v,c:COLORS[x.k]||'#8e8e93',val:compact(x.v)})),tm):'<p class="sm">No spending yet this month.</p>',{i:6,a:'tab',av:'insights',al:'More'})+
 `<button class="story-card rise" style="--i:7" data-act="story"><div class="pl">${ico('play',20)}</div><div><b>Your ${MONTHS[new Date().getMonth()]} story</b><span>Six quick slides about your money</span></div></button>`+
 card('Recent',recs.length?recs.map(t=>txRow(t,rmx)).join(''):'<p class="sm">No entries yet. Tap + to add one.</p>',{i:8,a:'tab',av:'history',al:'See all'});
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
 const left=heroCard(LB().tot,total,ser,lv,pills)+stripHtml(true)+card('Consistency',co.html,{i:3});
 const right=card('Monthly deposits',stackedMonths(12),{i:4})+`<button class="story-card rise" style="--i:5" data-act="story"><div class="pl">${ico('play',20)}</div><div><b>Your savings story</b><span>Five quick slides about your plans</span></div></button>`+card('Recent deposits',recs.length?recs.map(t=>txRow(t,rmx)).join(''):'<p class="sm">No entries yet. Tap + to record one.</p>',{i:6,a:'tab',av:'history',al:'See all'});
 return ttl(date,g)+nudge()+`<div class="cols"><div>${left}</div><div>${right}</div></div>`}

function vWallets(){
 if(!P().wallets.length)return ttl(LB().wal,'Your '+LB().wal.toLowerCase())+card('',`<div class="empty"><h2>No ${LB().wal.toLowerCase()} yet</h2><p>Add your first ${LB().w1.toLowerCase()}.</p><button class="btn acc" data-act="newwallet">Create ${LB().w1.toLowerCase()}</button></div>`,{i:1});
 const b=BAL(),ws=VW();const c=cur();const tot=ws.filter(w=>w.cur===c).reduce((s,w)=>s+Math.max(0,b[w.id]),0)||1;const a=range('m');
 const list=ws.map((w,i)=>{let inn=0,out=0;for(const t of P().txns){if(t.t<a.from)continue;if(t.k==='i'&&t.w===w.id&&t.c!=='AD')inn+=t.a;else if(t.k==='e'&&t.w===w.id&&t.c!=='AD')out+=t.a;else if(t.k==='t'){if(t.w===w.id)out+=t.a;if(t.to===w.id)inn+=t.a}}const mx=Math.max(inn,out,1);const col=WCOL(w);
  const s=rc()?balSeries([w.id],12,'m'):balSeries([w.id],45,'d');const share=Math.max(0,b[w.id])/tot;
  return`<button class="g card rise" style="--i:${i+1};display:block;width:100%;--c:${col}" data-act="wallet" data-id="${w.id}"><div style="display:flex;align-items:center;gap:12px;margin-bottom:16px"><div class="wic">${ico(w.type,20)}</div><div style="min-width:0;flex:1"><b style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:16px">${esc(w.name)}</b><span class="sm">${(WTYPES.find(t=>t[0]===w.type)||[])[1]} · ${w.cur}</span></div>${pr(w.goal>0?b[w.id]/w.goal:share,col,Math.round((w.goal>0?Math.min(1,b[w.id]/w.goal):share)*100)+'%')}</div>
  <div style="font-size:clamp(26px,8vw,34px);font-weight:800;letter-spacing:-1px;white-space:nowrap;overflow:hidden" class="fit" data-cu="${b[w.id]}" data-cur="${w.cur}">${money(b[w.id],w.cur)}</div><p class="sm" style="margin:2px 0 6px">${w.goal>0?`Goal ${money(w.goal,w.cur)}`:`${Math.round(share*100)}% of all ${LB().wal.toLowerCase()}`}</p>${spark(s,{h:64,c:col})}
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:12px"><div><span class="sm">In this month</span><b class="inc" style="display:block;font-size:14px">${compact(inn,w.cur)}</b>${trk(inn/mx,'var(--inc)')}</div><div><span class="sm">Out this month</span><b class="exp" style="display:block;font-size:14px">${compact(out,w.cur)}</b>${trk(out/mx,'var(--exp)')}</div></div></button>`}).join('');
 return ttl(LB().wal,'Your '+LB().wal.toLowerCase())+`<div class="cols"><div>${list}</div></div><button class="btn soft rise" style="--i:9" data-act="newwallet">${ico('plus',18)} Add ${LB().w1.toLowerCase()}</button>${hiddenCard()}`}
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
 const r=range(PER),d=flowData(r.from,r.to),c=cur(),exp=FLOW==='e';const pr=prevRange(PER,r);const pd=pr?flowData(pr.from,pr.to):null;
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
 ${card(exp?'Expense categories':'Income categories',list,{i:5,r:'<span class="sm">Tap one to see its entries</span>'})}
 ${card('Share',d.cats.length?donutHtml(segs,d.tot||1,`<span class="sm">${exp?'Spent':'Earned'}</span><b class="fit" style="max-width:96px;overflow:hidden">${compact(d.tot)}</b>`)+`<div class="leg" style="margin-top:12px">${segs.map(s=>`<div class="row" style="--c:${s.c}"><i></i><span class="n">${s.other?'Other':esc(nameOf(s.k))}</span><span class="v">${Math.round(s.v/d.tot*100)}%</span></div>`).join('')}</div>`:'<p class="sm">Nothing yet.</p>',{i:6})}</div>
 <div>${card('Last 12 months',barsHtml(fm.map((m,i)=>({l:m.l,vals:[m.tot],cols:[col],hi:i===11}))),{i:6})}
 ${card('By weekday',barsHtml(wd.map((v,i)=>({l:DOW[i],vals:[v],cols:[i===wm&&d.tot?col:'color-mix(in srgb,'+col+' 30%,transparent)'],hi:i===wm&&d.tot})),{h:120,w:26}),{i:7,r:d.tot?`<span class="sm">Peak: ${DOW[wm]}</span>`:''})}
 ${card('Time of day',barsHtml(hrs.map((v,i)=>({l:hl6[i],vals:[v],cols:[i===hm&&d.tot?'var(--a2)':'color-mix(in srgb,var(--a2) 30%,transparent)'],hi:i===hm&&d.tot})),{h:110,w:34}),{i:8})}
 ${exp?card('Last 5 weeks',heatHtml(),{i:9}):''}
 ${card('Counting',`<label class="row" style="cursor:pointer"><div class="m"><b>Include savings and loans</b><span>${exp?'Count money put into Savings as spending':'Count loans received as income'}</span></div><button class="seg" style="padding:0;min-width:64px" data-act="incl"><span class="${S.set.incl?'on':''}" style="padding:8px 14px;border-radius:12px;font-weight:700;background:${S.set.incl?'var(--a1)':'var(--chip)'};color:${S.set.incl?'#fff':'var(--fg)'}">${S.set.incl?'On':'Off'}</span></button></label>`,{i:10})}</div></div>`}
function openCat(code){
 const r=range(PER);const L=P().txns.filter(t=>t.t>=r.from&&t.t<r.to&&inFlow(t)&&t.c===code).sort((a,b)=>b.t-a.t);const tot=L.reduce((s,t)=>s+t.a,0);const mx=Math.max(1,...L.map(t=>t.a));
 sheet(`<h2>${esc(cat(code).name)}</h2><p class="sm" style="margin:-8px 0 14px">${L.length} ${L.length===1?'entry':'entries'} · ${money(tot)}</p><button class="btn acc" id="ca">${ico('plus',18)} Add to ${esc(cat(code).name)}</button><div class="g card" style="padding:6px 16px;margin-top:14px;border-radius:26px;box-shadow:none">${L.slice(0,200).map(t=>txRow(t,mx)).join('')||'<p class="sm" style="padding:14px 0">Nothing here.</p>'}</div>${PAD}`,sh=>{$('#ca',sh).onclick=()=>{closeSheet(true);openAdd(null,{k:FLOW,c:code})}})}
function vInsightsRec(){
 const r=range(PER),a=analyze(r.from,r.to),c=cur();const L=LB();
 const labels={m:'This month',q:'90 days',y:'This year',a:'All time'};
 const mo=monthSeries(12);
 const segs=a.cats.slice(0,6).map(x=>({v:x.v,c:colorOf(x.k),k:x.k})),rest=a.cats.slice(6).reduce((s,x)=>s+x.v,0);if(rest>0)segs.push({v:rest,c:'#8e8e93',k:'_',other:true});
 const tot=(rc()?a.earned:a.spent)||1;
 const don=a.cats.length?`<div class="flex">${donutHtml(segs,tot,`<span class="sm">${rc()?'Deposited':'Spent'}</span><b class="fit" data-cu="${rc()?a.earned:a.spent}" data-mode="compact" data-cur="${c}" style="max-width:96px;overflow:hidden">${compact(rc()?a.earned:a.spent)}</b>`)}<div class="leg">${segs.map(s=>`<div class="row" style="--c:${s.c}"><i></i><span class="n">${s.other?'Other':esc(nameOf(s.k))}</span><span class="v">${Math.round(s.v/tot*100)}%</span></div>`).join('')}</div></div>`:'<p class="sm">Nothing in this period.</p>';
 const net=a.earned-a.spent;const mxr=Math.max(a.earned,a.spent,a.saved,1);
 const kp=rc()?[[L.earn,a.earned,'inc'],[L.spend,a.spent,'exp'],['Net',a.earned-a.spent,net>=0?'inc':'exp']]:[[L.spend,a.spent,'exp'],[L.earn,a.earned,'inc'],['Saved',a.saved,'sav']];
 const ringsCard=rc()?'':card('Money flow',`<div class="flex">${rings([{f:a.earned/mxr,c:'var(--inc)'},{f:a.spent/mxr,c:'var(--exp)'},{f:a.saved/mxr,c:'var(--sav)'}])}<div class="rgl"><div style="--c:var(--inc)"><i></i><p><span>Earned</span><b class="inc">${compact(a.earned)}</b></p></div><div style="--c:var(--exp)"><i></i><p><span>Spent</span><b class="exp">${compact(a.spent)}</b></p></div><div style="--c:var(--sav)"><i></i><p><span>Saved</span><b class="sav">${compact(a.saved)}</b></p></div></div></div>${a.borrowed?`<p class="sm" style="margin-top:8px">Loans received (${compact(a.borrowed)}) are not counted as earnings.</p>`:''}`,{i:3});
 const monthsCard=rc()?card('Deposits by month',stackedMonths(12),{i:3}):card('Last 12 months',barsHtml(mo.map((m,i)=>({l:m.l,vals:[m.inc,m.exp],cols:['var(--inc)','var(--exp)'],hi:i===11}))),{i:4,r:'<span class="sm">in vs out</span>'});
 let growth='';
 if(rc()){const ws=P().wallets.slice(0,6);const sr=ws.map(w=>({v:balSeries([w.id],18,'m'),c:colorOf(w.id)}));growth=card('Growth by plan',multi(sr)+`<div class="chips" style="margin-top:12px;flex-wrap:wrap">${ws.map(w=>`<span class="pill"><i style="width:8px;height:8px;border-radius:50%;background:${colorOf(w.id)}"></i>${esc(w.name)}</span>`).join('')}</div>`,{i:5})}
 else{growth=card('Spending pace',paceSvg(cumulative())+`<div class="sm" style="display:flex;justify-content:space-between;margin-top:8px"><span>Solid: this month</span><span>Dashed: last month</span></div>`,{i:5})}
 const wdm=Math.max(1,...a.wd),wdTop=a.wd.indexOf(Math.max(...a.wd)),wdLow=a.wd.indexOf(Math.min(...a.wd));
 const wdCard=rc()?'':card('By weekday',barsHtml(a.wd.map((v,i)=>({l:DOW[i],vals:[v],cols:[i===wdTop&&a.spent?'var(--a1)':'color-mix(in srgb,var(--a1) 28%,transparent)'],hi:i===wdTop&&a.spent})),{h:120,w:26}),{i:6,r:a.spent?`<span class="sm">Most on ${DOW[wdTop]}, least on ${DOW[wdLow]}</span>`:''});
 const heat=rc()?'':card('Last 5 weeks',heatHtml(),{i:7});
 let hab;
 if(rc()){const co=consistency();const avgM=a.depMonths.size?a.earned/a.depMonths.size:0;const bm=mo.reduce((b,m)=>m.inc>b.inc?m:b,mo[0]);
  hab=`<div class="hab rise" style="--i:7"><div class="g"><span>Deposit streak</span><b data-cu="${co.streak}" data-mode="int">${co.streak}</b><span>months in a row</span>${trk(co.streak/12,'var(--inc)')}</div><div class="g"><span>Average month</span><b class="fit" data-cu="${avgM}" data-mode="compact" data-cur="${c}">${compact(avgM)}</b><span>${a.depMonths.size} active months</span>${trk(Math.min(1,a.depMonths.size/12),'var(--a1)')}</div><div class="g"><span>Best month</span><b class="fit" data-cu="${bm.inc}" data-mode="compact" data-cur="${c}">${compact(bm.inc)}</b><span>${bm.l} of the last 12</span>${trk(bm.inc?1:0,'var(--a2)')}</div><div class="g"><span>Biggest deposit</span><b class="fit" data-cu="${a.biggest?a.biggest.a:0}" data-mode="compact" data-cur="${c}">${a.biggest?compact(a.biggest.a):'None'}</b><span>${a.biggest?esc(a.biggest.m||nameOf(a.biggest.w)):''}</span>${trk(a.earned&&a.biggest?a.biggest.a/a.earned:0,'var(--a3)')}</div></div>`}
 else{const sr=a.earned?a.saved/a.earned:0;const sm14=[];const td=sd(Date.now());for(let i=13;i>=0;i--)sm14.push(a.days[td-i*DAY]||0);
  hab=`<div class="hab rise" style="--i:8"><div class="g"><span>No-spend days</span><b data-cu="${a.nospend}" data-mode="int">${a.nospend}</b><span>of ${a.nDays} days. Best run ${a.best}</span>${trk(a.nospend/a.nDays,'var(--inc)')}</div><div class="g"><span>Daily average</span><b class="fit" data-cu="${a.avg}" data-mode="compact" data-cur="${c}">${compact(a.avg)}</b><span>${a.count} purchases</span>${spark(sm14,{h:34,dot:false,fill:false})}</div><div class="g"><span>Small purchases</span><b data-cu="${a.smallPct}" data-mode="pct">${Math.round(a.smallPct)}%</b><span>under ${SYM[c]||c}100, only ${a.smallSpendPct.toFixed(1)}% of spending</span>${trk(a.smallPct/100,'var(--a2)')}</div><div class="g"><span>Heaviest day</span><b class="fit" data-cu="${a.bigDay?a.bigDay.v:0}" data-mode="compact" data-cur="${c}">${a.bigDay?compact(a.bigDay.v):'None'}</b><span>${a.bigDay?new Date(a.bigDay.k).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}):''}</span>${trk(a.bigDay&&a.spent?a.bigDay.v/a.spent:0,'var(--exp)')}</div><div class="g"><span>Savings rate</span><b data-cu="${sr*100}" data-mode="pct">${Math.round(sr*100)}%</b><span>of earnings went to savings</span>${pr(sr,'var(--sav)','').replace('margin-top:6px','margin-top:8px;width:40px;height:40px')}</div><div class="g"><span>Biggest purchase</span><b class="fit" data-cu="${a.biggest?a.biggest.a:0}" data-mode="compact" data-cur="${c}">${a.biggest?compact(a.biggest.a):'None'}</b><span>${a.biggest?esc(a.biggest.m||cat(a.biggest.c).name):''}</span>${trk(a.spent&&a.biggest?a.biggest.a/a.spent:0,'var(--a3)')}</div></div>`}
 const memos=card(rc()?'Top deposits':'Top repeat spends',a.topMemos.length?a.topMemos.map(m=>`<div class="row"><div class="m"><b>${esc(m.m)}</b><span>${m.n} ${m.n===1?'time':'times'}</span></div><div class="r">${money(m.v)}</div></div>`).join(''):'<p class="sm">Nothing yet.</p>',{i:9});
 return ttl(rc()?'Your savings':'How you spend','Insights')+
 `<div class="seg rise" style="margin-bottom:14px;--i:1">${Object.entries(labels).map(([k,v])=>`<button class="${PER===k?'on':''}" data-act="per" data-v="${k}">${v}</button>`).join('')}</div>
 <div class="kpis rise" style="--i:2">${kp.map(k=>`<div class="g card"><div class="sm">${k[0]}</div><b class="fit ${k[2]}" data-cu="${k[1]}" data-mode="${k[0]==='Net'?'csign':'compact'}" data-cur="${c}">${compact(k[1],c,k[0]==='Net')}</b></div>`).join('')}</div>
 <div class="cols"><div>${ringsCard}${monthsCard}${growth}${card(rc()?'Where it goes':'Where it goes',don,{i:5})}</div><div>${wdCard}${heat}${hab}${memos}</div></div>`}

const mkey=t=>{const d=new Date(t);return d.getFullYear()*12+d.getMonth()};
const mlabel=k=>MONTHS[k%12]+' '+Math.floor(k/12);
function monthKeys(){const set=new Set(P().txns.map(t=>mkey(t.t)));return[...set].sort((a,b)=>b-a)}
function vHistory(){
 const L=LB();const mk=monthKeys();if(H.m==='cur'){const nk=mkey(Date.now());H.m=mk.includes(nk)?nk:(mk[0]!=null?mk[0]:'all')}
 return ttl('Everything you logged','History')+
 `<div class="search rise" style="--i:1">${ico('search',18)}<input class="field" id="q" placeholder="Search memo, category or amount" value="${esc(H.q)}"></div>
 <div class="chips rise" style="margin-bottom:8px;--i:2"><button class="chip ${H.m==='all'?'on':''}" data-act="hm" data-v="all">All time</button>${mk.map(k=>`<button class="chip ${H.m===k?'on':''}" data-act="hm" data-v="${k}">${MONTHS[k%12].slice(0,3)} ${String(Math.floor(k/12)).slice(2)}</button>`).join('')}</div>
 <div class="chips rise" style="margin-bottom:12px;--i:3">${[['all','All'],['e',L.exp+'s'],['i',rc()?'Deposits':'Income'],['t','Transfers']].map(([k,v])=>`<button class="chip ${H.f===k?'on':''}" data-act="hf" data-v="${k}">${v}</button>`).join('')}${P().wallets.length>1?P().wallets.map(w=>`<button class="chip ${H.w===w.id?'on':''}" data-act="hw" data-v="${H.w===w.id?'all':w.id}">${esc(w.name)}</button>`).join(''):''}</div>
 <div id="hl">${histList()}</div>`}
function histFilter(){const q=H.q.trim().toLowerCase();return P().txns.filter(t=>(H.m==='all'||mkey(t.t)===H.m)&&(H.f==='all'||t.k===H.f)&&(H.w==='all'||t.w===H.w||t.to===H.w)&&(!q||(t.m||'').toLowerCase().includes(q)||cat(t.c).name.toLowerCase().includes(q)||String(t.a).includes(q))).sort((a,b)=>b.t-a.t)}
function histList(){
 const all=histFilter();const total=all.length;const L=all.slice(0,H.n);
 if(!total)return'<p class="sm" style="text-align:center;padding:40px 0">Nothing found.</p>';
 const rmx=Math.max(1,...L.map(t=>t.a));const months=[];
 for(const t of L){const mk=mkey(t.t);let m=months[months.length-1];if(!m||m.k!==mk){m={k:mk,days:[],items:[]};months.push(m)}m.items.push(t);const dk=sd(t.t);let d=m.days[m.days.length-1];if(!d||d.k!==dk){d={k:dk,items:[]};m.days.push(d)}d.items.push(t)}
 const td=sd(Date.now());
 let out=months.map(m=>{const full=all.filter(t=>mkey(t.t)===m.k);const inn=full.filter(t=>t.k==='i'&&!SYSC(t.c)).reduce((s,t)=>s+t.a,0),outv=full.filter(t=>t.k==='e'&&!SYSC(t.c)).reduce((s,t)=>s+t.a,0),mx=Math.max(inn,outv,1);
  const head=`<section class="g card" style="padding:18px;margin-top:6px"><div class="lbl"><span class="t">${mlabel(m.k)}</span><span class="sm">${full.length} ${full.length===1?'entry':'entries'}</span></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:16px"><div><span class="sm">${rc()?'Deposits':'In'}</span><b class="inc" style="display:block;font-size:18px" data-cu="${inn}" data-mode="compact" data-cur="${cur()}">${compact(inn)}</b>${trk(inn/mx,'var(--inc)')}</div><div><span class="sm">${rc()?'Withdrawals':'Out'}</span><b class="exp" style="display:block;font-size:18px" data-cu="${outv}" data-mode="compact" data-cur="${cur()}">${compact(outv)}</b>${trk(outv/mx,'var(--exp)')}</div></div></section>`;
  const days=m.days.map(g=>{const net=g.items.reduce((s,t)=>s+(t.k==='i'?t.a:t.k==='e'?-t.a:0),0);const lab=g.k===td?'Today':g.k===td-DAY?'Yesterday':new Date(g.k).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'});return`<div class="day"><span>${lab}</span><span>${net?money(net,undefined,true):''}</span></div><div class="g card" style="padding:6px 16px;margin-bottom:0;border-radius:26px">${g.items.map(t=>txRow(t,rmx)).join('')}</div>`}).join('');
  return head+days}).join('');
 if(total>L.length)out+=`<button class="btn soft" style="margin-top:18px" data-act="more">Show more (${total-L.length} left)</button>`;
 return out}

function vSettings(){
 const st=S.set,p=P();
 return ttl('Make it yours','Settings')+
 card('Profiles',S.profiles.map(q=>`<button class="row" data-act="switch" data-id="${q.id}"><div class="av" style="width:40px;height:40px">${esc(q.name.slice(0,1).toUpperCase())}</div><div class="m"><b>${esc(q.name)}</b><span>${q.kind==='records'?'Savings records':'Daily spending'} · ${q.wallets.length} ${q.kind==='records'?'plans':'wallets'} · ${q.txns.length.toLocaleString()} entries</span></div>${q.id===S.active?`<span class="pill inc">Active</span>`:''}</button>`).join('')+`<button class="btn soft" style="margin-top:12px" data-act="newprofile">${ico('plus',18)} New profile</button><button class="btn soft" data-act="manage" data-id="${p.id}">${ico('edit',18)} Rename or delete “${esc(p.name)}”</button>`,{i:1})+
 card('Appearance',`<div class="seg">${[['auto','Auto'],['light','White'],['dark','Dark']].map(([k,v])=>`<button class="${st.theme===k?'on':''}" data-act="theme" data-v="${k}">${v}</button>`).join('')}</div>`,{i:2})+
 card('Currency for '+esc(p.name),`<select class="field" id="curSel">${CURS.map(c=>`<option ${c===p.cur?'selected':''}>${c}</option>`).join('')}</select><p class="sm" style="margin-top:8px">Totals and insights count ${rc()?'plans':'wallets'} in this currency.</p>`,{i:3})+
 card('Data',`<div class="set"><button class="row" data-act="cats"><div class="m"><b>Categories</b><span>Rename or add. Letters and numbers only</span></div></button><button class="row" data-act="import"><div class="m"><b>Import CSV into ${esc(p.name)}</b><span>Your old app format. Duplicates are skipped</span></div></button><button class="row" data-act="export"><div class="m"><b>Export ${esc(p.name)} as CSV</b><span>${p.txns.length.toLocaleString()} entries</span></div></button><button class="row" data-act="backup"><div class="m"><b>Back up everything</b><span>${S.set.lastBackup?'Last backup '+new Date(S.set.lastBackup).toLocaleDateString('en-GB',{day:'numeric',month:'short'}):'Never backed up'}. One file with all profiles</span></div></button><button class="row" data-act="restore"><div class="m"><b>Restore a backup</b><span>Pick a backup file. A CSV is added to this profile instead</span></div></button><button class="row" data-act="wipe"><div class="m"><b class="exp">Erase this profile</b><span>Removes its wallets and entries</span></div></button></div>`,{i:4})+
 card('Install',`<p class="sm" style="line-height:1.55">iPhone: open in Safari, tap Share, then Add to Home Screen. Open it from the home screen icon and import your data there.<br>Android: open in Chrome, tap the menu, then Install app.<br>Data is saved only on this device, so back up now and then.</p><div id="inst"></div><p class="sm" style="margin-top:10px">Version ${VER}. Updates arrive on their own when you open the app online. Your data is never touched by updates.</p>`,{i:5})}

function vCats(){
 const p=P();const row=c=>`<div class="cr"><div class="tile" style="--c:${COLORS[c.code]||'#8e8e93'};width:40px;height:40px;border-radius:14px;font-size:12px">${esc(c.code)}</div><input class="field" data-cat="${esc(c.code)}" value="${esc(c.name)}" maxlength="24"></div>`;
 return`<div class="top" style="position:static"><div class="ttl" style="margin:0"><h1>Categories</h1></div><button class="ib g" data-act="tab" data-v="settings">${ico('back',20)}</button></div>`+
 card(rc()?'Withdrawals':'Expenses',p.cats.filter(c=>!c.inc).map(row).join('')+`<button class="btn soft" data-act="newcat" data-v="e" style="margin-top:8px">Add category</button>`,{i:1})+
 card(rc()?'Deposits':'Income',p.cats.filter(c=>c.inc).map(row).join('')+`<button class="btn soft" data-act="newcat" data-v="i" style="margin-top:8px">Add category</button>`,{i:2})+`<p class="sm" id="cerr" style="padding:0 8px"></p>`}

/* ---------- sheets ---------- */
let SH=null;const PAD='<div class="pad"></div>';
function sheet(html,mount){closeSheet(true);const L=$('#layer');L.innerHTML=`<div class="scrim"></div><div class="sheet" role="dialog">${SXB}<div class="grab"></div>${html}</div>`;const sc=$('.scrim',L),sh=$('.sheet',L);sc.onclick=()=>closeSheet();SH=sh;requestAnimationFrame(()=>requestAnimationFrame(()=>{sc.classList.add('on');sh.classList.add('on')}));mount&&mount(sh);return sh}
function closeSheet(now){const L=$('#layer');const sc=$('.scrim',L),sh=$('.sheet',L);SH=null;if(!sh)return;if(now){L.innerHTML='';return}sc.classList.remove('on');sh.classList.remove('on');setTimeout(()=>{if(!SH)L.innerHTML=''},450)}
const cleanW=s=>/^[A-Za-z0-9][A-Za-z0-9 ()&'.\-]{1,39}$/.test(s.trim());
const cleanOK=s=>/^[A-Za-z0-9][A-Za-z0-9 ]{1,23}$/.test(s.trim());

let A=null;
function openAdd(t,pre){
 if(!P().wallets.length){toast('Create a '+LB().w1.toLowerCase()+' first');setTab('wallets');return openWallet()}
 const defW=(VW()[0]||P().wallets[0]).id;
 A=t?{edit:t.id,k:t.k,amt:String(t.a),w:t.w,to:t.to||'',c:t.c,m:t.m||'',t:t.t}:Object.assign({edit:null,k:rc()?'i':'e',amt:'',w:defW,to:'',c:'',m:'',t:Date.now()},pre||{});
 sheet(addHtml(),mountAdd)}
function addHtml(){
 const L=LB();const cs=P().cats.filter(c=>c.inc===(A.k==='i'));
 const dt=new Date(A.t-new Date(A.t).getTimezoneOffset()*6e4).toISOString().slice(0,16);const w=WM()[A.w];
 return`<h2>${A.edit?'Edit entry':'New entry'}</h2>
 <div class="seg" style="margin-bottom:4px">${(rc()?[['i','Deposit'],['e','Withdraw'],['t','Transfer']]:[['e','Expense'],['i','Income'],['t','Transfer']]).map(([k,v])=>`<button class="${A.k===k?'on':''}" data-a="k" data-v="${k}">${v}</button>`).join('')}</div>
 <div class="amt"><div class="big"><span id="amtv" class="${A.k==='i'?'inc':A.k==='e'?'exp':''}">${esc(SYM[(w||{}).cur||cur()]||'')}${A.amt||'0'}</span></div></div>
 <div class="kp">${[1,2,3,4,5,6,7,8,9,'.',0,'del'].map(k=>`<button data-a="key" data-v="${k}" aria-label="${k}">${k==='del'?ico('del',24):k}</button>`).join('')}</div>
 <div class="lbl"><span>${A.k==='t'?'From':L.w1}</span></div><div class="chips" style="margin-bottom:14px">${P().wallets.filter(x=>!x.hidden||x.id===A.w).map(x=>`<button class="chip ${A.w===x.id?'on':''}" data-a="w" data-v="${x.id}">${esc(x.name)}</button>`).join('')}</div>
 ${A.k==='t'?`<div class="lbl"><span>To</span></div><div class="chips" style="margin-bottom:14px">${P().wallets.filter(x=>x.id!==A.w&&(!x.hidden||x.id===A.to)).map(x=>`<button class="chip ${A.to===x.id?'on':''}" data-a="to" data-v="${x.id}">${esc(x.name)}</button>`).join('')||'<span class="sm">Add another '+L.w1.toLowerCase()+' to transfer.</span>'}</div>`:`<div class="lbl"><span>Category</span></div><div class="cg">${cs.map(c=>`<button class="${A.c===c.code?'on':''}" style="--c:${COLORS[c.code]||'#8e8e93'}" data-a="c" data-v="${c.code}"><div class="tile" style="--c:${COLORS[c.code]||'#8e8e93'}">${esc(c.code)}</div><span>${esc(c.name)}</span></button>`).join('')}</div>`}
 <div class="lbl"><span>Memo</span></div><input class="field" id="memo" placeholder="What was it for?" maxlength="80" value="${esc(A.m)}" autocomplete="off"><div class="chips" id="sug" style="margin:8px 0 12px"></div>
 <div class="lbl"><span>When</span></div><input class="field" type="datetime-local" id="when" value="${dt}">
 <div class="sticky"><button class="btn acc" data-a="save">${A.edit?'Save changes':'Save entry'}</button>${A.edit?`<button class="btn red" data-a="del">Delete entry</button>`:''}</div>`}
function mountAdd(sh){
 const memo=$('#memo',sh),when=$('#when',sh);
 const sug=()=>{const q=memo.value.trim().toLowerCase();const el=$('#sug',sh);if(!q){el.innerHTML='';return}const m={};for(const t of P().txns){const k=(t.m||'').trim();if(!k||!k.toLowerCase().startsWith(q)||k.toLowerCase()===q)continue;const o=m[k]||(m[k]={k,n:0,c:t.c});o.n++}el.innerHTML=Object.values(m).sort((a,b)=>b.n-a.n).slice(0,4).map(o=>`<button class="chip" data-a="sug" data-v="${esc(o.k)}" data-c="${o.c}">${esc(o.k)}</button>`).join('')};
 memo.oninput=()=>{A.m=memo.value;sug()};
 when.onchange=()=>{const v=new Date(when.value).getTime();if(v)A.t=v};
 sh.onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,v=b.dataset.v;
  if(a==='key'){buzz();let s=A.amt;if(v==='del')s=s.slice(0,-1);else if(v==='.'){if(!s.includes('.'))s=(s||'0')+'.'}else{if(s.includes('.')&&s.split('.')[1].length>=2)return;if(s.length>=11)return;s=s==='0'?String(v):s+v}A.amt=s;const w=WM()[A.w];const el=$('#amtv',sh);el.textContent=(SYM[(w||{}).cur||cur()]||'')+(s||'0');fit(el.parentNode)}
  else if(a==='sug'){A.m=v;if(A.k!=='t'&&!A.c&&b.dataset.c&&P().cats.find(c=>c.code===b.dataset.c&&c.inc===(A.k==='i')))A.c=b.dataset.c;redraw(sh)}
  else if(a==='save')saveAdd();
  else if(a==='del'){if(confirm('Delete this entry?')){P().txns=P().txns.filter(t=>t.id!==A.edit);dirty();closeSheet();render();toast('Deleted')}}
  else{if(a==='k'){A.k=v;if(v!=='t'&&!P().cats.find(c=>c.code===A.c&&c.inc===(v==='i')))A.c=''}else if(a==='w'){A.w=v;if(A.to===v)A.to=''}else if(a==='to')A.to=v;else if(a==='c')A.c=v;redraw(sh)}};
 sug()}
function redraw(sh){const top=sh.scrollTop;sh.innerHTML=SXB+'<div class="grab"></div>'+addHtml();mountAdd(sh);sh.scrollTop=top}
function saveAdd(){
 const a=parseFloat(A.amt);if(!(a>0)){toast('Enter an amount');buzz();return}
 if(A.k==='t'){if(!A.to){toast('Choose where it goes');return}}else if(!A.c){toast('Pick a category');return}
 const t={id:A.edit||uid(),t:A.t,k:A.k,c:A.k==='t'?'TX':A.c,a:Math.round(a*100)/100,m:(A.m||'').trim(),w:A.w,to:A.k==='t'?A.to:''};
 if(A.edit){const i=P().txns.findIndex(x=>x.id===A.edit);P().txns[i]=t}else P().txns.push(t);
 dirty();closeSheet();okAnim();buzz();render();toast('Saved')}

function openDetail(t){
 const w=WM()[t.w]||{name:'?',cur:cur()},c=cat(t.k==='t'?'TX':t.c);const col=t.k==='t'?'#8e8e93':(COLORS[t.c]||'#8e8e93');const d=new Date(t.t);
 const amt=t.k==='t'?money(t.a,w.cur):money(t.k==='e'?-t.a:t.a,w.cur,true);const kind=t.k==='t'?'Transfer':t.k==='i'?LB().inc:LB().exp;
 const row=(a,b)=>`<div class="row"><div class="m"><span style="margin:0">${a}</span><b>${b}</b></div></div>`;
 sheet(`<div style="text-align:center;margin:8px 0 18px"><div class="tile" style="--c:${col};margin:0 auto 12px;width:58px;height:58px;border-radius:20px;font-size:18px">${esc(String(t.k==='t'?'TX':t.c).slice(0,2))}</div><div class="big ${t.k==='i'?'inc':t.k==='e'?'exp':''}" style="font-size:clamp(34px,10vw,46px);font-weight:800;letter-spacing:-1.5px;white-space:nowrap">${amt}</div><p class="sm" style="margin-top:6px">${esc(t.m||c.name)}</p></div><div class="card" style="background:var(--chip);box-shadow:none;border:0;padding:6px 18px">${row('Type',kind)}${t.k==='t'?'':row('Category',esc(c.name))}${row(t.k==='t'?'From':LB().w1,esc(w.name))}${t.k==='t'?row('To',esc((WM()[t.to]||{}).name||'?')):''}${row('Date',d.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})+' at '+d.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}))}${t.m?row('Memo',esc(t.m)):''}</div><div class="sticky"><button class="btn acc" id="de">${ico('edit',18)} Edit</button><button class="btn red" id="dd">Delete</button></div>`,sh=>{
  $('#de',sh).onclick=()=>{closeSheet(true);openAdd(t)};
  $('#dd',sh).onclick=()=>{if(confirm('Delete this entry?')){P().txns=P().txns.filter(x=>x.id!==t.id);dirty();closeSheet();render();toast('Deleted')}}})}

function openWallet(w){
 const L=LB();
 if(!w){const defT=rc()?'savings':'bank';sheet(`<h2>New ${L.w1.toLowerCase()}</h2><div class="lbl"><span>Name</span></div><input class="field" id="wn" placeholder="${rc()?'e.g. Hollard Savings':'e.g. Fidelity Bank'}" maxlength="40" autocomplete="off"><div class="err" id="we"></div><div class="lbl" style="margin-top:16px"><span>Type</span></div><div class="cg" id="wt">${WTYPES.map(([k,v])=>`<button class="${k===defT?'on':''}" data-t="${k}" style="--c:var(--a1)"><div class="wic">${ico(k,20)}</div><span>${v}</span></button>`).join('')}</div><div class="lbl"><span>Currency</span></div><select class="field" id="wc">${CURS.map(c=>`<option ${c===cur()?'selected':''}>${c}</option>`).join('')}</select><div class="lbl" style="margin-top:16px"><span>Money already in it</span></div><input class="field" id="wo" inputmode="decimal" placeholder="0.00">${rc()?`<div class="lbl" style="margin-top:16px"><span>Goal (optional)</span></div><input class="field" id="wg" inputmode="decimal" placeholder="0.00">`:''}<div class="sticky"><button class="btn acc" id="wsave">Create ${L.w1.toLowerCase()}</button></div>`,sh=>{
  let type=defT;$('#wt',sh).onclick=e=>{const b=e.target.closest('[data-t]');if(!b)return;type=b.dataset.t;sh.querySelectorAll('#wt button').forEach(x=>x.classList.toggle('on',x===b))};
  $('#wsave',sh).onclick=()=>{const n=$('#wn',sh).value.trim();if(!cleanW(n)){$('#we',sh).textContent='Use 2 to 40 letters, numbers or spaces.';return}if(P().wallets.some(x=>x.name.toLowerCase()===n.toLowerCase())){$('#we',sh).textContent='You already have one with that name.';return}const o=parseFloat($('#wo',sh).value)||0;const g=rc()?(parseFloat($('#wg',sh).value)||0):0;P().wallets.push({id:uid(),name:n,type,cur:$('#wc',sh).value,open:o,goal:g});dirty();closeSheet();okAnim();render();toast('Created')}});return}
 const b=BAL()[w.id];
 sheet(`<h2>${esc(w.name)}</h2><p class="sm" style="margin:-8px 0 14px">${(WTYPES.find(t=>t[0]===w.type)||[])[1]} · ${w.cur}</p><div class="card" style="text-align:center;background:var(--chip);box-shadow:none;border:0"><div class="sm">Balance</div><div class="big fit" style="font-size:38px;font-weight:800;letter-spacing:-1px;white-space:nowrap;overflow:hidden">${money(b,w.cur)}</div></div>
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
function pickFile(accept,cb){const i=document.createElement('input');i.type='file';i.accept=accept;i.onchange=async()=>{const f=i.files[0];if(f)cb(await f.text())};i.click()}
function handleText(text){const t=text.trim();if(t.startsWith('{')){return restoreText(text)}const r=importInto(P(),text);if(!r){toast('That file does not look like a MoneyTrack CSV');return}dirty();okAnim();toast(`Added ${r.added.toLocaleString()}, skipped ${r.skipped.toLocaleString()} duplicates`);setTab(TAB==='settings'?'today':TAB)}
function doImport(){pickFile('*/*',handleText)}
function restoreText(text){try{const j=JSON.parse(text);if(!j||!Array.isArray(j.profiles)||!j.profiles.length)throw 0;if(!confirm('Replace everything on this device with this backup?'))return;const th=S.set.theme;S=fix(j);S.set.theme=th;_bal=_wm=_cm=null;save();applyTheme();shell();TAB='today';render();okAnim();toast('Backup restored')}catch(e){toast('That is not a MoneyTrack backup')}}
function doRestore(){pickFile('*/*',handleText)}

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
 const L=$('#layer');let i=0;
 L.innerHTML=`<div class="story"><div class="pb">${slides.map(()=>'<div><i></i></div>').join('')}</div><button class="ib g x" data-s="x">${ico('x',20)}</button><div class="sl" id="sl"></div></div>`;
 const st=$('.story',L);requestAnimationFrame(()=>st.classList.add('on'));
 const show=n=>{i=n;st.querySelectorAll('.pb div').forEach((b,k)=>{b.className=k<n?'d':k===n?'a':'';const x=b.firstChild;const cc=x.cloneNode();b.replaceChild(cc,x);cc.onanimationend=()=>{if(i===n)next()}});const sl=$('#sl',st);sl.style.setProperty('--g',slides[n].g);sl.innerHTML=slides[n].h;play(sl)};
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
 case'hf':H.f=v;H.n=120;render();break;
 case'hw':H.w=v;H.n=120;render();break;
 case'hm':H.m=v==='all'?'all':+v;H.n=120;render();break;
 case'more':H.n+=120;$('#hl').innerHTML=histList();countUps($('#hl'));break;
 case'theme':S.set.theme=v;save();applyTheme();render();break;
 case'cats':setTab('cats');break;
 case'import':doImport();break;
 case'export':shareFile('MoneyTrack-'+P().name.replace(/\s+/g,'')+'.csv',exportCSV(),'text/csv');break;
 case'backup':shareFile('MoneyTrack-backup.json',JSON.stringify(S),'application/json').then(()=>{S.set.lastBackup=Date.now();save();if(TAB==='today'||TAB==='settings')render()});break;
 case'restore':doRestore();break;
 case'wipe':if(confirm(`Erase everything in ${P().name}? Back up first if you want a copy.`)&&confirm('Really erase it?')){const p=P();p.wallets=[];p.txns=[];dirty();setTab('today');toast('Erased')}break;
 case'newcat':{const inc=v==='i';sheet(`<h2>New category</h2><input class="field" id="cn" placeholder="e.g. Pets" maxlength="24"><div class="err" id="ce"></div><div class="sticky"><button class="btn acc" id="cs">Add</button></div>`,sh=>{$('#cs',sh).onclick=()=>{const n=$('#cn',sh).value.trim();if(!cleanOK(n)){$('#ce',sh).textContent='Use 2 to 24 letters or numbers.';return}if(P().cats.some(c=>c.name.toLowerCase()===n.toLowerCase())){$('#ce',sh).textContent='That category exists.';return}const base=n.replace(/[^A-Za-z0-9]/g,'').toUpperCase();let code=base.slice(0,2),k=2;while(P().cats.concat(SYS_CATS).some(c=>c.code===code))code=base.slice(0,1)+(k++);P().cats.push({code,name:n,inc});COLORS[code]=COLORS[code]||PAL[P().cats.length%PAL.length];dirty();closeSheet();render()}});break}
 }});
document.addEventListener('input',e=>{if(e.target.id==='q'){H.q=e.target.value;H.n=120;$('#hl').innerHTML=histList();countUps($('#hl'))}});
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
PER=P().kind==='records'?'y':'m';applyTheme();shell();render();
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
window.__mt={S:()=>S,P,importInto,render,setTab,save,dirty,switchProfile,exportCSV,load:()=>load(),shell};
})();
