'use strict';
const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('#main-nav');
menuButton.addEventListener('click',()=>{const opened=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!opened));nav.classList.toggle('is-open',!opened);menuButton.textContent=opened?'메뉴':'닫기';});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('is-open');menuButton.setAttribute('aria-expanded','false');menuButton.textContent='메뉴';}));

// Each case retains its content in the document; tabs only change what is visible.
function wireTabKeys(list,activate){list.forEach((tab,index)=>tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%list.length;if(event.key==='ArrowLeft')next=(index-1+list.length)%list.length;if(event.key==='Home')next=0;if(event.key==='End')next=list.length-1;if(next===undefined)return;event.preventDefault();activate(list[next]);list[next].focus();}));}
const caseTabs=[...document.querySelectorAll('.tabs [role="tab"]')];
function selectCase(tab){caseTabs.forEach(t=>{const selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!selected;});}
caseTabs.forEach(tab=>tab.addEventListener('click',()=>selectCase(tab)));wireTabKeys(caseTabs,selectCase);

const phases=[
 {file:'boss-100.webp',label:'01 / 보호껍질',title:'같은 색으로 연결부를 끊기',description:'같은 색 기믹을 성공시킨 뒤 연결부를 X로 끊어야 심장을 공격할 수 있습니다.',alt:'HP 100퍼센트 보호껍질 단계의 숲의 심장 보스'},
 {file:'boss-75.webp',label:'02 / 파랑 B · 주먹 냉각',title:'날아오는 씨앗을 얼려 반격하기',description:'파랑으로 씨앗을 얼린 뒤 주먹 쪽으로 두 번 반격합니다. 색의 사용과 반격 타이밍을 함께 요구합니다.',alt:'HP 75퍼센트 파랑 단계에서 주먹을 냉각하는 보스 전투'},
 {file:'boss-50.webp',label:'03 / 초록 G · 양손 속박',title:'내려온 두 손을 뿌리로 고정하기',description:'내려온 손에 G+X를 사용해 두 손을 땅에 고정합니다. 손의 위치를 보고 대응하는 해법입니다.',alt:'HP 50퍼센트 초록 단계에서 두 손을 뿌리로 속박하는 보스 전투'},
 {file:'boss-25.webp',label:'04 / 빨강 R · 가시 소각',title:'팔이 몸 쪽에 올라온 순간 폭발시키기',description:'너무 이르거나 늦으면 다시 시도해야 합니다. 색을 고르는 판단에 정확한 공격 시점을 더했습니다.',alt:'HP 25퍼센트 빨강 단계에서 가시 소각을 시도하는 보스 전투'},
 {file:'boss-1.webp',label:'05 / 흰색 · 지배 문양',title:'드러난 심장의 지배 문양 지우기',description:'흰색을 선택해 지배 문양을 제거합니다. 전투의 끝에서 숲이 색을 되찾으며 정화의 결과를 보여 줍니다.',alt:'HP 1퍼센트 흰색 단계에서 드러난 지배 문양을 지우는 보스 전투'}
];
const phaseTabs=[...document.querySelectorAll('.phase-tabs [role="tab"]')];
function selectPhase(tab){const phase=phases[Number(tab.dataset.phase)];phaseTabs.forEach(t=>{const selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;});const image=document.querySelector('#phase-image');image.src='assets/'+phase.file;image.alt=phase.alt;document.querySelector('#phase-label').textContent=phase.label;document.querySelector('#phase-title').textContent=phase.title;document.querySelector('#phase-description').textContent=phase.description;document.querySelector('#phase-panel').setAttribute('aria-labelledby',tab.id);}
phaseTabs.forEach(tab=>tab.addEventListener('click',()=>selectPhase(tab)));wireTabKeys(phaseTabs,selectPhase);

