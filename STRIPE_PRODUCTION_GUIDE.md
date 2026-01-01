# 🚀 STRIPE PAYMENTS - PRODUCTION DEPLOYMENT GUIDE

This guide will help you transition from **Development Mode** to **Production Mode** for your Stripe payment system.

---

## ✅ CURRENT STATUS: DEVELOPMENT MODE

You are currently using **TEST API KEYS** which means:
- ✅ Safe to test without real money
- ✅ Use test card: `4242 4242 4242 4242`
- ✅ All payments are simulated
- ✅ No real charges will occur

---

## 📋 PRE-PRODUCTION CHECKLIST

Before going to production, complete these steps:

### 1. ✅ Test Your Integration Thoroughly

**Test these scenarios in development:**
- [ ] Make a successful payment with test card `4242 4242 4242 4242`
- [ ] Try a declining card: `4000 0000 0000 0002`
- [ ] Test with insufficient funds card: `4000 0000 0000 9995`
- [ ] Verify payment appears in your database
- [ ] Check payment history displays correctly
- [ ] Test receipt email delivery
- [ ] Verify all error messages display properly

### 2. ✅ Complete Stripe Account Setup

**In your Stripe Dashboard:**
- [ ] Go to [https://dashboard.stripe.com/account/onboarding](https://dashboard.stripe.com/account/onboarding)
- [ ] Complete business information
- [ ] Add bank account details (for receiving payments)
- [ ] Verify your identity (may require documents)
- [ ] Enable live mode in Stripe dashboard

### 3. ✅ Database Setup

**Run the SQL script:**
```bash
# Run this in your MySQL database
create_payments_table.sql
```

**Verify table creation:**
```sql
DESCRIBE student_payments;
SELECT COUNT(*) FROM student_payments;
```

### 4. ✅ Security Review

- [ ] Ensure `.env.local` is in your `.gitignore`
- [ ] Never commit secret keys to Git
- [ ] Use HTTPS in production (required by Stripe)
- [ ] Verify API routes are server-side only
- [ ] Check that student authentication is working

---

## 🔄 SWITCHING TO PRODUCTION MODE

### Step 1: Get Your Live API Keys

1. Log in to [Stripe Dashboard](https://dashboard.stripe.com)
2. Click **"Developers"** in the top right
3. Click **"API keys"** in the left sidebar
4. **Toggle from "Test mode" to "Live mode"** at the top
5. Copy your **Live Publishable Key** (starts with `pk_live_`)
6. Copy your **Live Secret Key** (starts with `sk_live_`)

### Step 2: Update Environment Variables

Open `.env.local` and update these lines:

```env
# ========================================
# STRIPE API KEYS - PRODUCTION MODE
# ========================================
# ⚠️ LIVE KEYS - Real money will be charged!

# Publishable Key - Safe to use in frontend/browser
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY_HERE

# Secret Key - KEEP THIS SECURE! Only use on server-side
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY_HERE

# Your production site URL
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Step 3: Update Payment Page

In `pages/student/payments.tsx`, remove or comment out the development warning:

**Find this section (around line 66):**
```tsx
{/* Development Mode Warning */}
<div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
  <div className="flex">
    <div className="flex-shrink-0">
      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    </div>
    <div className="ml-3">
      <p className="text-sm text-yellow-700">
        <strong>Development Mode:</strong> Use test card <code className="bg-yellow-100 px-2 py-1 rounded">4242 4242 4242 4242</code>, any future date, any CVV
      </p>
    </div>
  </div>
</div>
```

**Replace with:**
```tsx
{/* Production Mode - Live Payments */}
<div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4">
  <div className="flex">
    <div className="flex-shrink-0">
      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    </div>
    <div className="ml-3">
      <p className="text-sm text-green-700">
        <strong>Secure Payments:</strong> All transactions are encrypted and processed securely through Stripe.
      </p>
    </div>
  </div>
</div>
```

### Step 4: Restart Your Application

```bash
# Stop your development server (Ctrl+C)
# Then restart it
npm run dev
```

---

## 🧪 TESTING IN PRODUCTION

**After deployment, test with REAL cards:**

⚠️ **WARNING:** These will charge real money!

1. Make a small test payment (e.g., £1.00)
2. Verify it appears in Stripe Dashboard
3. Check it's saved in your database
4. Confirm receipt email is sent
5. Test refund process in Stripe Dashboard

**To refund a payment:**
1. Go to [Stripe Dashboard > Payments](https://dashboard.stripe.com/payments)
2. Find the payment
3. Click "Refund"
4. Confirm refund amount

---

## 🔒 SECURITY BEST PRACTICES

### 1. **Protect Your Secret Keys**
```bash
# Add to .gitignore (if not already there)
.env.local
.env.production
.env
```

### 2. **Use HTTPS in Production**
- Stripe requires HTTPS for live payments
- Use SSL certificate on your domain
- Most hosting providers (Vercel, Netlify, etc.) provide this automatically

### 3. **Implement Rate Limiting**
Consider adding rate limiting to prevent abuse:
```typescript
// Add to your API routes
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
});
```

### 4. **Log All Transactions**
All payments are automatically logged in your database. Monitor for suspicious activity.

### 5. **Enable Stripe Webhooks** (Advanced)
For real-time payment updates, set up webhooks:
- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)

---

## 📊 MONITORING YOUR PAYMENTS

### Stripe Dashboard
- View all payments: [https://dashboard.stripe.com/payments](https://dashboard.stripe.com/payments)
- See failed payments: [https://dashboard.stripe.com/payments?status=failed](https://dashboard.stripe.com/payments?status=failed)
- Monitor disputes: [https://dashboard.stripe.com/disputes](https://dashboard.stripe.com/disputes)

### Your Database
```sql
-- View all payments
SELECT * FROM student_payments ORDER BY created_at DESC;

