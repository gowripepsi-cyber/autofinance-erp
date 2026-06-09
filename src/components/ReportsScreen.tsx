import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Car, 
  Users, 
  Printer, 
  Download, 
  Calendar, 
  ArrowUpRight, 
  TrendingDown, 
  PieChart, 
  Sparkles,
  Info,
  DollarSign,
  CheckCircle
} from 'lucide-react';
import { Vehicle, Customer, Loan, Transaction } from '../types';

interface ReportsScreenProps {
  vehicles: Vehicle[];
  customers: Customer[];
  loans: Loan[];
  transactions: Transaction[];
}

type ReportTab = 'financial' | 'arrears' | 'inventory' | 'credit';

export default function ReportsScreen({
  vehicles,
  customers,
  loans,
  transactions
}: ReportsScreenProps) {
  const [activeReport, setActiveReport] = useState<ReportTab>('financial');
  const [dateRange, setDateRange] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  // Helper Indian Rupees Currency Formatter
  const formatCurrency = (val: number) => {
    return val.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    });
  };

  // ==================== 1. FINANCIAL PERFORMANCE STATISTICS ====================
  const financialMetrics = useMemo(() => {
    const activeLoans = loans.filter(l => l.status === 'Active' || l.status === 'Approved');
    
    // Capital deployed: sum of principled loan amounts
    const capitalDeployed = activeLoans.reduce((sum, l) => sum + l.loanAmount, 0);

    // Expected collections: sum of emiCalculated * tenureMonths
    const projectedCollections = activeLoans.reduce((sum, l) => sum + (l.emiCalculated * l.tenureMonths), 0);

    // Project interest yield: Expected collections - Capital deployed
    const projectedInterest = Math.max(0, projectedCollections - capitalDeployed);

    // Collected EMIs: transactions containing [EMI] or [COLLECTION] that succeeded
    const collectedEMIs = transactions
      .filter(t => t.status === 'Success' && (t.vehicle.includes('EMI') || t.vehicle.includes('COLLECTION')))
      .reduce((sum, t) => sum + t.amount, 0);

    // Collection efficiency percentage
    const currentOverdueAmount = loans
      .filter(l => l.status === 'Active')
      .reduce((sum, l) => sum + (l.emiCalculated * l.defaultInstances), 0);
    
    const collectionTarget = collectedEMIs + currentOverdueAmount;
    const collectionEfficiency = collectionTarget > 0 
      ? Number(((collectedEMIs / collectionTarget) * 100).toFixed(1))
      : 100;

    return {
      capitalDeployed,
      projectedCollections,
      projectedInterest,
      collectedEMIs,
      collectionEfficiency,
      currentOverdueAmount
    };
  }, [loans, transactions]);

  // ==================== 2. RECEIVABLES ARREARS AGING STATISTICS ====================
  const agingMetrics = useMemo(() => {
    const overdueLoans = loans.filter(l => l.status === 'Active' && l.defaultInstances > 0);
    
    // Segment categories
    const segment30 = overdueLoans.filter(l => l.defaultInstances === 1); // 1-30 days
    const segment60 = overdueLoans.filter(l => l.defaultInstances === 2); // 31-60 days
    const segment90 = overdueLoans.filter(l => l.defaultInstances >= 3); // 60+ days

    const amount30 = segment30.reduce((sum, l) => sum + l.emiCalculated, 0);
    const amount60 = segment60.reduce((sum, l) => sum + (l.emiCalculated * 2), 0);
    const amount90 = segment90.reduce((sum, l) => sum + (l.emiCalculated * l.defaultInstances), 0);

    const totalOverdueVal = amount30 + amount60 + amount90;

    return {
      count30: segment30.length,
      count60: segment60.length,
      count90: segment90.length,
      amount30,
      amount60,
      amount90,
      totalOverdueVal
    };
  }, [loans]);

  // ==================== 3. ASSET INVENTORY & VALUATION STATISTICS ====================
  const assetMetrics = useMemo(() => {
    const totalVehicles = vehicles.length;
    
    // Valuation parameters
    const totalPurchaseCost = vehicles.reduce((sum, v) => sum + v.purchasePrice, 0);
    const totalMarketValue = vehicles.reduce((sum, v) => sum + v.salePrice, 0);
    const unrealizedProfit = Math.max(0, totalMarketValue - totalPurchaseCost);

    // Distribution
    const completedCount = vehicles.filter(v => v.status === 'Completed').length;
    const transitCount = vehicles.filter(v => v.status === 'In Transit').length;
    
    return {
      totalVehicles,
      totalPurchaseCost,
      totalMarketValue,
      unrealizedProfit,
      completedCount,
      transitCount
    };
  }, [vehicles]);

  // ==================== 4. CREDIT SPREAD STATISTICS ====================
  const creditMetrics = useMemo(() => {
    const activeCustomers = customers.filter(c => c.status === 'Completed');
    const totalScore = activeCustomers.reduce((sum, c) => sum + c.crifScore, 0);
    const avgCrif = activeCustomers.length > 0 ? Math.round(totalScore / activeCustomers.length) : 750;

    // Credit score segmentation buckets
    const primeCount = activeCustomers.filter(c => c.crifScore >= 750).length;
    const mediumCount = activeCustomers.filter(c => c.crifScore >= 650 && c.crifScore < 750).length;
    const subprimeCount = activeCustomers.filter(c => c.crifScore < 650).length;

    const riskPrimePct = activeCustomers.length > 0 ? (primeCount / activeCustomers.length) * 100 : 0;
    const riskMediumPct = activeCustomers.length > 0 ? (mediumCount / activeCustomers.length) * 100 : 0;
    const riskSubPrimePct = activeCustomers.length > 0 ? (subprimeCount / activeCustomers.length) * 100 : 0;

    return {
      avgCrif,
      primeCount,
      mediumCount,
      subprimeCount,
      riskPrimePct: Number(riskPrimePct.toFixed(1)),
      riskMediumPct: Number(riskMediumPct.toFixed(1)),
      riskSubPrimePct: Number(riskSubPrimePct.toFixed(1))
    };
  }, [customers]);

  // Handler to export report data (Mock with animation)
  const handleExport = (format: 'pdf' | 'csv') => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      if (format === 'pdf') {
        window.print();
      } else {
        alert('Report successfully exported as CSV to your Downloads folder!');
      }
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-8 select-none"
    >
      {/* Title & Options Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="text-left flex-1 min-w-0">
          <h2 className="font-headline text-3xl font-extrabold text-[#091426] tracking-tight">
            ERP Reports Engine &amp; Analytics
          </h2>
          <p className="font-sans text-sm text-[#45474c] mt-1.5 font-medium max-w-xl">
            Audit portfolio performance indicators, compute collections efficiency, review asset valuation parameters, and export financial summaries.
          </p>
        </div>

        {/* Global Control Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2 bg-white border border-[#cbd5e1]/60 px-3.5 py-2.5 rounded-xl shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-[#45474c]" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent border-none font-sans text-xs font-bold text-[#191c1e] cursor-pointer outline-none p-0"
            >
              <option value="all">All Lifetime Ledger</option>
              <option value="mth">Current Fiscal Month</option>
              <option value="qtr">Current Quarter (Q2)</option>
              <option value="yr">Current Fiscal Year</option>
            </select>
          </div>

          <button
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            className="px-4.5 py-2.5 border border-[#cbd5e1] hover:bg-[#f2f4f6] font-sans text-xs font-bold text-[#091426] rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer border-none bg-white disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          
          <button
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="px-4.5 py-2.5 bg-[#091426] hover:bg-[#1e293b] text-white font-sans text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer border-none disabled:opacity-50"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Reports Screen Tab Switcher */}
      <div className="flex bg-[#eceef0] p-1.5 rounded-2xl gap-1.5 shadow-inner w-full md:w-max flex-shrink-0 text-left">
        <button
          onClick={() => setActiveReport('financial')}
          className={`px-4.5 py-2.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer border-none flex items-center gap-2 whitespace-nowrap ${
            activeReport === 'financial'
              ? 'bg-white text-[#645efb] shadow-md'
              : 'text-[#45474c] hover:text-[#091426] bg-transparent'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Financial Performance</span>
        </button>
        <button
          onClick={() => setActiveReport('arrears')}
          className={`px-4.5 py-2.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer border-none flex items-center gap-2 whitespace-nowrap ${
            activeReport === 'arrears'
              ? 'bg-white text-[#645efb] shadow-md'
              : 'text-[#45474c] hover:text-[#091426] bg-transparent'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Arrears Aging (Dunning)</span>
        </button>
        <button
          onClick={() => setActiveReport('inventory')}
          className={`px-4.5 py-2.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer border-none flex items-center gap-2 whitespace-nowrap ${
            activeReport === 'inventory'
              ? 'bg-white text-[#645efb] shadow-md'
              : 'text-[#45474c] hover:text-[#091426] bg-transparent'
          }`}
        >
          <Car className="w-3.5 h-3.5" />
          <span>Asset Stock &amp; Valuation</span>
        </button>
        <button
          onClick={() => setActiveReport('credit')}
          className={`px-4.5 py-2.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer border-none flex items-center gap-2 whitespace-nowrap ${
            activeReport === 'credit'
              ? 'bg-white text-[#645efb] shadow-md'
              : 'text-[#45474c] hover:text-[#091426] bg-transparent'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Risk &amp; Credit Spread</span>
        </button>
      </div>

      {/* Main reporting panel */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {isExporting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/70 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3.5"
            >
              <div className="w-8 h-8 rounded-full border-3 border-[#645efb] border-t-transparent animate-spin" />
              <p className="text-[10px] font-bold text-[#091426] uppercase tracking-widest font-mono">Compiling portfolio metrics for export...</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {activeReport === 'financial' && (
            // ==================== REPORT TAB: FINANCIAL SUMMARY ====================
            <motion.div
              key="financial"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Financial Quick KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-[#cbd5e1]/40 shadow-sm text-left">
                  <p className="text-[#45474c] text-[10px] font-bold uppercase tracking-widest">Capital Portfolio Deployed</p>
                  <h3 className="font-headline text-2xl font-black text-[#091426] mt-2">
                    {formatCurrency(financialMetrics.capitalDeployed)}
                  </h3>
                  <div className="flex items-center gap-1 mt-3 text-[10.5px] text-[#28a094] font-bold">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Lending Deployments Active</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#cbd5e1]/40 shadow-sm text-left">
                  <p className="text-[#45474c] text-[10px] font-bold uppercase tracking-widest">Total Collected Repayments</p>
                  <h3 className="font-headline text-2xl font-black text-[#645efb] mt-2">
                    {formatCurrency(financialMetrics.collectedEMIs)}
                  </h3>
                  <div className="flex items-center gap-1 mt-3 text-[10.5px] text-[#645efb] font-bold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>EMI Repayments Settled</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#091426] to-[#1e293b] text-white p-6 rounded-2xl shadow-lg text-left flex flex-col justify-between">
                  <div>
                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Interest Yield Generated</p>
                    <h3 className="font-headline text-2xl font-black mt-2">
                      {formatCurrency(financialMetrics.projectedInterest)}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-[10.5px] text-[#89f5e7] font-bold mt-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Projections Audited</span>
                  </div>
                </div>
              </div>

              {/* Data Table and Graph */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
                {/* Expected vs Collected SVG Chart */}
                <div className="bg-white border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-sm lg:col-span-8 text-left space-y-4">
                  <div className="flex justify-between items-center border-b border-[#cbd5e1]/20 pb-3.5">
                    <h4 className="font-headline text-sm font-bold text-[#091426]">Repayment Collections Trend (Expected vs Collected)</h4>
                    <div className="flex items-center gap-3.5 text-[10px] font-bold text-[#45474c]">
                      <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 bg-[#eceef0] rounded" /> Projected Target</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 bg-[#645efb] rounded" /> Remitted EMIs</span>
                    </div>
                  </div>

                  {/* SVG Chart Engine */}
                  <div className="w-full h-56 flex items-center justify-center bg-[#f7f9fb] rounded-2xl p-4 border border-[#cbd5e1]/10">
                    <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                      {/* Grid Lines */}
                      <line x1="0" y1="40" x2="500" y2="40" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="5,5" />
                      <line x1="0" y1="100" x2="500" y2="100" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="5,5" />
                      <line x1="0" y1="160" x2="500" y2="160" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="5,5" />
                      
                      {/* Target Area Shading */}
                      <path d="M 0 160 Q 120 120, 250 80 T 500 30 L 500 200 L 0 200 Z" fill="rgba(236, 238, 240, 0.4)" />
                      {/* Actual Collected Area Shading */}
                      <path d="M 0 170 Q 120 135, 250 100 T 500 55 L 500 200 L 0 200 Z" fill="rgba(100, 94, 251, 0.1)" />

                      {/* Trend lines */}
                      <path d="M 0 160 Q 120 120, 250 80 T 500 30" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
                      <path d="M 0 170 Q 120 135, 250 100 T 500 55" fill="none" stroke="#645efb" strokeWidth="3.5" strokeLinecap="round" />
                      
                      {/* Target Data Nodes */}
                      <circle cx="250" cy="80" r="4" fill="#94a3b8" />
                      <circle cx="500" cy="30" r="4" fill="#94a3b8" />

                      {/* Collected Data Nodes */}
                      <circle cx="250" cy="100" r="5" fill="#645efb" />
                      <circle cx="500" cy="55" r="5" fill="#645efb" />
                    </svg>
                  </div>
                  <div className="flex justify-between font-sans text-[9.5px] font-bold text-[#45474c] px-4">
                    <span>Dec 2025</span>
                    <span>Jan 2026</span>
                    <span>Feb 2026</span>
                    <span>Mar 2026</span>
                    <span>Apr 2026</span>
                    <span>May 2026</span>
                    <span>Jun 2026 (Current)</span>
                  </div>
                </div>

                {/* Collections Efficiency Indicator */}
                <div className="bg-white border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-sm lg:col-span-4 text-left flex flex-col justify-between">
                  <h4 className="font-headline text-sm font-bold text-[#091426] border-b border-[#cbd5e1]/20 pb-3">Collections Efficiency</h4>
                  
                  <div className="relative w-36 h-36 mx-auto my-4 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="72" cy="72" fill="transparent" r="58" stroke="#eceef0" strokeWidth="8" />
                      <circle 
                        cx="72" 
                        cy="72" 
                        fill="transparent" 
                        r="58" 
                        stroke="#645efb" 
                        strokeWidth="10" 
                        strokeDasharray="364.4" 
                        strokeDashoffset={364.4 - (financialMetrics.collectionEfficiency / 100) * 364.4}
                        className="transition-all duration-300"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-headline text-2xl font-black text-[#091426]">{financialMetrics.collectionEfficiency}%</span>
                      <span className="text-[8px] text-[#45474c] uppercase font-black tracking-widest mt-0.5">Remittance Rate</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 font-sans text-xs font-semibold text-[#45474c] border-t border-[#cbd5e1]/20 pt-4">
                    <div className="flex justify-between">
                      <span>Total Recoverable target:</span>
                      <span className="text-[#091426] font-bold">
                        {formatCurrency(financialMetrics.collectedEMIs + financialMetrics.currentOverdueAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Remitted:</span>
                      <span className="text-[#28a094] font-bold">{formatCurrency(financialMetrics.collectedEMIs)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overdue Arrears:</span>
                      <span className="text-[#ba1a1a] font-bold">{formatCurrency(financialMetrics.currentOverdueAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeReport === 'arrears' && (
            // ==================== REPORT TAB: ARREARS AGING ====================
            <motion.div
              key="arrears"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Overdue aging overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-[#cbd5e1]/40 shadow-sm text-left">
                  <p className="text-[#45474c] text-[10px] font-bold uppercase tracking-widest">1-30 Days Arrears</p>
                  <h3 className="font-headline text-xl font-black text-[#091426] mt-1.5">
                    {formatCurrency(agingMetrics.amount30)}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-amber-600 font-bold mt-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>{agingMetrics.count30} Active Contracts</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#cbd5e1]/40 shadow-sm text-left">
                  <p className="text-[#45474c] text-[10px] font-bold uppercase tracking-widest">31-60 Days Arrears</p>
                  <h3 className="font-headline text-xl font-black text-amber-700 mt-1.5">
                    {formatCurrency(agingMetrics.amount60)}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-orange-600 font-bold mt-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    <span>{agingMetrics.count60} Active Contracts</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#cbd5e1]/40 shadow-sm text-left">
                  <p className="text-[#45474c] text-[10px] font-bold uppercase tracking-widest">60+ Days Severe Defaults</p>
                  <h3 className="font-headline text-xl font-black text-red-700 mt-1.5">
                    {formatCurrency(agingMetrics.amount90)}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-red-600 font-bold mt-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span>{agingMetrics.count90} Legal Notice Cases</span>
                  </div>
                </div>

                <div className="bg-[#ba1a1a]/5 border border-[#ba1a1a]/20 p-5 rounded-2xl text-left flex flex-col justify-between">
                  <div>
                    <p className="text-[#ba1a1a] text-[10px] font-bold uppercase tracking-widest">Aggregate Receivables Default</p>
                    <h3 className="font-headline text-2xl font-black text-red-700 mt-1.5">
                      {formatCurrency(agingMetrics.totalOverdueVal)}
                    </h3>
                  </div>
                  <span className="text-[10px] text-red-600 font-semibold flex items-center gap-1 mt-2">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Yield Risk Warning Active</span>
                  </span>
                </div>
              </div>

              {/* Arrears Aging Chart & Recovery Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
                {/* SVG Bar Chart for aging */}
                <div className="bg-white border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-sm lg:col-span-8 text-left space-y-4">
                  <h4 className="font-headline text-sm font-bold text-[#091426] border-b border-[#cbd5e1]/20 pb-3">Arrears Delinquency Aging Profile (₹ Val)</h4>
                  
                  <div className="h-56 flex items-end justify-around bg-[#f7f9fb] rounded-2xl p-6 border border-[#cbd5e1]/10">
                    {/* Bar 1 */}
                    <div className="flex flex-col items-center gap-3.5 w-20">
                      <span className="text-[9px] font-bold text-[#091426]">{formatCurrency(agingMetrics.amount30)}</span>
                      <div 
                        className="bg-amber-400 w-12 rounded-t-xl transition-all duration-500 hover:opacity-85"
                        style={{ height: `${agingMetrics.totalOverdueVal > 0 ? (agingMetrics.amount30 / agingMetrics.totalOverdueVal) * 120 + 20 : 20}px` }}
                      />
                      <span className="text-[9.5px] font-bold text-[#45474c] uppercase">1-30 Days</span>
                    </div>

                    {/* Bar 2 */}
                    <div className="flex flex-col items-center gap-3.5 w-20">
                      <span className="text-[9px] font-bold text-[#091426]">{formatCurrency(agingMetrics.amount60)}</span>
                      <div 
                        className="bg-orange-500 w-12 rounded-t-xl transition-all duration-500 hover:opacity-85"
                        style={{ height: `${agingMetrics.totalOverdueVal > 0 ? (agingMetrics.amount60 / agingMetrics.totalOverdueVal) * 120 + 20 : 20}px` }}
                      />
                      <span className="text-[9.5px] font-bold text-[#45474c] uppercase">31-60 Days</span>
                    </div>

                    {/* Bar 3 */}
                    <div className="flex flex-col items-center gap-3.5 w-20">
                      <span className="text-[9px] font-bold text-[#091426]">{formatCurrency(agingMetrics.amount90)}</span>
                      <div 
                        className="bg-red-600 w-12 rounded-t-xl transition-all duration-500 hover:opacity-85"
                        style={{ height: `${agingMetrics.totalOverdueVal > 0 ? (agingMetrics.amount90 / agingMetrics.totalOverdueVal) * 120 + 20 : 20}px` }}
                      />
                      <span className="text-[9.5px] font-bold text-[#45474c] uppercase">60+ Days</span>
                    </div>
                  </div>
                </div>

                {/* Legal & Repo Status summary */}
                <div className="bg-white border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-sm lg:col-span-4 text-left space-y-4">
                  <h4 className="font-headline text-sm font-bold text-[#091426] border-b border-[#cbd5e1]/20 pb-3">Legal Action Recovery</h4>
                  <p className="text-[11px] text-[#45474c] leading-relaxed">Arrears exceeding 60 days require mandatory escalation notice dispatches.</p>
                  
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                      <div>
                        <p className="text-xs font-bold text-red-800">Critical Default Ratio</p>
                        <p className="text-[9px] text-[#45474c] font-medium mt-0.5">Ratio of portfolio defaults &gt; 3 months</p>
                      </div>
                      <span className="font-headline text-md font-black text-red-700">
                        {loans.length > 0 ? ((agingMetrics.count90 / loans.length) * 100).toFixed(1) : 0}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <div>
                        <p className="text-xs font-bold text-amber-800">Active Repossession Orders</p>
                        <p className="text-[9px] text-[#45474c] font-medium mt-0.5">Asset recovery processes initiated</p>
                      </div>
                      <span className="font-headline text-md font-black text-amber-700">
                        {agingMetrics.count90} Units
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeReport === 'inventory' && (
            // ==================== REPORT TAB: ASSET STOCK & VALUATION ====================
            <motion.div
              key="inventory"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Asset quick stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-[#cbd5e1]/40 shadow-sm text-left">
                  <p className="text-[#45474c] text-[10px] font-bold uppercase tracking-widest">Aggregate Fleet Purchase Cost</p>
                  <h3 className="font-headline text-2xl font-black text-[#091426] mt-2">
                    {formatCurrency(assetMetrics.totalPurchaseCost)}
                  </h3>
                  <div className="flex items-center gap-1 mt-3 text-[10.5px] text-[#45474c] font-bold">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Capital locked in vehicle inventory</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#cbd5e1]/40 shadow-sm text-left">
                  <p className="text-[#45474c] text-[10px] font-bold uppercase tracking-widest">Portfolio Market Valuation</p>
                  <h3 className="font-headline text-2xl font-black text-[#645efb] mt-2">
                    {formatCurrency(assetMetrics.totalMarketValue)}
                  </h3>
                  <div className="flex items-center gap-1 mt-3 text-[10.5px] text-[#645efb] font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Projected liquidation evaluation</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#28a094] to-[#0a6358] text-white p-6 rounded-2xl shadow-lg text-left flex flex-col justify-between">
                  <div>
                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Unrealized Capital Margins</p>
                    <h3 className="font-headline text-2xl font-black mt-2">
                      {formatCurrency(assetMetrics.unrealizedProfit)}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-[10.5px] text-[#89f5e7] font-bold mt-3">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Avg ROI: {assetMetrics.totalPurchaseCost > 0 ? ((assetMetrics.unrealizedProfit / assetMetrics.totalPurchaseCost) * 100).toFixed(1) : 0}%</span>
                  </div>
                </div>
              </div>

              {/* Status Split and SVG Donut */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
                {/* Inventory Status Table */}
                <div className="bg-white border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-sm lg:col-span-7 text-left space-y-4">
                  <h4 className="font-headline text-sm font-bold text-[#091426] border-b border-[#cbd5e1]/20 pb-3">Fleet Asset Status Parameters</h4>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-[#f7f9fb] rounded-xl border border-[#cbd5e1]/30">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-[#28a094] rounded-full" />
                        <span className="font-semibold text-[#091426] text-xs">Procured Assets (Completed)</span>
                      </div>
                      <span className="font-bold text-[#091426]">{assetMetrics.completedCount} Vehicles</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-[#f7f9fb] rounded-xl border border-[#cbd5e1]/30">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-[#645efb] rounded-full" />
                        <span className="font-semibold text-[#091426] text-xs">Fleet Assets In-Transit</span>
                      </div>
                      <span className="font-bold text-[#091426]">{assetMetrics.transitCount} Vehicles</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-[#f7f9fb] rounded-xl border border-[#cbd5e1]/30">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-amber-400 rounded-full" />
                        <span className="font-semibold text-[#091426] text-xs">Pledges &amp; Customers Owned Collateral</span>
                      </div>
                      <span className="font-bold text-[#091426]">
                        {vehicles.filter(v => v.fundingAccount === 'N/A (Pledge Asset)').length} Units
                      </span>
                    </div>
                  </div>
                </div>

                {/* SVG Donut representation */}
                <div className="bg-white border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-sm lg:col-span-5 text-left flex flex-col justify-between">
                  <h4 className="font-headline text-sm font-bold text-[#091426] border-b border-[#cbd5e1]/20 pb-3">Inventory Distribution</h4>
                  
                  <div className="relative w-36 h-36 mx-auto my-4 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* Grey placeholder */}
                      <circle cx="50" cy="50" r="35" fill="transparent" stroke="#eceef0" strokeWidth="10" />
                      
                      {/* Procured slice */}
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="35" 
                        fill="transparent" 
                        stroke="#28a094" 
                        strokeWidth="10" 
                        strokeDasharray="220" 
                        strokeDashoffset={220 - (assetMetrics.completedCount / Math.max(1, assetMetrics.totalVehicles)) * 220}
                        strokeDashpos="0"
                        className="transition-all duration-500"
                        transform="rotate(-90 50 50)"
                      />

                      {/* Transit slice */}
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="35" 
                        fill="transparent" 
                        stroke="#645efb" 
                        strokeWidth="10" 
                        strokeDasharray="220" 
                        strokeDashoffset={220 - (assetMetrics.transitCount / Math.max(1, assetMetrics.totalVehicles)) * 220}
                        className="transition-all duration-500"
                        transform={`rotate(${(assetMetrics.completedCount / Math.max(1, assetMetrics.totalVehicles)) * 360 - 90} 50 50)`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-headline text-2xl font-black text-[#091426]">{assetMetrics.totalVehicles}</span>
                      <span className="text-[8px] text-[#45474c] uppercase font-black tracking-widest mt-0.5">Total Assets</span>
                    </div>
                  </div>

                  <div className="flex justify-around text-[10px] font-bold text-[#45474c] border-t border-[#cbd5e1]/20 pt-4">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#28a094] rounded-full" /> Procured</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#645efb] rounded-full" /> Transit</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-amber-400 rounded-full" /> Pledge</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeReport === 'credit' && (
            // ==================== REPORT TAB: RISK & CREDIT SPREAD ====================
            <motion.div
              key="credit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Credit Risk overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-[#cbd5e1]/40 shadow-sm text-left">
                  <p className="text-[#45474c] text-[10px] font-bold uppercase tracking-widest">Average CRIF Credit Score</p>
                  <h3 className="font-headline text-2xl font-black text-[#645efb] mt-1.5">
                    {creditMetrics.avgCrif}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#28a094] font-bold mt-2">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Prime Category Compliant</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#cbd5e1]/40 shadow-sm text-left">
                  <p className="text-[#45474c] text-[10px] font-bold uppercase tracking-widest">Prime Borrowers (&gt; 750)</p>
                  <h3 className="font-headline text-xl font-black text-[#28a094] mt-1.5">
                    {creditMetrics.primeCount} Customers
                  </h3>
                  <span className="text-[10px] text-[#45474c] font-semibold block mt-2">{creditMetrics.riskPrimePct}% of active database</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#cbd5e1]/40 shadow-sm text-left">
                  <p className="text-[#45474c] text-[10px] font-bold uppercase tracking-widest font-mono">Medium Risk (650-749)</p>
                  <h3 className="font-headline text-xl font-black text-amber-600 mt-1.5">
                    {creditMetrics.mediumCount} Customers
                  </h3>
                  <span className="text-[10px] text-[#45474c] font-semibold block mt-2">{creditMetrics.riskMediumPct}% of active database</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#cbd5e1]/40 shadow-sm text-left">
                  <p className="text-[#45474c] text-[10px] font-bold uppercase tracking-widest font-mono">Subprime Risk (&lt; 650)</p>
                  <h3 className="font-headline text-xl font-black text-red-600 mt-1.5">
                    {creditMetrics.subprimeCount} Customers
                  </h3>
                  <span className="text-[10px] text-red-600 font-bold block mt-2">{creditMetrics.riskSubPrimePct}% - Monitor Required</span>
                </div>
              </div>

              {/* Credit details split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
                {/* SVG Visual Credit Risk Profile Bar chart */}
                <div className="bg-white border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-sm lg:col-span-8 text-left space-y-4">
                  <h4 className="font-headline text-sm font-bold text-[#091426] border-b border-[#cbd5e1]/20 pb-3">Borrower Risk Categorization Breakdown</h4>
                  
                  <div className="space-y-5 pt-3">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-[#28a094]">Prime / Low Risk (Credit Score &gt; 750)</span>
                        <span>{creditMetrics.primeCount} Accounts ({creditMetrics.riskPrimePct}%)</span>
                      </div>
                      <div className="w-full bg-[#eceef0] h-3.5 rounded-full overflow-hidden">
                        <div className="bg-[#28a094] h-full rounded-full transition-all duration-500" style={{ width: `${creditMetrics.riskPrimePct}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-amber-600">Medium Risk (Credit Score 650 - 749)</span>
                        <span>{creditMetrics.mediumCount} Accounts ({creditMetrics.riskMediumPct}%)</span>
                      </div>
                      <div className="w-full bg-[#eceef0] h-3.5 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${creditMetrics.riskMediumPct}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-red-600">Subprime / High Risk (Credit Score &lt; 650)</span>
                        <span>{creditMetrics.subprimeCount} Accounts ({creditMetrics.riskSubPrimePct}%)</span>
                      </div>
                      <div className="w-full bg-[#eceef0] h-3.5 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full rounded-full transition-all duration-500" style={{ width: `${creditMetrics.riskSubPrimePct}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audit notes on credit compliance */}
                <div className="bg-white border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-sm lg:col-span-4 text-left space-y-4">
                  <h4 className="font-headline text-sm font-bold text-[#091426] border-b border-[#cbd5e1]/20 pb-3">Compliance Audits</h4>
                  <div className="flex items-start gap-2.5 p-3 bg-blue-50 border border-blue-100 rounded-xl text-[10.5px] text-blue-800 leading-relaxed font-semibold">
                    <Info className="w-4.5 h-4.5 text-blue-600 flex-shrink-0" />
                    <span>Risk scores are audited in real time referencing CRIF High Mark credit pools during client onboarding cycles.</span>
                  </div>

                  <div className="text-xs text-[#45474c] space-y-2 font-medium">
                    <p>• Prime borrowers qualify for interest rate discounts down to 4.5% annual rate.</p>
                    <p>• High-risk accounts require mandatory down-payments of at least 25% purchase valuation.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
