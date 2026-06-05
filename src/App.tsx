/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardScreen from './components/DashboardScreen';
import VehiclesScreen from './components/VehiclesScreen';
import CustomersScreen from './components/CustomersScreen';
import LoansScreen from './components/LoansScreen';
import QuickTransactionModal from './components/QuickTransactionModal';

import { 
  INITIAL_VEHICLES, 
  INITIAL_CUSTOMERS, 
  INITIAL_LOANS, 
  INITIAL_TRANSACTIONS,
  Vehicle,
  Customer,
  Loan,
  Transaction
} from './types';

import { 
  Building2, 
  ArrowUpRight, 
  CheckCircle, 
  Sliders, 
  BadgeDollarSign, 
  LineChart, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

export default function App() {
  // DB States
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [loans, setLoans] = useState<Loan[]>(INITIAL_LOANS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  // Layout routing States
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [branch, setBranch] = useState<string>('Main Branch - New York');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  // Central Notification banner
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Actions handlers
  const handleAddVehicle = (newVehicle: Vehicle) => {
    setVehicles([newVehicle, ...vehicles]);
    
    // Auto transaction logging
    const autoTxn: Transaction = {
      id: `#TXN-${Math.floor(82100 + Math.random() * 900)}`,
      customer: newVehicle.sellerDetails,
      vehicle: `${newVehicle.year} ${newVehicle.make} ${newVehicle.model}`,
      amount: newVehicle.purchasePrice,
      status: 'Success',
      date: newVehicle.purchaseDate
    };
    setTransactions([autoTxn, ...transactions]);

    showNotification(`Successfully finalized purchase of ${newVehicle.make} ${newVehicle.model}! Added transaction record.`);
    setCurrentTab('dashboard');
  };

  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers([newCustomer, ...customers]);
    showNotification(`New customer ${newCustomer.fullName} registered: Quality Classification approved as ${newCustomer.category}!`);
    setCurrentTab('dashboard');
  };

  const handleAddLoan = (newLoan: Loan) => {
    setLoans([newLoan, ...loans]);

    // Create a matching entry in transactions
    const autoTxn: Transaction = {
      id: `#TXN-${Math.floor(88300 + Math.random() * 900)}`,
      customer: newLoan.customerName,
      vehicle: newLoan.vehicleName,
      amount: newLoan.emiCalculated,
      status: 'Pending',
      date: newLoan.dueStartDate
    };
    setTransactions([autoTxn, ...transactions]);

    showNotification(`Loan context created for ${newLoan.customerName}! EMI calculated at $${newLoan.emiCalculated}/month.`);
    setCurrentTab('dashboard');
  };

  const handleAddTransaction = (newTxn: Transaction) => {
    setTransactions([newTxn, ...transactions]);
    showNotification(`Successfully added transaction records for ${newTxn.customer}: ${newTxn.id}`);
  };

  // Render non-form informational screens beautifully matching aesthetic
  const renderCashBankScreen = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="border-b border-[#cbd5e1]/40 pb-4">
        <h2 className="font-headline text-3xl font-black text-[#091426]">Cash &amp; Bank Ledger</h2>
        <p className="text-xs text-[#45474c] font-semibold uppercase tracking-wider mt-1">Enterprise Liquidity Accounts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#cbd5e1]/40 shadow-sm">
          <p className="text-[11px] font-bold text-[#45474c] uppercase">Operating Checking</p>
          <span className="text-2xl font-black text-[#091426] block mt-1">$4,124,500</span>
          <span className="text-[10px] text-[#28a094] font-bold block mt-2">Active Reconciled</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#cbd5e1]/40 shadow-sm">
          <p className="text-[11px] font-bold text-[#45474c] uppercase">Secondary Petty Reserve</p>
          <span className="text-2xl font-black text-[#091426] block mt-1">$2,980,100</span>
          <span className="text-[10px] text-[#28a094] font-bold block mt-2">Active Reconciled</span>
        </div>
        <div className="bg-[#091426] p-6 rounded-2xl text-white">
          <p className="text-[11px] font-bold text-white/60 uppercase">Aggregated Liquid Reserve</p>
          <span className="text-2xl font-headline font-black block mt-1">$8.2M</span>
          <span className="text-[10px] text-[#89f5e7] font-bold block mt-2">Target Liquidity Compliant</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#cbd5e1]/40 p-6 shadow-sm">
        <h3 className="font-headline text-md font-bold text-[#091426] mb-4">Branch Ledger Audits</h3>
        <div className="space-y-3 font-sans text-xs">
          <div className="flex justify-between p-3 bg-[#f7f9fb] rounded-xl border border-[#cbd5e1]/30">
            <span className="font-semibold text-[#091426]">Main Branch - New York Ledger Balance</span>
            <span className="font-bold text-[#645efb]">$3,420,120</span>
          </div>
          <div className="flex justify-between p-3 bg-[#f7f9fb] rounded-xl border border-[#cbd5e1]/30">
            <span className="font-semibold text-[#091426]">Downtown Branch Ledger Balance</span>
            <span className="font-bold text-[#645efb]">$2,904,400</span>
          </div>
          <div className="flex justify-between p-3 bg-[#f7f9fb] rounded-xl border border-[#cbd5e1]/30">
            <span className="font-semibold text-[#091426]">Boston Petty Vault Balance</span>
            <span className="font-bold text-[#645efb]">$1,875,480</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderProfitTrackingScreen = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="border-b border-[#cbd5e1]/40 pb-4">
        <h2 className="font-headline text-3xl font-black text-[#091426]">Profit Analytics &amp; Hold Cost</h2>
        <p className="text-xs text-[#45474c] font-semibold uppercase tracking-wider mt-1 font-mono">Statistical yield projections</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#cbd5e1]/40 shadow-sm space-y-4">
          <h3 className="font-headline text-md font-bold text-[#091426]">Holding Yield Metrics</h3>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] uppercase font-bold text-[#45474c]">Estimated hold cost rate</p>
              <p className="text-sm font-semibold text-[#191c1e] mt-1">$42.00 / vehicle asset day</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-[#45474c]">Target holding turnaround</p>
              <p className="text-sm font-semibold text-[#28a094] mt-1">45 Days holding maximum</p>
            </div>
          </div>
        </div>

        <div className="bg-[#091426] text-white p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Estimated holding profitability</p>
            <span className="text-3xl font-headline font-black mt-2.5 block">$4,250 +12.4% ROI</span>
            <p className="text-xs text-white/70 mt-3 font-medium">Auto-finance calculations are synchronized using real purchase logs.</p>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#89f5e7] uppercase mt-4 block">ERP AUDIT VERIFIED</span>
        </div>
      </div>
    </motion.div>
  );

  const renderMasterControlScreen = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="border-b border-[#cbd5e1]/40 pb-4">
        <h2 className="font-headline text-3xl font-black text-[#091426]">Audit Master control</h2>
        <p className="text-xs text-[#45474c] font-semibold uppercase tracking-wider mt-1">Central access configuration</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#cbd5e1]/40 p-6 shadow-sm space-y-5">
        <h3 className="font-headline text-md font-bold text-[#091426]">ERP System Parameters</h3>
        <p className="text-xs font-medium text-[#45474c]">System rules and authorization boundaries used during verification:</p>
        
        <div className="space-y-3.5 font-sans text-xs">
          <div className="flex justify-between items-center py-2.5 border-b border-[#cbd5e1]/20">
            <div>
              <p className="font-bold text-[#091426]">Automated CRIF Credit Assess</p>
              <p className="text-[11px] text-[#45474c] font-medium">Run continuous checks during customer on-boarding</p>
            </div>
            <span className="px-3 py-1 bg-[#89f5e7] text-[#005049] text-[10px] font-bold rounded-lg uppercase">Armed &amp; Active</span>
          </div>

          <div className="flex justify-between items-center py-2.5 border-b border-[#cbd5e1]/20">
            <div>
              <p className="font-bold text-[#091426]">Biometric KYC Portrait Locker</p>
              <p className="text-[11px] text-[#45474c] font-medium">Lock on-boarding profiles matches photographic ID</p>
            </div>
            <span className="px-3 py-1 bg-[#89f5e7] text-[#005049] text-[10px] font-bold rounded-lg uppercase">Armed &amp; Active</span>
          </div>

          <div className="flex justify-between items-center py-2.5">
            <div>
              <p className="font-bold text-[#091426]">Dynamic EMI hold calculation</p>
              <p className="text-[11px] text-[#45474c] font-medium">Auto calculate amortization tables based on sale price difference</p>
            </div>
            <span className="px-3 py-1 bg-[#89f5e7] text-[#005049] text-[10px] font-bold rounded-lg uppercase">Live</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex select-none">
      
      {/* Sidebar fixed menu component */}
      <Sidebar 
        currentTab={currentTab} 
        setTab={setCurrentTab} 
        onNewTransaction={() => setIsTransactionModalOpen(true)} 
      />

      {/* Main Container canvas flex-row */}
      <main className="flex-1 ml-[280px] flex flex-col min-h-screen relative overflow-x-hidden">
        
        {/* Sync header navbar element */}
        <Header 
          branch={branch} 
          setBranch={setBranch} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />

        {/* Global Floating alert banner */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className="fixed top-20 left-1/2 z-50 transform -translate-x-1/2 w-fit max-w-xl bg-[#091426]/95 backdrop-blur-md text-white border border-[#89f5e7]/30 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#89f5e7] animate-pulse" />
              <span className="font-sans text-xs font-bold">{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Inner Tab Component Routing */}
        <div className="p-8 flex-1">
          <AnimatePresence mode="wait">
            {currentTab === 'dashboard' && (
              <DashboardScreen 
                vehicles={vehicles}
                customers={customers}
                transactions={transactions}
                onAddNewTransaction={() => setIsTransactionModalOpen(true)}
                onNavigateToTab={(tab) => setCurrentTab(tab)}
              />
            )}
            {currentTab === 'vehicles' && (
              <VehiclesScreen 
                vehicles={vehicles}
                onAddVehicle={handleAddVehicle}
              />
            )}
            {currentTab === 'customers' && (
              <CustomersScreen 
                customers={customers}
                onAddCustomer={handleAddCustomer}
              />
            )}
            {currentTab === 'loans' && (
              <LoansScreen 
                vehicles={vehicles}
                customers={customers}
                loans={loans}
                onAddLoan={handleAddLoan}
              />
            )}
            {currentTab === 'cash-bank' && renderCashBankScreen()}
            {currentTab === 'profit-tracking' && renderProfitTrackingScreen()}
            {currentTab === 'master-control' && renderMasterControlScreen()}
          </AnimatePresence>
        </div>
      </main>

      {/* Global Quick Transaction recording Overlay popup */}
      <QuickTransactionModal 
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onSubmit={handleAddTransaction}
      />
    </div>
  );
}
