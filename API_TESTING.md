# API Testing Guide - Orders & Checkout

## Overview

This guide provides examples for testing all order-related API endpoints using curl, Postman, or any HTTP client.

---

## Prerequisites

1. Backend server running on `http://localhost:5000`
2. User logged in with valid JWT token
3. Items in user's cart

---

## Getting Your JWT Token

### Method 1: From Browser

1. Open http://localhost:5173
2. Login to your account
3. Open DevTools (F12)
4. Go to **Application** → **LocalStorage**
5. Find `token` key
6. Copy the value

### Method 2: Via Login API

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

---

## API Endpoints

### 1. POST /api/orders/checkout

**Description:** Create an order from user's cart

**Authentication:** Required (JWT)

**Request:**

```bash
curl -X POST http://localhost:5000/api/orders/checkout \
  -H "x-auth-token: YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Order placed successfully!",
  "order": {
    "_id": "507f1f77bcf86cd799439015",
    "user": "507f1f77bcf86cd799439011",
    "items": [
      {
        "_id": "507f1f77bcf86cd799439016",
        "productId": "507f1f77bcf86cd799439013",
        "productName": "Classic T-Shirt",
        "size": "M",
        "quantity": 2,
        "price": 29.99
      },
      {
        "_id": "507f1f77bcf86cd799439017",
        "productId": "507f1f77bcf86cd799439014",
        "productName": "Denim Jeans",
        "size": "L",
        "quantity": 1,
        "price": 79.99
      }
    ],
    "totalAmount": 139.97,
    "orderDate": "2024-01-15T10:30:00.000Z",
    "status": "confirmed",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "__v": 0
  }
}
```

**Error Response (400 - Empty Cart):**

```json
{
  "success": false,
  "message": "Cart is empty. Cannot proceed with checkout."
}
```

**Error Response (401 - No Token):**

```json
{
  "success": false,
  "msg": "No token, authorization denied"
}
```

**Error Response (500 - Server Error):**

```json
{
  "success": false,
  "message": "Error processing checkout",
  "error": "Error details..."
}
```

---

### 2. GET /api/orders/my-orders

**Description:** Get all orders of the logged-in user

**Authentication:** Required (JWT)

**Request:**

```bash
curl -X GET http://localhost:5000/api/orders/my-orders \
  -H "x-auth-token: YOUR_JWT_TOKEN"
```

**Success Response (200):**

```json
{
  "success": true,
  "orders": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "user": "507f1f77bcf86cd799439011",
      "items": [
        {
          "_id": "507f1f77bcf86cd799439016",
          "productId": "507f1f77bcf86cd799439013",
          "productName": "Classic T-Shirt",
          "size": "M",
          "quantity": 2,
          "price": 29.99
        }
      ],
      "totalAmount": 59.98,
      "orderDate": "2024-01-15T10:30:00.000Z",
      "status": "confirmed",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439018",
      "user": "507f1f77bcf86cd799439011",
      "items": [
        {
          "_id": "507f1f77bcf86cd799439019",
          "productId": "507f1f77bcf86cd799439014",
          "productName": "Denim Jeans",
          "size": "L",
          "quantity": 1,
          "price": 79.99
        }
      ],
      "totalAmount": 79.99,
      "orderDate": "2024-01-14T15:20:00.000Z",
      "status": "confirmed",
      "createdAt": "2024-01-14T15:20:00.000Z",
      "updatedAt": "2024-01-14T15:20:00.000Z"
    }
  ]
}
```

**Error Response (401 - No Token):**

```json
{
  "success": false,
  "msg": "No token, authorization denied"
}
```

---

### 3. GET /api/orders/:id

**Description:** Get a specific order by ID

**Authentication:** Required (JWT)

**Request:**

```bash
curl -X GET http://localhost:5000/api/orders/507f1f77bcf86cd799439015 \
  -H "x-auth-token: YOUR_JWT_TOKEN"
```

**Success Response (200):**

```json
{
  "success": true,
  "order": {
    "_id": "507f1f77bcf86cd799439015",
    "user": "507f1f77bcf86cd799439011",
    "items": [
      {
        "_id": "507f1f77bcf86cd799439016",
        "productId": "507f1f77bcf86cd799439013",
        "productName": "Classic T-Shirt",
        "size": "M",
        "quantity": 2,
        "price": 29.99
      },
      {
        "_id": "507f1f77bcf86cd799439017",
        "productId": "507f1f77bcf86cd799439014",
        "productName": "Denim Jeans",
        "size": "L",
        "quantity": 1,
        "price": 79.99
      }
    ],
    "totalAmount": 139.97,
    "orderDate": "2024-01-15T10:30:00.000Z",
    "status": "confirmed",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (404 - Order Not Found):**

```json
{
  "success": false,
  "message": "Order not found"
}
```

**Error Response (403 - Unauthorized Access):**

```json
{
  "success": false,
  "message": "Unauthorized: This order does not belong to you"
}
```

**Error Response (401 - No Token):**

```json
{
  "success": false,
  "msg": "No token, authorization denied"
}
```

---

## Testing Scenarios

### Scenario 1: Complete Checkout Flow

**Step 1: Add items to cart**

```bash
curl -X POST http://localhost:5000/api/cart/add \
  -H "x-auth-token: YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "507f1f77bcf86cd799439013",
    "size": "M",
    "quantity": 2
  }'
