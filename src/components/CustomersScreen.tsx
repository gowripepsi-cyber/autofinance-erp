/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  UploadCloud, 
  Upload, 
  CheckCircle,
  FileCheck,
  AlertCircle,
  TrendingUp,
  FileText,
  List,
  Search,
  Edit,
  Trash2
} from 'lucide-react';
import { Customer } from '../types';

interface CustomersScreenProps {
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
  onUpdateCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customerId: string) => void;
}

export default function CustomersScreen({ 
  customers, 
  onAddCustomer, 
  onUpdateCustomer, 
  onDeleteCustomer 
}: CustomersScreenProps) {
  const [isListView, setIsListView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(c => 
    c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phoneNumber.includes(searchQuery) ||
    c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Personal Info states
  const [fullName, setFullName] = useState('Rahul Sharma');
  const [fatherName, setFatherName] = useState('Vijay Sharma');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [idNumber, setIdNumber] = useState('5420 1102 9923');
  const [gender, setGender] = useState('Male');
  const [address, setAddress] = useState('221B Baker Street, Flat 4');
  const [city, setCity] = useState('Mumbai');
  const [pincode, setPincode] = useState('400001');
  const [occupation, setOccupation] = useState('Business Owner');
  const [introducerName, setIntroducerName] = useState('Staff ID: 9942');

  // Document verification checklists
  const [panUploaded, setPanUploaded] = useState(true);
  const [utilityBillUploaded, setUtilityBillUploaded] = useState(false);

  // Credit health metrics
  const [crifScore, setCrifScore] = useState(742);

  // High-end pre-configured profile pictures that the user can choose from
  const premiumAvatars = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBnXlMgq-MzWQYeHX3gSwXiAeOyhJCJFajxyBLbt5h6LJrbcokiI1xIKTkx11x6dzB6e60xFz4wMusC90XCiZNzIACGAbAZm34opExyapApZJoXh1GXN6Lt5L81_QDP6TsQDSSEod4KnO_FrcdcHf1OmvMjNBrtjshh5cBppclgx_Ct1Y3GidN6NtPwtk9fCshfnoEAaEyHfiadiTqvxfYPgGrveA5-cr4AVKSOYaiMgTPH3jlgQFthRlrsxCOzwf9-1Kzw6pQs4hE',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBRpgs7Nygdbcs1xdQ8B_-lgFF7YwWBiYcT7OAxmll-BOrzzfXbMfVBg2QR_V-UA4IawO_NH43E8gyH1mqvabtZGhAdhJArm3vFYP2O8G7-6aoCUxpTyMLyhpeb3vUKDsxSFL8iWCVlkPS0uLnMPhNvaZ1lO73DDWQkng7eF8_x-a4auQsiB2QgDgfwFdAb-x-8ax4SQ3Aa5KcboYWA9BCiFGv3rpwXl5_soFqGqKNr7C22JnBymy18UAW-mrOzNE0YChglPd2mz8Y',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuACod7svGMNnPdlDWGBL8hiqsr0hfRQisP0vPmoA1L-nnbLS5Mt8QjQcLggHbI8LYzjcTL9aeZWuSnyZbeZlFjenujzxcWCaWRPQU12ZP4uzNmlS8D0VK2H86JRHiaYBeYA1JARbMI2tK2SJRaCA9LZHMmuC1mZykYPWUP68vmiexSw1X1d8K6BU0xQgDX2zs4cS5bA4NVU-ecY3a80uh3Wxq6tctIatpbjowdMd7LdNukQ3RLFPAbFh10rnAc4a5XVuZJmXCIwvgo'
  ];
  const [selectedAvatar, setSelectedAvatar] = useState(premiumAvatars[0]);

  // Derived classification
  const creditCategory = crifScore >= 700 ? 'Prime / Low Risk' : crifScore >= 600 ? 'Medium Risk' : 'High Risk';
  const approvalProbability = crifScore >= 700 ? '94.2%' : crifScore >= 600 ? '78.5%' : '14.0%';

  const loadCustomerIntoForm = (c: Customer) => {
    setEditingCustomer(c);
    setFullName(c.fullName);
    setFatherName(c.fatherName);
    setPhoneNumber(c.phoneNumber);
    setIdNumber(c.idNumber);
    setGender(c.gender);
    setAddress(c.address);
    setCity(c.city);
    setPincode(c.pincode);
    setOccupation(c.occupation);
    setIntroducerName(c.introducerName);
    setSelectedAvatar(c.avatar);
    setPanUploaded(c.panUploaded);
    setUtilityBillUploaded(c.utilityBillUploaded);
    setCrifScore(c.crifScore);
    setIsListView(false);
  };

  const clearForm = () => {
    setEditingCustomer(null);
    setFullName('');
    setFatherName('');
    setPhoneNumber('');
    setIdNumber('');
    setGender('Male');
    setAddress('');
    setCity('');
    setPincode('');
    setOccupation('');
    setIntroducerName('');
    setSelectedAvatar(premiumAvatars[0]);
    setPanUploaded(false);
    setUtilityBillUploaded(false);
    setCrifScore(700);
  };

  const handleRegister = () => {
    if (!fullName || !phoneNumber) {
      alert("Full Name and Phone Number are required.");
      return;
    }

    const targetId = editingCustomer ? editingCustomer.id : `CUST-${Math.floor(100 + Math.random() * 900)}`;

    const cData: Customer = {
      id: targetId,
      fullName,
      fatherName,
      phoneNumber,
      idNumber,
      gender,
      address,
      city,
      pincode,
      occupation,
      introducerName,
      avatar: selectedAvatar,
      panUploaded,
      utilityBillUploaded,
      crifScore,
      category: creditCategory as any,
      probability: approvalProbability,
      registrationDate: editingCustomer ? editingCustomer.registrationDate : new Date().toISOString().split('T')[0],
      status: 'Completed'
    };

    if (editingCustomer) {
      onUpdateCustomer(cData);
    } else {
      onAddCustomer(cData);
    }

    clearForm();
    setIsListView(true);
  };

  const handleResetForm = () => {
    if (editingCustomer) {
      clearForm();
      setIsListView(true);
      return;
    }
    if (confirm("Reset current onboarding form entry values?")) {
      setFullName('Rahul Sharma');
      setFatherName('Vijay Sharma');
      setPhoneNumber('9876543210');
      setIdNumber('5420 1102 9923');
      setAddress('221B Baker Street, Flat 4');
      setCity('Mumbai');
      setPincode('400001');
      setOccupation('Business Owner');
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
      {/* Header and Controls */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-headline text-3xl font-extrabold text-[#091426] tracking-tight">
            {isListView 
              ? 'Saved Customers Directory' 
              : editingCustomer 
              ? `Edit Customer: ${editingCustomer.id}` 
              : 'New Customer Registration'}
          </h2>
          <p className="font-sans text-sm text-[#45474c] mt-1.5 font-medium">
            {isListView 
              ? 'Browse registered customers, search by name or contact, and view credit tiers.' 
              : editingCustomer 
              ? `Update profile details and credit parameters for ${fullName}.`
              : 'Onboard a new client and perform automated credit assessment.'}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              if (isListView) {
                clearForm();
                setIsListView(false);
              } else {
                clearForm();
                setIsListView(true);
              }
            }}
            className="px-5 py-2.5 bg-white border border-[#cbd5e1] hover:bg-[#f2f4f6] text-xs font-bold text-[#091426] rounded-xl transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            {isListView ? (
              <>
                <User className="w-4 h-4 text-[#645efb]" />
                <span>Show Registration Form</span>
              </>
            ) : (
              <>
                <List className="w-4 h-4 text-[#645efb]" />
                <span>View Saved Customers</span>
              </>
            )}
          </button>
          {!isListView && (
            <>
              <button 
                onClick={handleResetForm}
                className="px-5 py-2.5 bg-white border border-[#cbd5e1] hover:bg-[#f2f4f6] text-xs font-bold text-[#091426] rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                {editingCustomer ? 'Cancel Edit' : 'Draft Save'}
              </button>
              <button 
                onClick={handleRegister}
                className="px-6 py-2.5 bg-[#645efb] hover:bg-[#4b41e1] text-xs font-bold text-white rounded-xl shadow-md cursor-pointer transition-colors"
              >
                {editingCustomer ? 'Save Changes' : 'Start Verification'}
              </button>
            </>
          )}
        </div>
      </div>

      {isListView ? (
        /* LIST VIEW */
        <div className="bg-white p-6 rounded-2xl border border-[#cbd5e1]/40 shadow-sm space-y-4">
          <div className="flex justify-between items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#45474c] w-4 h-4" />
              <input
                type="text"
                placeholder="Search customers by name, phone, city, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f2f4f6] border border-[#cbd5e1]/40 focus:border-[#645efb] focus:bg-white rounded-xl pl-10 pr-4 py-2 text-xs font-sans text-[#191c1e] outline-none transition-all"
              />
            </div>
            <div className="text-xs text-[#45474c] font-semibold">
              Total Customers: <span className="text-[#091426] font-bold">{filteredCustomers.length}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#cbd5e1]/30 text-[#45474c] uppercase font-bold text-[10px] tracking-wider bg-[#f7f9fb]">
                  <th className="py-3 px-4 rounded-l-xl">Customer ID</th>
                  <th className="py-3 px-4">Profile</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 text-center">CRIF Score</th>
                  <th className="py-3 px-4">Risk Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#cbd5e1]/20">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#f7f9fb]/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-[#091426]">{c.id}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-[#cbd5e1]/50 shadow-sm flex-shrink-0">
                          <img src={c.avatar} alt={c.fullName} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-[#091426]">{c.fullName}</div>
                          <div className="text-[10px] text-[#45474c] mt-0.5">{c.occupation}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-[#191c1e]">+91 {c.phoneNumber}</div>
                      <div className="text-[10px] text-[#45474c] mt-0.5">Introducer: {c.introducerName}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-[#191c1e]">{c.city}</div>
                      <div className="text-[10px] text-[#45474c] mt-0.5 font-mono">{c.pincode}</div>
                    </td>
                    <td className="py-4 px-4 text-center font-headline font-bold text-[#091426]">
                      {c.crifScore}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        c.category === 'Prime / Low Risk' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                        c.category === 'Medium Risk' ? 'bg-amber-500/10 text-amber-600 border border-emerald-500/20' :
                        'bg-red-500/10 text-red-600 border border-red-500/20'
                      }`}>
                        {c.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        c.status === 'Completed' ? 'bg-[#89f5e7] text-[#005049]' : 'bg-amber-500/15 text-amber-700'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => loadCustomerIntoForm(c)}
                          className="p-1.5 bg-[#f2f4f6] text-[#091426] hover:bg-[#cbd5e1] rounded-lg transition-colors cursor-pointer border-none"
                          title="Edit Profile"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete customer ${c.fullName}?`)) {
                              onDeleteCustomer(c.id);
                            }
                          }}
                          className="p-1.5 bg-red-500/10 text-red-600 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer border-none"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-xs text-[#45474c] font-semibold">
                      No matching customer records found in memory ledger.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* FORM VIEW */
        <>
          {/* Main Form Fields Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        
        {/* Left Side: Attributes Fields Container */}
        <div className="lg:col-span-7 space-y-7">
          <div className="bg-white p-6 rounded-2xl border border-[#cbd5e1]/40 shadow-sm">
            <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-[#cbd5e1]/40">
              <User className="w-5 h-5 text-[#645efb]" />
              <h3 className="font-headline text-md font-bold text-[#091426]">Personal Information Record</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-[#cbd5e1] px-4 py-2.5 font-sans text-sm outline-none focus:ring-2 focus:ring-[#645efb]/30 focus:border-[#645efb] transition-all"
                  placeholder="Ex: Rahul Sharma"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Father's Name</label>
                <input
                  type="text"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  className="w-full rounded-xl border border-[#cbd5e1] px-4 py-2.5 font-sans text-sm outline-none focus:ring-2 focus:ring-[#645efb]/30 focus:border-[#645efb] transition-all"
                  placeholder="Ex: Vijay Sharma"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Contact Phone Number</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#45474c]">+91</span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-12 rounded-xl border border-[#cbd5e1] px-4 py-2.5 font-sans text-sm outline-none focus:ring-2 focus:ring-[#645efb]/30 focus:border-[#645efb] transition-all"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Aadhaar / ID Card Number</label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  className="w-full rounded-xl border border-[#cbd5e1] px-4 py-2.5 font-sans text-sm outline-none focus:ring-2 focus:ring-[#645efb]/30 focus:border-[#645efb] transition-all"
                  placeholder="XXXX XXXX XXXX"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-white rounded-xl border border-[#cbd5e1] px-4 py-2.5 font-sans text-sm outline-none focus:ring-2 focus:ring-[#645efb]/30 focus:border-[#645efb] transition-all"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Residential Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-[#cbd5e1] px-4 py-2.5 font-sans text-sm outline-none focus:ring-2 focus:ring-[#645efb]/30 focus:border-[#645efb] transition-all"
                  placeholder="Enter full permanent residential address details..."
                  rows={3}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-[#cbd5e1] px-4 py-2.5 font-sans text-sm outline-none focus:ring-2 focus:ring-[#645efb]/30 focus:border-[#645efb] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Postal Zip/Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full rounded-xl border border-[#cbd5e1] px-4 py-2.5 font-sans text-sm outline-none focus:ring-2 focus:ring-[#645efb]/30 focus:border-[#645efb] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Occupation Status</label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full rounded-xl border border-[#cbd5e1] px-4 py-2.5 font-sans text-sm outline-none focus:ring-2 focus:ring-[#645efb]/30 focus:border-[#645efb] transition-all text-[#091426] font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Introducer Reference Name</label>
                <input
                  type="text"
                  value={introducerName}
                  onChange={(e) => setIntroducerName(e.target.value)}
                  className="w-full rounded-xl border border-[#cbd5e1] px-4 py-2.5 font-sans text-sm outline-none focus:ring-2 focus:ring-[#645efb]/30 focus:border-[#645efb] transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: KYC Uploads & Assessment Visual Widgets */}
        <div className="lg:col-span-5 space-y-7">
          
          {/* Avatar Profile Picture Upload selection (Fully Interactive) */}
          <div className="bg-white p-5 rounded-2xl border border-[#cbd5e1]/40 shadow-sm">
            <h4 className="font-sans text-xs font-bold text-[#091426] uppercase tracking-wider mb-4">Upload / Select Profile Picture</h4>
            <div className="flex items-start gap-5">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border border-[#cbd5e1] shadow-sm transform group-hover:scale-105 transition-transform">
                  <img alt="Selected Profile" className="w-full h-full object-cover" src={selectedAvatar} />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#645efb] text-white p-1.5 rounded-full shadow-lg">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <p className="font-sans text-xs text-[#45474c] leading-relaxed">
                  Select a premium biometric portrait record or import an image. File size max 2MB.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  {premiumAvatars.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedAvatar(url)}
                      className={`w-9 h-9 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                        selectedAvatar === url ? 'border-[#645efb] scale-105 shadow-sm' : 'border-[#cbd5e1]/40'
                      }`}
                    >
                      <img className="w-full h-full object-cover" src={url} alt="" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Document upload Checklist */}
          <div className="bg-white p-5 rounded-2xl border border-[#cbd5e1]/40 shadow-sm">
            <h4 className="font-sans text-xs font-bold text-[#091426] uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#645efb]" />
              <span>Required Verification Documents</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div 
                onClick={() => setPanUploaded(!panUploaded)}
                className={`border rounded-xl p-3.5 cursor-pointer select-none transition-all text-left ${
                  panUploaded 
                    ? 'border-[#28a094] bg-[#89f5e7]/10 text-[#005049]' 
                    : 'border-[#cbd5e1] hover:border-[#645efb] text-[#45474c]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <FileText className="w-4 h-4" />
                  <span className="font-sans text-xs font-bold uppercase tracking-wider">PAN Card Uploaded</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wide">
                  {panUploaded ? 'Verified ✓' : 'Click to Upload'}
                </span>
              </div>

              <div 
                onClick={() => setUtilityBillUploaded(!utilityBillUploaded)}
                className={`border rounded-xl p-3.5 cursor-pointer select-none transition-all text-left ${
                  utilityBillUploaded 
                    ? 'border-[#28a094] bg-[#89f5e7]/10 text-[#005049]' 
                    : 'border-[#cbd5e1] hover:border-[#645efb] text-[#45474c]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <FileText className="w-4 h-4" />
                  <span className="font-sans text-xs font-bold uppercase tracking-wider">Utility Bill Uploaded</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wide">
                  {utilityBillUploaded ? 'Verified ✓' : 'Click to Upload'}
                </span>
              </div>
            </div>
          </div>

          {/* KYC Credit scoring gauge (DYNAMIC ACTIVE INTERACTION) */}
          <div className="bg-white p-6 rounded-2xl border border-[#cbd5e1]/40 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-[#cbd5e1]/20 pb-3">
              <span className="font-sans text-xs font-bold text-[#091426] uppercase tracking-wider">Credit Health Assessment</span>
              <span className="px-2 py-0.5 bg-[#89f5e7] text-[#005049] text-[9px] font-bold rounded uppercase tracking-wider">LIVE SYSTEM CHECK</span>
            </div>

            <div className="flex items-center justify-around py-2 gap-4">
              {/* Score Adjuster / Gauge */}
              <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
                {/* SVG Gauge */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" fill="transparent" r="46" stroke="#f1f5f9" strokeWidth="8" strokeLinecap="round" />
                  {/* Gauge active stroke. 2*PI*46=289. 289*0.75=216.7. Score out of 800. */}
                  <circle 
                    cx="56" 
                    cy="56" 
                    fill="transparent" 
                    r="46" 
                    stroke="#4b41e1" 
                    strokeWidth="10" 
                    strokeDasharray="289" 
                    strokeDashoffset={289 - (crifScore / 850) * 289}
                    strokeLinecap="round" 
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-1 text-center">
                  <span className="font-headline text-2xl font-black text-[#091426] leading-none">{crifScore}</span>
                  <span className="font-sans text-[9px] text-[#45474c] font-black uppercase mt-1 leading-none">CRIF Score</span>
                </div>
              </div>

              {/* Details & Adjust slider */}
              <div className="flex-1 space-y-3">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black uppercase text-[#45474c]">Quality Tier</p>
                  <p className="text-xs font-bold text-[#28a094]">{creditCategory}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black uppercase text-[#45474c]">Confidence Index</p>
                  <p className="text-xs font-medium text-[#191c1e]">{approvalProbability} Approval probability</p>
                </div>
                
                {/* Score slider directly adjusts the gauge to prove it's a real web app! */}
                <div className="space-y-1 bg-[#f7f9fb] p-2 rounded-lg border border-[#cbd5e1]/30">
                  <div className="flex justify-between text-[9px] font-bold text-[#45474c]">
                    <span>ADJUST SCORE</span>
                    <span>{crifScore}/850</span>
                  </div>
                  <input
                    type="range"
                    min="300"
                    max="850"
                    value={crifScore}
                    onChange={(e) => setCrifScore(Number(e.target.value))}
                    className="w-full accent-[#645efb] h-1 bg-[#eceef0] rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Internal Timeline Tracker */}
          <div className="bg-white p-5 rounded-2xl border border-[#cbd5e1]/40 shadow-sm">
            <h4 className="font-sans text-xs font-bold text-[#091426] uppercase tracking-wider mb-4">Internal Portfolio History</h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#cbd5e1] border-2 border-white ring-1 ring-[#cbd5e1]" />
                  <div className="w-px h-6 bg-[#cbd5e1]/60 mt-1" />
                </div>
                <div className="pb-1">
                  <p className="font-sans text-xs font-bold text-[#091426]">No Existing Active Loans</p>
                  <p className="text-[10px] text-[#45474c] font-medium">This client represents a new credit liability record in the ERP.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#645efb] ring-4 ring-[#645efb]/20" />
                </div>
                <div>
                  <p className="font-sans text-xs font-bold text-[#645efb]">Onboarding registration initiated</p>
                  <p className="text-[10px] text-[#45474c] font-semibold">Active registration session context in progress...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

          {/* Sticky Bottom Bar */}
          <div className="fixed bottom-0 left-[280px] right-0 bg-white border-t border-[#cbd5e1] p-4 flex items-center justify-between shadow-[0_-8px_30px_rgba(0,0,0,0.06)] z-30 select-none">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#eceef0] rounded-xl">
                <span className="w-1.5 h-1.5 rounded-full bg-[#645efb] animate-pulse" />
                <span className="font-sans text-xs font-bold text-[#45474c]">Document attachments synchronized</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleResetForm}
                className="px-5 py-2.5 border border-[#cbd5e1] text-[#091426] font-sans text-xs font-semibold rounded-xl hover:bg-[#f2f4f6] cursor-pointer transition-colors"
              >
                {editingCustomer ? 'Cancel Edit' : 'Reset Form Fields'}
              </button>
              
              <button 
                onClick={handleRegister}
                className="px-10 py-3 bg-[#091426] hover:bg-[#1e293b] text-white font-sans text-xs font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                {editingCustomer ? 'Save Changes' : 'Complete Registration'}
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
