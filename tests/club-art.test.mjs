import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {ITEMS,normalize,buy} from '../game.mjs';
import {world,upgradeArt,clubStage,sceneNodes} from '../world.mjs';
test('all 48 upgrades and scene sprites have production artwork',()=>{
 const k=normalize({}).kids.Arthur;
 for(const i of ITEMS){const svg=upgradeArt(i);assert.ok(svg.includes((i.id==='final'?'final-detail':i.id)+'.webp'));assert.ok(!/NaN|undefined|Infinity|\p{Extended_Pictographic}/u.test(svg));assert.ok(existsSync(new URL('../assets/club/'+i.id+'.webp',import.meta.url)));k.purchases[i.id]={};}
 for(const n of sceneNodes(k))assert.ok(existsSync(new URL('../assets/club/'+n.art+'.webp',import.meta.url)),n.art);
 for(const art of ['start','start-net','terrain','endgame-reference','final-detail',...[3,7,14,30,50,100].map(x=>'award-'+x)])assert.ok(existsSync(new URL('../assets/club/'+art+'.webp',import.meta.url)),art);
});
test('every purchase changes the scene and keeps all owned upgrades represented',()=>{
 const state=normalize({}),k=state.kids.Arthur;k.stars=50000;
 assert.deepEqual(sceneNodes(k).map(n=>n.id),['start']);
 for(const item of ITEMS){const before=world(k);buy(state,'Arthur',item.id);assert.notEqual(world(k),before,item.id);const represented=new Set(sceneNodes(k).flatMap(n=>[n.id,...n.includes]));for(const id of Object.keys(k.purchases))assert.ok(represented.has(id),id);for(const id of represented)assert.ok(id==='start'||k.purchases[id],id);}
 assert.ok(world(k).includes('endgame-reference.webp'));assert.equal(clubStage(k),'CHAMPIONS ARENA');
});
test('independent branches do not advance the stadium or mutate saved data',()=>{
 const k=normalize({}).kids.Arthur;k.club.name='<script>test</script>';k.purchases.balls={};k.purchases.shed={};const snapshot=JSON.stringify(k);const html=world(k);assert.equal(JSON.stringify(k),snapshot);assert.ok(!html.includes('<script>'));assert.equal(clubStage(k),'HER BEGYNDER DRØMMEN');assert.ok(sceneNodes(k).some(n=>n.id==='start'));
});
