document.addEventListener('DOMContentLoaded',()=>{
  const routes={
    '/':'/',
    '/funkciok/':'/funkciok/',
    '/vallalkozoi-profilok/':'/vallalkozoi-profilok/',
    '/igy-mukodik/':'/igy-mukodik/',
    '/egyedi-modul/':'/egyedi-modul/',
    '/#vasarlas':'/#vasarlas'
  };
  document.querySelectorAll('a[href]').forEach(link=>{
    const original=link.getAttribute('href');
    if(routes[original])link.setAttribute('href',routes[original]);
  });
  document.querySelectorAll('.demo-nav a,.side-nav a').forEach(link=>{
    if(!link.dataset.label)link.dataset.label=link.textContent.trim();
  });
  document.querySelectorAll('.demo-sidebar .demo-brand small,.sidebar .brand small').forEach(item=>item.textContent='Pénzügyi tisztánlátás');
  document.querySelectorAll('.demo-sidebar-bottom,.sidebar-bottom').forEach(bottom=>{
    bottom.className='preview-help';
    bottom.innerHTML='<span class="preview-help-icon"><i data-lucide="circle-help"></i></span><p><strong>Kérdésed van?</strong><br>Írj nekünk:<br><a href="mailto:info@moneta-system.hu">info@moneta-system.hu</a></p>';
  });
  if(window.lucide)lucide.createIcons();
});


