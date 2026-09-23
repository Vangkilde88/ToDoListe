import test from 'node:test';
import assert from 'node:assert/strict';
import {normalize,KIDS,TASKS,complete} from '../game.mjs';
import {mutationQueue,sharedRoutines} from '../shared-routines.mjs';
const now=Date.parse('2026-09-23T12:00:00Z');

test('three children have independent controls on the same routine screen',()=>{
 const data=normalize({},now),html=sharedRoutines(data,'morgen',now);
 for(const name of KIDS){assert.ok(html.includes(`aria-label="Start morgen for ${name}"`));assert.equal((html.match(new RegExp(`data-action="task" data-name="${name}"`,'g'))||[]).length,8);}
 assert.equal((html.match(/data-clock=/g)||[]).length,3);
 assert.ok(!html.includes('<dialog'));assert.ok(!html.includes('Leonora'));
});

test('queued taps from three children survive slow saves and keep rewards isolated',async()=>{
 const queue=mutationQueue(),data=normalize({},now),writes=[];
 for(const [index,name] of KIDS.entries())data.kids[name].routines.morgen.start=now-[100,394,700][index]*1000;
 const pending=[];
 for(let i=0;i<TASKS.morgen.length;i++)for(const name of KIDS)pending.push(queue(async()=>{
  await new Promise(resolve=>setTimeout(resolve,1));
  data.checks.morgen[name+'_'+i]=true;complete(data,name,'morgen',now);writes.push(name);
 }));
 await Promise.all(pending);
 assert.equal(writes.length,24);assert.deepEqual(KIDS.map(n=>data.kids[n].stars),[10,9,5]);
 const html=sharedRoutines(data,'morgen',now);
 assert.equal((html.match(/FÆRDIG!/g)||[]).length,3);
 assert.ok(html.includes('+10 ⭐'));assert.ok(html.includes('+9 ⭐'));assert.ok(html.includes('+5 ⭐'));
 assert.ok(KIDS.every(n=>!data.kids[n].routines.aften.finished));
});

test('failed save does not discard the next child’s queued action',async()=>{
 const queue=mutationQueue(),order=[];
 const first=queue(async()=>{order.push('Arthur');throw Error('offline');});
 const second=queue(async()=>{order.push('Bertil');return 42;});
 await assert.rejects(first,/offline/);assert.equal(await second,42);assert.deepEqual(order,['Arthur','Bertil']);
});

test('one finished child shows a local receipt while other columns remain usable',()=>{
 const data=normalize({},now);data.kids.Arthur.routines.aften.start=now-100000;
 TASKS.aften.forEach((_,i)=>data.checks.aften['Arthur_'+i]=true);complete(data,'Arthur','aften',now);
 const html=sharedRoutines(data,'aften',now);
 assert.equal((html.match(/FÆRDIG!/g)||[]).length,1);
 for(const name of ['Bertil','Vester'])assert.ok(html.includes(`aria-label="Start aften for ${name}" >Start`));
 assert.equal(data.kids.Bertil.stars,0);assert.equal(data.kids.Vester.stars,0);
});
