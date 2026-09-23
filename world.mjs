export const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function world(k){
 const p=k.purchases,has=id=>!!p[id],color=/^#[0-9a-f]{6}$/i.test(k.club.primary)?k.club.primary:'#285bdf',secondary=/^#[0-9a-f]{6}$/i.test(k.club.secondary)?k.club.secondary:'#f6ce60';
 const box=(x,y,w,h,label,c=color)=>`<g transform="translate(${x} ${y})"><path d="M0 0h${w}v${h}H0Z" fill="${c}"/><path d="M0 0l12 -12h${w}l-12 12Z" fill="${secondary}"/><path d="M${w} 0l12 -12v${h}l-12 12Z" fill="#173b3f"/><rect x="9" y="10" width="${Math.max(12,w-18)}" height="8" fill="#e6f8ff" opacity=".8"/><text x="${w/2}" y="${h-6}" text-anchor="middle" fill="white" font-size="9" font-weight="800">${label}</text></g>`;
 let scene=`<svg viewBox="0 0 900 580" role="img" aria-label="${escapeHTML(k.club.name)} med ${Object.keys(p).length} købte forbedringer" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#d6ebea"/><stop offset="1" stop-color="#eff2d6"/></linearGradient><pattern id="grass" width="50" height="50" patternUnits="userSpaceOnUse"><rect width="25" height="50" fill="#6caf75"/><rect x="25" width="25" height="50" fill="#64a66e"/></pattern></defs><rect width="900" height="580" fill="url(#sky)"/><circle cx="770" cy="75" r="36" fill="#fff4c0"/><path d="M0 160Q130 80 270 160T540 150T900 130V580H0" fill="#c0d8b9"/><path d="M0 340Q220 205 450 255T900 300V580H0Z" fill="#a2bf9d"/><path d="M50 330L475 70 850 330 430 540Z" fill="#aed18e"/><path d="M115 300L482 95 799 300 432 477Z" fill="none" stroke="#e4dab4" stroke-width="18" stroke-linejoin="round"/><g transform="translate(215 268) matrix(.86 -.43 .86 .43 0 0)"><rect x="-5" y="-5" width="320" height="220" fill="#91bf7f"/><rect width="310" height="210" fill="url(#grass)"/><g stroke="#d7ecc4" fill="none" stroke-width="2"><rect x="8" y="8" width="294" height="194"/><path d="M155 8v194M8 55h52v100H8M302 55h-52v100h52"/><circle cx="155" cy="105" r="30"/></g></g>`;
 // All pitch fixtures share the grass plane; goal posts rise vertically
 // from projected touch points instead of using unrelated screen positions.
 const project=(x,y)=>[215+.86*(x+y),268+.43*(y-x)];
 const point=([x,y])=>`${x.toFixed(2)},${y.toFixed(2)}`;
 for(const [x,depth] of [[8,-16],[302,16]]) {
  const a=project(x,75),b=project(x,135),c=project(x+depth,75),d=project(x+depth,135);
  const up=([x,y])=>[x,y-26];
  const stroke=has('net')?'#f9fbef':'#9b8662';
  scene+=`<g stroke-linejoin="round" stroke-linecap="round"><path d="M${point(a)}L${point(b)}L${point(d)}L${point(c)}Z" fill="#315842" opacity=".12"/>`;
  if(has('net')) {
   scene+=`<path d="M${point(up(a))}L${point(up(b))}L${point(up(d))}L${point(up(c))}Z M${point(up(c))}L${point(up(d))}L${point(d)}L${point(c)}Z" fill="#ffffff" fill-opacity=".12" stroke="#e4eedc" stroke-width="1"/>`;
   for(let i=1;i<6;i++) {
    const t=i/6,front=[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t],back=[c[0]+(d[0]-c[0])*t,c[1]+(d[1]-c[1])*t];
    scene+=`<path d="M${point(up(front))}L${point(up(back))}L${point(back)}" fill="none" stroke="#e4eedc" stroke-width=".8"/>`;
   }
   for(const h of [9,18])scene+=`<path d="M${point([c[0],c[1]-h])}L${point([d[0],d[1]-h])}" stroke="#e4eedc" stroke-width=".8"/>`;
  }
  scene+=`<path d="M${point(c)}L${point(up(c))}L${point(up(a))} M${point(d)}L${point(up(d))}L${point(up(b))}" fill="none" stroke="${stroke}" stroke-width="2"/><path d="M${point(a)}L${point(up(a))}L${point(up(b))}L${point(b)}" fill="none" stroke="${stroke}" stroke-width="3.5"/></g>`;
 }
 const [ballX,ballY]=project(155,120);
 scene+=`<ellipse cx="${ballX+2}" cy="${ballY+1}" rx="6" ry="3" fill="#315842" opacity=".22"/><g transform="translate(${ballX} ${ballY-5})"><circle r="5.5" fill="#fffdf1" stroke="#385349" stroke-width=".8"/><path d="M-2 -2L1 -3 3 0 1 2-2 1Z M-5 1l2 1 0 2 M1 -5l1 2 M4 3l-2 -1" fill="#30463e" stroke="#30463e" stroke-width=".7"/></g>`;
 if(has('flags'))for(const corner of [[8,8],[302,8],[302,202],[8,202]]) {
  const [x,y]=project(...corner);
  scene+=`<path d="M${x} ${y}v-23" stroke="#fff" stroke-width="2"/><path d="M${x} ${y-23}l16 5-16 6" fill="${color}"/>`;
 }
 if(has('fence'))scene+='<path d="M60 325L430 535 844 327" fill="none" stroke="#738c80" stroke-width="7" stroke-dasharray="3 7"/>';
 if(has('bench'))scene+=box(275,383,55,16,'BÆNK','#ad8460');
 if(has('score'))scene+=box(586,145,65,34,'0 : 0','#243e38');
 if(has('stand'))scene+=`<g transform="translate(350 160)"><path d="M0 0l100 -49 0 36-100 50Z" fill="${color}"/><path d="M0 0l100 -49 25 13-100 49Z" fill="${secondary}"/><path d="M9 4l100 -49M9 13l100 -49M9 22l100 -49" stroke="white" stroke-width="3" opacity=".6"/></g>`;
 if(has('bigstand'))scene+=box(580,304,110,55,'TRIBUNE');
 if(has('vip'))scene+=box(620,265,75,32,'VIP','#b39447');
 if(has('roof'))scene+='<path d="M575 296l125 0 18 -20-125 0Z" fill="#243e38"/>';
 if(has('arena'))scene+=`<path d="M183 256L464 110 704 228 419 390Z" fill="none" stroke="${has('final')?'#e9c65b':color}" stroke-width="18"/>`;
 if(has('lights'))for(const [x,y] of [[191,268],[483,129],[706,239],[405,409]])scene+=`<g transform="translate(${x} ${y})"><path d="M0 0v-79" stroke="#48615c" stroke-width="5"/><rect x="-17" y="-85" width="34" height="13" rx="3" fill="#fff8c7" stroke="#49655e" stroke-width="3"/></g>`;
 if(has('pitch'))scene+='<path d="M563 384l90 -45 95 48-90 45Z" fill="#5c9b73" stroke="#f1f7d9" stroke-width="2"/>';
 if(has('shed'))scene+=box(170,351,43,36,'SKUR','#92744b');
 if(has('changing'))scene+=box(158,397,67,32,'OMKL.');
 if(has('showers'))scene+=box(230,423,27,26,'🚿','#4b9eac');
 if(has('house'))scene+=box(304,450,has('center')?112:85,has('center')?80:50,'KLUBHUS',has('palace')?'#b19243':color);
 if(has('cafe')){scene+=box(420,474,50,28,'CAFÉ');scene+='<circle cx="482" cy="503" r="14" fill="#f0cb60"/><path d="M482 503v20" stroke="#665d46" stroke-width="3"/>';}
 if(has('shop'))scene+=box(492,451,56,34,'FANSHOP');
 if(has('museum'))scene+=box(190,446,72,45,'MUSEUM','#bdad84');
 if(has('media'))scene+=box(552,434,47,33,'MEDIA','#5a798c');
 if(has('gym'))scene+=box(726,324,63,42,'FITNESS');
 if(has('recovery'))scene+=box(778,356,33,25,'SPA','#60aebe');
 if(has('hall'))scene+=box(693,420,95,55,'TRÆNING');
 if(has('lab'))scene+=box(775,392,28,62,'LAB','#7099a4');
 if(has('elite'))scene+=box(582,483,96,55,'PERFORMANCE');
 if(has('campus'))scene+=box(701,475,65,48,'CAMPUS','#ae9447');
 if(has('academy'))scene+=box(96,308,65,48,'AKADEMI');
 if(has('bus'))scene+=`<g transform="translate(99 416)"><rect width="82" height="30" rx="7" fill="${color}"/><rect x="7" y="4" width="65" height="11" fill="#d6edef"/><circle cx="15" cy="30" r="7" fill="#293e3a"/><circle cx="66" cy="30" r="7" fill="#293e3a"/></g>`;
 const details={balls:[540,350,'⚽ ⚽'],cones:[570,383,'🔺 🔺 🔺'],ladder:[603,400,'▤'],minigoal:[701,387,'🥅'],wall:[659,445,'🎯'],vests:[429,257,'👕'],kit:[489,297,'👕'],captain:[451,314,'©'],assistant:[326,367,'🧢'],keeper:[255,277,'🧤'],coach:[653,410,'⏱'],scout:[111,374,'🔎'],star:[469,278,'🌟'],fans:[535,220,'🚩 🙌 🚩'],legends:[374,110,'🏆 LEGENDER'],trophy:[345,427,'🏆'],garden:[469,533,'🌳 🪑 🌳'],final:[471,97,'⭐ ⭐ ⭐']};
 for(const [id,[x,y,t]] of Object.entries(details))if(has(id))scene+=`<text x="${x}" y="${y}" font-size="18" fill="${secondary}">${t}</text>`;
 for(const [days,x,y,t] of [[3,340,520,'🥉'],[7,370,520,'⭐'],[14,410,450,'🚩'],[30,360,442,'👕'],[50,410,310,'🏅'],[100,277,446,'🗽']])if(k.achievements[days])scene+=`<text x="${x}" y="${y}" font-size="26">${t}</text>`;
 scene+='<g fill="#57825f"><circle cx="91" cy="276" r="20"/><circle cx="800" cy="291" r="22"/><circle cx="270" cy="487" r="18"/></g><text x="28" y="553" fill="#355747" font-size="11" letter-spacing="3">DIT STED. DINE VALG. DIN KLUB.</text></svg>';
 return scene;
}
