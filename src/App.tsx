/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardScreen from './components/DashboardScreen';
import VehiclesScreen from './components/VehiclesScreen';
import CustomersScreen from './components/CustomersScreen';
import LoansScreen from './components/LoansScreen';
import QuickTransactionModal from './components/QuickTransactionModal';
import LoginScreen from './components/LoginScreen';
import { supabase } from './lib/supabaseClient';

import { 
  INITIAL_VEHICLES, 
  INITIAL_CUSTOMERS, 
  INITIAL_LOANS, 
  INITIAL_TRANSACTIONS,
  Vehicle,
  Customer,
  Loan,
  Transaction,
  User
} from './types';

import { 
  Building2, 
  ArrowUpRight, 
  CheckCircle, 
  Sliders, 
  BadgeDollarSign, 
  LineChart, 
  ShieldAlert,
  ChevronRight,
  ShieldX,
  Check,
  UserCheck,
  UserX,
  KeyRound
} from 'lucide-react';

// --- DB Mappers to map between camelCase (JS) and snake_case (PostgreSQL) ---
function mapVehicleFromDB(v: any): Vehicle {
  return {
    id: v.id,
    make: v.make,
    model: v.model,
    year: Number(v.year),
    registrationNo: v.registration_no || '',
    vin: v.vin || '',
    engineNo: v.engine_no || '',
    fuelType: v.fuel_type,
    purchasePrice: Number(v.purchase_price),
    salePrice: Number(v.sale_price),
    purchaseDate: v.purchase_date || '',
    fundingAccount: v.funding_account || '',
    sellerDetails: v.seller_details || '',
    rcReceived: Boolean(v.rc_received),
    activeInsurance: Boolean(v.active_insurance),
    image: v.image || '',
    status: v.status
  };
}

function mapVehicleToDB(v: Vehicle): any {
  return {
    id: v.id,
    make: v.make,
    model: v.model,
    year: v.year,
    registration_no: v.registrationNo,
    vin: v.vin,
    engine_no: v.engineNo,
    fuel_type: v.fuelType,
    purchase_price: v.purchasePrice,
    sale_price: v.salePrice,
    purchase_date: v.purchaseDate,
    funding_account: v.fundingAccount,
    seller_details: v.sellerDetails,
    rc_received: v.rcReceived,
    active_insurance: v.activeInsurance,
    image: v.image,
    status: v.status
  };
}

function mapCustomerFromDB(c: any): Customer {
  return {
    id: c.id,
    fullName: c.full_name,
    fatherName: c.father_name || '',
    phoneNumber: c.phone_number || '',
    idNumber: c.id_number || '',
    gender: c.gender || '',
    address: c.address || '',
    city: c.city || '',
    pincode: c.pincode || '',
    occupation: c.occupation || '',
    introducerName: c.introducer_name || '',
    avatar: c.avatar || '',
    panUploaded: Boolean(c.pan_uploaded),
    utilityBillUploaded: Boolean(c.utility_bill_uploaded),
    crifScore: Number(c.crif_score || 0),
    category: c.category || 'Medium Risk',
    probability: c.probability || '50%',
    registrationDate: c.registration_date || '',
    status: c.status || 'In Progress'
  };
}

function mapCustomerToDB(c: Customer): any {
  return {
    id: c.id,
    full_name: c.fullName,
    father_name: c.fatherName,
    phone_number: c.phoneNumber,
    id_number: c.idNumber,
    gender: c.gender,
    address: c.address,
    city: c.city,
    pincode: c.pincode,
    occupation: c.occupation,
    introducer_name: c.introducerName,
    avatar: c.avatar,
    pan_uploaded: c.panUploaded,
    utility_bill_uploaded: c.utilityBillUploaded,
    crif_score: c.crifScore,
    category: c.category,
    probability: c.probability,
    registration_date: c.registrationDate,
    status: c.status
  };
}

function mapLoanFromDB(l: any): Loan {
  return {
    id: l.id,
    customerId: l.customer_id || '',
    customerName: l.customer_name || '',
    vehicleId: l.vehicle_id || '',
    vehicleName: l.vehicle_name || '',
    salePrice: Number(l.sale_price),
    downPayment: Number(l.down_payment),
    loanAmount: Number(l.loan_amount),
    tenureMonths: Number(l.tenure_months),
    interestRate: Number(l.interest_rate),
    docFee: Number(l.doc_fee || 0),
    dueStartDate: l.due_start_date || '',
    emiCalculated: Number(l.emi_calculated),
    status: l.status || 'Draft',
    creditScore: Number(l.credit_score || 0),
    riskCategory: l.risk_category || '',
    defaultInstances: Number(l.default_instances || 0),
    employmentLength: l.employment_length || '',
    dtiRatio: l.dti_ratio || ''
  };
}

