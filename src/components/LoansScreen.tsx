/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Car, 
  DollarSign, 
  FileText, 
  Trash2, 
  Upload, 
  ShieldCheck, 
  Sparkles,
  Calculator,
  Grid,
  CheckCircle,
  TrendingUp,
  FileCheck2,
  X,
  IndianRupee,
  Plus
} from 'lucide-react';
import { Vehicle, Customer, Loan, Transaction } from '../types';

interface LoansScreenProps {
  vehicles: Vehicle[];
  customers: Customer[];
  loans: Loan[];
  onAddLoan: (loan: Loan) => void;
  onAddTransaction?: (txn: Transaction) => void;
  onUpdateLoan?: (loan: Loan) => void;
  onAddVehicle: (vehicle: Vehicle) => void;
}

export default function LoansScreen({ 
  vehicles, 
  customers, 
  loans, 
  onAddLoan,
  onAddTransaction,
  onUpdateLoan,
  onAddVehicle
}: LoansScreenProps) {
  // Navigation sub-tab state: 'apply' (Standard), 'rc-pledge', 'directory'
  const [subTab, setSubTab] = useState<'apply' | 'rc-pledge' | 'directory'>('apply');

  // ==================== STANDARD LOAN STATE ====================
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[1]?.id || 'CUST-002');
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || 'VEH-001');
  const [salePrice, setSalePrice] = useState(45000);
  const [downPayment, setDownPayment] = useState(5000);
  const [tenure, setTenure] = useState(36);
  const [interestRate, setInterestRate] = useState(4.5);
  const [docFee, setDocFee] = useState(250);
  const [dueDate, setDueDate] = useState('2023-11-01');
  const [interestType, setInterestType] = useState<'reducing' | 'flat'>('reducing');
  const [activeStep, setActiveStep] = useState(1);
  const loanRegId = 'LN-2023-8842';
  const pledgedLoanRegId = 'LN-2023-9014';

  const currentCustomer = useMemo(() => {
    return customers.find(c => c.id === selectedCustomerId) || customers[0];
  }, [selectedCustomerId, customers]);

  const currentVehicle = useMemo(() => {
    return vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];
  }, [selectedVehicleId, vehicles]);

  useEffect(() => {
    if (currentVehicle) {
      setSalePrice(currentVehicle.salePrice);
    }
  }, [currentVehicle]);

  const loanAmount = useMemo(() => {
    return Math.max(0, salePrice - downPayment);
  }, [salePrice, downPayment]);

  const calculatedEmi = useMemo(() => {
    const P = loanAmount;
    const n = tenure;
    if (P <= 0 || n <= 0) return 0;

    if (interestType === 'flat') {
      // Flat Interest Math
      const annualRate = interestRate / 100;
      const totalInt = P * annualRate * (n / 12);
      const totalPayableVal = P + totalInt;
      return Number((totalPayableVal / n).toFixed(2));
    } else {
      // Reducing Balance Math
      const r = interestRate / 12 / 100;
      if (r === 0) return P / n;
      const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      return Number(emi.toFixed(2));
    }
  }, [loanAmount, interestRate, tenure, interestType]);

  const totalPayable = useMemo(() => {
    return Number((calculatedEmi * tenure).toFixed(2));
  }, [calculatedEmi, tenure]);

  const totalInterest = useMemo(() => {
    return Number(Math.max(0, totalPayable - loanAmount).toFixed(2));
  }, [totalPayable, loanAmount]);

  const amortizationSchedule = useMemo(() => {
    const list = [];
    let balance = loanAmount;
    const n = tenure;
    const emi = calculatedEmi;

    if (interestType === 'flat') {
      // Flat Schedule
      const annualRate = interestRate / 100;
      const totalInt = loanAmount * annualRate * (n / 12);
      const monthlyInt = Number((totalInt / n).toFixed(2));
      const monthlyPrinc = Number((loanAmount / n).toFixed(2));

      for (let i = 1; i <= Math.min(4, n); i++) {
        balance = Number((balance - monthlyPrinc).toFixed(2));
        list.push({
          num: i,
          principal: monthlyPrinc,
          interest: monthlyInt,
          balance: Math.max(0, balance)
        });
      }
    } else {
      // Reducing Schedule
      const r = interestRate / 12 / 100;
      for (let i = 1; i <= Math.min(4, n); i++) {
        const interestPayment = Number((balance * r).toFixed(2));
        const principalPayment = Number((emi - interestPayment).toFixed(2));
        balance = Number((balance - principalPayment).toFixed(2));
        list.push({
          num: i,
          principal: Math.max(0, principalPayment),
          interest: Math.max(0, interestPayment),
          balance: Math.max(0, balance)
        });
      }
    }
    return list;
  }, [loanAmount, interestRate, tenure, calculatedEmi, interestType]);

  const handleProceedVerification = () => {
    if (!selectedCustomerId || !selectedVehicleId) {
      alert("Please select both a valid customer and vehicle to create a financing context.");
      return;
    }

    const typeSuffix = interestType === 'flat' ? 'Flat' : 'Reducing';
    const newLoan: Loan = {
      id: `LN-2023-${Math.floor(1000 + Math.random() * 90002)}`,
      customerId: selectedCustomerId,
      customerName: currentCustomer?.fullName || 'John Doe',
      vehicleId: selectedVehicleId,
      vehicleName: currentVehicle 
        ? `${currentVehicle.year} ${currentVehicle.make} ${currentVehicle.model} (${typeSuffix})` 
        : `Generic Active Asset (${typeSuffix})`,
      salePrice,
      downPayment,
      loanAmount,
      tenureMonths: tenure,
      interestRate,
      docFee,
      dueStartDate: dueDate,
      emiCalculated: calculatedEmi,
      status: 'Active',
      creditScore: currentCustomer?.crifScore || 742,
      riskCategory: currentCustomer?.category || 'Prime / Low Risk',
      defaultInstances: 0,
      employmentLength: '4.5 Years',
      dtiRatio: '18.4%'
    };

    onAddLoan(newLoan);
    setSubTab('directory');
  };

  // ==================== RC-PLEDGE LOAN STATE & LOGIC ====================
  const [pledgedCustomerId, setPledgedCustomerId] = useState(customers[0]?.id || '');
  const [pledgedMake, setPledgedMake] = useState('');
  const [pledgedModel, setPledgedModel] = useState('');
  const [pledgedYear, setPledgedYear] = useState<number | ''>('');
  const [pledgedRegNo, setPledgedRegNo] = useState('');
  const [pledgedVin, setPledgedVin] = useState('');
  const [pledgedEngineNo, setPledgedEngineNo] = useState('');
  const [pledgedFuelType, setPledgedFuelType] = useState<'Petrol' | 'Diesel' | 'Electric (EV)' | 'Hybrid'>('Petrol');
  const [pledgedValuation, setPledgedValuation] = useState<number | ''>('');
  
  const [pledgedDownPayment, setPledgedDownPayment] = useState<number | ''>('');
  const [pledgedTenure, setPledgedTenure] = useState(36);
  const [pledgedInterestRate, setPledgedInterestRate] = useState(12.0);
  const [pledgedDocFee, setPledgedDocFee] = useState<number | ''>(250);
  const [pledgedDueDate, setPledgedDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [pledgedInterestType, setPledgedInterestType] = useState<'reducing' | 'flat'>('reducing');

  const currentPledgedCustomer = useMemo(() => {
    return customers.find(c => c.id === pledgedCustomerId) || customers[0];
  }, [pledgedCustomerId, customers]);

  const pledgedLoanAmount = useMemo(() => {
    const valuation = Number(pledgedValuation) || 0;
    const down = Number(pledgedDownPayment) || 0;
    return Math.max(0, valuation - down);
  }, [pledgedValuation, pledgedDownPayment]);

  const calculatedPledgedEmi = useMemo(() => {
    const P = pledgedLoanAmount;
    const n = pledgedTenure;
    if (P <= 0 || n <= 0) return 0;

    if (pledgedInterestType === 'flat') {
      // Flat Interest Math
      const annualRate = pledgedInterestRate / 100;
      const totalInt = P * annualRate * (n / 12);
      const totalPayableVal = P + totalInt;
      return Number((totalPayableVal / n).toFixed(2));
    } else {
      // Reducing Balance Math
      const r = pledgedInterestRate / 12 / 100;
      if (r === 0) return P / n;
      const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      return Number(emi.toFixed(2));
    }
  }, [pledgedLoanAmount, pledgedInterestRate, pledgedTenure, pledgedInterestType]);

  const pledgedTotalPayable = useMemo(() => {
    return Number((calculatedPledgedEmi * pledgedTenure).toFixed(2));
  }, [calculatedPledgedEmi, pledgedTenure]);

  const pledgedTotalInterest = useMemo(() => {
    return Number(Math.max(0, pledgedTotalPayable - pledgedLoanAmount).toFixed(2));
  }, [pledgedTotalPayable, pledgedLoanAmount]);

  const pledgedAmortizationSchedule = useMemo(() => {
    const list = [];
    let balance = pledgedLoanAmount;
    const n = pledgedTenure;
    const emi = calculatedPledgedEmi;

    if (pledgedInterestType === 'flat') {
      // Flat Schedule
      const annualRate = pledgedInterestRate / 100;
      const totalInt = pledgedLoanAmount * annualRate * (n / 12);
      const monthlyInt = Number((totalInt / n).toFixed(2));
      const monthlyPrinc = Number((pledgedLoanAmount / n).toFixed(2));

      for (let i = 1; i <= Math.min(4, n); i++) {
        balance = Number((balance - monthlyPrinc).toFixed(2));
        list.push({
          num: i,
          principal: monthlyPrinc,
          interest: monthlyInt,
          balance: Math.max(0, balance)
        });
      }
    } else {
      // Reducing Schedule
      const r = pledgedInterestRate / 12 / 100;
      for (let i = 1; i <= Math.min(4, n); i++) {
        const interestPayment = Number((balance * r).toFixed(2));
        const principalPayment = Number((emi - interestPayment).toFixed(2));
        balance = Number((balance - principalPayment).toFixed(2));
        list.push({
          num: i,
          principal: Math.max(0, principalPayment),
          interest: Math.max(0, interestPayment),
          balance: Math.max(0, balance)
        });
      }
    }
    return list;
  }, [pledgedLoanAmount, pledgedInterestRate, pledgedTenure, calculatedPledgedEmi, pledgedInterestType]);

  const handleFinalizeRcPledge = () => {
    if (!pledgedCustomerId) {
      alert("Please select a borrower customer.");
      return;
    }
    if (!pledgedMake.trim() || !pledgedModel.trim()) {
      alert("Please enter both Make and Model for the pledged vehicle.");
      return;
    }
    if (!pledgedRegNo.trim() || !pledgedVin.trim()) {
      alert("Please enter the Registration Number and VIN/Chassis Number.");
      return;
    }
    if (pledgedValuation === '' || Number(pledgedValuation) <= 0) {
      alert("Please enter a valid estimated valuation.");
      return;
    }

    const matchedCustomer = customers.find(c => c.id === pledgedCustomerId);
    if (!matchedCustomer) {
      alert("Invalid customer selected.");
      return;
    }

    const valuationPrice = Number(pledgedValuation);
    const downPay = Number(pledgedDownPayment) || 0;
    const loanAmt = Math.max(0, valuationPrice - downPay);
    
    // Calculate EMI locally for final verification
    const r = pledgedInterestRate / 12 / 100;
    const n = pledgedTenure;
    let emiVal = 0;
    if (loanAmt > 0 && n > 0) {
      if (r === 0) emiVal = loanAmt / n;
      else emiVal = (loanAmt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
    const finalEmi = Number(emiVal.toFixed(2));

    // 1. Create and register the new pledged vehicle in database
    const pledgeVehicleId = `VEH-P-${Math.floor(100 + Math.random() * 900)}`;
    const newPledgedVehicle: Vehicle = {
      id: pledgeVehicleId,
      make: pledgedMake.trim(),
      model: pledgedModel.trim(),
      year: Number(pledgedYear) || new Date().getFullYear(),
      registrationNo: pledgedRegNo.trim().toUpperCase(),
      vin: pledgedVin.trim().toUpperCase(),
      engineNo: pledgedEngineNo.trim().toUpperCase(),
      fuelType: pledgedFuelType,
      purchasePrice: 0, // Customer owned
      salePrice: valuationPrice,
      purchaseDate: pledgedDueDate,
      fundingAccount: 'N/A (Pledge Asset)',
      sellerDetails: `${matchedCustomer.fullName} (ID: ${matchedCustomer.id})`,
      rcReceived: true, // Pledged RC book is received!
      activeInsurance: true,
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      status: 'Completed'
    };

    onAddVehicle(newPledgedVehicle);

    // 2. Create the loan record referencing the pledged vehicle
    const typeSuffix = pledgedInterestType === 'flat' ? 'Flat' : 'Reducing';
    const pledgeLoanId = `LN-P-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPledgeLoan: Loan = {
      id: pledgeLoanId,
      customerId: pledgedCustomerId,
      customerName: matchedCustomer.fullName,
      vehicleId: pledgeVehicleId,
      vehicleName: `[PLEDGE] ${newPledgedVehicle.year} ${newPledgedVehicle.make} ${newPledgedVehicle.model} (${typeSuffix})`,
      salePrice: valuationPrice,
      downPayment: downPay,
      loanAmount: loanAmt,
      tenureMonths: pledgedTenure,
      interestRate: pledgedInterestRate,
      docFee: Number(pledgedDocFee) || 0,
      dueStartDate: pledgedDueDate,
      emiCalculated: finalEmi,
      status: 'Active',
      creditScore: matchedCustomer.crifScore || 742,
      riskCategory: matchedCustomer.category || 'Prime / Low Risk',
      defaultInstances: 0,
      employmentLength: 'Pledgor',
      dtiRatio: '18.4%'
    };

    onAddLoan(newPledgeLoan);

    // 3. Clear RC pledge form states
    setPledgedMake('');
    setPledgedModel('');
    setPledgedYear('');
    setPledgedRegNo('');
    setPledgedVin('');
    setPledgedEngineNo('');
    setPledgedFuelType('Petrol');
    setPledgedValuation('');
    setPledgedDownPayment('');
    setPledgedTenure(36);
    setPledgedInterestRate(12);
    setPledgedDocFee(250);
    setPledgedDueDate(new Date().toISOString().split('T')[0]);
    setPledgedInterestType('reducing');

    alert(`Successfully registered RC-Pledge Loan ${pledgeLoanId} for ${matchedCustomer.fullName}! Pledged asset registered as ${newPledgedVehicle.make} ${newPledgedVehicle.model}.`);
    setSubTab('directory');
  };

  // ==================== PAY EMI REPAYMENT STATE & LOGIC ====================
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedLoanForPayment, setSelectedLoanForPayment] = useState<Loan | null>(null);
  const [paymentAccount, setPaymentAccount] = useState('Main Operating Account (...4492)');
  const [paymentAmount, setPaymentAmount] = useState<number | ''>('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  const handleOpenPayModal = (loan: Loan) => {
    setSelectedLoanForPayment(loan);
    setPaymentAmount(loan.emiCalculated);
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setIsPayModalOpen(true);
  };

  const handleConfirmPayment = () => {
    if (!selectedLoanForPayment) return;
    if (paymentAmount === '' || Number(paymentAmount) <= 0) {
      alert("Please enter a valid repayment amount.");
      return;
    }
    if (!onAddTransaction) {
      alert("Transaction logger is not configured.");
      return;
    }

    // 1. Log repayment transaction
    const paymentTxn: Transaction = {
      id: `#TXN-${Math.floor(86000 + Math.random() * 9000)}`,
      customer: selectedLoanForPayment.customerName,
      vehicle: `[EMI] ${selectedLoanForPayment.vehicleName} (ID: ${selectedLoanForPayment.id})`,
      amount: Number(paymentAmount),
      status: 'Success',
      date: paymentDate
    };

    onAddTransaction(paymentTxn);

    // 2. Decrement Defaults in Loan Record if applicable
    if (onUpdateLoan) {
      const updatedLoan: Loan = {
        ...selectedLoanForPayment,
        defaultInstances: Math.max(0, selectedLoanForPayment.defaultInstances - 1)
      };
      onUpdateLoan(updatedLoan);
    }

    setIsPayModalOpen(false);
    setSelectedLoanForPayment(null);
    alert(`EMI Payment of ₹${Number(paymentAmount).toLocaleString('en-IN')} successfully processed and recorded!`);
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
            {subTab === 'apply' ? 'Sale & Loan' : subTab === 'rc-pledge' ? 'RC-Pledge Financing' : 'Active Loans Directory'}
          </h2>
          <p className="font-sans text-sm text-[#45474c] mt-1.5 font-medium max-w-xl">
            {subTab === 'apply' 
              ? 'Fill in the details to initiate a new financing request for auto asset procurement.'
              : subTab === 'rc-pledge'
              ? 'Create a loan context by pledging a customer vehicle RC book (no inventory required).'
              : 'Review and manage borrower credit loans, print audits, or record EMI repayments.'}
          </p>
        </div>

        {/* Right side container to prevent layout shift */}
        <div className="flex items-center gap-4 flex-shrink-0 self-end lg:self-center">
          {/* 3-Tab switcher buttons */}
          <div className="flex bg-[#eceef0] p-1.5 rounded-2xl gap-1.5 shadow-inner flex-shrink-0">
            <button
              onClick={() => setSubTab('apply')}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer border-none flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
                subTab === 'apply'
                  ? 'bg-white text-[#645efb] shadow-md'
                  : 'text-[#45474c] hover:text-[#091426] bg-transparent'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Sale & Loan</span>
            </button>
            <button
              onClick={() => setSubTab('rc-pledge')}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer border-none flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
                subTab === 'rc-pledge'
                  ? 'bg-white text-[#645efb] shadow-md'
                  : 'text-[#45474c] hover:text-[#091426] bg-transparent'
              }`}
            >
              <FileText className="w-3.5 h-3.5 flex-shrink-0" />
              <span>RC-Pledge Loan</span>
            </button>
            <button
              onClick={() => setSubTab('directory')}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer border-none flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
                subTab === 'directory'
                  ? 'bg-white text-[#645efb] shadow-md'
                  : 'text-[#45474c] hover:text-[#091426] bg-transparent'
              }`}
            >
              <Grid className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Active Directory</span>
            </button>
          </div>

          {/* Application ID Card */}
          <div className={`bg-white border border-[#cbd5e1] rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4 transition-all duration-200 flex-shrink-0 ${
            subTab !== 'directory' ? 'opacity-100' : 'opacity-0 pointer-events-none select-none'
          }`}>
            <span className="font-sans text-xs font-semibold text-[#45474c]">Application ID:</span>
            <span className="font-sans text-xs font-black text-[#645efb]">
              {subTab === 'apply' ? loanRegId : pledgedLoanRegId}
            </span>
          </div>
        </div>
      </div>

      {subTab === 'apply' && (
        // ==================== 1. STANDARD LOAN APPLICATION FORM ====================
        <>
          {/* Structured Progress Flow Steps */}
          <div className="mb-8 px-4 max-w-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  activeStep >= 1 ? 'bg-[#645efb] text-white shadow-md' : 'border-2 border-[#cbd5e1]'
                }`}>
                  1
                </div>
                <span className={`font-sans text-xs font-bold ${activeStep >= 1 ? 'text-[#645efb]' : 'text-[#45474c]'}`}>Loan Details</span>
              </div>
              <div className={`flex-1 h-0.5 mx-4 ${activeStep >= 2 ? 'bg-[#645efb]' : 'bg-[#cbd5e1]/40'}`} />
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  activeStep >= 2 ? 'bg-[#645efb] text-white' : 'border-2 border-[#cbd5e1] text-[#45474c]'
                }`}>
                  2
                </div>
                <span className={`font-sans text-xs font-bold ${activeStep >= 2 ? 'text-[#645efb]' : 'text-[#45474c]'}`}>Documents</span>
              </div>
              <div className={`flex-1 h-0.5 mx-4 ${activeStep >= 3 ? 'bg-[#645efb]' : 'bg-[#cbd5e1]/40'}`} />
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  activeStep >= 3 ? 'bg-[#645efb] text-white' : 'border-2 border-[#cbd5e1] text-[#45474c]'
                }`}>
                  3
                </div>
                <span className={`font-sans text-xs font-bold ${activeStep >= 3 ? 'text-[#645efb]' : 'text-[#45474c]'}`}>Review</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
            {/* Left column */}
            <div className="lg:col-span-8 space-y-7 text-left">
              {/* Entity selections */}
              <div className="bg-white border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2.5 mb-5 border-b border-[#cbd5e1]/20 pb-3">
                  <Users className="w-5 h-5 text-[#645efb]" />
                  <h3 className="font-headline text-md font-bold text-[#091426]">Entity Selection Context</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Select Existing Borrower</label>
                    <select
                      value={selectedCustomerId}
                      onChange={(e) => setSelectedCustomerId(e.target.value)}
                      className="w-full bg-white border border-[#cbd5e1] rounded-xl p-3 font-sans text-xs font-semibold text-[#191c1e] outline-none focus:ring-2 focus:ring-[#645efb]"
                    >
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.fullName} - (ID: {c.id.split('-')[1]}) - Credit: {c.crifScore}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Select Fleet Vehicle Asset</label>
                    <select
                      value={selectedVehicleId}
                      onChange={(e) => setSelectedVehicleId(e.target.value)}
                      className="w-full bg-white border border-[#cbd5e1] rounded-xl p-3 font-sans text-xs font-semibold text-[#191c1e] outline-none focus:ring-2 focus:ring-[#645efb]"
                    >
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.year} {v.make} {v.model} - [VIN: {v.vin.substring(0, 7)}...] ({v.salePrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits:0 })})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Financial Terms */}
              <div className="bg-white border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2.5 mb-5 border-b border-[#cbd5e1]/20 pb-3">
                  <Calculator className="w-5 h-5 text-[#645efb]" />
                  <h3 className="font-headline text-md font-bold text-[#091426]">Financial Terms &amp; Amortization Parameter</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Estimated Sale Price (₹)</label>
                    <input
                      type="number"
                      value={salePrice}
                      onChange={(e) => setSalePrice(Number(e.target.value))}
                      className="w-full border border-[#cbd5e1] rounded-xl p-3 font-sans font-semibold text-xs text-[#091426] focus:ring-2 focus:ring-[#645efb] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Required Down Payment (₹)</label>
                    <input
                      type="number"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      className="w-full border border-[#cbd5e1] rounded-xl p-3 font-sans font-semibold text-xs text-[#091426] focus:ring-2 focus:ring-[#645efb] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-[#45474c] font-bold uppercase tracking-wider">Principled Loan Amount (₹)</label>
                    <input
                      type="number"
                      value={loanAmount}
                      readOnly
                      className="w-full bg-[#eceef0] border border-[#cbd5e1]/60 rounded-xl p-3 font-sans font-extrabold text-xs text-[#45474c] cursor-not-allowed outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Active tenure (Months)</label>
                    <select
                      value={tenure}
                      onChange={(e) => setTenure(Number(e.target.value))}
                      className="w-full bg-white border border-[#cbd5e1] rounded-xl p-3 font-sans text-xs font-semibold text-[#191c1e] focus:ring-2 focus:ring-[#645efb] outline-none"
                    >
                      <option value={12}>12 Months</option>
                      <option value={24}>24 Months</option>
                      <option value={36}>36 Months</option>
                      <option value={48}>48 Months</option>
                      <option value={60}>60 Months</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Interest Rate (Annual %)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full border border-[#cbd5e1] rounded-xl p-3 font-sans font-semibold text-xs text-[#091426] focus:ring-2 focus:ring-[#645efb] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Document flat fee (₹)</label>
                    <input
                      type="number"
                      value={docFee}
                      onChange={(e) => setDocFee(Number(e.target.value))}
                      className="w-full border border-[#cbd5e1] rounded-xl p-3 font-sans font-semibold text-xs text-[#091426] focus:ring-2 focus:ring-[#645efb] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Due Commencement Date</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full border border-[#cbd5e1] rounded-xl p-3 font-sans text-xs font-semibold text-[#191c1e] focus:ring-2 focus:ring-[#645efb] outline-none"
                    />
                  </div>

                  {/* Dynamic EMI calculation type radio buttons */}
                  <div className="space-y-1.5 text-left flex flex-col justify-center">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">EMI Calculation Type</label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-[#191c1e]">
                        <input
                          type="radio"
                          name="interestType"
                          value="flat"
                          checked={interestType === 'flat'}
                          onChange={() => setInterestType('flat')}
                          className="w-4 h-4 text-[#645efb] border-[#cbd5e1] focus:ring-[#645efb]"
                        />
                        <span>Flat Interest</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-[#191c1e]">
                        <input
                          type="radio"
                          name="interestType"
                          value="reducing"
                          checked={interestType === 'reducing'}
                          onChange={() => setInterestType('reducing')}
                          className="w-4 h-4 text-[#645efb] border-[#cbd5e1] focus:ring-[#645efb]"
                        />
                        <span>Reducing Balance</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1.5 md:col-span-1">
                    <label className="block text-xs font-bold text-[#645efb] uppercase tracking-wider animate-pulse">EMI Amount (Calculated Monthly)</label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={calculatedEmi.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                        className="w-full bg-[#645efb]/10 border-2 border-[#645efb] text-[#645efb] font-headline font-black text-sm rounded-xl pl-4 pr-11 py-2.5 outline-none"
                      />
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#645efb]">
                        <Sparkles className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Checklist */}
              <div className="bg-white border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-5 border-b border-[#cbd5e1]/20 pb-3">
                  <div className="flex items-center gap-2.5">
                    <FileCheck2 className="w-5 h-5 text-[#645efb]" />
                    <h3 className="font-headline text-md font-bold text-[#091426]">Pledge Verification documents</h3>
                  </div>
                  <span className="text-xs font-semibold text-[#45474c]">Status Check: Compliance Met</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-2 border-dashed border-[#cbd5e1] hover:border-[#645efb]/60 rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#f7f9fb] transition-all">
                    <Upload className="w-8 h-8 text-[#cbd5e1] transition-transform" />
                    <p className="font-sans text-xs font-bold text-[#091426] mt-2">Upload Pledge Document</p>
                    <p className="text-[10px] text-[#45474c] font-medium font-mono mt-0.5 uppercase">PDF, PNG or JPG max 10MB</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-[#f7f9fb] border border-[#cbd5e1]/50 rounded-xl">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle className="w-4 h-4 text-[#28a094]" />
                        <span className="font-sans text-xs font-semibold text-[#191c1e] truncate max-w-[170px]">Customer_ID_Verify.pdf</span>
                      </div>
                      <button className="text-[#ba1a1a] hover:bg-[#ffdad6] p-1 rounded transition-colors border-none bg-transparent cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-[#f7f9fb] border border-[#cbd5e1]/50 rounded-xl">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle className="w-4 h-4 text-[#28a094]" />
                        <span className="font-sans text-xs font-semibold text-[#191c1e] truncate max-w-[170px]">Proof_of_Income_2023.pdf</span>
                      </div>
                      <button className="text-[#ba1a1a] hover:bg-[#ffdad6] p-1 rounded transition-colors border-none bg-transparent cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-2">
                <button 
                  onClick={() => alert("Draft saved locally.")}
                  className="px-5 py-2.5 border border-[#cbd5e1] hover:bg-[#f2f4f6] font-sans text-xs font-semibold text-[#091426] rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Save as Draft
                </button>
                <button 
                  onClick={handleProceedVerification}
                  className="px-8 py-3 bg-[#645efb] hover:bg-[#4b41e1] text-white font-sans text-xs font-bold rounded-xl shadow-lg shadow-[#645efb]/20 hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  Proceed to Verification
                </button>
              </div>
            </div>

            {/* Right column */}
            <div className="lg:col-span-4 space-y-7">
              {/* Risk Indicator */}
              <div className="bg-white border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-sm text-left">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-headline text-xs font-bold uppercase tracking-wider text-[#091426]">Customer Risk indicator</h3>
                  <ShieldCheck className="w-5 h-5 text-[#645efb]" />
                </div>

                <div className="flex items-center gap-4.5 mb-6">
                  <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="40" cy="40" fill="transparent" r="32" stroke="#eceef0" strokeWidth="6" />
                      <circle 
                        cx="40" 
                        cy="40" 
                        fill="transparent" 
                        r="32" 
                        stroke="#28a094" 
                        strokeWidth="8" 
                        strokeDasharray="201" 
                        strokeDashoffset={201 - ((currentCustomer?.crifScore || 742) / 850) * 201}
                        className="transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-headline text-sm font-black text-[#091426]">{currentCustomer?.crifScore || 742}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-[9px] font-black uppercase text-[#45474c] tracking-widest leading-none">Credit Score Card</p>
                    <span className="inline-block mt-1.5 px-3 py-1 bg-[#89f5e7] text-[#005049] text-[10px] font-bold rounded-full uppercase leading-none">
                      LOw RiSK Compliant
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 border-t border-[#cbd5e1]/20 pt-4 font-sans text-xs font-semibold text-[#45474c]">
                  <div className="flex justify-between">
                    <span>Default Case History</span>
                    <span className="text-[#091426] font-bold">0 Instances</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Borrow Tenure</span>
                    <span className="text-[#091426] font-bold">4.5 Years Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Debt-To-Income (DTI) Out</span>
                    <span className="text-[#091426] font-bold">18.4%</span>
                  </div>
                </div>
              </div>

              {/* Payment Overview */}
              <div className="bg-[#645efb] text-white rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between text-left">
                <div className="relative z-10 space-y-5">
                  <div>
                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Monthly Loan EMI</p>
                    <h3 className="font-headline text-3xl font-black mt-1">
                      {calculatedEmi.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                    <div>
                      <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Total Payable</p>
                      <p className="font-headline text-md font-bold mt-0.5">
                        {totalPayable.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Total Interest Out</p>
                      <p className="font-headline text-md font-bold mt-0.5">
                        {totalInterest.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute right-[-10px] top-[-10px] opacity-10 text-white">
                  <Calculator className="w-28 h-28" />
                </div>
              </div>

              {/* Amortization Table */}
              <div className="bg-white border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4 border-b border-[#cbd5e1]/20 pb-2">
                  <h3 className="font-headline text-xs font-bold uppercase tracking-wider text-[#091426]">Amortization Table</h3>
                  <span className="text-[10px] font-bold text-[#645efb] uppercase">First 4 Months</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse font-sans text-xs">
                    <thead>
                      <tr className="text-left text-[#45474c] font-bold text-[10px] uppercase border-b border-[#cbd5e1]/30">
                        <th className="py-2">Pmt #</th>
                        <th className="py-2">Principal</th>
                        <th className="py-2">Interest</th>
                        <th className="py-2">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#cbd5e1]/10 text-[11px] font-medium text-[#191c1e]">
                      {amortizationSchedule.map((line, idx) => (
                        <tr key={idx} className="hover:bg-[#f7f9fb] transition-colors">
                          <td className="py-2 font-bold text-[#645efb]">{line.num}</td>
                          <td className="py-2 text-[#091426]">
                            {line.principal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                          </td>
                          <td className="py-2 text-[#45474c]">
                            {line.interest.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                          </td>
                          <td className="py-2 font-mono text-[#091426]">
                            {line.balance.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {subTab === 'rc-pledge' && (
        // ==================== 2. RC-PLEDGE LOAN APPLICATION FORM ====================
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
            {/* Left column */}
            <div className="lg:col-span-8 space-y-7 text-left">
              {/* Customer Selection */}
              <div className="bg-white border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2.5 mb-5 border-b border-[#cbd5e1]/20 pb-3">
                  <Users className="w-5 h-5 text-[#645efb]" />
                  <h3 className="font-headline text-md font-bold text-[#091426]">Pledge Borrower Context</h3>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Select Existing Borrower</label>
                  <select
                    value={pledgedCustomerId}
                    onChange={(e) => setPledgedCustomerId(e.target.value)}
                    className="w-full bg-white border border-[#cbd5e1] rounded-xl p-3 font-sans text-xs font-semibold text-[#191c1e] outline-none focus:ring-2 focus:ring-[#645efb]"
                  >
                    <option value="">-- Select Borrower Customer --</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.fullName} - (ID: {c.id.split('-')[1]}) - Credit Score: {c.crifScore}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pledged Vehicle Details */}
              <div className="bg-white border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2.5 mb-5 border-b border-[#cbd5e1]/20 pb-3">
                  <Car className="w-5 h-5 text-[#645efb]" />
                  <h3 className="font-headline text-md font-bold text-[#091426]">Pledged Vehicle Specifications</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Vehicle Make</label>
                    <input
                      type="text"
                      value={pledgedMake}
                      onChange={(e) => setPledgedMake(e.target.value)}
                      placeholder="e.g. Maruti, Honda"
                      className="w-full border border-[#cbd5e1] rounded-xl p-3 font-sans font-semibold text-xs text-[#091426] focus:ring-2 focus:ring-[#645efb] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Model Variant Name</label>
                    <input
                      type="text"
                      value={pledgedModel}
                      onChange={(e) => setPledgedModel(e.target.value)}
                      placeholder="e.g. Swift LXi, City VMT"
                      className="w-full border border-[#cbd5e1] rounded-xl p-3 font-sans font-semibold text-xs text-[#091426] focus:ring-2 focus:ring-[#645efb] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Mfg Year</label>
                      <input
                        type="number"
                        value={pledgedYear}
                        onChange={(e) => setPledgedYear(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="2019"
                        className="w-full border border-[#cbd5e1] rounded-xl p-3 font-sans font-semibold text-xs text-[#091426] focus:ring-2 focus:ring-[#645efb] outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Registration Number</label>
                      <input
                        type="text"
                        value={pledgedRegNo}
                        onChange={(e) => setPledgedRegNo(e.target.value)}
                        placeholder="MH-12-AB-1234"
                        className="w-full border border-[#cbd5e1] rounded-xl p-3 font-sans font-semibold text-xs text-[#091426] focus:ring-2 focus:ring-[#645efb] outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Chassis Code (VIN)</label>
                    <input
                      type="text"
                      value={pledgedVin}
                      onChange={(e) => setPledgedVin(e.target.value)}
                      placeholder="17-letter code"
                      className="w-full border border-[#cbd5e1] rounded-xl p-3 font-mono text-xs uppercase text-[#091426] focus:ring-2 focus:ring-[#645efb] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Engine Number</label>
                    <input
                      type="text"
                      value={pledgedEngineNo}
                      onChange={(e) => setPledgedEngineNo(e.target.value)}
                      placeholder="ENG-XXXXXXXX"
                      className="w-full border border-[#cbd5e1] rounded-xl p-3 font-sans font-semibold text-xs text-[#091426] focus:ring-2 focus:ring-[#645efb] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Fuel Type</label>
                    <select
                      value={pledgedFuelType}
                      onChange={(e) => setPledgedFuelType(e.target.value as any)}
                      className="w-full bg-white border border-[#cbd5e1] rounded-xl p-3 font-sans text-xs font-semibold text-[#191c1e] focus:ring-2 focus:ring-[#645efb] outline-none"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric (EV)">Electric (EV)</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Financial calculations */}
              <div className="bg-white border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2.5 mb-5 border-b border-[#cbd5e1]/20 pb-3">
                  <Calculator className="w-5 h-5 text-[#645efb]" />
                  <h3 className="font-headline text-md font-bold text-[#091426]">Pledge Loan terms</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Estimated Valuation (₹)</label>
                    <input
                      type="number"
                      value={pledgedValuation}
                      onChange={(e) => setPledgedValuation(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 500000"
                      className="w-full border border-[#cbd5e1] rounded-xl p-3 font-sans font-semibold text-xs text-[#091426] focus:ring-2 focus:ring-[#645efb] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Margin / Down Payment (₹)</label>
                    <input
                      type="number"
                      value={pledgedDownPayment}
                      onChange={(e) => setPledgedDownPayment(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 100000 (optional)"
                      className="w-full border border-[#cbd5e1] rounded-xl p-3 font-sans font-semibold text-xs text-[#091426] focus:ring-2 focus:ring-[#645efb] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Pledge Loan Amount (₹)</label>
                    <input
                      type="number"
                      value={pledgedLoanAmount}
                      readOnly
                      className="w-full bg-[#eceef0] border border-[#cbd5e1]/60 rounded-xl p-3 font-sans font-extrabold text-xs text-[#45474c] cursor-not-allowed outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Tenure (Months)</label>
                    <select
                      value={pledgedTenure}
                      onChange={(e) => setPledgedTenure(Number(e.target.value))}
                      className="w-full bg-white border border-[#cbd5e1] rounded-xl p-3 font-sans text-xs font-semibold text-[#191c1e] focus:ring-2 focus:ring-[#645efb] outline-none"
                    >
                      <option value={12}>12 Months</option>
                      <option value={24}>24 Months</option>
                      <option value={36}>36 Months</option>
                      <option value={48}>48 Months</option>
                      <option value={60}>60 Months</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Interest Rate (Annual %)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={pledgedInterestRate}
                      onChange={(e) => setPledgedInterestRate(Number(e.target.value))}
                      className="w-full border border-[#cbd5e1] rounded-xl p-3 font-sans font-semibold text-xs text-[#091426] focus:ring-2 focus:ring-[#645efb] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Document flat fee (₹)</label>
                    <input
                      type="number"
                      value={pledgedDocFee}
                      onChange={(e) => setPledgedDocFee(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full border border-[#cbd5e1] rounded-xl p-3 font-sans font-semibold text-xs text-[#091426] focus:ring-2 focus:ring-[#645efb] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Commencement Date</label>
                    <input
                      type="date"
                      value={pledgedDueDate}
                      onChange={(e) => setPledgedDueDate(e.target.value)}
                      className="w-full border border-[#cbd5e1] rounded-xl p-3 font-sans text-xs font-semibold text-[#191c1e] focus:ring-2 focus:ring-[#645efb] outline-none"
                    />
                  </div>

                  {/* Dynamic EMI calculation type radio buttons for Pledges */}
                  <div className="space-y-1.5 text-left flex flex-col justify-center">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">EMI Calculation Type</label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-[#191c1e]">
                        <input
                          type="radio"
                          name="pledgedInterestType"
                          value="flat"
                          checked={pledgedInterestType === 'flat'}
                          onChange={() => setPledgedInterestType('flat')}
                          className="w-4 h-4 text-[#645efb] border-[#cbd5e1] focus:ring-[#645efb]"
                        />
                        <span>Flat Interest</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-[#191c1e]">
                        <input
                          type="radio"
                          name="pledgedInterestType"
                          value="reducing"
                          checked={pledgedInterestType === 'reducing'}
                          onChange={() => setPledgedInterestType('reducing')}
                          className="w-4 h-4 text-[#645efb] border-[#cbd5e1] focus:ring-[#645efb]"
                        />
                        <span>Reducing Balance</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1.5 md:col-span-1">
                    <label className="block text-xs font-bold text-[#645efb] uppercase tracking-wider animate-pulse">Pledge EMI Amount (Calculated Monthly)</label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={calculatedPledgedEmi.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                        className="w-full bg-[#645efb]/10 border-2 border-[#645efb] text-[#645efb] font-headline font-black text-sm rounded-xl pl-4 pr-11 py-2.5 outline-none"
                      />
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#645efb]">
                        <Sparkles className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-2">
                <button 
                  onClick={() => alert("Draft saved locally.")}
                  className="px-5 py-2.5 border border-[#cbd5e1] hover:bg-[#f2f4f6] font-sans text-xs font-semibold text-[#091426] rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Discard Draft
                </button>
                <button 
                  onClick={handleFinalizeRcPledge}
                  className="px-8 py-3 bg-[#645efb] hover:bg-[#4b41e1] text-white font-sans text-xs font-bold rounded-xl shadow-lg shadow-[#645efb]/20 hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  Proceed &amp; Finalize Pledge
                </button>
              </div>
            </div>

            {/* Right column */}
            <div className="lg:col-span-4 space-y-7">
              {/* Risk Indicator */}
              <div className="bg-white border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-sm text-left">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-headline text-xs font-bold uppercase tracking-wider text-[#091426]">Customer Risk indicator</h3>
                  <ShieldCheck className="w-5 h-5 text-[#645efb]" />
                </div>

                <div className="flex items-center gap-4.5 mb-6">
                  <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="40" cy="40" fill="transparent" r="32" stroke="#eceef0" strokeWidth="6" />
                      <circle 
                        cx="40" 
                        cy="40" 
                        fill="transparent" 
                        r="32" 
                        stroke="#28a094" 
                        strokeWidth="8" 
                        strokeDasharray="201" 
                        strokeDashoffset={201 - ((currentPledgedCustomer?.crifScore || 742) / 850) * 201}
                        className="transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-headline text-sm font-black text-[#091426]">{currentPledgedCustomer?.crifScore || 742}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-[9px] font-black uppercase text-[#45474c] tracking-widest leading-none">Credit Score Card</p>
                    <span className="inline-block mt-1.5 px-3 py-1 bg-[#89f5e7] text-[#005049] text-[10px] font-bold rounded-full uppercase leading-none">
                      LOw RiSK Compliant
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 border-t border-[#cbd5e1]/20 pt-4 font-sans text-xs font-semibold text-[#45474c]">
                  <div className="flex justify-between">
                    <span>Default Case History</span>
                    <span className="text-[#091426] font-bold">0 Instances</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Borrow Tenure</span>
                    <span className="text-[#091426] font-bold">4.5 Years Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Debt-To-Income (DTI) Out</span>
                    <span className="text-[#091426] font-bold">18.4%</span>
                  </div>
                </div>
              </div>

              {/* Payment Overview */}
              <div className="bg-[#645efb] text-white rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between text-left">
                <div className="relative z-10 space-y-5">
                  <div>
                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Monthly Pledge EMI</p>
                    <h3 className="font-headline text-3xl font-black mt-1">
                      {calculatedPledgedEmi.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                    <div>
                      <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Total Payable</p>
                      <p className="font-headline text-md font-bold mt-0.5">
                        {pledgedTotalPayable.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Total Interest Out</p>
                      <p className="font-headline text-md font-bold mt-0.5">
                        {pledgedTotalInterest.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute right-[-10px] top-[-10px] opacity-10 text-white">
                  <Calculator className="w-28 h-28" />
                </div>
              </div>

              {/* Amortization Table */}
              <div className="bg-white border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4 border-b border-[#cbd5e1]/20 pb-2">
                  <h3 className="font-headline text-xs font-bold uppercase tracking-wider text-[#091426]">Amortization Table</h3>
                  <span className="text-[10px] font-bold text-[#645efb] uppercase">First 4 Months</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse font-sans text-xs">
                    <thead>
                      <tr className="text-left text-[#45474c] font-bold text-[10px] uppercase border-b border-[#cbd5e1]/30">
                        <th className="py-2">Pmt #</th>
                        <th className="py-2">Principal</th>
                        <th className="py-2">Interest</th>
                        <th className="py-2">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#cbd5e1]/10 text-[11px] font-medium text-[#191c1e]">
                      {pledgedAmortizationSchedule.map((line, idx) => (
                        <tr key={idx} className="hover:bg-[#f7f9fb] transition-colors">
                          <td className="py-2 font-bold text-[#645efb]">{line.num}</td>
                          <td className="py-2 text-[#091426]">
                            {line.principal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                          </td>
                          <td className="py-2 text-[#45474c]">
                            {line.interest.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                          </td>
                          <td className="py-2 font-mono text-[#091426]">
                            {line.balance.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {subTab === 'directory' && (
        // ==================== 3. ACTIVE LOANS DIRECTORY TAB ====================
        <div className="bg-white rounded-2xl border border-[#cbd5e1]/40 shadow-sm overflow-hidden text-left">
          <div className="p-5 border-b border-[#cbd5e1]/40 flex items-center justify-between">
            <h3 className="font-headline text-md font-bold text-[#091426]">Active Borrower Credit Directory</h3>
            <span className="font-sans text-xs text-[#45474c] font-semibold">{loans.length} Total active contracts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans text-xs">
              <thead className="bg-[#f2f4f6] text-[11px] uppercase tracking-wider text-[#45474c] font-bold border-b border-[#cbd5e1]/40">
                <tr>
                  <th className="px-6 py-3.5">Loan ID</th>
                  <th className="px-6 py-3.5">Borrower Customer</th>
                  <th className="px-6 py-3.5">Vehicle Fleet Asset</th>
                  <th className="px-6 py-3.5">Loan Amount</th>
                  <th className="px-6 py-3.5 text-center">Tenure</th>
                  <th className="px-6 py-3.5">EMI Amount</th>
                  <th className="px-6 py-3.5">Overdues (Defaults)</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#cbd5e1]/20">
                {loans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-[#f7f9fb] transition-colors">
                    <td className="px-6 py-4 font-bold text-[#645efb]">{loan.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#091426]">{loan.customerName}</div>
                      <div className="text-[10px] text-[#45474c] font-semibold">ID: {loan.customerId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#191c1e]">{loan.vehicleName}</div>
                      <div className="text-[10px] text-[#45474c] font-mono">ID: {loan.vehicleId}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#091426]">
                      {loan.loanAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-[#191c1e]">{loan.tenureMonths}m</td>
                    <td className="px-6 py-4 font-black text-[#091426]">
                      {loan.emiCalculated.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    </td>
                    <td className="px-6 py-4">
                      {loan.defaultInstances > 0 ? (
                        <span className="inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] animate-pulse">
                          {loan.defaultInstances} Overdue
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-semibold px-2.5 py-0.5 rounded-full bg-[#89f5e7] text-[#005049]">
                          Healthy
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide border ${
                        loan.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                        loan.status === 'Review' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                        'bg-slate-500/10 text-slate-600 border-slate-500/20'
                      }`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleOpenPayModal(loan)}
                        className="px-4 py-2 bg-[#645efb] hover:bg-[#4b41e1] text-white rounded-xl font-sans text-xs font-bold transition-all cursor-pointer border-none shadow-sm flex items-center gap-1.5"
                      >
                        <IndianRupee className="w-3.5 h-3.5" />
                        <span>Pay EMI</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {loans.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-10 text-center text-xs text-[#45474c] font-semibold">
                      No active loans found. Switch to the Sale & Loan tab to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EMI Repayment Overlay Modal */}
      <AnimatePresence>
        {isPayModalOpen && selectedLoanForPayment && (
          <>
            {/* Modal Mask */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsPayModalOpen(false);
                setSelectedLoanForPayment(null);
              }}
              className="fixed inset-0 bg-[#091426] z-50 cursor-pointer"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="fixed inset-0 m-auto max-w-md h-fit bg-white border border-[#cbd5e1] rounded-2xl p-6 shadow-2xl z-50 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-3 border-b border-[#cbd5e1]/40">
                <h3 className="font-headline text-md font-bold text-[#091426]">Repay Borrower EMI</h3>
                <button 
                  onClick={() => {
                    setIsPayModalOpen(false);
                    setSelectedLoanForPayment(null);
                  }}
                  className="w-8 h-8 rounded-full hover:bg-[#eceef0] flex items-center justify-center text-[#45474c] transition-colors cursor-pointer border-none bg-transparent"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form body */}
              <div className="space-y-4 mt-4 text-left">
                {/* Loan Info Summary Card */}
                <div className="p-3 bg-[#f7f9fb] border border-[#cbd5e1]/40 rounded-xl">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#45474c]">Active Loan Account</p>
                  <p className="font-sans text-xs font-black text-[#091426] mt-0.5">{selectedLoanForPayment.customerName} - {selectedLoanForPayment.id}</p>
                  <p className="text-[10px] text-[#45474c] font-semibold mt-1">Asset: {selectedLoanForPayment.vehicleName}</p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Debit Account Source</label>
                  <select
                    value={paymentAccount}
                    onChange={(e) => setPaymentAccount(e.target.value)}
                    className="w-full bg-white border border-[#cbd5e1] rounded-xl px-3 py-2.5 font-sans text-xs font-semibold outline-none focus:ring-2 focus:ring-[#645efb]"
                  >
                    <option>Main Operating Account (...4492)</option>
                    <option>Secondary Reserve (...1102)</option>
                    <option>Cash Petty Vault</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Repayment Amount (₹)</label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full border border-[#cbd5e1] rounded-xl px-3 py-2.5 font-sans font-bold text-xs text-[#091426] outline-none focus:ring-2 focus:ring-[#645efb]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Repayment Date</label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full border border-[#cbd5e1] rounded-xl px-3 py-2.5 font-sans text-xs font-semibold outline-none focus:ring-2 focus:ring-[#645efb]"
                  />
                </div>

                {/* Confirm Buttons */}
                <div className="flex gap-3 pt-4 border-t border-[#cbd5e1]/40 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPayModalOpen(false);
                      setSelectedLoanForPayment(null);
                    }}
                    className="px-4 py-2 bg-white hover:bg-[#eceef0] border border-[#cbd5e1] font-sans text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer text-[#45474c]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmPayment}
                    className="px-6 py-2 bg-[#645efb] hover:bg-[#4b41e1] text-white font-sans text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-[#645efb]/20 flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirm Receipt</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
