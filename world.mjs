import {ITEMS} from './game.mjs';
import {esc,P,poly,line,plane,dot,label,block,building,person,ball,tree,goal,stand,trophy,star,pitch,asset,ASSET_POS} from './club-art.mjs';
export const escapeHTML=esc;
const safeColor=(v,f)=>/^#[0-9a-f]{6}$/i.test(v)?v:f;
function palette(k){return {...k,club:{...k.club,primary:safeColor(k.club.primary,'#386da6'),secondary:safeColor(k.club.secondary,'#e5bc68')}};}
export function clubStage(k){const p=k.purchases;return p.final?'CHAMPIONS ARENA':p.arena?'VANGKILDE ARENA':p.bigstand?'STOR STADIONKLUB':p.stand?'LOKALSTADION':'HER BEGYNDER DRØMMEN';}
export function upgradeArt(item,k){k=palette(k);let art=asset(item.id,k,true);const [x,y]=P(0,0);const tall=item.id==='lights';
 if(['arena','final'].includes(item.id)){
  const trim=item.id==='final'?'#e1bf65':k.club.secondary;
  art=pitch(-90,-55,180,110,true)+stand(-105,-92,210,26,4,k.club.primary,trim,true,-1)+goal(-88,-15,true,-1,.65)+goal(88,-15,true,1,.65)+stand(-105,66,210,26,4,k.club.primary,trim,true,1);
  art+=`<g transform="translate(1160 0) scale(-1 1)">${stand(-65,-135,130,26,4,k.club.primary,trim,true,-1)+stand(-65,110,130,26,4,k.club.primary,trim,true,1)}</g>`;
  if(item.id==='final')for(let i=0;i<3;i++)art+=star(-28+i*28,-90,64,6,trim);
  return `<svg class="upgrade-art" viewBox="${x-190} ${y-145} 380 250" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${art}</svg>`;
 }
 return `<svg class="upgrade-art" viewBox="${x-100} ${y-(tall?145:110)} 280 ${tall?205:190}" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><ellipse cx="${x+25}" cy="${y+12}" rx="76" ry="22" fill="#bdcfc533"/>${art}</svg>`;}