const pdfDialog=document.querySelector('#pdf-dialog');const pdfSelect=document.querySelector('#pdf-page-select');const pdfImage=document.querySelector('#pdf-page-image');const prev=document.querySelector('#pdf-prev');const next=document.querySelector('#pdf-next');let currentPage=1;let pdfOpener=null;
const pageTitles=['표지','목차','이세계 편의점 소개','AI와 일을 나눈 방식','게임 방향과 초반 진행 재설계','튜토리얼 개편','여행 창 성능 개선','직접 플레이 피드백','구황이네 밭 소개','실기기 시연','AI와 기획 확정','AI 추천을 거절한 결정','개발 결과 검수','기획 방향 변경','남은 과제','COLORS 소개','레벨과 기믹','보스 5단계','프로젝트별 확인 결과와 남은 과제','마무리'];
pageTitles.forEach((title,index)=>{const option=document.createElement('option');option.value=index+1;option.textContent=String(index+1).padStart(2,'0');option.title=title;pdfSelect.append(option);});
function showPage(page){currentPage=Math.max(1,Math.min(20,page));pdfImage.src='assets/pages-20261124/'+String(currentPage).padStart(2,'0')+'.webp';pdfImage.alt='포트폴리오 '+currentPage+'쪽 · '+pageTitles[currentPage-1];pdfSelect.value=currentPage;prev.disabled=currentPage===1;next.disabled=currentPage===20;}
document.querySelectorAll('[data-pdf-page]').forEach(trigger=>trigger.addEventListener('click',event=>{event.preventDefault();pdfOpener=trigger;showPage(Number(trigger.dataset.pdfPage));pdfDialog.showModal();document.body.classList.add('modal-open');}));
document.querySelector('.dialog-close').addEventListener('click',()=>pdfDialog.close());pdfDialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');pdfOpener?.focus({preventScroll:true});});
pdfDialog.addEventListener('click',event=>{if(event.target===pdfDialog){const rect=pdfDialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)pdfDialog.close();}});
prev.addEventListener('click',()=>showPage(currentPage-1));next.addEventListener('click',()=>showPage(currentPage+1));pdfSelect.addEventListener('change',()=>showPage(Number(pdfSelect.value)));pdfDialog.addEventListener('keydown',event=>{if(event.target===pdfSelect)return;if(event.key==='ArrowLeft'){event.preventDefault();showPage(currentPage-1);}if(event.key==='ArrowRight'){event.preventDefault();showPage(currentPage+1);}});

document.querySelector('.copy-email').addEventListener('click',async()=>{const status=document.querySelector('.copy-status');try{await navigator.clipboard.writeText('wonjongjeong92@gmail.com');status.textContent='복사했습니다.';}catch{status.textContent='위 이메일 주소를 선택해 복사해 주세요.';}});
// Only a full-length video (played on purpose) pauses the others; muted highlight loops never do.
document.querySelectorAll('video:not(.tt-video)').forEach(video=>video.addEventListener('play',()=>{if(video.classList.contains('clip')&&!video.classList.contains('is-full'))return;document.querySelectorAll('video').forEach(other=>{if(other!==video)other.pause();});}));
const fullPlaying=()=>[...document.querySelectorAll('video:not(.tt-video)')].some(v=>!v.paused&&(!v.classList.contains('clip')||v.classList.contains('is-full')));

// Highlight clips: muted loops that play while on screen; a button swaps in the full video.
(()=>{const still=matchMedia('(prefers-reduced-motion:reduce)').matches;
function toFull(video,then){if(video.classList.contains('is-full')){then&&then();return;}video.classList.add('is-full');video.loop=false;video.muted=false;video.controls=true;video.removeAttribute('autoplay');video.src=video.dataset.full;const fig=video.closest('figure');const btn=fig&&fig.querySelector('.full-btn');if(btn)btn.hidden=true;video.addEventListener('loadedmetadata',()=>{then?then():video.play().catch(()=>{});},{once:true});video.load();}
window.__toFull=toFull;
document.querySelectorAll('video.clip').forEach(video=>{const fig=video.closest('figure');const btn=fig&&fig.querySelector('.full-btn');if(btn)btn.addEventListener('click',()=>toFull(video));
 if(still){video.removeAttribute('autoplay');video.pause();video.controls=true;return;}
 new IntersectionObserver(([e])=>{if(video.classList.contains('is-full'))return;if(e.isIntersecting&&!fullPlaying())video.play().catch(()=>{});else video.pause();},{threshold:.25}).observe(video);});})();

