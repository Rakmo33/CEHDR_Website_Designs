const menu=document.querySelector('.menu');
document.querySelector('.menu-toggle')?.addEventListener('click',e=>{const open=menu.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',open)});
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in');observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -5%'});
document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.setProperty('--delay',`${Math.min((i%4)*90,270)}ms`);observer.observe(el)});

