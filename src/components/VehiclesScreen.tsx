/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
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
import { Vehicle } from '../types';

interface VehiclesScreenProps {
  vehicles: Vehicle[];
  onAddVehicle: (vehicle: Vehicle) => void;
}

export default function VehiclesScreen({ vehicles, onAddVehicle }: VehiclesScreenProps) {
  // Local state for the Purchase form entry
  const [make, setMake] = useState('Mercedes-Benz');
  const [model, setModel] = useState('C-Class');
  const [year, setYear] = useState(2023);
  const [registrationNo, setRegistrationNo] = useState('ABC-1234');
  const [vin, setVin] = useState('WDD1234567M891023');
  const [engineNo, setEngineNo] = useState('M274-DE20');
  const [fuelType, setFuelType] = useState<'Petrol' | 'Diesel' | 'Electric (EV)' | 'Hybrid'>('Petrol');
  const [purchasePrice, setPurchasePrice] = useState(38000);
  const [salePrice, setSalePrice] = useState(42250);

  const [purchaseDate, setPurchaseDate] = useState('2023-10-25');
  const [fundingAccount, setFundingAccount] = useState('Main Operating Account (...4492)');
  const [sellerDetails, setSellerDetails] = useState('Premium Star Dealership');
  const [rcReceived, setRcReceived] = useState(true);
  const [activeInsurance, setActiveInsurance] = useState(true);

  // Gallery main image (defaults to the premium car)
  const [mainImage, setMainImage] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuBaTwRYF4nGGvEyKAXeQ2TJxh85EwhuOYeA8e67uEzFe3kBYfhP6G0Di6hPLILSq1x-iplCJYGIzaEA-kVQQp7ry0LOGjay68UeV09NQl_Q6MQG1tzYIuDRowxiGnTPHqCnKF2ruLlHRIg80uOl8Cfx6vjiyiCcBzx07AWtQD5lj9bxdaEqLdLF4xojGVims1OgBOgEXEj0PdUk4O3fO0VQy9zrMTOslUwsm6EaZ105HllOTodUt9Fy4CUTYbC6WLsR3Cbn2NFbDw8');

  // Attachment uploads list
  const [attachments, setAttachments] = useState<{ name: string; size: string }[]>([
    { name: 'Original_RC_Doc.pdf', size: '1.2 MB' }
  ]);

  // Handle mock image selection or replacement
  const handleReplaceImage = () => {
    const newUrl = prompt("Enter a direct hotlinked image URL or use our premium default:", mainImage);
    if (newUrl && newUrl.trim() !== "") {
      setMainImage(newUrl);
    }
  };

  // Live ROI Calculations
  const calculatedProfit = useMemo(() => {
    return Math.max(0, salePrice - purchasePrice);
  }, [purchasePrice, salePrice]);

  const calculatedROI = useMemo(() => {
    if (purchasePrice <= 0) return 0;
    return Number(((calculatedProfit / purchasePrice) * 100).toFixed(1));
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

    const newVehicle: Vehicle = {
      id: `VEH-${Math.floor(100 + Math.random() * 900)}`,
      make,
      model,
      year: Number(year),
      registrationNo,
      vin,
      engineNo,
      fuelType,
      purchasePrice: Number(purchasePrice),
      salePrice: Number(salePrice),
      purchaseDate,
      fundingAccount,
      sellerDetails,
      rcReceived,
      activeInsurance,
      image: mainImage,
      status: 'Completed'
    };

    onAddVehicle(newVehicle);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to discard your draft?")) {
      setMake('Mercedes-Benz');
      setModel('C-Class');
      setYear(2023);
      setRegistrationNo('ABC-1234');
      setVin('WDD1234567M891023');
      setEngineNo('M274-DE20');
      setPurchasePrice(38000);
      setSalePrice(42250);
      setRcReceived(true);
      setActiveInsurance(true);
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
            onClick={handleScanVIN}
            className="px-4 py-2.5 bg-white hover:bg-[#eceef0] border border-[#cbd5e1] rounded-xl font-sans text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm transition-all"
          >
            <Car className="w-4 h-4 text-[#645efb]" />
            <span>Scan VIN via Camera</span>
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
                <input
                  type="text"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="w-full rounded-xl border border-[#cbd5e1] px-4 py-2.5 font-sans text-sm outline-none focus:ring-2 focus:ring-[#645efb]/30 focus:border-[#645efb] transition-all"
                  placeholder="e.g. Mercedes-Benz"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Model Variant</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full rounded-xl border border-[#cbd5e1] px-4 py-2.5 font-sans text-sm outline-none focus:ring-2 focus:ring-[#645efb]/30 focus:border-[#645efb] transition-all"
                  placeholder="e.g. C-Class"
                />
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
                  <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Purchase Price ($)</label>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#cbd5e1] px-4 py-2.5 font-sans font-semibold text-sm text-[#091426] outline-none focus:ring-2 focus:ring-[#645efb]/30 focus:border-[#645efb] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Sale Price ($)</label>
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
          <div className="bg-white rounded-2xl border border-[#cbd5e1]/40 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#cbd5e1]/40 bg-[#f7f9fb]/50 flex items-center gap-2.5">
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
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Seller / Dealership Name</label>
                  <input
                    type="text"
                    value={sellerDetails}
                    onChange={(e) => setSellerDetails(e.target.value)}
                    className="w-full rounded-xl border border-[#cbd5e1] px-4 py-2.5 font-sans text-sm outline-none focus:ring-2 focus:ring-[#645efb]/30 focus:border-[#645efb] transition-all"
                    placeholder="Full name or Dealership"
                  />
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
              <img 
                className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" 
                src={mainImage} 
                alt="Active Vehicle image"
              />
              <div className="absolute inset-0 bg-[#091426]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" />
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
                <span className="font-headline text-3xl font-black">{calculatedProfit.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}</span>
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
                  <span className="text-white font-semibold font-mono">$42.00/day</span>
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
                    {v.purchasePrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </td>
                  <td className="px-6 py-4 font-semibold text-[#645efb]">
                    {v.salePrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
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
    </motion.div>
  );
}