// Wide screens use the scroll reveal; mobile shows the uncropped clip in its own frame.
(()=>{const hero=document.querySelector('.tt-hero');if(!hero)return;const video=hero.querySelector('.tt-video');
const wide=matchMedia('(min-width:901px)');const still=matchMedia('(prefers-reduced-motion:reduce)');
const saveData=Boolean(navigator.connection&&navigator.connection.saveData);const toggle=hero.querySelector('.hero-video-toggle');
let inView=false;let userPaused=false;let explicitlyStarted=false;
let ticking=false;function update(){ticking=false;if(!wide.matches||still.matches){hero.style.setProperty('--p','0');return;}const range=hero.offsetHeight-innerHeight;const p=Math.max(0,Math.min(1,(scrollY-hero.offsetTop)/range));hero.style.setProperty('--p',p.toFixed(4));}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(update);}},{passive:true});addEventListener('resize',update);update();
function syncToggle(){const playing=!video.paused;toggle.textContent=playing?'일시정지':'영상 재생';toggle.setAttribute('aria-label',playing?'소개 영상 일시정지':'소개 영상 재생');}
function loadVideo(){if(video.getAttribute('src'))return;video.muted=true;video.defaultMuted=true;video.playsInline=true;video.src=video.dataset.src;video.preload='metadata';video.load();}
function playVisible(){if(!inView||document.hidden||userPaused||fullPlaying()||((still.matches||saveData)&&!explicitlyStarted))return;loadVideo();video.play().catch(syncToggle);}
toggle.hidden=false;toggle.addEventListener('click',()=>{if(!video.paused){userPaused=true;video.pause();return;}userPaused=false;explicitlyStarted=true;document.querySelectorAll('video').forEach(other=>{if(other!==video)other.pause();});loadVideo();video.play().catch(syncToggle);});
video.addEventListener('playing',()=>{video.classList.add('is-ready');syncToggle();});video.addEventListener('pause',syncToggle);video.addEventListener('error',()=>{video.classList.remove('is-ready');syncToggle();});
wide.addEventListener('change',()=>{update();playVisible();});still.addEventListener('change',()=>{if(still.matches&&!explicitlyStarted)video.pause();else playVisible();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else playVisible();});
document.querySelectorAll('video:not(.tt-video)').forEach(v=>v.addEventListener('play',()=>{if(v.classList.contains('clip')&&!v.classList.contains('is-full'))return;video.pause();}));
new IntersectionObserver(([e])=>{inView=e.isIntersecting;if(inView)playVisible();else video.pause();},{threshold:.05}).observe(hero);})();

// Chapter buttons seek the video right above them.
document.querySelectorAll('.chapters').forEach(list=>{const video=list.previousElementSibling&&list.previousElementSibling.querySelector('video');if(!video)return;list.querySelectorAll('button[data-t]').forEach(b=>b.addEventListener('click',()=>{const t=Number(b.dataset.t);const go=()=>{video.currentTime=t;video.play().catch(()=>{});};if(video.classList.contains('clip')&&!video.classList.contains('is-full')){window.__toFull(video,go);return;}if(video.readyState>=1)go();else{video.preload='metadata';video.addEventListener('loadedmetadata',go,{once:true});video.load();}}));});

// Discourage casual media saving without interfering with playback, text, or the PDF link.
document.querySelectorAll('img,video').forEach(media=>{media.draggable=false;});
document.querySelectorAll('video').forEach(video=>{video.setAttribute('controlslist','nodownload noremoteplayback');video.disablePictureInPicture=true;video.disableRemotePlayback=true;});
for(const eventName of ['contextmenu','dragstart'])document.addEventListener(eventName,event=>{if(event.target instanceof Element&&event.target.closest('img,video,.media-open,.tt-media'))event.preventDefault();});

// Images remain inside the site instead of linking directly to the original asset.
(()=>{const dialog=document.querySelector('#media-dialog');const image=dialog.querySelector('img');const zoom=dialog.querySelector('.media-zoom');const caption=dialog.querySelector('.media-caption');let opener=null;
document.querySelectorAll('.media-open').forEach(button=>button.addEventListener('click',()=>{const original=button.querySelector('img');if(!original)return;opener=button;image.src=original.currentSrc||original.src;image.alt=original.alt;caption.textContent=original.alt;dialog.classList.remove('is-zoomed');zoom.setAttribute('aria-pressed','false');zoom.textContent='원본 크기';dialog.showModal();dialog.querySelector('.media-image-stage').scrollTo(0,0);document.body.classList.add('modal-open');}));
zoom.addEventListener('click',()=>{const enlarged=dialog.classList.toggle('is-zoomed');zoom.setAttribute('aria-pressed',String(enlarged));zoom.textContent=enlarged?'화면에 맞추기':'원본 크기';});
dialog.querySelector('.media-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');opener?.focus({preventScroll:true});});
dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});})();
