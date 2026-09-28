import {ITEMS,ACHIEVEMENTS} from './game.mjs';

export const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const esc=escapeHTML;
export const ART_ROOT='./assets/club/';
const known=new Map(ITEMS.map(i=>[i.id,i]));
export function clubStage(k){const p=k.purchases;return p.final?'CHAMPIONS ARENA':p.arena?'VANGKILDE ARENA':p.bigstand?'STOR STADIONKLUB':p.stand?'LOKALSTADION':'HER BEGYNDER DRØMMEN';}
export function upgradeArt(item){
 if(!known.has(item.id))return '';
 return `<svg class="upgrade-art" viewBox="0 0 400 300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><image href="${ART_ROOT}${item.id==='final'?'final-detail':item.id}.webp" x="18" y="14" width="364" height="272" preserveAspectRatio="xMidYMid meet"/></svg>`;
}
export function awardArt(days){return ACHIEVEMENTS.some(a=>a.days===days)?`<img class="award-art" src="${ART_ROOT}award-${days}.webp" width="512" height="512" alt="" loading="lazy">`:'';}

// Coordinates describe screen-space footprints in one fixed camera. Ownership,
// not star totals or purchase count, determines every building and replacement.
export function sceneNodes(k){
 const p=k.purchases,has=id=>!!p[id],nodes=[];
 const add=(id,x,y,w,h,art=id,includes=[])=>nodes.push({id,art,x,y,w,h,includes});
 const arena=has('final')?'final':has('arena')?'arena':null;
 if(arena){
  add(arena,55,110,890,610,arena,['net','flags','bench','fence','stand','bigstand','roof','arena','lights'].filter(id=>id!==arena&&has(id)));
 }else{
  const stand=has('roof')?'roof':has('bigstand')?'bigstand':has('stand')?'stand':null;
  if(stand)add(stand,310,115,395,235,stand,['stand','bigstand'].filter(id=>id!==stand&&has(id)));
  add(has('net')?'net':'start',125,235,690,500,has('net')?'start-net':'start');
  if(has('fence'))add('fence',102,223,745,520);
  if(has('flags'))[[219,379],[395,289],[514,629],[706,511]].forEach(([x,y])=>add('flags',x,y,24,40,'corner-flag'));
  if(has('bench')){add('bench',508,350,90,53,'dugout');add('bench',595,408,90,53,'dugout');}
 }
 if(has('lights')&&!arena)[[175,238],[745,351],[260,555],[735,580]].forEach(([x,y])=>add('lights',x,y,40,160,'floodlight'));
 if(has('score'))add('score',110,170,115,100);
 if(has('vip'))add('vip',715,125,205,150);

 // Independent training branch. Its top buildings absorb only their own
 // structural predecessors; optional equipment stays visible at every tier.
 if(has('campus'))add('campus',1070,55,410,250,'campus',['elite','gym','hall'].filter(has));
 else{
  if(has('hall'))add('hall',945,75,255,160);
  if(has('elite'))add('elite',1210,70,255,200,'elite',['gym'].filter(has));
  else if(has('gym'))add('gym',1230,110,220,150);
 }
 if(has('recovery'))add('recovery',1360,258,145,95);
 if(has('lab'))add('lab',1015,235,160,105);
 if(has('pitch'))add('pitch',1060,332,390,205);
 const equipment=[['balls',1010,380,25,26],['cones',1080,391,60,32],['ladder',1195,437,64,35],['minigoal',1145,390,60,40],['wall',1328,408,64,52]];
 for(const [id,x,y,w,h] of equipment)if(has(id))add(id,x,y,w,h);

 const home=has('palace')?'palace':has('center')?'center':has('house')?'house':null;
 if(home)add(home,1165,553,280,200,home,['house','center'].filter(id=>id!==home&&has(id)));
 if(has('shed'))add('shed',1020,549,95,72);
 if(has('showers'))add('showers',1020,629,132,90,'showers',['changing'].filter(has));
 else if(has('changing'))add('changing',1020,629,120,82);
 if(has('museum'))add('museum',1410,630,125,105);
 if(has('media'))add('media',1400,489,128,108);
 if(has('cafe'))add('cafe',1148,758,160,106);
 if(has('shop'))add('shop',1315,766,127,88);
 if(has('garden'))add('garden',986,725,158,124);
 if(has('trophy'))add('trophy',1205,733,30,32);

 if(has('academy'))add('academy',145,720,255,175);
 if(has('bus'))add('bus',700,870,208,94);
 if(has('vests'))add('vests',1170,450,39,31);
 if(has('kit'))add('kit',420,460,37,32);
 if(has('captain'))add('captain',461,488,10,23);
 if(has('assistant'))add('assistant',685,540,27,28);
 if(has('keeper'))add('keeper',1178,378,33,28);
 if(has('coach'))add('coach',1270,463,35,29);
 if(has('scout'))add('scout',1041,503,12,25);
 if(has('star'))add('star',508,521,18,25);
 if(has('fans'))add('fans',805,738,70,48);
 if(has('legends'))add('legends',520,798,150,112);
 return nodes.sort((a,b)=>(a.y+a.h)-(b.y+b.h));
}

