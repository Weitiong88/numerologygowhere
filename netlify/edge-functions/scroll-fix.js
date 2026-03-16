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

    // Fix 2, 3, 4: Footer links - match by text content since hrefs are "#"
    document.querySelectorAll('a').forEach(function(el) {
      var txt = el.textContent.trim().toLowerCase();

      // Fix 2: Pricing -> find and click the existing Upgrade to Pro button
      if (txt === 'pricing') {
        el.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          // Navigate to Life Numbers tab first, then trigger pricing
          var lifeTab = document.querySelector('[data-section="life"], a[href*="life"]');
          // Try clicking an existing upgrade/pricing trigger button
          var upgBtn = document.querySelector('button[onclick*="pricing"], button[onclick*="modal"], [data-action="upgrade"]');
          if (upgBtn) {
            upgBtn.click();
          } else {
            // Direct modal manipulation
            var modal = document.getElementById('pricingModal');
            if (modal) {
              modal.removeAttribute('hidden');
              modal.style.cssText = 'display:flex!important;visibility:visible!important;opacity:1!important;z-index:99999!important;position:fixed!important;inset:0!important;';
              document.body.style.overflow = 'hidden';
            }
          }
        });
      }

      // Fix 3: Privacy Policy -> open privacy modal
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
