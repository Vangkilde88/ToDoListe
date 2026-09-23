import test from 'node:test';
import assert from 'node:assert/strict';
import {ITEMS,normalize} from '../game.mjs';
import {asset} from '../club-art.mjs';
import {world,upgradeArt,clubStage} from '../world.mjs';
test('all 48 upgrades have drawn assets and valid catalogue illustrations without emoji',()=>{
 const k=normalize({}).kids.Arthur;
 for(const i of ITEMS){const a=asset(i.id,k,true),svg=upgradeArt(i,k);assert.ok(a.length>40,i.id);assert.ok(svg.includes('<svg'),i.id);assert.ok(!/NaN|undefined|Infinity/.test(svg),i.id);assert.ok(!/\p{Extended_Pictographic}/u.test(svg),i.id);}
});
test('stadium stages change the scene without changing club data',()=>{
 const k=normalize({}).kids.Arthur;k.club.name='<script>test</script>';const first=world(k);assert.ok(!first.includes('<script>'));k.purchases.stand={};const local=world(k);k.purchases.bigstand={};k.purchases.arena={};const arena=world(k);k.purchases.final={};const snapshot=JSON.stringify(k),last=world(k);assert.equal(JSON.stringify(k),snapshot);assert.notEqual(first,local);assert.notEqual(local,arena);assert.notEqual(arena,last);assert.equal(clubStage(k),'CHAMPIONS ARENA');assert.ok(!/\p{Extended_Pictographic}/u.test(last));
});
