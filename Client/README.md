# Promotr Admin Panel - Frontend Client

> Modern React-based admin dashboard for managing the Promotr gig marketplace platform

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-Proprietary-red)

## 📋 Overview

The frontend client for Promotr Admin Panel - a comprehensive administrative interface for managing users, jobs, finances, KYC verification, and platform operations. Built with React 19.2, Vite, and Tailwind CSS for a modern, responsive experience.

## ✨ Features

### 🔐 Authentication System

- **Email & Password Login** - Traditional authentication
- **Phone + OTP Login** - SMS-based verification
- **Remember Me** - Persistent sessions
- **Password Recovery** - Forgot password flow
- **User Registration** - Admin account creation

### 📊 Dashboard

- **Overview Section**
  - KPIs: Active Users, Total Revenue, Pending Actions
  - Quick Actions: Create Job, Approve KYC
- **Business Analytics**
  - User acquisition trends
  - Revenue Month-over-Month (MoM)
  - Retention rates
  - Activity heatmaps
- **Operational Reports**
  - System health monitoring
  - Uptime tracking
  - SLA breach alerts
  - Weekly/Monthly performance exports

### 👥 People Management

- **User Directory**
  - View all users with pagination
  - Filter by Role/Status
  - Edit user profiles
  - Ban/Suspend users
- **KYC Approval Workflow**
  - Review submitted IDs
  - Photo verification
  - Approve/Reject/Request Retry
- **Fraud Monitoring**
  - Flag multiple accounts
  - IP conflict detection
  - Spoofing alerts
  - Transaction audit logs

### 💼 Jobs Management

- **Live Jobs Dashboard**
  - Real-time monitoring
  - Manual moderation (cancel/reassign)
- **Category Management**
  - Add/Edit job types
  - Set base prices
  - Manage skill tags
- **Order Tracking**
  - Full job lifecycle tracking
  - Job-specific logs
- **Attendance Logs**
  - Geofenced check-in/out records
  - Work hour validation
  - Dispute resolution

### 💰 Finance

- **Payout Management**
  - Release payments to workers/vendors
  - Retry failed transactions
- **Commission Tracking**
  - Platform fee calculation
  - Expected vs. actual margin analysis
- **Financial Reports**
  - Tax report generation
  - Invoice creation
  - P&L statements

### ⚙️ Admin Panel

- **Internal Team Management**
  - Manage sub-admins and support staff
  - Role-Based Access Control (RBAC)
- **CMS & Broadcast**
  - Send push notifications
  - Email blasts
  - Update T&C, FAQ, App Banners
- **System Settings**
  - Toggle payment gateways
  - Set global variables
  - Clear cache
  - Version control

### 🎨 Modern UI/UX

- Responsive design for all devices
- Smooth animations and transitions
- Intuitive navigation
- Professional Promotr branding
- Dark mode support (planned)

## 🚀 Tech Stack

### Core

- **React 19.2** - Latest React with modern hooks
- **Vite 7.2** - Lightning-fast build tool
- **React Router DOM 7.12** - Client-side routing

### Styling

- **Tailwind CSS 3** - Utility-first CSS framework
- **PostCSS** - CSS transformation
- **Autoprefixer** - Vendor prefixing

### State Management (Planned)

- **React Context API** - Global state
- **React Query / TanStack Query** - Server state management

### Data Visualization (Planned)

- **Recharts** or **Chart.js** - Charts and graphs
- **React Table** - Advanced data tables

### Development Tools

- **ESLint** - Code quality
- **@vitejs/plugin-react-swc** - Fast Refresh with SWC
- **React Hooks ESLint Plugin** - Hook rules enforcement

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or bun

### Setup

1. **Install dependencies**

   ```bash
   npm install
   # or
   bun install
   ```

2. **Set up environment variables**

   Create a `.env` file:

   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=Promotr Admin
   VITE_ENVIRONMENT=development
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🛠️ Available Scripts

| Command           | Description                       |
| ----------------- | --------------------------------- |
| `npm run dev`     | Start development server with HMR |
| `npm run build`   | Build for production              |
| `npm run preview` | Preview production build locally  |
| `npm run lint`    | Run ESLint to check code quality  |

## 📁 Project Structure

