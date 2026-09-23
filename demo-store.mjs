// Explicit, isolated review mode: never loads Firebase or writes family data.
import {normalize} from './game.mjs';
const KEY='vangkilde-football-demo-v4';
export async function connectDemo(onData,onStatus){
 let s=normalize(JSON.parse(localStorage.getItem(KEY)||'{}'));
 const publish=()=>{localStorage.setItem(KEY,JSON.stringify(s));onData(s);onStatus('demo');};
 publish();return {mutate:async fn=>{const next=normalize(s);const result=fn(next);s=next;publish();return result;}};
}
