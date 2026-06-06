/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, IndianRupee, User, Car, Check } from 'lucide-react';
import { Transaction } from '../types';

interface QuickTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (txn: Transaction) => void;
}

export default function QuickTransactionModal({ isOpen, onClose, onSubmit }: QuickTransactionModalProps) {
  const [customer, setCustomer] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'Success' | 'Failed' | 'Pending'>('Success');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || !vehicle || !amount) {
      alert("Please fill in all transaction attributes.");
      return;
    }

    const uniqueId = `#TXN-${Math.floor(80000 + Math.random() * 9000)}`;
    const newTxn: Transaction = {
      id: uniqueId,
      customer,
      vehicle,
      amount: Number(amount),
      status,
      date: new Date().toISOString().split('T')[0]
    };

    onSubmit(newTxn);
    setCustomer('');
    setVehicle('');
    setAmount('');
    setStatus('Success');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay mask */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
              <h3 className="font-headline text-md font-bold text-[#091426]">Record New ERP Transaction</h3>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-[#eceef0] flex items-center justify-center text-[#45474c] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#645efb]" />
                  <span>Borrower Customer Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="w-full border border-[#cbd5e1] rounded-xl px-4 py-2.5 font-sans text-xs font-medium text-[#191c1e] outline-none focus:ring-2 focus:ring-[#645efb]"
                  placeholder="Ex: Eleanor Shellstrop"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-[#645efb]" />
                  <span>Purchased Fleet Variant</span>
                </label>
                <input
                  type="text"
                  required
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="w-full border border-[#cbd5e1] rounded-xl px-4 py-2.5 font-sans text-xs font-medium text-[#191c1e] outline-none focus:ring-2 focus:ring-[#645efb]"
                  placeholder="Ex: 2023 Tesla Model Y"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4 text-[#645efb]" />
                  <span>Installment Transaction Amount (₹)</span>
                </label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border border-[#cbd5e1] rounded-xl px-4 py-2.5 font-sans text-xs font-semibold text-[#091426] outline-none focus:ring-2 focus:ring-[#645efb]"
                  placeholder="1240.00"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#45474c] uppercase tracking-wider">Transaction Compliance Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Success', 'Pending', 'Failed'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-center ${
                        status === s
                          ? s === 'Success'
                            ? 'bg-[#89f5e7] hover:bg-[#6bd8cb] text-[#005049] border-[#005049]/30'
                            : s === 'Failed'
                            ? 'bg-[#ffdad6] hover:bg-red-200 text-[#ba1a1a] border-[#ba1a1a]/30'
                            : 'bg-[#eceef0] hover:bg-gray-300 text-[#45474c] border-gray-400/40'
                          : 'border-[#cbd5e1] text-[#45474c] hover:bg-[#eceef0]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Confirm submit */}
              <div className="flex gap-3 pt-4 border-t border-[#cbd5e1]/40 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-white hover:bg-[#eceef0] border border-[#cbd5e1] font-sans text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer text-[#45474c]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#091426] hover:bg-[#1e293b] text-white font-sans text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg shadow-[#091426]/10 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Record Entry</span>
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
