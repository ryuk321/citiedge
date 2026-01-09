# 🎯 STRIPE QUICK REFERENCE CARD

Keep this handy for quick reference!

---

## 🔑 API KEYS

### Current (Test Mode):
```
Publishable: pk_test_51SjOxVP4kiIzf5NE...
Secret: sk_test_51SjOxVP4kiIzf5NE...
```

### When Going Live:
1. Get keys from: https://dashboard.stripe.com/apikeys
2. Toggle to "Live mode" (top-right)
3. Update `.env.local`
4. Restart server

---

## 💳 TEST CARDS

| Card | Result |
|------|--------|
| `4242 4242 4242 4242` | ✅ Success |
| `4000 0000 0000 0002` | ❌ Declined |
| `4000 0000 0000 9995` | ❌ No funds |

**Expiry:** Any future date | **CVV:** Any 3 digits

---

## 📍 IMPORTANT URLS

### Your App:
- **Student Payments:** `/student/payments`
- **Create Invoice:** `/Admin/finance/CreateInvoicePage`

### Stripe Dashboard:
- **Overview:** https://dashboard.stripe.com
- **Payments:** https://dashboard.stripe.com/payments
- **Invoices:** https://dashboard.stripe.com/invoices
- **API Keys:** https://dashboard.stripe.com/apikeys

---

## 🚀 GOING LIVE (3 STEPS)

1. **Get live keys** (pk_live_ & sk_live_)
2. **Update `.env.local`**
3. **Restart server** (`npm run dev`)

✅ **That's it!** No code changes needed.

---

## 📝 WHEN TO USE WHAT

### Payment Intent (Instant):
- Library fines
- Quick fees
- Walk-in payments
- Student ready to pay NOW

### Invoice (Pay Later):
- Tuition bills
- Term fees
- Payment plans
- Need PDF invoice

---

## 🆘 TROUBLESHOOTING

| Error | Fix |
|-------|-----|
| "Stripe not loaded" | Restart server |
| "Invalid API key" | Check keys match mode |
| Email not received | Normal in test mode |
| Payment not saved | Check save-payment API |

---

## 📁 KEY FILES

```
.env.local                                  ← API keys
app/api/stripe/create-payment-intent/      ← Payments
app/api/stripe/create-invoice/             ← Invoices
pages/student/payments.tsx                 ← Student page
pages/Admin/finance/CreateInvoicePage.tsx  ← Admin page
```

---

## 💰 STRIPE FEES

- **UK cards:** 1.4% + 20p
- **International:** 2.9% + 20p
- **No monthly fees**

Example: £100 payment = £1.60 fee

---

## 📚 DOCUMENTATION

- [STRIPE_INTEGRATION_SUMMARY.md](STRIPE_INTEGRATION_SUMMARY.md) - Start here
- [GOING_LIVE_GUIDE.md](GOING_LIVE_GUIDE.md) - Production guide
- [STRIPE_FAQ.md](STRIPE_FAQ.md) - Q&A

---

## ✅ TEST CHECKLIST

- [ ] Create test invoice
- [ ] Pay with test card
- [ ] Check Stripe Dashboard
- [ ] Verify payment saved to database
- [ ] Test declining card
- [ ] View invoice PDF

---

## 🔐 SECURITY REMINDERS

✅ `.env.local` in `.gitignore`  
✅ Never commit secret keys  
✅ Use HTTPS in production  
✅ Secret key server-side only  

---

**Need help?** Check [STRIPE_FAQ.md](STRIPE_FAQ.md) 🚀
