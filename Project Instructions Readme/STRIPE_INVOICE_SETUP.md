# 📄 STRIPE INVOICING - SETUP GUIDE

This guide explains how to use Stripe Invoicing in your application.

---

## 🎯 What is Stripe Invoicing?

Stripe Invoicing allows you to:
- ✅ Create professional invoices for students
- ✅ Email invoices automatically with payment instructions
- ✅ Set payment due dates (e.g., 30 days)
- ✅ Provide hosted payment pages for students
- ✅ Generate PDF invoices for download
- ✅ Track payment status

---

## 🚀 Quick Start

### 1. Invoice API is Already Set Up!

The invoice creation API is located at:
```
/app/api/stripe/create-invoice/route.ts
```

### 2. Using the Invoice Form Component

Import and use the `InvoiceForm` component:

```tsx
import InvoiceForm from '@/components/student/InvoiceForm';

// In your page/component
<InvoiceForm 
  studentId="ST001" 
  studentName="John Doe" 
  studentEmail="john@example.com" 
/>
```

### 3. Create Invoice Programmatically

```typescript
const response = await fetch('/api/stripe/create-invoice', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    studentId: 'ST001',
    studentName: 'John Doe',
    studentEmail: 'john@example.com',
    items: [
      { description: 'Tuition Fee - Term 1', amount: 5000, quantity: 1 },
      { description: 'Lab Fee', amount: 150, quantity: 1 },
    ],
    daysUntilDue: 30, // Optional, defaults to 30
    currency: 'GBP', // Optional, defaults to 'gbp'
  }),
});

const result = await response.json();
```

---

## 📋 Invoice API Response

```json
{
  "success": true,
  "invoiceId": "in_xxx",
  "invoiceNumber": "ABCD-1234",
  "invoicePdf": "https://invoice.stripe.com/xxx.pdf",
  "hostedInvoiceUrl": "https://invoice.stripe.com/xxx",
  "amountDue": 5150.00,
  "currency": "GBP",
  "status": "open",
  "dueDate": 1738886400,
  "customerEmail": "john@example.com"
}
```

---

## 🎨 Adding Invoice Form to Admin Panel

### Option 1: Create Standalone Invoice Page

Create `pages/Admin/finance/CreateInvoicePage.tsx`:

```tsx
import InvoiceForm from '@/components/student/InvoiceForm';

export default function CreateInvoicePage() {
  return (
    <div className="p-8">
      <InvoiceForm />
    </div>
  );
}
```

### Option 2: Add to Existing Finance Page

In `pages/Admin/finance/StudentFinancePage.tsx`:

```tsx
import { useState } from 'react';
import InvoiceForm from '@/components/student/InvoiceForm';

export default function StudentFinancePage() {
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShowInvoiceForm(true)}>
        Create Invoice
      </button>
      
      {showInvoiceForm && (
        <InvoiceForm 
          studentId={selectedStudent.id}
          studentName={selectedStudent.name}
          studentEmail={selectedStudent.email}
        />
      )}
    </div>
  );
}
```

---

## 💰 How It Works

### For Test Mode (Development):
1. Invoice is created and "sent" (test emails won't actually send)
2. You can view the invoice at the `hostedInvoiceUrl`
3. Use test card `4242 4242 4242 4242` to pay the invoice
4. No real money is charged

### For Live Mode (Production):
1. Invoice is created in Stripe
2. Student receives email with invoice and payment link
3. Student can pay online via the hosted invoice page
4. Student can also download PDF invoice
5. Real money is collected when paid

---

## 🔧 Configuration

### Invoice Settings in Stripe Dashboard

1. Go to [Stripe Dashboard → Invoices](https://dashboard.stripe.com/invoices)
2. Click **Settings** (gear icon)
3. Customize:
   - Invoice template (logo, colors, footer)
   - Default payment terms
   - Tax settings
   - Email notification settings

### Email Customization

In Stripe Dashboard:
1. Go to **Settings → Email**
2. Customize invoice email template
3. Add your school logo and branding

---

## 📧 What Students Receive

When an invoice is sent, students receive an email with:
1. Invoice number and amount due
2. Due date
3. Link to pay online (hosted invoice page)
4. PDF attachment (optional, configure in Stripe)
5. Payment instructions

---

## 🎯 Testing Invoices

### Test Mode Verification:

1. **Create Test Invoice:**
```bash
# Use the InvoiceForm with a test email
Student ID: TEST001
Email: test@example.com
Amount: £100.00
```

2. **View Invoice:**
   - Check the `hostedInvoiceUrl` in the response
   - Open it to see the student's payment page

3. **Pay Invoice:**
   - On the hosted page, use test card: `4242 4242 4242 4242`
   - Complete payment
   - Invoice status changes to "paid"

4. **Check Stripe Dashboard:**
   - Go to [Invoices](https://dashboard.stripe.com/test/invoices)
   - See your created invoice
   - Verify payment status

---

## 🔄 Going Live

When you switch to production mode:

### Update .env.local:
```env
# Use LIVE keys instead of TEST keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
```

**That's it!** The invoice code automatically uses the environment keys. No code changes needed.

---

## 🆚 Invoices vs Payment Intents

| Feature | Invoice | Payment Intent |
|---------|---------|----------------|
| **Email to Student** | ✅ Yes, automatic | ❌ No |
| **Payment Link** | ✅ Yes, hosted page | ❌ No |
| **Due Date** | ✅ Yes, configurable | ❌ Immediate |
| **PDF Download** | ✅ Yes, automatic | ❌ No |
| **Pay Later** | ✅ Yes | ❌ No, instant |
| **Professional Invoice** | ✅ Yes | ❌ No |
| **Use Case** | Billing students | Immediate payment |

### When to Use Each:

**Use Invoices for:**
- Tuition billing at start of term
- Payment plans (monthly invoices)
- Formal billing requirements
- Students who need time to pay

**Use Payment Intents for:**
- Quick one-time payments
- Instant transactions
- Fee payments (library fines, etc.)
- Walk-in payments

---

## 🔐 Security Notes

✅ **Safe:**
- Invoice API is server-side only
- Uses `STRIPE_SECRET_KEY` (not exposed to frontend)
- Customer emails are validated

⚠️ **Important:**
- Never put `STRIPE_SECRET_KEY` in frontend code
- Always validate student information before creating invoice
- Use authentication to prevent unauthorized invoice creation

---

## 🐛 Troubleshooting

### "Customer does not exist"
- The API automatically creates customers if they don't exist
- This shouldn't happen - check your Stripe secret key

### "Invoice already finalized"
- You can't modify a finalized invoice
- Create a new invoice instead

### "No pending invoice items"
- Make sure invoice items array is not empty
- Each item needs: description, amount, quantity

### Email Not Received
- In test mode, emails are not actually sent
- Use the `hostedInvoiceUrl` to view the invoice instead
- In live mode, check spam folder

---

## 📚 Additional Resources

- [Stripe Invoicing Docs](https://docs.stripe.com/invoicing)
- [Stripe Invoice API](https://docs.stripe.com/api/invoices)
- [Customize Invoices](https://docs.stripe.com/invoicing/customize)
- [Hosted Invoice Page](https://docs.stripe.com/invoicing/hosted-invoice-page)

---

## ✅ Next Steps

1. Test invoice creation in development mode
2. Customize invoice template in Stripe Dashboard
3. Add invoice form to your admin panel
4. Set up webhooks for invoice payment notifications
5. When ready, switch to live mode with production keys

---

**Questions?** Check the Stripe documentation or test the invoice form! 🚀
