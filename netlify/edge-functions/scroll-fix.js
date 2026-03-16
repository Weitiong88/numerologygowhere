export default async function(request, context) {
  const url = new URL(request.url);
  if (url.pathname !== '/' && url.pathname !== '/index.html') {
    return;
  }
  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return;
  const html = await response.text();
  const fixScript = `<script>
(function() {
  // Fix 1: Scroll unlock - ensure body overflow is never permanently locked
  const origAddClass = DOMTokenList.prototype.add;
  document.addEventListener('DOMContentLoaded', function() {
    // Patch disclaimer modal close
    var closeBtn = document.getElementById('disclaimerModal');
    if (closeBtn) {
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(m) {
          if (m.type === 'attributes' && m.attributeName === 'style') {
            var modal = m.target;
            if (modal.style.display === 'none' || modal.style.opacity === '0' || !modal.style.display) {
              document.body.style.overflow = '';
              document.body.style.overflowY = '';
              document.documentElement.style.overflow = '';
            }
          }
        });
      });
      observer.observe(closeBtn, { attributes: true, attributeFilter: ['style', 'class'] });
    }
    // Also override any direct body overflow locking
    var origStyleSet = Object.getOwnPropertyDescriptor(CSSStyleDeclaration.prototype, 'overflow');
    // Fix Sign In button on all pages
    var signInBtn = document.getElementById('btnSignIn');
    if (signInBtn) {
      signInBtn.addEventListener('click', function(e) {
        // Find and trigger auth modal
        var authModal = document.getElementById('authModal');
        if (authModal) {
          authModal.style.display = 'flex';
          document.body.style.overflow = 'hidden';
        }
        // Fallback: trigger openAuthModal if defined
        if (typeof openAuthModal === 'function') openAuthModal();
      });
    }
  });
  // Global scroll fixer: periodically restore scroll if modal is not visible
  setInterval(function() {
    var modal = document.getElementById('disclaimerModal');
    var authModal = document.getElementById('authModal');
    var anyModalOpen = (modal && (modal.style.display === 'flex' || modal.classList.contains('active'))) ||
                       (authModal && authModal.style.display === 'flex');
    if (!anyModalOpen) {
      document.body.style.overflow = '';
      document.body.style.overflowY = '';
    }
  }, 500);
})();
<\/script>`;
  const fixedHtml = html.replace('</body>', fixScript + '</body>');
  return new Response(fixedHtml, {
    status: response.status,
    headers: response.headers
  });
}
