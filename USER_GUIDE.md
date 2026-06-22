# Promotr Admin Panel - User Guide

## 🎯 What is this?

The Promotr Admin Panel is your control center for managing the entire Promotr platform. From here, you can:

- Approve or reject user identity verification (KYC)
- Monitor all jobs posted and in progress
- Track platform revenue and commissions
- Manage users, ban fraudulent accounts
- View real-time analytics and reports

---

## 🔐 Login & Access

**URL**: Visit the admin panel at your deployment URL
**Login Method**: Email + OTP (One-Time Password)

### How to Login:

1. Enter your registered email address
2. Click "Get OTP"
3. Check your email for a 6-digit code
4. Enter the OTP and click "Sign In"
5. You'll be logged in for 8 hours

**Why OTP instead of passwords?**

- More secure (no password to steal or forget)
- Faster login process
- Each code expires in 5 minutes

---

## 📊 Dashboard

**Purpose**: Quick overview of platform health and key metrics

### What you see:

**Quick Action Buttons** (top of page)

- **"Approve KYC"** → Takes you directly to pending KYC verifications

**Why only one button now?**
- Jobs management has been removed from the admin panel
- KYC approval is the most critical daily task

### Three Tabs:

#### 1. **Overview**

**What it shows**: Real-time snapshot of platform performance

**Metric Cards**:

- **Total Users**: How many people are registered (workers + businesses)
- **Active Jobs**: Jobs currently in progress
- **Pending KYC**: How many users are waiting for identity verification
- **Total Revenue**: All money flowing through the platform
- **Commission Earned**: Your platform's cut from all jobs (big orange card)

**Why this matters**: At a glance, you know if things are growing or if there's a bottleneck (e.g., too many pending KYCs)

#### 2. **Business Analytics**

**What it shows**: Where money is coming from and which cities perform best

**Two Charts**:

- **Revenue by Category**: Which job types (merchandising, sampling, events) make the most money

  - Horizontal bars show relative earnings
  - Helps decide which categories to promote
- **Top Performing Cities**: Which cities have the most jobs

  - Ranked list (1st, 2nd, 3rd...)
  - Helps target marketing efforts

**Retention Cohorts**: Shows how many workers stick around week by week

- Higher % = workers are happy and keep coming back

#### 3. **Operational Reports**

**What it shows**: System health and downloadable reports

**System Health Cards**:

- **Uptime**: Is the platform running? (should be 99%+)
- **Avg Latency**: How fast pages load (lower is better)
- **Active Errors**: Any crashes? (should be 0)

**Available Reports**: Pre-generated reports you can download

- Weekly Performance Summary
- Monthly Financial Audit
- User Growth Analytics
- Job Satisfaction Survey

**Why this exists**: For board meetings, investor updates, or debugging issues

---

## 👥 People Hub

**Purpose**: Manage all users - approve identities, ban fraudsters, edit profiles

### Three Tabs:

#### 1. **User Directory**

**What it shows**: Every user in the system (workers, businesses, admins)

**Search Bar** (top of page):
- Large search box with magnifying glass icon
- Search by: name, email, phone number, or user ID
- Results filter instantly as you type
- Clear the search box to see all users again

**Filter Options** (dropdown menus):
- **All Roles** → Filter by worker/business/admin
- **All Statuses** → Filter by active/suspended/banned
- **All KYC Status** → Filter by verified/pending/rejected
- **Clear filters** button → Reset all filters
- **User count** → Shows "X users" or "X of Y users" when searching/filtering

**How search works with filters**:
- You can search AND filter at the same time
- Example: Search "Sara" + Filter by "worker" role = only workers named Sara
- The count updates to show results matching both search and filters

**User Table Columns**:

- **User**: Profile pic, name, email
- **Role**: worker/business/admin
- **Status**: active (green), suspended (yellow), banned (red)
- **KYC**: verified (green), pending (yellow), rejected (red)

**Action Buttons** (per user):

- **Edit** → Opens modal to change name, email, phone, role, status, KYC
  - Modal has Save/Cancel buttons
  - Changes save instantly to database
- **Ban** → Permanently blocks the user from platform
  - Shows confirmation popup first
  - Button says "Banning..." while processing
  - Disabled if already banned

**Why edit users?**

- Fix typos in names/emails
- Upgrade a worker to admin
- Manually set KYC status if needed

#### 2. **KYC Approval**

**What it shows**: Users waiting for identity verification

**Pending Verifications Count**: Shows how many in queue

**Each User Card Shows**:

- Profile avatar with initial
- Name
- Join date and role
- Two action buttons

**Action Buttons**:

- **Verify** (orange) → Approves their identity
  - User can now get jobs
  - Button says "Verifying..." while processing
- **Reject** (red) → Rejects their identity
  - User gets blocked
  - Button says "Rejecting..." while processing

**Why this exists**: To prevent fake accounts and fraud. You'd typically check their ID documents (not shown in panel, might be in email/separate system) before clicking Verify.

**What happens after clicking**:

- User disappears from this list immediately
- They move to "verified" or "rejected" status
- You can see them in User Directory tab

#### 3. **Fraud Monitoring**

**What it shows**: Security alerts and flagged suspicious users

**Security Alerts** (red box):

- Example: "IP Spoofing Detected - Multiple accounts from same proxy in Bangalore"
- These are system-generated warnings

**Flagged User Watchlist**:

