# 🧭 Numerology GoWhere

**Live Sites:**
- 🌐 https://numerologygowhere.com (Primary)
- 🌐 https://numerologygowhere.sg (Alias — DNS fix required)

**Hosting:** Netlify (quiet-custard-c54ca1)  
**Stack:** Single-file HTML/CSS/JS SPA  
**Backend:** Supabase (auth + data) · Stripe (payments)  
**Last Updated:** March 2026

---

## 📁 Repository Structure

```
numerologygowhere/
├── index.html          ← Full single-page app (upload your file here)
├── BUGS-AND-FIXES.md   ← Audit findings & fix instructions
└── README.md           ← This file
```

## 🚀 How to Deploy

### Option A — Netlify Drop (current method)
1. Go to https://app.netlify.com/projects/quiet-custard-c54ca1
2. Drag and drop your `index.html` file onto the deploy box
3. Done — live in ~5 seconds

### Option B — GitHub Auto-Deploy (recommended)
1. Connect this repo to Netlify via Project Configuration → Link repository
2. Set Publish directory to `/`
3. Every push to `main` auto-deploys

## 🔧 How to Backup Your Source Code

1. Open https://numerologygowhere.com on your Mac
2. Press **Cmd + S** → Save as "Web Page, HTML Only"
3. Name it `index.html`
4. Go to this repo → click **Add file → Upload files**
5. Drag your `index.html` → Commit

## 🐛 Known Bugs (see BUGS-AND-FIXES.md)

| # | Issue | Priority |
|---|-------|----------|
| 1 | Share My Reading button broken (no share modal) | HIGH |
| 2 | Referral code section shows Chinese text in English mode | MEDIUM |
| 3 | Lo Shu "Tap a number" button not translated in 中文 mode | LOW |
| 4 | Sign In header button no visible feedback | LOW |
| 5 | No back navigation on Architects of Life page | UX |

## 🌐 Domain Status

| Domain | Status |
|--------|--------|
| numerologygowhere.com | ✅ Live & working |
| www.numerologygowhere.com | ✅ Redirects to primary |
| www.numerologygowhere.sg | ✅ Domain alias set |
| numerologygowhere.sg | ⚠️ Pending DNS — needs A record fix |

### Fix for numerologygowhere.sg SSL error

Log in to your domain registrar (where you bought numerologygowhere.sg) and add:

```
Type:   A
Host:   @ (or leave blank for root domain)
Value:  75.2.60.5
TTL:    3600
```

OR if your registrar supports ALIAS/ANAME:
```
Type:   ALIAS or ANAME
Host:   @
Value:  apex-loadbalancer.netlify.com
```

After saving, wait up to 24 hours for DNS propagation, then go to:
Netlify → numerologygowhere.com project → Domain management → HTTPS → Renew certificate

## 📊 Netlify Projects

| Project | Netlify ID | Domain |
|---------|-----------|--------|
| Primary | quiet-custard-c54ca1 | numerologygowhere.com + .sg alias |
| Secondary | leafy-donut-50a312 | (old — not used for .sg) |

## 💳 Pricing Tiers

| Plan | Price | Features |
|------|-------|----------|
| Free | S$0 | Core chart, Architects of Life, Missing numbers |
| Single Report | S$19.90 | 1 person full report, 1-to-9 Decode, 81 Combo |
| Family Report | S$69.90 | Up to 5 people, all reports saved |
| Subscription | S$39.90/mo | Unlimited profiles, Yearly/Monthly/Daily |

---

*Operated from Singapore · © 2025 Numerology GoWhere*
