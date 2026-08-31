(function(){
  const USER='admin', PASS='nsmfuxmlii2026';
  const KEY='ARD_GAME_OVERRIDES';
  const meta=[
    {slot:'g2',id:'tf',label:'LO2 - เกม 2',type:'quiz',title:'True/False: กลไกยาและความปลอดภัย',subtitle:'ตัดสินข้อความเกี่ยวกับยาปฏิชีวนะว่าถูกหรือผิด'},
    {slot:'g3',id:'match',label:'LO2 - เกม 3',type:'match',title:'จับคู่ยาและการใช้ทางคลินิก',subtitle:'ลากเส้นจับคู่ยาปฏิชีวนะกับคำใบ้ทางคลินิก'},
    {slot:'g4',id:'adr',label:'LO2 - เกม 4',type:'quiz',title:'เกมเลือกตอบ ADR',subtitle:'เลือกอาการไม่พึงประสงค์หรือข้อควรระวังทางการพยาบาล'},
    {slot:'g5',id:'order',label:'LO2 - เกม 5',type:'order',title:'เกมเรียงลำดับ 14R',subtitle:'ลากการ์ดเพื่อเรียงขั้นตอนการบริหาร Ceftriaxone อย่างปลอดภัย'},
    {slot:'g6',id:'dose',label:'LO3 - เกม 1',type:'dose',title:'สถานการณ์คำนวณยาปฏิชีวนะ',subtitle:'คำนวณขนาดยาและปริมาตรยาที่ต้องเตรียม พร้อมรูปประกอบโจทย์'},
    {slot:'g7',id:'ward',label:'LO3 - เกม 2',type:'situation',title:'สถานการณ์ความปลอดภัยบนหอผู้ป่วย',subtitle:'จับผิดขั้นตอนการบริหารยาและเลือกวิธีป้องกัน'}
  ];
  const $=id=>document.getElementById(id);
  const state={active:null,data:load(),editing:false};
  function load(){ try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return{}} }
  function save(){ localStorage.setItem(KEY, JSON.stringify(state.data)); $('status').textContent='บันทึกแล้ว'; }
  function auth(){ return sessionStorage.getItem('ARD_ADMIN_AUTH')==='1'; }
  function setAuth(v){ sessionStorage.setItem('ARD_ADMIN_AUTH', v ? '1' : '0'); }
  function text(v){ return String(v ?? ''); }
  function esc(v){ return text(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function unesc(v){ return text(v).replace(/&quot;/g,'"').replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&amp;/g,'&'); }
  function baseItem(m){
    if(m.type==='quiz') return {q:[]};
    if(m.type==='match') return {pairs:[]};
    if(m.type==='order') return {steps:[]};
    if(m.type==='dose') return {cases:[]};
    return {cases:[]};
  }
  function itemList(m, obj){
    if(m.type==='quiz') return obj.q || [];
    if(m.type==='match') return obj.pairs || [];
    if(m.type==='order') return obj.steps || [];
    return obj.cases || [];
  }
  function ensureGame(m){
    if(!state.data[m.id]) state.data[m.id]=Object.assign({
      title:m.title,
      subtitle:m.subtitle
    }, baseItem(m));
    state.data[m.id].title = state.data[m.id].title || m.title;
    state.data[m.id].subtitle = state.data[m.id].subtitle || m.subtitle;
    return state.data[m.id];
  }
  function login(){
    if($('user').value===USER && $('pass').value===PASS){
      setAuth(true);
      $('status').textContent='เข้าสู่ระบบแล้ว';
      $('loginView').classList.add('hidden');
      $('adminView').classList.remove('hidden');
      render();
    } else {
      $('loginMsg').innerHTML='<span class="err">ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง</span>';
    }
  }
  function logout(){
    setAuth(false);
    $('status').textContent='ยังไม่ได้เข้าสู่ระบบ';
    $('adminView').classList.add('hidden');
    $('loginView').classList.remove('hidden');
  }
  function renderSidebar(){
    const nav=$('navList');
    nav.innerHTML='';
    meta.forEach((m,i)=>{
      const b=document.createElement('button');
      b.className='navbtn'+(state.active===m.id?' active':'');
      b.textContent=m.label;
      b.onclick=()=>{state.active=m.id; render();};
      nav.appendChild(b);
      if(i===0 && !state.active) state.active=m.id;
    });
  }
  function itemEditor(m, item, idx){
    if(m.type==='quiz'){
      return `<div class="entry" data-idx="${idx}">
        <div class="entry-head"><strong>ข้อ ${idx+1}</strong><button class="mini danger" data-del="${idx}">ลบ</button></div>
        <label>โจทย์</label><textarea data-field="p">${esc(item.p||'')}</textarea>
        <label>ตัวเลือก</label><textarea data-field="c">${esc(JSON.stringify(item.c||[],null,2))}</textarea>
        <div class="two">
          <div><label>คำตอบ</label><input data-field="a" value="${esc(item.a||'')}"></div>
          <div><label>คำอธิบาย</label><input data-field="f" value="${esc(item.f||'')}"></div>
        </div>
      </div>`;
    }
    if(m.type==='match'){
      return `<div class="entry" data-idx="${idx}">
        <div class="entry-head"><strong>คู่ ${idx+1}</strong><button class="mini danger" data-del="${idx}">ลบ</button></div>
        <div class="two">
          <div><label>คำซ้าย</label><input data-field="l" value="${esc(item[0]||'')}"></div>
          <div><label>คำขวา</label><input data-field="r" value="${esc(item[1]||'')}"></div>
        </div>
      </div>`;
    }
    if(m.type==='order'){
      return `<div class="entry" data-idx="${idx}">
        <div class="entry-head"><strong>ขั้น ${idx+1}</strong><button class="mini danger" data-del="${idx}">ลบ</button></div>
        <label>ข้อความ</label><textarea data-field="step">${esc(item||'')}</textarea>
      </div>`;
    }
    return `<div class="entry" data-idx="${idx}">
      <div class="entry-head"><strong>ข้อ ${idx+1}</strong><button class="mini danger" data-del="${idx}">ลบ</button></div>
      <label>สถานการณ์</label><textarea data-field="p">${esc(item.p||'')}</textarea>
      <label>คำตอบตัวเลือก</label><textarea data-field="c">${esc(JSON.stringify(item.c||[],null,2))}</textarea>
      <div class="two">
        <div><label>คำตอบถูก</label><input data-field="a" value="${esc(item.a||'')}"></div>
        <div><label>คำอธิบาย</label><input data-field="f" value="${esc(item.f||'')}"></div>
      </div>
      ${m.type==='dose' ? `
      <div class="two">
        <div><label>Image URL (ใส่หรือเว้นว่างได้)</label><input data-field="img" value="${esc(item.img||'')}"></div>
        <div><label>Size</label><div class="two"><input data-field="imgWidth" placeholder="width" value="${esc(item.imgWidth||'320')}"><input data-field="imgHeight" placeholder="height" value="${esc(item.imgHeight||'220')}"></div></div>
      </div>` : ''}
    </div>`;
  }
  function render(){
    renderSidebar();
    const m=meta.find(x=>x.id===state.active) || meta[0];
    state.active=m.id;
    const obj=ensureGame(m);
    $('gameTitle').textContent=m.label;
    $('gameMeta').textContent=m.title;
    $('gameSub').textContent=m.subtitle;
    $('gameTitleInput').value=obj.title||m.title;
    $('gameSubInput').value=obj.subtitle||m.subtitle;
    $('editorList').innerHTML = itemList(m,obj).map((it,idx)=>itemEditor(m,it,idx)).join('');
    $('emptyHint').classList.toggle('hidden', itemList(m,obj).length>0);
    $('addBtn').textContent = m.type==='quiz' ? 'เพิ่มข้อคำถาม' : m.type==='match' ? 'เพิ่มคู่จับคู่' : m.type==='order' ? 'เพิ่มขั้นตอน' : 'เพิ่มสถานการณ์';
  }
  function readEditors(){
    const m=meta.find(x=>x.id===state.active);
    const obj=ensureGame(m);
    obj.title=$('gameTitleInput').value.trim()||m.title;
    obj.subtitle=$('gameSubInput').value.trim()||m.subtitle;
    const entries=[...$('editorList').querySelectorAll('.entry')];
    if(m.type==='quiz'){
      obj.q=entries.map(el=>({
        p:el.querySelector('[data-field="p"]').value.trim(),
        c:JSON.parse(el.querySelector('[data-field="c"]').value||'[]'),
        a:el.querySelector('[data-field="a"]').value.trim(),
        f:el.querySelector('[data-field="f"]').value.trim()
      }));
    } else if(m.type==='match'){
      obj.pairs=entries.map(el=>[el.querySelector('[data-field="l"]').value.trim(), el.querySelector('[data-field="r"]').value.trim()]);
    } else if(m.type==='order'){
      obj.steps=entries.map(el=>el.querySelector('[data-field="step"]').value.trim()).filter(Boolean);
    } else {
      obj.cases=entries.map(el=>({
        p:el.querySelector('[data-field="p"]').value.trim(),
        c:JSON.parse(el.querySelector('[data-field="c"]').value||'[]'),
        a:el.querySelector('[data-field="a"]').value.trim(),
        f:el.querySelector('[data-field="f"]').value.trim(),
        img:el.querySelector('[data-field="img"]').value.trim()||undefined,
        imgWidth:Number(el.querySelector('[data-field="imgWidth"]').value||320),
        imgHeight:Number(el.querySelector('[data-field="imgHeight"]').value||220)
      }));
    }
  }
  $('loginBtn').onclick=login;
  $('logoutBtn').onclick=logout;
  $('saveBtn').onclick=()=>{ try{ readEditors(); save(); }catch(e){ alert(e.message); } };
  $('resetBtn').onclick=()=>{ if(confirm('ลบข้อมูลที่แก้ไขทั้งหมดในเครื่องนี้?')){ localStorage.removeItem(KEY); state.data={}; render(); } };
  $('exportBtn').onclick=()=>{ try{ readEditors(); save(); navigator.clipboard?.writeText(JSON.stringify(state.data,null,2)); alert('บันทึกแล้ว และคัดลอกข้อมูลไปยังคลิปบอร์ด'); }catch(e){ alert(e.message); } };
  $('addBtn').onclick=()=>{
    const m=meta.find(x=>x.id===state.active);
    const obj=ensureGame(m);
    if(m.type==='quiz') obj.q.push({p:'',c:['',''],a:'',f:''});
    else if(m.type==='match') obj.pairs.push(['','']);
    else if(m.type==='order') obj.steps.push('');
    else obj.cases.push({p:'',c:[''],a:'',f:'',img:'',imgWidth:320,imgHeight:220});
    render();
  };
  $('editorList').addEventListener('click',e=>{
    const btn=e.target.closest('[data-del]');
    if(!btn)return;
    if(!confirm('ยืนยันการลบรายการนี้ใช่ไหม?')) return;
    const idx=Number(btn.dataset.del);
    const m=meta.find(x=>x.id===state.active);
    const obj=ensureGame(m);
    if(m.type==='quiz') obj.q.splice(idx,1);
    else if(m.type==='match') obj.pairs.splice(idx,1);
    else if(m.type==='order') obj.steps.splice(idx,1);
    else obj.cases.splice(idx,1);
    render();
  });
  $('editorList').addEventListener('input',()=>{ try{ readEditors(); save(); }catch(e){} });
  if(auth()){
    $('status').textContent='เข้าสู่ระบบแล้ว';
    $('loginView').classList.add('hidden');
    $('adminView').classList.remove('hidden');
    render();
  }
})();
