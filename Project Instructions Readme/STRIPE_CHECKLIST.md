# ✅ STRIPE PAYMENTS - IMPLEMENTATION CHECKLIST

Quick reference checklist for setting up and deploying your Stripe payment system.

---

## 🚀 INITIAL SETUP (Do This Now)

### 1. Install Dependencies
```bash
npm install mysql2 @stripe/react-stripe-js
```
- [ ] Run the command above
- [ ] Wait for installation to complete
- [ ] Check for any error messages

### 2. Setup Database
```bash
# Run this in MySQL:
mysql -u citiedge_portal -p citiedge_portal < create_payments_table.sql
```
- [ ] Open MySQL client
- [ ] Select database: `citiedge_portal`
- [ ] Run: `create_payments_table.sql`
- [ ] Verify: `SELECT * FROM student_payments;`

### 3. Verify Environment Variables
Open `.env.local` and check:
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` starts with `pk_test_`
- [ ] `STRIPE_SECRET_KEY` starts with `sk_test_`
- [ ] No extra spaces in the keys
- [ ] File is saved

### 4. Restart Development Server
```bash
# Press Ctrl+C, then:
npm run dev
```
- [ ] Server stopped successfully
- [ ] Server restarted on port 3000
- [ ] No error messages in console

---

## 🧪 TESTING PHASE (Before Production)

### Basic Functionality
- [ ] Navigate to `http://localhost:3000/student/portal`
- [ ] Click "Payments" tab - page loads
- [ ] Form displays correctly
- [ ] All fields are visible
- [ ] "Development Mode" warning shows

### Test Successful Payment
- [ ] Select "Tuition Fee" from dropdown
- [ ] Enter amount: `100.00`
- [ ] Add description: "Test payment"
- [ ] Card: `4242 4242 4242 4242`
- [ ] Expiry: `12/25` (any future date)
- [ ] CVC: `123` (any 3 digits)
- [ ] Click "Pay £100.00"
- [ ] Button shows "Processing..."
- [ ] Success message appears
- [ ] Form clears automatically
- [ ] Payment appears in history below

