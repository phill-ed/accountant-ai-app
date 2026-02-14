'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Receipt, 
  FileText, 
  Upload, 
  BarChart3, 
  Building2, 
  Calculator, 
  Bell, 
  TrendingUp, 
  FolderLock, 
  Bot,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transactions', icon: Receipt },
  { href: '/invoices', label: 'Invoices', icon: FileText },
  { href: '/receipts', label: 'Receipts', icon: Upload },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
  { href: '/reconciliation', label: 'Reconciliation', icon: Building2 },
  { href: '/tax', label: 'Tax', icon: Calculator },
  { href: '/budgets', label: 'Budgets', icon: TrendingUp },
  { href: '/documents', label: 'Documents', icon: FolderLock },
  { href: '/ai-assistant', label: 'AI Assistant', icon: Bot },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-white border-r border-slate-200 z-40
        transition-transform duration-300 ease-in-out
        w-64 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-800">Accountant AI</h1>
              <p className="text-xs text-slate-500">Smart Finance</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
                {item.href === '/invoices' && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    1
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 text-white">
            <p className="text-sm font-medium mb-2">Need help?</p>
            <p className="text-xs text-slate-400 mb-3">Ask our AI assistant</p>
            <Link
              href="/ai-assistant"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm"
            >
              <Bot size={16} />
              Get Help
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
