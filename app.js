'use strict';
const BOT='https://t.me/ChinaShoppingVLBotai';
function telegramBotNavigation(event){
  const link=event.target?.closest?.('a[href]');
  if(!link||event.defaultPrevented||event.button!==0&&event.button!==undefined||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  let url;try{url=new URL(link.href);}catch{return;}
  const destination=new URL(BOT);
  if(url.origin!==destination.origin||url.pathname.replace(/\/$/,'').toLowerCase()!==destination.pathname.toLowerCase())return;
  const tg=window.Telegram?.WebApp;
  // The SDK also exists in a normal browser; use the native bridge only in Telegram.
  if(!tg||(!tg.initData&&(!tg.platform||tg.platform==='unknown')))return;
  try{
    if(typeof tg.openTelegramLink==='function'){
      tg.openTelegramLink(url.href);
      event.preventDefault();
      // Native navigation owns the transition. Never race it with close().
    }
  }catch{
    // Preserve the actual HTTPS destination when the bridge is unavailable.
  }
}
document.addEventListener('click',telegramBotNavigation);
const rate={rubPerYuan:13.80};
const rateLabel=()=>new Intl.NumberFormat('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:2}).format(rate.rubPerYuan);
const rubles=new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB',maximumFractionDigits:2});
const marketList=[
 {id:'poizon',name:'POIZON',color:'poizon',icon:'shoe',title:'POIZON / Dewu',description:'Брендовая обувь, одежда и аксессуары. Сверяйте артикул, размер и условия проверки.',url:'https://www.dewu.com/',command:'поиск poizon',mode:'Поиск по фото через Setalabs в боте, если активен лимит.'},
 {id:'taobao',name:'Taobao',color:'taobao',icon:'cart',title:'Taobao',description:'Большой розничный ассортимент. Проверяйте отзывы, размеры и цену выбранного варианта.',url:'https://www.taobao.com/',command:'поиск taobao',mode:'Поиск по фото через Setalabs в боте, если активен лимит.'},
 {id:'1688',name:'1688',color:'m1688',icon:'box',title:'1688',description:'Фабрики и мелкий опт. Проверяйте минимальную партию, образцы и ступени цен.',url:'https://www.1688.com/',command:'поиск 1688',mode:'Поиск через HioBuy зависит от доступа и тарифа API; если недоступен, оставьте заявку.'},
 {id:'pinduoduo',name:'Pinduoduo',color:'pinduoduo',icon:'people',title:'Pinduoduo',description:'Недорогие товары, товары для дома и групповые предложения. Сверяйте условия скидок.',url:'https://www.pinduoduo.com/',command:'поиск pinduoduo',mode:'Тестовый ИИ-поиск публичных карточек Pinduoduo через OpenAI. Прямой API площадки ещё не подключён. Если карточки не найдены, обратитесь к менеджеру.'},
 {id:'goofish',name:'Goofish',color:'goofish',icon:'fish',title:'Goofish / Xianyu',description:'Сток, редкие и подержанные вещи. Проверяйте состояние, дефекты и условия сделки.',url:'https://www.goofish.com/',command:null,mode:'Ручной подбор по фото или ссылке. Автоматический поиск не подключён.'},
 {id:'tmall',name:'Tmall',color:'tmall',icon:'bag',title:'Tmall',description:'Брендовые витрины. Сверяйте официальный статус магазина и комплектацию.',url:'https://www.tmall.com/',command:'поиск taobao',mode:'Результаты Taobao/Tmall через Setalabs; отдельный API Tmall пока не подключён.'},
 {id:'jd',name:'JD.com',color:'jd',icon:'tech',title:'JD.com',description:'Электроника и бытовая техника. Проверьте версию, гарантию и комплектацию.',url:'https://www.jd.com/',command:null,mode:'Ручной подбор по фото или ссылке.'}
];
const items=[
 ['aroma','NetEase «Облако»','Твёрдый ароматический бальзам в декоративной ёмкости. Уточняем аромат и состав.',null,'35,9','https://www.taouq.com/id-GKrvwk5rs8tYkVOn3MghYPksQtJ-aAZjjVSjOxwXGJ3fz/'],
 ['light','RGB-подсветка зоны ног','USB-питание; заявлена реакция на музыку. Динамический режим — только на стоянке.',null,'6,5','https://www.taouq.com/id-5nBWaygmHxtyw5paO3mh77YUMtV-PNzeejCKVywNABmIY/'],
 ['aroma','OCE «Яблочное море»','Твёрдый ароматический бальзам. Проверяем объём, состав и точный вариант.',null,'39,9','https://www.taouq.com/id-97b2bP9sBtODMGkM22U2n5FQt6-mOZQQNujKx7O2e5t9/'],
 ['aroma','Ароматизатор «Османтус»','Цветочная композиция. Состав и способ крепления требуют проверки.',null,'9,9','https://www.taouq.com/id-mPO8a9eCktJ7ervg6QFzzBcot3-rkOPPMubVZmBA0rHy/'],
 ['light','USB-светильник Liangfei','Миниатюрный декоративный LED-светильник. Уточняем разъём и режимы.',null,'4,9','https://www.taouq.com/id-ANrzaYgRczt4XdKAKnjHmX5tvtn-qKZqqrSXdMv4PPDU4/'],
 ['charge','Xiaomi 100W','USB-A и USB-C, до 100 Вт по USB-C при совместимом оборудовании.','99',null,'https://www.mi.com/shop/buy/detail?product_id=12541'],
 ['charge','Xiaomi 43W','Два порта, компактный корпус, световая индикация.','44',null,'https://m.mi.com/commodity/list/1600'],
 ['charge','Xiaomi беспроводная 30W','Автоматический зажим, двойное охлаждение. Совместимость уточняется.','199',null,'https://m.mi.com/commodity/list/1600'],
 ['care','Mijia компрессор 2','Предустановка давления и автоостановка. Проверяем перевозку аккумулятора.','199',null,'https://m.mi.com/commodity/list/1022'],
 ['care','Mijia пылесос 23 кПа','Беспроводной ручной пылесос с обдувом.','329',null,'https://m.mi.com/commodity/list/1024'],
 ['care','Mijia пылесос 13 кПа','Компактная модель для салона и дома.','229',null,'https://m.mi.com/commodity/list/1024'],
 ['care','Mijia поясничная подушка','Дышащая ткань, поддержка поясницы. Размеры уточняются.','169',null,'https://m.mi.com/commodity/list/2489']
];
const cats={aroma:['Ароматизаторы','drop'],light:['Подсветка','lamp'],charge:['Зарядные устройства','bolt'],care:['Уход и комфорт','car'],fursofa:['Диваны и кресла','sofa'],furable:['Столы и стеллажи','grid'],furbed:['Спальня','home'],hkitchen:['Кухня и посуда','lampdesk'],hdeco:['Декор, свет и хранение','box'],htextile:['Текстиль','shirt'],loutdoor:['Дача и outdoor','tent'],lsport:['Спорт и массаж','bolt'],lgame:['Хобби и развлечения','tech'],shsneak:['Кроссовки и кеды','shoe'],shboots:['Ботинки и сапоги','footprints'],shslides:['Сланцы и тапочки','shoe'],clouter:['Верхняя одежда','shirt'],clknit:['Толстовки и свитеры','shirt'],clpants:['Джинсы и штаны','shirt'],elaudio:['Наушники и звук','headphones'],elgadget:['Смартфоны и гаджеты','smartphone'],elpower:['Пауэрбанки и зарядки','bolt'],acbags:['Сумки и рюкзаки','backpack'],acwatches:['Часы','watch'],acglasses:['Очки и ремни','glasses']};
const catTypes={auto:['aroma','light','charge','care'],furniture:['fursofa','furable','furbed'],home:['hkitchen','hdeco','htextile'],leisure:['loutdoor','lsport','lgame'],shoes:['shsneak','shboots','shslides'],clothes:['clouter','clknit','clpants'],electronics:['elaudio','elgadget','elpower'],accessories:['acbags','acwatches','acglasses']};
const categoryList=[['auto','Автотовары','car'],['furniture','Мебель','sofa'],['home','Для дома','lampdesk'],['leisure','Отдых и досуг','tent'],['shoes','Обувь','shoe'],['clothes','Одежда','shirt'],['electronics','Электроника','tech'],['accessories','Аксессуары','watch']];
const navItems=[['home','Главная','home'],['catalog','Каталог','grid'],['search','Поиск','search'],['orders','Заказы','box'],['profile','Профиль','user']];
const $=id=>document.getElementById(id);
document.addEventListener('error',event=>{const t=event.target;if(t&&t.tagName==='IMG'&&t.parentElement&&t.parentElement.classList.contains('product-art'))t.remove();},true);
const icon=(name,size=24)=>'<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-'+name+'"/></svg>';
let currentMarket='poizon',filter='all',category='auto';
const idOf=(item,i)=>item[6]||'auto-'+String(i+1).padStart(3,'0');
let favorites=new Set();try{const saved=JSON.parse(localStorage.getItem('china-shopping-favorites-v2')||'null');const old=JSON.parse(localStorage.getItem('china-shopping-favorites-v1')||'[]');if(Array.isArray(saved))favorites=new Set(saved.filter(x=>typeof x==='string'&&/^[a-z0-9-]{1,50}$/.test(x)));else if(Array.isArray(old))favorites=new Set(old.filter(x=>Number.isInteger(x)&&x>=0&&x<items.length).map(i=>idOf(items[i],i)));}catch{}
let catalogDate='2026-11-25',catalogOnline=false;
const escapeHtml=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dateLabel=()=>catalogDate.split('-').reverse().join('.');
function validateCatalog(data){
  if(!data||!/^\d{4}-\d{2}-\d{2}$/.test(data.date)||!Array.isArray(data.items)||data.items.length>500)return false;
  const ids=new Set();
  for(const row of data.items){
    if(!Array.isArray(row)||row.length!==7||!Object.hasOwn(cats,row[0])||typeof row[1]!=='string'||!row[1].trim()||row[1].length>160||typeof row[2]!=='string'||row[2].length>1000||!row.slice(3,5).every(v=>v===null||typeof v==='string'&&/^\d{1,7}([.,]\d{1,2})?$/.test(v))||typeof row[5]!=='string'||row[5].length>500||typeof row[6]!=='string'||!/^[a-z0-9-]{1,50}$/.test(row[6])||ids.has(row[6]))return false;
    try{const url=new URL(row[5]);if(url.protocol!=='https:'||url.username||url.password)return false;}catch{return false;}
    ids.add(row[6]);
  }
  return true;
}
async function loadCatalogData(){
  if(typeof fetch!=='function')return;
  try{
    const response=await fetch('catalog-data.json',{cache:'no-cache',signal:AbortSignal.timeout(5000)});
    if(!response.ok)throw Error('HTTP '+response.status);
    const data=await response.json();
    if(!validateCatalog(data))throw Error('Invalid catalog');
    items.splice(0,items.length,...data.items);catalogDate=data.date;catalogOnline=true;
    renderFeatured();renderSaved();renderCatalog();renderCart();updateCatalogInfo();
  }catch{updateCatalogInfo();}
}
function updateCatalogInfo(){
  $('catalog-info').textContent=(catalogOnline?'Подборка':'Резервная подборка')+' от '+dateLabel()+'. Цены источников требуют сверки. Наличие, вариант и условия доставки уточняются.';
  $('featured-info').textContent=(catalogOnline?'Подборка':'Резервная подборка')+' от '+dateLabel()+' • цены требуют сверки';
  $('featured-count').textContent='Все '+items.length+' →';
}
function renderDrawer(){const box=$('drawer-items');box.innerHTML=[...cart].map(([id,r])=>{const p=byId(id);const line=p&&p[3]!==null?rubles.format(Number(p[3].replace(',','.'))*rate.rubPerYuan*r.qty):'цена по запросу';return '<div class="drawer-item"><h3>'+escapeHtml(p?p[1]:'Позиция недоступна')+'</h3><div class="row"><span class="stepper"><button type="button" data-dqty="-1" data-id="'+id+'" aria-label="Убавить">−</button><b>'+r.qty+'</b><button type="button" data-dqty="1" data-id="'+id+'" aria-label="Прибавить">+</button></span><strong class="muted">'+line+'</strong></div>'+(r.note?'<small class="muted">'+escapeHtml(r.note)+'</small>':'')+'</div>';}).join('')||'<p class="muted" style="padding:18px 4px">Корзина пуста. Добавьте товары из каталога.</p>';
const t=cartTotals();$('drawer-sum').innerHTML=cart.size?('Позиций: '+cart.size+' · единиц: '+t.n+' · ориентир: <b>'+rubles.format(t.sum)+'</b>'+(t.unknown?' · без '+t.unknown+' поз. по запросу':'')+' · доставка отдельно'):'';
const link=$('drawer-request');link.hidden=!cart.size;link.href=cart.size&&cartText().length<=1800?formatUrl(cartText()):BOT;updateCartBadge();}
function openDrawer(){const w=$('drawer-wrap');w.hidden=false;requestAnimationFrame(()=>requestAnimationFrame(()=>w.classList.add('open')));}
function closeDrawer(){const w=$('drawer-wrap');w.classList.remove('open');setTimeout(()=>{w.hidden=true;},270);}
function haptic(kind){try{const H=window.Telegram?.WebApp?.HapticFeedback;if(!H)return;if(kind==='success'||kind==='warning'||kind==='error')H.notificationOccurred(kind);else H.impactOccurred('light');}catch{}}
function updateCartBadge(){const {n}=cartTotals();const b=$('cart-badge');if(b){b.textContent=n;b.hidden=n===0;}}
const formatUrl=message=>BOT+'?text='+encodeURIComponent(message);
const guides=[["poizon","POIZON","得物","#23cccc",true,"Как выбрать оригинальную модель",["Установите Dewu из официального источника и войдите доступным способом.","Найдите товар по артикулу, названию или фото. Сверьте модель и цвет.","Измерьте стопу, проверьте таблицу размеров и цену конкретного варианта.","Уточните условия проверки и возврата. Подлинность конкретного товара не подтверждена до проверки."]],["taobao","Taobao","淘宝","#b84010",false,"Как покупать на Taobao",["Установите официальное приложение. Зарегистрируйтесь по доступному номеру; код подтверждайте сами.","Ищите по названию на китайском, артикулу или фото, если функция доступна.","Сверьте размер, цвет, отзывы с фотографиями, рейтинг продавца и цену варианта.","Скопируйте ссылку и согласуйте количество и доставку до склада."]],["1688","1688","阿里巴巴","#ad390e",false,"Как покупать у фабрик",["Откройте официальный сайт или приложение и проверьте доступные варианты регистрации.","Сравните поставщиков, материалы и реальные характеристики.","Уточните минимальную партию, ступени цен и образец.","Согласуйте SKU, количество, упаковку и доставку."]],["pinduoduo","Pinduoduo","拼多多","#b42334",false,"Как находить выгодные товары",["Установите приложение из официального источника и войдите доступным способом.","Ищите по названию или фото, если функция доступна.","Проверяйте условия групповой цены, купонов и комплектацию.","Пришлите ссылку или фото с подписью «поиск pinduoduo». Это тестовый ИИ-поиск по открытым источникам, а прямой API площадки пока не подключён. При отсутствии результатов доступен ручной подбор."]],["goofish","Goofish","闲鱼","#efd03e",true,"Как выбирать редкие и б/у вещи",["Откройте официальный Goofish и проверьте варианты входа.","Ищите по модели и словам 二手 (б/у), 全新 (новый).","Запросите реальные фото, сведения о дефектах и комплектации.","Проверьте репутацию и условия возврата. Не оплачивайте неизвестным продавцам вне площадки."]],["tmall","Tmall","天猫","#b52330",false,"Как искать брендовые витрины",["Откройте Tmall или Taobao и найдите бренд.","Проверяйте статус магазина и данные продавца, а не только название.","Сверьте вариант, цену, комплектацию и условия возврата.","Передайте прямую ссылку и параметры для выкупа."]],["jd","JD.com","京东","#a92231",false,"Как выбирать технику",["Откройте JD.com, проверьте доступность регистрации.","Сверьте точную модель, память, напряжение, вилку и региональную версию.","Уточните гарантию и продавца.","Проверьте возможность перевозки аккумуляторов, вес и упаковку."]],["vipshop","VIPSHOP","唯品会","#a21c68",false,"Как покупать в аутлете",["Откройте официальный VIPSHOP и проверьте доступность входа.","Сравните доступные размеры, характеристики, сроки действия предложения.","Пришлите ссылку и параметры для проверки стоимости."],"https://www.vip.com/"],["weidian","Weidian","微店","#a93627",false,"Как выбирать магазины Weidian",["Откройте официальный сервис. Найдите конкретный магазин или товар.","Проверьте данные продавца, отзывы и условия сделки.","Передайте ссылку, параметры и количество для проверки возможности выкупа."],"https://weidian.com/official/"],["uniqlo","UNIQLO","优衣库","#b3232c",false,"Как покупать UNIQLO в Китае",["Откройте китайскую официальную витрину.","Сверьте код товара, состав, цвет и таблицу размеров.","Уточните наличие нужного варианта, затем передайте ссылку."],"https://www.uniqlo.cn/"],["alipay","Alipay","支付宝","#0663ad",false,"Регистрация и привязка карты",["Найдите Alipay в официальном магазине приложений.","Зарегистрируйтесь по собственному номеру; иностранный номер может поддерживаться.","При необходимости пройдите проверку личности только в самом приложении.","В разделе банковских карт добавьте подходящую карту, если это разрешено сервисом и банком. Не передавайте коды или пароль."],"https://www.alipay.com/","pay"],["wechat","WeChat","微信","#087e42",false,"Регистрация и Weixin Pay",["Установите официальный WeChat и зарегистрируйтесь по собственному номеру.","Пройдите предусмотренную приложением проверку.","Проверьте доступность Weixin Pay и возможность привязать подходящую банковскую карту.","Условия платежей зависят от банка и региона. Не пользуйтесь неизвестными обменниками."],"https://www.wechat.com/","pay"]].map(([id,name,cn,color,dark,title,steps,url,kind])=>({id,name,cn,color,dark,title,steps,url,kind}));
const routeLabels={home:'Главная',catalog:'Каталог',search:'Поиск товара',markets:'Маркетплейсы',school:'Школа шоппинга',guides:'Гайды и инструкции',glossary:'Китайско-русский словарь',payments:'Платёжные системы Китая',contacts:'Контакты и соцсети',delivery:'Доставка',orders:'Заказы',profile:'Профиль',brands:'Бренды',buy:'Выкуп и заказ',help:'Помощь'};
const paymentNames={alipay:'Alipay',wechat:'WeChat Pay','topup-alipay':'Пополнить Alipay','topup-wechat':'Пополнить WeChat Pay'};
function renderPayments(sub){
  const panel=sub||'overview';
  document.querySelectorAll('[data-payment-panel]').forEach(item=>item.hidden=item.dataset.paymentPanel!==panel);
  $('route-current').textContent=routeLabels.payments+(sub?' / '+paymentNames[sub]:'');
}
function parseRoute(raw){const [head,part,...extra]=String(raw||'home').replace(/^#/,'').split('/');const name=Object.hasOwn(routeLabels,head)&&extra.length===0?head:'home';const sub=(['markets','search'].includes(name)&&marketList.some(m=>m.id===part)||name==='catalog'&&categoryList.some(c=>c[0]===part)||name==='guides'&&guides.some(g=>g.id===part)||name==='payments'&&['alipay','wechat','topup-alipay','topup-wechat'].includes(part))?part:'';return {name,sub,path:name+(sub?'/'+sub:'')};}
function route(target){const r=parseRoute(target);if(location.hash!=='#'+r.path)location.hash=r.path;renderRoute();}
function renderRoute(){const {name,sub,path}=parseRoute(location.hash);if(location.hash!=='#'+path&&typeof history!=='undefined')history.replaceState(null,'','#'+path);document.querySelectorAll('.view').forEach(v=>v.hidden=v.id!==name);document.querySelectorAll('.nav button').forEach(b=>{if(b.dataset.go===name)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});const market=marketList.find(m=>m.id===sub);const guide=name==='guides'?guides.find(g=>g.id===sub):null;$('route-nav').hidden=name==='home';$('route-current').textContent=routeLabels[name] + ((guide||market)?' / '+(guide||market).name:'');const back=name==='guides'?(sub?'guides':'school'):name==='glossary'?'school':name==='payments'?(sub?(sub.startsWith('topup-')?'payments/'+sub.slice(6):'payments'):'home'):name==='search'&&market?'markets/'+sub:name==='brands'?'markets':'home';$('route-back').dataset.go=back;$('route-back').textContent='‹ '+(back.startsWith('markets')?'Маркетплейсы':(back.startsWith('payments/')?paymentNames[back.split('/')[1]]:routeLabels[back])||'Главная');if(name==='markets')marketDetail(market?.id||currentMarket);if(name==='search')renderSearch(market?.id||currentMarket);if(name==='catalog'){const next=sub||'auto';if(category!==next){category=next;filter='all';$('catalog-query').value='';}renderCatalog();}if(name==='guides')renderGuide(sub);if(name==='glossary')renderDictionary();if(name==='payments')renderPayments(sub);if(name==='profile')renderSaved();if(name==='orders')renderCart();try{const backButton=window.Telegram?.WebApp?.BackButton;if(name==='home')backButton?.hide();else backButton?.show();}catch{}if(name==='brands')renderBrands();window.scrollTo(0,0);}
const guideAliases={
  poizon:'пойзон поизон деу деву кроссовки обувь',
  taobao:'таобао тао бао',
  '1688':'алибаба фабрика опт',
  pinduoduo:'пиндуодуо пиньдуодуо пиндодо пиндо пиндуо',
  goofish:'гуфиш сяньюй сянью барахолка авито',
  tmall:'тмолл тмалл тмол тмолл бренд',
  jd:'джейди джд электроника',
  vipshop:'випшоп аутлет',
  weidian:'вейдянь видянь вейдиан',
  uniqlo:'юникло уникло одежда',
  alipay:'алипей алипэй кошелек оплата',
  wechat:'вичат вейчат вичэт вэйчат оплата'
};
let guideFilter='all';
let guideRead=new Set();
const guideReadKey='china-shopping-guides-read-v1';
try{
  const saved=JSON.parse(localStorage.getItem(guideReadKey)||'[]');
  if(Array.isArray(saved))guideRead=new Set(saved.filter(id=>guides.some(g=>g.id===id)));
}catch{}
function guideMatches(g,query){
  const source=[g.name,g.cn,g.title,guideAliases[g.id],...g.steps].join(' ').toLowerCase();
  return query.toLowerCase().trim().split(/\s+/).every(word=>source.includes(word));
}
function renderGuideLibrary(){
  const query=$('guide-query').value;
  const filtered=guides.filter(g=>guideMatches(g,query)&&
    (guideFilter==='all'||(guideFilter==='market'&&g.kind!=='pay')||(guideFilter==='pay'&&g.kind==='pay')||(guideFilter==='unread'&&!guideRead.has(g.id))));
  const markets=filtered.filter(g=>g.kind!=='pay');
  const payments=filtered.filter(g=>g.kind==='pay');
  $('guide-market-grid').innerHTML=guideCards(markets);
  $('guide-pay-grid').innerHTML=guideCards(payments);
  $('guide-markets-block').hidden=!markets.length;
  $('guide-pay-block').hidden=!payments.length;
  $('guide-empty').hidden=filtered.length>0;
  $('guide-result-count').textContent='Найдено: '+filtered.length;
  $('guide-progress').value=guideRead.size;
  $('guide-progress').max=guides.length;
  $('guide-progress-text').textContent='Прочитано '+guideRead.size+' из '+guides.length+' на этом устройстве';
  document.querySelectorAll('[data-guide-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.guideFilter===guideFilter)));
}
function toggleGuideRead(id){
  if(!guides.some(g=>g.id===id))return;
  if(guideRead.has(id))guideRead.delete(id);else guideRead.add(id);
  try{localStorage.setItem(guideReadKey,JSON.stringify([...guideRead]));}catch{}
  const button=$('guide-mark-read');
  button.setAttribute('aria-pressed',String(guideRead.has(id)));
  button.textContent=guideRead.has(id)?'✓ Прочитано · снять отметку':'Отметить прочитанным';
  renderFeaturedGuides();
}
const dictionary=[
  ['搜索','Поиск'],['拍照搜索','Поиск по фотографии'],['商品','Товар'],['店铺','Магазин'],
  ['价格','Цена'],['优惠券','Купон'],['拼单','Совместная покупка'],
  ['尺码','Размер'],['尺寸','Габариты / размеры'],['颜色','Цвет'],['数量','Количество'],
  ['现货','В наличии'],['预售','Предзаказ'],['缺货','Нет в наличии'],
  ['全新','Новый'],['二手','Подержанный'],['瑕疵','Дефект'],['正品','Подлинный товар (заявление продавца)'],
  ['评价','Отзывы'],['买家秀','Фото от покупателей'],['官方旗舰店','Официальный флагманский магазин (обозначение)'],
  ['起订量','Минимальная партия'],['运费','Стоимость доставки'],['包邮','Бесплатная доставка по условиям продавца'],
  ['退货','Возврат товара'],['退款','Возврат денег'],['订单','Заказ'],['物流','Логистика / доставка'],
  ['收货地址','Адрес получения'],['付款','Оплата'],['购物车','Корзина'],['货号','Артикул']
];
function renderDictionary(){
  const query=$('dictionary-query').value.trim().toLowerCase();
  const matches=dictionary.filter(pair=>pair.join(' ').toLowerCase().includes(query));
  $('dictionary-list').innerHTML=matches.map(([word,meaning])=>
    '<div class="dictionary-row"><div><div class="dictionary-word" lang="zh">'+word+'</div><div class="dictionary-meaning">'+meaning+'</div></div><button class="secondary" data-dictionary-copy="'+dictionary.findIndex(pair=>pair[0]===word)+'" aria-label="Копировать '+word+'">Копировать</button></div>').join('');
  $('dictionary-empty').hidden=matches.length>0;
  $('dictionary-status').textContent='Слов: '+matches.length;
}
async function copyDictionaryWord(index){
  const word=dictionary[index]?.[0];
  if(!word)return;
  try{await navigator.clipboard.writeText(word);$('dictionary-status').textContent='Скопировано: '+word;}
  catch{$('dictionary-status').textContent='Скопируйте вручную: '+word;}
}
function guideCover(g,detail=false){return '<div class="guide-cover'+(detail?' guide-detail-cover':'')+'" style="--guide-color:'+g.color+';--guide-text:'+(g.dark?'#171717':'#fff')+'"><span>'+g.name+'</span><small>'+g.cn+' · Памятка</small></div>';}
function guideCards(list){return list.map(g=>'<button class="guide-card" data-go="guides/'+g.id+'">'+guideCover(g)+'<div class="guide-caption"><strong>'+g.title+'</strong>'+(guideRead.has(g.id)?'<span class="guide-done">✓ Прочитано</span>':'')+'<span>Читать гайд →</span></div></button>').join('');}
function renderGuide(id){const g=guides.find(x=>x.id===id);$('guide-list').hidden=!!g;$('guide-article').hidden=!g;if(!g){renderGuideLibrary();return;}const m=marketList.find(x=>x.id===id),app=appIdentity[id],url=g.url||m.url;$('guide-article').innerHTML='<div class="view-head"><div><div class="eyebrow">Школа шоппинга • '+g.name+'</div><h1>'+g.title+'</h1></div></div>'+guideCover(g,true)+'<div class="panel"><h2>Пошаговая памятка</h2><ol class="guide-steps">'+g.steps.map(step=>'<li>'+step+'</li>').join('')+'</ol><p class="notice">Интерфейс и требования к регистрации могут меняться. Проверяйте условия в приложении. Памятка не гарантирует доступность оплаты или товара.</p><div class="order-link"><a class="secondary" href="'+url+'" target="_blank" rel="noopener noreferrer">Официальный сайт ↗</a>'+(app?'<a class="secondary" href="https://apps.apple.com/cn/app/id'+app.ios+'" target="_blank" rel="noopener noreferrer">App Store ↗</a>':'')+(m?'<button class="primary" data-market="'+id+'">Открыть площадку</button>':'')+'</div>'+(g.kind==='pay'?'<a class="guide-source" href="https://english.shanghai.gov.cn/en-Individuals-BankingandPayments-Payments/20260920/4fc94c2f0e6b47e7939969415e5feb04.html" target="_blank" rel="noopener noreferrer">Источник: официальный гид по платежам в Шанхае ↗</a>':'')+'</div><div class="panel"><h3>Следующий шаг</h3><div class="guide-next">'+(m?'<button class="primary full" data-market-search="'+id+'">Найти товар на '+g.name+'</button>':g.kind==='pay'?'<button class="primary full" data-go="payments/'+id+'">Установка и пополнение '+g.name+'</button>':'<button class="primary full" data-go="buy">Оформить заявку</button>')+'<button class="secondary full" data-go="glossary">Открыть словарь</button></div><button id="guide-mark-read" class="secondary full guide-mark" aria-pressed="'+guideRead.has(id)+'" data-guide-read="'+id+'">'+(guideRead.has(id)?'✓ Прочитано · снять отметку':'Отметить прочитанным')+'</button><p class="guide-intro">Отметки сохраняются в браузере этого устройства.</p></div><div class="panel"><h3>Нужна помощь?</h3><a class="primary full" href="'+BOT+'">Открыть China Shopping в Telegram ↗</a></div>';}
const appIdentity={poizon:{cn:'得物',ios:'1012871328'},taobao:{cn:'淘宝',ios:'387682726'},'1688':{cn:'阿里巴巴',ios:'507097717'},pinduoduo:{cn:'拼多多',ios:'1044283059'},goofish:{cn:'闲鱼',ios:'510909506'}};
function marketTiles(list){return list.map(m=>{const app=appIdentity[m.id];return '<button class="market '+m.color+'" data-market="'+m.id+'" aria-label="'+m.name+'">'+(app?'<span class="market-cn" aria-hidden="true">'+app.cn+'</span>':icon(m.icon,28))+'<span>'+m.name+'</span></button>';}).join('');}
$('home-markets').innerHTML=marketTiles(marketList.slice(0,5));$('all-markets').innerHTML=marketTiles(marketList);
$('categories').innerHTML=categoryList.map(c=>'<button class="category art-'+c[2]+'" data-category="'+c[0]+'">'+icon(c[2],62)+'<span>'+c[1]+'</span></button>').join('');
$('nav-inner').innerHTML=navItems.map(n=>'<button type="button" data-go="'+n[0]+'">'+icon(n[2])+'<span>'+n[1]+'</span>'+(n[0]==='orders'?'<b class="nav-badge" id="cart-badge" hidden></b>':'')+'</button>').join('');
$('quick-actions').innerHTML=[['buy','Выкуп','cart'],['delivery','Расчёт','truck'],['orders','Заказы','box'],['help','Помощь','book']].map(n=>'<button class="quick-action" data-go="'+n[0]+'">'+icon(n[2],22)+'<span>'+n[1]+'</span></button>').join('');
const featuredGuides=guides.filter(g=>['poizon','taobao','pinduoduo','alipay'].includes(g.id));
function renderFeaturedGuides(){
  $('home-guides').innerHTML=guideCards(featuredGuides);
  $('school-guides').innerHTML=guideCards(featuredGuides);
}
renderFeaturedGuides();
renderGuideLibrary();
$('guide-query').addEventListener('input',renderGuideLibrary);
$('dictionary-query').addEventListener('input',renderDictionary);
$('copy-short-link').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(BOT);$('short-link-status').textContent='Ссылка скопирована.';}
  catch{$('short-link-status').textContent='Скопируйте вручную: '+BOT;}
});
function marketDetail(id){const m=marketList.find(x=>x.id===id);if(!m)return;currentMarket=id;const app=appIdentity[id];$('market-detail').innerHTML='<div class="eyebrow">'+m.name+'</div><h2 style="margin:8px 0">'+m.title+'</h2><p>'+m.description+'</p><p class="notice">'+m.mode+'</p><div class="order-link"><button class="primary" data-market-search="'+m.id+'">Найти товар</button><a class="secondary" href="'+m.url+'" target="_blank" rel="noopener noreferrer">Официальный сайт ↗</a>'+(app?'<a class="secondary" href="https://apps.apple.com/cn/app/id'+app.ios+'" target="_blank" rel="noopener noreferrer">Приложение в App Store ↗</a>':'')+'</div><button class="secondary full guide-market-button" data-go="guides/'+m.id+'">Читать гайд по '+m.name+' →</button>';}
function renderSearch(id=currentMarket){currentMarket=id;const m=marketList.find(x=>x.id===id)||marketList[0];$('market-choose').innerHTML=marketList.map(x=>'<button class="pill" type="button" data-search-market="'+x.id+'" aria-pressed="'+(x.id===m.id)+'">'+x.name+'</button>').join('');$('search-command').textContent=m.command||'Ручной подбор — '+m.name;$('search-explanation').textContent=m.mode;$('copy-command').hidden=!m.command;$('copy-status').textContent='';$('open-bot').href=BOT+'?start=photo_search';}
function productCard(i){const item=items[i];const [type,title,desc,price,aggregator,source]=item;const [label,ic]=cats[type];const id=idOf(item,i);const num=price?Number(price.replace(',','.')):null;const rub=num!==null?num*rate.rubPerYuan:null;const display=price?price+' ¥':'По запросу';const priceNote=price?('Цена источника от '+dateLabel()+' · курс '+rateLabel()):'Цена требует сверки'+(aggregator?' · ориентир '+aggregator+' ¥ ≈ '+rubles.format(Number(aggregator.replace(',','.'))*rate.rubPerYuan):'');const saved=favorites.has(id);return '<article class="product" data-type="'+type+'"><div class="product-art"><span class="art-icon">'+icon(ic,52)+'</span><img src="img/'+id+'.webp" alt="'+escapeHtml(title)+'" loading="lazy"><button type="button" class="heart" data-favorite="'+i+'" aria-label="Избранное: '+escapeHtml(title)+'" aria-pressed="'+saved+'">'+icon('heart',21)+'</button></div><div class="product-body"><span class="eyebrow">'+label+'</span><h3>'+escapeHtml(title)+'</h3><div class="price-row"><span class="price">'+display+'</span>'+(rub!==null?'<span class="price-rub">≈ '+rubles.format(rub)+'</span>':'')+'</div><small>'+priceNote+'</small><p class="desc">'+escapeHtml(desc)+'</p><div class="actions"><button class="primary" type="button" data-cart-add="'+i+'">В корзину</button><a class="secondary" href="'+formatUrl('Здравствуйте! Уточните наличие, вариант и стоимость: '+title+' '+source)+'">Уточнить заказ</a></div><a class="source-link" href="'+escapeHtml(source)+'" target="_blank" rel="noopener noreferrer">Карточка и фото у источника ↗</a></div></article>';}
function renderCatalog(){const query=$('catalog-query').value.trim().toLowerCase();const types=catTypes[category]||[];const inCat=items.map((x,i)=>[x,i]).filter(([x])=>types.includes(x[0]));const options=[['all','Все '+inCat.length],...types.map(t=>[t,cats[t][0]])];$('filters').innerHTML=options.map(([id,label])=>'<button class="pill" data-filter="'+id+'" aria-pressed="'+(filter===id)+'">'+label+'</button>').join('');const pending=types.length>0&&inCat.length===0;$('category-note').hidden=!pending;$('category-note').textContent=pending?'Для категории «'+(categoryList.find(x=>x[0]===category)?.[1]||'')+'» готовим новые проверенные карточки. Сейчас можно отправить фото или ссылку на поиск.':'';const matches=inCat.filter(([x])=>filter==='all'||filter===x[0]).filter(([x])=>!query||x.slice(0,3).join(' ').toLowerCase().includes(query));$('grid').innerHTML=matches.map(([,i])=>productCard(i)).join('');$('result-count').textContent='Найдено: '+matches.length;$('catalog-empty').hidden=matches.length>0;}
function renderSaved(){const selected=items.map((row,i)=>favorites.has(idOf(row,i))?i:-1).filter(i=>i>=0);$('saved-list').innerHTML=selected.map(productCard).join('');$('saved-empty').hidden=selected.length>0;}
const brands=[['H&M','hm'],['ZARA','zara'],['MANGO','mango'],['UNIQLO','uniqlo'],['OYSHO','oysho'],['GAP','gap'],['LEVI’S','levis'],['Victoria’s Secret','victoriassecretcn'],['The North Face','thenorthface'],['Nike','nike'],['adidas','adidas'],['PUMA','puma'],['New Balance','newbalance'],['Skechers','skechersyd'],['Li-Ning','lining'],['Crocs','crocs'],['UGG','ugg']];
function renderBrands(){const q=$('brand-query').value.trim().toLowerCase();const matches=brands.filter(x=>x[0].toLowerCase().includes(q));$('brand-list').innerHTML=matches.length?matches.map(([name,sub])=>'<div class="section-head" style="border-bottom:1px solid var(--line);padding:8px 0;margin:0"><strong>'+name+'</strong><a class="text-button" href="https://'+sub+'.tmall.com/" target="_blank" rel="noopener noreferrer">Tmall ↗</a></div>').join(''):'<p class="muted">В справочнике нет этого бренда. Попробуйте поиск в боте.</p>';}
$('brand-query').addEventListener('input',renderBrands);
function renderFeatured(){const selected=[5,8].filter(i=>i<items.length);$('featured').innerHTML=(selected.length?selected:items.slice(0,2).map((_,i)=>i)).map(productCard).join('');}
function saveFavorite(i){if(!Number.isInteger(i)||i<0||i>=items.length)return;const id=idOf(items[i],i);if(favorites.has(id))favorites.delete(id);else favorites.add(id);try{localStorage.setItem('china-shopping-favorites-v2',JSON.stringify([...favorites]));}catch{}document.querySelectorAll('[data-favorite="'+i+'"]').forEach(b=>b.setAttribute('aria-pressed',String(favorites.has(id))));renderSaved();}
const cart=new Map();
try{const rows=JSON.parse(localStorage.getItem('china-shopping-cart-v1')||'[]');if(Array.isArray(rows))for(const row of rows.slice(0,5))if(Array.isArray(row)&&typeof row[0]==='string'&&/^[a-z0-9-]{1,50}$/.test(row[0])&&Number.isInteger(row[1])&&row[1]>=1&&row[1]<=99&&typeof row[2]==='string')cart.set(row[0],{qty:row[1],note:row[2].slice(0,80)});}catch{}
const byId=id=>items.find((item,i)=>idOf(item,i)===id);
function saveCart(){try{localStorage.setItem('china-shopping-cart-v1',JSON.stringify([...cart].map(([id,r])=>[id,r.qty,r.note])));}catch{}}
function cartTotals(){let sum=0,unknown=0,n=0;for(const [id,r] of cart){const p=byId(id);n+=r.qty;if(!p||p[3]===null)unknown++;else sum+=Number(p[3].replace(',','.'))*r.qty;}return {sum:sum*rate.rubPerYuan,unknown,n};}
function addCart(i){if(!Number.isInteger(i)||!items[i])return;const id=idOf(items[i],i);if(!cart.has(id)&&cart.size>=5){route('orders');$('cart-warning').textContent='В одной заявке не более пяти товаров.';haptic('warning');return;}const r=cart.get(id)||{qty:0,note:''};r.qty=Math.min(99,r.qty+1);cart.set(id,r);saveCart();renderDrawer();openDrawer();haptic('success');}
function cartText(){return 'Заявка на выкуп (уточните наличие и стоимость):\n'+[...cart].map(([id,r],i)=>{const p=byId(id);return (i+1)+'. '+(p?p[1]:'Товар из предыдущей подборки')+' × '+r.qty+(r.note?' — '+r.note:'')+(p?'\n'+p[5]:'');}).join('\n')+'\nДоставка отдельно. Прошу подтвердить вариант и итоговую стоимость.';}
function refreshCart(){const missing=[...cart.keys()].some(id=>!byId(id));let sum=0,unknown=0;for(const [id,r] of cart){const p=byId(id);if(!p||p[3]===null)unknown++;else sum+=Number(p[3].replace(',','.'))*r.qty;}const n=[...cart.values()].reduce((s,r)=>s+r.qty,0);$('cart-summary').textContent=cart.size?'Позиций: '+cart.size+' · единиц: '+n+' · ориентир по ценам источников: '+rubles.format(sum*rate.rubPerYuan)+(unknown?' · без '+unknown+' поз. по запросу':'')+' · доставка отдельно.':'Корзина пуста.';const link=$('cart-request');link.hidden=!cart.size||missing;link.href=cart.size&&cartText().length<=1800?formatUrl(cartText()):BOT;$('copy-cart').disabled=!cart.size||missing;updateCartBadge();$('cart-warning').textContent=missing?'Одна или несколько позиций удалены из актуального каталога. Уберите их из заявки.':cart.size&&cartText().length>1800?'Скопируйте заявку перед переходом в бот.':'';}
function renderCart(){$('cart-list').innerHTML=[...cart].map(([id,r])=>{const p=byId(id);return '<div class="panel" style="margin-top:12px"><h3>'+escapeHtml(p?p[1]:'Позиция недоступна')+'</h3><label class="field"><span>Количество</span><input type="number" min="1" max="99" inputmode="numeric" value="'+r.qty+'" data-cart-qty="'+id+'"></label><label class="field"><span>Размер / цвет / вариант</span><input maxlength="80" value="'+escapeHtml(r.note)+'" data-cart-note="'+id+'" placeholder="Укажите вариант"></label><button type="button" class="secondary" data-cart-remove="'+id+'">Убрать</button></div>';}).join('');refreshCart();}
document.addEventListener('change',event=>{const id=event.target.dataset?.cartQty;if(!cart.has(id))return;const value=Number(event.target.value);const r=cart.get(id);r.qty=Number.isInteger(value)?Math.max(1,Math.min(99,value)):1;event.target.value=r.qty;saveCart();refreshCart();});
document.addEventListener('input',event=>{const id=event.target.dataset?.cartNote;if(!cart.has(id))return;cart.get(id).note=event.target.value.slice(0,80);saveCart();refreshCart();});
$('copy-cart').addEventListener('click',async()=>{if(!cart.size||[...cart.keys()].some(id=>!byId(id)))return;try{await navigator.clipboard.writeText(cartText());$('cart-warning').textContent='Заявка скопирована. Отправьте её в боте.';}catch{$('cart-warning').textContent=cartText();}});
document.addEventListener('click',event=>{const b=event.target.closest('button');if(!b)return;if(b.dataset.cartAdd!==undefined){addCart(Number(b.dataset.cartAdd));}else if(b.dataset.dqty!==undefined){const r=cart.get(b.dataset.id);if(r){r.qty=Math.max(1,Math.min(99,r.qty+Number(b.dataset.dqty)));cart.set(b.dataset.id,r);saveCart();renderDrawer();refreshCart();}}else if(b.dataset.cartRemove!==undefined){cart.delete(b.dataset.cartRemove);saveCart();renderCart();}else if(b.dataset.guideFilter){guideFilter=b.dataset.guideFilter;renderGuideLibrary();}else if(b.dataset.guideReset!==undefined){guideFilter='all';$('guide-query').value='';renderGuideLibrary();}else if(b.dataset.guideRead){toggleGuideRead(b.dataset.guideRead);}else if(b.dataset.dictionaryCopy!==undefined){copyDictionaryWord(Number(b.dataset.dictionaryCopy));}else if(b.dataset.go){if(b.dataset.go==='catalog'){category='auto';filter='all';$('catalog-query').value='';}route(b.dataset.go);if(b.dataset.go==='orders'&&!$('drawer-wrap').hidden)closeDrawer();}else if(b.dataset.market){route('markets/'+b.dataset.market);}else if(b.dataset.marketSearch){route('search/'+b.dataset.marketSearch);}else if(b.dataset.searchMarket){route('search/'+b.dataset.searchMarket);}else if(b.dataset.category){filter='all';$('catalog-query').value='';route('catalog/'+b.dataset.category);}else if(b.dataset.filter){filter=b.dataset.filter;renderCatalog();}else if(b.dataset.favorite!==undefined){saveFavorite(Number(b.dataset.favorite));}});
$('catalog-query').addEventListener('input',()=>{renderCatalog();});
$('copy-command').addEventListener('click',async()=>{const command=marketList.find(x=>x.id===currentMarket)?.command;if(!command)return;try{await navigator.clipboard.writeText(command);$('copy-status').textContent='Подпись скопирована.';}catch{$('copy-status').textContent='Скопируйте подпись вручную: '+command;}});
function calculate(){const v=$('yuan-amount').valueAsNumber;$('rate-validity').textContent='Рабочий курс: '+new Intl.NumberFormat('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:2}).format(rate.rubPerYuan)+' ₽ за 1 ¥. Действует до изменения владельцем.';$('rub-total').textContent=Number.isFinite(v)&&v>=0&&v<=10000000?rubles.format(v*rate.rubPerYuan):'—';}
$('yuan-amount').addEventListener('input',calculate);
function linkInput(id,target,prefix){const field=$(id);const update=()=>{$(target).href=formatUrl(prefix+(field.value.trim()||'Уточню детали в чате'));};field.addEventListener('input',update);update();}
linkInput('request-details','request-link','Здравствуйте! Хочу найти товар: ');linkInput('delivery-details','delivery-request','Здравствуйте! Рассчитайте доставку: ');linkInput('order-number','order-request','Здравствуйте! Уточните статус заказа: ');linkInput('buy-details','buy-request','Здравствуйте! Хочу заказать товар: ');
try{window.Telegram?.WebApp?.BackButton?.onClick(()=>route($('route-back').dataset.go||'home'));}catch{}
try{const tg=window.Telegram?.WebApp;if(tg&&tg.initData){tg.ready();tg.expand();tg.setHeaderColor?.('#111113');tg.setBackgroundColor?.('#111113');if(typeof tg.disableVerticalSwipes==='function')tg.disableVerticalSwipes();}}catch{}
document.addEventListener('click',e=>{if(e.target.closest('[data-drawer-close]'))closeDrawer();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('drawer-wrap').hidden)closeDrawer();});
document.addEventListener('click',e=>{if(e.target.closest('button'))haptic();},true);window.addEventListener('hashchange',renderRoute);(function(){const seg='Курс <b>'+rateLabel()+' ₽</b> за 1 ¥<i class="ticker-dot">·</i>Выкуп без комиссии<i class="ticker-dot">·</i>Доставка рассчитывается отдельно<i class="ticker-dot">·</i>Склад в Суйфэньхэ<i class="ticker-dot">·</i>Проверка товара по запросу<i class="ticker-dot">·</i>';$('ticker-track').innerHTML='<span>'+seg+'</span><span aria-hidden="true">'+seg+'</span>';})();
marketDetail('poizon');renderSearch();renderFeatured();renderSaved();calculate();renderRoute();renderCart();renderDrawer();updateCartBadge();updateCatalogInfo();loadCatalogData();
if('serviceWorker' in navigator&&window.location?.protocol==='https:'&&!window.Telegram?.WebApp?.initData&&(!window.Telegram?.WebApp?.platform||window.Telegram.WebApp.platform==='unknown')){navigator.serviceWorker.register('sw.js').catch(()=>{});}
