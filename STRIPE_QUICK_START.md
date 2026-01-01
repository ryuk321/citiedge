# 🎯 STRIPE PAYMENTS - QUICK START GUIDE

## What I've Created For You

Your Stripe payment system is now ready! Here's what's been set up:

### ✅ Files Created:

1. **`.env.local`** - Your Stripe API keys (TEST MODE - safe to use!)
2. **`create_payments_table.sql`** - Database table for storing payments
3. **`app/api/stripe/create-payment-intent/route.ts`** - Creates payment intents
4. **`app/api/stripe/save-payment/route.ts`** - Saves payments to database
5. **`app/api/stripe/payment-history/route.ts`** - Retrieves payment history
6. **`pages/student/payments.tsx`** - Payment form and history page
7. **`STRIPE_PRODUCTION_GUIDE.md`** - Complete guide for going live

### ✅ Features:

- 💳 Secure payment processing via Stripe
- 📊 Payment history tracking
- 💾 Database storage of all transactions
- 📧 Automatic receipt emails
- 🔒 PCI-compliant (Stripe handles card data)
- 📱 Responsive design

---

## 🚀 GETTING STARTED (3 Steps)

### Step 1: Install Missing Package

Run this command in your terminal:

```bash
npm install mysql2 @stripe/react-stripe-js
```

### Step 2: Create Database Table

1. Open your MySQL client (phpMyAdmin, MySQL Workbench, etc.)
2. Select your database: `citiedge_portal`
3. Run the SQL file: `create_payments_table.sql`

Or run this command:
```bash
mysql -u citiedge_portal -p citiedge_portal < create_payments_table.sql
```

### Step 3: Restart Your Development Server

```bash
# Press Ctrl+C to stop current server
# Then start it again:
npm run dev
```

---

## 🎮 HOW TO TEST

### 1. Navigate to Payments Page

- Go to: `http://localhost:3000/student/portal`
- Click the **"Payments"** tab
- Or directly visit: `http://localhost:3000/student/payments`

### 2. Use Test Cards

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/25)
- CVV: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

**Declined Card:**
- Card: `4000 0000 0000 0002`

**Insufficient Funds:**
- Card: `4000 0000 0000 9995`

[More test cards](https://stripe.com/docs/testing)

### 3. Make a Test Payment

1. Select payment type (e.g., "Tuition Fee")
2. Enter amount (e.g., 100.00)
3. Add description (optional)
4. Enter test card details
5. Click "Pay £100.00"
6. Payment should succeed!
7. Check payment history below the form

---

## 🔍 VERIFY EVERYTHING WORKS

### Check Stripe Dashboard
1. Go to: [https://dashboard.stripe.com/test/payments](https://dashboard.stripe.com/test/payments)
2. You should see your test payment

### Check Your Database
```sql
SELECT * FROM student_payments ORDER BY created_at DESC;
```

You should see the payment record!

### Check Receipt Email
Check the email address you used - Stripe sends a receipt automatically!

---

## 📁 CODE STRUCTURE

```
citiedg-portals/
├── .env.local                          # 🔑 Your Stripe API keys
├── create_payments_table.sql           # 💾 Database setup
├── app/api/stripe/
│   ├── create-payment-intent/route.ts  # Creates payment
│   ├── save-payment/route.ts           # Saves to database
│   └── payment-history/route.ts        # Gets payment history
└── pages/student/
    ├── portal.tsx                      # ✅ Updated with Payments tab
    └── payments.tsx                    # 💳 Payment page
```

---

## 💡 UNDERSTANDING THE CODE

### How It Works (Simple!)

1. **Student fills form** → Amount, payment type, card details
2. **Frontend calls API** → `/api/stripe/create-payment-intent`
3. **Server creates PaymentIntent** → Stripe prepares to charge
4. **Frontend confirms payment** → Using card details
5. **Stripe processes payment** → Real-time authorization
6. **Save to database** → `/api/stripe/save-payment`
7. **Show success message** → Payment complete!

### Key Features Explained

**🔒 Security:**
- Secret key never exposed to browser
- Card details sent directly to Stripe (not your server)
- PCI compliance handled by Stripe

**💾 Database:**
- All payments logged automatically
- Stripe IDs stored for reference
- Payment status tracked (pending, succeeded, failed)

**📧 Receipts:**
- Automatically sent by Stripe
- Includes payment details
- Professional branded emails

---

## 🎓 STUDENT INFO (Currently Hardcoded)

The current implementation uses test student data:

```typescript
const studentInfo = {
  id: 'ST001',
  name: 'John Doe',
  email: 'john.doe@example.com',
};
```

**To use real student data:**
1. Replace these values with actual session/auth data
2. Get student info from your authentication system
3. Update in both `payments.tsx` and API routes

---

## 💰 PAYMENT TYPES AVAILABLE

- Tuition Fee
- Registration Fee
- Exam Fee
- Library Fine
- Lab Fee
- Other Fee

**To add more types:** Edit the `<select>` dropdown in [pages/student/payments.tsx](pages/student/payments.tsx#L213)

---

## 🛠 COMMON CUSTOMIZATIONS

### Change Currency from GBP to USD

**In `.env.local`:** (No changes needed)

**In `pages/student/payments.tsx` (line 133):**
```typescript
currency: 'USD', // Change from 'GBP'
```

**In display text (line 250):**
```typescript
{isProcessing ? 'Processing...' : `Pay $${amount || '0.00'}`} // Change £ to $
```

### Change Amount Limits

**In `pages/student/payments.tsx` (line 221):**
```typescript
<input
  type="number"
  step="0.01"
  min="0.01"      // Minimum payment
  max="10000.00"  // Add maximum limit
  // ...
/>
```

### Add Student ID Requirement

Replace hardcoded student info with auth:
```typescript
// Get from your auth system
import { useAuth } from '../../lib/auth';
const { user } = useAuth();
const studentInfo = {
  id: user.studentId,
  name: user.name,
  email: user.email,
};
```

---

## 🐛 TROUBLESHOOTING

### "Cannot find module 'mysql2'"
**Solution:** Run `npm install mysql2 @stripe/react-stripe-js`

### "Table 'student_payments' doesn't exist"
**Solution:** Run the SQL file: `create_payments_table.sql`

### "Stripe is not loaded"
**Solution:** Check `.env.local` has correct keys, restart server

### Payments not showing in history
**Solution:** 
- Check database connection in API routes
- Verify student ID matches between payment and history query
- Check browser console for errors

### "Invalid API key"
**Solution:**
- Verify keys in `.env.local` start with `pk_test_` and `sk_test_`
- Check for extra spaces in `.env.local`
- Restart development server

---

## 📚 NEXT STEPS

### Now (Development):
1. ✅ Test different payment amounts
2. ✅ Try different card scenarios
3. ✅ Verify database storage
4. ✅ Test on different browsers

### Before Production:
1. 📖 Read `STRIPE_PRODUCTION_GUIDE.md` thoroughly
2. ✅ Complete all testing scenarios
3. 🔑 Get live API keys from Stripe
4. 🚀 Follow production deployment checklist

---

## 🎉 YOU'RE ALL SET!

Your payment system is ready to test. Every file has detailed comments explaining how everything works.

**Need help?** 
- Check the comments in each file
- Read `STRIPE_PRODUCTION_GUIDE.md`
- Visit [Stripe Documentation](https://stripe.com/docs)

**Happy Testing! 🚀**
