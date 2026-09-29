import test from 'node:test';
import assert from 'node:assert/strict';
import {normalize,dayKey,buy} from '../game.mjs';
import {settleBank,transferBank,projection} from '../bank.mjs';
import {bankPage,bankSummary} from '../bank-ui.mjs';
const now=Date.parse('2026-09-29T12:00:00Z');
function account(){const s=normalize({},now);s.kids.Arthur.stars=100;return s;}
test('opening a bank never changes existing stars, purchases or old history',()=>{
 const raw={schemaVersion:4,date:dayKey(now),kids:{Arthur:{stars:77,purchases:{balls:{price:10}},history:{'2026-09-28':{morgen:{earned:10}}}}}};
 const s=normalize(raw,now);assert.equal(s.kids.Arthur.stars,77);assert.deepEqual(s.kids.Arthur.purchases,raw.kids.Arthur.purchases);assert.deepEqual(s.kids.Arthur.history,raw.kids.Arthur.history);assert.equal(s.kids.Arthur.bank.balance,0);assert.deepEqual(normalize(s,now),s);
});
test('whole-star transfers conserve value, isolate children and reject overdrafts',()=>{
 const s=account();transferBank(s,'Arthur','deposit',100);assert.equal(s.kids.Arthur.stars,0);assert.equal(s.kids.Arthur.bank.balance,10000);assert.equal(s.kids.Bertil.bank.balance,0);
 for(const n of [-1,0,.1,NaN,Infinity])assert.throws(()=>transferBank(s,'Arthur','deposit',n));
 assert.throws(()=>transferBank(s,'Arthur','deposit',1));assert.throws(()=>transferBank(s,'Arthur','withdraw',101));assert.throws(()=>buy(s,'Arthur','balls',now));
 transferBank(s,'Arthur','withdraw',25);assert.equal(s.kids.Arthur.stars,25);assert.equal(s.kids.Arthur.bank.balance,7500);assert.equal(s.kids.Arthur.bank.deposited,10000);assert.equal(s.kids.Arthur.bank.withdrawn,2500);
});
test('daily interest compounds once, catches up missed days and cannot be farmed by reopening',()=>{
 const s=account();transferBank(s,'Arthur','deposit',100);const next=normalize(s,Date.parse('2026-09-30T12:00:00Z'));
 assert.equal(next.kids.Arthur.bank.balance,11000);assert.equal(next.kids.Arthur.bank.interest,1000);assert.deepEqual(normalize(next,Date.parse('2026-09-30T20:00:00Z')),next);
 const later=normalize(next,Date.parse('2026-10-01T12:00:00Z'));assert.equal(later.kids.Arthur.bank.balance,12100);assert.equal(later.kids.Arthur.bank.interest,2100);
 const month=normalize(s,Date.parse('2026-10-29T12:00:00Z'));assert.equal(month.kids.Arthur.bank.balance,projection(10000,30));assert.equal(month.kids.Arthur.stars,0);
});
test('midnight uses Copenhagen calendar days including daylight saving, deposits earn no past interest',()=>{
 let s=normalize({},Date.parse('2026-10-24T21:59:00Z'));s.kids.Arthur.stars=10;transferBank(s,'Arthur','deposit',10);
 s=normalize(s,Date.parse('2026-10-24T22:00:00Z'));assert.equal(s.kids.Arthur.bank.balance,1100);
 s=normalize(s,Date.parse('2026-10-25T22:30:00Z'));assert.equal(s.kids.Arthur.bank.balance,1100);
 s=normalize(s,Date.parse('2026-10-25T23:00:00Z'));assert.equal(s.kids.Arthur.bank.balance,1210);
 s.kids.Arthur.stars=10;transferBank(s,'Arthur','deposit',10);assert.equal(s.kids.Arthur.bank.balance,2210);
 transferBank(s,'Arthur','withdraw',22);assert.equal(s.kids.Arthur.bank.balance,10);
 assert.throws(()=>transferBank(s,'Arthur','withdraw',1));const before=s.kids.Arthur.bank.balance;settleBank(s.kids.Arthur,'2026-10-25');assert.equal(s.kids.Arthur.bank.balance,before);
});
test('withdraw and redeposit cannot create interest; history is bounded and existing balance survives rendering',()=>{
 const s=account();transferBank(s,'Arthur','deposit',100);
 for(let i=0;i<80;i++){transferBank(s,'Arthur','withdraw',1);transferBank(s,'Arthur','deposit',1);}
 assert.equal(s.kids.Arthur.bank.balance,10000);assert.equal(s.kids.Arthur.bank.interest,0);assert.equal(s.kids.Arthur.bank.history.length,60);
 const before=JSON.stringify(s);assert.ok(bankPage(s.kids.Arthur).includes('121'));assert.ok(bankSummary(s.kids.Arthur,'Arthur').includes('data-name="Arthur"'));assert.equal(JSON.stringify(s),before);
});
