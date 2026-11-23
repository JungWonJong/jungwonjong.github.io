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
const pageTitles=['표지','목차','이세계 편의점 소개','AI와 일을 나눈 방식','기획 터닝포인트','튜토리얼 개편','여행 창 성능 개선','직접 플레이 피드백','구황이네 밭 소개','실기기 시연','AI와 기획 확정','AI 추천을 거절한 결정','개발 결과 검수','기획 방향 변경','남은 과제','COLORS 소개','레벨과 기믹','보스 5단계','배운 점','마무리'];
pageTitles.forEach((title,index)=>{const option=document.createElement('option');option.value=index+1;option.textContent=String(index+1).padStart(2,'0');option.title=title;pdfSelect.append(option);});
function showPage(page){currentPage=Math.max(1,Math.min(20,page));pdfImage.src='assets/pages/'+String(currentPage).padStart(2,'0')+'.webp';pdfImage.alt='포트폴리오 '+currentPage+'쪽 · '+pageTitles[currentPage-1];pdfSelect.value=currentPage;prev.disabled=currentPage===1;next.disabled=currentPage===20;}
document.querySelectorAll('[data-pdf-page]').forEach(trigger=>trigger.addEventListener('click',event=>{event.preventDefault();pdfOpener=trigger;showPage(Number(trigger.dataset.pdfPage));pdfDialog.showModal();document.body.classList.add('modal-open');}));
document.querySelector('.dialog-close').addEventListener('click',()=>pdfDialog.close());pdfDialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');pdfOpener?.focus({preventScroll:true});});
pdfDialog.addEventListener('click',event=>{if(event.target===pdfDialog){const rect=pdfDialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)pdfDialog.close();}});
prev.addEventListener('click',()=>showPage(currentPage-1));next.addEventListener('click',()=>showPage(currentPage+1));pdfSelect.addEventListener('change',()=>showPage(Number(pdfSelect.value)));pdfDialog.addEventListener('keydown',event=>{if(event.target===pdfSelect)return;if(event.key==='ArrowLeft'){event.preventDefault();showPage(currentPage-1);}if(event.key==='ArrowRight'){event.preventDefault();showPage(currentPage+1);}});

document.querySelector('.copy-email').addEventListener('click',async()=>{const status=document.querySelector('.copy-status');try{await navigator.clipboard.writeText('wonjongjeong92@gmail.com');status.textContent='복사했습니다.';}catch{status.textContent='위 이메일 주소를 선택해 복사해 주세요.';}});
document.querySelectorAll('video').forEach(video=>video.addEventListener('play',()=>{document.querySelectorAll('video').forEach(other=>{if(other!==video)other.pause();});}));
