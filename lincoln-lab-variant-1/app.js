
    // Mobile menu
    const menuBtn=document.getElementById('menuBtn');
    const navlinks=document.getElementById('navlinks');
    menuBtn.addEventListener('click',()=>{const open=navlinks.classList.toggle('open');menuBtn.setAttribute('aria-expanded',open);menuBtn.textContent=open?'✕':'☰';});
    navlinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{navlinks.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');menuBtn.textContent='☰';}));

    // Scroll progress
    const progress=document.getElementById('progress');
    const updateProgress=()=>{const h=document.documentElement;const total=h.scrollHeight-h.clientHeight;progress.style.width=(total?((h.scrollTop/total)*100):0)+'%';};
    document.addEventListener('scroll',updateProgress,{passive:true}); updateProgress();

    // Reveal on scroll
    const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('show');revealObserver.unobserve(entry.target);}}),{threshold:.12,rootMargin:'0px 0px -8% 0px'});
    document.querySelectorAll('.research-grid,.project-grid,.credential-list,.pub-grid,.team-grid,.news-stack').forEach(group=>{
      [...group.children].forEach((el,index)=>el.style.setProperty('--reveal-delay',`${Math.min(index*90,360)}ms`));
    });
    document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

    // Accessible interactive research areas and profiles
    document.querySelectorAll('.research-card,.project-card,.pub,.person').forEach(el=>el.setAttribute('tabindex','0'));

    // Methodology pathway: click or focus a stage to bring it forward
    const process=document.querySelector('.process');
    const steps=[...document.querySelectorAll('.process .step')];
    steps.forEach((step,index)=>{
      step.setAttribute('tabindex','0');
      step.setAttribute('role','button');
      step.setAttribute('aria-label',`Highlight step ${index+1}: ${step.querySelector('h3').textContent}`);
      const activate=()=>{process.classList.add('has-active');steps.forEach(item=>item.classList.toggle('active',item===step));};
      step.addEventListener('click',activate);
      step.addEventListener('focus',activate);
      step.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();activate();}});
    });
    process?.addEventListener('mouseleave',()=>{process.classList.remove('has-active');steps.forEach(step=>step.classList.remove('active'));});

    // Keep navigation oriented to the section currently in view
    const navItems=[...navlinks.querySelectorAll('a[href^="#"]')];
    const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      navItems.forEach(link=>link.classList.toggle('active',link.getAttribute('href')===`#${entry.target.id}`));
    }),{rootMargin:'-28% 0px -62% 0px'});
    navItems.forEach(link=>{const section=document.querySelector(link.getAttribute('href'));if(section)sectionObserver.observe(section);});

    // Project filters
    document.querySelectorAll('.tab-btn').forEach(btn=>btn.addEventListener('click',()=>{
      document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
      const filter=btn.dataset.filter;
      document.querySelectorAll('.project-card').forEach(card=>{const cats=card.dataset.category||'';card.hidden=filter!=='all'&&!cats.includes(filter);});
    }));
