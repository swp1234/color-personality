const TYPE_ORDER = ['red','orange','yellow','green','blue','purple','pink','white'];
const TYPES = {
  red:{hex:'#ef4444'},orange:{hex:'#f97316'},yellow:{hex:'#eab308'},green:{hex:'#22c55e'},
  blue:{hex:'#3b82f6'},purple:{hex:'#8b5cf6'},pink:{hex:'#ec4899'},white:{hex:'#e5e7eb'}
};
const SPECTRUM_ROUNDS = [
  {key:'phase1.prompt1',colors:['#fb7185','#ef4444','#f97316','#f59e0b','#eab308','#fde047']},
  {key:'phase1.prompt2',colors:['#16a34a','#14b8a6','#06b6d4','#38bdf8','#3b82f6','#8b5cf6']},
  {key:'phase1.prompt3',colors:['#ec4899','#a855f7','#06b6d4','#22c55e','#eab308','#ef4444']}
];
const PALETTE_PAIRS = [
  {left:{key:'phase2.pair1.left',type:'blue',colors:['#1e293b','#475569','#94a3b8','#e2e8f0']},right:{key:'phase2.pair1.right',type:'orange',colors:['#ef4444','#f97316','#eab308','#ec4899']}},
  {left:{key:'phase2.pair2.left',type:'purple',colors:['#8b5cf6','#ec4899','#6366f1','#f97316']},right:{key:'phase2.pair2.right',type:'white',colors:['#e2e8f0','#f8fafc','#cbd5e1','#ffffff']}},
  {left:{key:'phase2.pair3.left',type:'red',colors:['#991b1b','#dc2626','#ef4444','#fb7185']},right:{key:'phase2.pair3.right',type:'green',colors:['#166534','#16a34a','#4ade80','#bbf7d0']}},
  {left:{key:'phase2.pair4.left',type:'yellow',colors:['#ca8a04','#eab308','#fde047','#fef9c3']},right:{key:'phase2.pair4.right',type:'pink',colors:['#9d174d','#db2777','#ec4899','#fbcfe8']}}
];
const EVENTS = ['color_personality_view','color_personality_start','color_personality_progress','color_personality_complete','color_personality_next_click','color_personality_share','color_personality_related_click'];

