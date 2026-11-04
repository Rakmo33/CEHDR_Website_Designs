document.querySelectorAll('.home-slideshow').forEach(show=>{
  const slides=[...show.querySelectorAll('img')];
  const toggle=show.querySelector('button');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  let index=0,paused=reduce.matches,timer;
  const sync=()=>{toggle.setAttribute('aria-label',paused?'Play slideshow':'Pause slideshow');toggle.setAttribute('aria-pressed',String(paused));toggle.innerHTML=paused?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v16l14-8z"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg>';};
  const stop=()=>{clearInterval(timer);timer=null;};
  const start=()=>{stop();if(paused||document.hidden)return;timer=setInterval(()=>{slides[index].classList.remove('is-active');slides[index].setAttribute('aria-hidden','true');index=(index+1)%slides.length;slides[index].classList.add('is-active');slides[index].setAttribute('aria-hidden','false');},6000);};
  toggle.addEventListener('click',()=>{paused=!paused;sync();start();});
  show.addEventListener('mouseenter',stop);show.addEventListener('mouseleave',start);
  show.addEventListener('focusin',stop);show.addEventListener('focusout',e=>{if(!show.contains(e.relatedTarget))start();});
  document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
  reduce.addEventListener('change',()=>{paused=reduce.matches;sync();start();});
  sync();start();
});
