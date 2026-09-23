import test from 'node:test';
import assert from 'node:assert/strict';
import {KIDS,ITEMS,TASKS,normalize,reward,complete,buy,dayKey,previousDay,streak,resetRoutine} from '../game.mjs';
const now=Date.parse('2026-09-23T12:00:00Z');
function finish(s,n,t,elapsed=394){s.kids[n].routines[t].start=now-elapsed*1000;TASKS[t].forEach((_,i)=>s.checks[t][n+'_'+i]=true);return complete(s,n,t,now);}
test('legacy migration retains balances, unknown data, timers, reward dates and correctly shifts hug checks',()=>{
 const raw={date:dayKey(now),checks:{morgen:{Arthur_6:true},aften:{Arthur_3:true}},kids:{Arthur:{stars:37,eveningStart:now-700000,lastMorningRewardDate:dayKey(now)},Leonora:{stars:90}},custom:{preserve:true}};
 const s=normalize(raw,now);assert.equal(s.kids.Arthur.stars,37);assert.equal(s.checks.morgen.Arthur_7,true);assert.equal(s.checks.morgen.Arthur_6,undefined);assert.equal(s.checks.aften.Arthur_4,true);assert.equal(s.kids.Arthur.routines.aften.start,now-700000);assert.equal(s.kids.Leonora.stars,90);assert.equal(s.custom.preserve,true);assert.deepEqual(normalize(s,now),s);assert.equal(finish(s,'Arthur','morgen'),null);assert.equal(raw.checks.morgen.Arthur_6,true);
});
test('strict time thresholds and untimed/slow routine always receive five',()=>{
 for(const [seconds,total] of [[null,5],[900,5],[600,5],[599.9,7],[420,7],[419.9,9],[300,9],[299.9,10]]){const r=reward(seconds);assert.equal(r.base+r.bonus,total);}
});
test('all tasks required; reward once; children isolated; reset cannot farm stars',()=>{
 const s=normalize({},now);assert.equal(complete(s,'Arthur','morgen',now),null);
 const r=finish(s,'Arthur','morgen');assert.equal(r.earned,9);assert.equal(s.kids.Arthur.stars,9);assert.equal(s.kids.Bertil.stars,0);assert.equal(finish(s,'Arthur','morgen'),null);
 resetRoutine(s,'Arthur','morgen');assert.equal(finish(s,'Arthur','morgen'),null);assert.equal(s.kids.Arthur.stars,9);
 assert.equal(finish(s,'Arthur','aften',900).earned,5);
});
test('daily reset preserves progression and starts fresh timers at Danish midnight',()=>{
 const s=normalize({},now);finish(s,'Arthur','morgen');s.kids.Arthur.club.name='A United';s.kids.Arthur.stars=100;buy(s,'Arthur','balls',now);
 const next=normalize(s,Date.parse('2026-09-23T22:01:00Z'));assert.equal(next.date,'2026-09-24');assert.equal(next.kids.Arthur.stars,90);assert.ok(next.kids.Arthur.purchases.balls);assert.equal(next.kids.Arthur.routines.morgen.start,null);assert.deepEqual(next.checks.morgen,{});assert.equal(next.kids.Arthur.club.name,'A United');
});
test('purchases enforce funds, prerequisite graph and unique ownership',()=>{
 const s=normalize({},now);assert.throws(()=>buy(s,'Arthur','balls',now),/mangler/);s.kids.Arthur.stars=2000;assert.throws(()=>buy(s,'Arthur','bigstand',now),/først/);buy(s,'Arthur','bench',now);buy(s,'Arthur','stand',now);buy(s,'Arthur','bigstand',now);assert.equal(s.kids.Arthur.stars,1665);assert.throws(()=>buy(s,'Arthur','bigstand',now),/allerede/);assert.equal(s.kids.Arthur.stars,1665);assert.equal(Object.keys(s.kids.Bertil.purchases).length,0);
});
test('streak requires both routines and awards milestones/sponsor only once',()=>{
 const s=normalize({},now),k=s.kids.Arthur;let d=previousDay(s.date);for(let i=0;i<6;i++){k.history[d]={morgen:{},aften:{}};d=previousDay(d);}
 finish(s,'Arthur','morgen');const result=finish(s,'Arthur','aften');assert.equal(streak(k,s.date),7);assert.equal(k.stars,38);assert.ok(k.achievements[7]);assert.equal(result.unlocked.length,1);assert.ok(k.achievements[3]);resetRoutine(s,'Arthur','aften');finish(s,'Arthur','aften');assert.equal(k.stars,38);
 delete k.history[previousDay(s.date)].aften;assert.equal(streak(k,s.date),1);assert.ok(k.achievements[7]);
});
test('catalog has 48 attainable upgrades, acyclic prerequisites and months of progression',()=>{
 assert.equal(ITEMS.length,48);assert.ok(ITEMS.reduce((s,i)=>s+i.price,0)>20*180);const ids=new Set(ITEMS.map(i=>i.id));assert.equal(ids.size,48);
 function walk(id,seen=new Set()){assert.ok(!seen.has(id));const item=ITEMS.find(i=>i.id===id);assert.ok(item);item.requires.forEach(r=>walk(r,new Set([...seen,id])));}
 ITEMS.forEach(i=>walk(i.id));assert.ok(ITEMS.some(i=>i.price<=10&&!i.requires.length));
});
