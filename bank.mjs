// Integer hundredths avoid lost fractions and rounding gains from transfers.
export const BANK_RATE=.10;
const LIMIT=900000000000000;
const dayNumber=d=>Math.floor(Date.parse(d+'T00:00:00Z')/86400000);
const dateOf=n=>new Date(n*86400000).toISOString().slice(0,10);
export function bankInterest(cents){return Math.min(LIMIT-cents,Math.round(cents/10));}
export function settleBank(k,today){
 k.bank ||= {balance:0,deposited:0,withdrawn:0,interest:0,lastDate:today,history:[]};
 const b=k.bank;
 let start=dayNumber(b.lastDate),end=dayNumber(today);
 if(!Number.isFinite(start)||!Number.isFinite(end)||start>=end)return b;
 // No historical interest before this bank existed. Empty accounts skip idle days.
 if(!b.balance){b.lastDate=today;return b;}
 for(let d=start+1;d<=end;d++){
  const earned=bankInterest(b.balance);b.balance+=earned;b.interest+=earned;
  if(earned)b.history.push({date:dateOf(d),type:'interest',amount:earned,balance:b.balance});
  b.history=b.history.slice(-60);
  if(!earned)break;
 }
 b.lastDate=today;return b;
}
export function transferBank(s,name,direction,amount){
 if(!['deposit','withdraw'].includes(direction)||!Number.isSafeInteger(amount)||amount<=0)throw Error('Vælg et positivt antal hele stjerner.');
 const k=s.kids[name];if(!k)throw Error('Ukendt konto.');
 const b=settleBank(k,s.date),cents=amount*100;
 if(!Number.isSafeInteger(cents))throw Error('Beløbet er for stort.');
 if(direction==='deposit'){
  if(k.stars<amount)throw Error('Du har ikke så mange stjerner til rådighed.');
  if(b.balance+cents>LIMIT)throw Error('Banken kan ikke rumme så stort et beløb.');
  k.stars-=amount;b.balance+=cents;b.deposited+=cents;
 }else{
  if(b.balance<cents)throw Error('Du har ikke så mange hele stjerner i banken.');
  if(!Number.isSafeInteger(k.stars+amount))throw Error('Beløbet er for stort.');
  b.balance-=cents;k.stars+=amount;b.withdrawn+=cents;
 }
 b.history.push({date:s.date,type:direction,amount:cents,balance:b.balance});b.history=b.history.slice(-60);
 k.ledger.push({date:s.date,amount:direction==='deposit'?-amount:amount,label:direction==='deposit'?'Sat i Stjernebanken':'Hævet fra Stjernebanken'});
 return true;
}
export function projection(cents,days){for(let i=0;i<days;i++)cents+=bankInterest(cents);return cents;}