- Shows all suspended/banned/rejected users
- Each row shows:
  - Name and email
  - Status badge (suspended/banned)
  - KYC Rejected badge (if applicable)
  - Last known IP address

**Why this exists**: Quick view of problem accounts. If you see patterns (same IP, same location), you know it's coordinated fraud.

---

## 💰 Finance Center

**Purpose**: Track money - payouts, commissions, revenue

### Three Tabs:

#### 1. **Payout Management**

**What it shows**: Money flow in and out

**Top Cards**:

- **Total Platform Revenue**: All money earned
- **Payouts Processed**: Money paid to workers
- **Jobs by Status**: Breakdown (completed/in_progress/etc.)

**Recent Disbursements Table**:

- Lists recent payments to workers
- Shows job title, worker ID, date, amount, status (paid)
- Sorted by date (newest first)

**Payment Status Breakdown**:

- Grid showing: paid/pending/refunded counts
- Quick snapshot of payment health

**Why this exists**: Track cash flow. If "pending" count is too high, there might be a payment processing issue.

#### 2. **Commission Tracking**

**What it shows**: Your platform's earnings

**Big Orange Card**: Total commission earned (your cut)

- Two action buttons (UI only, not functional yet):
  - "Withdraw Funds"
  - "View Invoices"

**Margin Analysis Card**:

- Shows commission % (e.g., 10.2%)
- Green arrow shows if above/below target

**Payout Cycle Card**:

- T+2 Days → Workers get paid 2 days after job completion

**Top Commission Jobs Table**:

- Ranked list of jobs by commission earned
- Shows job title, location, commission amount

**Why this exists**: Know your profit margins and which jobs are most profitable for the platform.

#### 3. **Financial Reports**

**What it shows**: Summary stats and downloadable reports

**Top Summary Cards**:

- Total Revenue
- Total Commission
- Paid Jobs count

**Download Reports**:

- Monthly P&L Statement (PDF)
- Tax Compliance Report (CSV)
- Commission Ledger (CSV)

**Why this exists**: For accounting, taxes, and audits.

---

## ⚙️ Admin Console

**Purpose**: System configuration and internal team management

### Three Tabs:

#### 1. **Internal Team**

**What it shows**: Your admin team members

**Team List**:

- Shows: Name, email, role (Super Admin/Operations Head/etc.), online status
- Three-dot menu for actions (not wired up yet)

**"+ Invite Member" Button**: Add new admins

**Why this exists**: Control who has access to this admin panel.

#### 2. **CMS & Broadcast**

**What it shows**: Send announcements to all workers

**Broadcast Portal**:

- Text box to compose message
- Dropdown to select audience:
  - All Workers
  - Verified Only
  - By Region
- "Broadcast Message" button (not functional yet)

**Why this exists**: Send platform-wide alerts (e.g., "System maintenance tonight 10 PM").

#### 3. **System Settings**

**What it shows**: Platform configuration

**Operations Settings**:

- **Worker Signups**: Enable/disable new registrations
- **Business Onboarding**: Enable/disable new businesses
- **Auto-Verification**: AI-assisted KYC (paused/active)

**Financial Constants**:

- **Platform Commission**: 10.0% (your cut per job)
- **Worker TDS Rate**: 1.0% (tax deduction)
- **Minimum Payout**: ₹500 (smallest withdrawal amount)

**Edit Buttons**: Change these values (not functional yet)

**Why this exists**: Control platform behavior without deploying code. E.g., if fraud spikes, pause signups temporarily.

---

## 🎨 Navigation (Top Bar)

**Logo**: Click to go to Dashboard

**Main Tabs**:

- **Dashboard** → Overview page
- **People** → User management
- **Finance** → Money tracking
- **Admin** → System settings

**User Profile** (top right):

- Shows your name and email
- Logout icon → Ends session

---

## 🔔 Tips & Best Practices

### For KYC Approval:

- Verify at least once daily (don't let queue grow)
- Check documents carefully before clicking "Verify"
- If suspicious, click "Reject" → user can resubmit

### For User Management:

- Use filters to find specific users quickly
- Ban is permanent - use "Suspend" (via Edit) if temporary

### For Job Management:

- Check "Order Tracking" tab for stuck jobs
- Use "Reassign" if worker doesn't respond within 2 hours
- "Cancel" jobs if business requests it

### For Finance:

- Review "Payout Management" weekly
- Watch commission % - should stay around 10%
- Download reports monthly for records

---

## ❓ Common Questions

**Q: Why is my edit not saving?**
A: Check your internet connection. If you see "Failed to update", the server might be down. Try refreshing the page.

**Q: Can I undo a KYC rejection?**
A: Yes! Go to People → User Directory → Find the user → Click Edit → Change KYC Status to "verified"

**Q: What's the difference between Suspend and Ban?**

- **Suspend**: Temporary block, can be reversed
- **Ban**: Permanent block

**Q: Why can't I see any jobs?**
A: Check your filters. Click "Clear filters" to see all jobs.

**Q: How do I know if a worker actually went to the job location?**
A: Check Jobs → Attendance Logs → Look for high "Location Match" accuracy (98%+)

---

## 🚨 If Something Breaks

1. **Refresh the page** (most issues resolve this way)
2. **Check browser console** (F12) for errors
3. **Try logging out and back in**
4. **Contact dev team** with:
   - What you were doing
   - Error message (screenshot)
   - Which page/tab

---

**Last Updated**: June 2026
**Version**: 1.0
