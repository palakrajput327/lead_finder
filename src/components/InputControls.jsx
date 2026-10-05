import React, { useState } from 'react';
import { Sparkles, SlidersHorizontal, RefreshCw, XCircle, Info } from 'lucide-react';

export default function InputControls({ onFindLeads, isMining }) {
  const [sector, setSector] = useState('SaaS & Tech Startups');
  const [leadCount, setLeadCount] = useState(15);
  const [geography, setGeography] = useState('India (any state)');
  const [alreadyInList, setAlreadyInList] = useState('');
  const [showIcpInfo, setShowIcpInfo] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onFindLeads({
      sector,
      count: parseInt(leadCount, 10) || 15,
      geography,
      excludeList: alreadyInList
    });
  };

  const handleReset = () => {
    setSector('SaaS & Tech Startups');
    setLeadCount(15);
    setGeography('India (any state)');
    setAlreadyInList('');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-6">
      
      {/* Header Bar inside Control Panel */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-slate-900 text-sm">Lead Research Parameters & Filters</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowIcpInfo(!showIcpInfo)}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1 font-medium bg-blue-50 px-2.5 py-1 rounded border border-blue-100"
          >
            <Info className="w-3.5 h-3.5" />
            <span>ICP Specs</span>
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-slate-700 flex items-center space-x-1 font-medium hover:bg-slate-100 px-2 py-1 rounded"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* ICP Info Banner */}
      {showIcpInfo && (
        <div className="mb-4 p-3.5 bg-blue-50/80 border border-blue-200 rounded-lg text-xs text-slate-700 space-y-1">
          <div className="font-bold text-blue-900 mb-1">Target VCFO Ideal Customer Profile (ICP):</div>
          <ul className="list-disc list-inside space-y-0.5 text-slate-600">
            <li><strong>Type:</strong> Private, closely-held or VC/angel-backed Indian companies</li>
            <li><strong>Revenue:</strong> ₹5 Cr – ₹50 Cr ARR (Unverified flagged if outside)</li>
            <li><strong>Headcount:</strong> 20 – 250 employees</li>
            <li><strong>Finance Signal:</strong> Founder-led, outsourced CA, or no full-time CFO</li>
            <li><strong>Pain Triggers:</strong> Multi-entity, cross-border, fundraising, audit/GST backlog, fast scaling</li>
          </ul>
        </div>
      )}

      {/* Main Search Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Sector Field */}
        <div className="md:col-span-3">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            SECTOR
          </label>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="SaaS & Tech Startups">SaaS & Tech Startups</option>
            <option value="FinTech & SaaS">FinTech & SaaS</option>
            <option value="HealthTech & BioTech">HealthTech & BioTech</option>
            <option value="D2C & Consumer Goods">D2C & Consumer Goods</option>
            <option value="AgriTech & SaaS">AgriTech & SaaS</option>
            <option value="DeepTech & Robotics">DeepTech & Robotics</option>
            <option value="All Sectors">All Sectors (India Mid-Market)</option>
          </select>
        </div>

        {/* Geography Field */}
        <div className="md:col-span-3">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            GEOGRAPHY
          </label>
          <input
            type="text"
            value={geography}
            onChange={(e) => setGeography(e.target.value)}
            placeholder="e.g. India (any state), Bengaluru, NCR"
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Number of Leads Field */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            NUMBER OF LEADS ({leadCount})
          </label>
          <input
            type="number"
            min="5"
            max="50"
            value={leadCount}
            onChange={(e) => setLeadCount(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Already In My List (Deduplication) */}
        <div className="md:col-span-4">
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
            <span>ALREADY IN MY LIST (Exclude)</span>
            <span className="text-[10px] text-slate-400 font-normal">Comma or newline separated</span>
          </label>
          <input
            type="text"
            value={alreadyInList}
            onChange={(e) => setAlreadyInList(e.target.value)}
            placeholder="Paste company names to exclude..."
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Automatic Lead Finder Action Button */}
        <div className="md:col-span-12 flex justify-end items-center pt-2">
          <button
            type="submit"
            disabled={isMining}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-6 py-2.5 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2 text-sm"
          >
            {isMining ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Mining Public Signals & Auditing MCA Data...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4.5 h-4.5" />
                <span>⚡ Find Leads Now (Automatic)</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
