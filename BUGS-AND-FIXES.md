# 🐛 Bugs & Fixes — numerologygowhere.com

Audit Date: March 16, 2026
Audited by: Perplexity AI Agent (Comet)

---

## ✅ FULL END-TO-END AUDIT RESULTS — March 16, 2026

| Feature | Status | Notes |
|---|---|---|
| Lo Shu Grid (tap numbers) | ✅ WORKING | Shows energy description on click |
| Life Numbers Calculator | ✅ WORKING | Calculates all positions correctly |
| Architects of Life button | ✅ WORKING | Full reading page renders |
| Language Toggle EN/中文 | ✅ WORKING | Persists across navigation |
| Sign In modal (from Life Numbers) | ✅ WORKING | Shows via Buy Report flow |
| Register form | ✅ WORKING | Email + password + Google OAuth |
| Pricing modal | ✅ WORKING | Free / S$19.90 / S$69.90 / S$39.90/mo |
| Stripe payment flow | ✅ WORKING | Redirects to login before payment |
| Referral code field | ✅ PRESENT | Shows NGW-XXXXXX placeholder |
| numerologygowhere.com domain | ✅ LIVE | HTTPS enabled via Let's Encrypt |
| numerologygowhere.sg domain | ✅ LIVE | DNS updated, HTTPS active |
| www.numerologygowhere.com | ✅ WORKING | Redirects to primary |
| www.numerologygowhere.sg | ✅ WORKING | Domain alias active |
| Netlify GitHub App | ✅ INSTALLED | App installed on Weitiong88/numerologygowhere |

---

## 🔴 KNOWN BUGS

### BUG 1 — Share My Reading button is broken [HIGH PRIORITY]

**Location:** Architects of Life page → "Share My Reading" button
**What happens:** Clicking shows a loading spinner briefly, then nothing — no share modal, no URL generated, no error
**Expected:** Opens a share sheet or generates a public shareable link

#### Fix
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

### BUG 2 — Referral code apply button not confirmed working [MEDIUM]

**Location:** Pricing modal → "Got a referral code?" section
**What happens:** Code field shows but Apply button behavior not verified
**Expected:** Applies 10% discount and shows confirmation

#### Fix
Verify the referral code lookup in Supabase `referral_codes` table:
```js
const { data } = await supabase
  .from('referral_codes')
  .select('*')
  .eq('code', enteredCode)
  .single();
if (data) applyDiscount(0.10);
else showToast('Invalid referral code');
```

---

### BUG 3 — Lo Shu button tooltip text not localized [LOW]

**Location:** Our Story page → Lo Shu grid bottom button
**What happens:** "Tap a number to see its energy" stays in English even when Chinese is selected
**Expected:** Should show Chinese text when 中文 is active

#### Fix
Add translation key for the button text:
```js
// EN: 'Tap a number to see its energy'
// ZH: '点击数字查看能量'
```

---

### BUG 4 — Sign In button on Our Story page does nothing [HIGH PRIORITY]

**Location:** Main nav → "Sign In" button (on Our Story page)
**What happens:** Clicking Sign In button does nothing — no modal, no redirect
**Expected:** Should open the authentication modal

#### Fix
Ensure the Sign In button triggers `openAuthModal()` in all page contexts, not just the Life Numbers tab:
```js
document.querySelector('#signInBtn').addEventListener('click', () => {
  openAuthModal();
});
```

---

### BUG 5 — Architects of Life button sometimes disabled [MEDIUM]

**Location:** Life Numbers tab → Architects of Life button
**What happens:** Button appears greyed out before DOB is entered
**Expected:** Clear visual feedback that DOB must be entered first

#### Fix
Add a tooltip or toast when button is clicked without DOB:
```js
if (!dob) {
  showToast('Please enter your date of birth first');
  return;
}
```

---

## 🔧 INFRASTRUCTURE STATUS

| Item | Status | Notes |
|---|---|---|
| Netlify deployment | ✅ Active | quiet-custard-c54ca1.netlify.app |
| GitHub repo | ⚠️ Needs fix | index.html contains SQL, not app code |
| GitHub → Netlify CI/CD | ❌ Not linked | Must complete link in Netlify settings |
| Supabase backend | ✅ Connected | Auth + data working |
| Stripe payments | ✅ Connected | Pricing modal functional |

### ACTION REQUIRED: Upload real index.html to GitHub
1. Download the actual `index.html` from numerologygowhere.com (right-click → Save As)
2. Upload it to this GitHub repo (replacing the current SQL file)
3. Then complete GitHub→Netlify link in Netlify Project Configuration → Build & deploy → Continuous deployment

---

Last updated: March 16, 2026 by Perplexity AI Agent
