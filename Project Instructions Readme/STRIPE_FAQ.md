# ❓ STRIPE PAYMENTS & INVOICING - FAQ

Common questions about your Stripe integration.

---

## 🔑 API Keys & Environment

### Q: When I go live, do I need to change the API keys?
**A: YES!** You must replace test keys with live keys in `.env.local`:

```env
# Replace these:
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx  # → pk_live_xxx
STRIPE_SECRET_KEY=sk_test_xxx                    # → sk_live_xxx
```

### Q: Do I need to change any code when switching to live mode?
**A: NO!** Just update the environment variables and restart your server. All code automatically uses `process.env` variables.

### Q: Where do I find my live API keys?
**A:** 
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Toggle from "Test mode" to "Live mode" (top-right)
3. Click **Developers** → **API keys**
4. Copy both keys (publishable and secret)

### Q: What's the difference between test and live keys?

| Key Type | Starts With | Purpose | Safe for Frontend? |
|----------|-------------|---------|-------------------|
| Test Publishable | `pk_test_` | Development | ✅ Yes |
| Live Publishable | `pk_live_` | Production | ✅ Yes |
| Test Secret | `sk_test_` | Development | ❌ No, server only |
| Live Secret | `sk_live_` | Production | ❌ No, server only |

---

## 💰 Payments vs Invoices

### Q: What's the difference between payments and invoices?

| Feature | Payment (Payment Intent) | Invoice |
|---------|--------------------------|---------|
| **Process** | Immediate card charge | Email sent, pay later |
| **Payment Page** | Embedded in your site | Stripe hosted page |
| **Email to Student** | Receipt only | Invoice + payment link |
| **Due Date** | Instant | Configurable (e.g., 30 days) |
| **PDF Invoice** | ❌ No | ✅ Yes |
| **Best For** | Quick payments | Billing cycles, term fees |

### Q: When should I use payments vs invoices?

**Use Payments (Payment Intent) for:**
- Library fines
- Quick one-time fees
- Walk-in/immediate payments
- When student is ready to pay NOW

**Use Invoices for:**
- Tuition fees at start of term
- Monthly payment plans
- Bulk billing multiple students
- When you need professional PDF invoice

### Q: Can I use both?
**A: YES!** You can use both systems in the same application. They work independently.

---

## 📧 Email & Notifications

### Q: Will students receive emails in test mode?
**A: NO.** In test mode:
- Emails are simulated but not sent
- Use the `hostedInvoiceUrl` to view invoices
- Receipts are generated but not emailed

### Q: How do I test email delivery?
**A:** 
1. Switch to live mode
2. Create an invoice to YOUR email address
3. Verify you receive the email
4. Then switch back to test mode

### Q: What emails do students receive?

**For Payments:**
- Payment receipt (after successful payment)

**For Invoices:**
- Invoice email with payment link and PDF
- Payment confirmation (after they pay)
- Payment failed notification (if card declines)

### Q: Can I customize the emails?
**A: YES!**
1. Go to Stripe Dashboard → **Settings** → **Emails**
2. Customize templates
3. Add your logo and branding
4. Edit email text

---

## 💳 Payment Methods & Cards

### Q: What test cards can I use?
**A:** Stripe provides test cards:

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | ✅ Success |
| `4000 0000 0000 0002` | ❌ Card declined |
| `4000 0000 0000 9995` | ❌ Insufficient funds |
| `4000 0025 0000 3155` | 🔐 Requires authentication |

Use any future date and any CVV.

### Q: What payment methods are supported?
**A:** Currently:
- ✅ Credit cards (Visa, Mastercard, Amex)
- ✅ Debit cards

