import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, 
  Users, 
  CreditCard, 
  Plus, 
  CheckCircle, 
  Calendar, 
  DollarSign, 
  AlertCircle, 
  Edit3, 
  Trash2, 
  Clock, 
  Coins, 
  X,
  PieChart,
  UserCheck
} from 'lucide-react';
import { Employee, OfficeExpense } from '../types';

interface OfficeScreenProps {
  employees: Employee[];
  officeExpenses: OfficeExpense[];
  onAddEmployee: (emp: Employee) => void;
  onUpdateEmployee: (emp: Employee) => void;
  onPayEmployee: (empId: string) => void;
  onAddExpense: (exp: OfficeExpense) => void;
  user: any;
}

type SubTab = 'employees' | 'payroll' | 'expenses';

export default function OfficeScreen({
  employees,
  officeExpenses,
  onAddEmployee,
  onUpdateEmployee,
  onPayEmployee,
  onAddExpense,
  user
}: OfficeScreenProps) {
  const [subTab, setSubTab] = useState<SubTab>('employees');
  
  // Modal states
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [selectedEmployeeForEdit, setSelectedEmployeeForEdit] = useState<Employee | null>(null);

  // Add/Edit Employee Form State
  const [empName, setEmpName] = useState('');
  const [empRole, setEmpRole] = useState('Loan Officer');
  const [empEmail, setEmpEmail] = useState('');
  const [empPhone, setEmpPhone] = useState('');
  const [empSalary, setEmpSalary] = useState<number | ''>('');
  const [empAllowances, setEmpAllowances] = useState<number | ''>('0');
  const [empDeductions, setEmpDeductions] = useState<number | ''>('0');
  const [empStatus, setEmpStatus] = useState<'Active' | 'Inactive'>('Active');

  // Add Expense Form State
  const [expCategory, setExpCategory] = useState<OfficeExpense['category']>('Rent');
  const [expDescription, setExpDescription] = useState('');
  const [expAmount, setExpAmount] = useState<number | ''>('');
  const [expMethod, setExpMethod] = useState<OfficeExpense['paymentMethod']>('Bank Transfer');
  const [expApprovedBy, setExpApprovedBy] = useState('');

  // Calculations for KPIs
  const totalEmployeesCount = employees.filter(e => e.status === 'Active').length;
  
  const monthlyPayrollTotal = useMemo(() => {
    return employees
      .filter(e => e.status === 'Active')
      .reduce((sum, e) => sum + (e.salary + e.allowances - e.deductions), 0);
  }, [employees]);

  const payrollProcessedCount = useMemo(() => {
    return employees.filter(e => e.status === 'Active' && e.payrollStatus === 'Paid').length;
  }, [employees]);

  const totalExpensesValue = useMemo(() => {
    return officeExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [officeExpenses]);

  // Expenses chart categorization logic
  const expenseChartData = useMemo(() => {
    const categories: OfficeExpense['category'][] = ['Rent', 'Utilities', 'Office Supplies', 'Marketing', 'Travel', 'Other'];
    return categories.map(cat => {
      const sum = officeExpenses
        .filter(e => e.category === cat)
        .reduce((s, e) => s + e.amount, 0);
      return { category: cat, amount: sum };
    });
  }, [officeExpenses]);

  // Helper currency formatter
  const formatCurrency = (val: number) => {
    return val.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    });
  };

  const handleOpenAddEmployee = () => {
    setSelectedEmployeeForEdit(null);
    setEmpName('');
    setEmpRole('Loan Officer');
    setEmpEmail('');
    setEmpPhone('');
    setEmpSalary('');
    setEmpAllowances('0');
    setEmpDeductions('0');
    setEmpStatus('Active');
    setIsEmployeeModalOpen(true);
  };

  const handleOpenEditEmployee = (emp: Employee) => {
    setSelectedEmployeeForEdit(emp);
    setEmpName(emp.fullName);
    setEmpRole(emp.role);
    setEmpEmail(emp.email);
    setEmpPhone(emp.phoneNumber);
    setEmpSalary(emp.salary);
    setEmpAllowances(emp.allowances);
    setEmpDeductions(emp.deductions);
    setEmpStatus(emp.status);
    setIsEmployeeModalOpen(true);
  };

  const handleSaveEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName.trim() || empSalary === '') {
      alert('Please fill in employee name and salary details.');
      return;
    }

    if (selectedEmployeeForEdit) {
      // Edit mode
      const updated: Employee = {
        ...selectedEmployeeForEdit,
        fullName: empName.trim(),
        role: empRole,
        email: empEmail.trim(),
        phoneNumber: empPhone.trim(),
        salary: Number(empSalary),
        allowances: Number(empAllowances || 0),
        deductions: Number(empDeductions || 0),
        status: empStatus
      };
      onUpdateEmployee(updated);
      alert(`Updated employee record for ${updated.fullName}.`);
    } else {
      // Add mode
      const newEmp: Employee = {
        id: `EMP-${Math.floor(100 + Math.random() * 900)}`,
        fullName: empName.trim(),
        role: empRole,
        email: empEmail.trim(),
        phoneNumber: empPhone.trim(),
        salary: Number(empSalary),
        allowances: Number(empAllowances || 0),
        deductions: Number(empDeductions || 0),
        dateJoined: new Date().toISOString().split('T')[0],
        status: 'Active',
        payrollStatus: 'Pending'
      };
      onAddEmployee(newEmp);
      alert(`Successfully registered employee: ${newEmp.fullName}.`);
    }
    setIsEmployeeModalOpen(false);
  };

  const handleOpenAddExpense = () => {
    setExpCategory('Utilities');
    setExpDescription('');
    setExpAmount('');
    setExpMethod('Bank Transfer');
    setExpApprovedBy(user?.fullName || '');
    setIsExpenseModalOpen(true);
  };

  const handleSaveExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expDescription.trim() || !expAmount || !expApprovedBy.trim()) {
      alert('Please fill in all details for the office expense.');
      return;
    }

    const newExpense: OfficeExpense = {
      id: `EXP-${Math.floor(100 + Math.random() * 900)}`,
      category: expCategory,
      description: expDescription.trim(),
      amount: Number(expAmount),
      date: new Date().toISOString().split('T')[0],
      paymentMethod: expMethod,
      approvedBy: expApprovedBy.trim()
    };

    onAddExpense(newExpense);
    setIsExpenseModalOpen(false);
    alert(`Office expense of ${formatCurrency(newExpense.amount)} successfully recorded under ${newExpense.category}.`);
  };

  const handlePayAllSalaries = () => {
    const pendingEmployees = employees.filter(e => e.status === 'Active' && e.payrollStatus === 'Pending');
    if (pendingEmployees.length === 0) {
      alert('All active employee salaries for this cycle are already processed!');
      return;
    }

    if (confirm(`Are you sure you want to process payroll for ${pendingEmployees.length} employees?`)) {
      pendingEmployees.forEach(e => {
        onPayEmployee(e.id);
      });
      alert(`Successfully disbursed monthly payroll of ${formatCurrency(pendingEmployees.reduce((sum, e) => sum + (e.salary + e.allowances - e.deductions), 0))}!`);
    }
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
            Office Management Hub
          </h2>
          <p className="font-sans text-sm text-[#45474c] mt-1.5 font-medium max-w-xl">
            Administer back-office human resources, organize payroll dispatches, and log office operating expenses.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {subTab === 'employees' && (
            <button
              onClick={handleOpenAddEmployee}
              className="px-5 py-2.5 bg-[#645efb] hover:bg-[#524be3] text-white font-sans text-xs font-bold rounded-xl flex items-center gap-2 shadow-md cursor-pointer border-none"
            >
              <Plus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
          )}
          {subTab === 'payroll' && (
            <button
              onClick={handlePayAllSalaries}
              className="px-5 py-2.5 bg-[#091426] hover:bg-[#1e293b] text-white font-sans text-xs font-bold rounded-xl flex items-center gap-2 shadow-md cursor-pointer border-none"
            >
              <Coins className="w-4 h-4" />
              <span>Process All Payroll</span>
            </button>
          )}
          {subTab === 'expenses' && (
            <button
              onClick={handleOpenAddExpense}
              className="px-5 py-2.5 bg-[#ba1a1a] hover:bg-[#a61717] text-white font-sans text-xs font-bold rounded-xl flex items-center gap-2 shadow-md cursor-pointer border-none"
            >
              <Plus className="w-4 h-4" />
              <span>Log Expense</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-[#eceef0] p-1.5 rounded-2xl gap-1.5 shadow-inner w-full md:w-max flex-shrink-0 text-left">
        <button
          onClick={() => setSubTab('employees')}
          className={`px-4.5 py-2.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer border-none flex items-center gap-2 whitespace-nowrap ${
            subTab === 'employees'
              ? 'bg-white text-[#645efb] shadow-md'
              : 'text-[#45474c] hover:text-[#091426] bg-transparent'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Employee Registry</span>
        </button>
        <button
          onClick={() => setSubTab('payroll')}
          className={`px-4.5 py-2.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer border-none flex items-center gap-2 whitespace-nowrap ${
            subTab === 'payroll'
              ? 'bg-white text-[#645efb] shadow-md'
              : 'text-[#45474c] hover:text-[#091426] bg-transparent'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Payroll Desk</span>
        </button>
        <button
          onClick={() => setSubTab('expenses')}
          className={`px-4.5 py-2.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer border-none flex items-center gap-2 whitespace-nowrap ${
            subTab === 'expenses'
              ? 'bg-white text-[#645efb] shadow-md'
              : 'text-[#45474c] hover:text-[#091426] bg-transparent'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Operating Expenses</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-sm flex flex-col justify-between text-left h-32">
          <div>
            <p className="text-[#45474c] text-[10px] font-bold uppercase tracking-widest">Active Staff Members</p>
            <h3 className="font-headline text-3xl font-black text-[#091426] mt-2">
              {totalEmployeesCount}
            </h3>
          </div>
          <span className="text-[10px] text-[#28a094] font-semibold flex items-center gap-1">
            <UserCheck className="w-3 h-3" />
            <span>FTE Operations Active</span>
          </span>
        </div>

        <div className="bg-white border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-sm flex flex-col justify-between text-left h-32">
          <div>
            <p className="text-[#45474c] text-[10px] font-bold uppercase tracking-widest">Monthly Payroll Load</p>
            <h3 className="font-headline text-3xl font-black text-[#645efb] mt-2">
              {formatCurrency(monthlyPayrollTotal)}
            </h3>
          </div>
          <span className="text-[10px] text-[#645efb] font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Processed: {payrollProcessedCount}/{totalEmployeesCount} Paid</span>
          </span>
        </div>

        <div className="bg-white border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-sm flex flex-col justify-between text-left h-32">
          <div>
            <p className="text-[#45474c] text-[10px] font-bold uppercase tracking-widest">Operating Expenses (MTD)</p>
            <h3 className="font-headline text-3xl font-black text-[#ba1a1a] mt-2">
              {formatCurrency(totalExpensesValue)}
            </h3>
          </div>
          <span className="text-[10px] text-[#ba1a1a] font-semibold flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>Operational Capital Deduct</span>
          </span>
        </div>
      </div>

      {/* Main Panel views */}
      <div>
        <AnimatePresence mode="wait">
          {subTab === 'employees' && (
            // ==================== SUBTAB: EMPLOYEES DIRECTORY ====================
            <motion.div
              key="employees"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-[#cbd5e1]/40 rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#cbd5e1]/30 text-[#45474c] uppercase font-bold text-[10px] tracking-wider bg-[#f7f9fb]">
                      <th className="py-4 px-6 rounded-l-2xl">Staff Name</th>
                      <th className="py-4 px-6">Official Role</th>
                      <th className="py-4 px-6">Contact Coordinates</th>
                      <th className="py-4 px-6 text-right">Base Salary</th>
                      <th className="py-4 px-6 text-right">Net Payable</th>
                      <th className="py-4 px-6">Date of Joining</th>
                      <th className="py-4 px-6 text-center">Status</th>
                      <th className="py-4 px-6 text-right rounded-r-2xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#cbd5e1]/20">
                    {employees.map((emp) => {
                      const netPay = emp.salary + emp.allowances - emp.deductions;
                      const activeStyle = emp.status === 'Active' 
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                        : 'bg-[#cbd5e1] text-[#45474c] border border-[#cbd5e1]/40';

                      return (
                        <tr key={emp.id} className="hover:bg-[#f7f9fb]/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-bold text-[#091426] text-[13px]">{emp.fullName}</div>
                            <div className="text-[9.5px] font-bold text-[#645efb] mt-0.5">{emp.id}</div>
                          </td>
                          <td className="py-4 px-6 font-semibold text-[#191c1e]">{emp.role}</td>
                          <td className="py-4 px-6">
                            <div className="font-medium text-[#091426]">{emp.email}</div>
                            <div className="text-[10px] text-[#45474c] mt-0.5">{emp.phoneNumber}</div>
                          </td>
                          <td className="py-4 px-6 text-right font-semibold text-[#45474c]">
                            {formatCurrency(emp.salary)}
                          </td>
                          <td className="py-4 px-6 text-right font-black text-[#091426]">
                            {formatCurrency(netPay)}
                          </td>
                          <td className="py-4 px-6 font-mono font-medium text-[#45474c]">{emp.dateJoined}</td>
                          <td className="py-4 px-6 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide ${activeStyle}`}>
                              {emp.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => handleOpenEditEmployee(emp)}
                              className="p-2 bg-[#f2f4f6] text-[#091426] hover:bg-[#eceef0] rounded-xl transition-all cursor-pointer border-none"
                              title="Edit Employee details"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {subTab === 'payroll' && (
            // ==================== SUBTAB: PAYROLL MANAGER ====================
            <motion.div
              key="payroll"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-[#cbd5e1]/40 rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#cbd5e1]/30 text-[#45474c] uppercase font-bold text-[10px] tracking-wider bg-[#f7f9fb]">
                      <th className="py-4 px-6 rounded-l-2xl">Employee</th>
                      <th className="py-4 px-6">Salary (₹)</th>
                      <th className="py-4 px-6">Allowances (₹)</th>
                      <th className="py-4 px-6">Deductions (₹)</th>
                      <th className="py-4 px-6 text-right">Net Salary (₹)</th>
                      <th className="py-4 px-6 text-center">Payroll Status</th>
                      <th className="py-4 px-6 text-right rounded-r-2xl">Disbursement Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#cbd5e1]/20">
                    {employees.filter(e => e.status === 'Active').map((emp) => {
                      const netPay = emp.salary + emp.allowances - emp.deductions;
                      const statusStyle = emp.payrollStatus === 'Paid'
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-700 border border-amber-200 animate-pulse';

                      return (
                        <tr key={emp.id} className="hover:bg-[#f7f9fb]/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-bold text-[#091426] text-[13px]">{emp.fullName}</div>
                            <div className="text-[10px] font-bold text-[#45474c] mt-0.5">{emp.role}</div>
                          </td>
                          <td className="py-4 px-6 font-semibold text-[#45474c]">{formatCurrency(emp.salary)}</td>
                          <td className="py-4 px-6 text-[#28a094] font-bold">+{formatCurrency(emp.allowances)}</td>
                          <td className="py-4 px-6 text-[#ba1a1a] font-bold">-{formatCurrency(emp.deductions)}</td>
                          <td className="py-4 px-6 text-right font-black text-[#091426]">{formatCurrency(netPay)}</td>
                          <td className="py-4 px-6 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide border ${statusStyle}`}>
                              {emp.payrollStatus}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            {emp.payrollStatus === 'Pending' ? (
                              <button
                                onClick={() => {
                                  if (confirm(`Confirm salary disbursement of ${formatCurrency(netPay)} to ${emp.fullName}?`)) {
                                    onPayEmployee(emp.id);
                                    alert(`Successfully paid salary to ${emp.fullName}.`);
                                  }
                                }}
                                className="px-3.5 py-2 bg-[#28a094] hover:bg-[#208479] text-white font-sans text-xs font-bold rounded-xl shadow-md transition-all active:scale-[0.98] border-none cursor-pointer"
                              >
                                Process Pay
                              </button>
                            ) : (
                              <span className="text-[10px] text-[#28a094] font-bold flex items-center gap-1 justify-end">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Reconciled</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {subTab === 'expenses' && (
            // ==================== SUBTAB: EXPENSE TRACKER ====================
            <motion.div
              key="expenses"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-7"
            >
              {/* Expense logs list */}
              <div className="bg-white border border-[#cbd5e1]/40 rounded-2xl shadow-sm overflow-hidden lg:col-span-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#cbd5e1]/30 text-[#45474c] uppercase font-bold text-[10px] tracking-wider bg-[#f7f9fb]">
                        <th className="py-4 px-6 rounded-l-2xl">Audit Date</th>
                        <th className="py-4 px-6">Expense Category</th>
                        <th className="py-4 px-6">Description Summary</th>
                        <th className="py-4 px-6 text-right">Valuation amount</th>
                        <th className="py-4 px-6">Payment parameters</th>
                        <th className="py-4 px-6 text-right rounded-r-2xl">Approved By</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#cbd5e1]/20">
                      {officeExpenses.map((exp) => {
                        const categoryColors = 
                          exp.category === 'Rent' ? 'bg-indigo-500/10 text-indigo-700 border-indigo-200' :
                          exp.category === 'Utilities' ? 'bg-blue-500/10 text-blue-700 border-blue-200' :
                          exp.category === 'Marketing' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-200' :
                          'bg-slate-500/10 text-slate-700 border-slate-200';

                        return (
                          <tr key={exp.id} className="hover:bg-[#f7f9fb]/50 transition-colors">
                            <td className="py-4 px-6 font-mono font-medium text-[#45474c]">{exp.date}</td>
                            <td className="py-4 px-6">
                              <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold border uppercase tracking-wide ${categoryColors}`}>
                                {exp.category}
                              </span>
                            </td>
                            <td className="py-4 px-6 font-semibold text-[#091426] text-[11.5px] max-w-[150px] truncate" title={exp.description}>
                              {exp.description}
                            </td>
                            <td className="py-4 px-6 text-right font-black text-[#ba1a1a] text-[12.5px]">
                              {formatCurrency(exp.amount)}
                            </td>
                            <td className="py-4 px-6 font-semibold text-[#45474c]">{exp.paymentMethod}</td>
                            <td className="py-4 px-6 text-right font-bold text-[#645efb]">{exp.approvedBy}</td>
                          </tr>
                        );
                      })}
                      {officeExpenses.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-10 text-center font-semibold text-[#45474c]">
                            No operating expenses recorded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Expense Breakdown Visual chart */}
              <div className="bg-white border border-[#cbd5e1]/40 rounded-2xl p-6 shadow-sm lg:col-span-4 text-left flex flex-col justify-between h-fit space-y-6">
                <div>
                  <h4 className="font-headline text-sm font-bold text-[#091426] border-b border-[#cbd5e1]/20 pb-3">Operating Expense Profile (MTD)</h4>
                  <p className="text-[10px] font-medium text-[#45474c] mt-2 leading-relaxed">Breakdown of operational capital deployed across categories:</p>
                </div>

                <div className="space-y-4">
                  {expenseChartData.map((data, index) => {
                    const colors = ['bg-indigo-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-400', 'bg-rose-500', 'bg-slate-400'];
                    const pct = totalExpensesValue > 0 ? (data.amount / totalExpensesValue) * 100 : 0;
                    return (
                      <div key={data.category} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span>{data.category}</span>
                          <span className="text-[#45474c]">{formatCurrency(data.amount)} ({pct.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-[#eceef0] h-2 rounded-full overflow-hidden">
                          <div className={`${colors[index % colors.length]} h-full rounded-full`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ==================== MODAL: ADD / EDIT EMPLOYEE ==================== */}
      <AnimatePresence>
        {isEmployeeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-left">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="bg-[#091426] text-white px-6 py-4.5 flex justify-between items-center">
                <h3 className="font-headline text-md font-bold">
                  {selectedEmployeeForEdit ? 'Edit Staff Profile' : 'Register New Staff Member'}
                </h3>
                <button 
                  onClick={() => setIsEmployeeModalOpen(false)}
                  className="text-white/60 hover:text-white bg-transparent border-none cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEmployeeSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Full Staff Name</label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={empName}
                      onChange={(e) => setEmpName(e.target.value)}
                      required
                      className="w-full border border-[#cbd5e1] rounded-xl p-3 font-sans text-xs font-semibold text-[#191c1e] focus:ring-2 focus:ring-[#645efb] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Official Role</label>
                    <select
                      value={empRole}
                      onChange={(e) => setEmpRole(e.target.value)}
                      className="w-full bg-white border border-[#cbd5e1] rounded-xl p-3 font-sans text-xs font-semibold text-[#191c1e] focus:ring-2 focus:ring-[#645efb] outline-none"
                    >
                      <option value="Loan Officer">Loan Officer</option>
                      <option value="Collections Officer">Collections Officer</option>
                      <option value="Credit Risk Analyst">Credit Risk Analyst</option>
                      <option value="Repo Operations Manager">Repo Operations Manager</option>
                      <option value="General Accountant">General Accountant</option>
                      <option value="Branch Administrator">Branch Administrator</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      placeholder="name@autofinance.erp"
                      value={empEmail}
                      onChange={(e) => setEmpEmail(e.target.value)}
                      required
                      className="w-full border border-[#cbd5e1] rounded-xl p-3 font-sans text-xs font-semibold text-[#191c1e] focus:ring-2 focus:ring-[#645efb] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+91 XXXXX XXXXX"
                      value={empPhone}
                      onChange={(e) => setEmpPhone(e.target.value)}
                      required
                      className="w-full border border-[#cbd5e1] rounded-xl p-3 font-sans text-xs font-semibold text-[#191c1e] focus:ring-2 focus:ring-[#645efb] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Base Salary (₹)</label>
                    <input
                      type="number"
                      placeholder="Salary"
                      value={empSalary}
                      onChange={(e) => setEmpSalary(e.target.value === '' ? '' : Number(e.target.value))}
                      required
                      className="w-full border border-[#cbd5e1] rounded-xl p-3 font-sans text-xs font-semibold text-[#191c1e] focus:ring-2 focus:ring-[#645efb] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Allowances (₹)</label>
                    <input
                      type="number"
                      placeholder="Allowances"
                      value={empAllowances}
                      onChange={(e) => setEmpAllowances(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full border border-[#cbd5e1] rounded-xl p-3 font-sans text-xs font-semibold text-[#191c1e] focus:ring-2 focus:ring-[#645efb] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Deductions (₹)</label>
                    <input
                      type="number"
                      placeholder="Deductions"
                      value={empDeductions}
                      onChange={(e) => setEmpDeductions(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full border border-[#cbd5e1] rounded-xl p-3 font-sans text-xs font-semibold text-[#191c1e] focus:ring-2 focus:ring-[#645efb] outline-none"
                    />
                  </div>
                </div>

                {selectedEmployeeForEdit && (
                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Staff Operating Status</label>
                    <select
                      value={empStatus}
                      onChange={(e) => setEmpStatus(e.target.value as any)}
                      className="w-full bg-white border border-[#cbd5e1] rounded-xl p-3 font-sans text-xs font-semibold text-[#191c1e] focus:ring-2 focus:ring-[#645efb] outline-none"
                    >
                      <option value="Active">Active Duty</option>
                      <option value="Inactive">Inactive / Suspended</option>
                    </select>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEmployeeModalOpen(false)}
                    className="px-4.5 py-2.5 border border-[#cbd5e1] hover:bg-[#f2f4f6] font-sans text-xs font-semibold text-[#091426] rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#645efb] hover:bg-[#524be3] text-white font-sans text-xs font-bold rounded-xl shadow-md cursor-pointer border-none"
                  >
                    Save Record
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== MODAL: LOG OFFICE EXPENSE ==================== */}
      <AnimatePresence>
        {isExpenseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-left">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="bg-[#ba1a1a] text-white px-6 py-4.5 flex justify-between items-center">
                <h3 className="font-headline text-md font-bold">Record Office Expense</h3>
                <button 
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="text-white/60 hover:text-white bg-transparent border-none cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveExpenseSubmit} className="p-6 space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Expense Category</label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value as any)}
                    className="w-full bg-white border border-[#cbd5e1] rounded-xl p-3 font-sans text-xs font-semibold text-[#191c1e] focus:ring-2 focus:ring-[#ba1a1a] outline-none"
                  >
                    <option value="Rent">HQ &amp; Branch Office Rent</option>
                    <option value="Utilities">Electricity, Water &amp; Internet</option>
                    <option value="Office Supplies">Paper, Ink, Staples &amp; Stationery</option>
                    <option value="Marketing">Customer Ads &amp; Campaign Spend</option>
                    <option value="Travel">Staff Transport &amp; Fuel Allowances</option>
                    <option value="Other">Miscellaneous Operating Costs</option>
                  </select>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Description Summary</label>
                  <input
                    type="text"
                    placeholder="e.g. BroadBand HighSpeed Fiber payment"
                    value={expDescription}
                    onChange={(e) => setExpDescription(e.target.value)}
                    required
                    className="w-full border border-[#cbd5e1] rounded-xl p-3 font-sans text-xs font-semibold text-[#191c1e] focus:ring-2 focus:ring-[#ba1a1a] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Expense Value (₹)</label>
                    <input
                      type="number"
                      placeholder="Amount"
                      value={expAmount}
                      onChange={(e) => setExpAmount(e.target.value === '' ? '' : Number(e.target.value))}
                      required
                      className="w-full border border-[#cbd5e1] rounded-xl p-3 font-sans text-xs font-semibold text-[#191c1e] focus:ring-2 focus:ring-[#ba1a1a] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Settlement Method</label>
                    <select
                      value={expMethod}
                      onChange={(e) => setExpMethod(e.target.value as any)}
                      className="w-full bg-white border border-[#cbd5e1] rounded-xl p-3 font-sans text-xs font-semibold text-[#191c1e] focus:ring-2 focus:ring-[#ba1a1a] outline-none"
                    >
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Credit Card">Corporate Credit Card</option>
                      <option value="Cash">Petty Cash Vault</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Authorizing Officer</label>
                  <input
                    type="text"
                    placeholder="e.g. Branch Manager"
                    value={expApprovedBy}
                    onChange={(e) => setExpApprovedBy(e.target.value)}
                    required
                    className="w-full border border-[#cbd5e1] rounded-xl p-3 font-sans text-xs font-semibold text-[#191c1e] focus:ring-2 focus:ring-[#ba1a1a] outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsExpenseModalOpen(false)}
                    className="px-4.5 py-2.5 border border-[#cbd5e1] hover:bg-[#f2f4f6] font-sans text-xs font-semibold text-[#091426] rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#ba1a1a] hover:bg-[#a61717] text-white font-sans text-xs font-bold rounded-xl shadow-md cursor-pointer border-none"
                  >
                    Log Expense
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
