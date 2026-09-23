// Pure game rules shared by the browser and migration/regression tests.
export const KIDS = ['Arthur', 'Bertil', 'Vester'];
export const RULES = { base: 5, bonuses: [{seconds:600,stars:2},{seconds:420,stars:2},{seconds:300,stars:1}] };
export const TASKS = {
 morgen:['🥣 Spise morgenmad','🪥 Børste tænder','👕 Tage tøj på','🚽 Tisse af','💇 Børste hår','🧴 Solcreme','🎒 Pak skoletaske','🤗 Giv mor og far et kram'],
 aften:['🚽 Tisse af','🪥 Børste tænder','👕 Tage tøj af','💧 Drikke vand','🤗 Giv mor og far et kram']
};
export const CATEGORIES = {stadion:'Stadion',training:'Træningsanlæg',clubhouse:'Klubhus',team:'Holdet'};
const rows = {
 stadion:[['net','Nye målnet',15,'','Hvide net på begge mål'],['flags','Hjørneflag',20,'','Fire klubfarvede flag'],['bench','Udskiftningsbænke',35,'','Bænke langs banen'],['score','Resultattavle',50,'','Digital tavle'],['fence','Hegn om banen',60,'','Hegn langs anlægget'],['stand','Lille tribune',100,'bench','En tribune med fans'],['lights','Projektører',120,'','Fire lysmaster'],['bigstand','Stor tribune',200,'stand','Ekstra tribuner'],['vip','VIP-område',250,'bigstand','VIP-loge'],['roof','Tribunetag',300,'bigstand','Tag over tribunen'],['arena','Vangkilde Arena',900,'roof,lights,score','Lukket arena med lyskrans'],['final','Champions Arena',1800,'arena,vip','Gyldent stadion og stjerner']],
 training:[['balls','Træningsbolde',10,'','Bolde ved banen'],['cones','Træningskegler',15,'','Orange kegler'],['ladder','Agility-udstyr',25,'cones','Agility-stige'],['minigoal','Ekstra træningsmål',40,'','Små mål'],['wall','Skudvæg',55,'balls','Væg med skydeskiver'],['pitch','Træningsbane',100,'minigoal','Ekstra grøn bane'],['gym','Fitnessrum',150,'','Fitnessbygning'],['recovery','Restitutionsrum',180,'gym','Blåt rum ved fitness'],['hall','Indendørs træningshal',300,'pitch','Stor træningshal'],['lab','Tekniklaboratorium',400,'hall','Tekniktårn'],['elite','Elite Performance Center',850,'pitch,gym','Moderne træningscenter'],['campus','Verdensklasse-campus',1400,'elite,hall','Guldtag og ekstra træningsfelter']],
 clubhouse:[['shed','Redskabsskur',20,'','Lille træskur'],['changing','Omklædningsrum',60,'shed','Omklædningsbygning'],['showers','Bedre omklædningsrum',90,'changing','Blå tilbygning'],['house','Klubhus',120,'changing','Klubhus i klubbens farve'],['cafe','Cafeteria',100,'house','Cafe med parasoller'],['shop','Fanshop',150,'house','Butik med markise'],['trophy','Pokalskab',80,'house','Pokalsymbol ved klubhuset'],['garden','Fanplads',180,'cafe','Plads med borde og fans'],['museum','Klubmuseum',350,'house,trophy','Museum med søjler'],['media','Mediecenter',450,'house','Bygning med antenne'],['center','Stort klubcenter',800,'museum,shop','Klubhus med flere etager'],['palace','Klubbens palads',1500,'center,garden','Gyldent tag på klubcentret']],
 team:[['vests','Træningsveste',15,'','Spillere i veste'],['kit','Nye spilledragter',30,'','Spillere i klubfarver'],['captain','Anførerbind',20,'kit','Anfører på banen'],['assistant','Assistenttræner',60,'','Træner ved sidelinjen'],['keeper','Målmandstræner',100,'assistant','Målmand og træner'],['coach','Fysisk træner',150,'assistant','Træner ved træningsområdet'],['scout','Talentspejder',180,'','Spejder med notesbog'],['bus','Holdbus',250,'kit','Klubfarvet bus'],['academy','Akademi',450,'scout','Akademibygning'],['star','Stjernespiller',600,'academy','Spiller med guldstjerne'],['fans','Fanklub',300,'kit','Fans med flag'],['legends','Legendeholdet',1200,'star,coach','Gyldent holdbanner']]
};
export const ITEMS = Object.entries(rows).flatMap(([category,list])=>list.map(([id,name,price,pre,visual])=>({id,name,price,category,requires:pre?pre.split(','):[],visual})));
export const ACHIEVEMENTS=[{days:3,name:'Godt i gang',icon:'🥉'},{days:7,name:'Sponsorbonus',icon:'⭐',stars:20},{days:14,name:'Klubvimpel',icon:'🚩'},{days:30,name:'Jubilæumstrøje',icon:'👕'},{days:50,name:'Guld-fodbold',icon:'🏅'},{days:100,name:'Klublegenden',icon:'🗽'}];
export function dayKey(now=Date.now()) { return new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Copenhagen',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(now)); }
export function previousDay(day) { const d=new Date(day+'T12:00:00Z'); d.setUTCDate(d.getUTCDate()-1); return d.toISOString().slice(0,10); }
export function reward(seconds,rules=RULES) {return {base:rules.base,bonus:seconds===null?0:rules.bonuses.reduce((s,b)=>s+(seconds<b.seconds?b.stars:0),0)};}
const clone = x=>JSON.parse(JSON.stringify(x));
export function normalize(input={},now=Date.now()) {
 const s=clone(input || {}); const old=(s.schemaVersion||0)<4;
 if(s.schemaVersion>4) throw Error('Appen skal opdateres før du fortsætter.');
 s.kids ||= {}; s.checks ||= {}; s.checks.morgen ||= {}; s.checks.aften ||= {};
 // Keep old child records in the document for a reversible migration, never display them.
 for(const name of KIDS) {
  const k=s.kids[name] ||= {};
  k.stars=Number.isFinite(k.stars)?Math.max(0,k.stars):0;
  k.club ||= {name:name==='Arthur'?'Arthur United':name+' FC',primary:'#285bdf',secondary:'#f6ce60',logo:'🛡️',created:false};
  k.purchases ||= {}; k.history ||= {}; k.achievements ||= {}; k.ledger ||= [];
  k.routines ||= {}; k.streak ||= 0; k.bestStreak ||= 0;
  for(const type of ['morgen','aften']) {
   const field=type==='morgen'?'lastMorningRewardDate':'lastEveningRewardDate';
   k.routines[type] ||= {start:type==='aften'?(k.eveningStart||null):null,finished:k[field]===s.date,seconds:null};
   if(old && k[field]) { k.history[k[field]] ||= {}; k.history[k[field]][type] ||= {legacy:true,earned:1,seconds:null}; }
   if(old) { const index=type==='morgen'?6:3; const key=name+'_'+index;
    if(Object.hasOwn(s.checks[type],key)) {s.checks[type][name+'_'+(index+1)]=s.checks[type][key]; delete s.checks[type][key];}
   }
  }
 }
 s.schemaVersion=4;
 if(s.date!==dayKey(now)) {s.date=dayKey(now);s.checks={morgen:{},aften:{}};for(const n of KIDS) for(const t of ['morgen','aften'])s.kids[n].routines[t]={start:null,finished:false,seconds:null};}
 return s;
}
export function streak(k,today=dayKey()) {
 let d=k.history[today]?.morgen && k.history[today]?.aften?today:previousDay(today),n=0;
 while(k.history[d]?.morgen && k.history[d]?.aften) {n++;d=previousDay(d);}return n;
}
export function ledger(k,amount,label,date){k.ledger.push({amount,label,date});}
export function complete(s,name,type,now=Date.now()) {
 const k=s.kids[name],r=k.routines[type],day=s.date;
 if(k.history[day]?.[type] || !TASKS[type].every((_,i)=>s.checks[type][name+'_'+i])) return null;
 const seconds=r.start===null?null:Math.max(0,(now-r.start)/1000),p=reward(seconds),earned=p.base+p.bonus;
 r.finished=true;r.seconds=seconds;k.stars+=earned;k.history[day] ||= {};k.history[day][type]={seconds,earned,...p};
 k[type==='morgen'?'lastMorningRewardDate':'lastEveningRewardDate']=day;
 ledger(k,earned,type==='morgen'?'Morgen gennemført':'Aften gennemført',day);
 k.streak=streak(k,day);k.bestStreak=Math.max(k.bestStreak,k.streak);
 const unlocked=[];
 for(const a of ACHIEVEMENTS) if(k.streak>=a.days && !k.achievements[a.days]) {k.achievements[a.days]=day;unlocked.push(a);if(a.stars){k.stars+=a.stars;ledger(k,a.stars,a.name,day);}}
 return {...p,earned,seconds,balance:k.stars,unlocked};
}
export function buy(s,name,id,now=Date.now()) {
 const k=s.kids[name],i=ITEMS.find(x=>x.id===id);
 if(!i)throw Error('Ukendt opgradering.');
 if(k.purchases[id])throw Error('Den har du allerede bygget.');
 const missing=i.requires.filter(x=>!k.purchases[x]);
 if(missing.length)throw Error('Du skal først bygge '+missing.map(x=>ITEMS.find(i=>i.id===x).name).join(' og ')+'.');
 if(k.stars<i.price)throw Error('Du mangler '+(i.price-k.stars)+' stjerner.');
 k.stars-=i.price;k.purchases[id]={date:dayKey(now),price:i.price};ledger(k,-i.price,i.name,dayKey(now));if(k.goal===id)k.goal=null;return i;
}
export function resetRoutine(s,name,type) {
 TASKS[type].forEach((_,i)=>delete s.checks[type][name+'_'+i]);
 s.kids[name].routines[type]={start:null,finished:false,seconds:null};
 // History stays: resetting never grants a second reward for the same day.
}