export function world(raw){
 const k=palette(raw),p=k.purchases,has=id=>!!p[id],c=k.club.primary,a=k.club.secondary;
 const grown=has('stand')||has('arena'),elite=has('arena')||has('final');
 let s=`<svg class="club-illustration" viewBox="-135 -150 1430 905" role="img" aria-label="${esc(k.club.name)}: ${clubStage(k).toLocaleLowerCase('da')}, ${Object.keys(p).length} byggede forbedringer" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="club-land" x2=".3" y2="1"><stop stop-color="#e9efe6"/><stop offset="1" stop-color="#bacfbb"/></linearGradient><radialGradient id="club-light"><stop stop-color="#fcf2bc" stop-opacity=".26"/><stop offset="1" stop-color="#fcf2bc" stop-opacity="0"/></radialGradient></defs><rect x="-135" y="-150" width="1430" height="905" fill="url(#club-land)"/>`;
 // Continuous parkland, roads and planting; no floating island or disconnected ground.
 s+=plane(-385,-315,930,805,0,'#adc49f')+plane(-340,-285,855,730,0,'#bdd1ae');
 s+=plane(-330,380,850,46,0,'#879592')+line([[-330,403,1],[520,403,1]],'#d4d9c5',1.4);
 s+=plane(-305,-278,28,665,0,'#d7d0b9')+plane(-305,206,800,28,0,'#d7d0b9')+plane(263,-278,22,680,0,'#d7d0b9');
 for(let i=0;i<11;i++){s+=tree(-330+i*79,-294,.65+(i%3)*.12);s+=tree(-352,(-220+i*57),.7);}
 for(let i=0;i<7;i++)s+=tree(515,-210+i*88,.8);
 s+=plane(-245,-224,505,414,0,grown?'#abbab3':'#acc59b');
 s+=pitch(-200,-125,400,250,grown);
 if(!grown){for(const [x,y] of [[-185,-106],[-142,80],[158,100],[170,-85]])s+=plane(x,y,12,6,.1,'#a4af792e');}
 const objects=[];
 const add=(depth,html)=>objects.push({depth,html});
 // The base goals are replaced by the net purchase, not duplicated.
 add(-210,goal(-198,-23,has('net'),-1));add(210,goal(198,-23,has('net'),1));add(10,ball(3,8));
 if(has('flags'))for(const [x,y] of [[-198,-123],[198,-123],[-198,123],[198,123]])add(x+y,line([[x,y,0],[x,y,25]],'#f4f1de',1.5)+poly([[x,y,25],[x+17,y,20],[x,y,16]],c));
 if(has('fence'))for(const y of [-212,194]){let f='';for(let x=-245;x<=250;x+=16)f+=line([[x,y,0],[x,y,20]],'#688d87',.8);f+=line([[-245,y,20],[250,y,20]],'#92aaa1',1.5);add(y+5,f);}
 if(has('lights'))for(const [x,y] of [[-240,-205],[246,-205],[-240,190],[246,190]]){
  const [sx,sy]=P(x,y,140);add(x+y,`<g transform="translate(${P(x,y)[0]-P(...ASSET_POS.lights)[0]} ${P(x,y)[1]-P(...ASSET_POS.lights)[1]})">${asset('lights',k)}</g>`);
  s+=`<ellipse cx="${sx}" cy="${sy+78}" rx="90" ry="55" fill="url(#club-light)"/>`;
 }
 // Stand upgrades replace their predecessor so the stadium genuinely grows.
 if(has('final'))add(-200,asset('final',k));else if(has('roof'))add(-200,asset('roof',k));else if(has('stand'))add(-200,asset('stand',k));
 if(has('bigstand'))add(205,asset('bigstand',k));
 if(elite){
  // Enclose the bowl with end stands, corner towers and an illuminated fascia.
  add(120,`<g transform="translate(1160 0) scale(-1 1)">${stand(-144,-260,287,44,6,c,has('final')?'#deb95f':a,true,-1)}</g>`);
  add(370,`<g transform="translate(1160 0) scale(-1 1)">${stand(-144,216,287,44,6,c,has('final')?'#deb95f':a,true,1)}</g>`);
  for(const [x,y] of [[-262,-213],[216,-213],[-262,172],[216,172]])add(x+y,building(x,y,46,35,66,'#eef0e7',has('final')?'#e0bd63':a));
  add(218,poly([[-214,205,0],[214,205,0],[214,205,13],[-214,205,13]],'#203d4a')+label(0,206,5,has('final')?'CHAMPIONS ARENA':k.club.name.toUpperCase(),12,'#f4df9d'));
 }
 if(has('final'))for(let i=0;i<5;i++)add(-390,star(-70+i*34,-221,106,7,'#edc765'));
 const replacements=new Set(['net','flags','fence','lights','stand','bigstand','roof','arena','final']);
 if(has('palace')){replacements.add('house');replacements.add('center');}else if(has('center'))replacements.add('house');
 for(const item of ITEMS){if(!has(item.id)||replacements.has(item.id))continue;const [x,y]=ASSET_POS[item.id];add(x+y+20,`<g class="club-asset" data-upgrade="${item.id}"><title>${esc(item.name)}</title>${asset(item.id,k)}</g>`);}
 if(has('stand'))for(let i=0;i<(has('fans')?30:10);i++){const x=-180+i%15*25,y=-182+Math.floor(i/15)*8;add(-120,person(x,y,i%3?c:a,'#ba8b71',.65));}
 if(has('kit'))for(const [x,y] of [[-80,-65],[110,55],[-115,58],[135,-78]])add(x+y,person(x,y,c));
 if(k.achievements[3])add(268,trophy(-242,330));
 if(k.achievements[7])add(300,poly([[-240,345,3],[-205,345,3],[-205,345,20],[-240,345,20]],'#d3bb79')+label(-222,345,10,'SPONSOR',5,'#263f47'));
 if(k.achievements[14])add(320,line([[15,360,0],[15,360,62]],'#eaeede',2)+poly([[15,360,62],[43,360,55],[43,360,34],[15,360,42]],c));
 if(k.achievements[30])add(390,block(55,360,24,10,31,'#314955','#e4d19c')+poly([[60,371,25],[65,371,28],[69,371,26],[73,371,28],[78,371,25],[75,371,21],[74,371,10],[64,371,10],[63,371,21]],a));
 if(k.achievements[50])add(420,block(90,360,18,18,17,'#455e64','#d6c58c')+ball(99,369,24,true));
 if(k.achievements[100])add(450,block(135,355,23,23,19,'#5b7274','#c6c9b0')+`<g transform="translate(0 -18)">${person(147,367,'#b39c62','#b39c62',1.6)}</g>`);
 objects.sort((a,b)=>a.depth-b.depth);s+=objects.map(o=>o.html).join('');
 // Foreground planting frames the stadium without covering the pitch.
 for(let i=0;i<9;i++)s+=tree(-280+i*93,453,.8+(i%2)*.25);
 s+=`<g transform="translate(-70 675)"><rect width="320" height="48" rx="12" fill="#f3f6eccf"/><text x="18" y="21" font-family="Arial,sans-serif" font-weight="700" font-size="11" letter-spacing="2" fill="#2d5549">${clubStage(k)}</text><text x="18" y="37" font-family="Arial,sans-serif" font-size="10" fill="#6a8072">${Object.keys(p).length} af ${ITEMS.length} forbedringer bygget</text></g></svg>`;
 return s;
}
