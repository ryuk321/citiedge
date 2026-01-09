# 🎨 STRIPE PAYMENT FLOW - VISUAL GUIDE

This document explains how the payment system works with clear diagrams and examples.

---

## 📊 SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                     CITIEDGE STUDENT PORTAL                      │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │
                    ┌────────────▼───────────┐
                    │  Student Clicks        │
                    │  "Payments" Tab        │
                    └────────────┬───────────┘
                                 │
                                 │
        ┌────────────────────────▼─────────────────────────┐
        │         pages/student/payments.tsx                │
        │  ┌─────────────────────────────────────────────┐ │
        │  │  Payment Form                               │ │
        │  │  - Select payment type                      │ │
        │  │  - Enter amount                             │ │
        │  │  - Enter card details (Stripe Elements)     │ │
        │  └─────────────────────────────────────────────┘ │
        └──────────────────────┬───────────────────────────┘
                               │
                               │ Student clicks "Pay"
                               │
        ┌──────────────────────▼───────────────────────────┐
        │  STEP 1: Create Payment Intent                   │
        │  POST /api/stripe/create-payment-intent          │
        │                                                   │
        │  Sends: {amount, studentId, paymentType, etc}    │
        └──────────────────────┬───────────────────────────┘
                               │
                               │
        ┌──────────────────────▼───────────────────────────┐
        │           Stripe API (Server-Side)               │
        │                                                   │
        │  Creates PaymentIntent with Stripe               │
        │  Returns: clientSecret                           │
        └──────────────────────┬───────────────────────────┘
                               │
                               │ Returns clientSecret
                               │
        ┌──────────────────────▼───────────────────────────┐
        │  STEP 2: Confirm Payment (Frontend)              │
        │                                                   │
        │  stripe.confirmCardPayment(clientSecret, {...})  │
        │  - Sends card data directly to Stripe            │
        │  - Card never touches your server! 🔒            │
        └──────────────────────┬───────────────────────────┘
                               │
                               │
        ┌──────────────────────▼───────────────────────────┐
        │         Stripe Payment Processing                │
        │                                                   │
        │  - Validates card                                │
        │  - Checks funds                                  │
        │  - Processes payment                             │
        │  - Returns result                                │
        └──────────────────────┬───────────────────────────┘
                               │
                               │ Payment succeeds!
                               │
        ┌──────────────────────▼───────────────────────────┐
        │  STEP 3: Save to Database                        │
        │  POST /api/stripe/save-payment                   │
        │                                                   │
        │  Saves: {studentId, amount, status, etc}         │
        └──────────────────────┬───────────────────────────┘
                               │
                               │
        ┌──────────────────────▼───────────────────────────┐
        │         MySQL Database                           │
        │  student_payments table                          │
        │                                                   │
        │  INSERT INTO student_payments (...)              │
        └──────────────────────┬───────────────────────────┘
                               │
                               │
        ┌──────────────────────▼───────────────────────────┐
        │  STEP 4: Display Success                         │
        │                                                   │
        │  - Show success message                          │
        │  - Refresh payment history                       │
        │  - Clear form                                    │
        │  - Send receipt email (Stripe automatic)         │
        └──────────────────────────────────────────────────┘
```

---

## 🔄 DATA FLOW DIAGRAM

```
Student Browser              Your Server              Stripe Server         Database
     │                            │                         │                  │
     │ 1. Fill payment form       │                         │                  │
     │────────────────────────────│                         │                  │
     │                            │                         │                  │
     │ 2. Submit payment          │                         │                  │
     │───────────────────────────>│                         │                  │
     │                            │                         │                  │
     │                            │ 3. Create PaymentIntent │                  │
     │                            │────────────────────────>│                  │
     │                            │                         │                  │
     │                            │ 4. Return clientSecret  │                  │
     │                            │<────────────────────────│                  │
     │                            │                         │                  │
     │ 5. Return clientSecret     │                         │                  │
     │<───────────────────────────│                         │                  │
     │                            │                         │                  │
     │ 6. Confirm payment with card details                 │                  │
     │──────────────────────────────────────────────────────>│                  │
     │              (Card data goes directly to Stripe!)    │                  │
     │                            │                         │                  │
     │                            │ 7. Process payment      │                  │
     │                            │         (internally)    │                  │
     │                            │                         │                  │
     │ 8. Payment success!        │                         │                  │
     │<──────────────────────────────────────────────────────│                  │
     │                            │                         │                  │
     │ 9. Save payment record     │                         │                  │
     │───────────────────────────>│                         │                  │
     │                            │                         │                  │
     │                            │ 10. INSERT payment      │                  │
     │                            │────────────────────────────────────────────>│
     │                            │                         │                  │
     │                            │ 11. Confirm saved       │                  │
     │                            │<────────────────────────────────────────────│
     │                            │                         │                  │
     │ 12. Success + payment ID   │                         │                  │
     │<───────────────────────────│                         │                  │
     │                            │                         │                  │
     │ 13. Display success        │                         │                  │
     │ 14. Show in history        │                         │                  │
     │                            │                         │                  │
