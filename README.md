# Promotr Admin Panel

> **A comprehensive full-stack administrative platform for managing the Promotr gig marketplace ecosystem**

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Latest-339933?style=flat&logo=node.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express&logoColor=white)
![License](https://img.shields.io/badge/License-Proprietary-red)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Development Guide](#-development-guide)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Authentication & Authorization](#-authentication--authorization)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)
- [Resources](#-resources)

---

## 🎯 Overview

**Promotr Admin Panel** is a full-stack administrative interface designed to manage all aspects of the Promotr platform - a gig marketplace that connects businesses with workers for promotional and service-based work. This system provides comprehensive tools for:

- **User Management** - Complete control over user accounts, profiles, and permissions
- **Job Oversight** - Real-time monitoring and management of all gigs
- **Financial Operations** - Payout processing, commission tracking, and financial reporting
- **KYC Verification** - Identity verification workflow with fraud detection
- **Platform Administration** - System settings, team management, and CMS capabilities

### 🎨 Design Philosophy

The admin panel is built with a focus on:

- **Efficiency** - Streamlined workflows for common administrative tasks
- **Clarity** - Clean, intuitive interface with clear visual hierarchy
- **Responsiveness** - Works seamlessly across desktop, tablet, and mobile devices
- **Scalability** - Architecture designed to handle growing data and user base
- **Security** - Role-based access control and comprehensive audit logging

---

## ✨ Key Features

### 📊 Dashboard & Analytics

**Overview Section**

- Real-time KPIs (Active Users, Total Revenue, Pending Actions)
- Quick action buttons (Create Job, Approve KYC, etc.)
- System health monitoring with uptime tracking

**Business Analytics**

- User acquisition trends with interactive charts
- Revenue Month-over-Month (MoM) analysis
- User retention rates and cohort analysis
- Activity heatmaps showing peak usage times
- Conversion funnel visualization

**Operational Reports**

- SLA breach alerts and notifications
- Weekly/Monthly performance exports (CSV, PDF)
- Custom date range reporting
- Automated scheduled reports via email

### 👥 People Management

**User Directory**

- Comprehensive user listing with advanced filtering
  - Filter by: Role (Worker/Business/Admin), Status (Active/Suspended/Banned)
  - Search by: Name, Email, Phone, User ID
  - Sort by: Join Date, Last Active, Revenue Generated
- Pagination with configurable page sizes
- Bulk actions (Export, Send Notification, etc.)
- Individual user profile management
  - Edit personal information
  - View activity history
  - Check transaction records
  - Ban/Suspend/Reactivate accounts

**KYC Approval Workflow**

- Queue of pending KYC submissions
- Side-by-side document verification
  - ID card/Passport review
  - Selfie photo verification
  - Address proof validation
- Three-action workflow:
  - ✅ **Approve** - Grant verified status
  - ❌ **Reject** - Deny with reason
  - 🔄 **Request Retry** - Ask for resubmission with specific feedback
- Verification history and audit trail

**Fraud Monitoring**

- Multi-account detection algorithms
  - Same device ID across accounts
  - Matching phone numbers/emails
  - Similar IP addresses
- IP conflict tracking with geolocation
- Spoofing alerts (fake GPS, VPN detection)
- Transaction audit logs with anomaly detection
- Flagged account review queue

### 💼 Jobs Management

**Live Jobs Dashboard**

- Real-time monitoring of ongoing gigs
- Job status indicators (Pending, Active, Completed, Cancelled)
- Manual moderation capabilities:
  - Cancel problematic jobs
  - Reassign to different workers
  - Adjust pricing/terms
- Job-specific communication logs

**Category Management**

- Create and edit job categories
- Set base pricing per category
- Manage skill tags and requirements
- Category-specific commission rates
- Enable/disable categories

**Order Tracking**

- Full job lifecycle tracking:
  1. Created → 2. Assigned → 3. In Progress → 4. Completed → 5. Paid
- Detailed job logs with timestamps
- Worker and business feedback
- Dispute resolution interface

**Attendance & Geofencing**

- Geofenced check-in/check-out records
- GPS coordinates and timestamps
- Work hour validation and calculation
- Overtime tracking
- Attendance dispute resolution
- Location history visualization on maps

### 💰 Finance Management

**Payout Management**

- Release payments to workers and vendors
- Batch payout processing
- Payment method selection (Bank Transfer, UPI, Wallet)
- Failed transaction retry mechanism
- Payout schedule configuration
- Payment confirmation tracking

**Commission Tracking**

- Platform fee calculation (percentage or fixed)
- Expected vs. actual margin analysis
- Commission breakdown by category
- Revenue attribution reports
- Refund and adjustment tracking

**Financial Reports**

- Tax report generation (GST, TDS, etc.)
- Automated invoice creation
- Profit & Loss (P&L) statements
- Cash flow analysis
- Revenue forecasting
- Export to accounting software (Tally, QuickBooks)

### ⚙️ Admin & System Settings

**Internal Team Management**

- Add/remove sub-admins and support staff
- Role-Based Access Control (RBAC)
  - Super Admin - Full access
  - Admin - Standard operations
  - Support Staff - User support only
  - Finance Team - Financial operations only
- Activity logs per admin user
- Permission matrix configuration

**CMS & Broadcast**

- Push notification composer
  - Target: All users, Specific roles, Individual users
  - Schedule: Send now or schedule for later
  - Rich media support (images, links)
- Email blast campaigns
  - Template editor
  - Recipient segmentation
  - Open/click tracking
- Content management:
  - Update Terms & Conditions
  - Edit FAQ sections
  - Manage app banners and promotions
  - In-app announcement system

**System Settings**

- Payment gateway toggles (Enable/Disable)
- Global variables (Min payout, Max commission, etc.)
- Cache management (Clear Redis, CDN purge)
- Version control and feature flags
- Maintenance mode toggle
- API rate limiting configuration

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React 19.2 + Vite 7.2 + TailwindCSS 3              │   │
│  │  - Pages (Dashboard, People, Jobs, Finance, Admin)  │   │
│  │  - Components (Reusable UI elements)                │   │
│  │  - State Management (Context API / React Query)     │   │
│  │  - Routing (React Router DOM 7.12)                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↕ HTTP/HTTPS (REST API)
┌─────────────────────────────────────────────────────────────┐
│                         SERVER LAYER                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Node.js + Express.js                               │   │
│  │  - Routes (API endpoints)                           │   │
│  │  - Controllers (Business logic)                     │   │
│  │  - Middleware (Auth, RBAC, Validation)              │   │
│  │  - Services (Email, SMS, Payment)                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↕ Database Queries
┌─────────────────────────────────────────────────────────────┐
│                        DATABASE LAYER                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  MongoDB / PostgreSQL                               │   │
│  │  - Users Collection/Table                           │   │
│  │  - Jobs Collection/Table                            │   │
│  │  - Transactions Collection/Table                    │   │
│  │  - KYC Collection/Table                             │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Action → React Component → API Call → Express Route →
Controller → Service/Model → Database → Response →
Component Update → UI Render
```

---

## 🛠️ Tech Stack

### Frontend (Client)

| Technology           | Version | Purpose                                  |
| -------------------- | ------- | ---------------------------------------- |
| **React**            | 19.2    | UI library with modern hooks             |
| **Vite**             | 7.2     | Lightning-fast build tool and dev server |
| **React Router DOM** | 7.12    | Client-side routing and navigation       |
| **Tailwind CSS**     | 3.x     | Utility-first CSS framework              |
| **PostCSS**          | 8.5.6   | CSS transformation and autoprefixing     |
| **ESLint**           | 9.39.1  | Code quality and linting                 |
| **SWC**              | Latest  | Fast JavaScript/TypeScript compiler      |

**Planned Additions:**

- **React Query / TanStack Query** - Server state management
- **Recharts / Chart.js** - Data visualization
- **React Table** - Advanced data tables
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend (Server)

| Technology               | Purpose                       |
| ------------------------ | ----------------------------- |
| **Node.js**              | JavaScript runtime            |
| **Express.js**           | Web application framework     |
| **MongoDB / PostgreSQL** | Database (to be configured)   |
| **Mongoose / Sequelize** | ORM/ODM                       |
| **JWT**                  | Authentication tokens         |
| **bcrypt**               | Password hashing              |
| **Multer**               | File upload handling          |
| **Nodemailer**           | Email service                 |
| **Winston**              | Logging                       |
| **Morgan**               | HTTP request logging          |
| **Helmet**               | Security headers              |
| **CORS**                 | Cross-origin resource sharing |
| **express-validator**    | Input validation              |
| **dotenv**               | Environment variables         |

**Planned Additions:**

- **Socket.io** - Real-time features
- **Redis** - Caching and session storage
- **Bull** - Job queue management
- **PM2** - Process management
- **Jest / Mocha** - Testing framework

### DevOps & Tools

- **Git** - Version control
- **GitLab CI/CD** - Continuous integration/deployment
- **Docker** - Containerization
- **Nginx** - Reverse proxy
- **PM2** - Production process manager
- **Postman** - API testing

---

## 📁 Project Structure

```
promotr-admin-page/
│
├── Client/                          # Frontend React application
│   ├── public/                      # Static assets
│   │   ├── logo.svg                # Promotr logo
│   │   └── favicon.ico             # Favicon
│   │
│   ├── src/
│   │   ├── assets/                 # Images, fonts, media files
│   │   │   └── react.svg
│   │   │
│   │   ├── components/             # Reusable UI components (to be created)
│   │   │   ├── common/            # Generic components
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Table.jsx
│   │   │   │   └── Loader.jsx
│   │   │   ├── layout/            # Layout components
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── PageHeader.jsx
│   │   │   ├── charts/            # Chart components
│   │   │   │   ├── LineChart.jsx
│   │   │   │   ├── BarChart.jsx
│   │   │   │   └── PieChart.jsx
│   │   │   └── forms/             # Form components
│   │   │       ├── LoginForm.jsx
│   │   │       └── UserForm.jsx
│   │   │
│   │   ├── pages/                 # Page components
│   │   │   ├── Login.jsx          # ✅ Email/Phone + OTP login
│   │   │   ├── Signup.jsx         # ✅ User registration
│   │   │   ├── Dashboard.jsx      # 🚧 Main dashboard (placeholder)
│   │   │   ├── People.jsx         # 🚧 User management (placeholder)
│   │   │   ├── Jobs.jsx           # 🚧 Job management (placeholder)
│   │   │   ├── Finance.jsx        # 🚧 Finance tracking (placeholder)
│   │   │   ├── Admin.jsx          # 🚧 Admin settings (placeholder)
│   │   │   └── NotFound.jsx       # ✅ 404 error page
│   │   │
│   │   ├── context/               # React Context (to be created)
│   │   │   ├── AuthContext.jsx   # Authentication state
│   │   │   ├── ThemeContext.jsx  # Theme (light/dark mode)
│   │   │   └── UserContext.jsx   # Current user data
│   │   │
│   │   ├── hooks/                 # Custom React hooks (to be created)
│   │   │   ├── useAuth.js        # Authentication hook
│   │   │   ├── useApi.js         # API call hook
│   │   │   ├── useDebounce.js    # Debounce hook
│   │   │   ├── useLocalStorage.js
│   │   │   └── usePagination.js
│   │   │
│   │   ├── services/              # API service layer (to be created)
│   │   │   ├── api.js            # Axios instance configuration
│   │   │   ├── authService.js    # Auth API calls
│   │   │   ├── userService.js    # User API calls
│   │   │   ├── jobService.js     # Job API calls
│   │   │   ├── financeService.js # Finance API calls
│   │   │   └── adminService.js   # Admin API calls
│   │   │
│   │   ├── utils/                 # Utility functions (to be created)
│   │   │   ├── formatters.js     # Date, currency, number formatters
│   │   │   ├── validators.js     # Form validation functions
│   │   │   ├── constants.js      # App-wide constants
│   │   │   └── helpers.js        # Helper functions
│   │   │
│   │   ├── styles/                # Additional styles (optional)
│   │   │   └── custom.css
│   │   │
│   │   ├── App.jsx                # Alternative login component
│   │   ├── App.css                # App-specific styles
│   │   ├── main.jsx               # ✅ Entry point with routing
│   │   └── index.css              # ✅ Global styles + Tailwind imports
│   │
│   ├── .vscode/                   # VS Code settings
│   ├── node_modules/              # Dependencies (gitignored)
│   ├── .gitignore                 # Git ignore rules
│   ├── .prettierrc                # Prettier configuration
│   ├── eslint.config.js           # ESLint rules
│   ├── index.html                 # HTML template
│   ├── package.json               # Dependencies and scripts
│   ├── postcss.config.js          # PostCSS configuration
│   ├── tailwind.config.js         # Tailwind CSS configuration
│   ├── vite.config.js             # Vite configuration
│   ├── bun.lock                   # Bun lock file
│   └── README.md                  # Client documentation
│
├── Server/                         # Backend Node.js application
│   ├── config/                    # Configuration files (to be created)
│   │   ├── database.js           # Database connection
│   │   ├── cloudinary.js         # File upload config
│   │   └── passport.js           # Authentication strategies
│   │
│   ├── controllers/               # Request handlers (to be created)
│   │   ├── authController.js     # Authentication logic
│   │   ├── userController.js     # User CRUD operations
│   │   ├── jobController.js      # Job management logic
│   │   ├── financeController.js  # Financial operations
│   │   ├── kycController.js      # KYC verification logic
│   │   └── adminController.js    # Admin operations
│   │
│   ├── models/                    # Database models (to be created)
│   │   ├── User.js               # User schema
│   │   ├── Job.js                # Job schema
│   │   ├── Transaction.js        # Transaction schema
│   │   ├── KYC.js                # KYC schema
│   │   └── Admin.js              # Admin schema
│   │
│   ├── routes/                    # API routes (to be created)
│   │   ├── auth.js               # /api/auth/*
│   │   ├── users.js              # /api/users/*
│   │   ├── jobs.js               # /api/jobs/*
│   │   ├── finance.js            # /api/finance/*
│   │   ├── kyc.js                # /api/kyc/*
│   │   └── admin.js              # /api/admin/*
│   │
│   ├── middleware/                # Custom middleware (to be created)
│   │   ├── auth.js               # JWT verification
│   │   ├── rbac.js               # Role-based access control
│   │   ├── validator.js          # Request validation
│   │   ├── errorHandler.js       # Global error handler
│   │   ├── upload.js             # File upload handling
│   │   └── rateLimiter.js        # API rate limiting
│   │
│   ├── utils/                     # Utility functions (to be created)
│   │   ├── emailService.js       # Email sending
│   │   ├── smsService.js         # SMS/OTP sending
│   │   ├── logger.js             # Winston logger
│   │   └── helpers.js            # Helper functions
│   │
│   ├── uploads/                   # Uploaded files (gitignored)
│   ├── logs/                      # Application logs (gitignored)
│   ├── .env                       # Environment variables (gitignored)
│   ├── .gitignore                 # Git ignore rules
│   ├── server.js                  # Entry point (currently empty)
│   ├── placeHolder.json           # Placeholder file
│   ├── package.json               # Dependencies (to be created)
│   └── README.md                  # Server documentation
│
├── .git/                          # Git repository
├── .gitignore                     # Root gitignore
└── README.md                      # This file (root documentation)
```

**Legend:**

- ✅ = Implemented and functional
- 🚧 = Placeholder/In progress
- (to be created) = Planned but not yet created

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** or **bun**
- **Git** - [Download](https://git-scm.com/)
- **MongoDB** or **PostgreSQL** (for backend database)
- **Code Editor** - VS Code recommended

### Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd promotr-admin-page
```

#### 2. Install Client Dependencies

```bash
cd Client
npm install
# or
bun install
```

#### 3. Install Server Dependencies

```bash
cd ../Server
npm install
```

#### 4. Set Up Environment Variables

**Client/.env**

Create a `.env` file in the `Client` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Promotr Admin Panel
VITE_ENVIRONMENT=development

# Optional: Analytics
VITE_GA_TRACKING_ID=your_google_analytics_id
```

**Server/.env**

Create a `.env` file in the `Server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
API_VERSION=v1

# Database Configuration
# For MongoDB:
DATABASE_URL=mongodb://localhost:27017/promotr-admin
# For PostgreSQL:
# DATABASE_URL=postgresql://username:password@localhost:5432/promotr_admin

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key
REFRESH_TOKEN_EXPIRE=30d

# CORS Configuration
CLIENT_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,application/pdf

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password
FROM_EMAIL=noreply@promotr.com
FROM_NAME=Promotr Admin

# SMS/OTP Configuration
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Payment Gateway (Example: Razorpay/Stripe)
PAYMENT_GATEWAY=razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# AWS S3 (Optional - for file storage)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=promotr-uploads
AWS_REGION=us-east-1

# Redis (Optional - for caching)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# Logging
LOG_LEVEL=debug
LOG_FILE_PATH=./logs
```

#### 5. Run the Application

**Option A: Run Both Servers Separately**

Terminal 1 - Start Backend:

```bash
cd Server
npm run dev
# Server will run on http://localhost:5000
```

Terminal 2 - Start Frontend:

```bash
cd Client
npm run dev
# Client will run on http://localhost:5173
```

**Option B: Use Concurrently (Recommended)**

From the root directory, you can set up a script to run both:

```bash
# Install concurrently globally
npm install -g concurrently

# Run both servers
concurrently "cd Server && npm run dev" "cd Client && npm run dev"
```

#### 6. Access the Application

- **Frontend**: Open [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### Initial Setup Checklist

- [ ] Node.js and npm installed
- [ ] Repository cloned
- [ ] Client dependencies installed
- [ ] Server dependencies installed
- [ ] Client `.env` file created
- [ ] Server `.env` file created
- [ ] Database running (MongoDB/PostgreSQL)
- [ ] Backend server running
- [ ] Frontend server running
- [ ] Can access login page

---

## 💻 Development Guide

### Available Scripts

#### Client Scripts

```bash
# Development
npm run dev          # Start dev server with HMR (Hot Module Replacement)
npm run dev -- --host # Start dev server accessible on network

# Production
npm run build        # Build for production (output: dist/)
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors automatically
npm run format       # Format code with Prettier
```

#### Server Scripts (To be added)

```bash
# Development
npm run dev          # Start with nodemon (auto-restart)
npm start            # Start production server

# Testing
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report

# Database
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
npm run db:reset     # Reset database

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Development Workflow

#### Feature Development

1. **Create a feature branch**

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Follow the project's coding standards
   - Add tests for new functionality

3. **Test your changes**

   ```bash
   npm run lint
   npm test
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add user export functionality"
   ```

5. **Push and create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

#### Commit Message Convention

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, semicolons, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `ci:` - CI/CD changes
- `build:` - Build system changes

**Examples:**

```bash
feat(auth): add phone OTP login
fix(dashboard): correct revenue calculation
docs(readme): update installation instructions
refactor(api): simplify user controller logic
```

### Code Style Guidelines

#### React/JavaScript

```javascript
// ✅ Good: Functional components with hooks
import { useState, useEffect } from "react";

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  return <div>{/* ... */}</div>;
}

// ❌ Avoid: Class components (unless necessary)
class UserList extends React.Component {
  // ...
}
```

**Best Practices:**

- Use functional components with hooks
- Keep components small and focused (< 200 lines)
- Extract reusable logic into custom hooks
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Avoid prop drilling - use Context API
- Use TypeScript types (if migrating to TS)

#### CSS/Tailwind

```jsx
// ✅ Good: Tailwind utility classes
<button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
  Click Me
</button>

// ❌ Avoid: Inline styles (unless dynamic)
<button style={{ padding: '8px 16px', backgroundColor: '#F06C28' }}>
  Click Me
</button>
```

**Best Practices:**

- Use Tailwind utility classes
- Mobile-first responsive design
- Use theme colors from `tailwind.config.js`
- Extract repeated patterns into components
- Use custom CSS only when necessary

#### Node.js/Express

```javascript
// ✅ Good: Async/await with error handling
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// ❌ Avoid: Callback hell
const getUsers = (req, res) => {
  User.find((err, users) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(users);
    }
  });
};
```

**Best Practices:**

- Use async/await over callbacks
- Implement proper error handling
- Validate all inputs
- Use middleware for common tasks
- Keep controllers thin, logic in services
- Add comprehensive logging

### Folder Organization

When adding new features:

1. **Components**: Create in `Client/src/components/`
   - Group by feature or type
   - Include a README if complex

2. **Pages**: Add to `Client/src/pages/`
   - One page per route
   - Keep page components thin

3. **API Routes**: Add to `Server/routes/`
   - Group by resource
   - Follow RESTful conventions

4. **Models**: Add to `Server/models/`
   - One model per file
   - Include validation schemas

---

## 📡 API Documentation

### Base URL

```
Development: http://localhost:5000/api
Production:  https://api.promotr.com/api
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

### Response Format

**Success Response:**

```json
{
  "success": true,
  "data": {
    /* response data */
  },
  "message": "Operation successful"
}
```

**Error Response:**

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {
      /* additional error info */
    }
  }
}
```

### API Endpoints

#### Authentication Endpoints

| Method | Endpoint                | Description               | Auth Required |
| ------ | ----------------------- | ------------------------- | ------------- |
| POST   | `/auth/register`        | Register new admin user   | ❌            |
| POST   | `/auth/login`           | Login with email/password | ❌            |
| POST   | `/auth/login/phone`     | Login with phone + OTP    | ❌            |
| POST   | `/auth/send-otp`        | Send OTP to phone         | ❌            |
| POST   | `/auth/verify-otp`      | Verify OTP code           | ❌            |
| POST   | `/auth/refresh-token`   | Refresh JWT token         | ✅            |
| POST   | `/auth/logout`          | Logout user               | ✅            |
| POST   | `/auth/forgot-password` | Request password reset    | ❌            |
| POST   | `/auth/reset-password`  | Reset password with token | ❌            |
| GET    | `/auth/me`              | Get current user info     | ✅            |

**Example: Login**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@promotr.com",
  "password": "SecurePassword123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "admin@promotr.com",
      "role": "admin",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here"
  }
}
```

#### User Management Endpoints

| Method | Endpoint              | Description               | Auth | Roles              |
| ------ | --------------------- | ------------------------- | ---- | ------------------ |
| GET    | `/users`              | Get all users (paginated) | ✅   | admin, super_admin |
| GET    | `/users/:id`          | Get user by ID            | ✅   | admin, super_admin |
| POST   | `/users`              | Create new user           | ✅   | super_admin        |
| PUT    | `/users/:id`          | Update user               | ✅   | admin, super_admin |
| DELETE | `/users/:id`          | Delete user               | ✅   | super_admin        |
| POST   | `/users/:id/ban`      | Ban user                  | ✅   | admin, super_admin |
| POST   | `/users/:id/suspend`  | Suspend user              | ✅   | admin, super_admin |
| POST   | `/users/:id/activate` | Activate user             | ✅   | admin, super_admin |
| GET    | `/users/stats`        | Get user statistics       | ✅   | admin, super_admin |
| GET    | `/users/export`       | Export users to CSV       | ✅   | admin, super_admin |

**Example: Get Users with Filters**

```http
GET /api/users?role=worker&status=active&page=1&limit=20&sort=-createdAt
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_123",
        "name": "John Worker",
        "email": "john@example.com",
        "phone": "+919876543210",
        "role": "worker",
        "status": "active",
        "kycStatus": "approved",
        "createdAt": "2026-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "pages": 8
    }
  }
}
```

#### KYC Management Endpoints

| Method | Endpoint           | Description              | Auth | Roles              |
| ------ | ------------------ | ------------------------ | ---- | ------------------ |
| GET    | `/kyc/pending`     | Get pending KYC requests | ✅   | admin, super_admin |
| GET    | `/kyc/:id`         | Get KYC details          | ✅   | admin, super_admin |
| POST   | `/kyc/:id/approve` | Approve KYC              | ✅   | admin, super_admin |
| POST   | `/kyc/:id/reject`  | Reject KYC               | ✅   | admin, super_admin |
| POST   | `/kyc/:id/retry`   | Request KYC retry        | ✅   | admin, super_admin |
| GET    | `/kyc/flagged`     | Get flagged accounts     | ✅   | admin, super_admin |
| GET    | `/kyc/stats`       | Get KYC statistics       | ✅   | admin, super_admin |

#### Job Management Endpoints

| Method | Endpoint               | Description          | Auth | Roles              |
| ------ | ---------------------- | -------------------- | ---- | ------------------ |
| GET    | `/jobs`                | Get all jobs         | ✅   | admin, super_admin |
| GET    | `/jobs/live`           | Get live/active jobs | ✅   | admin, super_admin |
| GET    | `/jobs/:id`            | Get job details      | ✅   | admin, super_admin |
| POST   | `/jobs`                | Create new job       | ✅   | admin, super_admin |
| PUT    | `/jobs/:id`            | Update job           | ✅   | admin, super_admin |
| DELETE | `/jobs/:id`            | Delete job           | ✅   | super_admin        |
| POST   | `/jobs/:id/cancel`     | Cancel job           | ✅   | admin, super_admin |
| POST   | `/jobs/:id/reassign`   | Reassign job         | ✅   | admin, super_admin |
| GET    | `/jobs/categories`     | Get job categories   | ✅   | admin, super_admin |
| POST   | `/jobs/categories`     | Create category      | ✅   | super_admin        |
| PUT    | `/jobs/categories/:id` | Update category      | ✅   | super_admin        |
| GET    | `/jobs/:id/attendance` | Get attendance logs  | ✅   | admin, super_admin |

#### Finance Management Endpoints

| Method | Endpoint                     | Description                | Auth | Roles                       |
| ------ | ---------------------------- | -------------------------- | ---- | --------------------------- |
| GET    | `/finance/payouts`           | Get all payouts            | ✅   | finance, admin, super_admin |
| POST   | `/finance/payouts`           | Process payout             | ✅   | finance, super_admin        |
| POST   | `/finance/payouts/:id/retry` | Retry failed payout        | ✅   | finance, super_admin        |
| GET    | `/finance/commissions`       | Get commission data        | ✅   | finance, admin, super_admin |
| GET    | `/finance/reports`           | Generate financial reports | ✅   | finance, admin, super_admin |
| GET    | `/finance/transactions`      | Get all transactions       | ✅   | finance, admin, super_admin |
| GET    | `/finance/stats`             | Financial statistics       | ✅   | finance, admin, super_admin |
| POST   | `/finance/invoices/generate` | Generate invoice           | ✅   | finance, super_admin        |

#### Admin & System Endpoints

| Method | Endpoint                 | Description            | Auth | Roles              |
| ------ | ------------------------ | ---------------------- | ---- | ------------------ |
| GET    | `/admin/team`            | Get admin team members | ✅   | super_admin        |
| POST   | `/admin/team`            | Add team member        | ✅   | super_admin        |
| PUT    | `/admin/team/:id`        | Update team member     | ✅   | super_admin        |
| DELETE | `/admin/team/:id`        | Remove team member     | ✅   | super_admin        |
| POST   | `/admin/broadcast/push`  | Send push notification | ✅   | admin, super_admin |
| POST   | `/admin/broadcast/email` | Send email blast       | ✅   | admin, super_admin |
| GET    | `/admin/settings`        | Get system settings    | ✅   | super_admin        |
| PUT    | `/admin/settings`        | Update settings        | ✅   | super_admin        |
| POST   | `/admin/cache/clear`     | Clear cache            | ✅   | super_admin        |
| GET    | `/admin/logs`            | Get system logs        | ✅   | super_admin        |

#### Dashboard & Analytics Endpoints

| Method | Endpoint               | Description             | Auth | Roles              |
| ------ | ---------------------- | ----------------------- | ---- | ------------------ |
| GET    | `/dashboard/kpis`      | Get KPIs                | ✅   | admin, super_admin |
| GET    | `/dashboard/analytics` | Get business analytics  | ✅   | admin, super_admin |
| GET    | `/dashboard/reports`   | Get operational reports | ✅   | admin, super_admin |
| GET    | `/dashboard/activity`  | Get recent activity     | ✅   | admin, super_admin |

### Query Parameters

Common query parameters for list endpoints:

| Parameter   | Type   | Description                         | Example                 |
| ----------- | ------ | ----------------------------------- | ----------------------- |
| `page`      | number | Page number (default: 1)            | `?page=2`               |
| `limit`     | number | Items per page (default: 20)        | `?limit=50`             |
| `sort`      | string | Sort field (prefix with - for desc) | `?sort=-createdAt`      |
| `search`    | string | Search query                        | `?search=john`          |
| `status`    | string | Filter by status                    | `?status=active`        |
| `role`      | string | Filter by role                      | `?role=worker`          |
| `startDate` | date   | Filter from date                    | `?startDate=2026-01-01` |
| `endDate`   | date   | Filter to date                      | `?endDate=2026-01-31`   |

---

## 🗄️ Database Schema

### User Model

```javascript
{
  _id: ObjectId,
  fullName: String (required),
  email: String (required, unique, lowercase),
  phone: String (required, unique),
  password: String (hashed, required for email login),
  role: String (enum: ['worker', 'business', 'admin', 'super_admin', 'support', 'finance']),
  status: String (enum: ['active', 'suspended', 'banned'], default: 'active'),
  kycStatus: String (enum: ['pending', 'approved', 'rejected', 'retry_requested'], default: 'pending'),
  profilePicture: String (URL),
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,
    bankName: String
  },
  deviceInfo: [{
    deviceId: String,
    deviceType: String,
    lastLogin: Date,
    ipAddress: String
  }],
  isEmailVerified: Boolean (default: false),
  isPhoneVerified: Boolean (default: false),
  lastActive: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Job Model

