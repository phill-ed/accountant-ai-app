'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts'
import {
  Calculator, TrendingUp, TrendingDown, DollarSign, FileText, CreditCard, Receipt,
  Bell, Settings, Plus, Search, Upload, Download, Send, CheckCircle, AlertCircle,
  Menu, User, Target, RefreshCw, Clock, Check, XCircle, Filter, MessageCircle,
  Briefcase, Building, Calendar, Banknote, FileInvoice, PieChart as PieChartIcon,
  BarChart3, Camera, ChevronRight, ChevronDown, Eye, Edit, Trash2, Lock,
  Shield, Key, File, Folder, Database, Cloud, Smartphone, Mail, Phone,
  MapPin, Globe, CreditCard as CreditCardIcon, Wallet, PiggyBank, Scale,
  TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon, BarChart2,
  FileSignature, Printer, Share2, Filter as FilterIcon, MoreVertical, Download as DownloadIcon
} from 'lucide-react'

// ==================== TYPE DEFINITIONS ====================

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  category: string
  type: 'income' | 'expense'
  status: 'completed' | 'pending' | 'recurring'
  account: string
  tags: string[]
}

interface Invoice {
  id: string
  clientId: string
  clientName: string
  clientEmail: string
  clientAddress: string
  amount: number
  date: string
  dueDate: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  items: InvoiceItem[]
  notes: string
  createdAt: string
}

interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

interface ReceiptData {
  id: string
  vendor: string
  date: string
  total: number
  category: string
  items: string[]
  imageData?: string
  confidence: number
  processed: boolean
}

interface Budget {
  id: string
  category: string
  budgeted: number
  spent: number
  period: 'monthly' | 'quarterly' | 'yearly'
  alerts: boolean
  alertThreshold: number
}

interface BankAccount {
  id: string
  name: string
  bank: string
  accountNumber: string
  balance: number
  lastSynced: string
}

interface ReconciliationItem {
  id: string
  date: string
  bankDescription: string
  bankAmount: number
  bookDescription: string
  bookAmount: number
  status: 'matched' | 'unmatched' | 'pending'
  matchConfidence?: number
}

