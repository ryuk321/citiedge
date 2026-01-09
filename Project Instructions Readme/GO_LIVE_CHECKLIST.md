# ✅ GO LIVE CHECKLIST

Use this checklist when you're ready to move from test mode to production.

---

## 📋 PRE-LAUNCH (Do These First)

### Stripe Account Setup
- [ ] Complete Stripe account onboarding at https://dashboard.stripe.com/account/onboarding
  - [ ] Business information submitted
  - [ ] Bank account added (for receiving payments)
  - [ ] Identity verification completed
  - [ ] Tax information provided
- [ ] Account activation approved by Stripe
- [ ] Received confirmation email from Stripe

### Testing Verification
- [ ] Tested instant payment with test card `4242 4242 4242 4242`
- [ ] Verified payment appears in Stripe test dashboard
- [ ] Verified payment saved to your database
- [ ] Tested invoice creation
- [ ] Viewed invoice via hosted URL
- [ ] Paid test invoice successfully
- [ ] Checked payment history displays correctly
- [ ] Tested declining card `4000 0000 0000 0002`
- [ ] Verified error messages display properly

### Security Review
- [ ] Confirmed `.env.local` is in `.gitignore`
- [ ] Verified no API keys in Git history
- [ ] Production site uses HTTPS (required by Stripe)
- [ ] Student authentication working
- [ ] Database connection secure
- [ ] API routes properly secured

---

## 🔄 SWITCHING TO LIVE MODE

### Step 1: Get Live API Keys
- [ ] Log in to Stripe Dashboard: https://dashboard.stripe.com
- [ ] Toggle from "Test mode" to "Live mode" (switch in top-right corner)
- [ ] Click "Developers" in top menu
- [ ] Click "API keys" in left sidebar
- [ ] Copy **Live Publishable Key** (starts with `pk_live_`)
  - Store temporarily in secure location
- [ ] Reveal and copy **Live Secret Key** (starts with `sk_live_`)
  - Store temporarily in secure location
  - ⚠️ You can only view this ONCE!

### Step 2: Update Environment Variables
- [ ] Open `c:\Users\loken\Documents\CITIEDGE\citiedg-portals\.env.local`
- [ ] Back up current `.env.local` (save as `.env.local.backup`)
- [ ] Update these lines:
  ```env
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY_HERE
  STRIPE_SECRET_KEY=sk_live_YOUR_KEY_HERE
  ```
- [ ] Verify no extra spaces before/after keys
- [ ] Verify keys are complete (not truncated)
- [ ] Save file

### Step 3: Update Production Site URL
- [ ] In `.env.local`, update:
  ```env
  NEXT_PUBLIC_SITE_URL=https://citiedgecollege.co.uk
  ```
- [ ] Replace with your actual domain
- [ ] Ensure using HTTPS (not HTTP)

### Step 4: Deploy to Production
- [ ] If using hosting platform (Vercel, Netlify, etc.):
  - [ ] Add environment variables in hosting dashboard
  - [ ] Set `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...`
  - [ ] Set `STRIPE_SECRET_KEY=sk_live_...`
  - [ ] Set `NEXT_PUBLIC_SITE_URL=https://yourdomain.com`
- [ ] Deploy latest code
- [ ] Verify deployment successful

### Step 5: Restart Application
- [ ] Stop development server (Ctrl+C)
- [ ] Clear `.next` cache: `rm -rf .next` or delete `.next` folder
- [ ] Restart server: `npm run dev` (development) or deploy (production)
- [ ] Verify server started without errors

---

## 🧪 PRODUCTION TESTING

### Initial Test (Use Your Personal Card)
- [ ] Go to payments page
- [ ] Create payment for **small amount** (£1.00)
- [ ] Use your personal credit/debit card
- [ ] Complete payment
- [ ] ⚠️ This will charge REAL MONEY

### Verify Test Payment
- [ ] Payment succeeded in your app
- [ ] Payment appears in Stripe Live Dashboard: https://dashboard.stripe.com/payments
- [ ] Payment saved to your database
- [ ] Receipt generated correctly
- [ ] Email received (if configured)

### Test Invoice
- [ ] Create test invoice for small amount
- [ ] Use your email address
- [ ] Verify invoice email received
- [ ] Click payment link in email
- [ ] Pay invoice with your card
- [ ] Verify invoice marked as "Paid" in Stripe

