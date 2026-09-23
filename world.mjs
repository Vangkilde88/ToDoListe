import {ITEMS} from './game.mjs';
export const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function world(k){
 const p=k.purchases,has=id=>!!p[id],color=/^#[0-9a-f]{6}$/i.test(k.club.primary)?k.club.primary:'#285bdf',secondary=/^#[0-9a-f]{6}$/i.test(k.club.secondary)?k.club.secondary:'#f6ce60';
 const box=(x,y,w,h,label,c=color)=>`<g transform="translate(${x} ${y})"><path d="M0 0h${w}v${h}H0Z" fill="${c}"/><path d="M0 0l12 -12h${w}l-12 12Z" fill="${secondary}"/><path d="M${w} 0l12 -12v${h}l-12 12Z" fill="#173b3f"/><rect x="9" y="10" width="${Math.max(12,w-18)}" height="8" fill="#e6f8ff" opacity=".8"/><text x="${w/2}" y="${h-6}" text-anchor="middle" fill="white" font-size="9" font-weight="800">${label}</text></g>`;
 let scene=`<svg viewBox="0 0 900 580" role="img" aria-label="${escapeHTML(k.club.name)} med ${Object.keys(p).length} købte forbedringer" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#d6ebea"/><stop offset="1" stop-color="#eff2d6"/></linearGradient><pattern id="grass" width="50" height="50" patternUnits="userSpaceOnUse"><rect width="25" height="50" fill="#6caf75"/><rect x="25" width="25" height="50" fill="#64a66e"/></pattern><filter id="shadow"><feDropShadow dx="0" dy="10" stdDeviation="10" flood-opacity=".12"/></filter></defs><rect width="900" height="580" fill="url(#sky)"/><circle cx="770" cy="75" r="36" fill="#fff4c0"/><path d="M0 160Q130 80 270 160T540 150T900 130V580H0" fill="#c0d8b9"/><path d="M-80 350L470 70 980 380 430 670Z" fill="#a2bf9d"/><path d="M50 345L475 135 850 345 430 555Z" fill="#4c8066"/><path d="M50 330L475 120 850 330 430 540Z" fill="#aed18e" filter="url(#shadow)"/><path d="M115 340L482 159 799 340 432 517Z" fill="none" stroke="#e4dab4" stroke-width="24"/><g transform="translate(215 268) matrix(.86 -.43 .86 .43 0 0)"><rect x="-8" y="-8" width="326" height="226" rx="6" fill="#538761"/><rect width="310" height="210" fill="url(#grass)"/><g stroke="#d7ecc4" fill="none" stroke-width="2"><rect x="8" y="8" width="294" height="194"/><path d="M155 8v194M8 55h52v100H8M302 55h-52v100h52"/><circle cx="155" cy="105" r="30"/></g></g>`;
 // Old goals are present from day one; nets and flags alter the actual pitch.
 for(const [x,y] of [[230,302],[492,170]])scene+=`<g transform="translate(${x} ${y})"><path d="M0 30V0l38 19v30M0 0l-12 7v30l12 -7M38 19l-12 7v30" stroke="${has('net')?'#fff':'#8b7e67'}" stroke-width="4" fill="none"/>${has('net')?'<path d="M0 8l38 19M0 16l38 19M0 24l38 19M8 4v30M18 9v30M28 14v30" stroke="#fff" opacity=".8"/>':''}</g>`;
 scene+='<text x="430" y="291" font-size="15">⚽</text>';
 if(has('flags'))for(const [x,y] of [[211,269],[478,135],[661,228],[394,362]])scene+=`<path d="M${x} ${y}v-23" stroke="#fff" stroke-width="2"/><path d="M${x} ${y-23}l16 5-16 6" fill="${color}"/>`;
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
