import React, { useState } from 'react';
import { FileSpreadsheet, Download, Copy, Search, Check } from 'lucide-react';
import { exportToExcel, exportToCSV } from '../utils/leadEngine';

export default function ExportBar({ leads, searchFilter, setSearchFilter }) {
  const [copied, setCopied] = useState(false);

  const handleExportExcel = () => {
    exportToExcel(leads, `VCFO_B2B_Leads_India_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const handleExportCSV = () => {
    exportToCSV(leads, `VCFO_B2B_Leads_India_${new Date().toISOString().slice(0,10)}.csv`);
  };

  const handleCopyClipboard = () => {
    if (!leads || leads.length === 0) return;
    
    const headers = [
      "S.No", "Company Name", "Website", "Sector / Sub-sector", "Location", 
      "Business Description", "Revenue Indicator (5-50 Cr)", "Employee Indicator", 
      "Finance Maturity Signal", "Decision-Maker Name", "Role", "Source", 
      "Verified Contact Route", "Pain Signal", "Growth Event / Trigger", 
      "Lead Score", "Status", "Data Confidence"
    ];

    const rows = leads.map(l => [
      l.sNo,
      l.companyName,
      l.website,
      `${l.sector} - ${l.subSector || ''}`,
      l.location,
      l.businessDescription,
      l.revenueIndicator,
      l.employeeIndicator,
      l.financeMaturitySignal,
      l.decisionMakerName,
      l.role,
      l.source,
      l.verifiedContactRoute,
      l.painSignal,
      l.growthEventTrigger,
      l.leadScore,
      l.status,
      l.dataConfidence
    ].join('\t'));

    const tabDelimited = [headers.join('\t'), ...rows].join('\n');
    
    navigator.clipboard.writeText(tabDelimited).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-slate-100 border border-slate-200 rounded-lg p-3 mb-4 flex flex-col md:flex-row items-center justify-between gap-3">
      
      {/* Left: Quick Search Filter */}
      <div className="relative w-full md:w-80">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Filter displayed results..."
          className="w-full bg-white border border-slate-300 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Right: Export Buttons */}
      <div className="flex flex-wrap items-center space-x-2 w-full md:w-auto justify-end">
        
        {/* Copy to Clipboard */}
        <button
          onClick={handleCopyClipboard}
          className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium px-3 py-1.5 rounded-md text-xs flex items-center space-x-1.5 shadow-sm"
          title="Copy tab-delimited table to paste into Google Sheets or Excel"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Copied Table!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy to Excel Clipboard</span>
            </>
          )}
        </button>

        {/* Download CSV */}
        <button
          onClick={handleExportCSV}
          className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium px-3 py-1.5 rounded-md text-xs flex items-center space-x-1.5 shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Download CSV</span>
        </button>

        {/* Export to Excel (.xlsx) */}
        <button
          onClick={handleExportExcel}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-1.5 rounded-md text-xs flex items-center space-x-1.5 shadow-sm"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Download Excel (.xlsx)</span>
        </button>

      </div>

    </div>
  );
}