```

---

## 🗂️ FILE STRUCTURE & PURPOSE

```
citiedg-portals/
│
├── .env.local                              🔑 API Keys (NEVER commit to Git!)
│   ├── NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  → Used in browser (safe)
│   └── STRIPE_SECRET_KEY                   → Server-only (SECRET!)
│
├── create_payments_table.sql               💾 Database schema
│   └── Creates: student_payments table
│
├── app/api/stripe/                         🌐 Backend API Routes
│   │
│   ├── create-payment-intent/              Step 1: Initialize payment
│   │   └── route.ts
│   │       ├── Receives: {amount, studentId, paymentType}
│   │       ├── Creates: Stripe PaymentIntent
│   │       └── Returns: clientSecret
│   │
│   ├── save-payment/                       Step 2: Save to database
│   │   └── route.ts
│   │       ├── Receives: {payment details}
│   │       ├── Inserts: Into student_payments table
│   │       └── Returns: success confirmation
│   │
│   └── payment-history/                    Step 3: Retrieve history
│       └── route.ts
│           ├── Receives: studentId
│           ├── Queries: student_payments table
│           └── Returns: All student payments
│
└── pages/student/
    │
    ├── portal.tsx                          📱 Main portal (with Payments tab)
    │   └── Shows iframe of payments.tsx
    │
    └── payments.tsx                        💳 Payment form & history
        ├── PaymentForm component
        │   ├── Amount input
        │   ├── Payment type selector
        │   ├── Card details (Stripe Elements)
        │   └── Submit button
        │
        └── PaymentHistory component
            ├── Fetches payment history
            ├── Displays in table
            └── Shows receipt links
```

---

## 💳 STRIPE COMPONENTS EXPLAINED

### 1. Stripe Elements (Card Input)

```tsx
import { CardElement } from '@stripe/react-stripe-js';

<CardElement />
```

**What it does:**
- Creates a secure card input field
- Handles validation automatically
- Sends card data directly to Stripe (never to your server!)
- Supports all major card brands
- Mobile-responsive
- PCI-compliant

**What it looks like:**
```
┌───────────────────────────────────────────┐
│ Card Details                              │
├───────────────────────────────────────────┤
│ 4242 4242 4242 4242                       │
│ MM/YY    CVC    ZIP                       │
│ 12/25    123    12345                     │
└───────────────────────────────────────────┘
```

### 2. Payment Intent

```typescript
const paymentIntent = await stripe.paymentIntents.create({
  amount: 10000,  // $100.00 in cents
  currency: 'gbp',
  metadata: {...},
});
```

**What it does:**
- Tracks the payment from start to finish
- Handles authentication (3D Secure)
- Prevents duplicate charges
- Enables webhooks for status updates

**Lifecycle:**
```
Created → Requires Confirmation → Processing → Succeeded
   ↓              ↓                    ↓           ↓
  💵            💳                  ⏳         ✅
