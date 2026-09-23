import {normalize} from './game.mjs';
const KEY='familieTodoV3';
export function readLocal(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}}
export function backup(data){try{localStorage.setItem(KEY,JSON.stringify(data));return true}catch{return false}}
export async function connect(onData,onStatus) {
 const [appModule,authModule,f]=await Promise.all(['app','auth','firestore'].map(x=>import(`https://www.gstatic.com/firebasejs/11.10.0/firebase-${x}.js`)));
 const app=appModule.initializeApp({apiKey:'AIzaSyAmhOxG77FVLSaGqhP2uQAlnkc3a5tWVfc',authDomain:'vangkildelommepenge.firebaseapp.com',projectId:'vangkildelommepenge',storageBucket:'vangkildelommepenge.firebasestorage.app',messagingSenderId:'176791827841',appId:'1:176791827841:web:5173c142f5858331fb2480'});
 await authModule.signInAnonymously(authModule.getAuth(app));
 const db=f.getFirestore(app),ref=f.doc(db,'todo','state');
 // Same account and document as the existing app. Each write re-reads current cloud data.
 // The first migration stores the complete old document inside the new document,
 // so no additional Firestore collection permissions are required.
 async function mutate(fn){
  return f.runTransaction(db,async tx=>{
   const snap=await tx.get(ref),raw=snap.exists()?snap.data():readLocal();
   const next=normalize(raw);
   if(!raw.schemaVersion || raw.schemaVersion<4) next.legacyBackupV3=raw;
   const result=fn(next);tx.set(ref,next);return result;
  });
 }
 await mutate(()=>{});
 const unsubscribe=f.onSnapshot(ref,{includeMetadataChanges:true},snap=>{
  if(snap.exists()){const data=normalize(snap.data());const saved=backup(data);onData(data);onStatus(snap.metadata.fromCache?'offline':saved?'ready':'backup-error');}
 },()=>onStatus('error'));
 return {mutate,unsubscribe};
}
