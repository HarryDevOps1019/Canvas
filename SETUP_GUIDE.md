# Quick Setup Guide - Checkout & Orders

## Prerequisites

- Node.js and npm installed
- MongoDB running locally or connection string ready
- Gmail account with 2FA enabled (for email)

---

## Step 1: Backend Setup

### 1.1 Install Dependencies (if not already done)

```bash
cd backend
npm install
```

### 1.2 Update `.env` File

Ensure your `.env` file has these variables:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/clothing_ecommerce
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=Canvas@clothingstore.com

FRONTEND_URL=http://localhost:5173
```

### 1.3 Generate Gmail App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Factor Authentication if not already enabled
3. Go to "App passwords"
4. Select "Mail" and "Windows Computer"
5. Copy the generated 16-character password
6. Paste it in `.env` as `EMAIL_PASS`

### 1.4 Start Backend Server

```bash
npm start
# or with nodemon
npm run dev
```

Expected output:
```
Connected to MongoDB
Server running on port 5000
```

---

## Step 2: Frontend Setup

### 2.1 Install Dependencies (if not already done)

```bash
cd frontend
npm install
```

### 2.2 Start Frontend Development Server

```bash
npm run dev
```

Expected output:
```
VITE v... ready in ... ms

➜  Local:   http://localhost:5173/
```

---

## Step 3: Test the Implementation

### 3.1 Register/Login

1. Open http://localhost:5173
2. Click "Register" or "Login"
3. Create account or login with existing credentials

### 3.2 Add Items to Cart

1. Go to "Products" page
2. Click on a product
3. Select size and quantity
4. Click "Add to Cart"
5. Repeat for multiple items

### 3.3 Proceed to Checkout

1. Click cart icon or go to "/cart"
2. Review items and total
3. Click "Proceed to Checkout"
4. Fill payment form:
   - **Name:** John Doe
   - **Card:** 4532 1234 5678 9010
   - **Expiry:** 12/25
   - **CVV:** 123
5. Click "Pay Now"

### 3.4 Verify Order

1. Check success message
2. Check email inbox for order confirmation
3. Go to Profile page to see orders

---

## Step 4: Verify Email Setup

### 4.1 Check Email Sending

After completing checkout:

1. **Check Inbox:**
   - Look for email from `Canvas@clothingstore.com`
   - Subject: `Order Confirmation - Canvas #[ORDER_ID]`

2. **If Email Not Received:**
   - Check Spam/Promotions folder
   - Check server logs for errors
   - Verify `.env` credentials

### 4.2 Email Content Should Include

- ✅ Order confirmation message
- ✅ Order ID
- ✅ Order date
- ✅ Product details (name, size, quantity, price)
- ✅ Total amount
- ✅ Canvas branding
- ✅ Thank you message

---

## Step 5: Test API Endpoints

### 5.1 Get Your Token

1. Login to the app
2. Open browser DevTools (F12)
3. Go to Application → LocalStorage
4. Copy the `token` value

### 5.2 Test Endpoints with curl

**Get All Orders:**
```bash
curl -H "x-auth-token: YOUR_TOKEN" \
  http://localhost:5000/api/orders/my-orders
```

**Get Single Order:**
```bash
curl -H "x-auth-token: YOUR_TOKEN" \
  http://localhost:5000/api/orders/ORDER_ID
```

**Checkout:**
```bash
curl -X POST \
  -H "x-auth-token: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  http://localhost:5000/api/orders/checkout
```

---

## Troubleshooting

### Issue: "No token, authorization denied"

**Solution:**
- Make sure you're logged in
- Check that token is in localStorage
- Verify token is being sent in `x-auth-token` header

### Issue: "Cart is empty"

**Solution:**
- Add items to cart before checkout
- Verify items are showing in cart page
- Check cart in browser DevTools

### Issue: Email not sending

**Solution:**
1. Verify Gmail app password (not regular password)
2. Check `.env` EMAIL_PASS is correct
3. Enable 2FA on Gmail account
4. Check spam folder
5. Look for errors in server logs

### Issue: "Checkout failed"

**Solution:**
1. Check browser console for error details
2. Verify backend server is running
3. Check MongoDB connection
4. Verify JWT token is valid
5. Check network tab for API response

### Issue: Payment modal not opening

**Solution:**
1. Make sure you're logged in
2. Check browser console for errors
3. Verify cart has items
4. Try refreshing the page

---

## File Changes Summary

### New Files Created

1. **Backend:**
   - `backend/models/Order.js` - Order schema
   - `backend/controllers/orderController.js` - Order logic
   - `backend/routes/orders.js` - Order endpoints
   - `backend/utils/emailService.js` - Email service

2. **Frontend:**
   - `frontend/src/components/PaymentModal.jsx` - Payment form

### Modified Files

1. **Backend:**
   - `backend/server.js` - Added order routes

2. **Frontend:**
   - `frontend/src/pages/Cart.jsx` - Added checkout integration

---

## Database Collections

After first checkout, MongoDB will have:

```
clothing_ecommerce
├── users
├── products
├── carts
└── orders (NEW)
```

---

## Environment Variables Checklist

- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `JWT_SECRET` - JWT secret key
- [ ] `EMAIL_HOST` - SMTP host (smtp.gmail.com)
- [ ] `EMAIL_PORT` - SMTP port (587)
- [ ] `EMAIL_USER` - Gmail address
- [ ] `EMAIL_PASS` - Gmail app password
- [ ] `EMAIL_FROM` - Sender email address
- [ ] `FRONTEND_URL` - Frontend URL (http://localhost:5173)

---

## Next Steps

1. ✅ Test checkout flow
2. ✅ Verify email sending
3. ✅ Test order retrieval
4. ✅ Test guest user restriction
5. ✅ Review security features
6. ✅ Check error handling

---

## Support Resources

- **Nodemailer Docs:** https://nodemailer.com/
- **Gmail App Passwords:** https://support.google.com/accounts/answer/185833
- **MongoDB Docs:** https://docs.mongodb.com/
- **Express.js Docs:** https://expressjs.com/
- **React Docs:** https://react.dev/

---

**Setup Complete!** 🎉

Your checkout system is now ready to use. Start by adding items to cart and proceeding to checkout.
