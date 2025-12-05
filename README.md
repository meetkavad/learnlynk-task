# LearnLynk Technical Test – Complete Submission

This repository contains my full implementation of the LearnLynk technical assessment, including database schema, RLS policies, a Supabase Edge Function, a small frontend page, and the Stripe Checkout explanation.

---

# 🧾 STRIPE CHECKOUT IMPLEMENTATION (REQUIRED ANSWER)

To implement Stripe Checkout for an application fee, I would create a backend endpoint that calls `stripe.checkout.sessions.create()` with the application ID, amount, and success/cancel URLs. Before redirecting the user, I would store a `payment_request` entry in the database linked to the application. When Stripe sends a webhook for `checkout.session.completed`, I would verify the signature and update the payment record as paid. After payment is confirmed, I would update the application’s status or stage (for example, to “payment_received”) and optionally append an event to the application’s timeline. This ensures reliable tracking of payment events and keeps the application workflow in sync with Stripe’s checkout lifecycle.

---

# 🚀 How to Run the Project Locally

### 1. Clone repo
```bash
git clone https://github.com/meetkavad/learnlynk-task.git
cd learnlynk-tech-test
```
### 2. Install Dependencies
```bash
cd frontend
npm install
```
### 3. Add environment variables
```bash
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
### 4. Start Next.js

```bash
npm run dev
```