function mapLoanToDB(l: Loan): any {
  return {
    id: l.id,
    customer_id: l.customerId || null,
    customer_name: l.customerName,
    vehicle_id: l.vehicleId || null,
    vehicle_name: l.vehicleName,
    sale_price: l.salePrice,
    down_payment: l.downPayment,
    loan_amount: l.loanAmount,
    tenure_months: l.tenureMonths,
    interest_rate: l.interestRate,
    doc_fee: l.docFee,
    due_start_date: l.dueStartDate,
    emi_calculated: l.emiCalculated,
    status: l.status,
    credit_score: l.creditScore,
    risk_category: l.riskCategory,
    default_instances: l.defaultInstances,
    employment_length: l.employmentLength,
    dti_ratio: l.dtiRatio
  };
}

function mapTransactionFromDB(t: any): Transaction {
  return {
    id: t.id,
    customer: t.customer || '',
    vehicle: t.vehicle || '',
    amount: Number(t.amount),
    status: t.status || 'Pending',
    date: t.date || ''
  };
}

function mapTransactionToDB(t: Transaction): any {
  return {
    id: t.id,
    customer: t.customer,
    vehicle: t.vehicle,
    amount: t.amount,
    status: t.status,
    date: t.date
  };
}

const INITIAL_USERS: User[] = [
  {
    id: 'USR-001',
    username: 'admin',
    email: 'admin@autofinance.erp',
    password: 'admin123',
    fullName: 'Admin User',
    businessName: 'AutoFinance HQ',
    address: 'New York HQ Office',
    mobileNumber: '+15550100',
    role: 'admin',
    status: 'Approved'
  },
  {
    id: 'USR-002',
    username: 'staff',
    email: 'staff@autofinance.erp',
    password: 'staff123',
    fullName: 'Staff Member',
    businessName: 'AutoFinance NYC Branch',
    address: 'Downtown NYC Office',
    mobileNumber: '+15550200',
    role: 'user',
    status: 'Approved'
  }
];

function mapUserFromDB(u: any): User {
  return {
    id: u.id,
    username: u.username,
    email: u.email || '',
    password: u.password,
    fullName: u.full_name,
    businessName: u.business_name || '',
    address: u.address || '',
    mobileNumber: u.mobile_number || '',
    role: u.role,
    status: u.status
  };
}

function mapUserToDB(u: User): any {
  return {
    id: u.id,
    username: u.username,
    email: u.email,
    password: u.password,
    full_name: u.fullName,
    business_name: u.businessName,
    address: u.address,
    mobile_number: u.mobileNumber,
    role: u.role,
    status: u.status
  };
}