```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  category: ObjectId (ref: 'Category'),
  businessId: ObjectId (ref: 'User', required),
  workerId: ObjectId (ref: 'User'),
  status: String (enum: ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'], default: 'pending'),
  price: Number (required),
  commission: Number,
  netAmount: Number,
  location: {
    type: String (enum: ['Point']),
    coordinates: [Number], // [longitude, latitude]
    address: String
  },
  geofence: {
    radius: Number, // in meters
    center: [Number] // [longitude, latitude]
  },
  schedule: {
    startDate: Date,
    endDate: Date,
    startTime: String,
    endTime: String
  },
  requirements: {
    skills: [String],
    experience: String,
    minRating: Number
  },
  attendance: [{
    checkIn: Date,
    checkOut: Date,
    location: {
      type: String,
      coordinates: [Number]
    },
    hoursWorked: Number,
    isDisputed: Boolean
  }],
  rating: {
    workerRating: Number,
    businessRating: Number,
    workerReview: String,
    businessReview: String
  },
  createdAt: Date,
  updatedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  cancellationReason: String
}
```

### Transaction Model

```javascript
{
  _id: ObjectId,
  jobId: ObjectId (ref: 'Job'),
  userId: ObjectId (ref: 'User'),
  type: String (enum: ['payout', 'commission', 'refund', 'penalty']),
  amount: Number (required),
  status: String (enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending'),
  paymentMethod: String (enum: ['bank_transfer', 'upi', 'wallet']),
  paymentDetails: {
    accountNumber: String,
    upiId: String,
    transactionId: String,
    gatewayResponse: Object
  },
  failureReason: String,
  retryCount: Number (default: 0),
  processedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### KYC Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  documentType: String (enum: ['aadhaar', 'pan', 'passport', 'driving_license']),
  documentNumber: String,
  documentImages: {
    front: String (URL),
    back: String (URL),
    selfie: String (URL)
  },
  status: String (enum: ['pending', 'approved', 'rejected', 'retry_requested'], default: 'pending'),
  reviewedBy: ObjectId (ref: 'User'),
  reviewNotes: String,
  rejectionReason: String,
  retryRequested: Boolean (default: false),
  retryReason: String,
  fraudFlags: [{
    type: String,
    description: String,
    severity: String (enum: ['low', 'medium', 'high']),
    detectedAt: Date
  }],
  submittedAt: Date,
  reviewedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Category Model

```javascript
{
  _id: ObjectId,
  name: String (required, unique),
  slug: String (required, unique),
  description: String,
  basePrice: Number,
  commissionRate: Number, // percentage
  skillTags: [String],
  isActive: Boolean (default: true),
  icon: String (URL),
  createdAt: Date,
  updatedAt: Date
}
```

### Admin Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  role: String (enum: ['super_admin', 'admin', 'support', 'finance']),
  permissions: [String], // array of permission codes
  department: String,
  activityLog: [{
    action: String,
    resource: String,
    resourceId: ObjectId,
    timestamp: Date,
    ipAddress: String
  }],
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Authentication & Authorization

### Authentication Flow

#### Email/Password Login

```
1. User enters email and password
2. Frontend sends POST /api/auth/login
3. Backend validates credentials
4. Backend generates JWT token
5. Frontend stores token in localStorage
6. Frontend includes token in all subsequent requests
```

#### Phone + OTP Login

```
1. User enters phone number
2. Frontend sends POST /api/auth/send-otp
3. Backend generates 6-digit OTP
4. Backend sends OTP via SMS
5. User enters OTP
6. Frontend sends POST /api/auth/verify-otp
7. Backend validates OTP
8. Backend generates JWT token
9. Frontend stores token
```

### JWT Token Structure

```javascript
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "user_123",
    "email": "admin@promotr.com",
    "role": "admin",
    "permissions": ["users.read", "users.write", "jobs.read"],
    "iat": 1706000000,
    "exp": 1706604800
  },
  "signature": "..."
}
```

### Role-Based Access Control (RBAC)

#### Roles & Permissions

| Role            | Description               | Permissions                         |
| --------------- | ------------------------- | ----------------------------------- |
| **super_admin** | Full system access        | All permissions                     |
| **admin**       | Standard admin operations | users._, jobs._, kyc._, dashboard._ |
| **support**     | User support only         | users.read, kyc.read, jobs.read     |
| **finance**     | Financial operations      | finance._, transactions._           |

#### Permission Codes

```
users.read          - View users
users.write         - Create/update users
users.delete        - Delete users
users.ban           - Ban/suspend users

