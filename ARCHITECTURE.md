# System Architecture - Checkout & Orders

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐         ┌──────────────────┐             │
│  │   Cart Page      │         │ Payment Modal    │             │
│  │  (Cart.jsx)      │────────▶│ (PaymentModal)   │             │
│  │                  │         │                  │             │
│  │ - Display items  │         │ - Form fields    │             │
│  │ - Qty controls   │         │ - Validation     │             │
│  │ - Checkout btn   │         │ - Submit handler │             │
│  └──────────────────┘         └──────────────────┘             │
│           │                            │                       │
│           └────────────────┬───────────┘                       │
│                            │                                   │
│                    API Call (POST)                             │
│                            │                                   │
└────────────────────────────┼───────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express.js)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Order Routes (orders.js)                    │  │
│  │                                                          │  │
│  │  POST   /api/orders/checkout                            │  │
│  │  GET    /api/orders/my-orders                           │  │
│  │  GET    /api/orders/:id                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                   │
│                             ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Order Controller (orderController.js)            │  │
│  │                                                          │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │ checkout()                                      │   │  │
│  │  │ 1. Verify JWT                                  │   │  │
│  │  │ 2. Fetch user cart                             │   │  │
│  │  │ 3. Validate cart not empty                     │   │  │
│  │  │ 4. Calculate total (server-side)               │   │  │
│  │  │ 5. Create order in DB                          │   │  │
│  │  │ 6. Send confirmation email                     │   │  │
│  │  │ 7. Clear user cart                             │   │  │
│  │  │ 8. Return success response                      │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  │                                                          │  │
│  │  ┌───────────��─────────────────────────────────────┐   │  │
│  │  │ getMyOrders()                                   │   │  │
│  │  │ - Fetch all orders for user                     │   │  │
│  │  │ - Sort by date (newest first)                   │   │  │
│  │  │ - Populate product details                      │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  │                                                          │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │ getOrderById()                                  │   │  │
│  │  │ - Verify order belongs to user                  │   │  │
│  │  │ - Return 403 if unauthorized                    │   │  │
│  │  │ - Return order details                          │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  └────��─────────────────────────────────────────────────────┘  │
│                             │                                   │
│                             ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Email Service (emailService.js)                 │  │
│  │                                                          │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │ sendOrderConfirmationEmail()                    │   │  │
│  │  │ - Generate HTML template                        │   │  │
│  │  │ - Configure Nodemailer                          │   │  │
│  │  │ - Send email (non-blocking)                     │   │  │
│  │  │ - Log errors (don't break checkout)             │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                   │
│                             ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Models (Mongoose)                          │  │
│  │                                                          │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │ Order Model  │  │ Cart Model   │  │ User Model   │  │  │
│  │  │              │  │              │  │              │  │  │
│  │  │ - user       │  │ - user       │  │ - name       │  │  │
│  │  │ - items[]    │  │ - items[]    │  │ - email      │  │  │
│  │  │ - total      │  │ - updatedAt  │  │ - password   │  │  │
│  │  │ - orderDate  │  │              │  │              │  │  │
│  │  │ - status     │  │              │  │              │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                   │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (MongoDB)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Orders     │  │    Carts     │  │    Users     │         │
│  │  Collection  │  │  Collection  │  │  Collection  │         │
│  │              │  │              │  │              │         │
│  │ - _id        │  │ - _id        │  │ - _id        │         │
│  │ - user       │  │ - user       │  │ - name       │         │
│  │ - items[]    │  │ - items[]    │  │ - email      │         │
│  │ - totalAmount│  │ - updatedAt  │  │ - password   │         │
│  │ - orderDate  │  │              │  │              │         │
│  │ - status     │  │              │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EMAIL SERVICE (Gmail)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Nodemailer ──▶ SMTP (smtp.gmail.com:587) ──▶ User Email      │
│                                                                 │
│  Email Content:                                                 │
│  - Order ID                                                     │
│  - Order Date                                                   │
│  - Product Details                                              │
│  - Total Amount                                                 │
│  - Canvas Branding                                              │
│                                                                 │
└──────────────���──────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

### Checkout Flow

```
User Clicks "Proceed to Checkout"
         │
         ▼
Check if Logged In?
    ├─ NO  ──▶ Redirect to Login
    │
    └─ YES ──▶ Open Payment Modal
              │
              ▼
         User Fills Form
              │
              ▼
         Validate Form
    ├─ Invalid ──▶ Show Errors
    │
    └─ Valid ──▶ Submit to Backend
                 │
                 ▼
            POST /api/orders/checkout
                 │
                 ▼
         Verify JWT Token
    ├─ Invalid ──▶ Return 401
    │
    └─ Valid ──▶ Fetch User Cart
                 │
                 ▼
         Validate Cart
    ├─ Empty ──▶ Return 400
    │
    └─ Has Items ──▶ Calculate Total (Server-Side)
                     │
                     ▼
                Create Order in DB
                     │
                     ▼
                Send Confirmation Email
                     │
                     ▼
                Clear User Cart
                     │
                     ▼
                Return Success Response
                     │
                     ▼
         Show Success Message
                     │
                     ▼
         Redirect to Profile
                     │
                     ▼
         Display Order in History
```

---

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Cart.jsx                               │
│                                                             │
│  State:                                                     │
│  - cart                                                     │
│  - isPaymentModalOpen                                       │
│  - isCheckingOut                                            │
│                                                             │
│  Functions:                                                 │
│  - handleProceedToCheckout()                                │
│  - handlePaymentSubmit()                                    │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Renders:                                             │  │
│  │ - Cart items list                                    │  │
│  │ - Order summary                                      │  │
│  │ - "Proceed to Checkout" button                       │  │
│  │ - PaymentModal component                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
         │
         │ Passes props
         ▼
┌─────────────────────────────────────────────────────────────┐
│                   PaymentModal.jsx                          │
│                                                             │
│  Props:                                                     │
│  - isOpen                                                   │
│  - onClose                                                  │
│  - onSubmit                                                 │
│  - isLoading                                                │
│  - totalAmount                                              │
│                                                             │
│  State:                                                     │
│  - formData (name, card, expiry, cvv)                       │
│  - errors                                                   │
│                                                             │
│  Functions:                                                 │
│  - handleChange()                                           │
│  - validateForm()                                           │
│  - handleSubmit()                                           │
│  - formatCardNumber()                                       │
│  - formatExpiryDate()                                       │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Renders:                                             │  │
│  │ - Modal overlay                                      │  │
│  │ - Form fields                                        │  │
│  │ - Validation errors                                  │  │
│  │ - Submit buttons                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
         │
         │ Calls onSubmit()
         ▼
    handlePaymentSubmit()
         │
         ▼
    POST /api/orders/checkout
```

---

## Authentication Flow

```
┌──────────────────────────────────────────────────────────┐
│                   Frontend                               │
│                                                          │
│  1. User logs in                                         │
│  2. JWT token received                                   │
│  3. Token stored in localStorage                         │
│                                                          │
└────────────────────────────────────────────────────���─────┘
         │
         │ Token in header
         ▼
┌──────────────────────────────────────────────────────────┐
│                   Backend                                │
│                                                          │
│  1. Request arrives with x-auth-token header             │
│  2. auth middleware checks token                         │
│  3. JWT verified with JWT_SECRET                         │
│  4. User ID extracted from token                         │
│  5. req.user.id set for controller                       │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ If token invalid/missing:                          │ │
│  │ - Return 401 Unauthorized                          │ │
│  │ - Request blocked                                  │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ If token valid:                                    │ │
│  │ - Continue to controller                           │ │
│  │ - Access user data via req.user.id                 │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Database Relationships

```
┌──────────────────┐
│      User        │
├──────────────────┤
│ _id              │
│ name             │
│ email            │
│ password         │
└──────────────────┘
         │
         │ 1:N
         │
    ┌────┴────┐
    │          │
    ▼          ▼
┌────���─────┐ ┌──────────┐
│  Cart    │ │  Order   │
├──────────┤ ├──────────┤
│ _id      │ │ _id      │
│ user ────┼─┼─ user    │
│ items[]  │ │ items[]  │
│ updatedAt│ │ total    │
└──────────┘ │ date     │
             │ status   │
             └──────────┘
                  │
                  │ Contains
                  │
                  ▼
            ┌──────────────┐
            │ Order Items  │
            ├──────────────┤
            │ productId    │
            │ productName  │
            │ size         │
            │ quantity     │
            │ price        │
            └──────────────┘
```

---

## Error Handling Flow

```
Request to /api/orders/checkout
         │
         ▼
    Check JWT
    ├─ Missing/Invalid ──▶ Return 401
    │
    └─ Valid ──▶ Fetch Cart
                 │
                 ▼
            Check Cart
        ├─ Empty ──▶ Return 400
        │
        └─ Has Items ──▶ Create Order
                         │
                         ▼
                    Order Created?
                ├─ Error ──▶ Return 500
                │
                └─ Success ──▶ Send Email
                              │
                              ▼
                         Email Sent?
                    ├─ Error ──▶ Log Error
                    │           (Don't break checkout)
                    │
                    └─ Success ──▶ Clear Cart
                                  │
                                  ▼
                            Return 201 Success
```

---

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                  SECURITY LAYERS                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Layer 1: Authentication                               │
│  ├─ JWT token required                                 │
│  ├─ Token verified with secret                         │
│  └─ User ID extracted from token                       │
│                                                         │
│  Layer 2: Authorization                                │
│  ├─ User can only access own orders                    │
│  ├─ 403 Forbidden for unauthorized access              │
│  └─ Guest users cannot checkout                        │
│                                                         │
│  Layer 3: Data Validation                              │
│  ├─ Cart validation (not empty)                        │
│  ├─ Form validation (client & server)                  │
│  └─ Input sanitization                                 │
│                                                         │
│  Layer 4: Business Logic                               │
│  ├─ Server-side price calculation                      │
│  ├─ Cart cleared only after order creation             │
│  └─ Order created before email sent                    │
│                                                         │
│  Layer 5: Credentials Protection                       │
│  ├─ Email credentials in .env                          │
│  ├─ Not exposed in code                                │
│  └─ Not committed to version control                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   PRODUCTION                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Frontend (React)                         │  │
│  │  - Hosted on Vercel/Netlify                      │  │
│  │  - HTTPS enabled                                 │  │
│  │  - CDN for static assets                         │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Backend (Express.js)                     │  │
│  │  - Hosted on Heroku/AWS/DigitalOcean             │  │
│  │  - HTTPS enabled                                 │  │
│  │  - Environment variables configured              │  │
│  │  - Rate limiting enabled                         │  │
│  │  - Logging configured                            │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────���───────────────────────────────────────────┐  │
│  │         Database (MongoDB)                       │  │
│  │  - MongoDB Atlas (cloud)                         │  │
│  │  - Backups enabled                               │  │
│  │  - Indexes optimized                             │  │
│  │  - Connection pooling                            │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Email Service (Gmail)                    │  │
│  │  - SMTP configured                               │  │
│  │  - App password used                             │  │
│  │  - Error logging enabled                         │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Performance Optimization

```
┌─────────────────────────────────────────────────────────┐
│              PERFORMANCE STRATEGIES                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Frontend:                                              │
│  ├─ Component memoization                              │
│  ├─ Lazy loading                                        │
│  ├─ Code splitting                                      │
│  └─ Image optimization                                  │
│                                                         │
│  Backend:                                               │
│  ├─ Database indexing                                   │
│  ├─ Query optimization                                  │
│  ├─ Caching strategies                                  │
│  └─ Connection pooling                                  │
│                                                         │
│  Email:                                                 │
│  ├─ Non-blocking sending                               │
│  ├─ Queue system (optional)                             │
│  └─ Retry logic                                         │
│                                                         │
│  General:                                               │
│  ├─ CDN for static assets                               │
│  ├─ Compression (gzip)                                  │
│  ├─ Minification                                        │
│  └─ Monitoring & logging                                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Scalability Considerations

```
Current Architecture:
├─ Single backend server
├─ Single MongoDB instance
└─ Direct email sending

Scalable Architecture:
├─ Load balancer
├─ Multiple backend servers
├─ MongoDB replica set
├─ Email queue system
├─ Caching layer (Redis)
└─ CDN for static assets
```

---

**Architecture Version:** 1.0.0
**Last Updated:** January 2024
