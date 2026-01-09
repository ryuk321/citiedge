# 🎨 COMPLETE PAYMENT & INVOICE SYSTEM - VISUAL GUIDE

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CITIEDGE PAYMENT SYSTEM                          │
│                                                                     │
│  ┌──────────────────┐              ┌──────────────────┐           │
│  │  INSTANT PAYMENT │              │     INVOICING    │           │
│  │   (Payment Now)  │              │   (Pay Later)    │           │
│  └──────────────────┘              └──────────────────┘           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 💳 INSTANT PAYMENT FLOW

### Student View:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Student visits: /student/payments                         │
│    ↓                                                         │
│ 2. Fills out payment form:                                  │
│    • Payment Type: Tuition Fee                              │
│    • Amount: £5000                                          │
│    • Card Details: 4242 4242 4242 4242                      │
│    ↓                                                         │
│ 3. Clicks "Process Payment"                                 │
│    ↓                                                         │
│ 4. Payment processed instantly                              │
│    ↓                                                         │
│ 5. ✅ Success! Payment complete                             │
│    • Receipt displayed                                      │
│    • Payment saved to database                              │
│    • Receipt email sent (in live mode)                      │
└─────────────────────────────────────────────────────────────┘
```

### Technical Flow:

```
Frontend                  API Route                 Stripe API
───────                  ────────                  ──────────

payments.tsx
    │
    │ POST /api/stripe/create-payment-intent
    ├───────────────────────>│
    │                        │
    │                        │ Create PaymentIntent
    │                        ├────────────────────>│
    │                        │                     │
    │                        │ Return client_secret│
    │ client_secret          │<────────────────────┘
    │<───────────────────────┤
    │
    │ confirmCardPayment(client_secret, card)
    ├──────────────────────────────────────────────>│
    │                                                │
    │                           Payment Success ✅   │
    │<───────────────────────────────────────────────┘
    │
    │ POST /api/stripe/save-payment
    ├───────────────────────>│
    │                        │
    │                        │ Save to Database
    │                        ├────────> MySQL
    │ Payment saved          │
    │<───────────────────────┘
```

---

## 📧 INVOICE FLOW

### Admin/Staff View:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Admin visits: /admin/finance/create-invoice              │
│    ↓                                                         │
│ 2. Fills out invoice form:                                  │
│    • Student: John Doe (john@example.com)                   │
│    • Items:                                                 │
│      - Tuition Fee: £5000                                   │
│      - Lab Fee: £150                                        │
│    • Due in 30 days                                         │
│    ↓                                                         │
│ 3. Clicks "Create and Send Invoice"                         │
│    ↓                                                         │
│ 4. ✅ Invoice created and sent!                             │
│    • Invoice number: INV-001                                │
│    • PDF available                                          │
│    • Email sent to student                                  │
└─────────────────────────────────────────────────────────────┘
```

### Student View:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Student receives email:                                  │
│    ┌─────────────────────────────────────────┐             │
│    │ 📧 Invoice from CITIEDGE College        │             │
│    │                                         │             │
│    │ Dear John,                              │             │
│    │                                         │             │
│    │ You have a new invoice:                 │             │
│    │ Invoice #INV-001                        │             │
│    │ Amount: £5,150.00                       │             │
│    │ Due: February 6, 2026                   │             │
│    │                                         │             │
│    │ [View and Pay Invoice]  [Download PDF]  │             │
│    └─────────────────────────────────────────┘             │
│    ↓                                                         │
│ 2. Clicks "View and Pay Invoice"                            │
│    ↓                                                         │
│ 3. Opens Stripe hosted invoice page                         │
│    • Professional invoice layout                            │
│    • Itemized charges                                       │
│    • Payment form                                           │
│    ↓                                                         │
│ 4. Enters card details and pays                             │
│    ↓                                                         │
│ 5. ✅ Payment confirmed!                                    │
│    • Confirmation email sent                                │
│    • Invoice marked as PAID                                 │
└─────────────────────────────────────────────────────────────┘
```

### Technical Flow:

```
Admin UI              API Route              Stripe API         Student
────────             ────────              ──────────         ───────

