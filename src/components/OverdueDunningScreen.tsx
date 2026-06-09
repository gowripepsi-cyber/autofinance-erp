import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertCircle, 
  Phone, 
  FileText, 
  CheckCircle, 
  Printer, 
  X, 
  Search, 
  SlidersHorizontal, 
  Calendar, 
  Clock, 
  User, 
  CreditCard, 
  Sparkles, 
  Mail, 
  MessageSquare, 
  MapPin, 
  AlertTriangle,
  Building,
  HelpCircle,
  FileCheck2
} from 'lucide-react';
import { Loan, Customer, DunningLog, Transaction } from '../types';

interface OverdueDunningScreenProps {
  loans: Loan[];
  customers: Customer[];
  dunningLogs: DunningLog[];
  onAddDunningLog: (log: DunningLog) => void;
  onUpdateLoan: (loan: Loan) => void;
  onAddTransaction: (txn: Transaction) => void;
  user: any;
}

export default function OverdueDunningScreen({
  loans,
  customers,
  dunningLogs,
  onAddDunningLog,
  onUpdateLoan,
  onAddTransaction,
  user
}: OverdueDunningScreenProps) {
  // Navigation
  const [subTab, setSubTab] = useState<'overdue' | 'activities'>('overdue');
  
  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('All');

  // Modal states
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedLoanForContact, setSelectedLoanForContact] = useState<Loan | null>(null);

  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [selectedLoanForNotice, setSelectedLoanForNotice] = useState<Loan | null>(null);

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedLoanForPayment, setSelectedLoanForPayment] = useState<Loan | null>(null);

  // Form states
  const [contactType, setContactType] = useState<DunningLog['actionType']>('Call');
  const [contactSummary, setContactSummary] = useState('');
  const [contactNotes, setContactNotes] = useState('');
  
  const [paymentAmount, setPaymentAmount] = useState<number | ''>('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentAccount, setPaymentAccount] = useState('Main Operating Account (...4492)');

  // Filtered lists
  const overdueLoans = useMemo(() => {
    return loans.filter(l => l.status === 'Active' && l.defaultInstances > 0);
  }, [loans]);

  const filteredOverdueLoans = useMemo(() => {
    return overdueLoans.filter(l => {
      const customer = customers.find(c => c.id === l.customerId);
      const matchesSearch = 
        l.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        l.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.vehicleName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const risk = l.riskCategory || customer?.category || 'Medium Risk';
      const matchesRisk = riskFilter === 'All' || risk.toLowerCase().includes(riskFilter.toLowerCase());

      return matchesSearch && matchesRisk;
    });
  }, [overdueLoans, customers, searchQuery, riskFilter]);

  // KPIs
  const totalOverdueAmount = useMemo(() => {
    return overdueLoans.reduce((sum, l) => sum + (l.emiCalculated * l.defaultInstances), 0);
  }, [overdueLoans]);

  const defaultAccountsCount = overdueLoans.length;

  const criticalAccountsCount = useMemo(() => {
    return overdueLoans.filter(l => l.defaultInstances >= 3).length;
  }, [overdueLoans]);

  const simulatedRecoveryRate = 81.2; // MTD recovery target simulation

  // Helper currency formatter
  const formatCurrency = (val: number) => {
    return val.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    });
  };

  // Get active dunning level name
  const getDunningLevel = (defaultInstances: number) => {
    if (defaultInstances === 1) return { level: 'Level 1: Friendly Reminder', color: 'bg-blue-500/10 text-blue-700 border-blue-200' };
    if (defaultInstances === 2) return { level: 'Level 2: Urgent Demand', color: 'bg-amber-500/10 text-amber-700 border-amber-200' };
    if (defaultInstances >= 3) return { level: 'Level 3: Legal Notice / Repo', color: 'bg-red-500/10 text-red-700 border-red-200' };
    return { level: 'Good Standing', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-200' };
  };

  const handleOpenContactModal = (loan: Loan) => {
    setSelectedLoanForContact(loan);
    setContactType('Call');
    setContactSummary('');
    setContactNotes('');
    setIsContactModalOpen(true);
  };

  const handleSaveContactLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoanForContact) return;

    if (!contactSummary.trim()) {
      alert('Please enter a brief summary of the communication.');
      return;
    }

    const newLog: DunningLog = {
      id: `DUN-${Math.floor(10000 + Math.random() * 90000)}`,
      loanId: selectedLoanForContact.id,
      customerName: selectedLoanForContact.customerName,
      actionType: contactType,
      date: new Date().toISOString().split('T')[0],
      summary: contactSummary.trim(),
      notes: contactNotes.trim(),
      agentName: user?.fullName || 'Collection Agent'
    };

    onAddDunningLog(newLog);
    setIsContactModalOpen(false);
    setSelectedLoanForContact(null);
    alert(`Dunning action successfully logged for ${newLog.customerName}.`);
  };

  const handleOpenNoticeModal = (loan: Loan) => {
    setSelectedLoanForNotice(loan);
    setIsNoticeModalOpen(true);
  };

  const handleOpenPayModal = (loan: Loan) => {
    setSelectedLoanForPayment(loan);
    // Suggest paying off all overdue EMIs
    setPaymentAmount(Number((loan.emiCalculated * loan.defaultInstances).toFixed(2)));
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setIsPayModalOpen(true);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoanForPayment) return;

    const amt = Number(paymentAmount);
    if (!amt || amt <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    // Determine how many EMIs this payment covers (round to nearest integer)
    const emisPaid = Math.min(
      selectedLoanForPayment.defaultInstances, 
      Math.max(1, Math.round(amt / selectedLoanForPayment.emiCalculated))
    );

    // 1. Log repayment transaction
    const newTxn: Transaction = {
      id: `#TXN-${Math.floor(86000 + Math.random() * 9000)}`,
      customer: selectedLoanForPayment.customerName,
      vehicle: `[COLLECTION] ${selectedLoanForPayment.vehicleName} (ID: ${selectedLoanForPayment.id})`,
      amount: amt,
      status: 'Success',
      date: paymentDate
    };

    onAddTransaction(newTxn);

    // 2. Decrement default instances in loan record
    const updatedLoan: Loan = {
      ...selectedLoanForPayment,
      defaultInstances: Math.max(0, selectedLoanForPayment.defaultInstances - emisPaid)
    };

    onUpdateLoan(updatedLoan);

    // 3. Log a dunning activity that payment was collected
    const collectionLog: DunningLog = {
      id: `DUN-${Math.floor(10000 + Math.random() * 90000)}`,
      loanId: selectedLoanForPayment.id,
      customerName: selectedLoanForPayment.customerName,
      actionType: 'SMS',
      date: paymentDate,
      summary: `Payment Collected: ${formatCurrency(amt)}`,
      notes: `Collected ${emisPaid} overdue EMI installments via ${paymentAccount}. Remaining default instances: ${updatedLoan.defaultInstances}.`,
      agentName: user?.fullName || 'Collection Agent'
    };

    onAddDunningLog(collectionLog);

    setIsPayModalOpen(false);
    setSelectedLoanForPayment(null);
    alert(`Successfully processed recovery payment of ${formatCurrency(amt)} for ${collectionLog.customerName}!`);
  };

  const handlePrintNotice = () => {
    // Simulated print action
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-8 select-none"
    >
      {/* Title block with sub-tab switcher */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="text-left flex-1 min-w-0">
          <h2 className="font-headline text-3xl font-extrabold text-[#091426] tracking-tight">
            {subTab === 'overdue' ? 'Overdue Collection Register' : 'Dunning & Collections Ledger'}
          </h2>
          <p className="font-sans text-sm text-[#45474c] mt-1.5 font-medium max-w-xl">
            {subTab === 'overdue' 
              ? 'Monitor default borrower accounts, compute late aging parameters, and dispatch notices.'
              : 'Chronological timeline audit of collection events, letters issued, and field agent summaries.'}
          </p>
        </div>

        <div className="flex bg-[#eceef0] p-1.5 rounded-2xl gap-1.5 shadow-inner flex-shrink-0">
          <button
            onClick={() => setSubTab('overdue')}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer border-none flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
              subTab === 'overdue'
                ? 'bg-white text-[#645efb] shadow-md'
                : 'text-[#45474c] hover:text-[#091426] bg-transparent'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Overdue Register</span>
          </button>
          <button
            onClick={() => setSubTab('activities')}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer border-none flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
              subTab === 'activities'
                ? 'bg-white text-[#645efb] shadow-md'
                : 'text-[#45474c] hover:text-[#091426] bg-transparent'
            }`}
          >
            <FileText className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Activities Log</span>
          </button>
        </div>
      </div>

      {/* KPI Cards section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-[#1e1b4b] to-[#311042] text-white p-6 rounded-2xl shadow-xl relative overflow-hidden flex flex-col justify-between text-left h-36">
          <div className="absolute right-[-15px] top-[-15px] opacity-10">
            <AlertTriangle className="w-24 h-24" />
          </div>
          <div>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Aggregate Overdue</p>
            <h3 className="font-headline text-3xl font-black mt-1.5">
              {formatCurrency(totalOverdueAmount)}
            </h3>
          </div>
          <span className="text-[10px] text-[#89f5e7] font-semibold flex items-center gap-1 mt-auto">
            <Sparkles className="w-3 h-3" />
            <span>Late Fees Accruing</span>
          </span>
        </div>

        <div className="bg-white border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-sm flex flex-col justify-between text-left h-36">
          <div>
            <p className="text-[#45474c] text-[10px] font-bold uppercase tracking-widest">Accounts in Default</p>
            <h3 className="font-headline text-3xl font-black text-[#091426] mt-1.5">
              {defaultAccountsCount}
            </h3>
          </div>
          <span className="text-[10px] text-amber-600 font-semibold mt-auto flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Requires Action Notice</span>
          </span>
        </div>

        <div className="bg-white border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-sm flex flex-col justify-between text-left h-36">
          <div>
            <p className="text-[#45474c] text-[10px] font-bold uppercase tracking-widest">Severe / Critical Defaults</p>
            <h3 className="font-headline text-3xl font-black text-[#ba1a1a] mt-1.5">
              {criticalAccountsCount}
            </h3>
          </div>
          <span className="text-[10px] text-red-600 font-semibold mt-auto flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>Level 3+ Escalations</span>
          </span>
        </div>

        <div className="bg-white border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-sm flex flex-col justify-between text-left h-36">
          <div className="space-y-1">
            <p className="text-[#45474c] text-[10px] font-bold uppercase tracking-widest">Recovery Target (MTD)</p>
            <h3 className="font-headline text-3xl font-black text-[#28a094] mt-1.5">
              {simulatedRecoveryRate}%
            </h3>
            {/* Progress bar */}
            <div className="w-full bg-[#eceef0] h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-[#28a094] h-full rounded-full transition-all duration-300"
                style={{ width: `${simulatedRecoveryRate}%` }}
              />
            </div>
          </div>
          <span className="text-[10px] text-[#28a094] font-semibold mt-auto flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>Target: 85% Recovery</span>
          </span>
        </div>
      </div>

      {subTab === 'overdue' ? (
        // ==================== SUBTAB: OVERDUE REGISTER ====================
        <div className="space-y-6">
          {/* Search, Filter, & Options Bar */}
          <div className="bg-white border border-[#cbd5e1]/40 rounded-2xl p-4.5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#45474c]" />
              <input
                type="text"
                placeholder="Search borrower or loan ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#f7f9fb] border border-[#cbd5e1] rounded-xl font-sans text-xs font-semibold text-[#191c1e] placeholder-[#45474c]/60 outline-none focus:bg-white focus:ring-2 focus:ring-[#645efb] transition-all"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#45474c]" />
                <span className="font-sans text-xs font-bold text-[#45474c]">Risk Tier:</span>
              </div>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="bg-[#f7f9fb] border border-[#cbd5e1] rounded-xl px-3 py-2.5 font-sans text-xs font-semibold text-[#191c1e] cursor-pointer outline-none focus:bg-white focus:ring-2 focus:ring-[#645efb] transition-colors"
              >
                <option value="All">All Categories</option>
                <option value="Prime / Low Risk">Low Risk</option>
                <option value="Medium Risk">Medium Risk</option>
                <option value="High Risk">High Risk</option>
              </select>
            </div>
          </div>

          {/* Overdue Borrowers Directory Table */}
          <div className="bg-white border border-[#cbd5e1]/40 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#cbd5e1]/30 text-[#45474c] uppercase font-bold text-[10px] tracking-wider bg-[#f7f9fb]">
                    <th className="py-4 px-6 rounded-l-2xl">Borrower / Account</th>
                    <th className="py-4 px-6">Vehicle Asset</th>
                    <th className="py-4 px-6 text-center">Risk Tier</th>
                    <th className="py-4 px-6 text-center">Missed EMIs</th>
                    <th className="py-4 px-6 text-right">EMI Value</th>
                    <th className="py-4 px-6 text-right">Overdue Balance</th>
                    <th className="py-4 px-6">Dunning Escalation</th>
                    <th className="py-4 px-6 text-right rounded-r-2xl">Escalation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#cbd5e1]/20">
                  {filteredOverdueLoans.map((l) => {
                    const customer = customers.find(c => c.id === l.customerId);
                    const riskCategory = l.riskCategory || customer?.category || 'Medium Risk';
                    const riskStyle = 
                      riskCategory.includes('High') ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                      riskCategory.includes('Medium') ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                      'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';

                    const dunning = getDunningLevel(l.defaultInstances);
                    const overdueAmt = l.emiCalculated * l.defaultInstances;

                    return (
                      <tr key={l.id} className="hover:bg-[#f7f9fb]/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-[#091426] text-[13px]">{l.customerName}</div>
                          <div className="text-[10px] font-bold text-[#645efb] mt-0.5">{l.id}</div>
                          <div className="text-[9px] text-[#45474c] mt-0.5 font-mono">Started: {l.dueStartDate}</div>
                        </td>
                        <td className="py-4 px-6 font-semibold text-[#191c1e] text-[11px] max-w-[150px] truncate" title={l.vehicleName}>
                          {l.vehicleName}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold border uppercase tracking-wide ${riskStyle}`}>
                            {riskCategory.replace(' / Low Risk', '')}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                            l.defaultInstances >= 3 
                              ? 'bg-red-100 text-[#ba1a1a] border-red-200 animate-pulse' 
                              : 'bg-amber-100 text-amber-800 border-amber-200'
                          }`}>
                            <AlertCircle className="w-3 h-3" />
                            <span>{l.defaultInstances} Missed</span>
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right font-semibold text-[#45474c] text-[11px]">
                          {formatCurrency(l.emiCalculated)}
                        </td>
                        <td className="py-4 px-6 text-right font-black text-[#091426] text-[13px]">
                          {formatCurrency(overdueAmt)}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1.5 rounded-lg border text-[10px] font-extrabold uppercase ${dunning.color}`}>
                            {dunning.level.split(':')[0]}
                          </span>
                          <div className="text-[9px] text-[#45474c] mt-1 font-medium">{dunning.level.split(':')[1]?.trim() || ''}</div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenContactModal(l)}
                              className="p-2.5 bg-[#f2f4f6] text-[#091426] hover:bg-[#eceef0] rounded-xl transition-all cursor-pointer border-none"
                              title="Log Communication Action"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenNoticeModal(l)}
                              className="p-2.5 bg-[#f2f4f6] text-[#645efb] hover:bg-[#645efb]/10 rounded-xl transition-all cursor-pointer border-none"
                              title="Generate/Print Notice Letter"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenPayModal(l)}
                              className="px-3 py-2 bg-[#28a094] hover:bg-[#208479] text-white rounded-xl font-bold flex items-center gap-1 transition-all active:scale-[0.98] cursor-pointer border-none text-[10px]"
                              title="Record Recovery Payment"
                            >
                              <CheckCircle className="w-3 h-3" />
                              <span>Recover</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredOverdueLoans.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-xs text-[#45474c] font-semibold">
                        No overdue borrower accounts matching current parameters. All assets active and compliant!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        // ==================== SUBTAB: COMMUNICATION LEDGER ====================
        <div className="space-y-6">
          <div className="bg-white border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-sm text-left">
            <h3 className="font-headline text-md font-bold text-[#091426] mb-5 border-b border-[#cbd5e1]/20 pb-3">
              Chronological Collections History
            </h3>
            
            <div className="relative border-l-2 border-[#cbd5e1]/40 pl-6 ml-3 space-y-7">
              {dunningLogs.map((log) => {
                const badgeColor = 
                  log.actionType === 'Legal Notice' || log.actionType === 'Repo Order' ? 'bg-red-500/10 text-red-600 border-red-200' :
                  log.actionType === 'Visit' ? 'bg-amber-500/10 text-amber-600 border-amber-200' :
                  'bg-blue-500/10 text-blue-600 border-blue-200';
                
                const LogIcon = 
                  log.actionType === 'Call' ? Phone :
                  log.actionType === 'SMS' ? MessageSquare :
                  log.actionType === 'Email' ? Mail :
                  log.actionType === 'Visit' ? MapPin :
                  log.actionType === 'Legal Notice' ? FileText : AlertTriangle;

                return (
                  <div key={log.id} className="relative group text-left">
                    {/* Timeline bullet */}
                    <div className="absolute left-[-31.5px] top-1 w-4 h-4 bg-white border-2 border-[#645efb] rounded-full group-hover:bg-[#645efb] transition-all" />

                    <div className="bg-[#f7f9fb] border border-[#cbd5e1]/40 rounded-2xl p-4.5 shadow-sm max-w-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase ${badgeColor}`}>
                            <LogIcon className="w-2.5 h-2.5" />
                            <span>{log.actionType}</span>
                          </span>
                          <span className="font-bold text-[#091426] text-xs">{log.customerName}</span>
                          <span className="text-[10px] text-[#45474c] font-medium">({log.loanId})</span>
                        </div>
                        <p className="font-sans text-xs font-bold text-[#191c1e] mt-1.5">{log.summary}</p>
                        {log.notes && (
                          <p className="font-sans text-[11px] text-[#45474c] mt-1 bg-white p-2.5 rounded-xl border border-[#cbd5e1]/20 max-w-2xl leading-relaxed">
                            {log.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-row md:flex-col items-start md:items-end justify-between md:justify-center w-full md:w-auto text-[10px] text-[#45474c] font-semibold flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#cbd5e1]/20">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3" />
                          <span>{log.date}</span>
                        </span>
                        <span className="flex items-center gap-1 mt-0.5 text-[#645efb]">
                          <User className="w-3 h-3" />
                          <span>Agent: {log.agentName}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {dunningLogs.length === 0 && (
                <div className="text-center text-xs text-[#45474c] font-semibold py-6">
                  No communication actions logged in the system ledger yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: LOG COMMUNICATION ACTION ==================== */}
      <AnimatePresence>
        {isContactModalOpen && selectedLoanForContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden text-left"
            >
              <div className="bg-[#091426] text-white px-6 py-4.5 flex justify-between items-center">
                <div>
                  <h3 className="font-headline text-md font-bold">Log Collection Communication</h3>
                  <p className="text-[10px] text-white/60 font-medium mt-0.5">Recording history for: {selectedLoanForContact.customerName} ({selectedLoanForContact.id})</p>
                </div>
                <button 
                  onClick={() => setIsContactModalOpen(false)}
                  className="text-white/60 hover:text-white bg-transparent border-none cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveContactLog} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Action Type</label>
                    <select
                      value={contactType}
                      onChange={(e) => setContactType(e.target.value as any)}
                      className="w-full bg-white border border-[#cbd5e1] rounded-xl p-3 font-sans text-xs font-semibold text-[#191c1e] focus:ring-2 focus:ring-[#645efb] outline-none"
                    >
                      <option value="Call">Phone Call</option>
                      <option value="SMS">SMS Message</option>
                      <option value="Email">Email Notice</option>
                      <option value="Visit">Field Agent Visit</option>
                      <option value="Legal Notice">Level 3 Legal Notice</option>
                      <option value="Repo Order">Asset Repossession Order</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Logged By Agent</label>
                    <input
                      type="text"
                      value={user?.fullName || 'Collection Agent'}
                      disabled
                      className="w-full bg-[#eceef0] border border-[#cbd5e1]/60 rounded-xl p-3 font-sans text-xs font-semibold text-[#45474c] cursor-not-allowed outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Communication Summary</label>
                  <input
                    type="text"
                    placeholder="e.g. Promised payment on Friday, Call unanswered"
                    value={contactSummary}
                    onChange={(e) => setContactSummary(e.target.value)}
                    required
                    className="w-full border border-[#cbd5e1] rounded-xl p-3 font-sans text-xs font-semibold text-[#191c1e] focus:ring-2 focus:ring-[#645efb] outline-none placeholder-[#45474c]/50"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Follow-up Ledger Notes</label>
                  <textarea
                    rows={4}
                    placeholder="Enter detailed conversation notes or next action parameters..."
                    value={contactNotes}
                    onChange={(e) => setContactNotes(e.target.value)}
                    className="w-full border border-[#cbd5e1] rounded-xl p-3 font-sans text-xs font-semibold text-[#191c1e] focus:ring-2 focus:ring-[#645efb] outline-none placeholder-[#45474c]/50 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsContactModalOpen(false)}
                    className="px-4.5 py-2.5 border border-[#cbd5e1] hover:bg-[#f2f4f6] font-sans text-xs font-semibold text-[#091426] rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#645efb] hover:bg-[#524be3] text-white font-sans text-xs font-bold rounded-xl shadow-md cursor-pointer border-none"
                  >
                    Save Activity
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== MODAL: OFFICIAL DUNNING NOTICE PREVIEW ==================== */}
      <AnimatePresence>
        {isNoticeModalOpen && selectedLoanForNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-8 text-left"
            >
              <div className="bg-[#091426] text-white px-6 py-4.5 flex justify-between items-center print:hidden">
                <div>
                  <h3 className="font-headline text-md font-bold">Dunning Notice Letter</h3>
                  <p className="text-[10px] text-white/60 font-medium mt-0.5">Formal warning generation interface</p>
                </div>
                <button 
                  onClick={() => setIsNoticeModalOpen(false)}
                  className="text-white/60 hover:text-white bg-transparent border-none cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Notice sheet layout */}
              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto font-sans leading-normal text-xs text-[#091426]">
                
                {/* Letter Header */}
                <div className="flex justify-between items-start border-b-2 border-[#cbd5e1] pb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-[#645efb] rounded-xl flex items-center justify-center text-white font-bold">
                      AF
                    </div>
                    <div>
                      <h4 className="font-headline text-sm font-extrabold text-[#091426] uppercase">AutoFinance ERP Ltd.</h4>
                      <p className="text-[9px] text-[#45474c] font-semibold">Corporate Receivables &amp; Collections</p>
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-[#45474c] font-semibold">
                    <p>Mumbai Head Office, BKC</p>
                    <p>Contact: +91 22 5550 0199</p>
                    <p>Date: {new Date().toISOString().split('T')[0]}</p>
                  </div>
                </div>

                {/* Letter Metas */}
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <h5 className="font-bold text-[#45474c] uppercase text-[9px] tracking-wider mb-1">To Borrower:</h5>
                    <p className="font-bold text-[12px]">{selectedLoanForNotice.customerName}</p>
                    <p className="text-[#45474c]">Loan Agreement ID: {selectedLoanForNotice.id}</p>
                    <p className="text-[#45474c] mt-1">Vehicle Asset: {selectedLoanForNotice.vehicleName}</p>
                  </div>
                  <div className="text-right">
                    <h5 className="font-bold text-[#45474c] uppercase text-[9px] tracking-wider mb-1">Notice Reference:</h5>
                    <p className="font-mono text-[11px] font-bold text-[#645efb]">AF-DUN-{(selectedLoanForNotice.id).split('-')[2] || '9821'}</p>
                    <p className="font-bold text-red-600 mt-1">Overdue Amount: {formatCurrency(selectedLoanForNotice.emiCalculated * selectedLoanForNotice.defaultInstances)}</p>
                    <p className="text-[#45474c] mt-0.5">Missed Installments: {selectedLoanForNotice.defaultInstances}</p>
                  </div>
                </div>

                {/* Warning Statement */}
                <div className="bg-red-500/5 border-l-4 border-red-500 p-4 rounded-r-xl text-left">
                  <h6 className="font-bold text-red-700 flex items-center gap-1.5 uppercase text-[10px]">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>FORMAL DEMAND FOR IMMEDIATE REPAYMENT</span>
                  </h6>
                  <p className="text-[11px] text-[#ba1a1a] mt-1 font-semibold">
                    Our database files record that your financing account is currently in default of payment.
                    Immediate intervention is required to avoid credit rating downgrades or asset repossession.
                  </p>
                </div>

                {/* Letter Body */}
                <div className="space-y-3 font-sans text-left text-[#45474c] leading-relaxed">
                  <p>Dear {selectedLoanForNotice.customerName},</p>
                  <p>
                    We are writing to formally notify you that your vehicle loan agreement number <strong>{selectedLoanForNotice.id}</strong> has accumulated <strong>{selectedLoanForNotice.defaultInstances} missed EMI payments</strong>, resulting in a total overdue balance of <strong>{formatCurrency(selectedLoanForNotice.emiCalculated * selectedLoanForNotice.defaultInstances)}</strong>.
                  </p>
                  <p>
                    Under the covenants of your retail asset financing contract, you are required to clear the arrears immediately. Repeated failures to establish contact or remit payments will force us to escalate this matter. Such escalations include:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Reporting the default status to CRIF High Mark and other central credit registry offices (substantially reducing your credit rating score).</li>
                    <li>Executing repossession warrants on the pledged vehicle collateral asset: <strong>{selectedLoanForNotice.vehicleName}</strong>.</li>
                    <li>Initiating formal litigation under civil debt recovery parameters.</li>
                  </ul>
                  <p>
                    Please submit your recovery payment immediately by clicking "Recover" in your customer ERP hub or contact our branch office collections department at +91 22 5550 0199 within three (3) working days.
                  </p>
                  <p className="pt-2 font-bold text-[#091426]">
                    Sincerely,<br />
                    <span className="text-[#645efb] text-[10px] uppercase font-black">AutoFinance Collection Bureau</span>
                  </p>
                </div>
              </div>

              {/* Actions footer */}
              <div className="bg-[#f7f9fb] border-t border-[#cbd5e1]/40 px-6 py-4.5 flex justify-between items-center print:hidden">
                <span className="text-[10px] font-semibold text-[#45474c]">Document Code: AF-FORM-99A-REV</span>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsNoticeModalOpen(false)}
                    className="px-4.5 py-2.5 border border-[#cbd5e1] hover:bg-[#f2f4f6] font-sans text-xs font-semibold text-[#091426] rounded-xl cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={handlePrintNotice}
                    className="px-6 py-2.5 bg-[#645efb] hover:bg-[#524be3] text-white font-sans text-xs font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer border-none"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Notice</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== MODAL: RECORD RECOVERY PAYMENT ==================== */}
      <AnimatePresence>
        {isPayModalOpen && selectedLoanForPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-left">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="bg-[#28a094] text-white px-6 py-4.5 flex justify-between items-center">
                <div>
                  <h3 className="font-headline text-md font-bold">Record Overdue EMI Recovery</h3>
                  <p className="text-[10px] text-white/80 font-medium mt-0.5">Collect arrears: {selectedLoanForPayment.customerName}</p>
                </div>
                <button 
                  onClick={() => setIsPayModalOpen(false)}
                  className="text-white/80 hover:text-white bg-transparent border-none cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleConfirmPayment} className="p-6 space-y-4">
                <div className="bg-[#28a094]/10 border border-[#28a094]/25 p-4 rounded-xl space-y-2 text-left">
                  <div className="flex justify-between text-xs text-[#28a094] font-bold">
                    <span>Single EMI Installment:</span>
                    <span>{formatCurrency(selectedLoanForPayment.emiCalculated)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#28a094] font-bold">
                    <span>Missed Count:</span>
                    <span>{selectedLoanForPayment.defaultInstances} months</span>
                  </div>
                  <div className="border-t border-[#28a094]/20 pt-2 flex justify-between text-sm text-[#005049] font-black">
                    <span>Total Arrears Outstanding:</span>
                    <span>{formatCurrency(selectedLoanForPayment.emiCalculated * selectedLoanForPayment.defaultInstances)}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Arrears Recovered Amount (₹)</label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                    className="w-full border border-[#cbd5e1] rounded-xl p-3 font-sans text-xs font-semibold text-[#191c1e] focus:ring-2 focus:ring-[#28a094] outline-none"
                  />
                  <p className="text-[9px] text-[#45474c] font-medium uppercase tracking-wider">Inputting ₹{selectedLoanForPayment.emiCalculated.toLocaleString()} resolves 1 default instance.</p>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Recovery Target Account</label>
                  <select
                    value={paymentAccount}
                    onChange={(e) => setPaymentAccount(e.target.value)}
                    className="w-full bg-white border border-[#cbd5e1] rounded-xl p-3 font-sans text-xs font-semibold text-[#191c1e] focus:ring-2 focus:ring-[#28a094] outline-none"
                  >
                    <option value="Main Operating Account (...4492)">Main Operating Account (...4492)</option>
                    <option value="Secondary Petty Reserve (...1102)">Secondary Petty Reserve (...1102)</option>
                    <option value="Cash Vault Collection Unit">Cash Vault Collection Unit</option>
                  </select>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Recovery Settlement Date</label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    required
                    className="w-full border border-[#cbd5e1] rounded-xl p-3 font-sans text-xs font-semibold text-[#191c1e] focus:ring-2 focus:ring-[#28a094] outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPayModalOpen(false)}
                    className="px-4.5 py-2.5 border border-[#cbd5e1] hover:bg-[#f2f4f6] font-sans text-xs font-semibold text-[#091426] rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#28a094] hover:bg-[#208479] text-white font-sans text-xs font-bold rounded-xl shadow-md cursor-pointer border-none"
                  >
                    Confirm Collection
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
