// Type definitions for Accountant AI App

export type TransactionType = 'income' | 'expense';

export type TransactionCategory = 
  | 'Sales'
  | 'Services'
  | 'Investments'
  | 'Other Income'
  | 'Food & Dining'
  | 'Transportation'
  | 'Utilities'
  | 'Office Supplies'
  | 'Marketing'
  | 'Professional Services'
  | 'Rent'
  | 'Equipment'
  | 'Software'
  | 'Insurance'
  | 'Travel'
  | 'Payroll'
  | 'Taxes'
  | 'Other Expense';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description: string;
  receiptPath?: string;
  isRecurring?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  category: TransactionCategory;
  amount: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'receipt' | 'invoice' | 'tax' | 'contract' | 'other';
  path: string;
  size: number;
  uploadedAt: string;
}

export interface BankTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  matched: boolean;
  matchedTransactionId?: string;
}

export interface AppSettings {
  businessName: string;
  businessEmail: string;
  businessAddress: string;
  businessPhone: string;
  currency: string;
  taxRate: number;
}

// Dashboard Summary Types
export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  pendingInvoices: number;
  overdueInvoices: number;
  taxOwed: number;
}

// Report Types
export interface ProfitLossReport {
  revenue: number;
  expenses: number;
  netProfit: number;
  period: string;
  incomeByCategory: Record<string, number>;
  expensesByCategory: Record<string, number>;
}

export interface BalanceSheetReport {
  assets: number;
  liabilities: number;
  equity: number;
  date: string;
}

export interface CashFlowReport {
  operatingActivities: number;
  investingActivities: number;
  financingActivities: number;
  netCashFlow: number;
  period: string;
}

// AI Message Type
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