InvoiceForm
    │
    │ POST /api/stripe/create-invoice
    ├───────────────────>│
    │                    │
    │                    │ 1. Create Customer
    │                    ├────────────────>│
    │                    │                 │
    │                    │ 2. Create Invoice
    │                    ├────────────────>│
    │                    │                 │
    │                    │ 3. Add Invoice Items
    │                    ├────────────────>│
    │                    │                 │
    │                    │ 4. Finalize Invoice
    │                    ├────────────────>│
    │                    │                 │
    │                    │ 5. Send Invoice Email
    │                    ├────────────────>│───────> 📧
    │                    │                 │
    │                    │ Invoice Data    │
    │ Invoice Result     │<────────────────┘
    │<───────────────────┤
    │
    │ Display success:
    │ • Invoice #INV-001
    │ • PDF link
    │ • Hosted invoice URL
```

---

## 🔄 SWITCHING ENVIRONMENTS

### Development (Test Mode):

```
┌─────────────────────────────────────────────────┐
│              TEST MODE (Current)                │
├─────────────────────────────────────────────────┤
│                                                 │
│  API Keys:                                      │
│  • pk_test_51SjOxVP4kiIzf5NE...               │
│  • sk_test_51SjOxVP4kiIzf5NE...               │
│                                                 │
│  Test Cards:                                    │
│  • 4242 4242 4242 4242 (Success)               │
│  • 4000 0000 0000 0002 (Decline)               │
│                                                 │
│  Emails:                                        │
│  • NOT sent (simulated only)                    │
│                                                 │
│  Money:                                         │
│  • NO real money charged                        │
│                                                 │
│  Dashboard:                                     │
│  • View in Stripe Test Mode                     │
└─────────────────────────────────────────────────┘
```

### Production (Live Mode):

```
┌─────────────────────────────────────────────────┐
│               LIVE MODE (Production)            │
├─────────────────────────────────────────────────┤
│                                                 │
│  API Keys:                                      │
│  • pk_live_YOUR_KEY_HERE                       │
│  • sk_live_YOUR_KEY_HERE                       │
│                                                 │
│  Cards:                                         │
│  • REAL credit/debit cards only                 │
│  • Test cards will NOT work                     │
│                                                 │
│  Emails:                                        │
│  • ✅ SENT to real email addresses              │
│                                                 │
│  Money:                                         │
│  • ⚠️ REAL MONEY is charged!                   │
│                                                 │
│  Dashboard:                                     │
│  • View in Stripe Live Mode                     │
└─────────────────────────────────────────────────┘
```

### How to Switch:

```
┌───────────────────────────────────────────────────────┐
│  STEP 1: Update .env.local                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                       │
│  # Replace test keys:                                 │
│  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx      │
│  STRIPE_SECRET_KEY=sk_live_xxx                       │
│                                                       │
├───────────────────────────────────────────────────────┤
│  STEP 2: Restart Server                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                       │
│  npm run dev                                          │
│                                                       │
├───────────────────────────────────────────────────────┤
│  STEP 3: Test with Real Card                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                       │
│  Use personal card with small amount (£1)            │
│                                                       │
├───────────────────────────────────────────────────────┤
│  STEP 4: ✅ GO LIVE!                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                       │
│  No code changes needed!                             │
│                                                       │
└───────────────────────────────────────────────────────┘
```

---

## 📁 File Structure

```
citiedg-portals/
│
├── .env.local  ← 🔑 API KEYS STORED HERE
│   ├── NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
│   └── STRIPE_SECRET_KEY
│
├── app/api/stripe/
│   ├── create-payment-intent/
│   │   └── route.ts  ← 💳 Instant payments
│   ├── create-invoice/
│   │   └── route.ts  ← 📧 Invoice creation
│   └── save-payment/
│       └── route.ts  ← 💾 Save to database
│
├── pages/
│   ├── student/
│   │   └── payments.tsx  ← 👨‍🎓 Student payment page
│   └── Admin/finance/
│       └── CreateInvoicePage.tsx  ← 👔 Admin invoice page
│
└── components/student/
    └── InvoiceForm.tsx  ← 📝 Invoice form component
