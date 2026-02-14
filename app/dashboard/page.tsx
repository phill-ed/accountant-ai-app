'use client';

import { useEffect, useState } from 'react';
import TopBar from '@/components/TopBar';
import { db } from '@/lib/db';
import { formatCurrency } from '@/lib/utils';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Receipt, 
  FileText, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export default function DashboardPage() {
  const [summary, setSummary] = useState(db.getDashboardSummary());
  const [monthlyData, setMonthlyData] = useState(db.getMonthlyData());
  const [expenseBreakdown, setExpenseBreakdown] = useState(db.getExpenseBreakdown());
  const [recentTransactions, setRecentTransactions] = useState(db.getTransactions().slice(0, 5));
  const [invoices, setInvoices] = useState(db.getInvoices().slice(0, 3));

  const stats = [
    {
      label: 'Total Income',
      value: formatCurrency(summary.totalIncome),
      change: '+12.5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(summary.totalExpenses),
      change: '+8.2%',
      trend: 'down',
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      label: 'Net Profit',
      value: formatCurrency(summary.netProfit),
      change: summary.netProfit >= 0 ? '+15.3%' : '-5.2%',
      trend: summary.netProfit >= 0 ? 'up' : 'down',
      icon: DollarSign,
      color: summary.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600',
      bgColor: summary.netProfit >= 0 ? 'bg-emerald-50' : 'bg-red-50',
    },
    {
      label: 'Pending Invoices',
      value: summary.pendingInvoices.toString(),
      change: summary.overdueInvoices > 0 ? `${summary.overdueInvoices} overdue` : 'All on time',
      trend: summary.overdueInvoices > 0 ? 'down' : 'up',
      icon: FileText,
      color: summary.overdueInvoices > 0 ? 'text-red-600' : 'text-blue-600',
      bgColor: summary.overdueInvoices > 0 ? 'bg-red-50' : 'bg-blue-50',
    },
  ];

  return (
    <div className="min-h-screen">
      <TopBar title="Dashboard" />
      
      <div className="p-6 space-y-6 animate-fadeIn">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="card p-5">
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {stat.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-slate-500 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cash Flow Chart */}
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-800">Cash Flow</h2>
              <select className="text-sm bg-slate-100 rounded-lg px-3 py-1.5 border-0">
                <option>Last 6 Months</option>
                <option>Last 12 Months</option>
                <option>This Year</option>
              </div>
            <div className="</select>
            iveContainer width="100%" height="100%">
               ">
              <Responsh-72 <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                  <YAxis stroke="#64748B" fontSize={12} tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => [formatCurrency(value), '']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    name="Income"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#EF4444" 
                    strokeWidth={3}
                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                    name="Expenses"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-slate-600">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-slate-600">Expenses</span>
              </div>
            </div>
          </div>

          {/* Expense Breakdown */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-6">Expense Breakdown</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {expenseBreakdown.slice(0, 4).map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-medium text-slate-800">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Recent Transactions</h2>
              <a href="/transactions" className="text-sm text-blue-600 hover:underline">View All</a>
            </div>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${transaction.type === 'income' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp size={18} className="text-emerald-600" />
                      ) : (
                        <TrendingDown size={18} className="text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{transaction.description}</p>
                      <p className="text-sm text-slate-500">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Invoices */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Recent Invoices</h2>
              <a href="/invoices" className="text-sm text-blue-600 hover:underline">View All</a>
            </div>
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Receipt size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{invoice.clientName}</p>
                      <p className="text-sm text-slate-500">{invoice.invoiceNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">{formatCurrency(invoice.total)}</p>
                    <span 
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ 
                        backgroundColor: invoice.status === 'paid' ? '#D1FAE5' : invoice.status === 'overdue' ? '#FEE2E2' : invoice.status === 'sent' ? '#DBEAFE' : '#F3F4F6',
                        color: invoice.status === 'paid' ? '#059669' : invoice.status === 'overdue' ? '#DC2626' : invoice.status === 'sent' ? '#2563EB' : '#6B7280'
                      }}
                    >
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Tax Alert */}
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">Estimated Tax Due</p>
                  <p className="text-sm text-amber-700">
                    Based on your current income, you may owe {formatCurrency(summary.taxOwed)} in taxes this quarter.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
