/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { 
  Car, 
  Wallet, 
  Users, 
  PiggyBank, 
  AlertTriangle, 
  Phone, 
  Mail, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle
} from 'lucide-react';
import { Transaction, Vehicle, Customer, User, Loan } from '../types';

interface DashboardProps {
  vehicles: Vehicle[];
  customers: Customer[];
  transactions: Transaction[];
  loans: Loan[];
  onAddNewTransaction: () => void;
  onNavigateToTab: (tab: string) => void;
  user: User | null;
}

export default function DashboardScreen({ 
  vehicles, 
  customers, 
  transactions, 
  loans,
  onAddNewTransaction, 
  onNavigateToTab,
  user
}: DashboardProps) {

  const isAdmin = user?.role === 'admin' || user?.username === 'admin';

  // Format helper for Indian Rupees
  const formatCurrency = (val: number, maxDigits = 0) => {
    return val.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: maxDigits
    });
  };

  // Dynamic calculations based on state lists
  const totalVehiclesCount = vehicles.length; 
  const totalCustomersCount = customers.length;
  
  const activeLoans = loans.filter(l => l.status === 'Active');
  const activeFinanceValue = activeLoans.reduce((sum, l) => sum + l.loanAmount, 0);

  const totalBalance = transactions
    .filter(t => t.status === 'Success')
    .reduce((sum, t) => sum + t.amount, 0);

  const overdueDues = loans.reduce((sum, l) => sum + (l.emiCalculated * (l.defaultInstances || 0)), 0);
  const overdueCount = loans.filter(l => (l.defaultInstances || 0) > 0).length;

  // KPI metadata
  const kpis = [
    {
      title: 'Total Vehicles',
      value: totalVehiclesCount.toLocaleString(),
      trend: totalVehiclesCount > 0 ? '+4.2%' : '0%',
      trendType: 'up',
      subtitle: 'In fleet inventory',
      icon: Car,
      color: 'bg-[#eceef0] text-[#091426]',
      tabLink: 'vehicles'
    },
    {
      title: 'Active Finance',
      value: formatCurrency(activeFinanceValue),
      trend: activeFinanceValue > 0 ? '+12%' : '0%',
      trendType: 'up',
      subtitle: `${activeLoans.length} Active contract${activeLoans.length === 1 ? '' : 's'}`,
      icon: Wallet,
      color: 'bg-[#eceef0] text-[#4b41e1]',
      tabLink: 'loans'
    },
    {
      title: 'Total Customers',
      value: totalCustomersCount.toLocaleString(),
      trend: totalCustomersCount > 0 ? '+1.8%' : '0%',
      trendType: 'up',
      subtitle: 'Active borrower accounts',
      icon: Users,
      color: 'bg-[#eceef0] text-[#645efb]',
      tabLink: 'customers'
    },
    {
      title: 'Total Balance',
      value: formatCurrency(totalBalance),
      trend: totalBalance > 0 ? '+8.4%' : '0%',
      trendType: 'up',
      subtitle: 'Available ledger balance',
      icon: PiggyBank,
      color: 'bg-[#eceef0] text-[#28a094]',
      tabLink: 'cash-bank'
    },
    {
      title: 'Overdue Dues',
      value: formatCurrency(overdueDues),
      trend: overdueDues > 0 ? '+2.1%' : '0%',
      trendType: overdueDues > 0 ? 'up' : 'down',
      subtitle: `${overdueCount} Late account${overdueCount === 1 ? '' : 's'}`,
      icon: AlertTriangle,
      color: 'bg-[#ffdad6] text-[#ba1a1a]',
      isAlert: true,
      tabLink: 'loans'
    }
  ];

  const filteredKPIs = kpis.filter(kpi => {
    if (isAdmin) {
      return kpi.tabLink !== 'vehicles' && kpi.tabLink !== 'loans';
    }
    return true;
  });

  // Visual collections chart representation (Jan to Jun)
  const collectionsData = [
    { month: 'Jan', target: 80, actual: 60 },
    { month: 'Feb', target: 90, actual: 70 },
    { month: 'Mar', target: 85, actual: 65 },
    { month: 'Apr', target: 95, actual: 80 },
    { month: 'May', target: 88, actual: 75 },
    { month: 'Jun', target: 98, actual: 95 }
  ];

  // Priority Dunning list built dynamically from actual defaults
  const dynamicDunningList = loans
    .filter(l => (l.defaultInstances || 0) > 0)
    .map(loan => {
      const customer = customers.find(c => c.id === loan.customerId);
      return {
        name: loan.customerName,
        amount: formatCurrency(loan.emiCalculated * loan.defaultInstances),
        days: `${loan.defaultInstances * 30} Days`,
        avatar: customer?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRpgs7Nygdbcs1xdQ8B_-lgFF7YwWBiYcT7OAxmll-BOrzzfXbMfVBg2QR_V-UA4IawO_NH43E8gyH1mqvabtZGhAdhJArm3vFYP2O8G7-6aoCUxpTyMLyhpeb3vUKDsxSFL8iWCVlkPS0uLnMPhNvaZ1lO73DDWQkng7eF8_x-a4auQsiB2QgDgfwFdAb-x-8ax4SQ3Aa5KcboYWA9BCiFGv3rpwXl5_soFqGqKNr7C22JnBymy18UAW-mrOzNE0YChglPd2mz8Y',
        type: (loan.defaultInstances > 1 ? 'call' : 'mail') as 'call' | 'mail',
        contact: customer?.phoneNumber || '+91 9999999999'
      };
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-8 pb-16"
    >
      {/* Upper Title Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-headline text-3xl font-extrabold text-[#091426] tracking-tight">Executive Dashboard</h1>
          <p className="font-sans text-sm text-[#45474c] mt-1.5 font-medium">Real-time portfolio overview and financial health monitoring.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-[#cbd5e1] rounded-xl px-4 py-2 font-sans text-xs font-semibold text-[#191c1e] flex items-center gap-2 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#28a094]" />
            <span>Last 30 Days</span>
          </div>
          <button 
            onClick={() => window.print()}
            className="px-4 py-2 bg-white hover:bg-[#eceef0] border border-[#cbd5e1] rounded-xl font-sans text-xs font-semibold text-[#191c1e] flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
          >
            <ArrowUpRight className="w-4 h-4 text-[#645efb]" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${isAdmin ? 'lg:grid-cols-2' : 'lg:grid-cols-5'} gap-5`}>
        {filteredKPIs.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -4, shadow: '0 10px 20px rgba(0,0,0,0.04)' }}
              onClick={() => onNavigateToTab(kpi.tabLink)}
              className="bg-white p-5 rounded-2xl border border-[#cbd5e1]/40 shadow-sm cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className={`p-2.5 rounded-xl ${kpi.color}`}>
                    <Icon className="w-5 h-5 font-bold" />
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    kpi.isAlert 
                      ? 'bg-[#ffdad6] text-[#ba1a1a]' 
                      : 'bg-[#89f5e7] text-[#005049]'
                  }`}>
                    {kpi.trend}
                  </span>
                </div>
                <p className="font-sans text-xs font-semibold text-[#45474c] uppercase tracking-wider">{kpi.title}</p>
                <h3 className={`font-headline text-2xl font-black mt-1 ${kpi.isAlert ? 'text-[#ba1a1a]' : 'text-[#091426]'}`}>
                  {kpi.value}
                </h3>
              </div>
              <p className="font-sans text-[11px] text-[#45474c] mt-4 font-medium border-t border-[#cbd5e1]/20 pt-2">
                {kpi.subtitle}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Chart and Analytics Row */}
      {!isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          
          {/* Monthly Finance Collections (Bar Chart) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#cbd5e1]/40 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-headline text-lg font-bold text-[#091426]">Monthly Finance Collections</h4>
              <div className="flex gap-4">
                <span className="flex items-center gap-2 text-xs font-semibold text-[#45474c]">
                  <span className="w-3 h-3 bg-[#4b41e1] rounded-full" /> Target
                </span>
                <span className="flex items-center gap-2 text-xs font-semibold text-[#45474c]">
                  <span className="w-3 h-3 bg-[#c3c0ff] rounded-full" /> Actual
                </span>
              </div>
            </div>

            <div className="h-64 flex items-end justify-between gap-3 px-2 pt-4">
              {collectionsData.map((data, idx) => (
                <div key={idx} className="flex-1 flex flex-col justify-end h-full gap-1.5 group cursor-pointer relative">
                  {/* target top bar / actual secondary overlay bar */}
                  <div className="w-full flex justify-center gap-1.5 h-full items-end">
                    {/* Target Column */}
                    <div className="w-4 bg-[#c3c0ff] rounded-t-lg group-hover:bg-[#645efb] transition-all duration-300 relative" style={{ height: `${data.actual}%` }}>
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#091426] text-white text-[10px] py-1 px-1.5 rounded shadow-lg pointer-events-none transition-opacity font-mono z-10 whitespace-nowrap">
                        Act: {data.actual}%
                      </div>
                    </div>
                    {/* Actual Column */}
                    <div className="w-4 bg-[#4b41e1] rounded-t-lg group-hover:opacity-80 transition-all duration-300 relative" style={{ height: `${data.target}%` }}>
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#091426] text-white text-[10px] py-1 px-1.5 rounded shadow-lg pointer-events-none transition-opacity font-mono z-10 whitespace-nowrap">
                        Tgt: {data.target}%
                      </div>
                    </div>
                  </div>
                  <span className="text-center font-sans text-xs font-semibold text-[#45474c] mt-2 block">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Sales Analytics (Donut) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#cbd5e1]/40 shadow-sm flex flex-col justify-between">
            <h4 className="font-headline text-lg font-bold text-[#091426] mb-4">Vehicle Sales Analytics</h4>
            
            <div className="relative flex justify-center py-4">
              {/* SVG Donut */}
              <svg className="w-44 h-44 transform -rotate-90">
                <circle cx="88" cy="88" fill="transparent" r="70" stroke="#f1f5f9" strokeWidth="12" />
                {/* SUV (45%): dasharray = 2 * PI * r = 439.8. 45% = 197.9 */}
                <circle cx="88" cy="88" fill="transparent" r="70" stroke="#4b41e1" strokeWidth="16" strokeDasharray="439.8" strokeDashoffset="0" strokeLinecap="round" />
                {/* Sedan (35%): offset = 197.9. 35% = 153.9 */}
                <circle cx="88" cy="88" fill="transparent" r="70" stroke="#645efb" strokeWidth="16" strokeDasharray="439.8" strokeDashoffset="197.9" strokeLinecap="round" />
                {/* Trucks (20%): offset = 351.8. 20% = 88 */}
                <circle cx="88" cy="88" fill="transparent" r="70" stroke="#bcc7de" strokeWidth="16" strokeDasharray="439.8" strokeDashoffset="351.8" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-headline text-2xl font-black text-[#091426]">1,284</span>
                <span className="font-sans text-[11px] text-[#45474c] font-semibold uppercase tracking-wider">Total Sold</span>
              </div>
            </div>

            <div className="space-y-2.5 mt-2 border-t border-[#cbd5e1]/20 pt-4">
              <div className="flex justify-between items-center text-xs font-semibold text-[#191c1e]">
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#4b41e1]" /> SUV</span>
                <span className="font-bold text-[#091426]">45%</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold text-[#191c1e]">
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#645efb]" /> Sedan</span>
                <span className="font-bold text-[#091426]">35%</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold text-[#191c1e]">
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#bcc7de]" /> Trucks</span>
                <span className="font-bold text-[#091426]">20%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tables and List Sector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        
        {/* Recent Transactions Table */}
        <div className={`bg-white rounded-2xl border border-[#cbd5e1]/40 shadow-sm overflow-hidden flex flex-col justify-between ${
          isAdmin ? 'lg:col-span-12' : 'lg:col-span-8'
        }`}>
          <div>
            <div className="px-6 py-4 border-b border-[#cbd5e1]/40 flex justify-between items-center bg-[#f7f9fb]/50">
              <h4 className="font-headline text-lg font-bold text-[#091426]">Recent Transactions</h4>
              <button 
                onClick={onAddNewTransaction}
                className="text-xs font-bold text-[#645efb] hover:font-extrabold flex items-center gap-1 transition-all cursor-pointer"
              >
                + New Transaction
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#f2f4f6] text-[11px] uppercase tracking-wider text-[#45474c] font-bold border-b border-[#cbd5e1]/40">
                  <tr>
                    <th className="px-6 py-3.5">Transaction ID</th>
                    <th className="px-6 py-3.5">Customer</th>
                    {!isAdmin && <th className="px-6 py-3.5">Vehicle</th>}
                    <th className="px-6 py-3.5">Amount</th>
                    <th className="px-6 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#cbd5e1]/20">
                  {transactions.slice(0, 5).map((txn) => (
                    <tr key={txn.id} className="hover:bg-[#f7f9fb] transition-colors">
                      <td className="px-6 py-4 text-xs font-semibold text-[#091426]">{txn.id}</td>
                      <td className="px-6 py-4 text-xs font-medium text-[#191c1e]">{txn.customer}</td>
                      {!isAdmin && <td className="px-6 py-4 text-xs text-[#45474c]">{txn.vehicle}</td>}
                      <td className="px-6 py-4 text-xs font-black text-[#091426]">
                        {txn.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold ${
                          txn.status === 'Success'
                            ? 'bg-[#89f5e7] text-[#005049]'
                            : txn.status === 'Failed'
                            ? 'bg-[#ffdad6] text-[#ba1a1a]'
                            : 'bg-[#eceef0] text-[#45474c]'
                        }`}>
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={isAdmin ? 4 : 5} className="px-6 py-10 text-center text-xs text-[#45474c] font-medium">
                        No transactions found. Click "+ New Transaction" to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-4 border-t border-[#cbd5e1]/20 bg-[#f7f9fb]/40 text-center">
            <span className="text-[11px] text-[#45474c] font-semibold">
              Showing top {Math.min(5, transactions.length)} of {transactions.length} total entries
            </span>
          </div>
        </div>

        {/* Dunning Priority List */}
        {!isAdmin && (
          <div className="lg:col-span-4 bg-white rounded-2xl border border-[#cbd5e1]/40 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-[#cbd5e1]/40 bg-[#f7f9fb]/50">
              <h4 className="font-headline text-md font-bold text-[#091426]">Dunning Priority</h4>
            </div>
            <div className="flex-1 p-5 space-y-4 max-h-[360px] overflow-y-auto custom-scrollbar flex flex-col justify-start">
              {dynamicDunningList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[220px] text-center text-xs text-[#45474c] font-medium gap-3 py-6">
                  <div className="p-3 bg-emerald-50 text-[#28a094] rounded-2xl">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="font-bold text-[#091426] text-sm">No Overdue Accounts</p>
                    <p className="text-[11px] text-[#45474c] mt-1">All customer payments are currently up to date.</p>
                  </div>
                </div>
              ) : (
                dynamicDunningList.map((customer, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center gap-4 p-3.5 rounded-xl border transition-all ${
                      idx === 0 
                        ? 'bg-[#ffdad6]/20 border-[#ffdad6] shadow-sm' 
                        : 'bg-[#f7f9fb] border-[#cbd5e1]/30 hover:border-[#645efb]/40'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-[#cbd5e1]/50 shadow-sm">
                      <img alt={customer.name} className="w-full h-full object-cover" src={customer.avatar} />
                    </div>
                    <div className="flex-1">
                      <p className="font-sans text-xs font-bold text-[#091426]">{customer.name}</p>
                      <p className={`font-sans text-[11px] font-bold mt-0.5 ${idx === 0 ? 'text-[#ba1a1a]' : 'text-[#45474c]'}`}>
                        {customer.amount} Overdue <span className="font-medium">({customer.days})</span>
                      </p>
                    </div>
                    <button 
                      onClick={() => alert(`Initiating priority contact (${customer.type}) to ${customer.name} via ${customer.contact}`)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        customer.type === 'call' 
                          ? 'bg-[#ba1a1a]/10 hover:bg-[#ba1a1a] text-[#ba1a1a] hover:text-white' 
                          : 'bg-[#645efb]/10 hover:bg-[#645efb] text-[#645efb] hover:text-white'
                      }`}
                    >
                      {customer.type === 'call' ? <Phone className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-[#cbd5e1]/20 bg-[#f7f9fb]/40 text-center">
              <button 
                onClick={() => onNavigateToTab('customers')} 
                className="text-xs font-bold text-[#645efb] hover:underline cursor-pointer"
              >
                Manage Collections Queue
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cash Flow Area Graph at bottom */}
      {!isAdmin && (
        <div className="bg-white p-6 rounded-2xl border border-[#cbd5e1]/40 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#645efb]" />
              <h4 className="font-headline text-lg font-bold text-[#091426]">Cash Flow vs. Loan Delinquency</h4>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#45474c]">
                <span className="w-7 h-1.5 bg-[#4b41e1] rounded-full" />
                <span>Inflow</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#45474c]">
                <span className="w-7 h-1.5 border-t-2 border-dashed border-[#ba1a1a] inline-block" />
                <span>Delinquency Rate</span>
              </div>
            </div>
          </div>

          <div className="h-48 relative w-full pt-4">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 200">
              <defs>
                <linearGradient id="flow-area-grad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="1000" y2="50" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="100" x2="1000" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="150" x2="1000" y2="150" stroke="#f1f5f9" strokeWidth="1" />

              {/* Inflow Area Curve */}
              <path d="M0 180 Q 200 130, 400 155 T 800 100 T 1000 120 V 200 H 0 Z" fill="url(#flow-area-grad)" />
              {/* Inflow Stroke Line */}
              <path d="M0 180 Q 200 130, 400 155 T 800 100 T 1000 120" stroke="#4b41e1" strokeWidth="3.5" fill="none" strokeLinecap="round" />

              {/* Delinquency Line (Dashed) */}
              <path d="M0 90 Q 250 110, 500 85 T 800 70 T 1000 110" stroke="#ba1a1a" strokeWidth="2" strokeDasharray="8,5" fill="none" strokeLinecap="round" />
            </svg>

            {/* Time Labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 pt-2 border-t border-[#cbd5e1]/10 mt-1">
              <span className="font-sans text-[11px] font-bold text-[#45474c]">Week 1</span>
              <span className="font-sans text-[11px] font-bold text-[#45474c]">Week 2</span>
              <span className="font-sans text-[11px] font-bold text-[#45474c]">Week 3</span>
              <span className="font-sans text-[11px] font-bold text-[#45474c]">Week 4</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