jobs.read           - View jobs
jobs.write          - Create/update jobs
jobs.delete         - Delete jobs
jobs.moderate       - Cancel/reassign jobs

kyc.read            - View KYC requests
kyc.approve         - Approve/reject KYC

finance.read        - View financial data
finance.write       - Process payouts
finance.reports     - Generate reports

admin.settings      - Modify system settings
admin.team          - Manage admin team
admin.broadcast     - Send notifications
```

#### Middleware Usage

```javascript
// Protect route with authentication
router.get("/users", auth, getUsers);

// Protect route with role-based access
router.delete("/users/:id", auth, rbac(["super_admin"]), deleteUser);

// Protect route with permission-based access
router.post(
  "/finance/payouts",
  auth,
  hasPermission("finance.write"),
  processPayout,
);
```

---

## 🚀 Deployment

### Frontend Deployment (Vercel - Recommended)

1. **Build the application**

   ```bash
   cd Client
   npm run build
   ```

2. **Deploy to Vercel**

   ```bash
   npm install -g vercel
   vercel --prod
   ```

3. **Set environment variables in Vercel dashboard**
   - `VITE_API_URL` = Your production API URL
   - `VITE_APP_NAME` = Promotr Admin Panel
   - `VITE_ENVIRONMENT` = production

### Backend Deployment (AWS EC2 / DigitalOcean)

#### Using PM2

1. **Install PM2**

   ```bash
   npm install -g pm2
   ```

2. **Start the application**

   ```bash
   cd Server
   pm2 start server.js --name promotr-admin-api
   pm2 save
   pm2 startup
   ```

3. **Configure Nginx as reverse proxy**

   ```nginx
   server {
       listen 80;
       server_name api.promotr.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Set up SSL with Let's Encrypt**
   ```bash
   sudo certbot --nginx -d api.promotr.com
   ```

#### Using Docker

**Dockerfile (Server)**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

**docker-compose.yml**

```yaml
version: "3.8"
services:
  api:
    build: ./Server
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongodb

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

**Deploy**

```bash
docker-compose up -d
```

### Database Deployment

#### MongoDB Atlas (Recommended)

1. Create cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Whitelist IP addresses
3. Create database user
4. Get connection string
5. Update `DATABASE_URL` in `.env`

#### PostgreSQL (AWS RDS / Supabase)

1. Create database instance
2. Configure security groups
3. Get connection string
4. Update `DATABASE_URL` in `.env`

### CI/CD Pipeline (GitLab CI)

**.gitlab-ci.yml**

```yaml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  script:
    - cd Client && npm install && npm run lint
    - cd ../Server && npm install && npm test

build:
  stage: build
  script:
    - cd Client && npm run build
  artifacts:
    paths:
      - Client/dist/

deploy:
  stage: deploy
  only:
    - main
  script:
    - echo "Deploy to production"
    -  # Add deployment commands
```

---

## 🧪 Testing

### Frontend Testing (To be implemented)

**Install testing libraries**

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

**Example test**

```javascript
// Client/src/components/__tests__/Button.test.jsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Button from "../Button";

describe("Button Component", () => {
  it("renders button with text", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });
});
```

### Backend Testing (To be implemented)

**Install testing libraries**

```bash
npm install --save-dev jest supertest
```

**Example test**

```javascript
// Server/__tests__/auth.test.js
const request = require("supertest");
const app = require("../server");