class ColorChoiceMixer {
  constructor(){this.step=0;this.colors=[];this.paletteChoices=[];this.scores={};this.selectedHex='#f97316';this.spectrumLocked=false;this.paletteLocked=false;this.tracked=new Set();TYPE_ORDER.forEach(k=>this.scores[k]=0);this.init()}
  t(k){return window.i18n?window.i18n.t(k):k}
  track(name){if(!EVENTS.includes(name)||this.tracked.has(name))return;this.tracked.add(name);if(typeof gtag==='function')gtag('event',name,{event_category:'color_personality'})}
  async init(){if(window.i18n)await window.i18n.init();this.bind();this.initTheme();this.updateDestinations();this.hideLoader();this.track('color_personality_view');if(new URLSearchParams(location.search).get('start')==='1')this.start()}
  hideLoader(){const el=document.getElementById('app-loader');if(!el)return;el.classList.add('hidden');setTimeout(()=>el.style.display='none',250)}
  bind(){
    document.getElementById('start-btn').addEventListener('click',()=>this.start());
    document.getElementById('confirm-color-btn').addEventListener('click',()=>this.confirmColor());
    document.getElementById('palette-left').addEventListener('click',()=>this.selectPalette('left'));
    document.getElementById('palette-right').addEventListener('click',()=>this.selectPalette('right'));
    document.getElementById('retry-btn').addEventListener('click',()=>this.reset());
    document.getElementById('spectrum-back').addEventListener('click',()=>this.back());
    document.getElementById('palette-back').addEventListener('click',()=>this.back());
    document.getElementById('next-action').addEventListener('click',()=>this.track('color_personality_next_click'));
    document.querySelector('.related-grid').addEventListener('click',e=>{if(e.target.closest('.related-card'))this.track('color_personality_related_click')});
    document.getElementById('share-page').addEventListener('click',()=>this.share());
    document.getElementById('theme-toggle').addEventListener('click',()=>this.toggleTheme());
    const menu=document.getElementById('lang-menu');document.getElementById('lang-toggle').addEventListener('click',e=>{e.stopPropagation();menu.classList.toggle('hidden')});
    menu.querySelectorAll('[data-lang]').forEach(btn=>btn.addEventListener('click',async()=>{await window.i18n.setLanguage(btn.dataset.lang);menu.classList.add('hidden');this.updateDestinations();this.refreshVisible()}));
    document.addEventListener('click',()=>menu.classList.add('hidden'));
    this.bindSpectrum();
  }
  bindSpectrum(){const box=document.getElementById('spectrum-container');const pick=e=>{const r=box.getBoundingClientRect();const x=Math.max(0,Math.min(r.width,e.clientX-r.left));const y=Math.max(0,Math.min(r.height,e.clientY-r.top));this.pickAt(x,y,r)};box.addEventListener('pointerdown',e=>{box.setPointerCapture(e.pointerId);pick(e)});box.addEventListener('pointermove',e=>{if(box.hasPointerCapture(e.pointerId))pick(e)});box.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();const pct=Math.max(0,Math.min(100,Number(box.getAttribute('aria-valuenow'))+(e.key==='ArrowRight'?5:-5)));const r=box.getBoundingClientRect();this.pickAt(r.width*pct/100,r.height/2,r)})}
  pickAt(x,y,r){const canvas=document.getElementById('spectrum-canvas'),ctx=canvas.getContext('2d'),px=ctx.getImageData(Math.min(canvas.width-1,Math.max(0,Math.floor(x*devicePixelRatio))),Math.min(canvas.height-1,Math.max(0,Math.floor(y*devicePixelRatio))),1,1).data;this.selectedHex=this.rgbHex(px[0],px[1],px[2]);const thumb=document.getElementById('spectrum-thumb');thumb.style.left=x+'px';thumb.style.top=y+'px';thumb.style.background=this.selectedHex;document.getElementById('selected-color-preview').style.background=this.selectedHex;document.getElementById('selected-color-hex').textContent=this.selectedHex.toUpperCase();document.getElementById('spectrum-container').setAttribute('aria-valuenow',String(Math.round(x/r.width*100)))}
  start(){this.step=0;this.colors=[];this.paletteChoices=[];TYPE_ORDER.forEach(k=>this.scores[k]=0);this.track('color_personality_start');this.show('spectrum-screen');this.renderSpectrum()}
  show(id){document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));document.getElementById(id).classList.add('active');scrollTo(0,0)}
  renderSpectrum(){this.spectrumLocked=true;document.getElementById('spectrum-prompt').textContent=this.t(SPECTRUM_ROUNDS[this.step].key);this.updateProgress();requestAnimationFrame(()=>{this.drawSpectrum();this.spectrumLocked=false})}
  drawSpectrum(){const canvas=document.getElementById('spectrum-canvas'),box=document.getElementById('spectrum-container'),r=box.getBoundingClientRect(),d=devicePixelRatio||1;canvas.width=Math.max(1,Math.round(r.width*d));canvas.height=Math.max(1,Math.round(r.height*d));canvas.style.width=r.width+'px';canvas.style.height=r.height+'px';const ctx=canvas.getContext('2d');ctx.scale(d,d);const colors=SPECTRUM_ROUNDS[this.step].colors,g=ctx.createLinearGradient(0,0,r.width,0);colors.forEach((c,i)=>g.addColorStop(i/(colors.length-1),c));ctx.fillStyle=g;ctx.fillRect(0,0,r.width,r.height);const v=ctx.createLinearGradient(0,0,0,r.height);v.addColorStop(0,'rgba(255,255,255,.65)');v.addColorStop(.5,'rgba(255,255,255,0)');v.addColorStop(1,'rgba(0,0,0,.45)');ctx.fillStyle=v;ctx.fillRect(0,0,r.width,r.height);this.pickAt(r.width/2,r.height/2,r)}
  confirmColor(){if(this.spectrumLocked||this.step>2)return;this.spectrumLocked=true;this.colors.push(this.selectedHex);this.scores[this.classify(this.selectedHex)]++;this.step++;if(this.step<3)this.renderSpectrum();else{this.show('palette-screen');this.renderPalette()}}
  classify(hex){const rgb=this.hexRgb(hex),hsl=this.rgbHsl(rgb.r,rgb.g,rgb.b);if(hsl.s<15)return'white';const h=hsl.h;if(h<15||h>=345)return'red';if(h<45)return'orange';if(h<75)return'yellow';if(h<170)return'green';if(h<250)return'blue';if(h<310)return'purple';return'pink'}
  renderPalette(){this.paletteLocked=false;const pair=PALETTE_PAIRS[this.step-3];['left','right'].forEach(side=>{const data=pair[side],button=document.getElementById('palette-'+side);button.disabled=false;document.getElementById('palette-'+side+'-label').textContent=this.t(data.key);document.getElementById('palette-'+side+'-score').textContent=this.t('phase2.counts_toward').replace('{color}',this.t('colors.'+data.type));const swatches=document.getElementById('palette-'+side+'-colors');swatches.innerHTML='';data.colors.forEach(c=>{const span=document.createElement('i');span.style.background=c;swatches.appendChild(span)})});this.updateProgress()}
  selectPalette(side){if(this.paletteLocked)return;this.paletteLocked=true;document.querySelectorAll('.palette-card').forEach(x=>x.disabled=true);const data=PALETTE_PAIRS[this.step-3][side];this.paletteChoices.push(side);this.scores[data.type]++;this.step++;if(this.step===4)this.track('color_personality_progress');setTimeout(()=>{if(this.step<7)this.renderPalette();else this.summarize()},220)}
  summarize(){this.show('summary-screen');setTimeout(()=>this.complete(),350)}
  complete(){let best=TYPE_ORDER[0];TYPE_ORDER.forEach(k=>{if(this.scores[k]>this.scores[best])best=k});this.resultType=best;this.signatureHex=this.average(this.colors);this.renderResult();this.show('result-screen');this.track('color_personality_complete')}
  renderResult(){document.getElementById('signature-gradient').style.background='linear-gradient(135deg,'+this.signatureHex+','+TYPES[this.resultType].hex+')';document.getElementById('signature-hex').textContent=this.signatureHex.toUpperCase();document.getElementById('result-title').textContent=this.t('colors.'+this.resultType);document.getElementById('result-tagline').textContent=this.t('result.most_points').replace('{color}',this.t('colors.'+this.resultType));const box=document.getElementById('score-breakdown');box.innerHTML='';TYPE_ORDER.forEach(k=>{const row=document.createElement('div');row.className='score-row';row.innerHTML='<span class="dot" style="background:'+TYPES[k].hex+'"></span><span>'+this.t('colors.'+k)+'</span><strong>'+this.scores[k]+' / 7</strong>';box.appendChild(row)})}
  back(){if(this.step<=0){this.show('intro-screen');return}if(this.step<=3){this.step--;this.colors.pop();TYPE_ORDER.forEach(k=>this.scores[k]=0);this.colors.forEach(c=>this.scores[this.classify(c)]++);this.show('spectrum-screen');this.renderSpectrum();return}this.step--;const side=this.paletteChoices.pop(),pair=PALETTE_PAIRS[this.step-3];if(side&&pair)this.scores[pair[side].type]--;this.show('palette-screen');this.renderPalette()}
  reset(){this.show('intro-screen')}
  updateProgress(){const pct=Math.min(100,(this.step+1)/7*100);document.querySelectorAll('.progress span').forEach(x=>x.style.width=pct+'%');document.getElementById('step-count').textContent=Math.min(7,this.step+1)+'/7';document.getElementById('step-count-2').textContent=Math.min(7,this.step+1)+'/7'}
  updateDestinations(){const lang=window.i18n?.getCurrentLanguage()||'ko';document.getElementById('next-action').href='/portal/blog/'+encodeURIComponent(lang)+'/what-your-favorite-color-says-about-you.html?source=color_personality_result';document.querySelectorAll('[data-related-slug]').forEach(a=>{const u=new URL(a.getAttribute('href'),location.origin);u.searchParams.set('lang',lang);u.searchParams.set('source','color_personality_result');a.href=u.pathname+u.search})}
  refreshVisible(){if(document.getElementById('spectrum-screen').classList.contains('active'))this.renderSpectrum();if(document.getElementById('palette-screen').classList.contains('active'))this.renderPalette();if(document.getElementById('result-screen').classList.contains('active'))this.renderResult()}
  async share(){const data={title:this.t('meta.og_title'),text:this.t('share.text'),url:'https://dopabrain.com/color-personality/?lang='+(window.i18n?.getCurrentLanguage()||'ko')};try{if(navigator.share)await navigator.share(data);else await navigator.clipboard.writeText(data.text+' '+data.url);this.track('color_personality_share');document.getElementById('share-status').textContent=this.t('share.success')}catch(e){if(e?.name!=='AbortError')document.getElementById('share-status').textContent=this.t('share.error')}}
  initTheme(){if(localStorage.getItem('color-choice-theme')==='light')document.documentElement.dataset.theme='light'}
  toggleTheme(){const light=document.documentElement.dataset.theme!=='light';document.documentElement.dataset.theme=light?'light':'';localStorage.setItem('color-choice-theme',light?'light':'dark')}
  hexRgb(h){const n=parseInt(h.slice(1),16);return{r:n>>16,g:n>>8&255,b:n&255}}
  rgbHex(r,g,b){return'#'+[r,g,b].map(n=>Math.round(n).toString(16).padStart(2,'0')).join('')}
  rgbHsl(r,g,b){r/=255;g/=255;b/=255;const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min,l=(max+min)/2;let h=0;if(d){if(max===r)h=((g-b)/d)%6;else if(max===g)h=(b-r)/d+2;else h=(r-g)/d+4;h=(h*60+360)%360}return{h,s:d?d/(1-Math.abs(2*l-1))*100:0,l:l*100}}
  average(colors){if(!colors.length)return'#8b5cf6';const n=colors.map(x=>this.hexRgb(x)),sum=n.reduce((a,c)=>({r:a.r+c.r,g:a.g+c.g,b:a.b+c.b}),{r:0,g:0,b:0});return this.rgbHex(sum.r/n.length,sum.g/n.length,sum.b/n.length)}
}
document.addEventListener('DOMContentLoaded',()=>{window.colorChoiceMixer=new ColorChoiceMixer()});
