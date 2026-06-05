/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Search, MapPin, Bell, ChevronDown } from 'lucide-react';

interface HeaderProps {
  branch: string;
  setBranch: (branch: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  user: { username: string; fullName: string; role: 'admin' | 'user' | 'demo' } | null;
  onLogout: () => void;
}

export default function Header({ branch, setBranch, searchQuery, setSearchQuery, user, onLogout }: HeaderProps) {
  const [showBranches, setShowBranches] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const branches = [
    'Downtown Branch',
    'Main Branch - New York',
    'West End Boston',
    'San Francisco Hub'
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-[#cbd5e1]/40 flex items-center justify-between h-16 px-8 select-none">
      {/* Search Bar Container */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#45474c] w-4.5 h-4.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f2f4f6] border-none rounded-full pl-11 pr-4 py-2 font-sans text-sm text-[#191c1e] placeholder-[#45474c] focus:ring-2 focus:ring-[#645efb] focus:bg-white outline-none transition-all duration-150"
            placeholder="Search VIN, customer title, ID, or account key..."
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-5">
        {/* Branch Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowBranches(!showBranches)}
            className="px-4 py-2 border border-[#cbd5e1] rounded-xl font-sans text-xs font-semibold text-[#191c1e] hover:bg-[#f2f4f6] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-[#645efb]" />
            <span>{branch}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-[#45474c] transition-transform duration-200 ${showBranches ? 'rotate-180' : ''}`} />
          </button>

          {showBranches && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowBranches(false)} />
              <div className="absolute right-0 mt-1.5 w-56 bg-white border border-[#cbd5e1]/40 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-[#eceef0]">
                {branches.map((b) => (
                  <button
                    key={b}
                    onClick={() => {
                      setBranch(b);
                      setShowBranches(false);
                    }}
                    className={`w-full text-left px-4 py-3 font-sans text-xs font-medium cursor-pointer transition-colors ${
                      branch === b
                        ? 'bg-[#645efb]/10 text-[#645efb] font-semibold'
                        : 'text-[#191c1e] hover:bg-[#f7f9fb]'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Notifications and Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-[#cbd5e1]/40">
          <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#eceef0] text-[#45474c] transition-all cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#ba1a1a] rounded-full border border-white" />
          </button>

          {/* Connected User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-3 pl-1 cursor-pointer group focus:outline-none border-none bg-transparent"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#cbd5e1]/50 shadow-sm transition-transform group-hover:scale-105">
                <img
                  alt="Admin User Profile"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_CHOpcIOlr1l0dIXGDiNbKrjxLia70lvfm1LkafXCwY54R4DhhRdSct8NXQUzlKath2g3xlR78eGvGh9aGGkl27cSUOB2LddAzac5K1CdtAB_gt5kVHoDMKAfxaA3amsuzVUKUvHCeucLPhWuVTVGl558spshC6OrIJW2PlDnNPVByb3pQOFHB8qIQ9O8wUCeptMON72XbwdlWmiaVmRy2PkfJ3rByC3Gua7I0_iKKx5tUo82kXSBGFTm1iHA4CVqQaBp2NXrGnM"
                />
              </div>
              <div className="hidden lg:block text-left">
                <p className="font-sans text-xs font-semibold text-[#091426] leading-none">{user?.fullName || 'Admin User'}</p>
                <span className="font-sans text-[10px] text-[#45474c] mt-0.5 block leading-none">
                  {user?.role === 'admin' ? 'Admin' : user?.role === 'user' ? 'User' : user?.role === 'demo' ? 'Demo' : 'Admin'}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[#45474c] transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showProfileDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfileDropdown(false)} />
                <div className="absolute right-0 mt-1.5 w-48 bg-white border border-[#cbd5e1]/40 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 bg-[#f7f9fb] border-b border-[#eceef0]">
                    <p className="text-[10px] font-bold text-[#45474c] uppercase tracking-wider">Logged in as</p>
                    <p className="text-xs font-semibold text-[#091426] mt-0.5 font-mono truncate">{user?.username}</p>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 font-sans text-xs font-semibold text-[#ba1a1a] hover:bg-[#ba1a1a]/5 transition-colors cursor-pointer border-none bg-transparent"
                  >
                    Sign Out / Exit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