To add more payment methods (Apple Pay, Google Pay, bank transfers), see [Stripe Docs](https://docs.stripe.com/payments/payment-methods).

### Q: Do students need a Stripe account?
**A: NO!** Students just need a credit/debit card. No Stripe account required.

---

## 🔒 Security

### Q: Is it safe to store Stripe keys in .env.local?
**A: YES, but:**
- ✅ `.env.local` should be in `.gitignore` (already done)
- ✅ Never commit `.env.local` to Git
- ✅ Secret keys are only used server-side
- ✅ Publishable keys are safe to expose

### Q: Can students see the secret key?
**A: NO!** The secret key is only used in API routes (server-side). Students never see it.

### Q: Do I need HTTPS?
**A: YES, for production.** Stripe requires HTTPS in live mode. Test mode works with HTTP (localhost).

---

## 💾 Database & Data

### Q: Where are payments stored?
**A:** Two places:
1. **Stripe Dashboard:** All payment data is stored by Stripe
2. **Your Database:** Via the `save-payment` API route

### Q: What if a payment succeeds in Stripe but fails to save to my database?
**A:** The payment still goes through. You can:
1. View it in Stripe Dashboard
2. Use webhooks to retry saving to database
3. Manually reconcile from Stripe Dashboard

### Q: Can I see payment history?
**A: YES!**
- **Stripe Dashboard:** [Payments page](https://dashboard.stripe.com/payments)
- **Your App:** Payment history component (if implemented)
- **Export:** Download CSV from Stripe Dashboard

---

## 🧪 Testing

### Q: How do I test the integration?
**A:**
1. **Test Payments:**
   ```
   Card: 4242 4242 4242 4242
   Expiry: 12/25 (any future date)
   CVV: 123 (any 3 digits)
   ```

2. **Test Invoices:**
   - Create invoice to your email
   - Open the `hostedInvoiceUrl`
   - Pay with test card
   - Verify invoice status changes to "paid"

3. **Test Failures:**
   - Use declining card: `4000 0000 0000 0002`
   - Verify error messages display correctly

### Q: Where can I see test data?
**A:** Stripe Dashboard in **Test Mode**:
- [Test Payments](https://dashboard.stripe.com/test/payments)
- [Test Invoices](https://dashboard.stripe.com/test/invoices)
- [Test Customers](https://dashboard.stripe.com/test/customers)

---

## 🚀 Going Live

### Q: What do I need to do before going live?
**A: Complete Stripe Onboarding:**
1. Business information
2. Bank account (to receive money)
3. Identity verification
4. Tax information

Then update API keys in `.env.local` and restart server.

### Q: Can I test with real cards before going fully live?
**A: YES!**
1. Switch to live mode
2. Use your personal card to test
3. Test with small amounts (£1.00)
4. Verify everything works
5. Then go fully live

### Q: What happens to test data when I go live?
**A:** Test and live data are completely separate:
- Test invoices/payments remain in test mode
- Live mode starts fresh with no data
- You can switch between modes anytime

---

## 🔄 Refunds & Cancellations

### Q: How do I refund a payment?
**A:**
1. Go to [Stripe Dashboard → Payments](https://dashboard.stripe.com/payments)
2. Find the payment
3. Click "Refund"
4. Enter amount (full or partial)
5. Confirm

### Q: Can I cancel an invoice?
**A: YES!**
1. Go to [Stripe Dashboard → Invoices](https://dashboard.stripe.com/invoices)
2. Find the invoice
3. Click "Void" (if unpaid)

**Note:** You can only void unpaid invoices. Paid invoices need refunds.

---

## 💡 Troubleshooting

### Q: "Stripe is not loaded" error
**A:**
1. Check `.env.local` has correct publishable key
2. Verify no spaces before/after the key
3. Restart your development server
4. Clear browser cache

### Q: "Invalid API key provided"
**A:**
1. Verify keys match the mode (test vs live)
2. Check for spaces in `.env.local`
3. Ensure you copied the complete key
4. Restart server after changing `.env.local`

### Q: Invoice email not received
**A:**
- **Test Mode:** Emails aren't sent - use `hostedInvoiceUrl` instead
- **Live Mode:** Check spam folder, verify student email is correct

### Q: Payment succeeds but shows as failed
**A:**
1. Check Stripe Dashboard to confirm status
2. Verify webhook configuration (if using)
3. Check browser console for errors
4. Check server logs

---

## 📊 Reporting & Analytics

### Q: Where can I see financial reports?
**A:** Stripe Dashboard:
- [Reports](https://dashboard.stripe.com/reports)
- [Balance](https://dashboard.stripe.com/balance)
- [Payouts](https://dashboard.stripe.com/payouts)

### Q: Can I export payment data?
**A: YES!**
1. Go to [Payments](https://dashboard.stripe.com/payments)
2. Filter by date range
3. Click "Export"
4. Choose CSV or Excel format

---

## 🌍 International

### Q: What currencies are supported?
**A:** Currently set to GBP (£). To add more currencies:
1. Update API calls to accept currency parameter
2. Change `currency: 'GBP'` to desired currency code
3. Supported: USD, EUR, GBP, CAD, AUD, and [135+ more](https://stripe.com/docs/currencies)

### Q: Can I accept payments from international students?
**A: YES!** Stripe automatically handles:
- International cards
- Currency conversion
- Regional payment methods

---

## 📞 Support & Resources

### Q: Where can I get help?

**Stripe Resources:**
- [Documentation](https://docs.stripe.com)
- [Support](https://support.stripe.com)
- [Community Forum](https://community.stripe.com)

**Your Implementation:**
- Check [STRIPE_INVOICE_SETUP.md](STRIPE_INVOICE_SETUP.md)
- Check [GOING_LIVE_GUIDE.md](GOING_LIVE_GUIDE.md)
- Check [STRIPE_PRODUCTION_GUIDE.md](STRIPE_PRODUCTION_GUIDE.md)

### Q: What's Stripe's fee?
**A:** In UK:
- **UK cards:** 1.4% + 20p per transaction
- **International cards:** 2.9% + 20p per transaction
- **No monthly fees** - only pay per transaction

Check current pricing: [https://stripe.com/gb/pricing](https://stripe.com/gb/pricing)

---

## 🎯 Quick Reference

### Files Modified in Your Project:

| File | Purpose |
|------|---------|
| `app/api/stripe/create-payment-intent/route.ts` | Process immediate payments |
| `app/api/stripe/create-invoice/route.ts` | Create and send invoices |
| `app/api/stripe/save-payment/route.ts` | Save payment to database |
| `pages/student/payments.tsx` | Student payment page |
| `components/student/InvoiceForm.tsx` | Invoice creation form |
| `.env.local` | Environment variables (API keys) |

### Key Environment Variables:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx  # Frontend
STRIPE_SECRET_KEY=sk_test_xxx                    # Backend
NEXT_PUBLIC_SITE_URL=http://localhost:3000       # Your domain
```

### Stripe Dashboard Links:

- **Overview:** [https://dashboard.stripe.com](https://dashboard.stripe.com)
- **Payments:** [https://dashboard.stripe.com/payments](https://dashboard.stripe.com/payments)
- **Invoices:** [https://dashboard.stripe.com/invoices](https://dashboard.stripe.com/invoices)
- **API Keys:** [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)

---

**Still have questions?** Check the Stripe documentation or test in development mode first! 🚀
