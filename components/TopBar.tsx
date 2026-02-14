'use client';

import { Bell, Settings, User, Search } from 'lucide-react';
import { useState } from 'react';

interface TopBarProps {
  title: string;
}

export default function TopBar({ title }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      {/* Left side - Title & Search */}
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold text-slate-800 lg:hidden">{title}</h1>
        <h1 className="text-xl font-bold text-slate-800 hidden lg:block">{title}</h1>
        
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search transactions, invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-80 pl-10 pr-4 py-2 bg-slate-100 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Settings */}
        <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
          <Settings size={20} />
        </button>

        {/* User */}
        <button className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-slate-800">John Doe</p>
            <p className="text-xs text-slate-500">Business Owner</p>
          </div>
        </button>
      </div>
    </header>
  );
}
