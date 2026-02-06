# Promotr Admin Panel - Backend Server

> Node.js/Express backend API for the Promotr Admin Panel

![Node.js](https://img.shields.io/badge/Node.js-Latest-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=flat&logo=mongodb&logoColor=white)

## 📋 Overview

This is the backend server for the Promotr Admin Panel. It provides RESTful APIs for user management, job operations, financial transactions, KYC verification, and administrative functions.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB or PostgreSQL (database)

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   Create a `.env` file in the Server directory:

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database
   DATABASE_URL=mongodb://localhost:27017/promotr-admin
   # OR for PostgreSQL
   # DATABASE_URL=postgresql://user:password@localhost:5432/promotr_admin

   # Authentication
   JWT_SECRET=your_super_secret_jwt_key_change_this
   JWT_EXPIRE=7d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRE=30d

   # CORS
   CLIENT_URL=http://localhost:5173

   # File Upload
   MAX_FILE_SIZE=5242880
   UPLOAD_PATH=./uploads

   # Email Configuration (for notifications)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password

   # Payment Gateway (example)
   PAYMENT_GATEWAY_KEY=your_payment_key
   PAYMENT_GATEWAY_SECRET=your_payment_secret

   # AWS S3 (for file storage - optional)
   AWS_ACCESS_KEY_ID=your_aws_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret
   AWS_BUCKET_NAME=promotr-uploads
   AWS_REGION=us-east-1
   ```

3. **Run the server**

   **Development mode:**

   ```bash
   npm run dev
   ```

   **Production mode:**

   ```bash
   npm start
   ```

## 📁 Project Structure

```
Server/
├── config/              # Configuration files
│   ├── database.js     # Database connection
│   ├── cloudinary.js   # File upload config
│   └── passport.js     # Authentication strategies
│
├── controllers/         # Request handlers
│   ├── authController.js
│   ├── userController.js
│   ├── jobController.js
│   ├── financeController.js
│   ├── kycController.js
│   └── adminController.js
│
├── models/             # Database models
│   ├── User.js
│   ├── Job.js
│   ├── Transaction.js
│   ├── KYC.js
│   └── Admin.js
│
├── routes/             # API routes
│   ├── auth.js
│   ├── users.js
│   ├── jobs.js
│   ├── finance.js
│   ├── kyc.js
│   └── admin.js
│
├── middleware/         # Custom middleware
│   ├── auth.js        # JWT verification
│   ├── rbac.js        # Role-based access control
│   ├── validator.js   # Request validation
│   ├── errorHandler.js
│   └── upload.js      # File upload handling
│
├── utils/              # Utility functions
│   ├── emailService.js
│   ├── smsService.js
│   ├── logger.js
│   └── helpers.js
│
├── uploads/            # Uploaded files (gitignored)
├── logs/               # Application logs (gitignored)
├── .env                # Environment variables (gitignored)
├── .gitignore
├── server.js           # Entry point
├── package.json
└── README.md           # This file
```

## 🔌 API Endpoints

### Authentication

```
POST   /api/auth/register          # Register new admin
POST   /api/auth/login             # Login
POST   /api/auth/refresh-token     # Refresh JWT token
POST   /api/auth/logout            # Logout
POST   /api/auth/forgot-password   # Request password reset
POST   /api/auth/reset-password    # Reset password
```

### Users & People Management

```
GET    /api/users                  # Get all users (with filters)
GET    /api/users/:id              # Get user by ID
PUT    /api/users/:id              # Update user
DELETE /api/users/:id              # Delete user
POST   /api/users/:id/ban          # Ban user
POST   /api/users/:id/suspend      # Suspend user
GET    /api/users/stats            # User statistics
```

### KYC Management

```
GET    /api/kyc/pending            # Get pending KYC requests
GET    /api/kyc/:id                # Get KYC details
POST   /api/kyc/:id/approve        # Approve KYC
POST   /api/kyc/:id/reject         # Reject KYC
POST   /api/kyc/:id/retry          # Request retry
GET    /api/kyc/flagged            # Get flagged accounts
```

### Jobs Management

```
GET    /api/jobs                   # Get all jobs (with filters)
GET    /api/jobs/live              # Get live jobs
GET    /api/jobs/:id               # Get job details
POST   /api/jobs                   # Create job
PUT    /api/jobs/:id               # Update job
DELETE /api/jobs/:id               # Delete job
POST   /api/jobs/:id/cancel        # Cancel job
POST   /api/jobs/:id/reassign      # Reassign job
GET    /api/jobs/categories        # Get job categories
POST   /api/jobs/categories        # Create category
GET    /api/jobs/:id/attendance    # Get attendance logs
```

### Finance Management

```
GET    /api/finance/payouts        # Get all payouts
POST   /api/finance/payouts        # Process payout
POST   /api/finance/payouts/:id/retry  # Retry failed payout
GET    /api/finance/commissions    # Get commission data
GET    /api/finance/reports        # Generate financial reports
GET    /api/finance/transactions   # Get all transactions
GET    /api/finance/stats          # Financial statistics
```

### Admin & System

```
GET    /api/admin/team             # Get admin team members
POST   /api/admin/team             # Add team member
PUT    /api/admin/team/:id         # Update team member
DELETE /api/admin/team/:id         # Remove team member
POST   /api/admin/broadcast        # Send notifications
GET    /api/admin/settings         # Get system settings
PUT    /api/admin/settings         # Update settings
POST   /api/admin/cache/clear      # Clear cache
GET    /api/admin/logs             # Get system logs
```

### Dashboard & Analytics

```
GET    /api/dashboard/kpis         # Get KPIs
GET    /api/dashboard/analytics    # Get business analytics
GET    /api/dashboard/reports      # Get operational reports
```

## 🔐 Authentication & Authorization

### JWT Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Role-Based Access Control (RBAC)

**Roles:**

- `super_admin` - Full system access
- `admin` - Standard administrative access
- `support` - Limited support access
- `finance` - Finance operations only

**Example middleware usage:**

```javascript
router.get("/users", auth, rbac(["admin", "super_admin"]), getUsers);
```

## 🗄️ Database Schema

### User Model

```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String,
  phone: String,
  role: String, // 'worker', 'business', 'admin'
  status: String, // 'active', 'suspended', 'banned'
  kycStatus: String, // 'pending', 'approved', 'rejected'
  createdAt: Date,
  updatedAt: Date
}
```

### Job Model

```javascript
{
  _id: ObjectId,
  title: String,
  category: String,
  businessId: ObjectId,
  workerId: ObjectId,
  status: String, // 'pending', 'active', 'completed', 'cancelled'
  price: Number,
  commission: Number,
  location: {
    type: String,
    coordinates: [Number]
  },
  createdAt: Date,
  completedAt: Date
}
```

### Transaction Model

```javascript
{
  _id: ObjectId,
  jobId: ObjectId,
  userId: ObjectId,
  type: String, // 'payout', 'commission', 'refund'
  amount: Number,
  status: String, // 'pending', 'completed', 'failed'
  createdAt: Date
}
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run test         # Run tests
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Environment Variables

See `.env.example` for all available environment variables.

## 📊 Monitoring & Logging

- **Winston** - Application logging
- **Morgan** - HTTP request logging
- **PM2** - Process management (production)

Logs are stored in the `logs/` directory:

- `error.log` - Error logs
- `combined.log` - All logs

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- users.test.js
```

## 🚀 Deployment

### Using PM2 (Recommended for production)

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start server.js --name promotr-admin-api

# View logs
pm2 logs promotr-admin-api

# Restart
pm2 restart promotr-admin-api

# Stop
pm2 stop promotr-admin-api
```

### Docker Deployment

```dockerfile
# Dockerfile (to be created)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🔒 Security Best Practices

- ✅ JWT tokens with expiration
- ✅ Password hashing with bcrypt
- ✅ Rate limiting on API endpoints
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ Helmet.js for security headers
- ✅ SQL injection prevention
- ✅ XSS protection

## 📄 License

This project is proprietary and confidential.

© 2026 Promotr. All rights reserved.

## 📞 Support

For backend-specific issues:

- Check the logs in `logs/` directory
- Review API documentation
- Contact the backend team

---

**Built with ❤️ by the Promotr Backend Team**
