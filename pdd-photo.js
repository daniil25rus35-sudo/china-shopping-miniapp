(() => {
  const panel = document.getElementById('pdd-photo-panel');
  if (!panel) return;
  const file=panel.querySelector('#pdd-file'), consent=panel.querySelector('#pdd-consent'), run=panel.querySelector('#pdd-run'), status=panel.querySelector('#pdd-status'), preview=panel.querySelector('#pdd-preview'), results=panel.querySelector('#pdd-results');
  const endpoint='https://china-shopping-whatsapp-webhook.onrender.com/api/pdd/photo-search';
  let photo=null, busy=false, generation=0;
  const initData=()=>window.Telegram?.WebApp?.initData||'';
  const update=()=>{run.disabled=busy||!photo||!consent.checked||!initData();};
  const show=s=>{status.textContent=s;};
  const make=(tag,text,cls)=>{const el=document.createElement(tag);if(text)el.textContent=text;if(cls)el.className=cls;return el;};
  const safe=(value,hosts)=>{try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&!u.port&&hosts.some(h=>u.hostname===h||u.hostname.endsWith('.'+h))?u.href:null;}catch{return null;}};
  function render(data){
    results.replaceChildren();
    const items=Array.isArray(data?.products)?data.products:[];
    if(!items.length){show('Совпадения не найдены. Попробуйте другое фото.');return;}
    show(`Найдено: ${items.length}. Источник: ${data.source}. Цены предварительные, доставка отдельно.`);
    for(const p of items){
      const url=safe(p.url,['mobile.yangkeduo.com','mobile.pinduoduo.com']), img=safe(p.image,['pddpic.com','yangkeduo.com','pinduoduo.com']);if(!url||!img||typeof p.title!=='string')continue;
      const card=make('article',null,'pdd-card'), image=make('img');image.src=img;image.alt=p.title;image.loading='lazy';image.referrerPolicy='no-referrer';card.append(image,make('small','拼多多 · PINDUODUO','pdd-badge'),make('h3',p.title),make('strong',Number.isFinite(p.priceCny)?`¥ ${p.priceCny}`+(Number.isFinite(p.priceRub)?` · ≈ ${p.priceRub.toLocaleString('ru-RU')} ₽`:''):'Цена уточняется'),make('small','Наличие и цена варианта требуют проверки.'));
      const original=make('a','Оригинал ↗','secondary'), order=make('a','Запросить выкуп','primary');original.href=url;original.target='_blank';original.rel='noopener noreferrer';order.href='https://t.me/ChinaShoppingVLBotai?text='+encodeURIComponent(`Хочу уточнить стоимость выкупа Pinduoduo: ${p.title}\n${url}`);card.append(original,order);results.append(card);
    }
  }
  file.addEventListener('change',async()=>{
    const version=++generation;photo=null;preview.hidden=true;preview.removeAttribute('src');results.replaceChildren();update();
    const selected=file.files?.[0];if(!selected){show('Выберите фотографию товара.');return;}
    if(!/^image\/(jpeg|png|webp|heic|heif)$/.test(selected.type)||selected.size>15*1024*1024){show('Выберите фото до 15 МБ (JPEG, PNG, WebP).');return;}
    try {
      const bitmap=await createImageBitmap(selected);const ratio=Math.min(1,1200/Math.max(bitmap.width,bitmap.height));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*ratio));canvas.height=Math.max(1,Math.round(bitmap.height*ratio));const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();const jpeg=canvas.toDataURL('image/jpeg',.82);if(version!==generation)return;
      if(jpeg.length>2*1024*1024*4/3)throw Error('size');photo=jpeg.split(',')[1];preview.src=jpeg;preview.hidden=false;show(initData()?'Фото готово. Подтвердите согласие и начните поиск.':'Откройте Mini App внутри Telegram для поиска.');
    } catch {if(version===generation)show('Не удалось прочитать фото. Попробуйте JPEG или PNG.');}finally{if(version===generation)update();}
  });
  consent.addEventListener('change',update);
  run.addEventListener('click',async()=>{
    if(busy||!photo||!consent.checked||!initData())return;
    busy=true;file.disabled=true;consent.disabled=true;update();results.replaceChildren();show('Ищем похожие товары в Pinduoduo…');
    try {const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({initData:initData(),imageBase64:photo,consent:true}),signal:AbortSignal.timeout(65000)});const data=await response.json();if(!response.ok){show(data?.error?.message||'Пробное подключение недоступно.');return;}render(data);}
    catch{show('Поиск не завершился. Повторите позднее или обратитесь к менеджеру.');}
    finally{busy=false;file.disabled=false;consent.disabled=false;update();}
  });
  update();
})();
