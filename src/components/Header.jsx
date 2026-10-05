import React from 'react';
import { Building2, Search, FileSpreadsheet, ShieldCheck } from 'lucide-react';

export default function Header({ totalLeads, priorityCount, qualifiedCount }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Title & Subtitle */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-lg shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              VCFO B2B Lead Finder <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200 ml-2">India Mid-Market</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Automated public signal lead research for Virtual CFO services (₹5 Cr – ₹50 Cr ARR | 20-250 Employees)
            </p>
          </div>
        </div>

        {/* Stats Badges */}
        <div className="flex items-center space-x-3 text-xs font-medium text-slate-600 self-end md:self-auto">
          <div className="bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200 flex items-center space-x-1.5">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Total Mined: <strong className="text-slate-900 font-semibold">{totalLeads}</strong></span>
          </div>

          <div className="bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200 text-emerald-800 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Priority Leads: <strong className="font-bold">{priorityCount}</strong></span>
          </div>

          <div className="bg-blue-50 px-3 py-1.5 rounded-md border border-blue-200 text-blue-800 flex items-center space-x-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
            <span>Qualified: <strong className="font-bold">{qualifiedCount}</strong></span>
          </div>
        </div>

      </div>
    </header>
  );
}
