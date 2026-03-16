export default async function(request, context) {
  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return;
  
  let html = await response.text();
  
  // Inject CSS fix for scroll issue - override any overflow:hidden on html/body
  const cssfix = '<style>html,body{overflow:auto!important;overscroll-behavior-y:auto!important;}body.modal-open{overflow:auto!important;}body[style*="overflow: hidden"]{overflow:auto!important;}</style>';
  
  // Inject JS fix for Sign In button and disclaimer modal scroll lock
  const jsfix = '<script>document.addEventListener("DOMContentLoaded",function(){var i=document.getElementById("disclaimerModal");if(i){new MutationObserver(function(){if(!i.style.display||i.style.display==="none"||i.style.opacity==="0"){document.body.style.overflow="";document.documentElement.style.overflow="";}}).observe(i,{attributes:true});var b=i.querySelector("button");if(b)b.addEventListener("click",function(){setTimeout(function(){document.body.style.overflow="";document.documentElement.style.overflow="";},50);});}var s=document.getElementById("btnSignIn");if(s){s.addEventListener("click",function(e){e.stopPropagation();var a=document.getElementById("authModal");if(a){a.style.display="flex";document.body.style.overflow="hidden";}if(typeof openAuthModal==="function")openAuthModal();});}setInterval(function(){var m=document.getElementById("disclaimerModal");var am=document.getElementById("authModal");if((!m||m.style.display==="none"||!m.style.display)&&(!am||am.style.display==="none"||!am.style.display)){document.body.style.overflow="";document.documentElement.style.overflow="";}},300);});<\/script>';
  
  html = html.replace('</head>', cssfix + '</head>');
  html = html.replace('</body>', jsfix + '</body>');
  
  const headers = new Headers(response.headers);
  headers.set('content-type', 'text/html; charset=utf-8');
  
  return new Response(html, {
    status: response.status,
    headers: headers
  });
}
