(function(){
const cfg = window.ARD_SUPABASE_CONFIG || {};
const ready = cfg.url && cfg.anonKey && !cfg.url.includes('YOUR_PROJECT_REF') && !cfg.anonKey.includes('YOUR_SUPABASE_ANON_KEY');
const client = ready && window.supabase ? window.supabase.createClient(cfg.url, cfg.anonKey) : null;
const adminEmail = String(cfg.adminEmail || '').toLowerCase();
const allowedDomains = cfg.allowedDomains || ['lamduan.mfu.ac.th'];
let session = null;
let profile = null;
let trackedSessionId = '';
let authReady = false;
let refreshing = false;
window.ARD_AUTH_ONLY_SURVEY = true;
window.ARD_AUTH = { client, isReady: ready, isLoaded:()=>authReady, getSession:()=>session, getProfile:()=>profile, isAdmin:()=>isAdmin(), canPlay:()=>!!session };
const $=id=>document.getElementById(id);
function emailDomain(email){return String(email||'').toLowerCase().split('@').pop()||'';}
function isAllowedEmail(email){const e=String(email||'').toLowerCase();return (!!adminEmail&&e===adminEmail) || allowedDomains.includes(emailDomain(e));}
function isAdmin(){const email=String(session?.user?.email||'').toLowerCase();return (!!adminEmail&&email===adminEmail) || profile?.role==='admin';}
function isAllowedSession(){return isAllowedEmail(session?.user?.email) || isAdmin();}
function setText(id,text){const el=$(id); if(el)el.textContent=text;}
function show(view){['boot','auth','home','play','survey'].forEach(id=>{const el=$(id); if(el)el.classList.toggle('active',id===view);});}
function questionnaireUrl(){if(location.protocol!=='file:'&&location.pathname!=='/questionnaire')history.pushState(null,'','/questionnaire');}
function showPublicSurvey(){questionnaireUrl();if(!session)setText('userEmail','');show('survey');if(window.renderSurvey)window.renderSurvey();}
function bindPasswordToggle(buttonId,inputId){
  const btn=$(buttonId), input=$(inputId); if(!btn||!input)return;
  btn.onclick=()=>{const visible=input.type==='text';input.type=visible?'password':'text';btn.textContent=visible?'👁':'ซ่อน';btn.setAttribute('aria-label',visible?'แสดงรหัสผ่าน':'ซ่อนรหัสผ่าน');};
}
function renderAuth(message){
  const host=$('authPanel'); if(!host)return;
  host.innerHTML='<div class="auth-card"><img src="assets/logo-nursing.png" alt="โลโก้"><div><p class="eyebrow">RDU antibiotics learning game</p><h1>เข้าสู่ระบบเพื่อเข้าเล่นเกม</h1><p>สมัครและเข้าใช้งานได้ด้วยอีเมล @lamduan.mfu.ac.th เท่านั้น</p></div><label>อีเมล<input id="authEmail" type="email" autocomplete="email" placeholder="name@lamduan.mfu.ac.th"></label><label>รหัสผ่าน<div class="password-field"><input id="authPassword" type="password" autocomplete="current-password" placeholder="อย่างน้อย 6 ตัวอักษร"><button class="password-toggle" id="authPasswordToggle" type="button" aria-label="แสดงรหัสผ่าน">👁</button></div></label><div class="auth-actions"><button class="primary" id="loginBtn" type="button">เข้าสู่ระบบ</button><button class="secondary" id="signupBtn" type="button">สมัครสมาชิก</button></div><button class="secondary google-login" id="googleLoginBtn" type="button">เข้าสู่ระบบด้วย Gmail</button><p class="auth-status" id="authStatus">'+(message||'')+'</p>'+(ready?'':'<div class="survey-warning">ยังไม่ได้ตั้งค่า Supabase URL/Anon key ในไฟล์ supabase-config.js</div>')+'</div>';
  bindPasswordToggle('authPasswordToggle','authPassword'); $('loginBtn').onclick=()=>login(); $('signupBtn').onclick=()=>signup(); $('googleLoginBtn').onclick=()=>loginWithGoogle();
}
async function loadProfile(){
  if(!client || !session)return null;
  const {data} = await client.from('user_profiles').select('*').eq('id',session.user.id).maybeSingle();
  profile=data; return data;
}
async function trackLogin(){
  if(!session?.access_token||trackedSessionId===session.access_token)return;
  trackedSessionId=session.access_token;
  try{await fetch('/api/login-events',{method:'POST',headers:{'Authorization':'Bearer '+session.access_token}});}catch(e){}
}
async function updateAdminLink(){
  const adminLink=$('adminDashboardLink');
  if(!adminLink)return;
  adminLink.hidden=true;
  if(!session?.access_token)return;
  try{
    const res=await fetch('/api/admin-users?check=1',{headers:{'Authorization':'Bearer '+session.access_token}});
    adminLink.hidden=!res.ok;
  }catch(e){
    adminLink.hidden=true;
  }
}
async function refresh(){
  if(refreshing)return;
  refreshing = true;
  try{
    if(!client){authReady=true;renderAuth('');show('auth');return;}
    const {data} = await client.auth.getSession(); session=data.session;
    if(!session){
      authReady=true;
      if(location.pathname==='/questionnaire'){showPublicSurvey();return;}
      renderAuth('');show('auth');return;
    }
    await loadProfile();
    if(!isAllowedSession()){await client.auth.signOut();session=null;profile=null;authReady=true;renderAuth('ใช้งานได้เฉพาะอีเมล @lamduan.mfu.ac.th หรือบัญชีแอดมินที่ได้รับสิทธิ์แล้วเท่านั้น');show('auth');return;}
    await trackLogin();
    setText('userEmail', session.user.email || '');
    await updateAdminLink();
    authReady=true;
    if(location.pathname==='/questionnaire'){show('survey');if(window.renderSurvey)window.renderSurvey();return;}
    show('home');
  } finally {
    refreshing = false;
  }
}
async function login(){
  const email=$('authEmail').value.trim().toLowerCase(), password=$('authPassword').value;
  if(!email||!password){setText('authStatus','กรุณากรอกอีเมลและรหัสผ่าน');return;}
  const {data,error}=await client.auth.signInWithPassword({email,password});
  if(error){setText('authStatus',error.message);return;}
  session=data.session; await refresh();
}
async function signup(){
  const email=$('authEmail').value.trim().toLowerCase(), password=$('authPassword').value;
  if(!isAllowedEmail(email)){setText('authStatus','สมัครได้เฉพาะอีเมล @lamduan.mfu.ac.th เท่านั้น');return;}
  const {error}=await client.auth.signUp({email,password});
  if(error){setText('authStatus',error.message);return;}
  setText('authStatus','สมัครสำเร็จ กรุณาตรวจอีเมลเพื่อยืนยันบัญชี หากระบบตั้งค่าให้ยืนยันอีเมล');
}
async function loginWithGoogle(){
  if(!client){setText('authStatus','ยังไม่ได้ตั้งค่า Supabase');return;}
  const redirectTo=location.protocol==='file:'?'http://127.0.0.1:8088/':location.origin + '/';
  const {error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo}});
  if(error)setText('authStatus',error.message);
}
async function logout(){ if(client) await client.auth.signOut(); session=null; profile=null; authReady=true; await updateAdminLink(); renderAuth('ออกจากระบบแล้ว'); show('auth'); }
window.saveSurveySubmission = async function(submission){
  if(!session){
    const res=await fetch('/api/survey-submissions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(submission)});
    const data=await res.json().catch(()=>({}));
    if(!res.ok)throw new Error(data.error||'บันทึกแบบสอบถามไม่สำเร็จ');
    return;
  }
  if(!client) throw new Error('ยังไม่ได้ตั้งค่า Supabase');
  const {error}=await client.from('survey_submissions').insert({
    user_id: session.user.id,
    email: session.user.email,
    profile: submission.profile || {},
    confidence: submission.confidence || {},
    knowledge: submission.knowledge || {},
    quiz_score: submission.quiz?.score ?? null,
    quiz_total: submission.quiz?.total ?? null,
    quiz_percent: submission.quiz?.percent ?? null,
    satisfaction: submission.satisfaction || {},
    suggestion: submission.suggestion || '',
    game_score_text: submission.score || '',
    payload: submission
  });
  if(error) throw error;
};
window.saveGameScore = async function(payload){
  if(!client || !session) return;
  await client.from('game_scores').insert({
    user_id: session.user.id,
    email: session.user.email,
    game_id: payload.gameId,
    game_title: payload.gameTitle,
    score: payload.score || 0,
    completed_count: payload.completed || 0,
    payload
  });
};
window.showAuthLoading = function(){ if(!authReady){show('boot');refresh();return;} if(session){show('home');} else {window.showLoginForGames();} };
window.showHome = function(){ if(!authReady){window.showAuthLoading();return;} if(session){show('home');} else {window.showLoginForGames();} };
window.showSurvey = function(){ showPublicSurvey(); };
window.showLoginForGames = function(){if(!authReady){window.showAuthLoading();return;}renderAuth('กรุณาเข้าสู่ระบบด้วยอีเมลมหาวิทยาลัยก่อนเข้าเล่นเกม');show('auth');};
window.addEventListener('DOMContentLoaded',()=>{
  show('boot');
  $('surveyBtn')?.addEventListener('click',window.showSurvey);
  $('logoutBtn')?.addEventListener('click',logout);
  refresh();
});
})();