### Verify in Stripe Dashboard
- [ ] Go to: [dashboard.stripe.com/test/payments](https://dashboard.stripe.com/test/payments)
- [ ] See your test payment
- [ ] Amount matches: £100.00
- [ ] Status is "Succeeded"
- [ ] Student metadata is correct

### Verify in Database
```sql
SELECT * FROM student_payments ORDER BY created_at DESC LIMIT 1;
```
- [ ] Payment record exists
- [ ] student_id: ST001
- [ ] amount: 100.00
- [ ] payment_status: succeeded
- [ ] stripe_payment_intent_id exists
- [ ] created_at timestamp is correct

### Test Failed Payment
- [ ] New payment attempt
- [ ] Amount: `50.00`
- [ ] Card: `4000 0000 0000 0002` (decline card)
- [ ] Click "Pay £50.00"
- [ ] Error message displays
- [ ] Form stays filled (doesn't clear)
- [ ] Can edit and retry

### Test Payment History
- [ ] History table shows all payments
- [ ] Dates are formatted correctly
- [ ] Amounts show with 2 decimals
- [ ] Status badges have colors
- [ ] Receipt links work (open in new tab)
- [ ] Most recent payments at top

### Cross-Browser Testing
- [ ] Chrome: Everything works
- [ ] Firefox: Everything works
- [ ] Safari: Everything works
- [ ] Edge: Everything works
- [ ] Mobile Chrome: Responsive design
- [ ] Mobile Safari: Responsive design

### Edge Cases
- [ ] Try amount: `0.00` - Should show error
- [ ] Try negative amount - Should prevent
- [ ] Submit without card details - Should show error
- [ ] Try expired card - Should decline
- [ ] Check very long descriptions - Should work
- [ ] Multiple quick submissions - Should prevent

---

## 🔒 SECURITY REVIEW

### Code Security
- [ ] `.env.local` is in `.gitignore`
- [ ] No API keys in source code
- [ ] Secret key only used server-side
- [ ] Publishable key only used client-side
- [ ] SQL queries use parameterized queries
- [ ] No user input directly in SQL

### Access Control
- [ ] Payment page requires student login
- [ ] Student can only see their own payments
- [ ] API routes validate requests
- [ ] No admin controls in student interface

### Data Protection
- [ ] Card data never stored in your database
- [ ] Only Stripe IDs are stored
- [ ] Personal info is minimal
- [ ] Database has proper indexes

---

## 📝 DOCUMENTATION REVIEW

### Code Comments
- [ ] All files have header comments
- [ ] Complex functions explained
- [ ] API routes documented
- [ ] Database queries commented

### User-Facing
- [ ] Development warning is clear
- [ ] Error messages are helpful
- [ ] Success messages are clear
- [ ] Instructions are simple

### Technical Docs
- [ ] STRIPE_QUICK_START.md reviewed
- [ ] STRIPE_PRODUCTION_GUIDE.md reviewed  
- [ ] STRIPE_VISUAL_GUIDE.md reviewed
- [ ] This checklist completed!

---

## 🚀 PRE-PRODUCTION CHECKLIST

### Stripe Account Setup
- [ ] Stripe account created
- [ ] Email verified
- [ ] Business information completed
- [ ] Bank account added
- [ ] Identity verified (may require documents)
- [ ] Payout schedule configured
- [ ] Test mode thoroughly tested

### Get Live API Keys
- [ ] Login to Stripe Dashboard
- [ ] Toggle to "Live mode"
- [ ] Copy live publishable key (`pk_live_...`)
- [ ] Copy live secret key (`sk_live_...`)
- [ ] Store keys securely

### Update Production Settings
- [ ] Update `.env.local` with live keys
- [ ] Change `NEXT_PUBLIC_SITE_URL` to production URL
- [ ] Remove/update development warning in UI
- [ ] Update currency if needed
- [ ] Restart server after changes

### Infrastructure
- [ ] Production server has HTTPS
- [ ] SSL certificate valid
- [ ] Database backups enabled
- [ ] Error logging configured
- [ ] Monitoring setup

### Test in Production
- [ ] Make small real payment (£1.00)
- [ ] Verify in Stripe dashboard
- [ ] Check database record
- [ ] Confirm receipt email
- [ ] Test refund in Stripe dashboard
- [ ] Verify refund successful

### Legal & Compliance
- [ ] Terms of Service updated
- [ ] Privacy Policy mentions Stripe
- [ ] Refund policy documented
- [ ] Support contact available

---

## 📊 MONITORING CHECKLIST

### Daily Checks (First Week)
- [ ] Check Stripe dashboard for payments
- [ ] Monitor failed payments
- [ ] Review error logs
- [ ] Check database consistency
- [ ] Verify receipt emails sending

### Weekly Checks (Ongoing)
- [ ] Review payment statistics
- [ ] Check for disputes/chargebacks
- [ ] Monitor refund requests
- [ ] Update documentation if needed
- [ ] Check for Stripe SDK updates

### Monthly Checks
- [ ] Review total revenue
- [ ] Analyze payment patterns
- [ ] Check for security advisories
- [ ] Update dependencies
- [ ] Backup database

---

## 🆘 EMERGENCY CONTACTS

### Stripe Support
- Dashboard: [dashboard.stripe.com](https://dashboard.stripe.com)
- Support: [support.stripe.com](https://support.stripe.com)
- Status: [status.stripe.com](https://status.stripe.com)

### Documentation
- Stripe Docs: [stripe.com/docs](https://stripe.com/docs)
- Test Cards: [stripe.com/docs/testing](https://stripe.com/docs/testing)
- API Reference: [stripe.com/docs/api](https://stripe.com/docs/api)

### Your System
- Database: `citiedge_portal`
- API Routes: `/app/api/stripe/`
- Payment Page: `/pages/student/payments.tsx`
- Config: `.env.local`

---

## 🎯 QUICK TROUBLESHOOTING

| Problem | Quick Fix |
|---------|-----------|
| "Stripe is not loaded" | Restart server, check `.env.local` |
| "Table doesn't exist" | Run `create_payments_table.sql` |
| "Invalid API key" | Check keys in `.env.local`, no spaces |
| Payment not in database | Check API logs, verify MySQL connection |
| Can't see Payments tab | Clear cache, check `portal.tsx` updated |
| Receipt email not sent | Check email in Stripe, verify `receipt_email` |

---

## ✅ FINAL GO-LIVE CHECKLIST

Before announcing to students:

- [ ] All testing complete
- [ ] Live keys configured
- [ ] Production payment tested
- [ ] Refund process tested
- [ ] Support email ready
- [ ] Staff trained on refunds
- [ ] Backup taken
- [ ] Monitoring active
- [ ] Documentation complete
- [ ] Announcement prepared

---

## 🎉 POST-LAUNCH

### Immediate (First 24 Hours)
- [ ] Monitor first real payments
- [ ] Respond to student questions quickly
- [ ] Fix any issues immediately
- [ ] Document any problems

### First Week
- [ ] Collect student feedback
- [ ] Monitor payment success rate
- [ ] Check for error patterns
- [ ] Update documentation based on questions

### First Month
- [ ] Review payment statistics
- [ ] Identify improvements
- [ ] Update UI based on feedback
- [ ] Plan enhancements

---

**Keep this checklist handy throughout your implementation!**

Print it out or keep it open in a tab. Check items off as you complete them.

Good luck! 🚀
