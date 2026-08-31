(function(){
const cfg=window.ARD_SUPABASE_CONFIG||{};
const ready=cfg.url&&cfg.anonKey&&!cfg.url.includes('YOUR_PROJECT_REF')&&!cfg.anonKey.includes('YOUR_SUPABASE_ANON_KEY');
const client=ready&&window.supabase?window.supabase.createClient(cfg.url,cfg.anonKey):null;
const adminEmail=(cfg.adminEmail||'ardumfu@gmail.com').toLowerCase();
let session=null,surveys=[],scores=[],members=[];
const $=id=>document.getElementById(id);
function esc(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function msg(t){$('msg').textContent=t}
function memberMsg(t){$('memberMsg').textContent=t}
function bindPasswordToggle(buttonId,inputId){
  const btn=$(buttonId), input=$(inputId); if(!btn||!input)return;
  btn.onclick=()=>{const visible=input.type==='text';input.type=visible?'password':'text';btn.textContent=visible?'👁':'ซ่อน';btn.setAttribute('aria-label',visible?'แสดงรหัสผ่าน':'ซ่อนรหัสผ่าน');};
}
function allowedMemberEmail(email){
  const e=String(email||'').toLowerCase();
  return e===adminEmail || e.endsWith('@mfu.ac.th') || e.endsWith('@lamduan.mfu.ac.th');
}
async function login(){
  if(!client){msg('ยังไม่ได้ตั้งค่า Supabase ใน supabase-config.js');return;}
  const email=$('email').value.trim().toLowerCase(), password=$('password').value;
  if(email!==adminEmail){msg('บัญชีนี้ไม่ใช่แอดมิน');return;}
  const {data,error}=await client.auth.signInWithPassword({email,password});
  if(error){msg(error.message);return;}
  session=data.session; await showDashboard(data.session.user.email);
}
async function showDashboard(email){
  $('who').textContent=email;
  $('loginPanel').classList.add('hidden');
  $('dash').classList.remove('hidden');
  await Promise.all([loadData(),loadMembers()]);
}
async function loadData(){
  const s1=await client.from('survey_submissions').select('*').order('created_at',{ascending:false});
  const s2=await client.from('game_scores').select('*').order('created_at',{ascending:false});
  if(s1.error){alert(s1.error.message);return;}
  if(s2.error){alert(s2.error.message);return;}
  surveys=s1.data||[]; scores=s2.data||[]; render();
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
function renderMembers(){
  $('memberBody').innerHTML=members.map(m=>'<tr><td>'+esc(m.email)+'</td><td>'+esc(roleLabel(m.role))+'</td><td>'+esc(m.email_confirmed_at?'ยืนยันแล้ว':'ยังไม่ยืนยัน')+'</td><td>'+esc(formatDate(m.last_sign_in_at))+'</td><td><div class="row-actions"><button class="btn lav" type="button" data-edit="'+esc(m.id)+'">แก้ไข</button><button class="btn danger" type="button" data-delete="'+esc(m.id)+'">ลบ</button></div></td></tr>').join('');
  document.querySelectorAll('[data-edit]').forEach(btn=>btn.onclick=()=>editMember(btn.dataset.edit));
  document.querySelectorAll('[data-delete]').forEach(btn=>btn.onclick=()=>deleteMember(btn.dataset.delete));
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
  if(!allowedMemberEmail(email)){memberMsg('อีเมลสมาชิกต้องเป็น @mfu.ac.th หรือ @lamduan.mfu.ac.th เท่านั้น ยกเว้นอีเมลแอดมิน');return;}
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
  const p=s.profile||{}, row={id:s.id,created_at:s.created_at,email:s.email,age:p.age||'',year:p.year||'',gpa:p.gpa||'',medAdminExp:p.medAdminExp||'',wardExp:p.wardExp||'',quiz_score:s.quiz_score??'',quiz_total:s.quiz_total??'',quiz_percent:s.quiz_percent??'',game_score_text:s.game_score_text||'',game_stars_text:s.game_stars_text||'',suggestion:s.suggestion||''};
  Object.entries(s.confidence||{}).forEach(([k,v])=>row['confidence_'+(Number(k)+1)]=v);
  Object.entries(s.knowledge||{}).forEach(([k,v])=>row['knowledge_'+(Number(k)+1)]=v);
  Object.entries(s.satisfaction||{}).forEach(([g,obj])=>Object.entries(obj||{}).forEach(([d,v])=>{row['satisfaction_g'+(Number(g)+1)+'_'+(Number(d)+1)]=v;}));
  return row;
}
function renderSurveyTable(){
  const flat=surveys.map(flatSurvey), headers=Array.from(new Set(flat.flatMap(r=>Object.keys(r))));
  $('surveyHead').innerHTML='<tr>'+headers.map(h=>'<th>'+esc(h)+'</th>').join('')+'<th>จัดการ</th></tr>';
  $('surveyBody').innerHTML=flat.map((r,i)=>'<tr>'+headers.map(h=>'<td>'+esc(r[h]||'')+'</td>').join('')+'<td><button class="btn danger" type="button" data-survey-delete="'+esc(surveys[i].id)+'">ลบ</button></td></tr>').join('');
  document.querySelectorAll('[data-survey-delete]').forEach(btn=>btn.onclick=()=>deleteSurveySubmission(btn.dataset.surveyDelete));
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
  $('scoreBody').innerHTML=scores.map(s=>'<tr><td>'+esc(s.created_at)+'</td><td>'+esc(s.email)+'</td><td>'+esc(s.game_title||s.game_id)+'</td><td>'+esc(s.score)+'</td><td>'+esc(s.stars)+'</td></tr>').join('');
}
function csvCell(v){const s=String(v??'');return /[",\r\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;}
function toCsv(rows){const headers=Array.from(new Set(rows.flatMap(r=>Object.keys(r))));return '\ufeff'+[headers.join(',')].concat(rows.map(r=>headers.map(h=>csvCell(r[h])).join(','))).join('\r\n');}
function download(name,content,type){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function toScoreRows(){return scores.map(s=>({created_at:s.created_at,email:s.email,game_id:s.game_id,game_title:s.game_title,score:s.score,stars:s.stars,completed_count:s.completed_count}));}
function downloadExcel(){const table=document.querySelector('#dash .table-wrap table').outerHTML;download('ard-survey.xls','\ufeff<html><head><meta charset="utf-8"></head><body>'+table+'</body></html>','application/vnd.ms-excel;charset=utf-8');}
bindPasswordToggle('adminPasswordToggle','password');
bindPasswordToggle('memberPasswordToggle','memberPassword');
$('loginBtn').onclick=login;
$('refreshBtn').onclick=loadData;
$('memberRefresh').onclick=loadMembers;
$('memberSave').onclick=saveMember;
$('memberClear').onclick=clearMemberForm;
$('surveyCsv').onclick=()=>download('ard-survey.csv',toCsv(surveys.map(flatSurvey)),'text/csv;charset=utf-8');
$('surveyXls').onclick=downloadExcel;
$('scoreCsv').onclick=()=>download('ard-game-scores.csv',toCsv(toScoreRows()),'text/csv;charset=utf-8');
$('logoutBtn').onclick=async()=>{if(client)await client.auth.signOut();location.reload();};
(async()=>{if(!client){msg('ยังไม่ได้ตั้งค่า Supabase ใน supabase-config.js');return;}const {data}=await client.auth.getSession();if(data.session?.user?.email?.toLowerCase()===adminEmail){session=data.session;showDashboard(data.session.user.email);}})();
})();
