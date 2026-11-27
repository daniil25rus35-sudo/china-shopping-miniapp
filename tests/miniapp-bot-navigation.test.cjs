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
  vm.runInNewContext(script+'\n;globalThis.api={renderSearch,marketList,items,formatUrl};',context);
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