describe("Auth Endpoints", () => {
  it("should login with valid credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@promotr.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
```

---

## 🤝 Contributing

### Branch Strategy

```
main           - Production-ready code (protected)
develop        - Development branch (default)
feature/*      - New features
bugfix/*       - Bug fixes
hotfix/*       - Urgent production fixes
release/*      - Release preparation
```

### Pull Request Process

1. Create feature branch from `develop`
2. Make changes and commit
3. Push branch and create Pull Request
4. Request code review
5. Address review comments
6. Merge after approval

### Code Review Checklist

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] No console.log statements
- [ ] Proper error handling
- [ ] Documentation updated
- [ ] No sensitive data exposed
- [ ] Performance considerations addressed

---

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9

# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9
```

#### Dependencies Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json bun.lock
npm install
```

#### Build Errors

```bash
# Clear build cache
rm -rf dist build .cache .vite
npm run build
```

#### Database Connection Issues

```bash
# Check MongoDB is running
sudo systemctl status mongodb

# Start MongoDB
sudo systemctl start mongodb

# Check PostgreSQL
sudo systemctl status postgresql
```

#### CORS Errors

Ensure `CLIENT_URL` in Server `.env` matches your frontend URL:

```env
CLIENT_URL=http://localhost:5173
```

---

## 📚 Resources

### Documentation

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Express.js](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

### Learning Resources

- [React Hooks Guide](https://react.dev/reference/react)
- [JavaScript ES6+ Features](https://es6-features.org)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [REST API Design](https://restfulapi.net)

### Tools

- [Postman](https://www.postman.com) - API testing
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Database GUI
- [pgAdmin](https://www.pgadmin.org) - PostgreSQL GUI
- [VS Code Extensions](https://marketplace.visualstudio.com/VSCode)
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - GitLens

---

## 📄 License

This project is **proprietary and confidential**. Unauthorized copying, distribution, modification, or use is strictly prohibited.

© 2026 Promotr. All rights reserved.

---

## 👥 Team

**Developed and maintained by the Promotr Development Team**

### Contributors

- Frontend Team - React UI/UX development
- Backend Team - API and database architecture
- DevOps Team - Infrastructure and deployment
- QA Team - Testing and quality assurance

---

## 📞 Support

For issues, questions, or feature requests:

- **Create an issue** in the repository
- **Contact the development team** via email
- **Check the documentation** in Client/README.md and Server/README.md
- **Review API documentation** above

### Reporting Bugs

When reporting bugs, please include:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser/OS information
- Error messages and logs

---

## 🗺️ Roadmap

### Phase 1 - Foundation (Current)

- [x] Project setup and structure
- [x] Authentication UI (Login/Signup)
- [ ] Backend API setup
- [ ] Database schema implementation
- [ ] Basic CRUD operations

### Phase 2 - Core Features

- [ ] Dashboard with analytics
- [ ] User management interface
- [ ] KYC verification workflow
- [ ] Job management system
- [ ] Finance tracking

### Phase 3 - Advanced Features

- [ ] Real-time notifications
- [ ] Advanced analytics and reporting
- [ ] Fraud detection system
- [ ] Automated workflows
- [ ] Mobile app integration

### Phase 4 - Optimization

- [ ] Performance optimization
- [ ] Comprehensive testing
- [ ] Security audit
- [ ] Documentation completion
- [ ] Production deployment

---

## 📊 Project Status

| Component         | Status         | Completion |
| ----------------- | -------------- | ---------- |
| Frontend Setup    | ✅ Complete    | 100%       |
| Authentication UI | ✅ Complete    | 100%       |
| Dashboard UI      | 🚧 In Progress | 20%        |
| Backend Setup     | 🚧 In Progress | 10%        |
| Database Schema   | 📝 Planned     | 0%         |
| API Endpoints     | 📝 Planned     | 0%         |
| Testing           | 📝 Planned     | 0%         |
| Deployment        | 📝 Planned     | 0%         |

**Legend:** ✅ Complete | 🚧 In Progress | 📝 Planned

---

## 🎉 Acknowledgments

Special thanks to:

- The React team for an amazing framework
- The Vite team for blazing-fast tooling
- The Tailwind CSS team for excellent styling utilities
- The open-source community

---

**Built with ❤️ by the Promotr Team**

_Last Updated: January 22, 2026_