interface TaxRecord {
  id: string
  category: string
  amount: number
  deductible: boolean
  taxYear: number
  quarter: number
  documentation: string[]
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface User {
  id: string
  name: string
  email: string
  company: string
  role: string
  twoFactorEnabled: boolean
  lastLogin: string
  preferences: {
    currency: string
    timezone: string
    notifications: boolean
    autoBackup: boolean
  }
}

// ==================== MOCK DATA ====================

const mockTransactions: Transaction[] = [
  { id: 'TXN-001', date: '2026-02-14', description: 'Client Payment - ABC Corporation', amount: 15000, category: 'Consulting', type: 'income', status: 'completed', account: 'Business Checking', tags: ['recurring'] },
  { id: 'TXN-002', date: '2026-02-14', description: 'Office Supplies - Staples', amount: 450, category: 'Office Supplies', type: 'expense', status: 'completed', account: 'Business Checking', tags: [] },
  { id: 'TXN-003', date: '2026-02-13', description: 'Consulting Fee - XYZ Project', amount: 5000, category: 'Consulting', type: 'income', status: 'completed', account: 'Business Checking', tags: ['project'] },
  { id: 'TXN-004', date: '2026-02-13', description: 'Adobe Creative Cloud', amount: 299, category: 'Software', type: 'expense', status: 'recurring', account: 'Business Checking', tags: ['subscription'] },
  { id: 'TXN-005', date: '2026-02-12', description: 'Monthly Retainer - TechCorp', amount: 8000, category: 'Retainers', type: 'income', status: 'completed', account: 'Business Checking', tags: ['recurring'] },
  { id: 'TXN-006', date: '2026-02-12', description: 'Google Ads Campaign', amount: 2000, category: 'Marketing', type: 'expense', status: 'pending', account: 'Business Checking', tags: ['advertising'] },
  { id: 'TXN-007', date: '2026-02-11', description: 'Freelance Development', amount: 3500, category: 'Development', type: 'income', status: 'completed', account: 'Business Checking', tags: ['project'] },
  { id: 'TXN-008', date: '2026-02-11', description: 'Electric Bill', amount: 350, category: 'Utilities', type: 'expense', status: 'completed', account: 'Business Checking', tags: ['recurring'] },
  { id: 'TXN-009', date: '2026-02-10', description: 'Product Sales - February', amount: 12000, category: 'Sales', type: 'income', status: 'completed', account: 'Business Checking', tags: ['sales'] },
  { id: 'TXN-010', date: '2026-02-10', description: 'Client Meeting - NYC', amount: 850, category: 'Travel', type: 'expense', status: 'completed', account: 'Business Checking', tags: ['client'] },
  { id: 'TXN-011', date: '2026-02-09', description: 'QuickBooks Subscription', amount: 180, category: 'Software', type: 'expense', status: 'recurring', account: 'Business Checking', tags: ['subscription'] },
  { id: 'TXN-012', date: '2026-02-08', description: 'Workshop Facilitation', amount: 2500, category: 'Education', type: 'income', status: 'completed', account: 'Business Checking', tags: ['event'] },
]

const mockInvoices: Invoice[] = [
  { id: 'INV-2026-001', clientId: 'CLT-001', clientName: 'ABC Corporation', clientEmail: 'billing@abc.com', clientAddress: '123 Business Ave, New York, NY 10001', amount: 15000, date: '2026-02-01', dueDate: '2026-02-15', status: 'sent', items: [{ description: 'Strategic Consulting Services - January 2026', quantity: 40, unitPrice: 375, amount: 15000 }], notes: 'Payment due within 14 days. Thank you for your business!', createdAt: '2026-02-01T09:00:00Z' },
  { id: 'INV-2026-002', clientId: 'CLT-002', clientName: 'XYZ Ltd', clientEmail: 'accounts@xyz.co', clientAddress: '456 Tech Park, San Francisco, CA 94102', amount: 8500, date: '2026-01-25', dueDate: '2026-02-08', status: 'paid', items: [{ description: 'Web Development Services', quantity: 1, unitPrice: 8500, amount: 8500 }], notes: 'Thank you for your payment!', createdAt: '2026-01-25T14:30:00Z' },
  { id: 'INV-2026-003', clientId: 'CLT-003', clientName: 'TechStart Inc', clientEmail: 'finance@techstart.io', clientAddress: '789 Innovation Blvd, Austin, TX 78701', amount: 12000, date: '2026-01-15', dueDate: '2026-01-30', status: 'overdue', items: [{ description: 'Mobile App Development - Phase 1', quantity: 1, unitPrice: 12000, amount: 12000 }], notes: 'Please remit payment at your earliest convenience.', createdAt: '2026-01-15T11:00:00Z' },
  { id: 'INV-2026-004', clientId: 'CLT-004', clientName: 'Global Services LLC', clientEmail: 'ap@globalservices.com', clientAddress: '321 Enterprise Dr, Chicago, IL 60601', amount: 5500, date: '2026-02-10', dueDate: '2026-02-24', status: 'sent', items: [{ description: 'API Integration Services', quantity: 1, unitPrice: 5500, amount: 5500 }], notes: 'Services completed as per SOW.', createdAt: '2026-02-10T16:45:00Z' },
  { id: 'INV-2026-005', clientId: 'CLT-005', clientName: 'DataFlow Co', clientEmail: 'billing@dataflow.co', clientAddress: '654 Data Way, Seattle, WA 98101', amount: 20000, date: '2026-02-05', dueDate: '2026-02-19', status: 'sent', items: [{ description: 'Data Analytics Project - Completion', quantity: 1, unitPrice: 20000, amount: 20000 }], notes: 'Final payment for Phase 2 completion.', createdAt: '2026-02-05T10:30:00Z' },
  { id: 'INV-2026-006', clientId: 'CLT-001', clientName: 'ABC Corporation', clientEmail: 'billing@abc.com', clientAddress: '123 Business Ave, New York, NY 10001', amount: 22000, date: '2026-02-14', dueDate: '2026-02-28', status: 'draft', items: [{ description: 'Strategic Consulting Services - February 2026', quantity: 55, unitPrice: 400, amount: 22000 }], notes: '', createdAt: '2026-02-14T08:00:00Z' },
]

const mockReceipts: ReceiptData[] = [
  { id: 'RCP-001', vendor: 'Office Depot', date: '2026-02-14', total: 450, category: 'Office Supplies', items: ['Printer Paper (5 reams)', 'Ink Cartridge Black', 'Ink Cartridge Color', 'Sticky Notes (12 packs)'], confidence: 0.95, processed: true },
  { id: 'RCP-002', vendor: 'Amazon Web Services', date: '2026-02-13', total: 299, category: 'Software', items: ['AWS EC2 Instance - t3.medium', 'AWS RDS - db.t3.micro', 'Data Transfer'], confidence: 0.98, processed: true },
  { id: 'RCP-003', vendor: 'Uber Business', date: '2026-02-12', total: 85, category: 'Travel', items: ['Trip to JFK Airport', 'Trip from Meeting'], confidence: 0.88, processed: true },
  { id: 'RCP-004', vendor: 'Starbucks', date: '2026-02-11', total: 42, category: 'Meals & Entertainment', items: ['Coffee Meeting - Client'], confidence: 0.92, processed: true },
]

const mockBudgets: Budget[] = [
  { id: 'BGT-001', category: 'Marketing & Advertising', budgeted: 5000, spent: 2000, period: 'monthly', alerts: true, alertThreshold: 80 },
  { id: 'BGT-002', category: 'Office Supplies', budgeted: 1000, spent: 850, period: 'monthly', alerts: true, alertThreshold: 90 },
  { id: 'BGT-003', category: 'Software & Subscriptions', budgeted: 2000, spent: 1578, period: 'monthly', alerts: true, alertThreshold: 75 },
  { id: 'BGT-004', category: 'Travel & Entertainment', budgeted: 3000, spent: 1850, period: 'monthly', alerts: true, alertThreshold: 85 },
  { id: 'BGT-005', category: 'Utilities', budgeted: 1500, spent: 1050, period: 'monthly', alerts: false, alertThreshold: 90 },
  { id: 'BGT-006', category: 'Professional Services', budgeted: 5000, spent: 0, period: 'monthly', alerts: true, alertThreshold: 90 },
  { id: 'BGT-007', category: 'Insurance', budgeted: 2500, spent: 2500, period: 'monthly', alerts: true, alertThreshold: 100 },
]

const mockBankAccounts: BankAccount[] = [
  { id: 'ACC-001', name: 'Business Checking', bank: 'Chase Bank', accountNumber: '****4521', balance: 85420.50, lastSynced: '2026-02-14T08:00:00Z' },
  { id: 'ACC-002', name: 'Business Savings', bank: 'Chase Bank', accountNumber: '****7832', balance: 125000.00, lastSynced: '2026-02-14T08:00:00Z' },
  { id: 'ACC-003', name: 'Business Credit Card', bank: 'American Express', accountNumber: '****9012', balance: -4250.00, lastSynced: '2026-02-14T08:00:00Z' },
]

const mockReconciliation: ReconciliationItem[] = [
  { id: 'REC-001', date: '2026-02-14', bankDescription: 'DEPOSIT - ACH TRANSFER', bankAmount: 15000, bookDescription: 'Client Payment - ABC Corporation', bookAmount: 15000, status: 'matched', matchConfidence: 98 },
  { id: 'REC-002', date: '2026-02-13', bankDescription: 'POS PURCHASE - AMAZON AWS', bankAmount: -299, bookDescription: 'Adobe Creative Cloud', bookAmount: -299, status: 'matched', matchConfidence: 92 },
  { id: 'REC-003', date: '2026-02-12', bankDescription: 'DEPOSIT - WIRE TRANSFER', bankAmount: 8000, bookDescription: 'Monthly Retainer - TechCorp', bookAmount: 8000, status: 'matched', matchConfidence: 95 },
  { id: 'REC-004', date: '2026-02-11', bankDescription: 'UNKNOWN DEPOSIT 5000.00', bankAmount: 5000, bookDescription: '', bookAmount: 0, status: 'pending', matchConfidence: 0 },
  { id: 'REC-005', date: '2026-02-10', bankDescription: 'WIRE TRANSFER IN', bankAmount: 12000, bookDescription: 'Product Sales - February', bookAmount: 12000, status: 'matched', matchConfidence: 99 },
]

const mockTaxRecords: TaxRecord[] = [
  { id: 'TAX-001', category: 'Business Meals', amount: 450, deductible: true, taxYear: 2026, quarter: 1, documentation: ['receipt_RCP-004.jpg'] },
  { id: 'TAX-002', category: 'Office Supplies', amount: 1300, deductible: true, taxYear: 2026, quarter: 1, documentation: ['receipt_RCP-001.jpg', 'office_supplies_invoice.pdf'] },
  { id: 'TAX-003', category: 'Software & Subscriptions', amount: 478, deductible: true, taxYear: 2026, quarter: 1, documentation: ['aws_invoice.pdf', 'adobe_receipt.pdf'] },
  { id: 'TAX-004', category: 'Professional Development', amount: 2500, deductible: true, taxYear: 2026, quarter: 1, documentation: ['workshop_certificate.pdf'] },
  { id: 'TAX-005', category: 'Travel Expenses', amount: 1935, deductible: true, taxYear: 2026, quarter: 1, documentation: ['uber_receipts.pdf', 'flight_confirmation.pdf'] },
  { id: 'TAX-006', category: 'Marketing', amount: 2000, deductible: true, taxYear: 2026, quarter: 1, documentation: ['google_ads_invoice.pdf'] },
]

const aiKnowledgeBase = [
  { question: 'How do I track business expenses?', answer: 'Use the Transactions tab to add expenses. Categorize them properly (Office Supplies, Travel, Software, etc.) for accurate reporting and tax deductions.' },
  { question: 'What is the best invoicing practice?', answer: 'Send invoices immediately upon completing work, set clear payment terms (NET-15 or NET-30), and follow up on overdue invoices.' },
  { question: 'How much should I set aside for taxes?', answer: 'A good rule of thumb is to set aside 25-30% of your income for taxes. Adjust based on your marginal tax bracket and local requirements.' },
  { question: 'What accounting software do you recommend?', answer: 'For small businesses, QuickBooks Online, Xero, or FreshBooks are excellent choices. For freelancers, consider Wave (free) or FreshBooks.' },
  { question: 'How often should I reconcile my bank account?', answer: 'Reconcile your bank account at least monthly. Weekly reconciliation is recommended for businesses with high transaction volumes.' },
  { question: 'What financial reports should I review regularly?', answer: 'Key reports: Profit & Loss (monthly), Balance Sheet (quarterly), Cash Flow Statement (monthly), and Accounts Receivable Aging (weekly).' },
  { question: 'How can I improve cash flow?', answer: 'Invoice promptly, offer early payment discounts, negotiate longer payment terms with suppliers, maintain a cash reserve, and monitor receivables closely.' },
  { question: 'What deductions can I claim as a business owner?', answer: 'Common deductions: Home office expenses, vehicle use, business meals, professional development, software subscriptions, and business insurance.' },
]

// ==================== UTILITY FUNCTIONS ====================

const formatCurrency = (amount: number, currency: string = 'IDR') => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
}

