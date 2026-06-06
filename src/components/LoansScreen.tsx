/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
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
  FileCheck2
} from 'lucide-react';
import { Vehicle, Customer, Loan } from '../types';

interface LoansScreenProps {
  vehicles: Vehicle[];
  customers: Customer[];
  loans: Loan[];
  onAddLoan: (loan: Loan) => void;
}

export default function LoansScreen({ vehicles, customers, loans, onAddLoan }: LoansScreenProps) {
  // Input fields selectors
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[1]?.id || 'CUST-002');
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || 'VEH-001');

  // Term input values
  const [salePrice, setSalePrice] = useState(45000);
  const [downPayment, setDownPayment] = useState(5000);
  const [tenure, setTenure] = useState(36);
  const [interestRate, setInterestRate] = useState(4.5);
  const [docFee, setDocFee] = useState(250);
  const [dueDate, setDueDate] = useState('2023-11-01');

  // State for active progress step
  const [activeStep, setActiveStep] = useState(1);

  // Auto application ID
  const loanRegId = 'LN-2023-8842';

  // Dynamic values lookup
  const currentCustomer = useMemo(() => {
    return customers.find(c => c.id === selectedCustomerId) || customers[0];
  }, [selectedCustomerId, customers]);

  const currentVehicle = useMemo(() => {
    return vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];
  }, [selectedVehicleId, vehicles]);

  // Sync pricing automatically from selected vehicle if available
  useEffect(() => {
    if (currentVehicle) {
      setSalePrice(currentVehicle.salePrice);
    }
  }, [currentVehicle]);

  // Derived calculation: Loan Amount P
  const loanAmount = useMemo(() => {
    return Math.max(0, salePrice - downPayment);
  }, [salePrice, downPayment]);

  // Dynamic EMI Calculation
  const calculatedEmi = useMemo(() => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenure;
    if (P <= 0 || n <= 0) return 0;
    if (r === 0) return P / n;
    
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Number(emi.toFixed(2));
  }, [loanAmount, interestRate, tenure]);

  const totalPayable = useMemo(() => {
    return Number((calculatedEmi * tenure).toFixed(2));
  }, [calculatedEmi, tenure]);

  const totalInterest = useMemo(() => {
    return Number(Math.max(0, totalPayable - loanAmount).toFixed(2));
  }, [totalPayable, loanAmount]);

  // Amortization Schedule generator dynamically based on inputs!
  const amortizationSchedule = useMemo(() => {
    const list = [];
    let balance = loanAmount;
    const r = interestRate / 12 / 100;
    const emi = calculatedEmi;

    for (let i = 1; i <= Math.min(4, tenure); i++) {
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
    return list;
  }, [loanAmount, interestRate, tenure, calculatedEmi]);

  // Form submission handler
  const handleProceedVerification = () => {
    if (!selectedCustomerId || !selectedVehicleId) {
      alert("Please select both a valid customer and vehicle to create a financing context.");
      return;
    }

    const newLoan: Loan = {
      id: `LN-2023-${Math.floor(1000 + Math.random() * 90002)}`,
      customerId: selectedCustomerId,
      customerName: currentCustomer?.fullName || 'John Doe',
      vehicleId: selectedVehicleId,
      vehicleName: currentVehicle ? `${currentVehicle.year} ${currentVehicle.make} ${currentVehicle.model}` : 'Generic Active Asset',
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
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-8 select-none"
    >
      {/* Title block with unique Application ID */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="font-headline text-3xl font-extrabold text-[#091426] tracking-tight">Create New Loan Application</h2>
          <p className="font-sans text-sm text-[#45474c] mt-1.5 font-medium">Fill in the details to initiate a new financing request for auto asset procurement.</p>
        </div>
        <div className="bg-white border border-[#cbd5e1] rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4">
          <span className="font-sans text-xs font-semibold text-[#45474c]">Application Context ID:</span>
          <span className="font-sans text-xs font-black text-[#645efb]">{loanRegId}</span>
        </div>
      </div>

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

      {/* Main Structural Twin layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        
        {/* Left column: input forms and criteria */}
        <div className="lg:col-span-8 space-y-7">
          
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

          {/* Mathematical Financial Terms Calculator fields */}
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

              <div className="space-y-1.5 md:col-span-2">
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

          {/* Documents checklist upload area */}
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
                <Upload className="w-8 h-8 text-[#cbd5e1] group-hover:scale-105 transition-transform" />
                <p className="font-sans text-xs font-bold text-[#091426] mt-2">Upload Pledge Document</p>
                <p className="text-[10px] text-[#45474c] font-medium font-mono mt-0.5 uppercase">PDF, PNG or JPG max 10MB</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-[#f7f9fb] border border-[#cbd5e1]/50 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#28a094]" />
                    <span className="font-sans text-xs font-semibold text-[#191c1e] truncate max-w-[170px]">Customer_ID_Verify.pdf</span>
                  </div>
                  <button className="text-[#ba1a1a] hover:bg-[#ffdad6] p-1 rounded transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#f7f9fb] border border-[#cbd5e1]/50 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#28a094]" />
                    <span className="font-sans text-xs font-semibold text-[#191c1e] truncate max-w-[170px]">Proof_of_Income_2023.pdf</span>
                  </div>
                  <button className="text-[#ba1a1a] hover:bg-[#ffdad6] p-1 rounded transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action trigger triggers database entry! */}
          <div className="flex justify-end gap-3 mt-4 pt-2">
            <button 
              onClick={() => {
                setActiveStep(1);
                alert("Loan parameters archived to transient database cache!");
              }}
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

        {/* Right column: HUD gauges and amortization preview info */}
        <div className="lg:col-span-4 space-y-7">
          
          {/* Customer Risk Indicator card */}
          <div className="bg-white border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline text-xs font-bold uppercase tracking-wider text-[#091426]">Customer Risk indicator</h3>
              <ShieldCheck className="w-5 h-5 text-[#645efb]" />
            </div>

            <div className="flex items-center gap-4.5 mb-6">
              {/* Score visual */}
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
                    // maps risk classification score index out of 850
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

          {/* DYNAMIC Payment Overview calculator box */}
          <div className="bg-[#645efb] text-white rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
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

          {/* DYNAMIC Amortization Preview table */}
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
    </motion.div>
  );
}