```

**Step 2: Verify cart**

```bash
curl -X GET http://localhost:5000/api/cart \
  -H "x-auth-token: YOUR_JWT_TOKEN"
```

**Step 3: Checkout**

```bash
curl -X POST http://localhost:5000/api/orders/checkout \
  -H "x-auth-token: YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Step 4: Verify order created**

```bash
curl -X GET http://localhost:5000/api/orders/my-orders \
  -H "x-auth-token: YOUR_JWT_TOKEN"
```

**Step 5: Get order details**

```bash
curl -X GET http://localhost:5000/api/orders/ORDER_ID \
  -H "x-auth-token: YOUR_JWT_TOKEN"
```

---

### Scenario 2: Test Guest User Restriction

**Attempt checkout without token:**

```bash
curl -X POST http://localhost:5000/api/orders/checkout \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Response (401):**

```json
{
  "success": false,
  "msg": "No token, authorization denied"
}
```

---

### Scenario 3: Test Empty Cart Checkout

**Step 1: Clear cart**

```bash
curl -X DELETE http://localhost:5000/api/cart/clear \
  -H "x-auth-token: YOUR_JWT_TOKEN"
```

**Step 2: Attempt checkout**

```bash
curl -X POST http://localhost:5000/api/orders/checkout \
  -H "x-auth-token: YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Response (400):**

```json
{
  "success": false,
  "message": "Cart is empty. Cannot proceed with checkout."
}
```

---

### Scenario 4: Test Unauthorized Order Access

**Get another user's order (using different token):**

```bash
curl -X GET http://localhost:5000/api/orders/OTHER_USER_ORDER_ID \
  -H "x-auth-token: YOUR_JWT_TOKEN"
```

**Expected Response (403):**

```json
{
  "success": false,
  "message": "Unauthorized: This order does not belong to you"
}
```

---

## Postman Collection

### Import Instructions

1. Open Postman
2. Click **Import**
3. Select **Raw text**
4. Paste the collection below
5. Click **Import**

### Collection JSON

```json
{
  "info": {
    "name": "Canvas Orders API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Checkout",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "x-auth-token",
            "value": "{{token}}",
            "type": "text"
          },
          {
            "key": "Content-Type",
            "value": "application/json",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{}"
        },
        "url": {
          "raw": "http://localhost:5000/api/orders/checkout",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "orders", "checkout"]
        }
      }
    },
    {
      "name": "Get My Orders",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "x-auth-token",
            "value": "{{token}}",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:5000/api/orders/my-orders",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "orders", "my-orders"]
        }
      }
    },
    {
      "name": "Get Order by ID",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "x-auth-token",
            "value": "{{token}}",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:5000/api/orders/{{orderId}}",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "orders", "{{orderId}}"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "token",
      "value": "YOUR_JWT_TOKEN"
    },
    {
      "key": "orderId",
      "value": "ORDER_ID"
    }
  ]
}
```

---

## Common Issues & Solutions

### Issue: "No token, authorization denied"

**Cause:** Missing or invalid JWT token

**Solution:**
- Ensure token is in `x-auth-token` header
- Verify token is not expired
- Get new token by logging in

### Issue: "Cart is empty"

**Cause:** User's cart has no items

**Solution:**
- Add items to cart first
- Verify items are in cart via GET /api/cart

### Issue: "Order not found"

**Cause:** Invalid order ID

**Solution:**
- Verify order ID is correct
- Get order ID from GET /api/orders/my-orders

### Issue: "Unauthorized: This order does not belong to you"

**Cause:** Trying to access another user's order

**Solution:**
- Only access your own orders
- Use correct token for the user

---

## Response Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Order retrieved successfully |
| 201 | Created | Order created successfully |
| 400 | Bad Request | Cart is empty |
| 401 | Unauthorized | No token provided |
| 403 | Forbidden | Order doesn't belong to user |
| 404 | Not Found | Order not found |
| 500 | Server Error | Database error |

---

## Performance Tips

1. **Cache tokens** - Store JWT in localStorage to avoid repeated logins
2. **Batch requests** - Get all orders at once instead of individual requests
3. **Pagination** - For large order lists, implement pagination
4. **Indexing** - Ensure MongoDB indexes on `user` field for faster queries

---

## Security Best Practices

1. ✅ Always use HTTPS in production
2. ✅ Never expose JWT tokens in URLs
3. ✅ Validate all inputs on backend
4. ✅ Use environment variables for sensitive data
5. ✅ Implement rate limiting for API endpoints
6. ✅ Log all checkout attempts
7. ✅ Monitor for suspicious activity

---

## Debugging Tips

### Enable Verbose Logging

Add to `backend/controllers/orderController.js`:

```javascript
console.log('Checkout request:', {
  userId: req.user.id,
  cartItems: cart.items.length,
  totalAmount: totalAmount
});
```

### Check MongoDB

```bash
# Connect to MongoDB
mongo

# Use database
use clothing_ecommerce

# View orders
db.orders.find().pretty()

# View specific user's orders
db.orders.find({ user: ObjectId("USER_ID") }).pretty()
```

### Monitor Email Sending

Check server logs for email status:

```
Order confirmation email sent to user@example.com
```

---

## Next Steps

1. ✅ Test all endpoints
2. ✅ Verify email sending
3. ✅ Test error scenarios
4. ✅ Load test with multiple orders
5. ✅ Monitor performance
6. ✅ Deploy to production

---

**Happy Testing!** 🚀
