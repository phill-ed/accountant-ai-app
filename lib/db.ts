import { v4 as uuidv4 } from 'uuid';
import type { Transaction, Invoice, Client, Budget, Document, BankTransaction, AppSettings } from './types';

// In-memory storage for simplicity (simulating SQLite)
class InMemoryDB {
  private transactions: Transaction[] = [];
  private invoices: Invoice[] = [];
  private clients: Client[] = [];
  private budgets: Budget[] = [];
  private documents: Document[] = [];
  private bankTransactions: BankTransaction[] = [];
  private settings: AppSettings = {
    businessName: 'My Business',
    businessEmail: 'contact@business.com',
    businessAddress: '123 Business St, City, Country',
    businessPhone: '+1 234 567 8900',
    currency: 'USD',
    taxRate: 10,
  };

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed sample transactions
    const now = new Date();
    const sampleTransactions: Transaction[] = [
      {
        id: uuidv4(),
        date: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
        type: 'income',
        amount: 5000,
        category: 'Sales',
        description: 'Product sales - January',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        date: new Date(now.getFullYear(), now.getMonth(), 5).toISOString(),
        type: 'income',
        amount: 2500,
        category: 'Services',
        description: 'Consulting services',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        date: new Date(now.getFullYear(), now.getMonth(), 10).toISOString(),
        type: 'expense',
        amount: 1500,
        category: 'Rent',
        description: 'Office rent - January',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        date: new Date(now.getFullYear(), now.getMonth(), 12).toISOString(),
        type: 'expense',
        amount: 350,
        category: 'Utilities',
        description: 'Electricity and internet',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        date: new Date(now.getFullYear(), now.getMonth(), 15).toISOString(),
        type: 'expense',
        amount: 200,
        category: 'Office Supplies',
        description: 'Printer paper and supplies',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        date: new Date(now.getFullYear(), now.getMonth(), 18).toISOString(),
        type: 'income',
        amount: 3000,
        category: 'Sales',
        description: 'Product sales - February batch',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        date: new Date(now.getFullYear(), now.getMonth(), 20).toISOString(),
        type: 'expense',
        amount: 500,
        category: 'Marketing',
        description: 'Social media ads',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        date: new Date(now.getFullYear(), now.getMonth(), 22).toISOString(),
        type: 'expense',
        amount: 150,
        category: 'Food & Dining',
        description: 'Client meeting lunch',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        date: new Date(now.getFullYear(), now.getMonth(), 25).toISOString(),
        type: 'expense',
        amount: 1200,
        category: 'Payroll',
        description: 'Employee salary',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        date: new Date(now.getFullYear(), now.getMonth(), 28).toISOString(),
        type: 'income',
        amount: 1500,
        category: 'Services',
        description: 'Web development project',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    this.transactions = sampleTransactions;

    // Seed sample invoices
    const sampleInvoices: Invoice[] = [
      {
        id: uuidv4(),
        invoiceNumber: 'INV-001',
        clientName: 'ABC Corporation',
        clientEmail: 'billing@abccorp.com',
        items: [{ description: 'Consulting Services', quantity: 10, unitPrice: 150, total: 1500 }],
        subtotal: 1500,
        taxRate: 10,
        taxAmount: 150,
        total: 1650,
        status: 'paid',
        issueDate: new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString(),
        dueDate: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
        paidDate: new Date(now.getFullYear(), now.getMonth() - 1, 28).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        invoiceNumber: 'INV-002',
        clientName: 'XYZ Industries',
        clientEmail: 'accounts@xyzind.com',
        items: [{ description: 'Product Supply', quantity: 50, unitPrice: 25, total: 1250 }],
        subtotal: 1250,
        taxRate: 10,
        taxAmount: 125,
        total: 1375,
        status: 'sent',
        issueDate: new Date(now.getFullYear(), now.getMonth(), 5).toISOString(),
        dueDate: new Date(now.getFullYear(), now.getMonth(), 15).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        invoiceNumber: 'INV-003',
        clientName: 'Tech Startup Inc',
        clientEmail: 'finance@techstartup.io',
        items: [
          { description: 'Web Development', quantity: 1, unitPrice: 3000, total: 3000 },
          { description: 'Hosting Setup', quantity: 1, unitPrice: 500, total: 500 },
        ],
        subtotal: 3500,
        taxRate: 10,
        taxAmount: 350,
        total: 3850,
        status: 'overdue',
        issueDate: new Date(now.getFullYear(), now.getMonth() - 1, 20).toISOString(),
        dueDate: new Date(now.getFullYear(), now.getMonth() - 1, 30).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        invoiceNumber: 'INV-004',
        clientName: 'Global Services Ltd',
        clientEmail: 'ap@globalservices.com',
        items: [{ description: 'Monthly Retainer', quantity: 1, unitPrice: 2000, total: 2000 }],
        subtotal: 2000,
        taxRate: 10,
        taxAmount: 200,
        total: 2200,
        status: 'draft',
        issueDate: new Date().toISOString(),
        dueDate: new Date(now.getFullYear(), now.getMonth() + 1, 10).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    this.invoices = sampleInvoices;

    // Seed sample clients
    const sampleClients: Client[] = [
      { id: uuidv4(), name: 'ABC Corporation', email: 'billing@abccorp.com', phone: '+1 555 123 4567', company: 'ABC Corporation', createdAt: new Date().toISOString() },
      { id: uuidv4(), name: 'XYZ Industries', email: 'accounts@xyzind.com', phone: '+1 555 234 5678', company: 'XYZ Industries', createdAt: new Date().toISOString() },
      { id: uuidv4(), name: 'Tech Startup Inc', email: 'finance@techstartup.io', company: 'Tech Startup Inc', createdAt: new Date().toISOString() },
      { id: uuidv4(), name: 'Global Services Ltd', email: 'ap@globalservices.com', company: 'Global Services Ltd', createdAt: new Date().toISOString() },
    ];
    this.clients = sampleClients;

    // Seed sample budgets
    const sampleBudgets: Budget[] = [
      { id: uuidv4(), category: 'Food & Dining', amount: 500, period: 'monthly', startDate: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(), endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString(), createdAt: new Date().toISOString() },
      { id: uuidv4(), category: 'Marketing', amount: 1000, period: 'monthly', startDate: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(), endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString(), createdAt: new Date().toISOString() },
      { id: uuidv4(), category: 'Office Supplies', amount: 300, period: 'monthly', startDate: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(), endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString(), createdAt: new Date().toISOString() },
      { id: uuidv4(), category: 'Utilities', amount: 500, period: 'monthly', startDate: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(), endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString(), createdAt: new Date().toISOString() },
    ];
    this.budgets = sampleBudgets;

    // Seed sample bank transactions
    const sampleBankTransactions: BankTransaction[] = [
      { id: uuidv4(), date: new Date(now.getFullYear(), now.getMonth(), 2).toISOString(), description: 'Wire Transfer - ABC Corp', amount: 1650, type: 'income', matched: true },
      { id: uuidv4(), date: new Date(now.getFullYear(), now.getMonth(), 6).toISOString(), description: 'Office Depot', amount: -200, type: 'expense', matched: true },
      { id: uuidv4(), date: new Date(now.getFullYear(), now.getMonth(), 8).toISOString(), description: 'Electric Company', amount: -350, type: 'expense', matched: true },
      { id: uuidv4(), date: new Date(now.getFullYear(), now.getMonth(), 14).toISOString(), description: 'Unknown Payment', amount: -500, type: 'expense', matched: false },
      { id: uuidv4(), date: new Date(now.getFullYear(), now.getMonth(), 16).toISOString(), description: 'Client Payment XYZ', amount: 1375, type: 'income', matched: true },
      { id: uuidv4(), date: new Date(now.getFullYear(), now.getMonth(), 21).toISOString(), description: 'Software Subscription', amount: -99, type: 'expense', matched: false },
    ];
    this.bankTransactions = sampleBankTransactions;
  }

  // Transaction methods
  getTransactions() {
    return [...this.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getTransactionById(id: string) {
    return this.transactions.find(t => t.id === id);
  }

  addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    const newTransaction: Transaction = {
      ...transaction,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    this.transactions.push(newTransaction);
    return newTransaction;
  }

  updateTransaction(id: string, updates: Partial<Transaction>) {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      this.transactions[index] = { ...this.transactions[index], ...updates, updatedAt: new Date().toISOString() };
      return this.transactions[index];
    }
    return null;
  }

  deleteTransaction(id: string) {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      this.transactions.splice(index, 1);
      return true;
    }
    return false;
  }

  // Invoice methods
  getInvoices() {
    return [...this.invoices].sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
  }

  getInvoiceById(id: string) {
    return this.invoices.find(i => i.id === id);
  }

  addInvoice(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    const newInvoice: Invoice = {
      ...invoice,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    this.invoices.push(newInvoice);
    return newInvoice;
  }

  updateInvoice(id: string, updates: Partial<Invoice>) {
    const index = this.invoices.findIndex(i => i.id === id);
    if (index !== -1) {
      this.invoices[index] = { ...this.invoices[index], ...updates, updatedAt: new Date().toISOString() };
      return this.invoices[index];
    }
    return null;
  }

  deleteInvoice(id: string) {
    const index = this.invoices.findIndex(i => i.id === id);
    if (index !== -1) {
      this.invoices.splice(index, 1);
      return true;
    }
    return false;
  }

  // Client methods
  getClients() {
    return [...this.clients];
  }

  addClient(client: Omit<Client, 'id' | 'createdAt'>) {
    const now = new Date().toISOString();
    const newClient: Client = {
      ...client,
      id: uuidv4(),
      createdAt: now,
    };
    this.clients.push(newClient);
    return newClient;
  }

  // Budget methods
  getBudgets() {
    return [...this.budgets];
  }

  addBudget(budget: Omit<Budget, 'id' | 'createdAt'>) {
    const now = new Date().toISOString();
    const newBudget: Budget = {
      ...budget,
      id: uuidv4(),
      createdAt: now,
    };
    this.budgets.push(newBudget);
    return newBudget;
  }

  deleteBudget(id: string) {
    const index = this.budgets.findIndex(b => b.id === id);
    if (index !== -1) {
      this.budgets.splice(index, 1);
      return true;
    }
    return false;
  }

  // Bank Transaction methods
  getBankTransactions() {
    return [...this.bankTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  addBankTransaction(transaction: Omit<BankTransaction, 'id'>) {
    const newTransaction: BankTransaction = {
      ...transaction,
      id: uuidv4(),
    };
    this.bankTransactions.push(newTransaction);
    return newTransaction;
  }

  matchBankTransaction(bankTransactionId: string, transactionId: string) {
    const bankTx = this.bankTransactions.find(bt => bt.id === bankTransactionId);
    if (bankTx) {
      bankTx.matched = true;
      bankTx.matchedTransactionId = transactionId;
      return bankTx;
    }
    return null;
  }

  // Settings methods
  getSettings() {
    return { ...this.settings };
  }

  updateSettings(updates: Partial<AppSettings>) {
    this.settings = { ...this.settings, ...updates };
    return this.settings;
  }

  // Dashboard summary
  getDashboardSummary() {
    const transactions = this.getTransactions();
    const invoices = this.getInvoices();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const totalIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const pendingInvoices = invoices.filter(i => i.status === 'sent').length;
    const overdueInvoices = invoices.filter(i => i.status === 'overdue').length;

    // Calculate estimated tax (simplified)
    const taxOwed = (totalIncome - totalExpenses) * 0.1;

    return {
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses,
      pendingInvoices,
      overdueInvoices,
      taxOwed: Math.max(0, taxOwed),
    };
  }

  // Report generation
  getProfitLossReport(startDate: string, endDate: string) {
    const transactions = this.getTransactions().filter(t => {
      const date = new Date(t.date);
      return date >= new Date(startDate) && date <= new Date(endDate);
    });

    const incomeTransactions = transactions.filter(t => t.type === 'income');
    const expenseTransactions = transactions.filter(t => t.type === 'expense');

    const incomeByCategory: Record<string, number> = {};
    const expensesByCategory: Record<string, number> = {};

    incomeTransactions.forEach(t => {
      incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.amount;
    });

    expenseTransactions.forEach(t => {
      expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
    });

    return {
      revenue: incomeTransactions.reduce((sum, t) => sum + t.amount, 0),
      expenses: expenseTransactions.reduce((sum, t) => sum + t.amount, 0),
      netProfit: incomeTransactions.reduce((sum, t) => sum + t.amount, 0) - expenseTransactions.reduce((sum, t) => sum + t.amount, 0),
      period: `${startDate} to ${endDate}`,
      incomeByCategory,
      expensesByCategory,
    };
  }

  getBalanceSheetReport() {
    const transactions = this.getTransactions();
    const allTimeIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const allTimeExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    return {
      assets: allTimeIncome, // Simplified: all income as assets
      liabilities: allTimeExpenses * 0.3, // Simplified: 30% of expenses as liabilities
      equity: allTimeIncome - allTimeExpenses,
      date: new Date().toISOString(),
    };
  }

  getCashFlowReport(startDate: string, endDate: string) {
    const transactions = this.getTransactions().filter(t => {
      const date = new Date(t.date);
      return date >= new Date(startDate) && date <= new Date(endDate);
    });

    const operatingActivities = transactions.reduce((sum, t) => {
      return sum + (t.type === 'income' ? t.amount : -t.amount);
    }, 0);

    return {
      operatingActivities,
      investingActivities: 0,
      financingActivities: 0,
      netCashFlow: operatingActivities,
      period: `${startDate} to ${endDate}`,
    };
  }

  // Get transactions for chart
  getMonthlyData() {
    const transactions = this.getTransactions();
    const monthlyData: Record<string, { income: number; expenses: number }> = {};

    transactions.forEach(t => {
      const date = new Date(t.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyData[key]) {
        monthlyData[key] = { income: 0, expenses: 0 };
      }
      if (t.type === 'income') {
        monthlyData[key].income += t.amount;
      } else {
        monthlyData[key].expenses += t.amount;
      }
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, data]) => ({
        month,
        ...data,
      }));
  }

  // Get expense breakdown
  getExpenseBreakdown() {
    const transactions = this.getTransactions().filter(t => t.type === 'expense');
    const breakdown: Record<string, number> = {};

    transactions.forEach(t => {
      breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
    });

    return Object.entries(breakdown).map(([name, value]) => ({ name, value }));
  }
}

// Singleton instance
export const db = new InMemoryDB();
