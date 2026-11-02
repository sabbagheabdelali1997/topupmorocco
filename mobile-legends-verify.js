(()=>{
'use strict';
const input=document.getElementById('playerId');if(!input)return;
const server=document.getElementById('serverId');if(!server)return;
server.inputMode='numeric';server.dir='ltr';
const identity=()=>input.value.trim()+'|'+server.value.trim();
const fr=document.documentElement.lang==='fr';
const t=fr?{check:'Vérifier l’ID',busy:'Vérification…',format:'Saisissez le Player ID et le Server ID (Zone ID) en chiffres.',invalid:'Compte introuvable. Vérifiez le Player ID et le Server ID.',error:'Vérification indisponible. Réessayez ou envoyez une demande de vérification manuelle.',manual:'Demander une vérification manuelle',name:'Nom du joueur',confirm:'Je confirme que ce compte est le bon.',need:'Vérifiez l’ID et confirmez le nom du joueur avant de commander.',pending:'Compte à vérifier manuellement'}:{check:'تحقق من ID',busy:'جارٍ التحقق…',format:'أدخل Player ID وServer ID (Zone ID) بالأرقام.',invalid:'لم يتم العثور على الحساب. راجع Player ID وServer ID.',error:'تعذّر التحقق الآن. أعد المحاولة أو أرسل طلبًا للمراجعة اليدوية.',manual:'طلب مراجعة ID يدويًا',name:'اسم اللاعب',confirm:'أؤكد أن هذا هو الحساب المطلوب.',need:'تحقق من ID وأكّد اسم اللاعب قبل إرسال الطلب.',pending:'الحساب بحاجة إلى مراجعة يدوية'};
let verified='',nickname='',manual=false,seq=0,controller;
input.inputMode='numeric';input.dir='ltr';
const box=document.createElement('div');box.className='ff-verify';
box.innerHTML='<button type="button" class="ff-check"></button><p class="ff-status" role="status" aria-live="polite"></p><div class="ff-result" hidden><label for="verifiedPlayerName"></label><input id="verifiedPlayerName" type="text" readonly dir="auto"><label class="ff-confirm"><input type="checkbox"><span></span></label></div><button type="button" class="ff-manual" hidden></button>';
server.after(box);
const check=box.querySelector('.ff-check'),status=box.querySelector('.ff-status'),result=box.querySelector('.ff-result'),name=box.querySelector('#verifiedPlayerName'),confirm=box.querySelector('[type=checkbox]'),fallback=box.querySelector('.ff-manual');
check.textContent=t.check;fallback.textContent=t.manual;result.querySelector('label').textContent=t.name;box.querySelector('.ff-confirm span').textContent=t.confirm;
const reset=()=>{seq++;controller?.abort();verified='';nickname='';manual=false;name.value='';confirm.checked=false;result.hidden=true;fallback.hidden=true;status.textContent='';check.disabled=false;check.textContent=t.check;};
input.addEventListener('input',reset);server.addEventListener('input',reset);
check.addEventListener('click',async()=>{
reset();const id=input.value.trim(),zone=server.value.trim();if(!/^\d{1,20}$/.test(id)||!/^\d{1,10}$/.test(zone)){status.textContent=t.format;return;}
const version=seq;controller=new AbortController();const timer=setTimeout(()=>controller.abort(),15000);check.disabled=true;check.textContent=t.busy;
try{
const response=await fetch('https://api.g2bulk.com/v1/games/checkPlayerId',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({game:'mlbb',user_id:id,server_id:zone}),signal:controller.signal,credentials:'omit'});
if(!response.ok)throw Error('unavailable');const data=await response.json();if(version!==seq)return;
const n=data.name||data.nickname||data.username;
if(data.valid==='valid'&&typeof n==='string'&&n.trim()){verified=identity();nickname=n.trim();name.value=nickname;result.hidden=false;status.textContent='';}
else if(data.valid==='invalid'||data.valid===false){status.textContent=t.invalid;}
else throw Error('unavailable');
}catch(error){if(version===seq){status.textContent=t.error;fallback.hidden=false;}}
finally{clearTimeout(timer);if(version===seq){check.disabled=false;check.textContent=t.check;}}
});
fallback.addEventListener('click',()=>{manual=true;verified=identity();nickname=t.pending;status.textContent=t.pending;fallback.hidden=true;});
window.mlVerifiedName=()=>verified===identity()&&(manual||confirm.checked)?nickname:'';
document.addEventListener('click',event=>{
const button=event.target.closest('#order,#orderTelegram');if(!button)return;
if(!window.mlVerifiedName()){event.preventDefault();event.stopImmediatePropagation();status.textContent=t.need;check.focus();}
},true);
})();
