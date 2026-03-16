export default async function(request, context) {
  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return;

  let html = await response.text();

  // === CSS FIXES ===
  const cssfix = `<style>
    /* Fix 1: Scroll lock override */
    html,body{overflow:auto!important;overscroll-behavior-y:auto!important;}
    body.modal-open{overflow:auto!important;}
    body[style*="overflow: hidden"]{overflow:auto!important;}
    /* Fix 6: Ensure navbar is always visible */
    nav, header, [class*="navbar"], [class*="nav-bar"], [id*="navbar"], [id*="nav-bar"]{display:block!important;visibility:visible!important;opacity:1!important;position:sticky!important;top:0!important;z-index:9999!important;}
  </style>`;

  // === JS FIXES ===
  const jsfix = `<script>
  document.addEventListener('DOMContentLoaded', function() {

    // --- Fix 1: Scroll lock (disclaimer modal) ---
    var i = document.getElementById('disclaimerModal');
    if (i) {
      new MutationObserver(function() {
        if (i.style.display !== 'none' && i.style.opacity !== '0') {
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';
        }
      }).observe(i, {attributes: true});
    }

    // --- Fix 1b: Sign In button scroll lock ---
    var b = i ? i.querySelector('button') : null;
    if (b) b.addEventListener('click', function(e) {
      e.stopPropagation();
      var a = document.getElementById('authModal');
      if (a) {
        a.style.display = 'flex';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        if (typeof openAuthModal === 'function') openAuthModal();
      }
    });
    setInterval(function() {
      var m = document.getElementById('disclaimerModal');
      var am = document.getElementById('authModal');
      if ((!m || m.style.display === 'none' || !m.style.display) && (!am || am.style.display === 'none' || !am.style.display)) {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
    }, 300);

    // --- Fix 1c: Sign In button visible on ALL pages ---
    var btnSignIn = document.getElementById('btnSignIn');
    var s = document.querySelectorAll('[id*="signIn"],[id*="SignIn"],[class*="sign-in"],[class*="signin"]');
    s.forEach(function(el) {
      el.addEventListener('click', function(e) {
        e.stopPropagation();
        var a = document.getElementById('authModal');
        if (a) { a.style.display = 'flex'; }
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      });
    });

    // --- Fix 2: Footer Pricing link -> open pricing modal ---
    document.querySelectorAll('a[href*="pricing"], a[href="#pricing"]').forEach(function(el) {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        var modal = document.getElementById('pricingModal') || document.querySelector('[id*="pricing"]');
        if (modal) {
          modal.style.display = 'flex';
          document.body.style.overflow = '';
        } else {
          // fallback: scroll to any pricing section
          var sec = document.querySelector('[id*="price"],[id*="plan"],[class*="price"],[class*="plan"]');
          if (sec) sec.scrollIntoView({behavior:'smooth'});
        }
      });
    });

    // --- Fix 3: Footer Privacy Policy link -> open privacy modal ---
    document.querySelectorAll('a[href*="privacy"], a[href="#privacy"]').forEach(function(el) {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        var modal = document.getElementById('privacyModal') || document.querySelector('[id*="privacy"]');
        if (modal) {
          modal.style.display = 'flex';
          document.body.style.overflow = '';
        }
      });
    });

    // --- Fix 4: Footer Contact Us -> correct email (not exposed on page) ---
    document.querySelectorAll('a[href*="hello@numerologygowhere"], a[href*="contact"]').forEach(function(el) {
      if (el.href && el.href.indexOf('mailto:') !== -1) {
        el.href = 'mailto:numerologygowhere@gmail.com';
        el.removeAttribute('title');
        el.title = 'Contact Us';
      } else if (el.textContent.trim().toLowerCase() === 'contact us') {
        el.href = 'mailto:numerologygowhere@gmail.com';
        el.title = 'Contact Us';
      }
    });
    // Also patch any visible email text in footer
    document.querySelectorAll('a[href^="mailto:"]').forEach(function(el) {
      if (el.innerText && el.innerText.indexOf('@') !== -1 && el.innerText !== 'Contact Us') {
        el.innerText = 'Contact Us';
      }
    });

    // --- Fix 6: Reading/result page navbar always visible ---
    var navEls = document.querySelectorAll('nav, header, [id="navbar"], [id="nav"], [class*="navbar"]');
    navEls.forEach(function(el) {
      el.style.display = '';
      el.style.visibility = 'visible';
    });

    // --- Fix 7: Life Number dropdown UX - add helper hint ---
    var selects = document.querySelectorAll('select');
    selects.forEach(function(sel) {
      if (sel.closest('[class*="life"],[class*="number"],[id*="life"],[id*="number"]')) {
        if (!sel.dataset.hinted) {
          sel.dataset.hinted = '1';
          sel.title = 'Select to filter by Life Number';
          var hint = document.createElement('small');
          hint.style.cssText = 'display:block;color:#888;font-size:11px;margin-top:2px;';
          hint.textContent = 'Tap to choose your Life Number';
          if (sel.parentNode) sel.parentNode.appendChild(hint);
        }
      }
    });

  });
  <\/script>`;

  html = html.replace('</head>', cssfix + '</head>');
  html = html.replace('</body>', jsfix + '</body>');

  // --- Fix 4b: Replace hello@numerologygowhere.com email references in raw HTML ---
  html = html.replace(/mailto:hello@numerologygowhere\.com/g, 'mailto:numerologygowhere@gmail.com');
  html = html.replace(/hello@numerologygowhere\.com/g, 'Contact Us');

  const headers = new Headers(response.headers);
  headers.set('content-type', 'text/html; charset=utf-8');

  return new Response(html, {
    status: response.status,
    headers: headers
  });
}