-- View successful payments
SELECT * FROM student_payments WHERE payment_status = 'succeeded';

-- Total revenue
SELECT SUM(amount) as total_revenue FROM student_payments WHERE payment_status = 'succeeded';

-- Payments by student
SELECT student_name, COUNT(*) as payment_count, SUM(amount) as total_paid 
FROM student_payments 
WHERE payment_status = 'succeeded'
GROUP BY student_id;
```

---

## 🆘 TROUBLESHOOTING

### Issue: "Stripe is not loaded"
**Solution:** Check that your publishable key is correctly set in `.env.local` and restart your server.

### Issue: "Payment failed - Authentication required"
**Solution:** The customer's bank is requiring additional authentication. This is normal for some cards. Stripe handles this automatically.

### Issue: "Invalid API Key"
**Solution:** 
- Verify you're using the correct live key (starts with `sk_live_`)
- Check for extra spaces in `.env.local`
- Restart your application

### Issue: Payments not saving to database
**Solution:**
- Check database connection details in `.env.local`
- Verify the `student_payments` table exists
- Check API route logs for errors

---

## 📞 SUPPORT RESOURCES

- **Stripe Documentation:** [https://stripe.com/docs](https://stripe.com/docs)
- **Stripe Support:** [https://support.stripe.com](https://support.stripe.com)
- **Test Cards:** [https://stripe.com/docs/testing](https://stripe.com/docs/testing)

---

## ✅ PRODUCTION DEPLOYMENT CHECKLIST

Before launching to students:

- [ ] All tests passing in development
- [ ] Live API keys configured
- [ ] Database table created
- [ ] HTTPS enabled on production domain
- [ ] Development warnings removed
- [ ] Test payment made and verified
- [ ] Payment history displaying correctly
- [ ] Receipt emails working
- [ ] Backup of database taken
- [ ] Support contact information added
- [ ] Terms of service updated (if needed)

---

## 🎉 YOU'RE READY!

Once all checkboxes are complete, your payment system is ready for production use!

**Remember:**
- Monitor your Stripe dashboard regularly
- Keep your secret keys secure
- Backup your database regularly
- Test refund process periodically
- Keep Stripe packages updated: `npm update stripe @stripe/stripe-js @stripe/react-stripe-js`

---

**Questions?** Review the inline comments in your code - every file is extensively documented!
