# 🍽️ Restaurant Ordering & Billing System - Complete Modular Documentation

**Project Name:** Real-Time Restaurant Ordering & Management System  
**Tech Stack:** Node.js + Express.js + WebSockets (Backend) | React (Frontend) | MongoDB (Database)  
**Payment Method:** Cash on Delivery Only  
**Status:** Production-Ready Architecture

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Backend Modules Documentation](#backend-modules-documentation)
4. [Frontend Modules Documentation](#frontend-modules-documentation)
5. [Database Schema](#database-schema)
6. [API Endpoints Reference](#api-endpoints-reference)
7. [WebSocket Events Reference](#websocket-events-reference)
8. [Folder Structure](#folder-structure)
9. [Setup & Installation Guide](#setup--installation-guide)

---

## Project Overview

This is a complete restaurant management system where:
- **Customers** browse the menu, add items to cart, place orders, and track order status in real-time
- **Restaurant Staff** receive orders instantly, manage order status, and view daily sales
- **All payments are Cash on Delivery** (no online payment integration)
- **Real-time updates** via WebSockets for instant communication between customer and staff
- **Automated invoicing** after order completion

### Key Features
- Real-time order notifications
- Live order status tracking
- Dynamic menu management
- Invoice generation
- Role-based access (Customer vs Admin/Staff)
- Secure authentication with JWT

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CUSTOMER BROWSER (React)                  │
│  [Menu] → [Cart] → [Checkout] → [Order Tracking] → [Invoice]│
└────────────────────────┬────────────────────────────────────┘
                         │
              REST APIs + WebSocket Connection
                         │
┌────────────────────────▼────────────────────────────────────┐
│         BACKEND SERVER (Node.js + Express + Socket.IO)      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ API Routes: Auth, Menu, Orders, Invoices, Admin     │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ WebSocket Server: Real-time order & status updates  │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Business Logic: Orders, Invoices, Notifications     │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                      MongoDB
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
    [Users]         [Menu Items]    [Orders & Payments]
    [Invoices]      [Categories]
```

---

---

# BACKEND MODULES DOCUMENTATION

## Backend Overview
The backend is built with **Node.js + Express.js** and uses **WebSockets (Socket.IO)** for real-time communication. It handles all business logic, authentication, order processing, and invoice generation.

---

## Module 1: Authentication & User Management

### Purpose
Handle user registration, login, JWT token generation, and role-based access control.

### Responsibilities
- Register customers and admin users
- Authenticate users with email/password
- Generate and validate JWT tokens
- Protect routes based on user roles (customer/admin)
- Handle password security

### Database Models

**User Schema:**
```
{
  _id: ObjectId,
  name: String (required),
  email: String (unique, required),
  password: String (hashed with bcrypt),
  phone: String,
  address: String,
  role: String (enum: ["customer", "admin"], default: "customer"),
  createdAt: Date,
  updatedAt: Date
}
```

### Key Files to Create
```
backend/
├── controllers/
│   └── authController.js
├── routes/
│   └── authRoutes.js
├── middleware/
│   └── authMiddleware.js
└── models/
    └── User.js
```

### authController.js - Core Functions

**1. Register Function**
```
Input: { name, email, password, phone, address, role }
Output: { message, token, user }
Process:
  - Validate input fields
  - Check if email already exists
  - Hash password using bcrypt
  - Save user to database
  - Generate JWT token
  - Return token & user details
```

**2. Login Function**
```
Input: { email, password }
Output: { message, token, user }
Process:
  - Find user by email
  - Verify password using bcrypt.compare()
  - If invalid, return error
  - Generate JWT token
  - Return token & user details
```

**3. Get Current User Function**
```
Input: JWT token (from header)
Output: { user }
Process:
  - Verify JWT token
  - Extract userId from token
  - Fetch user from database
  - Return user details
```

### authMiddleware.js - Middleware Functions

**1. verifyToken (Protect All Routes)**
```
Process:
  - Extract token from Authorization header
  - Verify JWT token
  - Decode to get userId
  - Attach user to request object
  - Next middleware
  - If token invalid, return 401 error
```

**2. verifyRole (Admin-Only Routes)**
```
Process:
  - Check if req.user.role === "admin"
  - If yes, proceed
  - If no, return 403 Forbidden error
```

### API Endpoints (Module 1)

| Method | Route | Purpose | Auth Required |
|--------|-------|---------|----------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user info | Yes |
| POST | `/api/auth/logout` | Logout user | Yes |

---

## Module 2: Menu Management

### Purpose
Manage restaurant menu items, categories, and availability status.

### Responsibilities
- Add, update, delete menu items
- Organize items into categories
- Set item availability
- Retrieve menu for customers
- Search and filter items

### Database Models

**MenuItem Schema:**
```
{
  _id: ObjectId,
  name: String (required),
  description: String,
  price: Number (required),
  category: String (enum: ["Fast Food", "Drinks", "Desserts", "Deals"], required),
  availability: Boolean (default: true),
  image: String (image URL),
  preparationTime: Number (in minutes),
  createdAt: Date,
  updatedAt: Date
}
```

**Category Schema (Optional):**
```
{
  _id: ObjectId,
  name: String (unique, required),
  description: String,
  icon: String (icon URL)
}
```

### Key Files to Create
```
backend/
├── controllers/
│   └── menuController.js
├── routes/
│   └── menuRoutes.js
└── models/
    └── MenuItem.js
```

### menuController.js - Core Functions

**1. Get All Menu Items**
```
Input: Query params (optional): category, search
Output: Array of menu items
Process:
  - Query all items from database
  - Apply filters if provided (category, search)
  - Return items to customer
```

**2. Get Single Menu Item**
```
Input: itemId
Output: Single menu item object
Process:
  - Find item by _id
  - If not found, return 404 error
  - Return item details
```

**3. Create Menu Item (Admin Only)**
```
Input: { name, description, price, category, availability, preparationTime }
Output: { message, item }
Process:
  - Validate all fields
  - Check if name already exists
  - Create new MenuItem document
  - Save to database
  - Return created item
```

**4. Update Menu Item (Admin Only)**
```
Input: itemId, { updated fields }
Output: { message, item }
Process:
  - Find item by itemId
  - Update provided fields only
  - Save to database
  - Return updated item
```

**5. Delete Menu Item (Admin Only)**
```
Input: itemId
Output: { message }
Process:
  - Find and delete item by itemId
  - Return success message
```

**6. Update Item Availability (Admin Only)**
```
Input: itemId, { availability: true/false }
Output: { message, item }
Process:
  - Find item by itemId
  - Toggle availability
  - Save to database
  - Notify connected WebSocket clients of availability change
```

### API Endpoints (Module 2)

| Method | Route | Purpose | Auth Required | Role Required |
|--------|-------|---------|----------------|---------------|
| GET | `/api/menu` | Get all menu items | No | - |
| GET | `/api/menu/:id` | Get single menu item | No | - |
| POST | `/api/menu` | Create new item | Yes | Admin |
| PUT | `/api/menu/:id` | Update menu item | Yes | Admin |
| DELETE | `/api/menu/:id` | Delete menu item | Yes | Admin |
| PATCH | `/api/menu/:id/availability` | Toggle availability | Yes | Admin |

---

## Module 3: Order Management (Core Logic)

### Purpose
Handle order creation, order status updates, and order retrieval.

### Responsibilities
- Create orders from cart items
- Track order status (Pending → Preparing → Ready → Delivered)
- Update order status
- Retrieve orders for customers and admin
- Cancel orders
- Calculate total amount including taxes

### Database Models

**Order Schema:**
```
{
  _id: ObjectId,
  orderId: String (unique, auto-generated like "ORD-20250127-001"),
  customerId: ObjectId (reference to User),
  items: [
    {
      itemId: ObjectId,
      itemName: String,
      quantity: Number,
      price: Number,
      subtotal: Number
    }
  ],
  totalAmount: Number,
  taxAmount: Number (default: 0 for COD),
  deliveryAmount: Number,
  grandTotal: Number,
  customerName: String,
  customerPhone: String,
  deliveryAddress: String,
  orderStatus: String (enum: ["Pending", "Preparing", "Ready", "Delivered", "Cancelled"], default: "Pending"),
  paymentMethod: String (default: "Cash on Delivery"),
  paymentStatus: String (enum: ["Pending", "Paid", "Failed"], default: "Pending"),
  notes: String (special instructions),
  createdAt: Date,
  updatedAt: Date
}
```

### Key Files to Create
```
backend/
├── controllers/
│   └── orderController.js
├── routes/
│   └── orderRoutes.js
├── models/
│   └── Order.js
├── utils/
│   └── orderUtils.js (helper functions)
└── services/
    └── orderService.js (business logic)
```

### orderController.js - Core Functions

**1. Create Order**
```
Input: {
  items: [
    { itemId, quantity },
    { itemId, quantity }
  ],
  customerName,
  customerPhone,
  deliveryAddress,
  notes (optional)
}
Output: { message, order, orderId }
Process:
  - Validate items array (not empty, valid itemIds)
  - Fetch all items from database
  - Calculate subtotal, tax, delivery, grand total
  - Create Order document
  - Save to database
  - Emit WebSocket event to admin dashboard (new order arrived)
  - Return created order with orderId
  - Send order confirmation to customer
```

**2. Get All Orders (Admin)**
```
Input: Query params: status, date range, customerId (optional)
Output: Array of orders
Process:
  - Query orders with filters
  - Populate customerId to show customer details
  - Sort by createdAt (newest first)
  - Return orders to admin
```

**3. Get My Orders (Customer)**
```
Input: customerId (from JWT token)
Output: Array of customer's orders
Process:
  - Query orders where customerId = current user
  - Sort by createdAt (newest first)
  - Return customer's orders
```

**4. Get Single Order**
```
Input: orderId
Output: Single order object with full details
Process:
  - Find order by _id or orderId
  - Populate item details and customer details
  - Return order
```

**5. Update Order Status (Admin Only)**
```
Input: orderId, { orderStatus: "Preparing"/"Ready"/"Delivered"/"Cancelled" }
Output: { message, order }
Process:
  - Find order by orderId
  - Update orderStatus
  - Save to database
  - Emit WebSocket event to customer with updated status
  - If status is "Delivered", generate invoice automatically
  - Return updated order
```

**6. Cancel Order**
```
Input: orderId
Output: { message }
Process:
  - Find order by orderId
  - Check if order status is "Pending" or "Preparing" (can't cancel if Ready/Delivered)
  - Update status to "Cancelled"
  - Save to database
  - Emit WebSocket event to admin
  - Return success message
```

**7. Calculate Order Total**
```
Input: items array with prices
Output: { subtotal, tax, delivery, grandTotal }
Process:
  - Calculate subtotal (sum of all item prices × quantity)
  - Calculate tax (5% of subtotal)
  - Add delivery charge (fixed amount, e.g., Rs. 50)
  - grandTotal = subtotal + tax + delivery
  - Return totals
```

### orderService.js - Business Logic

**Helper Functions:**
1. `generateOrderId()` - Generate unique order ID like "ORD-20250127-001"
2. `calculateOrderTotals(items)` - Calculate subtotal, tax, delivery, grand total
3. `validateOrderItems(items)` - Validate items are available and in stock
4. `notifyAdminNewOrder(order)` - Emit WebSocket to admin dashboard
5. `notifyCustomerOrderStatus(order)` - Emit WebSocket to customer

### API Endpoints (Module 3)

| Method | Route | Purpose | Auth Required | Role Required |
|--------|-------|---------|----------------|---------------|
| POST | `/api/orders` | Create new order | Yes | Customer |
| GET | `/api/orders` | Get all orders | Yes | Admin |
| GET | `/api/orders/my-orders` | Get customer's orders | Yes | Customer |
| GET | `/api/orders/:id` | Get single order | Yes | Customer/Admin |
| PATCH | `/api/orders/:id/status` | Update order status | Yes | Admin |
| DELETE | `/api/orders/:id` | Cancel order | Yes | Customer |

---

## Module 4: Invoice Management

### Purpose
Generate and manage invoices for completed orders.

### Responsibilities
- Generate invoices after order completion
- Retrieve invoices
- Download invoice as PDF
- Send invoice to customer email

### Database Models

**Invoice Schema:**
```
{
  _id: ObjectId,
  invoiceId: String (unique, auto-generated like "INV-20250127-001"),
  orderId: ObjectId (reference to Order),
  customerId: ObjectId (reference to User),
  customerName: String,
  customerEmail: String,
  restaurantName: String,
  restaurantAddress: String,
  items: [
    {
      itemName: String,
      quantity: Number,
      price: Number,
      subtotal: Number
    }
  ],
  subtotal: Number,
  taxAmount: Number,
  deliveryAmount: Number,
  grandTotal: Number,
  paymentMethod: String,
  paymentStatus: String,
  invoiceDate: Date,
  dueDate: Date (optional),
  notes: String,
  createdAt: Date
}
```

### Key Files to Create
```
backend/
├── controllers/
│   └── invoiceController.js
├── routes/
│   └── invoiceRoutes.js
├── models/
│   └── Invoice.js
├── services/
│   └── invoiceService.js
└── utils/
    └── pdfGenerator.js (for PDF generation)
```

### invoiceController.js - Core Functions

**1. Generate Invoice (Called Automatically After Order Delivered)**
```
Input: orderId
Output: { message, invoiceId }
Process:
  - Find order by orderId
  - Check if order status is "Delivered"
  - Create Invoice document from Order details
  - Generate invoice number
  - Save to database
  - Optionally send PDF to customer email
  - Return invoiceId
```

**2. Get Invoice**
```
Input: invoiceId
Output: Invoice object with full details
Process:
  - Find invoice by invoiceId
  - Populate order and customer details
  - Return invoice
```

**3. Get All Customer Invoices**
```
Input: customerId (from JWT)
Output: Array of customer's invoices
Process:
  - Query invoices where customerId = current user
  - Sort by createdAt (newest first)
  - Return invoices
```

**4. Download Invoice as PDF**
```
Input: invoiceId
Output: PDF file
Process:
  - Find invoice by invoiceId
  - Generate PDF using pdfkit library
  - Format with header (restaurant info), items, totals
  - Return PDF file as download
```

### invoiceService.js - Business Logic

**Helper Functions:**
1. `generateInvoiceId()` - Generate unique invoice ID
2. `createInvoiceFromOrder(order)` - Convert order to invoice
3. `generatePDF(invoiceData)` - Create PDF document
4. `sendInvoiceEmail(invoice, customerEmail)` - Send invoice via email (optional)

### API Endpoints (Module 4)

| Method | Route | Purpose | Auth Required | Role Required |
|--------|-------|---------|----------------|---------------|
| POST | `/api/invoices/generate/:orderId` | Create invoice from order | Yes | Admin |
| GET | `/api/invoices/:id` | Get single invoice | Yes | Customer/Admin |
| GET | `/api/invoices` | Get all customer invoices | Yes | Customer |
| GET | `/api/invoices/:id/download` | Download invoice as PDF | Yes | Customer/Admin |

---

## Module 5: WebSocket Real-Time Communication

### Purpose
Enable real-time communication between customer app and admin dashboard using Socket.IO.

### Responsibilities
- Broadcast new orders to admin dashboard
- Send order status updates to customers
- Notify availability changes
- Handle real-time notifications
- Manage socket connections and disconnections

### Key Files to Create
```
backend/
├── socket/
│   ├── socketServer.js
│   ├── handlers/
│   │   ├── orderEvents.js
│   │   ├── menuEvents.js
│   │   └── notificationEvents.js
│   └── middleware/
│       └── socketAuthMiddleware.js
└── utils/
    └── socketManager.js (socket utilities)
```

### socketServer.js - Setup

**Socket.IO Configuration:**
```
Process:
  - Initialize Socket.IO with HTTP server
  - Set CORS options
  - Enable connections from frontend
  - Setup authentication middleware
  - Setup event handlers
```

### orderEvents.js - Order Socket Events

**1. New Order Created Event**
```
Event Name: "new-order"
Emitted By: Backend (orderController after order creation)
Received By: Admin dashboard connected clients
Data Sent: { order, orderId, customerName, totalAmount, createdAt }
Process:
  - Emit to all connected admin users
  - Admin dashboard updates in real-time with new order
  - Sound notification (optional)
```

**2. Order Status Updated Event**
```
Event Name: "order-status-updated"
Emitted By: Backend (orderController after status update)
Received By: Customer and admin
Data Sent: { orderId, status, updatedAt }
Process:
  - Emit to specific customer (private room)
  - Emit to admin dashboard
  - Customer sees order status change in real-time
```

**3. Customer Joins Order Room**
```
Event Name: "customer-join-order"
Emitted By: Customer app (upon page load)
Received By: Backend
Data Sent: { orderId, customerId, token }
Process:
  - Authenticate user
  - Add customer to order-specific room
  - Send current order status to customer
```

**4. Admin Receives Order**
```
Event Name: "admin-acknowledge-order"
Emitted By: Admin (clicks "Received")
Received By: Backend
Data Sent: { orderId }
Process:
  - Update order status to "Preparing"
  - Notify customer of status change
```

### menuEvents.js - Menu Socket Events

**1. Menu Item Availability Changed**
```
Event Name: "menu-updated"
Emitted By: Backend (when admin toggles availability)
Received By: All connected customers
Data Sent: { itemId, availability }
Process:
  - Customer app updates UI immediately
  - Show/hide item or gray out unavailable items
```

### socketAuthMiddleware.js - Socket Authentication

**Process:**
```
  - Extract JWT token from socket handshake
  - Verify token
  - Attach user to socket object
  - If invalid, disconnect
```

### socketManager.js - Utilities

**Helper Functions:**
1. `emitToAdmin(event, data)` - Send to all admin users
2. `emitToCustomer(orderId, event, data)` - Send to specific customer
3. `emitToAdminDashboard(event, data)` - Broadcast to admin dashboard
4. `addUserToRoom(userId, room)` - Add socket to room
5. `removeUserFromRoom(userId, room)` - Remove socket from room

---

## Module 6: Admin Dashboard Backend

### Purpose
Provide APIs and data for admin dashboard (order overview, daily sales, etc.).

### Responsibilities
- Calculate daily sales
- Get order statistics
- Filter orders by date/status
- Generate reports

### Key Files to Create
```
backend/
├── controllers/
│   └── adminController.js
├── routes/
│   └── adminRoutes.js
└── services/
    └── dashboardService.js
```

### adminController.js - Core Functions

**1. Get Dashboard Statistics**
```
Input: Date range (optional)
Output: { totalOrders, totalRevenue, pendingOrders, completedOrders }
Process:
  - Query orders from database
  - Filter by date range if provided
  - Calculate statistics
  - Return data to admin
```

**2. Get Today's Orders**
```
Input: None
Output: Array of today's orders
Process:
  - Query orders created today
  - Sort by status and time
  - Return orders with customer details
```

**3. Get Orders by Status**
```
Input: status (Pending/Preparing/Ready/Delivered)
Output: Array of orders with that status
Process:
  - Query orders by status
  - Return to admin
```

### API Endpoints (Module 6)

| Method | Route | Purpose | Auth Required | Role Required |
|--------|-------|---------|----------------|---------------|
| GET | `/api/admin/dashboard` | Get dashboard stats | Yes | Admin |
| GET | `/api/admin/orders/today` | Get today's orders | Yes | Admin |
| GET | `/api/admin/orders/status/:status` | Get orders by status | Yes | Admin |
| GET | `/api/admin/sales/report` | Get sales report | Yes | Admin |

---

## Module 7: Error Handling & Validation

### Purpose
Handle errors consistently across the application.

### Key Files to Create
```
backend/
├── middleware/
│   ├── errorHandler.js
│   └── validationMiddleware.js
└── utils/
    └── apiResponse.js (consistent response format)
```

### Error Handler Middleware

**Process:**
```
  - Catch all errors in try-catch blocks
  - Log error details
  - Send consistent error response format
  - Return appropriate HTTP status codes
```

**Error Response Format:**
```
{
  success: false,
  message: "Error description",
  error: "Error details",
  statusCode: 400
}
```

### Validation Middleware

**Process:**
```
  - Validate request body fields
  - Validate email format
  - Validate required fields
  - Validate data types
  - Return validation error if invalid
```

---

---

# FRONTEND MODULES DOCUMENTATION

## Frontend Overview
The frontend is built with **React** and uses **Socket.IO client** for real-time updates. It provides two separate interfaces: one for customers and one for admin staff.

---

## Frontend Module 1: Authentication & User Management

### Purpose
Handle user registration, login, logout, and protect routes based on authentication status.

### Responsibilities
- Display login/registration forms
- Authenticate users
- Store JWT token in localStorage/sessionStorage
- Protect routes
- Display user profile
- Handle logout

### Key Files to Create
```
frontend/
├── src/
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Profile.jsx
│   ├── components/
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── services/
│   │   └── authService.js
│   └── hooks/
│       └── useAuth.js
```

### AuthContext.jsx - State Management

**Context State:**
```
{
  user: {
    id,
    name,
    email,
    phone,
    role,
    address
  },
  token: String (JWT),
  isLoading: Boolean,
  isAuthenticated: Boolean,
  error: String
}
```

**Context Functions:**
```
1. login(email, password) - Authenticate user
2. register(name, email, password, phone, address, role) - Create account
3. logout() - Clear token and user
4. getCurrentUser() - Fetch current user from token
5. updateProfile(userData) - Update user info
```

### Login.jsx - Component

**Features:**
- Email and password input fields
- Validation before submission
- Error message display
- Link to register page
- Remember me option (optional)
- Loading indicator during login

**Process:**
```
  - User enters email and password
  - Click login button
  - Validate inputs
  - Call authService.login()
  - If successful:
    - Store token in localStorage
    - Set user in AuthContext
    - Redirect to dashboard
  - If failed:
    - Display error message
```

### Register.jsx - Component

**Features:**
- Name, email, password, phone, address input fields
- Password confirmation field
- Validation (email format, password strength)
- Error messages
- Link to login page
- Auto-select role as "customer"

**Process:**
```
  - User fills registration form
  - Click register button
  - Validate all fields
  - Check if email already exists (optional frontend check)
  - Call authService.register()
  - If successful:
    - Store token in localStorage
    - Set user in AuthContext
    - Redirect to menu page
  - If failed:
    - Display error message
```

### ProtectedRoute.jsx - Component

**Purpose:** Wrap routes that require authentication

**Process:**
```
  - Check if user is authenticated (token exists)
  - If yes, render component
  - If no, redirect to login page
  - Can also check for specific roles (customer/admin)
```

**Usage:**
```
<ProtectedRoute 
  component={Dashboard} 
  requiredRole="admin" 
/>
```

### authService.js - API Calls

**Functions:**
```
1. login(email, password)
   - POST /api/auth/login
   - Return: { token, user }
   - Store token in localStorage

2. register(userData)
   - POST /api/auth/register
   - Return: { token, user }
   - Store token in localStorage

3. logout()
   - Clear localStorage
   - Clear AuthContext

4. getCurrentUser()
   - GET /api/auth/me
   - Verify token is valid
   - Return: { user }

5. getToken()
   - Retrieve token from localStorage
   - Return token string

6. setAuthHeader()
   - Add token to all API requests
   - Set Authorization: "Bearer <token>"
```

### useAuth.js - Custom Hook

**Purpose:** Easy access to auth context in components

**Usage:**
```
const { user, token, isAuthenticated, login, logout } = useAuth();
```

---

## Frontend Module 2: Customer Menu & Cart

### Purpose
Display restaurant menu and allow customers to add items to cart.

### Responsibilities
- Fetch and display menu items
- Search and filter items by category
- Add items to cart
- Update item quantity in cart
- Remove items from cart
- Display cart summary

### Key Files to Create
```
frontend/
├── src/
│   ├── pages/
│   │   ├── Menu.jsx
│   │   └── Cart.jsx
│   ├── components/
│   │   ├── MenuCard.jsx
│   │   ├── CategoryFilter.jsx
│   │   ├── CartItem.jsx
│   │   └── CartSummary.jsx
│   ├── context/
│   │   └── CartContext.jsx
│   ├── services/
│   │   └── menuService.js
│   └── hooks/
│       └── useCart.js
```

### CartContext.jsx - State Management

**Context State:**
```
{
  cartItems: [
    {
      itemId,
      itemName,
      price,
      quantity,
      subtotal
    }
  ],
  totalItems: Number,
  totalAmount: Number,
  taxAmount: Number,
  deliveryAmount: Number,
  grandTotal: Number
}
```

**Context Functions:**
```
1. addToCart(itemId, itemName, price, quantity)
   - Add item or increase quantity if exists
   - Recalculate totals

2. removeFromCart(itemId)
   - Remove item from cart
   - Recalculate totals

3. updateQuantity(itemId, quantity)
   - Update item quantity
   - Recalculate totals

4. clearCart()
   - Empty cart
   - Reset totals

5. calculateTotals()
   - Calculate subtotal, tax, delivery, grand total
   - Tax = 5% of subtotal
   - Delivery = fixed amount (Rs. 50)

6. getCartSummary()
   - Return cart summary object
```

### Menu.jsx - Component

**Features:**
- Display all menu items in grid/list layout
- Category filter (Fast Food, Drinks, Desserts, etc.)
- Search functionality
- Item cards showing name, price, availability
- Add to cart button
- Real-time availability updates via WebSocket

**Layout:**
```
┌─────────────────────────────────┐
│     Search Bar                  │
├─────────────────────────────────┤
│  [All] [Fast Food] [Drinks]...  │ ← Categories
├─────────────────────────────────┤
│  ┌──────┐ ┌──────┐ ┌──────┐    │
│  │ Item │ │ Item │ │ Item │    │
│  │      │ │      │ │      │    │
│  └──────┘ └──────┘ └──────┘    │
│  ┌──────┐ ┌──────┐ ┌──────┐    │
│  │ Item │ │ Item │ │ Item │    │
│  │      │ │      │ │      │    │
│  └──────┘ └──────┘ └──────┘    │
└─────────────────────────────────┘
```

**Process:**
```
  1. Component mounts
     - Fetch all menu items from API
     - Display items in grid
  2. User clicks category
     - Filter items by category
     - Refresh display
  3. User types in search
     - Filter items by search term
     - Show matching items
  4. User clicks "Add to Cart"
     - Prompt quantity input
     - Add to cart context
     - Show success message
  5. Real-time update:
     - Listen to WebSocket "menu-updated" event
     - Update availability status immediately
```

### Cart.jsx - Component

**Features:**
- Display all items in cart
- Quantity adjustment buttons (+ / -)
- Remove item button
- Cart summary (subtotal, tax, delivery, total)
- Proceed to checkout button
- Empty cart message if no items

**Layout:**
```
┌─────────────────────────────────┐
│         SHOPPING CART           │
├─────────────────────────────────┤
│ Item Name    Qty  Price  Subtotal│
│ Burger       2    Rs.200  Rs.400│
│ Coke         1    Rs.100  Rs.100│
│ Fries        2    Rs.150  Rs.300│
│ [Remove] buttons for each       │
├─────────────────────────────────┤
│ Subtotal:           Rs. 800     │
│ Tax (5%):           Rs. 40      │
│ Delivery:           Rs. 50      │
│ ─────────────────────────────   │
│ Grand Total:        Rs. 890     │
├─────────────────────────────────┤
│     [PROCEED TO CHECKOUT]       │
└─────────────────────────────────┘
```

**Process:**
```
  1. User updates quantity
     - Click + or - button
     - Update quantity in CartContext
     - Recalculate totals
  2. User removes item
     - Click remove button
     - Remove from CartContext
     - Recalculate totals
  3. User clicks checkout
     - Navigate to checkout page
```

### MenuCard.jsx - Component

**Props:**
```
{
  itemId,
  itemName,
  price,
  description,
  category,
  availability,
  preparationTime,
  onAddToCart (callback)
}
```

**Features:**
- Display item image (if available)
- Show item name, price
- Show availability status (in stock / out of stock)
- Show preparation time
- Add to cart button (disabled if unavailable)

### menuService.js - API Calls

**Functions:**
```
1. fetchAllMenuItems()
   - GET /api/menu
   - Return: Array of menu items

2. fetchMenuItemById(itemId)
   - GET /api/menu/:id
   - Return: Single menu item

3. searchMenuItems(query)
   - GET /api/menu?search=query
   - Return: Filtered items

4. filterByCategory(category)
   - GET /api/menu?category=category
   - Return: Items in category
```

### useCart.js - Custom Hook

**Usage:**
```
const { 
  cartItems, 
  addToCart, 
  removeFromCart, 
  updateQuantity,
  getCartSummary 
} = useCart();
```

---

## Frontend Module 3: Customer Checkout & Order Placement

### Purpose
Allow customers to enter delivery details and place orders.

### Responsibilities
- Collect customer delivery information
- Display order summary
- Place order via API
- Display order confirmation
- Store order reference for tracking

### Key Files to Create
```
frontend/
├── src/
│   ├── pages/
│   │   ├── Checkout.jsx
│   │   └── OrderConfirmation.jsx
│   ├── components/
│   │   ├── DeliveryForm.jsx
│   │   └── OrderSummary.jsx
│   ├── services/
│   │   └── orderService.js
│   └── hooks/
│       └── useOrder.js
```

### Checkout.jsx - Component

**Features:**
- Display order items and cart summary
- Delivery address form
- Special instructions textarea
- Place order button
- Order summary side panel
- Validation error messages

**Layout:**
```
┌──────────────────────────────────────────┐
│  ┌──────────────────┐ ┌──────────────┐  │
│  │  DELIVERY INFO   │ │ ORDER SUMMARY│  │
│  │                  │ │              │  │
│  │ Name: [______]   │ │ Burger x2    │  │
│  │ Phone: [______]  │ │ Coke x1      │  │
│  │ Address:         │ │ Fries x2     │  │
│  │ [____________]   │ │              │  │
│  │ [____________]   │ │ Subtotal Rs.800│  │
│  │                  │ │ Tax:     Rs.40 │  │
│  │ Special Notes:   │ │ Delivery: Rs.50│  │
│  │ [____________]   │ │ Total:   Rs.890│  │
│  │                  │ │              │  │
│  │ [PLACE ORDER]    │ │              │  │
│  └──────────────────┘ └──────────────┘  │
└──────────────────────────────────────────┘
```

**Process:**
```
  1. Component mounts
     - Fetch cart items from CartContext
     - Calculate totals
     - Display order summary
  2. User fills delivery form
     - Name, Phone, Address fields
     - Optional: Special instructions
  3. User clicks "Place Order"
     - Validate all fields
     - Call orderService.createOrder()
     - Show loading indicator
  4. Order created successfully
     - Clear cart
     - Show confirmation with orderId
     - Store orderId in localStorage
     - Redirect to order tracking page
  5. Order creation failed
     - Display error message
     - Allow retry
```

### DeliveryForm.jsx - Component

**Props:**
```
{
  onSubmit (callback with form data),
  isLoading (boolean)
}
```

**Form Fields:**
```
- Customer Name (required, min 3 chars)
- Phone Number (required, 10-11 digits)
- Delivery Address (required, min 10 chars)
- Special Instructions (optional, max 200 chars)
```

**Validation:**
```
- Name: Not empty, min 3 characters
- Phone: Valid phone number format
- Address: Not empty, min 10 characters
- Show validation errors below each field
```

### OrderConfirmation.jsx - Component

**Features:**
- Display order confirmation message
- Show order ID, amount, delivery address
- Display estimated delivery time
- Button to track order
- Button to continue shopping

**Layout:**
```
┌────────────────────────────────┐
│    ✓ ORDER CONFIRMED           │
├────────────────────────────────┤
│ Order ID: ORD-20250127-001    │
│ Total Amount: Rs. 890          │
│ Delivery Address:              │
│ House 45, Street 5, Area       │
│                                │
│ Estimated Delivery Time:       │
│ 30-40 minutes                  │
│                                │
│ [TRACK ORDER]  [CONTINUE]     │
└────────────────────────────────┘
```

### orderService.js - API Calls

**Functions:**
```
1. createOrder(orderData)
   - POST /api/orders
   - Input: {
       items: [{ itemId, quantity }],
       customerName,
       customerPhone,
       deliveryAddress,
       notes
     }
   - Return: { orderId, order }
   - Store orderId in localStorage

2. fetchMyOrders()
   - GET /api/orders/my-orders
   - Return: Array of customer's orders

3. fetchOrderById(orderId)
   - GET /api/orders/:id
   - Return: Single order with details

4. cancelOrder(orderId)
   - DELETE /api/orders/:id
   - Return: { message }
```

### useOrder.js - Custom Hook

**Usage:**
```
const { 
  orders, 
  createOrder, 
  fetchMyOrders, 
  cancelOrder,
  isLoading 
} = useOrder();
```

---

## Frontend Module 4: Customer Order Tracking

### Purpose
Allow customers to track their order status in real-time.

### Responsibilities
- Display current order status
- Show status timeline (Pending → Preparing → Ready → Delivered)
- Update status in real-time via WebSocket
- Display estimated time
- Show order details
- Cancel order if allowed

### Key Files to Create
```
frontend/
├── src/
│   ├── pages/
│   │   └── OrderTracking.jsx
│   ├── components/
│   │   ├── OrderStatusTimeline.jsx
│   │   ├── OrderDetails.jsx
│   │   └── RealTimeUpdate.jsx
│   ├── services/
│   │   └── socketService.js
│   └── hooks/
│       └── useOrderTracking.js
```

### OrderTracking.jsx - Component

**Features:**
- Fetch order by orderId (from localStorage or URL param)
- Display order details (items, total, address)
- Show status timeline with visual indicators
- Display estimated delivery time
- Real-time status updates via WebSocket
- Cancel order button (only if Pending/Preparing)
- Download invoice button (if Delivered)

**Layout:**
```
┌──────────────────────────────────────┐
│   Order ID: ORD-20250127-001        │
├──────────────────────────────────────┤
│   Status Timeline:                   │
│                                      │
│   ● ─── ● ─── ● ─── ○ ─── ○        │
│   Pending Preparing Ready Delivered │
│          ↑ (Current)                │
│                                      │
│   Estimated Time: 15 minutes         │
├──────────────────────────────────────┤
│   ORDER DETAILS:                     │
│   Burger x2        Rs. 400          │
│   Coke x1          Rs. 100          │
│   Fries x2         Rs. 300          │
│   ─────────────────────────         │
│   Subtotal:        Rs. 800          │
│   Tax (5%):        Rs. 40           │
│   Delivery:        Rs. 50           │
│   Total:           Rs. 890          │
├──────────────────────────────────────┤
│   Delivery Address:                  │
│   House 45, Street 5, Area          │
├──────────────────────────────────────┤
│   [CANCEL]  [DOWNLOAD INVOICE]     │
└──────────────────────────────────────┘
```

**Process:**
```
  1. Component mounts
     - Get orderId from localStorage or URL
     - Fetch order details from API
     - Display order info
  2. Setup WebSocket connection
     - Connect to server
     - Join order-specific room (orderId)
     - Listen for status updates
  3. Status update received
     - Update order status
     - Animate timeline
     - Show timestamp
  4. User clicks Cancel
     - Show confirmation dialog
     - Call cancelOrder API
     - Update status to Cancelled
  5. Order Delivered
     - Show invoice download button
     - Allow invoice view/download
  6. Component unmounts
     - Disconnect WebSocket
     - Clean up
```

### OrderStatusTimeline.jsx - Component

**Props:**
```
{
  status: "Pending" | "Preparing" | "Ready" | "Delivered",
  timestamps: {
    pendingAt,
    preparingAt,
    readyAt,
    deliveredAt
  }
}
```

**Features:**
- Visual timeline with icons/circles
- Highlight current status
- Show completion checkmarks for past statuses
- Display time for each status

### socketService.js - WebSocket Setup

**Functions:**
```
1. connectSocket(token)
   - Initialize Socket.IO connection
   - Authenticate with JWT token
   - Return socket instance

2. joinOrderRoom(orderId)
   - Emit "customer-join-order" event
   - Join order-specific room
   - Listen for updates

3. onOrderStatusUpdate(callback)
   - Listen for "order-status-updated" event
   - Call callback with new status

4. disconnectSocket()
   - Close WebSocket connection
   - Clean up
```

### useOrderTracking.js - Custom Hook

**Usage:**
```
const { 
  order, 
  status, 
  estimatedTime,
  cancelOrder,
  downloadInvoice
} = useOrderTracking(orderId);
```

---

## Frontend Module 5: Admin Dashboard

### Purpose
Provide admin staff with interface to manage orders and view statistics.

### Responsibilities
- Display all orders with filters
- Show order status filters
- Update order status
- View order details
- Display daily statistics
- See real-time new orders

### Key Files to Create
```
frontend/
├── src/
│   ├── pages/
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminOrders.jsx
│   │   └── AdminStats.jsx
│   ├── components/
│   │   ├── OrderCard.jsx
│   │   ├── OrderList.jsx
│   │   ├── StatusFilter.jsx
│   │   ├── StatCard.jsx
│   │   └── NewOrderAlert.jsx
│   ├── services/
│   │   └── adminService.js
│   └── hooks/
│       └── useAdmin.js
```

### AdminDashboard.jsx - Component

**Features:**
- Display dashboard statistics (Today's orders, revenue, pending orders)
- Show new orders in real-time
- Filter orders by status
- View detailed order information
- Update order status
- Search orders by order ID or customer name

**Layout:**
```
┌────────────────────────────────────────┐
│       ADMIN DASHBOARD                  │
├────────────────────────────────────────┤
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│  │Today │ │Revenue│ │Pending│ │Completed
│  │  15  │ │Rs.5000│ │  5   │ │  10   │
│  │Orders│ │      │ │Orders│ │Orders │
│  └──────┘ └──────┘ └──────┘ └──────┘ │
├────────────────────────────────────────┤
│  Filter: [All] [Pending] [Preparing]  │
│          [Ready] [Delivered] [Cancelled]│
│                                        │
│  ┌────────────────────────────────┐   │
│  │ ORDER ID  │ CUSTOMER │ STATUS  │   │
│  │ ORD-001   │ Ahmed    │ Pending │   │
│  │ ORD-002   │ Ali      │ Preparing│   │
│  │ ORD-003   │ Fatima   │ Ready   │   │
│  │ ORD-004   │ Hassan   │ Delivered│  │
│  └────────────────────────────────┘   │
└────────────────────────────────────────┘
```

**Process:**
```
  1. Component mounts
     - Fetch all orders from API
     - Fetch dashboard statistics
     - Display orders table
  2. Setup WebSocket for real-time updates
     - Listen for "new-order" event
     - Play sound notification
     - Add new order to list (top)
     - Update order count
  3. User clicks status filter
     - Filter orders by status
     - Update display
  4. User clicks order
     - Show order detail modal/page
     - Display full order info
     - Show status update options
  5. User updates order status
     - Click status dropdown
     - Select new status
     - Call admin API to update
     - Show loading indicator
     - Update display with new status
     - Emit WebSocket to customer (status updated)
  6. New order received
     - Play notification sound
     - Show pop-up alert
     - Add to pending orders list
```

### AdminOrders.jsx - Component

**Features:**
- Display orders in table/list format
- Sortable columns (Order ID, Time, Status, Amount)
- Filter by status
- Search by order ID or customer name
- Click to expand order details
- Update order status from here

**Layout:**
```
┌────────────────────────────────────────┐
│ Search: [__________]                   │
│ Filter: [Status ▼]                     │
├────────────────────────────────────────┤
│ Order ID │ Customer │ Time │ Status │  │
│ ────────────────────────────────────── │
│ ORD-001  │ Ahmed    │ 2:30 │ Pending   │
│          │ Click to expand details     │
│                                        │
│ ORD-002  │ Ali      │ 2:45 │ Preparing │
│          │ Click to expand details     │
└────────────────────────────────────────┘
```

### OrderCard.jsx - Component

**Props:**
```
{
  orderId,
  customerName,
  totalAmount,
  status,
  createdAt,
  itemCount,
  onStatusChange (callback),
  onClick (callback)
}
```

**Features:**
- Display compact order information
- Show visual status indicator
- Time elapsed since order creation
- Quick status change dropdown
- Click to view full details

### StatCard.jsx - Component

**Props:**
```
{
  title: "Today's Orders",
  value: 15,
  icon: "cart",
  trend: "+3 from yesterday"
}
```

**Features:**
- Display stat with icon
- Show trend information
- Color coding by status

### adminService.js - API Calls

**Functions:**
```
1. fetchAllOrders(filters)
   - GET /api/orders
   - Params: status, date range
   - Return: Array of orders

2. fetchOrderById(orderId)
   - GET /api/orders/:id
   - Return: Single order with details

3. updateOrderStatus(orderId, newStatus)
   - PATCH /api/orders/:id/status
   - Input: { orderStatus: newStatus }
   - Return: { message, order }

4. getDashboardStats()
   - GET /api/admin/dashboard
   - Return: { totalOrders, totalRevenue, pendingOrders }

5. getTodayOrders()
   - GET /api/admin/orders/today
   - Return: Array of today's orders

6. getOrdersByStatus(status)
   - GET /api/admin/orders/status/:status
   - Return: Array of orders with that status
```

### useAdmin.js - Custom Hook

**Usage:**
```
const { 
  orders, 
  stats,
  updateOrderStatus, 
  fetchAllOrders,
  isLoading 
} = useAdmin();
```

---

## Frontend Module 6: Invoice Management

### Purpose
Allow customers to view and download invoices for completed orders.

### Responsibilities
- Display invoice in browser
- Download invoice as PDF
- Show invoice details
- Print invoice

### Key Files to Create
```
frontend/
├── src/
│   ├── pages/
│   │   └── Invoice.jsx
│   ├── components/
│   │   └── InvoicePrint.jsx
│   └── services/
│       └── invoiceService.js
```

### Invoice.jsx - Component

**Features:**
- Display invoice for delivered order
- Show restaurant info, items, totals
- Download as PDF button
- Print button
- Email invoice option (optional)

**Layout:**
```
┌────────────────────────────────┐
│   RESTAURANT INVOICE           │
├────────────────────────────────┤
│                                │
│   Restaurant Name              │
│   Address: ...                 │
│   Phone: ...                   │
│                                │
├────────────────────────────────┤
│                                │
│   Invoice ID: INV-001          │
│   Order ID: ORD-001            │
│   Date: 27-Jan-2025            │
│   Customer: Ahmed              │
│                                │
├────────────────────────────────┤
│   Items:                       │
│   Burger x2      Rs. 400       │
│   Coke x1        Rs. 100       │
│   Fries x2       Rs. 300       │
│                                │
│   Subtotal:      Rs. 800       │
│   Tax (5%):      Rs. 40        │
│   Delivery:      Rs. 50        │
│   ─────────────────────────    │
│   TOTAL:         Rs. 890       │
│                                │
│   Payment Method: Cash          │
│   Status: Paid                 │
│                                │
│   Thank you for your order!    │
├────────────────────────────────┤
│  [DOWNLOAD PDF] [PRINT]        │
└────────────────────────────────┘
```

**Process:**
```
  1. Component mounts
     - Get orderId from props
     - Fetch invoice from API
     - Display invoice
  2. User clicks "Download PDF"
     - Call invoiceService.downloadInvoice()
     - Browser downloads PDF file
  3. User clicks "Print"
     - Open print dialog
     - Print invoice
```

### InvoicePrint.jsx - Component

**Purpose:** Format invoice for printing/PDF generation

**Features:**
- Clean, professional layout
- Optimized for printing
- Hide buttons on print
- Use web-safe fonts

### invoiceService.js - API Calls

**Functions:**
```
1. fetchInvoice(invoiceId)
   - GET /api/invoices/:id
   - Return: Invoice object

2. downloadInvoice(invoiceId)
   - GET /api/invoices/:id/download
   - Download PDF file
   - Trigger browser download

3. fetchMyInvoices()
   - GET /api/invoices
   - Return: Array of customer's invoices

4. generateClientSidePDF(invoiceData)
   - Use jsPDF or similar library
   - Generate PDF from invoice data
   - Trigger download
```

---

## Frontend Module 7: WebSocket Real-Time Updates

### Purpose
Handle all real-time communication between frontend and backend.

### Responsibilities
- Initialize WebSocket connection
- Listen for order updates
- Receive menu availability changes
- Handle notifications
- Manage socket lifecycle

### Key Files to Create
```
frontend/
├── src/
│   ├── socket/
│   │   ├── socketConfig.js
│   │   └── socketEvents.js
│   ├── context/
│   │   └── SocketContext.jsx
│   ├── hooks/
│   │   └── useSocket.js
│   └── utils/
│       └── notificationManager.js
```

### socketConfig.js - Setup

**Functions:**
```
1. initializeSocket(token)
   - Create Socket.IO instance
   - Pass JWT token in headers
   - Set up event listeners
   - Return socket instance

2. disconnectSocket()
   - Close connection
   - Clean up listeners
```

**Configuration:**
```
{
  url: process.env.REACT_APP_API_URL,
  auth: {
    token: JWT_TOKEN
  },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
}
```

### socketEvents.js - Event Handlers

**Customer Events:**

1. **Receive Order Status Update**
```
Event: "order-status-updated"
Data: { orderId, status, updatedAt }
Handler: Update local order state, trigger UI update
```

2. **Receive Menu Update**
```
Event: "menu-updated"
Data: { itemId, availability }
Handler: Update menu display, gray out unavailable items
```

3. **Receive Notification**
```
Event: "notification"
Data: { message, type }
Handler: Show toast notification, play sound
```

**Admin Events:**

1. **Receive New Order**
```
Event: "new-order"
Data: { order, orderId, customerName, totalAmount }
Handler: Add to pending orders, play notification, update count
```

2. **Order Cancelled**
```
Event: "order-cancelled"
Data: { orderId }
Handler: Remove from active orders, update list
```

### SocketContext.jsx - Context

**State:**
```
{
  socket: Socket instance,
  isConnected: Boolean,
  notifications: Array,
  newOrders: Array
}
```

**Functions:**
```
1. emit(eventName, data) - Send event to server
2. on(eventName, callback) - Listen for event
3. off(eventName) - Stop listening
4. addNotification(notification) - Add to notifications
5. clearNotifications() - Clear all notifications
```

### useSocket.js - Custom Hook

**Usage:**
```
const { socket, isConnected, emit, on } = useSocket();

// Listen for status updates
on("order-status-updated", (data) => {
  console.log("Order updated:", data);
});

// Emit event
emit("customer-join-order", { orderId });
```

### notificationManager.js - Utils

**Functions:**
```
1. showNotification(title, options)
   - Use browser Notifications API
   - Show desktop notification

2. playSound(soundFile)
   - Play audio for new order alert

3. showToast(message, type)
   - Display toast notification
```

---

## Frontend Module 8: Routing & Navigation

### Purpose
Handle page navigation and route management.

### Key Files to Create
```
frontend/
├── src/
│   ├── App.jsx
│   ├── routes/
│   │   ├── customerRoutes.jsx
│   │   └── adminRoutes.jsx
│   └── components/
│       ├── Navbar.jsx
│       └── Sidebar.jsx
```

### App.jsx - Main Router

**Routes:**
```
Customer Routes:
  /login - Login page
  /register - Registration page
  /menu - Browse menu
  /cart - View cart
  /checkout - Checkout page
  /order/:orderId - Order tracking
  /invoices - View invoices
  /invoices/:id - View single invoice
  /profile - Customer profile

Admin Routes:
  /admin/dashboard - Dashboard
  /admin/orders - Orders management
  /admin/orders/:id - Order details
  /admin/menu - Menu management
  /admin/stats - Statistics
```

**Route Protection:**
```
- Public routes: /login, /register
- Customer routes: /menu, /cart, /checkout, /order, /invoices (protected, role: customer)
- Admin routes: /admin/* (protected, role: admin)
- Redirect to login if not authenticated
- Redirect to appropriate dashboard based on role
```

---

## Frontend Module 9: Styling & UI Components

### Purpose
Maintain consistent UI/UX across the application.

### Key Files to Create
```
frontend/
├── src/
│   ├── styles/
│   │   ├── global.css
│   │   ├── variables.css
│   │   └── responsive.css
│   └── components/
│       ├── common/
│       │   ├── Button.jsx
│       │   ├── Modal.jsx
│       │   ├── Toast.jsx
│       │   ├── Spinner.jsx
│       │   └── Input.jsx
│       └── layout/
│           ├── Header.jsx
│           └── Footer.jsx
```

### Design System

**Colors:**
```
Primary: #FF6B35 (Orange - Action)
Secondary: #004E89 (Blue - Accent)
Success: #06A77D (Green)
Error: #D62828 (Red)
Warning: #F77F00 (Orange)
Neutral: #EEEEEE (Light Gray)
Dark: #222222 (Text)
```

**Typography:**
```
Headings: Poppins Bold (18px, 24px, 32px)
Body: Inter Regular (14px, 16px)
Button: Inter Medium (14px)
```

---

---

# DATABASE SCHEMA

## Complete MongoDB Collections

### Users Collection
```
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: String,
  role: "customer" | "admin",
  createdAt: Date,
  updatedAt: Date
}

Indexes:
  - email (unique)
  - role
```

### MenuItems Collection
```
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String,
  availability: Boolean,
  image: String,
  preparationTime: Number,
  createdAt: Date,
  updatedAt: Date
}

Indexes:
  - category
  - availability
```

### Orders Collection
```
{
  _id: ObjectId,
  orderId: String (unique),
  customerId: ObjectId (ref: Users),
  items: [{
    itemId: ObjectId,
    itemName: String,
    quantity: Number,
    price: Number,
    subtotal: Number
  }],
  totalAmount: Number,
  taxAmount: Number,
  deliveryAmount: Number,
  grandTotal: Number,
  customerName: String,
  customerPhone: String,
  deliveryAddress: String,
  orderStatus: "Pending" | "Preparing" | "Ready" | "Delivered" | "Cancelled",
  paymentMethod: "Cash on Delivery",
  paymentStatus: "Pending" | "Paid",
  notes: String,
  createdAt: Date,
  updatedAt: Date
}

Indexes:
  - orderId (unique)
  - customerId
  - orderStatus
  - createdAt
```

### Invoices Collection
```
{
  _id: ObjectId,
  invoiceId: String (unique),
  orderId: ObjectId (ref: Orders),
  customerId: ObjectId (ref: Users),
  customerName: String,
  customerEmail: String,
  restaurantName: String,
  restaurantAddress: String,
  items: [{
    itemName: String,
    quantity: Number,
    price: Number,
    subtotal: Number
  }],
  subtotal: Number,
  taxAmount: Number,
  deliveryAmount: Number,
  grandTotal: Number,
  paymentMethod: String,
  paymentStatus: String,
  invoiceDate: Date,
  notes: String,
  createdAt: Date
}

Indexes:
  - invoiceId (unique)
  - orderId
  - customerId
```

---

---

# API ENDPOINTS REFERENCE

## Authentication Endpoints

```
POST /api/auth/register
  Body: { name, email, password, phone, address, role }
  Response: { success, token, user }
  Status: 201

POST /api/auth/login
  Body: { email, password }
  Response: { success, token, user }
  Status: 200

GET /api/auth/me
  Headers: Authorization: Bearer <token>
  Response: { success, user }
  Status: 200

POST /api/auth/logout
  Headers: Authorization: Bearer <token>
  Response: { success, message }
  Status: 200
```

## Menu Endpoints

```
GET /api/menu
  Query: ?category=Fast Food&search=burger
  Response: { success, items: [] }
  Status: 200

GET /api/menu/:id
  Response: { success, item: {} }
  Status: 200

POST /api/menu
  Auth: Admin only
  Body: { name, description, price, category, availability, preparationTime }
  Response: { success, item: {} }
  Status: 201

PUT /api/menu/:id
  Auth: Admin only
  Body: { updated fields }
  Response: { success, item: {} }
  Status: 200

DELETE /api/menu/:id
  Auth: Admin only
  Response: { success, message }
  Status: 200

PATCH /api/menu/:id/availability
  Auth: Admin only
  Body: { availability: true/false }
  Response: { success, item: {} }
  Status: 200
```

## Order Endpoints

```
POST /api/orders
  Auth: Required
  Body: { items, customerName, customerPhone, deliveryAddress, notes }
  Response: { success, order, orderId }
  Status: 201

GET /api/orders
  Auth: Admin only
  Query: ?status=Pending&date=2025-01-27
  Response: { success, orders: [] }
  Status: 200

GET /api/orders/my-orders
  Auth: Required (Customer)
  Response: { success, orders: [] }
  Status: 200

GET /api/orders/:id
  Auth: Required
  Response: { success, order: {} }
  Status: 200

PATCH /api/orders/:id/status
  Auth: Admin only
  Body: { orderStatus: "Preparing" }
  Response: { success, order: {} }
  Status: 200

DELETE /api/orders/:id
  Auth: Required (Customer)
  Response: { success, message }
  Status: 200
```

## Invoice Endpoints

```
POST /api/invoices/generate/:orderId
  Auth: Admin only
  Response: { success, invoiceId }
  Status: 201

GET /api/invoices/:id
  Auth: Required
  Response: { success, invoice: {} }
  Status: 200

GET /api/invoices
  Auth: Required (Customer)
  Response: { success, invoices: [] }
  Status: 200

GET /api/invoices/:id/download
  Auth: Required
  Response: PDF file
  Status: 200
```

## Admin Endpoints

```
GET /api/admin/dashboard
  Auth: Admin only
  Response: { success, stats: { totalOrders, totalRevenue, pendingOrders } }
  Status: 200

GET /api/admin/orders/today
  Auth: Admin only
  Response: { success, orders: [] }
  Status: 200

GET /api/admin/orders/status/:status
  Auth: Admin only
  Response: { success, orders: [] }
  Status: 200
```

---

# WEBSOCKET EVENTS REFERENCE

## Connection Events

```
connect
  - Fired when client connects to server
  - Authenticate with JWT token

disconnect
  - Fired when client disconnects
  - Clean up listeners

connection_error
  - Fired on connection error
  - Handle authentication failure
```

## Order Events

```
new-order
  From: Server → Admin
  Data: { order, orderId, customerName, totalAmount, createdAt }
  When: New order created

order-status-updated
  From: Server → Customer & Admin
  Data: { orderId, status, updatedAt }
  When: Order status changed

customer-join-order
  From: Customer → Server
  Data: { orderId, customerId }
  When: Customer loads order tracking page

admin-acknowledge-order
  From: Admin → Server
  Data: { orderId }
  When: Admin clicks "Received" on order

order-cancelled
  From: Server → Admin
  Data: { orderId, reason }
  When: Order cancelled by customer
```

## Menu Events

```
menu-updated
  From: Server → All Customers
  Data: { itemId, availability }
  When: Admin changes item availability

menu-item-added
  From: Server → All Customers
  Data: { item }
  When: Admin adds new item

menu-item-deleted
  From: Server → All Customers
  Data: { itemId }
  When: Admin deletes item
```

## Notification Events

```
notification
  From: Server → Client
  Data: { message, type, title }
  When: Important event occurs

notification-sound
  From: Client
  Action: Play sound
  When: New order for admin
```

---

---

# FOLDER STRUCTURE

## Complete Backend Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js (MongoDB connection)
│   │   ├── dotenv.js (environment variables)
│   │   └── constants.js (constants)
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── MenuItem.js
│   │   ├── Order.js
│   │   └── Invoice.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── menuController.js
│   │   ├── orderController.js
│   │   ├── invoiceController.js
│   │   ├── adminController.js
│   │   └── userController.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── menuRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── invoiceRoutes.js
│   │   └── adminRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js (JWT verification)
│   │   ├── errorHandler.js (error handling)
│   │   ├── validationMiddleware.js (input validation)
│   │   └── socketAuthMiddleware.js (WebSocket auth)
│   │
│   ├── services/
│   │   ├── orderService.js (business logic)
│   │   ├── invoiceService.js
│   │   └── dashboardService.js
│   │
│   ├── socket/
│   │   ├── socketServer.js (Socket.IO setup)
│   │   ├── handlers/
│   │   │   ├── orderEvents.js
│   │   │   ├── menuEvents.js
│   │   │   └── notificationEvents.js
│   │   ├── middleware/
│   │   │   └── socketAuthMiddleware.js
│   │   └── manager.js (socket utilities)
│   │
│   ├── utils/
│   │   ├── apiResponse.js (response format)
│   │   ├── apiError.js (error class)
│   │   ├── orderUtils.js (helper functions)
│   │   ├── tokenGenerator.js (JWT)
│   │   ├── pdfGenerator.js (invoice PDF)
│   │   └── emailService.js (optional)
│   │
│   ├── validators/
│   │   ├── authValidator.js
│   │   ├── orderValidator.js
│   │   └── menuValidator.js
│   │
│   └── app.js (Express app setup)
│
├── .env (environment variables)
├── .env.example
├── server.js (entry point)
├── package.json
└── README.md
```

## Complete Frontend Folder Structure

```
frontend/
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── pages/
│   │   ├── customer/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Menu.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderTracking.jsx
│   │   │   ├── OrderConfirmation.jsx
│   │   │   ├── Invoice.jsx
│   │   │   └── Profile.jsx
│   │   │
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminOrders.jsx
│   │       ├── AdminMenu.jsx
│   │       ├── AdminStats.jsx
│   │       └── OrderDetail.jsx
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   │
│   │   ├── customer/
│   │   │   ├── MenuCard.jsx
│   │   │   ├── CategoryFilter.jsx
│   │   │   ├── CartItem.jsx
│   │   │   ├── CartSummary.jsx
│   │   │   ├── DeliveryForm.jsx
│   │   │   ├── OrderSummary.jsx
│   │   │   ├── OrderStatusTimeline.jsx
│   │   │   ├── OrderDetails.jsx
│   │   │   ├── InvoicePrint.jsx
│   │   │   └── RealTimeUpdate.jsx
│   │   │
│   │   └── admin/
│   │       ├── OrderCard.jsx
│   │       ├── OrderList.jsx
│   │       ├── StatusFilter.jsx
│   │       ├── StatCard.jsx
│   │       ├── NewOrderAlert.jsx
│   │       └── OrderDetailModal.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── SocketContext.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   ├── useOrder.js
│   │   ├── useAdmin.js
│   │   ├── useOrderTracking.js
│   │   └── useSocket.js
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── menuService.js
│   │   ├── orderService.js
│   │   ├── invoiceService.js
│   │   ├── adminService.js
│   │   └── api.js (axios instance)
│   │
│   ├── socket/
│   │   ├── socketConfig.js
│   │   ├── socketEvents.js
│   │   └── socketManager.js
│   │
│   ├── styles/
│   │   ├── global.css
│   │   ├── variables.css
│   │   ├── responsive.css
│   │   └── components.css
│   │
│   ├── utils/
│   │   ├── notificationManager.js
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── constants.js
│   │
│   ├── routes/
│   │   ├── customerRoutes.jsx
│   │   ├── adminRoutes.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── App.jsx
│   └── index.js
│
├── .env (environment variables)
├── .env.example
├── package.json
├── tailwind.config.js (if using Tailwind)
└── README.md
```

---

---

# SETUP & INSTALLATION GUIDE

## Backend Setup

### Step 1: Initialize Project
```bash
mkdir restaurant-app-backend
cd restaurant-app-backend
npm init -y
```

### Step 2: Install Dependencies
```bash
npm install express cors dotenv mongoose bcryptjs jsonwebtoken socket.io
npm install --save-dev nodemon
```

### Step 3: Create .env File
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/restaurant_db
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### Step 4: Create folder structure
```bash
mkdir -p src/config src/models src/controllers src/routes src/middleware src/services src/socket src/utils src/validators
```

### Step 5: Create app.js
```javascript
const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/menu", require("./routes/menuRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/invoices", require("./routes/invoiceRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// WebSocket
require("./socket/socketServer")(io);

module.exports = { app, server, io };
```

### Step 6: Create server.js
```javascript
const { server } = require("./src/app");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Step 7: Update package.json scripts
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### Step 8: Run Backend
```bash
npm run dev
```

---

## Frontend Setup

### Step 1: Create React App
```bash
npx create-react-app restaurant-app-frontend
cd restaurant-app-frontend
```

### Step 2: Install Dependencies
```bash
npm install axios socket.io-client react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 3: Create .env File
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Step 4: Create folder structure
```bash
mkdir -p src/pages/customer src/pages/admin src/components/common src/components/customer src/components/admin
mkdir -p src/context src/hooks src/services src/socket src/styles src/utils src/routes
```

### Step 5: Create index.js
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Step 6: Run Frontend
```bash
npm start
```

---

---

## Implementation Order (Recommended)

### Backend Implementation Order:
1. **Authentication Module** - Login/Register
2. **Menu Management Module** - Menu CRUD
3. **Order Management Module** - Core logic
4. **Invoice Module** - Bill generation
5. **WebSocket Module** - Real-time updates
6. **Admin Module** - Statistics & filters
7. **Error Handling** - Consistent error responses

### Frontend Implementation Order:
1. **Authentication Module** - Login/Register
2. **Menu Module** - Browse menu
3. **Cart Module** - Add to cart
4. **Checkout Module** - Place order
5. **Order Tracking Module** - Real-time updates
6. **Invoice Module** - View/Download
7. **Admin Dashboard** - Manage orders
8. **WebSocket Integration** - Real-time communication

---

---

## Quick Reference: Key Files to Code

**Backend Priority Files:**
- `src/models/User.js` - User schema
- `src/models/Order.js` - Order schema
- `src/controllers/authController.js` - Auth logic
- `src/controllers/orderController.js` - Order logic
- `src/socket/socketServer.js` - WebSocket setup
- `src/middleware/authMiddleware.js` - JWT verification

**Frontend Priority Files:**
- `src/context/AuthContext.jsx` - Auth state
- `src/context/CartContext.jsx` - Cart state
- `src/pages/customer/Menu.jsx` - Menu page
- `src/pages/customer/Checkout.jsx` - Checkout
- `src/pages/customer/OrderTracking.jsx` - Real-time tracking
- `src/pages/admin/AdminDashboard.jsx` - Admin panel

---

This complete documentation provides a clear roadmap for building your restaurant app. Start with authentication on both backend and frontend, then move to menu management, and finally implement the order management system with real-time WebSocket updates.

Good luck with your project! 🚀
