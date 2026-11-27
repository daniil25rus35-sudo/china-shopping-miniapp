const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const test = require('node:test');

const html = fs.readFileSync(process.env.MINIAPP_TEST_FILE || 'index.html', 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
const BOT = 'https://t.me/ChinaShoppingVLBotai';

function setup(tg) {
  const listeners = [], nodes = new Map();
  function node(id) {
    assert.ok(ids.includes(id), 'valid DOM id ' + id);
    if (!nodes.has(id)) nodes.set(id,{id,innerHTML:'',textContent:'',value:'',valueAsNumber:NaN,hidden:false,href:'',dataset:{},addEventListener(){},setAttribute(){},removeAttribute(){}});
    return nodes.get(id);
  }
  const document = { getElementById:node, querySelectorAll:()=>[], querySelector:()=>true, addEventListener:(type,fn)=>{if(type==='click')listeners.push(fn);} };
  const context = {document,window:{Telegram:tg?{WebApp:tg}:undefined,addEventListener(){},scrollTo(){}},location:{hash:'#search/poizon'},localStorage:{getItem:()=>null,setItem(){}},navigator:{},Intl,Date,URL};
  vm.runInNewContext(script+'\n;globalThis.api={renderSearch,marketList,items,formatUrl,calculate,validateCatalog,cart,addCart,cartText,renderCart,parseRoute,renderRoute};',context);
  function click(href, options={}){
    const event={button:0,defaultPrevented:false,preventDefault(){this.defaultPrevented=true;},target:{closest:s=>s==='a[href]'?{href}:null},...options};
    for(const fn of listeners)fn(event);
    return event.defaultPrevented;
  }
  return {node,click,api:context.api};
}
function native(overrides={}){
  const calls=[];return {calls,tg:{platform:'android',initData:'',openTelegramLink:url=>calls.push(['open',url]),close:()=>calls.push(['close']),...overrides}};
}

test('photo-search opens the bot instruction without a competing close call',()=>{
  const {calls,tg}=native(); const app=setup(tg);
  for(const [id,cmd] of [['poizon','поиск poizon'],['taobao','поиск taobao'],['1688','поиск 1688']]){
    app.api.renderSearch(id);
    assert.equal(app.node('search-command').textContent,cmd);
    assert.equal(new URL(app.node('open-bot').href).searchParams.get('start'),'photo_search');
    assert.equal(app.click(app.node('open-bot').href),true);
    assert.deepEqual(calls.splice(0),[['open',BOT+'?start=photo_search']]);
  }
  app.api.renderSearch('jd');assert.equal(app.node('open-bot').href,BOT+'?start=photo_search');
  assert.equal(app.click(BOT),true);assert.deepEqual(calls,[['open',BOT]]);
  assert.match(html,/<a class="primary hero-action" href="https:\/\/t\.me\/ChinaShoppingVLBotai\?start=photo_search">/);
});
test('fixed rate has no deadline and works for future dates',()=>{
  const app=setup();app.node('yuan-amount').valueAsNumber=100;app.api.calculate();
  assert.match(app.node('rub-total').textContent,/1[\s\u00a0\u202f]380/);
  assert.doesNotMatch(app.node('rate-validity').textContent,/истёк|02\.12|на 7 дней/);
});
test('catalog validates source URLs, prices, stable IDs and duplicate IDs',()=>{
  const data=JSON.parse(fs.readFileSync('catalog-data.json','utf8'));const app=setup();
  assert.equal(app.api.validateCatalog(data),true);
  const bad=structuredClone(data);bad.items[0][5]='javascript:alert(1)';assert.equal(app.api.validateCatalog(bad),false);
  const dupe=structuredClone(data);dupe.items[1][6]=dupe.items[0][6];assert.equal(app.api.validateCatalog(dupe),false);
  const prices=structuredClone(data);prices.items[0][3]='не число';assert.equal(app.api.validateCatalog(prices),false);
});
test('cart creates a draft, adds quantity and generates the existing bot link without sending',()=>{
  const {calls,tg}=native();const app=setup(tg);app.api.addCart(5);app.api.addCart(5);
  assert.equal(app.api.cart.get('auto-006').qty,2);
  assert.match(app.api.cartText(),/Xiaomi 100W × 2/);
  assert.match(app.node('cart-request').href,/ChinaShoppingVLBotai\?text=/);
  assert.equal(calls.length,0);
  assert.match(app.node('cart-summary').textContent,/единиц: 2/);
  assert.equal(app.api.parseRoute('#nonexistent').path,'home');
});
test('normal web browser and unknown Telegram platform preserve ordinary links',()=>{
  assert.equal(setup().click(BOT),false);
  const {calls,tg}=native({platform:'unknown'});
  assert.equal(setup(tg).click(BOT),false);assert.equal(calls.length,0);
});
test('native bot draft and global return work, unrelated links unchanged',()=>{
  const {calls,tg}=native();const app=setup(tg);
  const draft=app.api.formatUrl('Заявка: товар & цвет');
  assert.equal(app.click(draft),true);assert.deepEqual(calls.splice(0),[['open',draft]]);
  assert.equal(app.click('https://t.me/ShoppinngChina'),false);
  assert.equal(app.click('https://example.org/ChinaShoppingVLBotai'),false);
  assert.equal(app.click(BOT,{ctrlKey:true}),false);
  assert.equal(calls.length,0);
});
test('older client and failed native bridge preserve actual target rather than closing to arbitrary chat',()=>{
  const a=native({openTelegramLink:undefined});const app=setup(a.tg);
  assert.equal(app.click(BOT),false);assert.deepEqual(a.calls,[]);
  assert.equal(app.click(BOT+'?text=test'),false);
  const b=native({openTelegramLink:()=>{throw Error('unsupported');}});
  assert.equal(setup(b.tg).click(BOT),false);assert.deepEqual(b.calls,[]);
  assert.equal(setup(b.tg).click(BOT+'?text=test'),false);
});
test('official script and explicit return are present; existing IDs are unique',()=>{
  assert.match(html,/src="https:\/\/telegram\.org\/js\/telegram-web-app\.js"/);
  assert.match(html,/class="bot-return"[^>]+href="https:\/\/t\.me\/ChinaShoppingVLBotai"/);
  const app=setup();assert.ok(app.api.items.length>0);assert.ok(app.api.marketList.length>0);
  assert.equal(new Set(ids).size,ids.length);
  if(process.env.MINIAPP_BASELINE){
    const before=fs.readFileSync(process.env.MINIAPP_BASELINE,'utf8');
    for (const block of ['items','marketList']) {
      const re=new RegExp('const '+block+'=(\\[[\\s\\S]*?\\n\\]);');
      assert.equal(html.match(re)[1],before.match(re)[1]);
    }
  }
});


