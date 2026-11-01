(()=>{
 'use strict';
 const fr=document.documentElement.lang==='fr';
 const t=fr?{
  title:'Vérifiez votre commande',subtitle:'Vérifiez le produit et le pack avant d’envoyer votre demande.',product:'Produit',offer:'Pack et prix',channel:'Envoyer via',edit:'Modifier',send:'Confirmer et ouvrir ',note:'Votre demande sera envoyée au service client. Le paiement et le délai de livraison seront confirmés avec vous.',empty:'',delivery:'Livraison et assistance',details:'Après confirmation du paiement, votre commande est traitée selon le produit. Demandez le délai avant de payer.'
 }:{title:'راجع طلبك',subtitle:'راجع المنتج والباقة قبل إرسال الطلب.',product:'المنتج',offer:'الباقة والثمن',channel:'الإرسال عبر',edit:'تعديل الاختيار',send:'تأكيد وفتح ',note:'سيُرسل طلبك إلى خدمة الزبناء، ويتم تأكيد الدفع ومدة التسليم معك.',empty:'',delivery:'التسليم والمساعدة',details:'بعد تأكيد الدفع، تتم معالجة الطلب حسب المنتج. يُرجى الاستفسار عن مدة التسليم قبل الدفع.'};
 let approving=false,trigger=null,dialog=null;
 const make=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text)el.textContent=text;return el;};
 function build(){
  dialog=make('dialog','tm-order-review');dialog.id='tmOrderReview';dialog.setAttribute('aria-labelledby','tmReviewTitle');dialog.setAttribute('dir',fr?'ltr':'rtl');
  const head=make('div','tm-review-head');const title=make('h2','',t.title);title.id='tmReviewTitle';head.append(title);
  const close=make('button','tm-review-close','×');close.type='button';close.setAttribute('aria-label',fr?'Fermer':'إغلاق');close.addEventListener('click',()=>dialog.close());head.append(close);dialog.append(head,make('p','tm-review-subtitle',t.subtitle));
  const body=make('dl','tm-review-items');body.id='tmReviewItems';dialog.append(body,make('p','tm-review-note',t.note));
  const actions=make('div','tm-review-actions');const confirm=make('button','tm-review-confirm');confirm.type='button';confirm.id='tmReviewConfirm';const edit=make('button','tm-review-edit',t.edit);edit.type='button';edit.addEventListener('click',()=>dialog.close());
  confirm.addEventListener('click',()=>{const target=trigger;dialog.close();if(target&&target.isConnected){approving=true;try{target.click();}finally{approving=false;}}});actions.append(confirm,edit);dialog.append(actions);document.body.append(dialog);
  dialog.addEventListener('close',()=>{if(trigger&&trigger.isConnected)trigger.focus({preventScroll:true});});
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
 }
 document.addEventListener('click',event=>{
  const button=event.target.closest('button#order,button#orderTelegram');if(!button||approving)return;
  const pack=document.querySelector('main .pack.active:not([hidden])');if(!pack)return;
  // Keep the product's existing validation in charge of missing required fields.
  if(Array.from(document.querySelectorAll('main input[required]')).some(x=>!x.value.trim()))return;
  if(typeof HTMLDialogElement==='undefined')return;
  event.preventDefault();event.stopImmediatePropagation();trigger=button;if(!dialog)build();
  const list=document.getElementById('tmReviewItems');list.replaceChildren();
  const row=(label,value)=>{list.append(make('dt','',label),make('dd','',value));};
  row(t.product,(document.querySelector('main h1')?.textContent||document.title).trim());
  row(t.offer,(pack.dataset.value||pack.textContent).trim());
  document.querySelectorAll('main input').forEach(input=>{if(['hidden','search','checkbox','radio','button','submit','password'].includes(input.type)||!input.value.trim()||input.closest('[hidden],.hidden'))return;const label=input.id?document.querySelector('label[for="'+CSS.escape(input.id)+'"]'):null;if(label)row(label.textContent.trim(),input.value.trim());});
  const channel=button.id==='orderTelegram'?'Telegram':'WhatsApp';row(t.channel,channel);document.getElementById('tmReviewConfirm').textContent=t.send+channel;dialog.showModal();
 },true);
 const panel=document.querySelector('main aside.panel');
 if(panel){const details=make('details','tm-delivery-info');details.append(make('summary','',t.delivery),make('p','',t.details));panel.append(details);}
})();
