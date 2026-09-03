
const $=(s,r=document)=>r.querySelector(s); const $$=(s,r=document)=>[...r.querySelectorAll(s)];
$('.menu-btn')?.addEventListener('click',()=>$('.nav').classList.toggle('open'));
function readerUrl(file){return 'reader.html?p='+encodeURIComponent(file)}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
async function loadJSON(path){const r=await fetch(path); if(!r.ok) throw new Error(path); return r.json()}
async function renderSection(key,el='#section-list'){
  const data=await loadJSON('data/sections.json'); const root=$(el); if(!root)return;
  root.innerHTML=(data[key]||[]).map(x=>`<a href="${readerUrl(x.file)}">${esc(x.label)}</a>`).join('');
}
async function renderReader(){
  const root=$('#reader-content'); if(!root)return; const p=new URLSearchParams(location.search).get('p');
  const pages=await loadJSON('data/pages.json'); const item=pages.find(x=>x.file===p);
  if(!item){root.innerHTML='<p>Sidan kunde inte hittas i det återställda arkivet.</p>';return}
  document.title=item.title+' – Viby i gamla tider'; $('#reader-title').textContent=item.title;
  $('#source-link').href='archive/original/'+item.file.split('/').map(encodeURIComponent).join('/');
  root.innerHTML=item.html;
  // Gamla FrontPage-sidor kan innehålla bildreferenser som aldrig arkiverades.
  // Dölj endast en bild om den faktiskt misslyckas att ladda; originaltexten påverkas inte.
  $$('#reader-content img').forEach(img=>img.addEventListener('error',()=>{img.style.display='none';img.setAttribute('data-archive-missing','true')},{once:true}));
}
function norm(s){return (s||'').toLocaleLowerCase('sv').normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function snippet(text,q){const n=norm(text), nq=norm(q),i=n.indexOf(nq);let s=Math.max(0,i-90),e=Math.min(text.length,(i<0?0:i)+q.length+150);let out=text.slice(s,e);if(s)out='…'+out;if(e<text.length)out+='…';return out}
async function setupSearch(){
 const input=$('#search-input'); if(!input)return; const out=$('#results'); const data=await loadJSON('data/search.json');
 const run=()=>{const q=input.value.trim(); if(q.length<2){out.innerHTML='<p class="lead">Skriv minst två tecken.</p>';return}
   const nq=norm(q), terms=nq.split(/\s+/).filter(Boolean); const scored=[];
   for(const x of data){const hay=norm(x.title+' '+x.text); if(!terms.every(t=>hay.includes(t)))continue; let score=terms.reduce((a,t)=>a+(norm(x.title).includes(t)?8:0)+(hay.split(t).length-1),0);scored.push([score,x])}
   scored.sort((a,b)=>b[0]-a[0]); out.innerHTML=scored.slice(0,80).map(([s,x])=>`<a class="result" href="${readerUrl(x.file)}"><h3>${esc(x.title)}</h3><p>${esc(snippet(x.text,q))}</p></a>`).join('')||'<p>Inga träffar.</p>';
 };
 input.addEventListener('input',run); const q=new URLSearchParams(location.search).get('q'); if(q){input.value=q;run()}
}
async function setupGallery(){
 const root=$('#gallery'); if(!root)return; const data=await loadJSON('data/images.json'); const inp=$('#gallery-search'); let max=240;
 const draw=()=>{const q=norm(inp?.value||''); const list=data.filter(x=>!q||norm(x.title+' '+x.file).includes(q)).slice(0,max); root.innerHTML=list.map(x=>`<figure class="photo" data-src="archive/original/${x.file.split('/').map(encodeURIComponent).join('/')}"><img loading="lazy" src="archive/original/${x.file.split('/').map(encodeURIComponent).join('/')}" alt="${esc(x.title)}"><figcaption>${esc(x.title)}</figcaption></figure>`).join(''); $$('.photo',root).forEach(f=>f.onclick=()=>openModal(f.dataset.src)); $('#gallery-count').textContent=`Visar ${list.length} av ${data.filter(x=>!q||norm(x.title+' '+x.file).includes(q)).length} bilder`;};
 inp?.addEventListener('input',()=>{max=240;draw()}); draw();
}
function openModal(src){const m=$('#modal'); $('#modal-img').src=src;m.classList.add('open')} function closeModal(){$('#modal')?.classList.remove('open')} $('#modal-close')?.addEventListener('click',closeModal);$('#modal')?.addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});
async function renderDocs(){const root=$('#docs');if(!root)return;const d=await loadJSON('data/documents.json');root.innerHTML=d.map(x=>`<a class="doc" href="archive/original/${x.file.split('/').map(encodeURIComponent).join('/')}" target="_blank"><span>${esc(x.title)}</span><span class="pill">PDF</span></a>`).join('')}
const sectionEl=$('[data-section]'); if(sectionEl) renderSection(sectionEl.dataset.section);
renderReader();setupSearch();setupGallery();renderDocs();