```

---

## 🔐 SECURITY FEATURES

### 1. API Key Separation

```
Frontend (Browser):
├── NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
└── Can only create PaymentIntents (can't charge!)

Backend (Server):
├── STRIPE_SECRET_KEY
└── Can charge cards, create customers, refunds, etc.
```

### 2. PCI Compliance

```
❌ WRONG (Never do this):
Browser → Send card to your server → Send to Stripe

✅ CORRECT (What we built):
Browser → Send card directly to Stripe → Stripe confirms → Your server notified
```

### 3. Environment Variables

```bash
# .env.local is in .gitignore
# Keys never committed to Git
# Server-only variables (STRIPE_SECRET_KEY) not accessible in browser
```

---

## 💾 DATABASE SCHEMA

```sql
student_payments table:
┌────────────────────────────┬──────────────┬─────────────┐
│ Column                     │ Type         │ Purpose     │
├────────────────────────────┼──────────────┼─────────────┤
│ id                         │ INT          │ Primary key │
│ student_id                 │ VARCHAR(50)  │ Who paid    │
│ student_name               │ VARCHAR(255) │ Name        │
│ student_email              │ VARCHAR(255) │ Email       │
│ payment_type               │ VARCHAR(100) │ What for    │
│ amount                     │ DECIMAL      │ How much    │
│ currency                   │ VARCHAR(3)   │ GBP/USD/EUR │
│ stripe_payment_intent_id   │ VARCHAR(255) │ Stripe ref  │
│ stripe_charge_id           │ VARCHAR(255) │ Stripe ref  │
│ payment_status             │ VARCHAR(50)  │ Status      │
│ description                │ TEXT         │ Notes       │
│ receipt_url                │ TEXT         │ Stripe link │
│ created_at                 │ TIMESTAMP    │ When        │
│ updated_at                 │ TIMESTAMP    │ Last update │
└────────────────────────────┴──────────────┴─────────────┘
```

**Example record:**
```json
{
  "id": 1,
  "student_id": "ST001",
  "student_name": "John Doe",
  "student_email": "john.doe@example.com",
  "payment_type": "Tuition Fee",
  "amount": 1500.00,
  "currency": "GBP",
  "stripe_payment_intent_id": "pi_3Abc123...",
  "stripe_charge_id": "ch_3Abc123...",
  "payment_status": "succeeded",
  "description": "Semester 1 Tuition",
  "receipt_url": "https://pay.stripe.com/receipts/...",
  "created_at": "2025-12-28 10:30:00",
  "updated_at": "2025-12-28 10:30:00"
}
```

---

## 🧪 TEST CARD SCENARIOS

```
✅ SUCCESSFUL PAYMENT
Card: 4242 4242 4242 4242
Result: Payment succeeds immediately
Use case: Test happy path

❌ CARD DECLINED
Card: 4000 0000 0000 0002
Result: Card declined by issuer
Use case: Test error handling

💰 INSUFFICIENT FUNDS
Card: 4000 0000 0000 9995
Result: Insufficient funds error
Use case: Test specific error messages

🔐 REQUIRES AUTHENTICATION
Card: 4000 0025 0000 3155
Result: Opens 3D Secure modal
Use case: Test authentication flow

⚠️ PROCESSING ERROR
Card: 4000 0000 0000 0119
Result: Processing error
Use case: Test retry logic
```

[Full list of test cards](https://stripe.com/docs/testing)

---

## 📱 USER EXPERIENCE FLOW

```
1. Student logs into portal
   │
   ├─> Clicks "Payments" tab
   │
2. Payment form loads
   │
   ├─> Selects payment type (dropdown)
   │   Options: Tuition, Fees, Library, etc.
   │
   ├─> Enters amount
   │   Format: 100.00
   │
   ├─> (Optional) Adds description
   │   Example: "Semester 1 Tuition"
   │
   ├─> Enters card details
   │   Card, Expiry, CVC, ZIP
   │
3. Clicks "Pay £100.00"
   │
   ├─> Button shows "Processing..."
   │   (Disabled during payment)
   │
4. Payment processes
   │
   ├─> If successful:
   │   ├─> ✅ Green success message
   │   ├─> Form clears automatically
   │   ├─> Payment history refreshes
   │   └─> Receipt email sent
   │
   └─> If failed:
       ├─> ❌ Red error message
       ├─> Form stays filled
       └─> Can retry payment
```

---

## 🎯 KEY FEATURES SUMMARY

### ✅ What Works

- **Secure Payments**: PCI-compliant via Stripe
- **Real-time Processing**: Instant payment confirmation
- **Database Storage**: All transactions logged
- **Payment History**: Students can view past payments
- **Receipt Emails**: Automatic from Stripe
- **Multiple Payment Types**: Tuition, fees, fines, etc.
- **Variable Amounts**: Any amount can be paid
- **Test Mode**: Safe development environment
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Works on mobile and desktop

### 🔮 Future Enhancements (Optional)

- **Refund System**: Admin interface for refunds
- **Payment Plans**: Installment payments
- **Webhooks**: Real-time status updates
- **Multiple Currencies**: Auto-conversion
- **Saved Cards**: For returning students
- **Payment Reminders**: Automated emails
- **Export Receipts**: PDF generation
- **Analytics Dashboard**: Payment reports

---

## 🎓 LEARNING RESOURCES

### For Understanding the Code

1. **Stripe Documentation**: [stripe.com/docs](https://stripe.com/docs)
2. **Next.js API Routes**: [nextjs.org/docs/api-routes](https://nextjs.org/docs/api-routes)
3. **React Hooks**: [react.dev/reference/react](https://react.dev/reference/react)

### For Testing

1. **Test Cards**: [stripe.com/docs/testing](https://stripe.com/docs/testing)
2. **Stripe Dashboard**: [dashboard.stripe.com](https://dashboard.stripe.com)

---

## 💡 TIPS & TRICKS

### Development
- Use test mode to avoid real charges
- Check Stripe dashboard for payment logs
- Use browser DevTools to debug

### Production
- Always use HTTPS
- Monitor failed payments
- Set up email alerts in Stripe
- Keep audit logs

### Performance
- Payments are processed asynchronously
- Database writes are optimized
- Stripe handles scaling automatically

---

**This visual guide complements the Quick Start and Production guides!**
