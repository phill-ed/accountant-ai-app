import { format, parseISO, isValid } from 'date-fns';
import type { TransactionCategory } from './types';

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return dateString;
    return format(date, 'MMM dd, yyyy');
  } catch {
    return dateString;
  }
}

export function formatDateShort(dateString: string): string {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return dateString;
    return format(date, 'MM/dd/yyyy');
  } catch {
    return dateString;
  }
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Sales': '#10B981',
    'Services': '#3B82F6',
    'Investments': '#8B5CF6',
    'Other Income': '#06B6D4',
    'Food & Dining': '#F59E0B',
    'Transportation': '#EF4444',
    'Utilities': '#6366F1',
    'Office Supplies': '#EC4899',
    'Marketing': '#14B8A6',
    'Professional Services': '#F97316',
    'Rent': '#84CC16',
    'Equipment': '#0EA5E9',
    'Software': '#A855F7',
    'Insurance': '#22C55E',
    'Travel': '#EAB308',
    'Payroll': '#EF4444',
    'Taxes': '#DC2626',
    'Other Expense': '#6B7280',
  };
  return colors[category] || '#6B7280';
}

export const EXPENSE_CATEGORIES: TransactionCategory[] = [
  'Food & Dining',
  'Transportation',
  'Utilities',
  'Office Supplies',
  'Marketing',
  'Professional Services',
  'Rent',
  'Equipment',
  'Software',
  'Insurance',
  'Travel',
  'Payroll',
  'Taxes',
  'Other Expense',
];

export const INCOME_CATEGORIES: TransactionCategory[] = [
  'Sales',
  'Services',
  'Investments',
  'Other Income',
];

export function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `INV-${year}${month}-${random}`;
}

export function calculateTax(amount: number, taxRate: number): number {
  return amount * (taxRate / 100);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: '#6B7280',
    sent: '#3B82F6',
    paid: '#10B981',
    overdue: '#EF4444',
  };
  return colors[status] || '#6B7280';
}

export function getStatusBgColor(status: string): string {
  const colors: Record<string, string> = {
    draft: '#F3F4F6',
    sent: '#DBEAFE',
    paid: '#D1FAE5',
    overdue: '#FEE2E2',
  };
  return colors[status] || '#F3F4F6';
}

// Simple AI response generation based on accounting knowledge
export function generateAIResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  // Tax related questions
  if (message.includes('tax')) {
    return `Here are some key tax tips for small businesses:\n\n**1. Keep Accurate Records**\nMaintain detailed records of all income and expenses throughout the year.\n\n**2. Know Your Deductions**\nCommon deductible expenses include:\n- Office supplies and equipment\n- Business travel\n- Home office (if applicable)\n- Professional services\n\n**3. Quarterly Estimates**\nIf you're self-employed, pay quarterly estimated taxes to avoid penalties.\n\n**4. Tax Rates**\nSmall business corporate tax rates range from 15-21% depending on your structure.\n\nWould you like me to generate a tax summary report for your business?`;
  }
  
  // Invoice related
  if (message.includes('invoice')) {
    return `Here are best practices for invoicing:\n\n**1. Clear Payment Terms**\nInclude due dates and late fees clearly on each invoice.\n\n**2. Itemize Services**\nList each service/product with quantity and rate.\n\n**3. Follow Up**\nSend reminders for unpaid invoices.\n\n**4. Offer Multiple Payment Methods**\nBank transfer, credit card, PayPal, etc.\n\nYou currently have ${db.getInvoices().filter(i => i.status === 'overdue').length} overdue invoices. Would you like me to help you send reminders?`;
  }
  
  // Profit & Loss
  if (message.includes('profit') || message.includes('loss') || message.includes('pnl')) {
    return `A Profit & Loss (P&L) statement shows your revenue minus expenses over a period.\n\n**To analyze your P&L:**\n\n1. **Gross Profit** = Revenue - Cost of Goods Sold\n2. **Operating Expenses** = All business expenses\n3. **Net Profit** = Gross Profit - Operating Expenses\n\n**Key Metrics to Watch:**\n- Profit margin (Net Profit / Revenue × 100)\n- Expense ratio (Expenses / Revenue × 100)\n- Revenue growth trend\n\nWould you like me to generate a P&L report for a specific period?`;
  }
  
  // Cash flow
  if (message.includes('cash flow')) {
    return `Cash flow is the lifeblood of any business. Here's how to improve it:\n\n**1. Invoice Quickly**\nSend invoices immediately after completing work.\n\n**2. Offer Early Payment Discounts**\n2% discount if paid within 10 days.\n\n**3. Monitor Receivables**\nTrack average payment time and follow up promptly.\n\n**4. Manage Inventory**\nDon't tie up too much cash in inventory.\n\n**5. Build a Cash Reserve**\nAim for 3-6 months of operating expenses.\n\nYour current cash position: ${formatCurrency(db.getDashboardSummary().netProfit)} this month.`;
  }
  
  // Expense tracking
  if (message.includes('expense')) {
    return `Effective expense tracking tips:\n\n**1. Categorize Everything**\nAssign each expense to a category for better analysis.\n\n**2. Track in Real-Time**\nDon't wait to record expenses - do it immediately.\n\n**3. Keep Receipts**\nSave all receipts for documentation and tax purposes.\n\n**4. Review Monthly**\nCompare actual expenses to budget monthly.\n\n**Your Top Expense Categories:**\n${Object.entries(db.getExpenseBreakdown().slice(0, 3)).map(([cat, val]) => `- ${cat}: ${formatCurrency(val)}`).join('\n')}`;
  }
  
  // Budget
  if (message.includes('budget')) {
    return `Creating an effective budget:\n\n**1. Start with Goals**\nDefine what you want to achieve.\n\n**2. Calculate Fixed Costs**\nRent, salaries, insurance - costs that don't change much.\n\n**3. Estimate Variable Costs**\nMarketing, supplies, utilities.\n\n**4. Add a Buffer**\nInclude 10-15% for unexpected expenses.\n\n**5. Review and Adjust**\nCompare actual vs. budget monthly.\n\nWould you like me to help you set up a budget for specific categories?`;
  }
  
  // General financial health
  if (message.includes('financial health') || message.includes('financials')) {
    const summary = db.getDashboardSummary();
    return `Here's your current financial snapshot:\n\n**This Month:**\n- Income: ${formatCurrency(summary.totalIncome)}\n- Expenses: ${formatCurrency(summary.totalExpenses)}\n- Net Profit: ${formatCurrency(summary.netProfit)}\n\n**Invoices:**\n- Pending: ${summary.pendingInvoices}\n- Overdue: ${summary.overdueInvoices}\n\n**Estimated Tax:** ${formatCurrency(summary.taxOwed)}\n\nWould you like me to generate a detailed financial report?`;
  }
  
  // Default response
  return `I'm your AI accountant assistant. I can help you with:\n\n**📊 Financial Analysis**\n- Profit & Loss reports\n- Cash flow analysis\n- Financial health checks\n\n**📋 Invoicing**\n- Creating and tracking invoices\n- Payment follow-ups\n\n**💰 Expenses**\n- Tracking and categorizing\n- Budget vs actual analysis\n\n**📝 Tax**\n- Tax planning tips\n- Deduction optimization\n\n**🏦 Banking**\n- Reconciliation\n- Transaction matching\n\nWhat would you like to know more about?`;
}

// Import db for the AI function
import { db } from './db';