```

---

## 🎯 Decision Tree: Payment vs Invoice?

```
                    Need to charge student?
                            │
              ┌─────────────┴─────────────┐
              │                           │
        Pay NOW?                     Pay LATER?
              │                           │
    ┌─────────┴─────────┐         ┌─────┴─────┐
    │                   │         │           │
Student      Student    │    Send invoice   Need
present?     online?    │    via email?     PDF?
    │            │      │         │           │
   Yes          Yes     No       Yes         Yes
    │            │      │         │           │
    ▼            ▼      ▼         ▼           ▼
┌────────┐  ┌────────┐  │  ┌──────────┐  ┌──────────┐
│ PAYMENT│  │ PAYMENT│  │  │ INVOICE  │  │ INVOICE  │
│ INTENT │  │ INTENT │  │  │ SYSTEM   │  │ SYSTEM   │
└────────┘  └────────┘  │  └──────────┘  └──────────┘
                        │
                  Check admin
                    portal
```

---

## 💡 Quick Reference

### When to Use Each:

| Scenario | Use |
|----------|-----|
| Library fine (£5) | Payment Intent |
| Application fee (£50) | Payment Intent |
| Walk-in student payment | Payment Intent |
| **Term tuition bill (£5000)** | **Invoice** |
| **Monthly payment plan** | **Invoice** |
| **Formal billing required** | **Invoice** |

### Key Benefits:

#### Payment Intent (Instant):
✅ Immediate payment  
✅ Student completes transaction now  
✅ Embedded in your website  
✅ Great for small/quick payments  

#### Invoice (Deferred):
✅ Professional PDF invoice  
✅ Email with payment instructions  
✅ Student can pay anytime before due date  
✅ Payment tracking in Stripe  
✅ Great for larger amounts  

---

## 🔗 Important Links

### Your Application:
- **Student Payment Page:** `/pages/student/payments.tsx`
- **Admin Invoice Page:** `/pages/Admin/finance/CreateInvoicePage.tsx`
- **Environment Config:** `/.env.local`

### Stripe Dashboard:
- **Overview:** https://dashboard.stripe.com
- **Payments:** https://dashboard.stripe.com/payments
- **Invoices:** https://dashboard.stripe.com/invoices
- **API Keys:** https://dashboard.stripe.com/apikeys
- **Test Cards:** https://docs.stripe.com/testing

### Documentation:
- [STRIPE_INVOICE_SETUP.md](STRIPE_INVOICE_SETUP.md) - Invoice setup guide
- [GOING_LIVE_GUIDE.md](GOING_LIVE_GUIDE.md) - Production deployment
- [STRIPE_FAQ.md](STRIPE_FAQ.md) - Common questions

---

## ✅ Quick Checklist

### Development (Test Mode):
- [x] API keys configured in `.env.local`
- [x] Payment page working
- [x] Invoice creation working
- [x] Test payments with `4242 4242 4242 4242`
- [x] View invoices via hosted URL
- [x] Database saves payments correctly

### Going Live:
- [ ] Complete Stripe account verification
- [ ] Get live API keys (pk_live_ and sk_live_)
- [ ] Update `.env.local` with live keys
- [ ] Restart server
- [ ] Test with real card (small amount)
- [ ] Configure webhook (optional but recommended)
- [ ] Switch to HTTPS in production
- [ ] Monitor Stripe Dashboard

---

**🎉 You're all set!** Both payment and invoice systems are fully integrated and ready to use!

**Remember:** Just update the API keys in `.env.local` when going live - no code changes needed! 🚀
