/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Car, 
  Info, 
  FileText, 
  Upload, 
  Trash2, 
  UploadCloud, 
  Calendar, 
  TrendingUp, 
  CheckCircle,
  Eye,
  Plus
} from 'lucide-react';
import { Vehicle, Customer } from '../types';

interface VehiclesScreenProps {
  vehicles: Vehicle[];
  onAddVehicle: (vehicle: Vehicle) => void;
  customers: Customer[];
}

export default function VehiclesScreen({ vehicles, onAddVehicle, customers }: VehiclesScreenProps) {
  // Local state for the Purchase form entry (cleared of dummy/pre-filled values)
  const [makesMap, setMakesMap] = useState<Record<string, string[]>>({
    'BMW': ['M4 Competition'],
    'Audi': ['Q8 e-tron'],
    'Mercedes-Benz': ['C-Class', 'E-Class']
  });

  const [make, setMake] = useState('BMW');
  const [model, setModel] = useState('M4 Competition');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMakeName, setNewMakeName] = useState('');
  const [selectedModalMake, setSelectedModalMake] = useState('BMW');
  const [newModelName, setNewModelName] = useState('');

  const handleMakeChange = (selectedMake: string) => {
    setMake(selectedMake);
    const variants = makesMap[selectedMake] || [];
    setModel(variants[0] || '');
  };

  const handleAddMake = () => {
    if (!newMakeName.trim()) return;
    const makeKey = newMakeName.trim();
    if (!makesMap[makeKey]) {
      setMakesMap(prev => ({ ...prev, [makeKey]: [] }));
      setSelectedModalMake(makeKey);
      setNewMakeName('');
    } else {
      alert("Make already exists.");
    }
  };

  const handleAddVariant = () => {
    if (!selectedModalMake) {
      alert("Please select a Make first.");
      return;
    }
    if (!newModelName.trim()) return;
    const variantVal = newModelName.trim();
    setMakesMap(prev => {
      const current = prev[selectedModalMake] || [];
      if (!current.includes(variantVal)) {
        return {
          ...prev,
          [selectedModalMake]: [...current, variantVal]
        };
      }
      return prev;
    });
    setNewModelName('');
    alert(`Added model/variant "${variantVal}" under "${selectedModalMake}"`);
  };

  const handleUpdateMake = () => {
    if (!selectedModalMake) return;
    const newName = prompt("Enter new name for Make:", selectedModalMake);
    if (newName && newName.trim() && newName.trim() !== selectedModalMake) {
      const trimmedName = newName.trim();
      if (makesMap[trimmedName]) {
        alert("A make with this name already exists.");
        return;
      }
      setMakesMap(prev => {
        const next = { ...prev };
        next[trimmedName] = next[selectedModalMake];
        delete next[selectedModalMake];
        return next;
      });
      if (make === selectedModalMake) {
        setMake(trimmedName);
      }
      setSelectedModalMake(trimmedName);
    }
  };

  const handleDeleteMake = () => {
    if (!selectedModalMake) return;
    if (confirm(`Are you sure you want to delete make "${selectedModalMake}" and all its model variants?`)) {
      setMakesMap(prev => {
        const next = { ...prev };
        delete next[selectedModalMake];
        return next;
      });
      const remainingMakes = Object.keys(makesMap).filter(m => m !== selectedModalMake);
      const fallbackMake = remainingMakes[0] || '';
      setMake(fallbackMake);
      setModel(makesMap[fallbackMake]?.[0] || '');
      setSelectedModalMake(fallbackMake);
    }
  };

  const handleUpdateVariant = (targetMake: string, oldVariant: string) => {
    const newName = prompt(`Enter new name for Variant of "${targetMake}":`, oldVariant);
    if (newName && newName.trim() && newName.trim() !== oldVariant) {
      const trimmedName = newName.trim();
      setMakesMap(prev => {
        const currentVariants = prev[targetMake] || [];
        if (currentVariants.includes(trimmedName)) {
          alert("Variant already exists under this Make.");
          return prev;
        }
        return {
          ...prev,
          [targetMake]: currentVariants.map(v => v === oldVariant ? trimmedName : v)
        };
      });
      if (make === targetMake && model === oldVariant) {
        setModel(trimmedName);
      }
    }
  };

  const handleDeleteVariant = (targetMake: string, targetVariant: string) => {
    if (confirm(`Are you sure you want to delete variant "${targetVariant}" from "${targetMake}"?`)) {
      setMakesMap(prev => {
        const currentVariants = prev[targetMake] || [];
        return {
          ...prev,
          [targetMake]: currentVariants.filter(v => v !== targetVariant)
        };
      });
      if (make === targetMake && model === targetVariant) {
        const remaining = (makesMap[targetMake] || []).filter(v => v !== targetVariant);
        setModel(remaining[0] || '');
      }
    }
  };

  const [year, setYear] = useState<number | ''>('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [vin, setVin] = useState('');
  const [engineNo, setEngineNo] = useState('');
  const [fuelType, setFuelType] = useState<'Petrol' | 'Diesel' | 'Electric (EV)' | 'Hybrid'>('Petrol');
  const [purchasePrice, setPurchasePrice] = useState<number | ''>('');
  const [salePrice, setSalePrice] = useState<number | ''>('');

  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [fundingAccount, setFundingAccount] = useState('Main Operating Account (...4492)');
  const [sellerDetails, setSellerDetails] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [rcReceived, setRcReceived] = useState(false);
  const [activeInsurance, setActiveInsurance] = useState(false);

  const filteredCustomers = useMemo(() => {
    if (!sellerDetails) return customers;
    const query = sellerDetails.toLowerCase();
    return customers.filter(c => 
      c.fullName.toLowerCase().includes(query) ||
      c.phoneNumber.includes(query)
    );
  }, [customers, sellerDetails]);

  // Gallery main image (defaults to empty)
  const [mainImage, setMainImage] = useState('');

  // Attachment uploads list (defaults to empty)
  const [attachments, setAttachments] = useState<{ name: string; size: string }[]>([]);

  // Handle mock image selection or replacement
  const handleReplaceImage = () => {
    const newUrl = prompt("Enter a direct hotlinked image URL:", mainImage);
    if (newUrl !== null) {
      setMainImage(newUrl.trim());
    }
  };

  // Live ROI Calculations (handling empty/string inputs robustly)
  const calculatedProfit = useMemo(() => {
    const sale = Number(salePrice) || 0;
    const purchase = Number(purchasePrice) || 0;
    return Math.max(0, sale - purchase);
  }, [purchasePrice, salePrice]);

  const calculatedROI = useMemo(() => {
    const purchase = Number(purchasePrice) || 0;
    if (purchase <= 0) return 0;
    return Number(((calculatedProfit / purchase) * 100).toFixed(1));
  }, [purchasePrice, calculatedProfit]);

  // Handle scan mock
  const handleScanVIN = () => {
    setVin('WDD' + Math.floor(1000000000000 + Math.random() * 9000000000000));
    setRegistrationNo('MH-' + Math.floor(10 + Math.random() * 90) + '-' + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + '-' + Math.floor(1000 + Math.random() * 9000));
    alert("VIN successfully scanned! Autocompleted Chassis Number & Registration details.");
  };

  const handleFinalize = () => {
    if (!make || !model) {
      alert("Please fill in Make and Model to proceed.");
      return;
    }

    if (!sellerDetails.trim()) {
      alert("Please select or enter a registered customer as the seller.");
      return;
    }

    const matched = customers.some(
      (c) => {
        const optionLabel = `${c.fullName} - ${c.phoneNumber}`.trim().toLowerCase();
        const inputVal = sellerDetails.trim().toLowerCase();
        return optionLabel === inputVal || c.fullName.trim().toLowerCase() === inputVal;
      }
    );

    if (!matched) {
      alert("Seller must be a registered customer. Non-registered customers are not allowed.");
      return;
    }

    const newVehicle: Vehicle = {
      id: `VEH-${Math.floor(100 + Math.random() * 900)}`,
      make,
      model,
      year: Number(year) || new Date().getFullYear(),
      registrationNo,
      vin,
      engineNo,
      fuelType,
      purchasePrice: Number(purchasePrice) || 0,
      salePrice: Number(salePrice) || 0,
      purchaseDate,
      fundingAccount,
      sellerDetails,
      rcReceived,
      activeInsurance,
      image: mainImage || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
      status: 'Completed'
    };

    onAddVehicle(newVehicle);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to discard your draft?")) {
      setMake('BMW');
      setModel('M4 Competition');
      setYear('');
      setRegistrationNo('');
      setVin('');
      setEngineNo('');
      setPurchasePrice('');
      setSalePrice('');
      setPurchaseDate(new Date().toISOString().split('T')[0]);
      setFundingAccount('Main Operating Account (...4492)');
      setSellerDetails('');
      setRcReceived(false);
      setActiveInsurance(false);
      setMainImage('');
      setAttachments([]);
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
      {/* Page Title & Breadcrumb Block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#645efb] mb-1 font-sans text-[11px] font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#645efb]" />
            <span>Inventory Management</span>
          </div>
          <h2 className="font-headline text-3xl font-extrabold text-[#091426] tracking-tight">Vehicle Purchase Entry</h2>
        </div>
        <div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-[#645efb] hover:bg-[#4b41e1] text-white rounded-xl font-sans text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all border-none"
          >
            <Plus className="w-4 h-4" />
            <span>Add Make &amp; Variant</span>
          </button>
        </div>
      </div>

      {/* Dual Panel Page Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        
        {/* Left Grid: Forms Section */}
        <div className="lg:col-span-8 space-y-7">
          
          {/* Main Attributes Form Panel */}
          <div className="bg-white rounded-2xl border border-[#cbd5e1]/40 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#cbd5e1]/40 bg-[#f7f9fb]/50 flex items-center gap-2.5">
              <Info className="w-5 h-5 text-[#645efb]" />
              <h3 className="font-headline text-md font-bold text-[#091426]">Vehicle details</h3>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Vehicle Make</label>
                <select
                  value={make}
                  onChange={(e) => handleMakeChange(e.target.value)}
                  className="w-full bg-white rounded-xl border border-[#cbd5e1] px-4 py-2.5 font-sans text-sm outline-none focus:ring-2 focus:ring-[#645efb]/30 focus:border-[#645efb] transition-all cursor-pointer"
                >
                  <option value="">-- Select Make --</option>
                  {Object.keys(makesMap).map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Model Variant</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-white rounded-xl border border-[#cbd5e1] px-4 py-2.5 font-sans text-sm outline-none focus:ring-2 focus:ring-[#645efb]/30 focus:border-[#645efb] transition-all cursor-pointer"
                >
                  <option value="">-- Select Variant --</option>
                  {(makesMap[make] || []).map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Manufacturing Year</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#cbd5e1] px-4 py-2.5 font-sans text-sm outline-none focus:ring-2 focus:ring-[#645efb]/30 focus:border-[#645efb] transition-all"
                    placeholder="2023"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Registration No.</label>
                  <input
                    type="text"
                    value={registrationNo}
                    onChange={(e) => setRegistrationNo(e.target.value)}
                    className="w-full rounded-xl border border-[#cbd5e1] px-4 py-2.5 font-sans text-sm outline-none focus:ring-2 focus:ring-[#645efb]/30 focus:border-[#645efb] transition-all"
                    placeholder="ABC-1234"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Chassis Number (VIN)</label>
                <input
                  type="text"
                  value={vin}
                  onChange={(e) => setVin(e.target.value)}
                  className="w-full rounded-xl border border-[#cbd5e1] px-4 py-2.5 font-mono text-sm uppercase outline-none focus:ring-2 focus:ring-[#645efb]/30 focus:border-[#645efb] transition-all"
                  placeholder="17-letter code"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Engine Number</label>
                <input
                  type="text"
                  value={engineNo}
                  onChange={(e) => setEngineNo(e.target.value)}
                  className="w-full rounded-xl border border-[#cbd5e1] px-4 py-2.5 font-sans text-sm outline-none focus:ring-2 focus:ring-[#645efb]/30 focus:border-[#645efb] transition-all"
                  placeholder="EN-998234-X"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Fuel Type</label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value as any)}
                  className="w-full bg-white rounded-xl border border-[#cbd5e1] px-4 py-2.5 font-sans text-sm outline-none focus:ring-2 focus:ring-[#645efb]/30 focus:border-[#645efb] transition-all"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric (EV)">Electric (EV)</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Purchase Price (₹)</label>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#cbd5e1] px-4 py-2.5 font-sans font-semibold text-sm text-[#091426] outline-none focus:ring-2 focus:ring-[#645efb]/30 focus:border-[#645efb] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Sale Price (₹)</label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#cbd5e1] px-4 py-2.5 font-sans font-semibold text-sm text-[#645efb] outline-none focus:ring-2 focus:ring-[#645efb]/30 focus:border-[#645efb] transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Documentation & Compliance Panel */}
          <div className="bg-white rounded-2xl border border-[#cbd5e1]/40 shadow-sm">
            <div className="p-5 border-b border-[#cbd5e1]/40 bg-[#f7f9fb]/50 flex items-center gap-2.5 rounded-t-2xl">
              <FileText className="w-5 h-5 text-[#645efb]" />
              <h3 className="font-headline text-md font-bold text-[#091426]">Documentation &amp; Compliance</h3>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Purchase Date</label>
                  <input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="w-full rounded-xl border border-[#cbd5e1] px-4 py-2.5 font-sans text-sm outline-none focus:ring-2 focus:ring-[#645efb]/30 focus:border-[#645efb] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Funding Account Source</label>
                  <select
                    value={fundingAccount}
                    onChange={(e) => setFundingAccount(e.target.value)}
                    className="w-full bg-white rounded-xl border border-[#cbd5e1] px-4 py-2.5 font-sans text-sm outline-none focus:ring-2 focus:ring-[#645efb]/30 focus:border-[#645efb] transition-all"
                  >
                    <option>Main Operating Account (...4492)</option>
                    <option>Secondary Reserve (...1102)</option>
                    <option>Cash Petty Vault</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 relative">
                  <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">
                    Seller Name <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={sellerDetails}
                    onChange={(e) => {
                      setSellerDetails(e.target.value);
                      setDropdownOpen(true);
                    }}
                    onFocus={() => setDropdownOpen(true)}
                    onBlur={() => {
                      setTimeout(() => setDropdownOpen(false), 200);
                    }}
                    className="w-full rounded-xl border border-[#cbd5e1] px-4 py-2.5 font-sans text-sm outline-none focus:ring-2 focus:ring-[#645efb]/30 focus:border-[#645efb] transition-all"
                    placeholder="Search by name or mobile number..."
                  />
                  {dropdownOpen && filteredCustomers.length > 0 && (
                    <div className="absolute left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto bg-white border border-[#cbd5e1] rounded-xl shadow-lg">
                      {filteredCustomers.map((c) => (
                        <div
                          key={c.id}
                          onMouseDown={() => {
                            setSellerDetails(`${c.fullName} - ${c.phoneNumber}`);
                            setDropdownOpen(false);
                          }}
                          className="px-4 py-2 hover:bg-[#f2f4f6] cursor-pointer flex justify-between items-center text-xs font-sans border-b border-[#cbd5e1]/20 last:border-b-0 text-left"
                        >
                          <div>
                            <span className="font-bold text-[#091426]">{c.fullName}</span>
                            <span className="text-[#45474c] ml-2 text-[10px] font-semibold">{c.phoneNumber}</span>
                          </div>
                          <span className="text-[9px] bg-[#645efb]/10 text-[#645efb] px-1.5 py-0.5 rounded font-mono font-bold">{c.id}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {dropdownOpen && filteredCustomers.length === 0 && (
                    <div className="absolute left-0 right-0 z-50 mt-1 p-3 bg-white border border-[#cbd5e1] rounded-xl shadow-lg text-[11px] text-red-500 font-semibold text-left">
                      No registered customer matches this name.
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-6 pt-5">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs font-bold uppercase tracking-wider text-[#45474c]">
                    <input
                      type="checkbox"
                      checked={rcReceived}
                      onChange={(e) => setRcReceived(e.target.checked)}
                      className="w-4 h-4 text-[#645efb] border-[#cbd5e1] rounded focus:ring-[#645efb]"
                    />
                    <span>RC Received</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs font-bold uppercase tracking-wider text-[#45474c]">
                    <input
                      type="checkbox"
                      checked={activeInsurance}
                      onChange={(e) => setActiveInsurance(e.target.checked)}
                      className="w-4 h-4 text-[#645efb] border-[#cbd5e1] rounded focus:ring-[#645efb]"
                    />
                    <span>Active Insurance</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Grid: Media & Widgets Column */}
        <div className="lg:col-span-4 space-y-7">
          
          {/* Gallery Media Box */}
          <div className="bg-white rounded-2xl border border-[#cbd5e1]/40 shadow-sm p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-bold text-[#091426] uppercase tracking-wider">Vehicle Gallery</span>
              <span className="text-[10px] text-[#45474c] font-medium font-mono uppercase">JPG/PNG up to 10MB</span>
            </div>

            <div 
              onClick={handleReplaceImage}
              className="relative group cursor-pointer border-2 border-dashed border-[#cbd5e1] hover:border-[#645efb]/60 rounded-xl aspect-[4/3] flex flex-col items-center justify-center bg-[#f7f9fb]/50 overflow-hidden transition-all duration-300"
            >
              {mainImage ? (
                <img 
                  className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" 
                  src={mainImage} 
                  alt="Active Vehicle image"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-[#45474c]/60">
                  <UploadCloud className="w-10 h-10 text-[#cbd5e1]" />
                  <span className="font-sans text-xs font-bold uppercase tracking-wider">No Image Selected</span>
                </div>
              )}
              <div className="relative z-10 flex flex-col items-center gap-1.5 bg-white/70 backdrop-blur-sm p-3 py-2 rounded-full group-hover:bg-white/90 shadow-sm transition-all text-center">
                <UploadCloud className="w-4.5 h-4.5 text-[#645efb]" />
                <span className="font-sans text-[10px] font-bold text-[#091426] uppercase tracking-wide">Replace Main Image</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {[mainImage, '', '', ''].map((img, index) => (
                <div 
                  key={index} 
                  className={`aspect-square rounded-xl border flex items-center justify-center relative bg-[#f2f4f6] cursor-pointer hover:border-[#645efb] transition-all overflow-hidden ${
                    index === 0 ? 'border-[#645efb] ring-2 ring-[#645efb]/20' : 'border-[#cbd5e1]/50'
                  }`}
                >
                  {img ? (
                    <img className="w-full h-full object-cover" src={img} alt="" />
                  ) : (
                    <Plus className="w-4 h-4 text-[#45474c]/60" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Attachments Area */}
          <div className="bg-white rounded-2xl border border-[#cbd5e1]/40 shadow-sm p-6">
            <h4 className="font-headline text-md font-bold text-[#091426] mb-4 flex items-center gap-2">
              <span className="material-symbols text-[20px] text-[#645efb]">attach_file</span>
              <span>Required Attachments</span>
            </h4>

            <div className="space-y-3">
              {attachments.map((file, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-3 rounded-xl border border-[#cbd5e1]/50 bg-[#f7f9fb] hover:border-[#645efb]/40 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#ba1a1a]" />
                    <div>
                      <p className="font-sans text-xs font-semibold text-[#091426] truncate max-w-[140px]">{file.name}</p>
                      <p className="text-[10px] text-[#45474c] font-bold font-mono tracking-wider">{file.size}</p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setAttachments(attachments.filter((_, idx) => idx !== i));
                    }}
                    className="p-1 hover:bg-[#ffdad6] text-[#ba1a1a] rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <label className="flex items-center justify-center p-3.5 rounded-xl border border-dashed border-[#cbd5e1] hover:bg-[#f2f4f6] transition-colors cursor-pointer text-[#45474c] hover:text-[#645efb] group">
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const f = e.target.files[0];
                      setAttachments([...attachments, { name: f.name, size: (f.size / (1024 * 1024)).toFixed(1) + ' MB' }]);
                    }
                  }}
                />
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="font-sans text-xs font-bold uppercase tracking-wider">Upload New Document</span>
                </div>
              </label>
            </div>
          </div>

          {/* Financial Summary Estimate ROI Widget (DYNAMIC!) */}
          <div className="bg-[#091426] text-white rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10">
              <p className="text-[#8590a6] text-[10px] font-bold uppercase tracking-widest">Profit Estimate (Live)</p>
              
              <div className="flex items-baseline gap-2.5 mt-1.5">
                <span className="font-headline text-3xl font-black">{calculatedProfit.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}</span>
                <span className={`text-xs font-bold bg-[#89f5e7] text-[#005049] px-2.5 py-0.5 rounded-full`}>
                  {calculatedROI >= 0 ? `+${calculatedROI}% ROI` : `${calculatedROI}% ROI`}
                </span>
              </div>

              <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
                <div className="flex justify-between text-xs font-medium text-white/70">
                  <span>Estimated Holding Time</span>
                  <span className="text-white font-semibold">45 Days</span>
                </div>
                <div className="flex justify-between text-xs font-medium text-white/70">
                  <span>Interest Cost Overhead</span>
                  <span className="text-white font-semibold font-mono">₹3,000/day</span>
                </div>
              </div>
            </div>
            
            {/* Ambient Background Watermark */}
            <div className="absolute -right-8 -bottom-8 opacity-5 text-white">
              <Car className="w-36 h-36" />
            </div>
          </div>
        </div>
      </div>

      {/* Primary Log History Table */}
      <div className="bg-white rounded-2xl border border-[#cbd5e1]/40 shadow-sm overflow-hidden mt-8">
        <div className="p-5 border-b border-[#cbd5e1]/40 flex items-center justify-between">
          <h3 className="font-headline text-md font-bold text-[#091426]">Recent Purchase History</h3>
          <span className="font-sans text-xs text-[#45474c] font-semibold">{vehicles.length} Total Registered Vehicles</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f2f4f6] text-[11px] uppercase tracking-wider text-[#45474c] font-bold border-b border-[#cbd5e1]/40">
              <tr>
                <th className="px-6 py-3.5">Purchase Date</th>
                <th className="px-6 py-3.5">Vehicle Description</th>
                <th className="px-6 py-3.5">Chassis Code (VIN)</th>
                <th className="px-6 py-3.5">Inventory Cost</th>
                <th className="px-6 py-3.5">Sales Goal Price</th>
                <th className="px-6 py-3.5">RC Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#cbd5e1]/20 font-sans text-xs">
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-[#f7f9fb] transition-colors">
                  <td className="px-6 py-4 font-semibold text-[#091426]">{v.purchaseDate}</td>
                  <td className="px-6 py-4 font-bold text-[#191c1e]">{v.year} {v.make} {v.model}</td>
                  <td className="px-6 py-4 font-mono text-[#45474c]">{v.vin}</td>
                  <td className="px-6 py-4 font-black text-[#091426]">
                    {v.purchasePrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                  </td>
                  <td className="px-6 py-4 font-semibold text-[#645efb]">
                    {v.salePrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 font-semibold px-2.5 py-0.5 rounded-full ${
                      v.rcReceived 
                        ? 'bg-[#89f5e7] text-[#005049]' 
                        : 'bg-[#ffdad6] text-[#ba1a1a]'
                    }`}>
                      <CheckCircle className="w-3 h-3" />
                      <span>{v.rcReceived ? 'RC Lock' : 'Pending RC'}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sticky Action Footer Bar */}
      <div className="fixed bottom-0 right-0 left-[280px] bg-white border-t border-[#cbd5e1] p-4 flex items-center justify-between shadow-[0_-8px_30px_rgba(0,0,0,0.06)] z-30 select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#eceef0] rounded-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-[#28a094] animate-pulse" />
            <span className="font-sans text-xs font-bold text-[#45474c]">All fields calculated</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleReset}
            className="px-5 py-2.5 border border-[#cbd5e1] text-[#091426] font-sans text-xs font-semibold rounded-xl hover:bg-[#f2f4f6] cursor-pointer transition-colors"
          >
            Discard Draft
          </button>
          
          <button 
            onClick={handleFinalize}
            className="px-8 py-3 bg-[#645efb] text-white font-sans text-xs font-bold rounded-xl shadow-lg shadow-[#645efb]/30 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle className="w-4.5 h-4.5" />
            <span>Finalize Purchase</span>
          </button>
        </div>
      </div>

      {/* Add Make & Variant Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-[#091426] z-50 cursor-pointer"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="fixed inset-0 m-auto max-w-md h-fit bg-white border border-[#cbd5e1] rounded-2xl p-6 shadow-2xl z-50 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-3 border-b border-[#cbd5e1]/40">
                <h3 className="font-headline text-md font-bold text-[#091426]">Add Vehicle Make &amp; Variant</h3>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-[#eceef0] flex items-center justify-center text-[#45474c] transition-colors cursor-pointer border-none bg-transparent"
                >
                  <Plus className="w-5 h-5 transform rotate-45" />
                </button>
              </div>

              {/* Form body */}
              <div className="space-y-6 mt-4">
                {/* Add Make section */}
                <div className="space-y-2.5 p-4 bg-[#f7f9fb] border border-[#cbd5e1]/30 rounded-xl">
                  <h4 className="text-xs font-bold text-[#091426] uppercase tracking-wider text-left">1. Create New Vehicle Make</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMakeName}
                      onChange={(e) => setNewMakeName(e.target.value)}
                      className="flex-1 border border-[#cbd5e1] rounded-xl px-3 py-2 font-sans text-xs outline-none focus:ring-2 focus:ring-[#645efb]"
                      placeholder="Enter make (e.g. Hero, Toyota)"
                    />
                    <button
                      type="button"
                      onClick={handleAddMake}
                      className="px-4 py-2 bg-[#645efb] hover:bg-[#4b41e1] text-white font-sans text-xs font-bold rounded-xl transition-all cursor-pointer border-none shadow-sm"
                    >
                      Add Make
                    </button>
                  </div>
                </div>

                {/* Add Variant section */}
                <div className="space-y-2.5 p-4 bg-[#f7f9fb] border border-[#cbd5e1]/30 rounded-xl text-left">
                  <h4 className="text-xs font-bold text-[#091426] uppercase tracking-wider">2. Add Variant to Make</h4>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-[#45474c] uppercase">Select Make</label>
                      <select
                        value={selectedModalMake}
                        onChange={(e) => setSelectedModalMake(e.target.value)}
                        className="w-full bg-white border border-[#cbd5e1] rounded-xl px-3 py-2 font-sans text-xs outline-none focus:ring-2 focus:ring-[#645efb]"
                      >
                        <option value="">-- Choose Make --</option>
                        {Object.keys(makesMap).map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-[#45474c] uppercase">Model Name / Variant</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newModelName}
                          onChange={(e) => setNewModelName(e.target.value)}
                          className="flex-1 border border-[#cbd5e1] rounded-xl px-3 py-2 font-sans text-xs outline-none focus:ring-2 focus:ring-[#645efb]"
                          placeholder="Enter model (e.g. Activa, Fortuner)"
                        />
                        <button
                          type="button"
                          onClick={handleAddVariant}
                          className="px-4 py-2 bg-[#091426] hover:bg-[#1e293b] text-white font-sans text-xs font-bold rounded-xl transition-all cursor-pointer border-none shadow-sm"
                        >
                          Add Variant
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Manage Makes & Variants CRUD section */}
                <div className="space-y-2.5 p-4 bg-[#f7f9fb] border border-[#cbd5e1]/30 rounded-xl text-left">
                  <h4 className="text-xs font-bold text-[#091426] uppercase tracking-wider">3. Manage Makes &amp; Variants</h4>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-[#45474c] uppercase">Select Make to Manage</label>
                      <div className="flex gap-2">
                        <select
                          value={selectedModalMake}
                          onChange={(e) => setSelectedModalMake(e.target.value)}
                          className="flex-1 bg-white border border-[#cbd5e1] rounded-xl px-3 py-2 font-sans text-xs outline-none focus:ring-2 focus:ring-[#645efb]"
                        >
                          <option value="">-- Choose Make --</option>
                          {Object.keys(makesMap).map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                        {selectedModalMake && (
                          <>
                            <button
                              type="button"
                              onClick={handleUpdateMake}
                              className="px-2.5 py-2 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 text-xs font-bold rounded-xl transition-all cursor-pointer border-none"
                              title="Rename Make"
                            >
                              Rename
                            </button>
                            <button
                              type="button"
                              onClick={handleDeleteMake}
                              className="px-2.5 py-2 bg-red-500/10 text-red-600 hover:bg-red-500/20 text-xs font-bold rounded-xl transition-all cursor-pointer border-none"
                              title="Delete Make"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {selectedModalMake && (makesMap[selectedModalMake] || []).length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-[#cbd5e1]/30">
                        <label className="block text-[10px] font-bold text-[#45474c] uppercase">Variants ({makesMap[selectedModalMake].length})</label>
                        <div className="max-h-32 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
                          {makesMap[selectedModalMake].map((v) => (
                            <div key={v} className="flex justify-between items-center bg-white border border-[#cbd5e1]/30 px-3 py-1.5 rounded-lg">
                              <span className="font-sans text-xs text-[#091426]">{v}</span>
                              <div className="flex gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateVariant(selectedModalMake, v)}
                                  className="p-1 hover:bg-[#f2f4f6] text-[#645efb] rounded transition-colors border-none bg-transparent cursor-pointer"
                                  title="Rename Variant"
                                >
                                  Rename
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteVariant(selectedModalMake, v)}
                                  className="p-1 hover:bg-[#ffdad6] text-red-600 rounded transition-colors border-none bg-transparent cursor-pointer"
                                  title="Delete Variant"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Close/Done button */}
                <div className="flex justify-end pt-3 border-t border-[#cbd5e1]/40">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-6 py-2 bg-[#f2f4f6] hover:bg-[#eceef0] text-[#091426] font-sans text-xs font-bold rounded-xl transition-all cursor-pointer border-none"
                  >
                    Done / Close
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
