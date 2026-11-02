(()=>{
'use strict';
const input=document.getElementById('playerId');if(!input)return;
const fr=document.documentElement.lang==='fr';
const t=fr?{check:'Vérifier l’ID',busy:'Vérification…',format:'Saisissez un ID composé de 5 à 15 chiffres.',invalid:'Compte introuvable. Vérifiez l’ID PUBG Mobile.',error:'Vérification indisponible. Réessayez ou envoyez une demande de vérification manuelle.',manual:'Demander une vérification manuelle',name:'Nom du joueur',confirm:'Je confirme que ce compte est le bon.',need:'Vérifiez l’ID et confirmez le nom du joueur avant de commander.',pending:'Compte à vérifier manuellement'}:{check:'تحقق من ID',busy:'جارٍ التحقق…',format:'أدخل ID مكوّنًا من 5 إلى 15 رقمًا.',invalid:'لم يتم العثور على الحساب. راجع ID اللاعب في PUBG Mobile.',error:'تعذّر التحقق الآن. أعد المحاولة أو أرسل طلبًا للمراجعة اليدوية.',manual:'طلب مراجعة ID يدويًا',name:'اسم اللاعب',confirm:'أؤكد أن هذا هو الحساب المطلوب.',need:'تحقق من ID وأكّد اسم اللاعب قبل إرسال الطلب.',pending:'الحساب بحاجة إلى مراجعة يدوية'};
let verified='',nickname='',manual=false,seq=0,controller;
input.inputMode='numeric';input.dir='ltr';
const box=document.createElement('div');box.className='ff-verify';
box.innerHTML='<button type="button" class="ff-check"></button><p class="ff-status" role="status" aria-live="polite"></p><div class="ff-result" hidden><label for="verifiedPlayerName"></label><input id="verifiedPlayerName" type="text" readonly dir="auto"><label class="ff-confirm"><input type="checkbox"><span></span></label></div><button type="button" class="ff-manual" hidden></button>';
input.after(box);
const check=box.querySelector('.ff-check'),status=box.querySelector('.ff-status'),result=box.querySelector('.ff-result'),name=box.querySelector('#verifiedPlayerName'),confirm=box.querySelector('[type=checkbox]'),fallback=box.querySelector('.ff-manual');
check.textContent=t.check;fallback.textContent=t.manual;result.querySelector('label').textContent=t.name;box.querySelector('.ff-confirm span').textContent=t.confirm;
const reset=()=>{seq++;controller?.abort();verified='';nickname='';manual=false;name.value='';confirm.checked=false;result.hidden=true;fallback.hidden=true;status.textContent='';check.disabled=false;check.textContent=t.check;};
input.addEventListener('input',reset);
check.addEventListener('click',async()=>{
reset();const id=input.value.trim();if(!/^\d{5,15}$/.test(id)){status.textContent=t.format;return;}
const version=seq;controller=new AbortController();const timer=setTimeout(()=>controller.abort(),15000);check.disabled=true;check.textContent=t.busy;
try{
const response=await fetch('https://api.g2bulk.com/v1/games/checkPlayerId',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({game:'pubgm',user_id:id}),signal:controller.signal,credentials:'omit'});
if(!response.ok)throw Error('unavailable');const data=await response.json();if(version!==seq)return;
const n=data.name||data.nickname||data.username;
if(data.valid==='valid'&&typeof n==='string'&&n.trim()){verified=id;nickname=n.trim();name.value=nickname;result.hidden=false;status.textContent='';}
else if(data.valid==='invalid'||data.valid===false){status.textContent=t.invalid;}
else throw Error('unavailable');
}catch(error){if(version===seq){status.textContent=t.error;fallback.hidden=false;}}
finally{clearTimeout(timer);if(version===seq){check.disabled=false;check.textContent=t.check;}}
});
fallback.addEventListener('click',()=>{manual=true;verified=input.value.trim();nickname=t.pending;status.textContent=t.pending;fallback.hidden=true;});
window.pubgVerifiedName=()=>verified===input.value.trim()&&(manual||confirm.checked)?nickname:'';
document.addEventListener('click',event=>{
const button=event.target.closest('#order,#orderTelegram');if(!button)return;
if(!window.pubgVerifiedName()){event.preventDefault();event.stopImmediatePropagation();status.textContent=t.need;check.focus();}
},true);
})();