### Final Checks
- [ ] No test cards work (they shouldn't in live mode)
- [ ] Stripe Dashboard showing "Live mode" (top bar)
- [ ] All amounts correct (no accidental zeros)
- [ ] Student authentication working
- [ ] Error handling working properly

---

## 🎯 GO LIVE!

### Final Verification
- [ ] All tests passed above
- [ ] Database ready for production
- [ ] Staff/admin trained on invoice system
- [ ] Support process established
- [ ] Backup systems in place

### Announcement
- [ ] Notify students payment system is live
- [ ] Provide payment instructions
- [ ] Share support contact information

### Monitor First Transactions
- [ ] Watch first 5-10 transactions closely
- [ ] Verify payments process correctly
- [ ] Check for any errors
- [ ] Respond quickly to any issues

---

## 📊 POST-LAUNCH MONITORING

### Daily (First Week)
- [ ] Check Stripe Dashboard for successful payments
- [ ] Review any failed payments
- [ ] Monitor error logs
- [ ] Check database consistency

### Weekly (First Month)
- [ ] Review payment reports
- [ ] Check payout schedule
- [ ] Verify bank deposits match Stripe
- [ ] Review customer feedback

### Setup Ongoing Monitoring
- [ ] Set up Stripe webhook (recommended)
- [ ] Configure email notifications
- [ ] Set up financial reconciliation process
- [ ] Document any issues and resolutions

---

## 🔄 OPTIONAL: WEBHOOK SETUP

### Why Webhooks?
- Real-time payment notifications
- Automatic invoice status updates
- Better reliability (no polling needed)
- Backup for payment confirmation

### Setup Steps
- [ ] In Stripe Dashboard, go to Developers → Webhooks
- [ ] Click "Add endpoint"
- [ ] Enter URL: `https://yourdomain.com/api/stripe/webhook`
- [ ] Select events:
  - [ ] `payment_intent.succeeded`
  - [ ] `payment_intent.payment_failed`
  - [ ] `invoice.paid`
  - [ ] `invoice.payment_failed`
  - [ ] `invoice.payment_action_required`
- [ ] Copy webhook signing secret
- [ ] Add to `.env.local`: `STRIPE_WEBHOOK_SECRET=whsec_...`
- [ ] Create webhook handler (see GOING_LIVE_GUIDE.md)
- [ ] Test webhook with Stripe CLI

---

## 📧 EMAIL CONFIGURATION

### Stripe Email Settings
- [ ] Go to Stripe Dashboard → Settings → Emails
- [ ] Customize receipt email template
- [ ] Add your school logo
- [ ] Update footer with contact information
- [ ] Set reply-to email address

### Invoice Email Settings
- [ ] Go to Stripe Dashboard → Settings → Invoices
- [ ] Customize invoice template
- [ ] Add school branding
- [ ] Set default payment terms
- [ ] Configure tax settings if needed

---

## 🎨 BRANDING CUSTOMIZATION

### Stripe Checkout Appearance
- [ ] Go to Settings → Branding
- [ ] Upload school logo
- [ ] Set brand colors
- [ ] Add icon
- [ ] Configure business information

### Invoice Template
- [ ] Access Settings → Invoice template
- [ ] Customize header/footer
- [ ] Add school address
- [ ] Add contact information
- [ ] Set default currency display

---

## 💾 BACKUP PLAN

### What If Something Goes Wrong?

#### Rollback to Test Mode:
1. [ ] Stop server
2. [ ] Open `.env.local`
3. [ ] Replace live keys with test keys
4. [ ] Restart server
5. [ ] All new payments go to test mode
6. [ ] Previous live payments remain in Stripe

#### Emergency Contacts:
- **Stripe Support:** https://support.stripe.com/contact
- **Your Developer:** _______________
- **IT Support:** _______________

---

## 📋 LAUNCH DAY CHECKLIST

### Morning Of
- [ ] Verify all tests passing
- [ ] Check Stripe account status
- [ ] Verify bank account connected
- [ ] Confirm HTTPS working
- [ ] Test payment one more time

### Go Live
- [ ] Switch to live keys
- [ ] Deploy to production
- [ ] Monitor first transaction
- [ ] Verify first payment completes
- [ ] ✅ LIVE!

### After Launch
- [ ] Send announcement to students
- [ ] Monitor for issues
- [ ] Be available for support
- [ ] Celebrate! 🎉

---

## 📞 SUPPORT CONTACTS

### Stripe Support
- **Dashboard:** https://dashboard.stripe.com
- **Support:** https://support.stripe.com
- **Phone:** Check dashboard for region-specific number
- **Chat:** Available in Stripe Dashboard (bottom-right)

### Documentation
- **Stripe Docs:** https://docs.stripe.com
- **API Reference:** https://docs.stripe.com/api
- **Testing:** https://docs.stripe.com/testing

---

## ⚠️ COMMON MISTAKES TO AVOID

- [ ] **Don't:** Mix test and live keys
- [ ] **Don't:** Share secret keys
- [ ] **Don't:** Commit keys to Git
- [ ] **Don't:** Use HTTP in production
- [ ] **Don't:** Skip testing with real card first
- [ ] **Don't:** Forget to restart server after key change
- [ ] **Do:** Keep test environment for future testing
- [ ] **Do:** Monitor closely after launch
- [ ] **Do:** Have rollback plan ready
- [ ] **Do:** Document any custom configurations

---

## ✅ FINAL CONFIRMATION

Before going live, confirm you can answer YES to all:

- [ ] Stripe account fully activated?
- [ ] Test payments working correctly?
- [ ] Live keys obtained and secured?
- [ ] Environment variables updated?
- [ ] HTTPS configured?
- [ ] Tested with real card (small amount)?
- [ ] Database ready for production?
- [ ] Support process in place?
- [ ] Rollback plan ready?
- [ ] Team trained and ready?

**All checked?** You're ready to go live! 🚀

---

## 📅 POST-LAUNCH (30 Days)

### Week 1
- [ ] Daily monitoring of payments
- [ ] Review any failed transactions
- [ ] Address any student issues
- [ ] Document lessons learned

### Week 2-4
- [ ] Weekly payment reconciliation
- [ ] Review Stripe reports
- [ ] Check bank deposits
- [ ] Optimize based on usage patterns

### Month 1 Review
- [ ] Total transactions processed: _______
- [ ] Total revenue: £_______
- [ ] Failed payment rate: _______%
- [ ] Average transaction: £_______
- [ ] Issues encountered: _______
- [ ] Improvements needed: _______

---

## 🎉 CONGRATULATIONS!

You're now processing real payments with Stripe! 

**Remember:** 
- Monitor closely for first few weeks
- Keep test environment active
- Document everything
- Stay in touch with Stripe support

**Questions?** Check [STRIPE_FAQ.md](STRIPE_FAQ.md)

**Need help?** Contact Stripe support or review the documentation.

---

**Last Updated:** January 7, 2026  
**Version:** 1.0  
**Status:** Ready for Production 🚀