```
Client/
├── public/                 # Static assets
│   └── logo.svg           # Promotr logo
│
├── src/
│   ├── assets/            # Images, fonts, media
│   │
│   ├── components/        # Reusable components (to be created)
│   │   ├── common/       # Buttons, Inputs, Cards, etc.
│   │   ├── layout/       # Navbar, Sidebar, Footer
│   │   ├── charts/       # Chart components
│   │   └── tables/       # Data table components
│   │
│   ├── pages/            # Page components
│   │   ├── Login.jsx     # Email/password login
│   │   ├── Signup.jsx    # Registration
│   │   ├── Dashboard.jsx # Main dashboard
│   │   ├── People.jsx    # User management
│   │   ├── Jobs.jsx      # Job management
│   │   ├── Finance.jsx   # Financial operations
│   │   ├── Admin.jsx     # Admin settings
│   │   └── NotFound.jsx  # 404 page
│   │
│   ├── context/          # React Context (to be created)
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── hooks/            # Custom hooks (to be created)
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   └── useDebounce.js
│   │
│   ├── services/         # API services (to be created)
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── userService.js
│   │   └── jobService.js
│   │
│   ├── utils/            # Utility functions (to be created)
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── constants.js
│   │
│   ├── App.jsx           # Alternative login component
│   ├── App.css           # App-specific styles
│   ├── main.jsx          # Entry point with routing
│   └── index.css         # Global styles + Tailwind
│
├── index.html            # HTML template
├── package.json          # Dependencies
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
├── postcss.config.js     # PostCSS configuration
├── eslint.config.js      # ESLint rules
├── .gitignore
└── README.md             # This file
```

## 🗺️ Routes

| Route          | Component | Status | Description                      |
| -------------- | --------- | ------ | -------------------------------- |
| `/`            | Login     | ✅     | Landing page with authentication |
| `/auth/signup` | Signup    | ✅     | User registration                |
| `/dashboard`   | Dashboard | 🚧     | Main dashboard (to be built)     |
| `/people`      | People    | 🚧     | People management                |
| `/jobs`        | Jobs      | 🚧     | Jobs management                  |
| `/finance`     | Finance   | 🚧     | Finance tracking                 |
| `/admin`       | Admin     | 🚧     | Admin panel                      |
| `*`            | NotFound  | ✅     | 404 error page                   |

**Legend:** ✅ Complete | 🚧 In Progress | ⏳ Planned

## 🎨 Design System

### Brand Colors

```css
Primary:       #F06C28  /* Promotr Orange */
Primary Dark:  #D85A1A
Primary Light: #FF8A4C
Background:    #F9FAFB  /* Light Gray */
Text:          #111827  /* Dark Gray */
```

### Custom Animations

- `fade-in-up` - 0.5s ease-out
- `fade-in-left` - 0.6s ease-out
- `fade-in-right` - 0.6s ease-out

### Typography

- Font Family: System font stack (Apple, Segoe UI, Roboto)
- Responsive sizing with Tailwind utilities
- Consistent hierarchy

## 🔧 Configuration

### Vite (`vite.config.js`)

- React plugin with SWC
- Port: 5173 (default)
- Host: `--host` flag for network access

### Tailwind CSS (`tailwind.config.js`)

- Custom primary colors
- Custom animations
- Extended utilities

### ESLint (`eslint.config.js`)

- React recommended rules
- React Hooks rules
- React Refresh rules

## 🌐 Deployment

### Build for Production

```bash
npm run build
```

Output: `dist/` directory

### Preview Production Build

```bash
npm run preview
```

### Deploy Options

- **Vercel** - Recommended for Vite apps
- **Netlify** - Easy drag-and-drop
- **AWS S3 + CloudFront** - Scalable
- **GitLab Pages** - CI/CD integration
- **Nginx/Apache** - Traditional hosting

### Environment Variables for Production

```env
VITE_API_URL=https://api.promotr.com/api
VITE_APP_NAME=Promotr Admin
VITE_ENVIRONMENT=production
```

## 🤝 Contributing

### Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "feat: description"`
3. Push: `git push origin feature/your-feature`
4. Create Pull Request

### Commit Convention

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code restructuring
- `test:` - Tests
- `chore:` - Maintenance

## 📝 Development Guidelines

### Code Style

- Use functional components with hooks
- Keep components small and focused
- Use meaningful names
- Avoid prop drilling (use Context)
- Follow React best practices

### Styling

- Use Tailwind utility classes
- Mobile-first approach
- Consistent spacing
- Use theme colors

### Performance

- Lazy load routes
- Optimize images
- Use React.memo for expensive components
- Minimize bundle size

## 🐛 Troubleshooting

**Port in use:**

```bash
lsof -ti:5173 | xargs kill -9
```

**Dependencies issues:**

```bash
rm -rf node_modules bun.lock package-lock.json
npm install
```

**Build errors:**

```bash
rm -rf dist .cache
npm run build
```

## 📚 Resources

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)

## 📄 License

Proprietary and confidential. Unauthorized use is prohibited.

© 2026 Promotr. All rights reserved.

## 📞 Support

- Create an issue in the repository
- Contact the frontend team
- Check documentation

---

**Built with ❤️ by the Promotr Frontend Team**
