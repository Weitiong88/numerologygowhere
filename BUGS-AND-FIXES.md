# 🐛 Bugs & Fixes — numerologygowhere.com

Audit Date: March 16, 2026  
Audited by: Perplexity AI Agent

---

## BUG 1 — Share My Reading button is broken [HIGH PRIORITY]

**Location:** Architects of Life page → "Share My Reading" button  
**What happens:** Clicking shows a loading spinner briefly, then nothing — no share modal, no URL generated, no error  
**Expected:** Opens a share sheet or generates a public shareable link  

### Fix
In your `index.html`, find the Share button click handler. It likely looks like:
```js
btn.addEventListener('click', async () => {
  // setLoading(true) here
  // missing: await generateShareLink() or navigator.share()
})
```
Add a fallback: if user is not logged in, show a toast message:
```js
if (!currentUser) {
  showToast('Please sign in to share your reading');
  openAuthModal();
  return;
}
```
If user IS logged in, generate a shareable URL like:
```js
const shareUrl = `${window.location.origin}/share/${readingId}`;
await navigator.clipboard.writeText(shareUrl);
showToast('Link copied to clipboard!');
```

---

## BUG 2 — Referral code section shows Chinese in English mode [MEDIUM]

**Location:** Pricing modal ("Unlock Full Reading") → referral code section at bottom  
**What happens:** When site is in English mode, the referral code section shows Chinese text: "有推荐码？输入可享9折优惠" and button "应用"  
**Expected:** Should show English: "Got a referral code? Enter to get 10% off" and "Apply"

### Fix
In your translation/i18n object, find the referral code keys. They are likely only defined in the `zh` object but missing in `en`. Add to your English translations:
```js
// In your EN translations object:
'referral.prompt': 'Got a referral code? Enter for 10% off',
'referral.apply': 'Apply',
'referral.placeholder': 'NGW-XXXXXX',
```
And in your ZH translations (keep existing):
```js
'referral.prompt': '有推荐码？输入可享9折优惠',
'referral.apply': '应用',
```

---

## BUG 3 — Lo Shu "Tap a number" button not translated [LOW]

**Location:** Our Story page → Lo Shu Square → button below grid  
**What happens:** "Tap a number to see its energy" text stays in English when site switches to 中文  
**Expected:** Should show Chinese: "点击数字查看其能量"

### Fix
Find the Lo Shu button in your HTML/JS and add the translation key:
```html
<!-- Change from: -->
<button>Tap a number to see its energy</button>

<!-- Change to: -->
<button data-i18n="loshu.tapButton">Tap a number to see its energy</button>
```
And add to translations:
```js
'loshu.tapButton': {
  en: 'Tap a number to see its energy',
  zh: '点击数字查看其能量'
}
```

---

## BUG 4 — Sign In header button no visible feedback [LOW/UX]

**Location:** Top navigation → "Sign In" button  
**What happens:** Clicking shows a brief loading dot then nothing visible — no modal opens directly  
**Note:** The modal DOES open when navigating to Life Numbers, so the auth modal works. The issue is the header Sign In button isn't triggering `openAuthModal()` directly.

### Fix
Find the header Sign In button click handler:
```js
// Should be:
document.getElementById('headerSignInBtn').addEventListener('click', () => {
  openAuthModal(); // Make sure this is called directly
});
```

---

## BUG 5 — No back navigation on Architects of Life page [UX]

**Location:** After clicking "Architects of Life" button  
**What happens:** Full-screen Architects of Life report has no visible header/nav — users are stuck  
**Expected:** Should have a "← Back" button or keep main navigation visible

### Fix
In the Architects of Life section, add a back button at the top:
```html
<button onclick="showSection('lifeNumbers')" style="position:fixed;top:16px;left:16px;z-index:100">
  ← Back
</button>
```
Or ensure the main nav stays visible (remove any CSS that hides it on this section).

---

## INFRASTRUCTURE — numerologygowhere.sg SSL Error [CRITICAL]

**What happens:** `https://numerologygowhere.sg` shows ERR_SSL_PROTOCOL_ERROR  
**Root cause:** The bare domain `numerologygowhere.sg` DNS A record is not pointing to Netlify's load balancer IP

### Fix — Update DNS at your domain registrar

Log in to where you bought `numerologygowhere.sg` and set:

**Option A (Recommended — ALIAS/ANAME):**
```
Type:  ALIAS or ANAME
Host:  @ (root domain)
Value: apex-loadbalancer.netlify.com
TTL:   3600
```

**Option B (Fallback — A Record):**
```
Type:  A
Host:  @ (root domain)
Value: 75.2.60.5
TTL:   3600
```

Also ensure `www.numerologygowhere.sg` has:
```
Type:  CNAME
Host:  www
Value: quiet-custard-c54ca1.netlify.app
TTL:   3600
```

**After updating DNS (wait 1-24 hours), then:**
1. Go to https://app.netlify.com/projects/quiet-custard-c54ca1/domain-management
2. Scroll to HTTPS section
3. Click "Renew certificate"
4. Netlify will auto-provision SSL for numerologygowhere.sg

**Domain registrar options (if unsure where to log in):**
- SingTel/Vodien: https://www.vodien.com
- GoDaddy Singapore: https://sg.godaddy.com
- Namecheap: https://namecheap.com
- Check your email for domain registration confirmation to find your registrar

---

## NETLIFY CLEANUP — Stuck Deploy

**Issue:** A deploy from Mar 10 is stuck in "Uploading" status  
**Fix:**
1. Go to https://app.netlify.com/projects/quiet-custard-c54ca1/deploys
2. Click on the "Uploading" deploy
3. Click Options → Cancel deploy

---

## SECONDARY NETLIFY PROJECT — leafy-donut-50a312

**Issue:** Project `leafy-donut-50a312` appears to be an old/unused version of the site (published Feb 28, 0 traffic)  
**Recommendation:** Either delete it or keep it as a staging environment  
**Do NOT add numerologygowhere.sg to this project** — the domain is already assigned to quiet-custard-c54ca1

---

*Last updated: March 16, 2026 · Audit by Perplexity AI*
