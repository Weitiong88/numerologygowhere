export default async function(request, context) {
  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return;

  let html = await response.text();

  const cssfix = `<style>
    html,body{overflow:auto!important;overscroll-behavior-y:auto!important;}
    body.modal-open{overflow:auto!important;}
    body[style*="overflow: hidden"]{overflow:auto!important;}
    nav,header,[class*="navbar"],[id*="navbar"]{display:block!important;visibility:visible!important;opacity:1!important;position:sticky!important;top:0!important;z-index:9999!important;}
  </style>`;

  const jsfix = `<script>
  document.addEventListener('DOMContentLoaded', function() {

    // Fix 1: Scroll lock override
    setInterval(function() {
      var m = document.getElementById('disclaimerModal');
      var am = document.getElementById('authModal');
      var pm = document.getElementById('pricingModal');
      var anyOpen = (m && m.offsetParent !== null) ||
                    (am && am.offsetParent !== null) ||
                    (pm && pm.offsetParent !== null);
      if (!anyOpen) {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
    }, 200);

    // Fix 1b: MutationObserver for disclaimer modal
    var i = document.getElementById('disclaimerModal');
    if (i) {
      new MutationObserver(function() {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }).observe(i, {attributes: true, childList: true});
    }

    // Fix 2, 3, 4: Footer links by text content
    document.querySelectorAll('a').forEach(function(el) {
      var txt = el.textContent.trim().toLowerCase();

      // Fix 2: Pricing -> find any button that triggers pricing modal and click it
      if (txt === 'pricing') {
        el.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          // Find any visible "Upgrade" or "Buy" button and click it to open pricing modal via SPA
          var btns = Array.from(document.querySelectorAll('button'));
          var upgBtn = btns.find(function(b) {
            return b.textContent && (b.textContent.indexOf('Upgrade') !== -1 || b.textContent.indexOf('Pro') !== -1);
          });
          if (upgBtn) {
            upgBtn.click();
          } else {
            // Scroll to life numbers section and open it
            var lifeLink = Array.from(document.querySelectorAll('a, button')).find(function(b) {
              return b.textContent && b.textContent.indexOf('Life Number') !== -1;
            });
            if (lifeLink) lifeLink.click();
            // Wait then try to find upgrade button
            setTimeout(function() {
              var b2 = Array.from(document.querySelectorAll('button')).find(function(b) {
                return b.textContent && (b.textContent.indexOf('Upgrade') !== -1 || b.textContent.indexOf('Pro') !== -1);
              });
              if (b2) b2.click();
            }, 500);
          }
        });
      }

      // Fix 3: Privacy Policy -> open privacy modal (already working)
      if (txt === 'privacy policy') {
        el.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          var modal = document.getElementById('privacyModal') || document.querySelector('[id*="privacy"]');
          if (modal) {
            modal.removeAttribute('hidden');
            modal.style.cssText = 'display:flex!important;visibility:visible!important;opacity:1!important;z-index:99999!important;position:fixed!important;inset:0!important;';
          }
        });
      }

      // Fix 4: Contact Us -> correct email, hidden from page
      if (txt === 'contact us' || (el.href && el.href.indexOf('hello@numerologygowhere') !== -1)) {
        el.href = 'mailto:numerologygowhere@gmail.com';
        if (el.innerText && el.innerText.indexOf('@') !== -1) el.innerText = 'Contact Us';
      }
    });

    // Fix 4b: Hide any raw email text from mailto links
    document.querySelectorAll('a[href^="mailto:"]').forEach(function(el) {
      if (el.innerText && el.innerText.indexOf('@') !== -1) el.innerText = 'Contact Us';
    });

    // Fix 6: Navbar always visible
    document.querySelectorAll('nav,header,[id="navbar"],[id="nav"]').forEach(function(el) {
      el.style.display = '';
      el.style.visibility = 'visible';
    });

  });
  <\/script>`;

  html = html.replace('</head>', cssfix + '</head>');
  html = html.replace('</body>', jsfix + '</body>');

  // Fix 4c: Replace email in raw HTML server-side
  html = html.replace(/mailto:hello@numerologygowhere\.com/g, 'mailto:numerologygowhere@gmail.com');
  html = html.replace(/hello@numerologygowhere\.com/g, 'Contact Us');

  const headers = new Headers(response.headers);
  headers.set('content-type', 'text/html; charset=utf-8');

  return new Response(html, {
    status: response.status,
    headers: headers
  });
}
