/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  LayoutDashboard, 
  Users, 
  Car, 
  CreditCard, 
  AlertCircle,
  Landmark, 
  TrendingUp, 
  BarChart3,
  Building,
  Settings, 
  Plus 
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  onNewTransaction: () => void;
  user: User | null;
}

export default function Sidebar({ currentTab, setTab, onNewTransaction, user }: SidebarProps) {
  const isAdmin = user?.role === 'admin' || user?.username === 'admin';

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', name: 'Customers', icon: Users },
    ...(!isAdmin ? [
      { id: 'vehicles', name: 'Vehicles', icon: Car },
      { id: 'loans', name: 'Loans', icon: CreditCard },
      { id: 'overdue-dunning', name: 'Overdue Register', icon: AlertCircle },
      { id: 'profit-tracking', name: 'Profit Tracking', icon: TrendingUp },
      { id: 'reports', name: 'Reports Engine', icon: BarChart3 },
      { id: 'office', name: 'Office Hub', icon: Building },
    ] : []),
    { id: 'cash-bank', name: 'Cash & Bank', icon: Landmark },
    ...(isAdmin ? [{ id: 'master-control', name: 'Master Control', icon: Settings }] : []),
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-[#cbd5e1]/50 flex flex-col p-6 z-40 select-none">
      {/* Brand Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#645efb] rounded-xl flex items-center justify-center text-white shadow-md shadow-[#645efb]/20">
          <Car className="w-5 h-5" />
        </div>
        <div>
          <span className="font-headline text-lg font-bold text-[#091426] tracking-tight leading-none block">AutoFinance ERP</span>
          <p className="font-sans text-xs text-[#45474c] mt-0.5 uppercase tracking-wider font-semibold">Enterprise Admin</p>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar pr-1 -mr-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#645efb] text-white shadow-md shadow-[#645efb]/15 font-semibold'
                  : 'text-[#45474c] hover:bg-[#eceef0] hover:text-[#091426]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#45474c]'}`} />
              <span className="font-sans text-sm">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Sidebar Action Footer */}
      <div className="mt-auto pt-6 border-t border-[#cbd5e1]/40">
        <button
          onClick={onNewTransaction}
          className="w-full bg-[#091426] text-white py-3.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#1e293b] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-[#091426]/10"
        >
          <Plus className="w-4 h-4" />
          <span>New Transaction</span>
        </button>
      </div>
    </aside>
  );
}
