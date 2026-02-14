# Accountant AI App - Specification Document

## 1. Project Overview

**Project Name:** Accountant AI
**Type:** Full-stack Web Application (Next.js)
**Core Functionality:** A comprehensive digital accountant replacement that automates financial tracking, invoicing, tax preparation, and provides AI-powered financial insights.
**Target Users:** Small business owners, freelancers, and individuals who need professional-grade accounting without hiring an accountant.

---

## 2. Accountant Functions That Can Be Automated

Based on modern accountant responsibilities:

### Daily Tasks (Automatable)
- Recording financial transactions (income/expenses)
- Categorizing expenses automatically
- Bank reconciliation
- Invoice generation and sending
- Payment tracking and reminders
- Receipt data extraction

### Periodic Tasks (Automatable)
- Monthly/quarterly financial reports (P&L, Balance Sheet, Cash Flow)
- Tax calculations and estimates
- Budget vs. actual analysis
- Financial forecasting
- Bank statement reconciliation

### Advisory Tasks (AI-Assisted)
- Answering accounting questions
- Providing tax optimization suggestions
- Financial health analysis
- Cash flow predictions

---

## 3. Feature List

### Core Features

1. **Financial Dashboard**
   - Total income/expenses overview
   - Cash flow chart (line chart)
   - Expense breakdown (pie chart)
   - Recent transactions list
   - Quick action buttons

2. **Income/Expense Tracking**
   - Add/edit/delete transactions
   - Automatic categorization (Food, Transport, Utilities, Office, Marketing, etc.)
   - Recurring transaction support
   - Multi-currency support
   - Search and filter capabilities

3. **Invoice Management**
   - Create professional invoices
   - Track invoice status (Draft, Sent, Paid, Overdue)
   - Client management
   - Invoice templates
   - PDF export

4. **Receipt Scanning**
   - Image upload interface
   - OCR-like extraction simulation (regex patterns for demo)
   - Auto-populate transaction from receipt
   - Receipt storage

5. **Financial Reports**
   - Profit & Loss Statement
   - Balance Sheet
   - Cash Flow Statement
   - Date range selection
   - Export to PDF

6. **Bank Reconciliation**
   - Manual entry of bank transactions
   - Auto-match with recorded transactions
   - Match confidence indicator
   - Unmatched transactions list

7. **Tax Preparation**
   - Tax category tracking
   - Quarterly tax estimates
   - Tax summary report
   - Deductible expenses tracking

8. **Payment Reminders**
   - Due invoice tracking
   - Automatic reminder scheduling
   - Overdue notifications
   - Payment status dashboard

9. **Budgeting & Forecasting**
   - Monthly budget setup
   - Budget vs. actual tracking
   - Simple forecasting (linear regression)
   - Category-wise predictions

10. **Secure Document Storage**
    - Encrypted file storage simulation
    - Document categorization
    - Search functionality
    - Secure viewing

11. **AI Assistant**
    - Chat interface
    - Pre-trained accounting knowledge base
    - Financial question answering
    - Suggestion system

---

## 4. UI/UX Specification

### Layout Structure
- **Sidebar Navigation** (collapsible, 280px width)
- **Main Content Area** (fluid width)
- **Top Bar** (64px height with user info, notifications)

### Color Palette
- **Primary:** #2563EB (Blue 600)
- **Secondary:** #10B981 (Emerald 500)
- **Accent:** #F59E0B (Amber 500)
- **Danger:** #EF4444 (Red 500)
- **Background:** #F8FAFC (Slate 50)
- **Surface:** #FFFFFF
- **Text Primary:** #1E293B (Slate 800)
- **Text Secondary:** #64748B (Slate 500)

### Typography
- **Font Family:** Inter (sans-serif)
- **Headings:** Bold, sizes: H1(32px), H2(24px), H3(20px), H4(16px)
- **Body:** Regular 14px, line-height 1.5

### Components
- Cards with subtle shadows (0 1px 3px rgba(0,0,0,0.1))
- Buttons: Primary (blue), Secondary (gray), Danger (red), Success (green)
- Tables with alternating row colors
- Forms with clear labels and validation
- Charts using Recharts library
- Modal dialogs for forms

### Responsive Breakpoints
- Mobile: < 768px (sidebar collapses to hamburger menu)
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## 5. Technical Architecture

### Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** SQLite with better-sqlite3
- **Charts:** Recharts
- **Icons:** Lucide React
- **Date Handling:** date-fns
- **File Storage:** Local filesystem

### Data Models
- Transactions (id, date, type, amount, category, description, receipt_path)
- Invoices (id, client_name, client_email, items, total, status, due_date)
- Clients (id, name, email, address, phone)
- Budgets (id, category, amount, period)
- Documents (id, name, type, path, uploaded_at)
- Settings (key, value)

### API Routes
- `/api/transactions` - CRUD for transactions
- `/api/invoices` - CRUD for invoices
- `/api/clients` - CRUD for clients
- `/api/reports` - Generate financial reports
- `/api/reconciliation` - Bank matching logic
- `/api/ai` - AI assistant responses
- `/api/documents` - Document management
- `/api/forecast` - Budget forecasting

---

## 6. Acceptance Criteria

### Must Have
- [ ] Dashboard displays real financial data
- [ ] Can add/edit/delete transactions with categories
- [ ] Invoice creation with PDF-like view
- [ ] Receipt upload with text extraction demo
- [ ] P&L and Balance Sheet generation
- [ ] Bank reconciliation interface
- [ ] Tax calculation summary
- [ ] Budget setup and tracking
- [ ] AI chat interface with canned responses
- [ ] Responsive design works on mobile

### Visual Checkpoints
- [ ] Sidebar navigation highlights active page
- [ ] Charts render with sample data
- [ ] Forms validate input properly
- [ ] Loading states show during API calls
- [ ] Error states display user-friendly messages

---

## 7. File Structure

```
/root/.openclaw/workspace/accountant-ai-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── dashboard/
│   │   └── page.tsx
│   ├── transactions/
│   │   └── page.tsx
│   ├── invoices/
│   │   └── page.tsx
│   ├── receipts/
│   │   └── page.tsx
│   ├── reports/
│   │   └── page.tsx
│   ├── reconciliation/
│   │   └── page.tsx
│   ├── tax/
│   │   └── page.tsx
│   ├── budgets/
│   │   └── page.tsx
│   ├── documents/
│   │   └── page.tsx
│   ├── ai-assistant/
│   │   └── page.tsx
│   └── api/
│       ├── transactions/
│       ├── invoices/
│       ├── reports/
│       ├── reconciliation/
│       ├── ai/
│       └── forecast/
├── components/
│   ├── Sidebar.tsx
│   ├── TopBar.tsx
│   ├── DashboardChart.tsx
│   ├── TransactionForm.tsx
│   ├── InvoiceForm.tsx
│   ├── ReceiptUploader.tsx
│   └── AIChat.tsx
├── lib/
│   ├── db.ts
│   ├── utils.ts
│   └── types.ts
├── public/
│   └── receipts/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```
