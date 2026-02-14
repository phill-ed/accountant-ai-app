'use client';

import { useState, useEffect } from 'react';
import TopBar from '@/components/TopBar';
import { db } from '@/lib/db';
import { formatCurrency, formatDate, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/utils';
import type { Transaction, TransactionType, TransactionCategory } from '@/lib/types';
import { Plus, Search, Filter, Edit2, Trash2, X, TrendingUp, TrendingDown } from 'lucide-react';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'expense' as TransactionType,
    amount: '',
    category: 'Other Expense' as TransactionCategory,
    description: '',
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    setTransactions(db.getTransactions());
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTransaction) {
      db.updateTransaction(editingTransaction.id, {
        ...formData,
        amount: parseFloat(formData.amount),
      });
    } else {
      db.addTransaction({
        ...formData,
        amount: parseFloat(formData.amount),
      });
    }
    
    loadTransactions();
    closeModal();
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      date: transaction.date.split('T')[0],
      type: transaction.type,
      amount: transaction.amount.toString(),
      category: transaction.category,
      description: transaction.description,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      db.deleteTransaction(id);
      loadTransactions();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTransaction(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: 'expense',
      amount: '',
      category: 'Other Expense',
      description: '',
    });
  };

  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen">
      <TopBar title="Transactions" />
      
      <div className="p-6 space-y-6 animate-fadeIn">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-5">
            <p className="text-slate-500 text-sm">Total Income</p>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="card p-5">
            <p className="text-slate-500 text-sm">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="card p-5">
            <p className="text-slate-500 text-sm">Net</p>
            <p className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatCurrency(totalIncome - totalExpenses)}
            </p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="card p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-100 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>

              {/* Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
                className="px-4 py-2 bg-slate-100 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 bg-slate-100 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {filterType === 'income' || filterType === 'all' 
                  ? INCOME_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)
                  : null
                }
                {filterType === 'expense' || filterType === 'all'
                  ? EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)
                  : null
                }
              </select>
            </div>

            {/* Add Button */}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Add Transaction
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Description</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Category</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Type</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">Amount</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${transaction.type === 'income' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                          {transaction.type === 'income' ? (
                            <TrendingUp size={16} className="text-emerald-600" />
                          ) : (
                            <TrendingDown size={16} className="text-red-600" />
                          )}
                        </div>
                        <span className="font-medium text-slate-800">{transaction.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{transaction.category}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        transaction.type === 'income' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-semibold ${
                      transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredTransactions.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-slate-500">No transactions found</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-800">
                {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="income"
                      checked={formData.type === 'income'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as TransactionType, category: 'Sales' })}
                      className="w-4 h-4 text-emerald-600"
                    />
                    <span className="text-sm text-slate-700">Income</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="expense"
                      checked={formData.type === 'expense'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as TransactionType, category: 'Other Expense' })}
                      className="w-4 h-4 text-red-600"
                    />
                    <span className="text-sm text-slate-700">Expense</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="input-field"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as TransactionCategory })}
                  className="select-field"
                >
                  {formData.type === 'income' ? (
                    INCOME_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))
                  ) : (
                    EXPENSE_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  placeholder="Enter description"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {editingTransaction ? 'Update' : 'Add'} Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
