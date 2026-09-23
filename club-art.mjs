// Hand-drawn isometric assets. All structures use the same ground projection.
export const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const P=(x,y,z=0)=>[580+(x-y)*.85,245+(x+y)*.425-z*.85];
const points=a=>a.map(p=>P(...p).map(v=>v.toFixed(1)).join(',')).join(' ');
export const poly=(a,fill,stroke='none',width=1)=>`<polygon points="${points(a)}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round"/>`;
export const line=(a,color='#e4e8df',width=2)=>`<polyline points="${points(a)}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
export const plane=(x,y,w,d,z,c)=>poly([[x,y,z],[x+w,y,z],[x+w,y+d,z],[x,y+d,z]],c);
export const dot=(x,y,z,r,c)=>{const [a,b]=P(x,y,z);return `<circle cx="${a}" cy="${b}" r="${r}" fill="${c}"/>`;};
export const label=(x,y,z,text,size=8,color='#f1f4e9')=>{const [a,b]=P(x,y,z);return `<text x="${a}" y="${b}" fill="${color}" font-size="${size}" font-family="Arial,sans-serif" font-weight="700" text-anchor="middle" letter-spacing="1">${esc(text)}</text>`;};
export function block(x,y,w,d,h,wall='#d6dedc',roof='#edf2ea'){
 return plane(x+5,y+5,w,d,0,'#173f3820')+poly([[x,y+d,0],[x+w,y+d,0],[x+w,y+d,h],[x,y+d,h]],wall)+poly([[x+w,y,0],[x+w,y+d,0],[x+w,y+d,h],[x+w,y,h]],'#536f77')+plane(x,y,w,d,h,roof);
}
export function building(x,y,w,d,h,c,accent,style='flat'){
 let s=block(x,y,w,d,h,'#dce4df','#536d79');
 s+=plane(x-3,y-3,w+6,d+6,h+2,style==='gold'?'#d9b965':c);
 for(let z=12;z<h-5;z+=17)for(let a=7;a<w-8;a+=17)s+=poly([[x+a,y+d+.2,z],[x+a+11,y+d+.2,z],[x+a+11,y+d+.2,z+9],[x+a,y+d+.2,z+9]],'#294e60','#82bcc7',.6);
 for(let a=7;a<d-6;a+=15)s+=poly([[x+w+.2,y+a,10],[x+w+.2,y+a+9,10],[x+w+.2,y+a+9,Math.min(h-5,27)],[x+w+.2,y+a,Math.min(h-5,27)]],'#284b5b');
 s+=poly([[x+w*.43,y+d+1,0],[x+w*.58,y+d+1,0],[x+w*.58,y+d+1,16],[x+w*.43,y+d+1,16]],'#254859');
 s+=line([[x,y+d,h-3],[x+w,y+d,h-3]],accent,3);
 if(style==='solar')for(let i=0;i<3;i++)s+=plane(x+7+i*18,y+8,14,d-16,h+3,'#213d53')+line([[x+14+i*18,y+8,h+3],[x+14+i*18,y+d-8,h+3]],'#6494ac',.7);
 if(style==='gable')s+=poly([[x-3,y-3,h],[x+w+3,y-3,h],[x+w+3,y+d/2,h+17],[x-3,y+d/2,h+17]],accent)+poly([[x-3,y+d/2,h+17],[x+w+3,y+d/2,h+17],[x+w+3,y+d+3,h],[x-3,y+d+3,h]],c);
 return s;
}
export function person(x,y,c='#e9b95a',skin='#c68b66',tall=1){
 const [a,b]=P(x,y);return `<g transform="translate(${a} ${b}) scale(${tall})"><ellipse cy="1" rx="4" ry="2" fill="#163e392a"/><path d="M-2 -5v5M2 -5v5" stroke="#263c4e" stroke-width="2.2"/><path d="M-3 -13h6l1 8h-8Z" fill="${c}"/><path d="M-3 -12l-2 5M3 -12l2 5" stroke="${skin}" stroke-width="1.6"/><circle cy="-17" r="3" fill="${skin}"/><path d="M-3 -18q3 -4 6 0" stroke="#3c3433" stroke-width="2"/></g>`;
}
export function ball(x,y,z=3,gold=false){const [a,b]=P(x,y,z);return `<g transform="translate(${a} ${b})"><ellipse cy="4" rx="4" ry="1.5" fill="#183c3425"/><circle r="3.5" fill="${gold?'#ebc365':'#fffbed'}" stroke="#455a53" stroke-width=".6"/><path d="M0 -2l2 1-.6 2h-2.8L-2 -1Z" fill="#334b48"/></g>`;}
export function tree(x,y,size=1){const [a,b]=P(x,y);return `<g transform="translate(${a} ${b}) scale(${size})"><ellipse cx="8" cy="3" rx="15" ry="6" fill="#16423318"/><path d="M0 0v-20" stroke="#6a6951" stroke-width="4"/><path d="M-17 -19Q-23 -37-9 -42Q-7 -57 7 -48Q24 -47 20 -29Q26 -16 8 -14Z" fill="#396c5c"/><path d="M-17 -24Q-22 -42-6 -43Q-7 -55 7 -48Q16 -40 8 -32Z" fill="#5b9270"/></g>`;}
export function goal(x,y,net=true,direction=1,scale=1){
 const w=46*scale,h=23*scale,d=15*scale*direction;let s='';
 if(net){s+=poly([[x+d,y,0],[x+d,y+w,0],[x+d,y+w,h],[x+d,y,h]],'#ffffff18');for(let i=0;i<=6;i++)s+=line([[x,y+w*i/6,h],[x+d,y+w*i/6,h],[x+d,y+w*i/6,0]],'#eef5e3',.65);for(let z=0;z<=h;z+=5)s+=line([[x+d,y,z],[x+d,y+w,z]],'#eff7e7',.65);}
 return s+line([[x+d,y,0],[x+d,y,h],[x,y,h],[x,y,0]],net?'#c4d8d6':'#9b8d72',1.5)+line([[x+d,y+w,0],[x+d,y+w,h],[x,y+w,h],[x,y+w,0]],net?'#c4d8d6':'#9b8d72',1.5)+line([[x,y,0],[x,y,h],[x,y+w,h],[x,y+w,0]],net?'#fffdf1':'#9b8d72',2.5);
}
export function stand(x,y,w,d,rows,c,accent,roof=false,facing=1){
 let s=block(x,y,w,d,8,'#9aacb1','#b9c5c5');
 for(const r of Array.from({length:rows},(_,i)=>facing===1?i:rows-1-i)){
  const yy=y+(facing===1?r:rows-1-r)*d/rows,hh=12+r*7;
  s+=block(x,yy,w,d/rows,hh,'#8ca0aa','#c7d1d3');
  for(let a=7;a<w-4;a+=9)s+=plane(x+a,yy+2,6,d/rows-3,hh+1,Math.floor(a/35)%3===0?accent:c);
  s+=plane(x+w*.46,yy,w*.075,d/rows,hh+1,'#e7e4d5');
 }
 const back=y+(facing===1?d:0),h=rows*7+27;
 s+=line([[x,back,0],[x,back,h],[x+w,back,h],[x+w,back,0]],'#b4c7cc',2);
 if(roof){
  s+=plane(x-7,y-5,w+14,d+10,h,'#dae4e5');
  for(let a=0;a<w;a+=24)s+=line([[x+a,y-5,h+1],[x+a,y+d+5,h+1]],'#a4b9c0',1);
  s+=line([[x-7,y+(facing===1?-5:d+5),h],[x+w+7,y+(facing===1?-5:d+5),h]],accent,4);
 }
 return s;
}
export function trophy(x,y,z=0){return block(x-7,y-5,14,10,8,'#485963','#c4b276')+line([[x,y,z+8],[x,y,z+22]],'#e6be5c',4)+poly([[x-9,y,z+31],[x+9,y,z+31],[x+5,y,z+21],[x-5,y,z+21]],'#f5d477')+line([[x-9,y,z+29],[x-14,y,z+29],[x-12,y,z+22],[x-5,y,z+22]],'#d3aa4e',2)+line([[x+9,y,z+29],[x+14,y,z+29],[x+12,y,z+22],[x+5,y,z+22]],'#d3aa4e',2);}
export const ASSET_POS={net:[-200,-23],flags:[-205,-130],bench:[-80,148],score:[-245,-140],fence:[-215,160],stand:[-215,-194],lights:[245,185],bigstand:[-215,157],vip:[-135,-220],roof:[-215,-194],arena:[210,-155],final:[-220,-194],balls:[285,130],cones:[280,50],ladder:[285,95],minigoal:[375,90],wall:[355,15],pitch:[285,-135],gym:[335,-260],recovery:[420,-245],hall:[310,-190],lab:[440,-150],elite:[345,190],campus:[440,150],shed:[-260,238],changing:[-190,258],showers:[-110,272],house:[-30,270],cafe:[75,290],shop:[140,235],trophy:[-50,320],garden:[85,350],museum:[-165,340],media:[210,240],center:[-30,270],palace:[-30,270],vests:[-50,35],kit:[65,-15],captain:[-65,-40],assistant:[-155,148],keeper:[-185,-10],coach:[325,75],scout:[245,250],bus:[-265,350],academy:[240,-270],star:[20,40],fans:[-260,130],legends:[-150,205]};
export function asset(id,k,thumb=false){
 const c=k.club.primary,a=k.club.secondary,[x,y]=thumb?[0,0]:ASSET_POS[id],p=k.purchases;let s='';
 const b=(w,d,h,style='flat')=>building(x,y,w,d,h,c,a,style);
 switch(id){
 case 'net':return goal(x,y,true,-1);
 case 'flags':return line([[x,y,0],[x,y,26]],'#f6f3dc',2)+poly([[x,y,26],[x+19,y,21],[x,y,15]],c);
 case 'bench':return block(x,y,70,17,5,'#617986',c)+poly([[x,y+17,5],[x+70,y+17,5],[x+70,y+17,27],[x,y+17,27]],'#b4dae04d','#a5bdc5')+plane(x,y,70,17,27,'#8bb1c199')+line([[x,y,0],[x,y,27],[x+70,y,27],[x+70,y,0]],'#e1e8df',2);
 case 'score':return line([[x+5,y,0],[x+5,y,49],[x+60,y,49],[x+60,y,0]],'#6a7c87',3)+poly([[x,y,33],[x+66,y,33],[x+66,y,70],[x,y,70]],'#172c3b','#8fa6ab',2)+label(x+33,y,53,'0 : 0',12,'#bff6a2')+label(x+33,y,39,'HOME    AWAY',4);
 case 'fence':for(let i=0;i<100;i+=10)s+=line([[x+i,y,0],[x+i,y,23]],'#748d8b',1);return s+line([[x,y,23],[x+100,y,23],[x+100,y,10],[x,y,10]],'#93a6a0',1.3);
 case 'stand':return stand(x,y,thumb?160:420,35,3,c,a,false,-1);
 case 'bigstand':return stand(x,y,thumb?160:420,42,5,c,a,false,1);
 case 'roof':return stand(x,y,thumb?160:420,40,5,c,a,true,-1);
 case 'arena':return stand(x,y,thumb?170:50,thumb?50:305,6,c,a,true,1);
 case 'final':return stand(x,y,thumb?170:420,55,7,c,'#e1bf65',true,-1);
 case 'vip':return building(x,y,thumb?110:220,28,61,'#263c52',a)+plane(x,y+29,thumb?110:220,9,26,'#d2af5d');
 case 'lights':s=line([[x,y,0],[x,y,135]],'#6c8593',5)+line([[x-9,y,0],[x,y,115],[x+9,y,0]],'#b9c7c8',1);for(let i=0;i<4;i++)for(let j=0;j<2;j++)s+=poly([[x-20+i*12,y,130+j*9],[x-10+i*12,y,130+j*9],[x-10+i*12,y,137+j*9],[x-20+i*12,y,137+j*9]],'#fff6c3','#819598',.7);return s;
 case 'balls':for(let i=0;i<5;i++)s+=ball(x+i%3*10,y+Math.floor(i/3)*10);return s+block(x-6,y+22,45,12,10,'#a08654','#d5b674');
 case 'cones':for(let i=0;i<5;i++){const xx=x+i*17;s+=plane(xx-4,y-4,8,8,0,'#ed7e38')+poly([[xx-4,y,0],[xx+4,y,0],[xx,y,12]],'#ff9942')+line([[xx-2,y,5],[xx+2,y,5]],'#fff2cf',2);}return s;
 case 'ladder':for(let i=0;i<7;i++)s+=line([[x,y+i*7,1],[x+18,y+i*7,1]],'#efbf57',2);return s+line([[x,y,1],[x,y+42,1],[x+18,y+42,1],[x+18,y,1]],'#455552',1);
 case 'minigoal':return goal(x,y,true,1,.7);
 case 'wall':s=block(x,y,35,5,29,'#6591a0','#73979d');for(let i=0;i<3;i++)s+=dot(x+7+i*10,y+6,15,3,'#f7d071');return s;
 case 'pitch':return pitch(x,y,135,83,true);
 case 'shed':return building(x,y,40,32,23,'#725c49','#c8aa71','gable');
 case 'changing':return b(72,35,25);
 case 'showers':return building(x,y,30,29,28,'#65aab1',a)+block(x+5,y+5,17,15,37,'#6b9fa9','#c1e0dc');
 case 'house':return b(90,58,43,'gable');
 case 'center':return b(98,65,73,'solar');
 case 'palace':return b(105,70,91,'gold')+trophy(x+52,y+30,99);
 case 'cafe':s=b(46,32,23);for(const dx of [0,31])s+=umbrella(x+dx,y+50,a);return s;
 case 'shop':s=b(55,40,32);for(let i=0;i<6;i++)s+=plane(x+i*10,y+40,10,13,26,i%2?c:'#f6f0d8');return s;
 case 'trophy':return block(x-10,y-7,32,20,6,'#738d8b','#ece9d0')+trophy(x+5,y+3,6);
 case 'garden':s=plane(x-10,y-10,90,50,0,'#d8c6a0');for(const dx of [0,40])s+=tree(x+dx,y+25,.55)+umbrella(x+dx+10,y,a);return s;
 case 'museum':s=b(80,40,44);for(let i=0;i<5;i++)s+=block(x+6+i*15,y+41,5,5,38,'#f0e9d2','#fff5d9');return s+trophy(x+40,y+20,51);
 case 'media':return b(55,40,46)+line([[x+35,y+15,46],[x+35,y+15,80]],'#799aa6',2)+dot(x+35,y+15,76,9,'#d9e4e6');
 case 'gym':return b(70,52,32,'solar');
 case 'recovery':return building(x,y,47,50,23,'#76b9c0','#deeadf')+plane(x+8,y+5,30,32,24,'#9ce1e1');
 case 'hall':return b(115,70,50,'gable');
 case 'lab':return b(36,40,65,'solar');
 case 'elite':return b(110,62,56,'solar')+building(x+75,y-13,37,30,72,'#c9e2e4',a);
 case 'campus':return building(x,y,70,44,38,'#c7a951',a,'solar')+tree(x+75,y+45,.6);
 case 'academy':return b(70,48,40,'gable');
 case 'bus':s=block(x,y,100,30,26,c,'#e3e9e1');for(let i=0;i<6;i++)s+=poly([[x+6+i*14,y+31,13],[x+16+i*14,y+31,13],[x+16+i*14,y+31,22],[x+6+i*14,y+31,22]],'#243f54');for(const dx of [19,79])s+=dot(x+dx,y+31,3,5,'#233744')+dot(x+dx,y+31,3,2,'#a9b9bd');return s+line([[x+3,y+31,9],[x+97,y+31,9]],a,3);
 case 'vests':return person(x,y,'#f3b340')+person(x+23,y+14,'#f3b340');
 case 'kit':return person(x,y,c)+person(x+28,y-28,c)+person(x+45,y+26,c);
 case 'captain':return person(x,y,c)+line([[x-3,y,11],[x-3,y,13]],'#f0d26c',3);
 case 'assistant':return person(x,y,'#263f53')+block(x+6,y,8,3,11,'#b29b70','#fff2d1');
 case 'keeper':return person(x,y,'#e3a84f')+person(x+18,y+22,'#45586a');
 case 'coach':return person(x,y,'#364d62')+person(x-16,y+9,c);
 case 'scout':return person(x,y,'#64755f')+block(x+5,y,8,3,12,'#e6d8bb','#fff3d7');
 case 'star':return person(x,y,c,'#b97a57',1.2)+star(x,y,28,7,a);
 case 'fans':for(let i=0;i<12;i++)s+=person(x+(i%4)*11,y+Math.floor(i/4)*12,i%3?c:a);return s;
 case 'legends':return line([[x,y,0],[x,y,45],[x+100,y,45],[x+100,y,0]],'#a5b6b1',2)+poly([[x,y,45],[x+100,y,45],[x+100,y,24],[x,y,24]],'#d3b564')+label(x+50,y,33,'LEGENDER',9,'#253f45');
 default:return '';
 }
}
export function star(x,y,z,r,c){const [a,b]=P(x,y,z);return `<polygon points="${Array.from({length:10},(_,i)=>{const t=i*Math.PI/5-Math.PI/2,rr=i%2?r*.45:r;return `${a+Math.cos(t)*rr},${b+Math.sin(t)*rr}`}).join(' ')}" fill="${c}"/>`;}
export function umbrella(x,y,c){return line([[x,y,0],[x,y,20]],'#7c8271',2)+poly([[x-13,y,20],[x,y-13,20],[x+13,y,20],[x,y+13,20]],c)+poly([[x-13,y,20],[x,y-13,20],[x,y,27]],'#f9e3ad')+plane(x-8,y-8,16,16,9,'#b48e61');}
export function pitch(x,y,w,d,pro){let s=plane(x-4,y-4,w+8,d+8,0,'#547b63');for(let i=0;i<10;i++)s+=plane(x+i*w/10,y,w/10,d,0,pro?(i%2?'#448b61':'#50996a'):(i%2?'#82a971':'#89ae77'));
 s+=line([[x+3,y+3,1],[x+w-3,y+3,1],[x+w-3,y+d-3,1],[x+3,y+d-3,1],[x+3,y+3,1]],'#e6eed5',1.4)+line([[x+w/2,y+3,1],[x+w/2,y+d-3,1]],'#e6eed5',1.3);
 const circ=Array.from({length:49},(_,i)=>[x+w/2+Math.cos(i/48*Math.PI*2)*d*.16,y+d/2+Math.sin(i/48*Math.PI*2)*d*.16,1]);s+=line(circ,'#e6eed5',1.3);
 for(const end of [0,1]){const xx=x+(end?w-3:3),dir=end?-1:1;s+=line([[xx,y+d*.25,1],[xx+dir*w*.15,y+d*.25,1],[xx+dir*w*.15,y+d*.75,1],[xx,y+d*.75,1]],'#e6eed5',1.3);}
 return s;
}
