(function(){
const cfg=window.ARD_SUPABASE_CONFIG||{};
const ready=cfg.url&&cfg.anonKey&&!cfg.url.includes('YOUR_PROJECT_REF')&&!cfg.anonKey.includes('YOUR_SUPABASE_ANON_KEY');
const client=ready&&window.supabase?window.supabase.createClient(cfg.url,cfg.anonKey):null;
let session=null,surveys=[],scores=[],members=[];
let trackedSessionId='';
const pageSize=10;
const pages={members:1,surveys:1,scores:1};
const $=id=>document.getElementById(id);
function esc(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function msg(t){$('msg').textContent=t}
function memberMsg(t){$('memberMsg').textContent=t}
function show(el){['loginPanel','noAccessPanel','dash'].forEach(id=>$(id)?.classList.toggle('hidden',id!==el));}
function bindPasswordToggle(buttonId,inputId){
  const btn=$(buttonId), input=$(inputId); if(!btn||!input)return;
  btn.onclick=()=>{const visible=input.type==='text';input.type=visible?'password':'text';btn.textContent=visible?'👁':'ซ่อน';btn.setAttribute('aria-label',visible?'แสดงรหัสผ่าน':'ซ่อนรหัสผ่าน');};
}
async function loginWithGoogle(){
  if(!client){msg('ยังไม่ได้ตั้งค่า Supabase ใน supabase-config.js');return;}
  const redirectTo=location.protocol==='file:'?'http://127.0.0.1:8088/admin-dashboard':location.origin+'/admin-dashboard';
  const {error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo}});
  if(error)msg(error.message);
}
async function logout(){
  if(client)await client.auth.signOut();
  session=null;
  $('who').textContent='ยังไม่ได้เข้าสู่ระบบ';
  show('loginPanel');
}
async function adminApi(method,body){
  if(!session?.access_token)throw new Error('กรุณาเข้าสู่ระบบแอดมินอีกครั้ง');
  const res=await fetch('/api/admin-users',{method,headers:{'Content-Type':'application/json','Authorization':'Bearer '+session.access_token},body:body?JSON.stringify(body):undefined});
  const data=await res.json().catch(()=>({}));
  if(!res.ok)throw new Error(data.error||'เรียก API ไม่สำเร็จ');
  return data;
}
async function adminSurveyApi(method,body){
  if(!session?.access_token)throw new Error('กรุณาเข้าสู่ระบบแอดมินอีกครั้ง');
  const res=await fetch('/api/admin-surveys',{method,headers:{'Content-Type':'application/json','Authorization':'Bearer '+session.access_token},body:body?JSON.stringify(body):undefined});
  const data=await res.json().catch(()=>({}));
  if(!res.ok)throw new Error(data.error||'เรียก API ไม่สำเร็จ');
  return data;
}
async function assertAdmin(){
  const data=await adminApi('GET');
  members=data.users||[];
}
async function showNoAccess(){
  $('who').textContent=session?.user?.email||'ไม่มีสิทธิ์เข้าใช้งาน';
  show('noAccessPanel');
}
async function showDashboard(email){
  $('who').textContent=email;
  show('dash');
  await trackLogin();
  renderMembers();
  await loadData();
}
async function trackLogin(){
  if(!session?.access_token||trackedSessionId===session.access_token)return;
  trackedSessionId=session.access_token;
  try{await fetch('/api/login-events',{method:'POST',headers:{'Authorization':'Bearer '+session.access_token}});}catch(e){}
}
async function loadData(){
  try{
    const data=await adminSurveyApi('GET');
    surveys=data.surveys||[];
    scores=data.scores||[];
    render();
  }catch(e){
    alert(e.message||String(e));
  }
}
async function loadMembers(){
  try{
    memberMsg('กำลังโหลดสมาชิก...');
    const data=await adminApi('GET');
    members=data.users||[];
    renderMembers();
    memberMsg('โหลดสมาชิกเรียบร้อย');
  }catch(e){
    memberMsg('ยังใช้งานจัดการสมาชิกไม่ได้: '+(e.message||e));
  }
}
function render(){
  $('surveyCount').textContent=surveys.length;
  $('scoreCount').textContent=scores.length;
  $('totalRows').textContent=surveys.length+scores.length;
  const avg=scores.length?Math.round(scores.reduce((a,b)=>a+Number(b.score||0),0)/scores.length):0;
  $('avgScore').textContent=avg;
  renderSurveyTable(); renderScoreTable();
}
function pageItems(items,key){
  const totalPages=Math.max(1,Math.ceil(items.length/pageSize));
  pages[key]=Math.min(Math.max(1,pages[key]||1),totalPages);
  const start=(pages[key]-1)*pageSize;
  return {items:items.slice(start,start+pageSize),start,totalPages};
}
function renderPager(id,key,total){
  const pager=$(id); if(!pager)return;
  const totalPages=Math.max(1,Math.ceil(total/pageSize));
  pages[key]=Math.min(Math.max(1,pages[key]||1),totalPages);
  const start=total?(pages[key]-1)*pageSize+1:0;
  const end=Math.min(total,pages[key]*pageSize);
  pager.innerHTML='<div class="pager-info">แสดง '+esc(start)+'-'+esc(end)+' จาก '+esc(total)+' รายการ</div><div class="pager-actions"><button class="btn lav" type="button" data-page="'+key+'" data-dir="-1" '+(pages[key]<=1?'disabled':'')+'>ก่อนหน้า</button><button class="btn lav" type="button" data-page="'+key+'" data-dir="1" '+(pages[key]>=totalPages?'disabled':'')+'>ถัดไป</button></div>';
  pager.querySelectorAll('[data-page]').forEach(btn=>btn.onclick=()=>{
    pages[key]+=Number(btn.dataset.dir);
    if(key==='members')renderMembers();
    if(key==='surveys')renderSurveyTable();
    if(key==='scores')renderScoreTable();
  });
}
function renderMembers(){
  const page=pageItems(members,'members');
  $('memberBody').innerHTML=page.items.map(m=>'<tr><td>'+esc(m.email)+'</td><td>'+esc(roleLabel(m.role))+'</td><td>'+esc(m.email_confirmed_at?'ยืนยันแล้ว':'ยังไม่ยืนยัน')+'</td><td>'+esc(m.login_count||0)+'</td><td>'+esc(formatDate(m.last_sign_in_at))+'</td><td><div class="row-actions"><button class="btn lav" type="button" data-edit="'+esc(m.id)+'">แก้ไข</button><button class="btn danger" type="button" data-delete="'+esc(m.id)+'">ลบ</button></div></td></tr>').join('')||'<tr><td colspan="6">ยังไม่มีข้อมูลสมาชิก</td></tr>';
  document.querySelectorAll('[data-edit]').forEach(btn=>btn.onclick=()=>editMember(btn.dataset.edit));
  document.querySelectorAll('[data-delete]').forEach(btn=>btn.onclick=()=>deleteMember(btn.dataset.delete));
  renderPager('memberPager','members',members.length);
}
function roleLabel(role){return role==='admin'?'แอดมิน':'ผู้เรียน'}
function formatDate(value){return value?new Date(value).toLocaleString('th-TH'):''}
function editMember(id){
  const m=members.find(item=>item.id===id); if(!m)return;
  $('memberId').value=m.id; $('memberEmail').value=m.email||''; $('memberPassword').value=''; $('memberRole').value=m.role||'student'; $('memberSave').textContent='บันทึกการแก้ไข';
  memberMsg('กำลังแก้ไขสมาชิก '+(m.email||''));
}
function clearMemberForm(){
  $('memberId').value=''; $('memberEmail').value=''; $('memberPassword').value=''; $('memberRole').value='student'; $('memberSave').textContent='เพิ่มสมาชิก'; memberMsg('');
}
async function saveMember(){
  const id=$('memberId').value, email=$('memberEmail').value.trim().toLowerCase(), password=$('memberPassword').value, role=$('memberRole').value;
  if(!email){memberMsg('กรุณากรอกอีเมล');return;}
  if(!id && password.length<6){memberMsg('กรุณาตั้งรหัสผ่านอย่างน้อย 6 ตัวอักษร');return;}
  try{
    memberMsg('กำลังบันทึกสมาชิก...');
    await adminApi(id?'PATCH':'POST',{id,email,password,role});
    clearMemberForm();
    await loadMembers();
    memberMsg('บันทึกสมาชิกเรียบร้อย');
  }catch(e){memberMsg(e.message||String(e));}
}
async function deleteMember(id){
  const m=members.find(item=>item.id===id);
  if(!m)return;
  if(!confirm('ยืนยันลบสมาชิก '+(m.email||'นี้')+' ? ข้อมูลบัญชีผู้ใช้จะถูกลบออกจากระบบ'))return;
  try{
    memberMsg('กำลังลบสมาชิก...');
    await adminApi('DELETE',{id});
    await loadMembers();
    memberMsg('ลบสมาชิกเรียบร้อย');
  }catch(e){memberMsg(e.message||String(e));}
}
function flatSurvey(s){
  const p=s.profile||{}, row={id:s.id,created_at:s.created_at,email:s.email,age:p.age||'',year:p.year||'',gpa:p.gpa||'',medAdminExp:p.medAdminExp||'',wardExp:p.wardExp||'',quiz_score:s.quiz_score??'',quiz_total:s.quiz_total??'',quiz_percent:s.quiz_percent??'',game_score_text:s.game_score_text||'',suggestion:s.suggestion||''};
  Object.entries(s.confidence||{}).forEach(([k,v])=>row['confidence_'+(Number(k)+1)]=v);
  Object.entries(s.knowledge||{}).forEach(([k,v])=>row['knowledge_'+(Number(k)+1)]=v);
  Object.entries(s.satisfaction||{}).forEach(([game,items])=>Object.entries(items||{}).forEach(([k,v])=>{row['satisfaction_'+game+'_'+(Number(k)+1)]=v;}));
  return row;
}
function renderSurveyTable(){
  const flat=surveys.map(flatSurvey), headers=Array.from(new Set(flat.flatMap(r=>Object.keys(r))));
  $('surveyHead').innerHTML='<tr>'+headers.map(h=>'<th>'+esc(h)+'</th>').join('')+'<th>จัดการ</th></tr>';
  const page=pageItems(flat,'surveys');
  $('surveyBody').innerHTML=page.items.map((r,i)=>'<tr>'+headers.map(h=>'<td>'+esc(r[h]||'')+'</td>').join('')+'<td><button class="btn danger" type="button" data-survey-delete="'+esc(surveys[page.start+i].id)+'">ลบ</button></td></tr>').join('')||'<tr><td colspan="'+esc(Math.max(1,headers.length+1))+'">ยังไม่มีข้อมูลแบบสอบถาม</td></tr>';
  document.querySelectorAll('[data-survey-delete]').forEach(btn=>btn.onclick=()=>deleteSurveySubmission(btn.dataset.surveyDelete));
  renderPager('surveyPager','surveys',surveys.length);
}
async function deleteSurveySubmission(id){
  const item=surveys.find(s=>s.id===id);
  const label=item?(formatDate(item.created_at)+' / '+(item.email||'ไม่ระบุอีเมล')):'รายการนี้';
  if(!confirm('ยืนยันลบข้อมูลการทำแบบสอบถาม '+label+' ? การลบนี้ไม่สามารถย้อนกลับได้'))return;
  try{
    await adminSurveyApi('DELETE',{id});
    await loadData();
    alert('ลบข้อมูลแบบสอบถามเรียบร้อยแล้ว');
  }catch(e){alert(e.message||String(e));}
}
function renderScoreTable(){
  const page=pageItems(scores,'scores');
  $('scoreBody').innerHTML=page.items.map(s=>'<tr><td>'+esc(s.created_at)+'</td><td>'+esc(s.email)+'</td><td>'+esc(s.game_title||s.game_id)+'</td><td>'+esc(s.score)+'</td></tr>').join('')||'<tr><td colspan="4">ยังไม่มีข้อมูลคะแนนเกม</td></tr>';
  renderPager('scorePager','scores',scores.length);
}
function csvCell(v){const s=String(v??'');return /[",\r\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;}
function toCsv(rows){const headers=Array.from(new Set(rows.flatMap(r=>Object.keys(r))));return '\ufeff'+[headers.join(',')].concat(rows.map(r=>headers.map(h=>csvCell(r[h])).join(','))).join('\r\n');}
function download(name,content,type){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function toScoreRows(){return scores.map(s=>({created_at:s.created_at,email:s.email,game_id:s.game_id,game_title:s.game_title,score:s.score,completed_count:s.completed_count}));}
function downloadExcel(){const table=$('surveyTable').outerHTML;download('ard-survey.xls','\ufeff<html><head><meta charset="utf-8"></head><body>'+table+'</body></html>','application/vnd.ms-excel;charset=utf-8');}
bindPasswordToggle('memberPasswordToggle','memberPassword');
$('googleLoginBtn').onclick=loginWithGoogle;
$('refreshBtn').onclick=loadData;
$('memberRefresh').onclick=loadMembers;
$('memberSave').onclick=saveMember;
$('memberClear').onclick=clearMemberForm;
$('surveyCsv').onclick=()=>download('ard-survey.csv',toCsv(surveys.map(flatSurvey)),'text/csv;charset=utf-8');
$('surveyXls').onclick=downloadExcel;
$('scoreCsv').onclick=()=>download('ard-game-scores.csv',toCsv(toScoreRows()),'text/csv;charset=utf-8');
$('logoutBtn').onclick=logout;
$('noAccessLogout').onclick=logout;
(async()=>{
  if(!client){msg('ยังไม่ได้ตั้งค่า Supabase ใน supabase-config.js');return;}
  const {data}=await client.auth.getSession();
  if(!data.session){show('loginPanel');return;}
  session=data.session;
  try{
    await assertAdmin();
    await showDashboard(data.session.user.email);
  }catch(e){
    await showNoAccess();
  }
})();
})();