export default function App() {
  // Authentication State
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('erp_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('erp_user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('erp_user');
  };

  // DB States
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // UI state for password reset inputs in User Management list
  const [resettingUserId, setResettingUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');

  // Fetch data from Supabase, fallback to local variables/localStorage if offline/not configured
  useEffect(() => {
    const fetchDBData = async () => {
      setIsLoading(true);
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL' || !supabaseUrl.startsWith('http')) {
          console.log("Supabase URL placeholder or invalid URL found. Using local / localStorage initial data.");
          
          const localVehicles = localStorage.getItem('erp_vehicles');
          const localCustomers = localStorage.getItem('erp_customers');
          const localLoans = localStorage.getItem('erp_loans');
          const localTransactions = localStorage.getItem('erp_transactions');
          const localUsers = localStorage.getItem('erp_users');

          setVehicles(localVehicles ? JSON.parse(localVehicles) : INITIAL_VEHICLES);
          setCustomers(localCustomers ? JSON.parse(localCustomers) : INITIAL_CUSTOMERS);
          setLoans(localLoans ? JSON.parse(localLoans) : INITIAL_LOANS);
          setTransactions(localTransactions ? JSON.parse(localTransactions) : INITIAL_TRANSACTIONS);
          setAllUsers(localUsers ? JSON.parse(localUsers) : INITIAL_USERS);
          setIsLoading(false);
          return;
        }

        const [vRes, cRes, lRes, tRes, uRes] = await Promise.all([
          supabase.from('vehicles').select('*'),
          supabase.from('customers').select('*'),
          supabase.from('loans').select('*'),
          supabase.from('transactions').select('*'),
          supabase.from('users').select('*')
        ]);

        if (vRes.error) throw vRes.error;
        if (cRes.error) throw cRes.error;
        if (lRes.error) throw lRes.error;
        if (tRes.error) throw tRes.error;
        if (uRes.error) throw uRes.error;

        setVehicles((vRes.data || []).map(mapVehicleFromDB));
        setCustomers((cRes.data || []).map(mapCustomerFromDB));
        setLoans((lRes.data || []).map(mapLoanFromDB));
        setTransactions((tRes.data || []).map(mapTransactionFromDB));
        setAllUsers((uRes.data || []).map(mapUserFromDB));
      } catch (err) {
        console.error("Supabase integration error, using local fallback seed data:", err);
        const localVehicles = localStorage.getItem('erp_vehicles');
        const localCustomers = localStorage.getItem('erp_customers');
        const localLoans = localStorage.getItem('erp_loans');
        const localTransactions = localStorage.getItem('erp_transactions');
        const localUsers = localStorage.getItem('erp_users');

        setVehicles(localVehicles ? JSON.parse(localVehicles) : INITIAL_VEHICLES);
        setCustomers(localCustomers ? JSON.parse(localCustomers) : INITIAL_CUSTOMERS);
        setLoans(localLoans ? JSON.parse(localLoans) : INITIAL_LOANS);
        setTransactions(localTransactions ? JSON.parse(localTransactions) : INITIAL_TRANSACTIONS);
        setAllUsers(localUsers ? JSON.parse(localUsers) : INITIAL_USERS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDBData();
  }, []);

  // Synchronize state changes to localStorage for offline fallback persistence
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('erp_vehicles', JSON.stringify(vehicles));
    }
  }, [vehicles, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('erp_customers', JSON.stringify(customers));
    }
  }, [customers, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('erp_loans', JSON.stringify(loans));
    }
  }, [loans, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('erp_transactions', JSON.stringify(transactions));
    }
  }, [transactions, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('erp_users', JSON.stringify(allUsers));
    }
  }, [allUsers, isLoading]);

  const handleVerifyCredentials = async (usernameInput: string, passwordInput: string) => {
    const lowerUser = usernameInput.trim().toLowerCase();
    const rawPass = passwordInput.trim();

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const isDb = supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseUrl.startsWith('http');

      if (isDb) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('username', lowerUser)
          .eq('password', rawPass)
          .single();

        if (error || !data) {
          return { success: false, message: "Invalid username or password." };
        }

        const mappedUser = mapUserFromDB(data);

        if (mappedUser.status === 'Pending') {
          return { success: false, message: "Your account is pending administrator approval." };
        }
        if (mappedUser.status === 'Suspended') {
          return { success: false, message: "Your account has been suspended by an administrator." };
        }

        handleLogin(mappedUser);
        return { success: true, user: mappedUser };
      } else {
        // Offline check against local state
        const found = allUsers.find(u => u.username === lowerUser && u.password === rawPass);

        if (!found) {
          return { success: false, message: "Invalid username or password in offline mode." };
        }
        if (found.status === 'Pending') {
          return { success: false, message: "Your account is pending administrator approval." };
        }
        if (found.status === 'Suspended') {
          return { success: false, message: "Your account has been suspended by an administrator." };
        }

        handleLogin(found);
        return { success: true, user: found };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: "A connection error occurred during verification." };
    }
  };

  const handleRegisterUser = async (newUser: User) => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const isDb = supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseUrl.startsWith('http');

      if (isDb) {
        const { data: existing } = await supabase
          .from('users')
          .select('username')
          .eq('username', newUser.username)
          .maybeSingle();

        if (existing) {
          return { success: false, message: "Username is already taken." };
        }

        const { error } = await supabase.from('users').insert([mapUserToDB(newUser)]);
        if (error) throw error;
      } else {
        const exists = allUsers.some(u => u.username === newUser.username);
        if (exists) {
          return { success: false, message: "Username is already taken." };
        }
      }

      setAllUsers([...allUsers, newUser]);
      return { success: true, message: `Account request submitted for ${newUser.fullName}! Pending admin approval.` };
    } catch (err: any) {
      console.error(err);
      return { success: false, message: err.message || "Failed to submit registration request." };
    }
  };

  const handleUpdateUserRole = async (userId: string, selectedRole: 'admin' | 'user' | 'demo') => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const isDb = supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseUrl.startsWith('http');

      if (isDb) {
        const { error } = await supabase
          .from('users')
          .update({ role: selectedRole })
          .eq('id', userId);
        if (error) throw error;
      }

      setAllUsers(allUsers.map(u => u.id === userId ? { ...u, role: selectedRole } : u));
      showNotification("User authorization status updated.");
    } catch (err) {
      console.error(err);
      showNotification("Failed to update user status in cloud database.", "info");
    }
  };

  const handleApproveUser = async (userId: string) => {
    const targetUser = allUsers.find(u => u.id === userId);
    if (!targetUser || !targetUser.role) {
      showNotification("Please assign a user status to the user before approving them.", "info");
      return;
    }

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const isDb = supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseUrl.startsWith('http');

      if (isDb) {
        const { error } = await supabase
          .from('users')
          .update({ status: 'Approved' })
          .eq('id', userId);
        if (error) throw error;
      }

      setAllUsers(allUsers.map(u => u.id === userId ? { ...u, status: 'Approved' } : u));
      showNotification("User account approved successfully!");
    } catch (err) {
      console.error(err);
      showNotification("Failed to approve account in cloud database.", "info");
    }
  };

  const handleSuspendUser = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Suspended' ? 'Approved' : 'Suspended';
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const isDb = supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseUrl.startsWith('http');

      if (isDb) {
        const { error } = await supabase
          .from('users')
          .update({ status: newStatus })
          .eq('id', userId);
        if (error) throw error;
      }

      setAllUsers(allUsers.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      showNotification(`Employee status toggled to ${newStatus}!`);
    } catch (err) {
      console.error(err);
      showNotification("Failed to toggle status in cloud database.", "info");
    }
  };

  const handleResetPassword = async (userId: string, newPassVal: string) => {
    if (!newPassVal.trim()) {
      showNotification("Password cannot be blank.", "info");
      return;
    }
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const isDb = supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseUrl.startsWith('http');

      if (isDb) {
        const { error } = await supabase
          .from('users')
          .update({ password: newPassVal.trim() })
          .eq('id', userId);
        if (error) throw error;
      }

      setAllUsers(allUsers.map(u => u.id === userId ? { ...u, password: newPassVal.trim() } : u));
      setResettingUserId(null);
      setNewPassword('');
      showNotification("Password reset successfully completed.");
    } catch (err) {
      console.error(err);
      showNotification("Failed to update credentials in cloud database.", "info");
    }
  };

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
  const handleAddVehicle = async (newVehicle: Vehicle) => {
    // Optimistic local state update
    setVehicles([newVehicle, ...vehicles]);

    const autoTxn: Transaction = {
      id: `#TXN-${Math.floor(82100 + Math.random() * 900)}`,
      customer: newVehicle.sellerDetails,
      vehicle: `${newVehicle.year} ${newVehicle.make} ${newVehicle.model}`,
      amount: newVehicle.purchasePrice,
      status: 'Success',
      date: newVehicle.purchaseDate
    };
    setTransactions([autoTxn, ...transactions]);

    try {
      const { error: vError } = await supabase.from('vehicles').insert([mapVehicleToDB(newVehicle)]);
      if (vError) throw vError;

      const { error: tError } = await supabase.from('transactions').insert([mapTransactionToDB(autoTxn)]);
      if (tError) throw tError;

      showNotification(`Successfully finalized purchase of ${newVehicle.make} ${newVehicle.model}! Added transaction record.`);
    } catch (err) {
      console.error("Database save failed, updated locally only:", err);
      showNotification("Saved vehicle asset locally (offline fallback mode).", "info");
    }

    setCurrentTab('dashboard');
  };

  const handleAddCustomer = async (newCustomer: Customer) => {
    setCustomers([newCustomer, ...customers]);

    try {
      const { error } = await supabase.from('customers').insert([mapCustomerToDB(newCustomer)]);
      if (error) throw error;

      showNotification(`New customer ${newCustomer.fullName} registered: Quality Classification approved as ${newCustomer.category}!`);
    } catch (err) {
      console.error("Database save failed, updated locally only:", err);
      showNotification("Registered customer locally (offline fallback mode).", "info");
    }

    setCurrentTab('dashboard');
  };

  const handleUpdateCustomer = async (updatedCustomer: Customer) => {
    setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));

    try {
      const { error } = await supabase
        .from('customers')
        .update(mapCustomerToDB(updatedCustomer))
        .eq('id', updatedCustomer.id);
      if (error) throw error;

      showNotification(`Customer ${updatedCustomer.fullName} updated successfully!`);
    } catch (err) {
      console.error("Database update failed, updated locally only:", err);
      showNotification("Updated customer locally (offline fallback mode).", "info");
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    const target = customers.find(c => c.id === customerId);
    if (!target) return;

    setCustomers(customers.filter(c => c.id !== customerId));

    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerId);
      if (error) throw error;

      showNotification(`Customer ${target.fullName} deleted successfully.`);
    } catch (err) {
      console.error("Database delete failed, updated locally only:", err);
      showNotification("Deleted customer locally (offline fallback mode).", "info");
    }
  };

  const handleAddLoan = async (newLoan: Loan) => {
    setLoans([newLoan, ...loans]);

    const autoTxn: Transaction = {
      id: `#TXN-${Math.floor(88300 + Math.random() * 900)}`,
      customer: newLoan.customerName,
      vehicle: newLoan.vehicleName,
      amount: newLoan.emiCalculated,
      status: 'Pending',
      date: newLoan.dueStartDate
    };
    setTransactions([autoTxn, ...transactions]);

    try {
      const { error: lError } = await supabase.from('loans').insert([mapLoanToDB(newLoan)]);
      if (lError) throw lError;

      const { error: tError } = await supabase.from('transactions').insert([mapTransactionToDB(autoTxn)]);
      if (tError) throw tError;

      showNotification(`Loan context created for ${newLoan.customerName}! EMI calculated at $${newLoan.emiCalculated}/month.`);
    } catch (err) {
      console.error("Database save failed, updated locally only:", err);
      showNotification("Logged loan context locally (offline fallback mode).", "info");
    }

    setCurrentTab('dashboard');
  };

  const handleAddTransaction = async (newTxn: Transaction) => {
    setTransactions([newTxn, ...transactions]);

    try {
      const { error } = await supabase.from('transactions').insert([mapTransactionToDB(newTxn)]);
      if (error) throw error;

      showNotification(`Successfully added transaction records for ${newTxn.customer}: ${newTxn.id}`);
    } catch (err) {
      console.error("Database save failed, updated locally only:", err);
      showNotification("Saved transaction ledger locally (offline fallback mode).", "info");
    }
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

  const renderMasterControlScreen = () => {
    const isAdmin = user?.role === 'admin' || user?.username === 'admin';

    if (!isAdmin) {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="border-b border-[#cbd5e1]/40 pb-4">
            <h2 className="font-headline text-3xl font-black text-[#091426]">Audit Master Control</h2>
            <p className="text-xs text-[#ba1a1a] font-semibold uppercase tracking-wider mt-1">Access Denied</p>
          </div>
          <div className="bg-white rounded-2xl border border-red-200/40 p-8 shadow-sm flex flex-col items-center justify-center gap-4 text-center max-w-2xl mx-auto mt-8">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shadow-inner">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-headline text-lg font-bold text-[#091426]">Administrator Rights Required</h3>
            <p className="text-xs text-[#45474c] font-medium leading-relaxed">
              This terminal ledger controller is restricted to Administrator accounts only. 
              Please contact your system administrator to adjust your credentials and request authorization.
            </p>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="border-b border-[#cbd5e1]/40 pb-4">
          <h2 className="font-headline text-3xl font-black text-[#091426]">Audit Master control</h2>
          <p className="text-xs text-[#45474c] font-semibold uppercase tracking-wider mt-1">Central access configuration</p>
        </div>

        {/* User Account Management Directory */}
        <div className="bg-white rounded-2xl border border-[#cbd5e1]/40 p-6 shadow-sm space-y-4">
          <h3 className="font-headline text-md font-bold text-[#091426]">User Registration &amp; SaaS Auth Directory</h3>
          <p className="text-xs font-medium text-[#45474c]">Manage client accounts, review registration parameters, and authorize system access:</p>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#cbd5e1]/30 text-[#45474c] uppercase font-bold text-[10px] tracking-wider bg-[#f7f9fb]">
                  <th className="py-3.5 px-4 rounded-l-xl">User &amp; Business</th>
                  <th className="py-3.5 px-4">Contact Detail</th>
                  <th className="py-3.5 px-4">Office Address</th>
                  <th className="py-3.5 px-4">User Status</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#cbd5e1]/20">
                {allUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#f7f9fb]/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-[#091426]">{u.fullName}</div>
                      <div className="text-[10px] text-[#645efb] font-bold mt-0.5">{u.businessName || 'No Business Entity'}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-[#191c1e]">{u.email}</div>
                      <div className="text-[10px] text-[#45474c] mt-0.5 font-mono">{u.mobileNumber || 'No Phone Number'}</div>
                    </td>
                    <td className="py-4 px-4 text-[#45474c] max-w-[150px] truncate" title={u.address}>
                      {u.address || 'No Address'}
                    </td>
                    <td className="py-4 px-4">
                      {u.username === 'admin' ? (
                        <span className="font-semibold text-[#091426]">Admin</span>
                      ) : (
                        <select
                          value={u.role || ''}
                          onChange={(e) => handleUpdateUserRole(u.id, e.target.value as 'admin' | 'user' | 'demo')}
                          className="bg-[#f2f4f6] hover:bg-[#eceef0] border border-[#cbd5e1]/40 rounded-xl px-2 py-1.5 font-sans text-xs font-semibold text-[#191c1e] cursor-pointer outline-none transition-colors"
                        >
                          <option value="" disabled>-- Assign Status --</option>
                          <option value="user">User</option>
                          <option value="demo">Demo</option>
                        </select>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide ${
                        u.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                        u.status === 'Pending' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                        'bg-red-500/10 text-red-600 border border-red-500/20'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {/* Password reset input inline toggle */}
                      {resettingUserId === u.id ? (
                        <div className="inline-flex items-center gap-1 justify-end">
                          <input
                            type="password"
                            placeholder="New code"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="bg-[#f2f4f6] border border-[#cbd5e1]/60 rounded-lg px-2.5 py-1 text-xs outline-none focus:border-[#645efb] w-28"
                          />
                          <button
                            onClick={() => handleResetPassword(u.id, newPassword)}
                            className="p-1.5 bg-[#645efb] text-white rounded-lg hover:bg-[#524be3] transition-colors cursor-pointer border-none"
                            title="Save Access Code"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setResettingUserId(null);
                              setNewPassword('');
                            }}
                            className="p-1.5 bg-[#f2f4f6] text-[#45474c] rounded-lg hover:bg-[#cbd5e1] transition-colors cursor-pointer border-none"
                            title="Cancel"
                          >
                            <ShieldX className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          {u.status === 'Pending' && (
                            <button
                              onClick={() => handleApproveUser(u.id)}
                              className="px-2.5 py-1 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 active:scale-[0.97] transition-all flex items-center gap-1 cursor-pointer border-none text-[10px]"
                              title="Approve User"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleSuspendUser(u.id, u.status)}
                            disabled={u.username === 'admin'} // Protect primary admin from self-suspending
                            className={`px-2.5 py-1 rounded-lg font-semibold active:scale-[0.97] transition-all flex items-center gap-1 cursor-pointer border-none text-[10px] disabled:opacity-30 disabled:pointer-events-none ${
                              u.status === 'Suspended' 
                                ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20' 
                                : 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
                            }`}
                            title={u.status === 'Suspended' ? 'Unsuspend Account' : 'Suspend Account'}
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>{u.status === 'Suspended' ? 'Unsuspend' : 'Suspend'}</span>
                          </button>

                          <button
                            onClick={() => {
                              setResettingUserId(u.id);
                              setNewPassword('');
                            }}
                            className="px-2.5 py-1 bg-[#f2f4f6] text-[#191c1e] hover:bg-[#cbd5e1] rounded-lg font-semibold active:scale-[0.97] transition-all flex items-center gap-1 cursor-pointer border-none text-[10px]"
                            title="Reset Password Code"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>Reset Code</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Existing System Parameters */}
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
  };

  if (!user) {
    return (
      <LoginScreen 
        onVerifyCredentials={handleVerifyCredentials}
        onRegisterUser={handleRegisterUser}
      />
    );
  }

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
          user={user}
          onLogout={handleLogout}
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[350px] gap-4">
              <div className="w-9 h-9 rounded-full border-3 border-[#645efb] border-t-transparent animate-spin" />
              <p className="text-[11px] font-bold text-[#45474c] uppercase tracking-widest font-mono">Syncing Database Ledger...</p>
            </div>
          ) : (
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
                  onUpdateCustomer={handleUpdateCustomer}
                  onDeleteCustomer={handleDeleteCustomer}
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
          )}
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
