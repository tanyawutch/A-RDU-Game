(function(){
const cfg=window.ARD_SUPABASE_CONFIG||{};
const bucket=cfg.videoBucket||'VIdeo';
const files=cfg.videoFiles||['1.mp4','2.mp4','3.mp4','4.mp4'];
const base=(cfg.url||'').replace(/\/$/,'');
const $=id=>document.getElementById(id);
let playlist=files.map((file,i)=>({title:'คลิปที่ '+(i+1),file,url:base+'/storage/v1/object/public/'+encodeURIComponent(bucket)+'/'+encodeURIComponent(file)}));
async function loadPlaylist(){
  try{
    const res=await fetch('/api/videos');
    if(!res.ok)throw new Error('api unavailable');
    const data=await res.json();
    if(Array.isArray(data.videos)&&data.videos.length)playlist=data.videos;
  }catch(e){}
}
function renderPlaylist(){
  const host=$('playlist');if(!host)return;
  host.innerHTML=playlist.map((item,i)=>'<button class="video-item" type="button" data-index="'+i+'"><span class="play-dot">'+(i+1)+'</span><span>'+item.title+'<small>'+item.file+'</small></span></button>').join('');
  host.querySelectorAll('.video-item').forEach(btn=>btn.onclick=()=>selectVideo(Number(btn.dataset.index),true));
}
function selectVideo(index,autoplay){
  const item=playlist[index]||playlist[0],video=$('lessonVideo');
  document.querySelectorAll('.video-item').forEach((btn,i)=>btn.classList.toggle('active',i===index));
  $('currentTitle').textContent=item.title;
  $('currentNote').textContent='วีดิโอประกอบการเรียนรู้กลุ่มยาปฏิชีวนะ';
  video.src=item.url;
  video.load();
  if(autoplay)video.play().catch(()=>{});
}
function bindVideo(){
  const video=$('lessonVideo');
  if(!video)return;
  video.addEventListener('error',()=>{console.warn('Video load failed',video.currentSrc||video.src);});
  video.addEventListener('ended',()=>{const current=playlist.findIndex(item=>item.url===video.src);if(current>=0&&current<playlist.length-1)selectVideo(current+1,false);});
}
document.addEventListener('DOMContentLoaded',async()=>{await loadPlaylist();renderPlaylist();bindVideo();selectVideo(0,false);});
})();