function sceneImage(n){
 const item=known.get(n.id),name=item?.name||'Din første bane';
 const attrs=item?`class="world-object" data-action="inspect-upgrade" data-id="${n.id}" role="button" tabindex="0" aria-label="${esc(name)}"`:'';
 return `<g ${attrs} data-upgrade="${n.id}" data-includes="${n.includes.join(' ')}"><title>${esc(name)}</title><image href="${ART_ROOT}${n.art}.webp" x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" preserveAspectRatio="xMidYMax meet"/></g>`;
}
export function world(k){
 const count=ITEMS.filter(i=>k.purchases[i.id]).length;
 const primary=/^#[0-9a-f]{6}$/i.test(k.club.primary)?k.club.primary:'#174d3d';
 const secondary=/^#[0-9a-f]{6}$/i.test(k.club.secondary)?k.club.secondary:'#d5b366';
 return `<div class="club-landscape" style="--club:${primary};--second:${secondary}"><div class="landscape-caption"><span class="club-colours" aria-label="Dine klubfarver"></span><div><span>${clubStage(k)}</span><strong>${esc(k.club.name)}</strong></div><b>${count}<small> / 48</small></b></div><div class="landscape-viewport"><svg class="club-illustration" viewBox="0 0 1536 1024" role="group" aria-label="${esc(k.club.name)}: ${count} byggede forbedringer" xmlns="http://www.w3.org/2000/svg"><image href="${ART_ROOT}terrain.webp" width="1536" height="1024"/>${ITEMS.every(i=>k.purchases[i.id])?`<image href="${ART_ROOT}endgame-reference.webp" width="1536" height="1024"/><title>Din fuldt udbyggede klub · alle 48 forbedringer</title>`:sceneNodes(k).map(sceneImage).join('')}</svg></div><div class="landscape-controls"><span>${count===ITEMS.length?'Din drømmeklub · alle forbedringer bygget':'Dit anlæg · tryk på en forbedring'}</span><div><button data-action="world-zoom" data-zoom="out" aria-label="Zoom ud">−</button><button data-action="world-zoom" data-zoom="reset" aria-label="Vis hele klubben">Hele klubben</button><button data-action="world-zoom" data-zoom="in" aria-label="Zoom ind">+</button></div></div>${ACHIEVEMENTS.some(a=>k.achievements[a.days])?`<div class="club-honours" aria-label="Dine vundne milepæle">${ACHIEVEMENTS.filter(a=>k.achievements[a.days]).map(a=>`<div>${awardArt(a.days)}<span>${esc(a.name)}</span></div>`).join('')}</div>`:''}</div>`;
}