const getDaysUntilDue = (dueDate: string) => {
  const due = new Date(dueDate)
  const today = new Date()
  const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

// ==================== CHART COLORS ====================

const COLORS = {
  primary: '#2563eb',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
  pink: '#ec4899',
  cyan: '#06b6d4',
  lime: '#84cc16',
  chartColors: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316']
}

// ==================== MAIN COMPONENT ====================

export default function AccountantAIApp() {
  // State
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [notifications, setNotifications] = useState<{ id: string; message: string; type: string }[]>([])
  
  // Data State
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
  const [receipts, setReceipts] = useState<ReceiptData[]>(mockReceipts)
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets)
  
  // AI Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'assistant', content: "👋 Welcome! I'm your AI Accountant. I can help you with:\n\n• Financial analysis and insights\n• Accounting questions and best practices\n• Tax planning tips\n• Cash flow optimization\n• Expense management strategies\n\nWhat would you like to know?", timestamp: new Date() }
  ])
  const [chatInput, setChatInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  // Security State
  const [showSecurityPanel, setShowSecurityPanel] = useState(false)
  const [securityLogs, setSecurityLogs] = useState<{ id: string; event: string; timestamp: string; ip: string }[]>([
    { id: 'SEC-001', event: 'Successful login', timestamp: '2026-02-14T07:45:00Z', ip: '192.168.1.xxx' },
    { id: 'SEC-002', event: 'Password changed', timestamp: '2026-02-13T15:30:00Z', ip: '192.168.1.xxx' },
    { id: 'SEC-003', event: 'Two-factor authentication enabled', timestamp: '2026-02-12T10:00:00Z', ip: '192.168.1.xxx' },
  ])

  // Calculate metrics
  const totalIncome = transactions.filter(t => t.type === 'income' && t.status !== 'cancelled').reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.type === 'expense' && t.status !== 'cancelled').reduce((sum, t) => sum + t.amount, 0)
  const netIncome = totalIncome - totalExpenses
  const pendingInvoicesAmount = invoices.filter(i => i.status === 'sent' || i.status === 'draft').reduce((sum, i) => sum + i.amount, 0)
  const overdueInvoicesAmount = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0)
  const paidInvoicesAmount = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0)
  
  const totalBudgeted = budgets.reduce((sum, b) => sum + b.budgeted, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  
  // Chart data
  const expenseByCategory = [
    { name: 'Office Supplies', value: 1300 },
    { name: 'Software', value: 478 },
    { name: 'Marketing', value: 2000 },
    { name: 'Travel', value: 1935 },
    { name: 'Utilities', value: 1050 },
  ]

  const incomeVsExpenses = [
    { name: 'Mon 8', income: 8500, expenses: 2800 },
    { name: 'Tue 9', income: 2500, expenses: 150 },
    { name: 'Wed 10', income: 12000, expenses: 850 },
    { name: 'Thu 11', income: 3500, expenses: 392 },
    { name: 'Fri 12', income: 8000, expenses: 2000 },
    { name: 'Sat 13', income: 5000, expenses: 299 },
    { name: 'Sun 14', income: 15000, expenses: 450 },
  ]

  const monthlyTrend = [
    { month: 'Aug', revenue: 45000, expenses: 28000, profit: 17000 },
    { month: 'Sep', revenue: 52000, expenses: 31000, profit: 21000 },
    { month: 'Oct', revenue: 48000, expenses: 29000, profit: 19000 },
    { month: 'Nov', revenue: 61000, expenses: 35000, profit: 26000 },
    { month: 'Dec', revenue: 55000, expenses: 32000, profit: 23000 },
    { month: 'Jan', revenue: 67000, expenses: 38000, profit: 29000 },
    { month: 'Feb', revenue: 48500, expenses: 28499, profit: 20001 },
  ]

  const cashFlow = [
    { month: 'Aug', inflow: 45000, outflow: 28000, net: 17000 },
    { month: 'Sep', inflow: 52000, outflow: 31000, net: 21000 },
    { month: 'Oct', inflow: 48000, outflow: 29000, net: 19000 },
    { month: 'Nov', inflow: 61000, outflow: 35000, net: 26000 },
    { month: 'Dec', inflow: 55000, outflow: 32000, net: 23000 },
    { month: 'Jan', inflow: 67000, outflow: 38000, net: 29000 },
    { month: 'Feb', inflow: 48500, outflow: 28499, net: 20001 },
  ]

  const budgetProgress = budgets.map(b => ({
    ...b,
    percentage: Math.min((b.spent / b.budgeted) * 100, 100),
    remaining: b.budgeted - b.spent
  }))

  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: PieChartIcon },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'invoices', label: 'Invoices', icon: FileInvoice },
    { id: 'receipts', label: 'Receipts', icon: Receipt },
    { id: 'reports', label: 'Financial Reports', icon: BarChart3 },
    { id: 'reconciliation', label: 'Bank Reconciliation', icon: RefreshCw },
    { id: 'tax', label: 'Tax Preparation', icon: Calculator },
    { id: 'budget', label: 'Budget & Forecast', icon: Target },
    { id: 'security', label: 'Security Center', icon: Shield },
    { id: 'ai-assistant', label: 'AI Assistant', icon: MessageCircle },
  ]

  // Filter transactions
  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.amount.toString().includes(searchQuery)
  )

  // Handle AI chat
  const handleChatSubmit = useCallback(() => {
    if (!chatInput.trim() || isTyping) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date()
    }
    setChatMessages(prev => [...prev, userMsg])
    setChatInput('')
    setIsTyping(true)

    setTimeout(() => {
      const query = chatInput.toLowerCase()
      let response = ''
      
      // Find matching answer from knowledge base
      for (const item of aiKnowledgeBase) {
        if (item.question.toLowerCase().includes(query) || 
            item.answer.toLowerCase().includes(query) ||
            query.includes(item.category.toLowerCase())) {
          response = `**${item.question}**\n\n${item.answer}`
          break
        }
      }

      // Default responses based on keywords
      if (!response) {
        if (query.includes('expense') || query.includes('spend')) {
          response = `Based on your current data, your total expenses this month are ${formatCurrency(totalExpenses)}. The largest categories are:\n\n• Marketing: ${formatCurrency(2000)}\n• Travel: ${formatCurrency(1935)}\n• Office Supplies: ${formatCurrency(1300)}\n\nWould you like a detailed expense breakdown?`
        } else if (query.includes('income') || query.includes('revenue') || query.includes('profit')) {
          response = `Your financial summary:\n\n• Total Income: ${formatCurrency(totalIncome)}\n• Total Expenses: ${formatCurrency(totalExpenses)}\n• Net Income: ${formatCurrency(netIncome)}\n\nProfit margin: ${((netIncome / totalIncome) * 100).toFixed(1)}%`
        } else if (query.includes('invoice') || query.includes('payment')) {
          response = `Invoice status summary:\n\n• Pending: ${formatCurrency(pendingInvoicesAmount)}\n• Overdue: ${formatCurrency(overdueInvoicesAmount)}\n• Paid: ${formatCurrency(paidInvoicesAmount)}\n\n${overdueInvoicesAmount > 0 ? '⚠️ You have overdue invoices requiring attention.' : 'All invoices are up to date!'}`
        } else if (query.includes('tax')) {
          response = `Tax preparation summary:\n\n• Q1 Deductions: ${formatCurrency(mockTaxRecords.reduce((sum, t) => sum + (t.deductible ? t.amount : 0), 0))}\n• Estimated Tax Liability: ${formatCurrency(mockTaxRecords.reduce((sum, t) => sum + (t.deductible ? t.amount : 0), 0) * 0.25)}\n\nRecommended: Set aside ${formatCurrency(totalIncome * 0.25)} for taxes this quarter.`
        } else {
          response = "I understand you're asking about accounting. Could you be more specific? You can ask about:\n\n• Expenses and spending\n• Income and revenue\n• Invoices and payments\n• Tax preparation\n• Budgeting and forecasting\n• Bank reconciliation"
        }
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, assistantMsg])
      setIsTyping(false)
    }, 1500)
  }, [chatInput, isTyping, totalIncome, totalExpenses, netIncome, pendingInvoicesAmount, overdueInvoicesAmount, paidInvoicesAmount])

  // Open modal
  const openModal = (type: string) => {
    setModalType(type)
    setShowModal(true)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? 280 : 0,
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
        color: 'white',
        padding: sidebarOpen ? '1.5rem' : 0,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 50
      }}>
        {sidebarOpen && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', paddingLeft: '0.5rem' }}>
              <Calculator size={32} style={{ color: '#3b82f6' }} />
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>AI Accountant</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Smart Financial Management</div>
              </div>
            </div>
            
            <nav>
              {navItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginBottom: '0.25rem',
                    transition: 'all 0.2s',
                    background: activeTab === item.id ? '#3b82f6' : 'transparent',
                    color: activeTab === item.id ? 'white' : '#cbd5e1'
                  }}
                >
                  <item.icon size={20} />
                  {item.label}
                </div>
              ))}
            </nav>

            <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Shield size={16} style={{ color: '#10b981' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Data Encrypted</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Your data is protected with AES-256 encryption</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: sidebarOpen ? 280 : 0, transition: 'margin-left 0.3s' }}>
        {/* Top Bar */}
        <div style={{
          background: 'white',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
              <Menu size={20} style={{ color: '#64748b' }} />
            </button>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>
              {navItems.find(n => n.id === activeTab)?.label}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search transactions, invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: 300,
                  padding: '0.5rem 1rem 0.5rem 2.5rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
              <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>

            <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
              <Bell size={20} style={{ color: '#64748b' }} />
              {notifications.length > 0 && (
                <span style={{ position: 'absolute', top: 0, right: 0, width: 16, height: 16, background: '#ef4444', borderRadius: '50%', fontSize: '0.65rem', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {notifications.length}
                </span>
              )}
            </button>

            <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
              <Settings size={20} style={{ color: '#64748b' }} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1rem', borderLeft: '1px solid #e2e8f0' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>
                EA
              </div>
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>Ed Account</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Administrator</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '2rem' }}>
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <TrendingUp size={24} style={{ color: '#10b981' }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>+12%</span>
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>{formatCurrency(totalIncome)}</div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Total Income</div>
                </div>

                <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <TrendingDown size={24} style={{ color: '#ef4444' }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>+8%</span>
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>{formatCurrency(totalExpenses)}</div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Total Expenses</div>
                </div>

                <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <DollarSign size={24} style={{ color: '#2563eb' }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>+15%</span>
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>{formatCurrency(netIncome)}</div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Net Income</div>
                </div>

                <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileInvoice size={24} style={{ color: '#f59e0b' }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', background: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>{invoices.filter(i => i.status === 'sent' || i.status === 'draft').length} invoices</span>
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>{formatCurrency(pendingInvoicesAmount)}</div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Pending Invoices</div>
                </div>
              </div>

              {/* Charts Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>Income vs Expenses</h3>
                    <select style={{ padding: '0.25rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.75rem' }}>
                      <option>This Week</option>
                      <option>This Month</option>
                    </select>
                  </div>
                  <div style={{ height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={incomeVsExpenses}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                        <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                        <Bar dataKey="income" fill="#10b981" name="Income" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>Expenses by Category</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ height: 200, width: 200 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={expenseByCategory}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {expenseByCategory.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS.chartColors[index % COLORS.chartColors.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={{ flex: 1 }}>
                      {expenseByCategory.map((item, index) => (
                        <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: 12, height: 12, borderRadius: '3px', background: COLORS.chartColors[index % COLORS.chartColors.length] }} />
                            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{item.name}</span>
                          </div>
                          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{formatCurrency(item.value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity & Budget */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>Recent Transactions</h3>
                    <button onClick={() => setActiveTab('transactions')} style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>View All</button>
                  </div>
                  <div>
                    {transactions.slice(0, 5).map(t => (
                      <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9' }}>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{t.description}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{t.date}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: t.type === 'income' ? '#10b981' : '#ef4444' }}>
                            {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                          </div>
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8', background: t.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', padding: '0.125rem 0.5rem', borderRadius: '4px' }}>
                            {t.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>Budget Overview</h3>
                    <button onClick={() => setActiveTab('budget')} style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>Manage</button>
                  </div>
                  {budgetProgress.slice(0, 5).map(b => (
                    <div key={b.id} style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{b.category}</span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{formatCurrency(b.spent)} / {formatCurrency(b.budgeted)}</span>
                      </div>
                      <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${b.percentage}%`, background: b.percentage > 90 ? '#ef4444' : b.percentage > 70 ? '#f59e0b' : '#10b981', borderRadius: 4, transition: 'width 0.3s' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Transactions */}
          {activeTab === 'transactions' && (
            <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>All Transactions</h3>
                <button style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={18} /> Add Transaction
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Date</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Description</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Category</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Amount</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map(t => (
                      <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>{t.date}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{t.description}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{ fontSize: '0.75rem', background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>{t.category}</span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 600, color: t.type === 'income' ? '#10b981' : '#ef4444' }}>
                          {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px', background: t.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : t.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(37, 99, 235, 0.1)', color: t.status === 'completed' ? '#10b981' : t.status === 'pending' ? '#f59e0b' : '#2563eb' }}>
                            {t.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '0.5rem', color: '#3b82f6' }}><Edit size={16} /></button>
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Invoices */}
          {activeTab === 'invoices' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Clock size={24} style={{ color: '#f59e0b' }} />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b' }}>{formatCurrency(pendingInvoicesAmount)}</div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Pending Invoices</div>
                </div>
                <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <AlertCircle size={24} style={{ color: '#ef4444' }} />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b' }}>{formatCurrency(overdueInvoicesAmount)}</div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Overdue</div>
                </div>
                <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <CheckCircle size={24} style={{ color: '#10b981' }} />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b' }}>{formatCurrency(paidInvoicesAmount)}</div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Paid</div>
                </div>
              </div>

              <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>Invoices</h3>
                  <button style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> Create Invoice
                  </button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Invoice #</th>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Client</th>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Amount</th>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Date</th>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Due Date</th>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map(inv => (
                        <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{inv.id}</td>
                          <td style={{ padding: '0.75rem 1rem' }}>{inv.clientName}</td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(inv.amount)}</td>
                          <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>{formatDate(inv.date)}</td>
                          <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>{formatDate(inv.dueDate)}</td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                            <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px', background: inv.status === 'paid' ? 'rgba(16, 185, 129, 0.1)' : inv.status === 'overdue' ? 'rgba(239, 68, 68, 0.1)' : inv.status === 'sent' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(148, 163, 184, 0.1)', color: inv.status === 'paid' ? '#10b981' : inv.status === 'overdue' ? '#ef4444' : inv.status === 'sent' ? '#f59e0b' : '#94a3b8' }}>
                              {inv.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '0.5rem', color: '#3b82f6' }}><Eye size={16} /></button>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6' }}><Download size={16} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Receipts */}
          {activeTab === 'receipts' && (
            <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>Receipt Management</h3>
                <button style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Upload size={18} /> Upload Receipt
                </button>
              </div>
              
              <div style={{ border: '2px dashed #e2e8f0', borderRadius: '12px', padding: '3rem', textAlign: 'center', marginBottom: '2rem' }}>
                <Upload size={48} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
                <h4 style={{ marginBottom: '0.5rem', color: '#374151' }}>Upload Receipt</h4>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Drag and drop receipt images here, or click to browse</p>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Supports: JPG, PNG, PDF up to 10MB</p>
              </div>

              <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>Recent Receipts</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                {receipts.map(receipt => (
                  <div key={receipt.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '8px', background: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Receipt size={20} style={{ color: '#2563eb' }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.125rem 0.5rem', borderRadius: '4px' }}>
                        {Math.round(receipt.confidence * 100)}% match
                      </span>
                    </div>
                    <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{receipt.vendor}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>{receipt.date}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>{receipt.category}</span>
                      <span style={{ fontWeight: 600 }}>{formatCurrency(receipt.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Financial Reports */}
          {activeTab === 'reports' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <button style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', cursor: 'pointer', textAlign: 'left' }}>
                  <FileText size={24} style={{ color: '#3b82f6', marginBottom: '0.75rem' }} />
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Profit & Loss</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Revenue, expenses, and profit</div>
                </button>
                <button style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', cursor: 'pointer', textAlign: 'left' }}>
                  <Building size={24} style={{ color: '#3b82f6', marginBottom: '0.75rem' }} />
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Balance Sheet</div>
                  <div style={{ fontSize: '0.75rem