import React, { useState } from 'react';
import { Sparkles, SlidersHorizontal, RefreshCw, Info, ArrowRight, HelpCircle, Trash2, PlusCircle, Layers } from 'lucide-react';

export default function InputControls({ onFindLeads, isMining, seenCount = 0, onClearHistory, appendMode, setAppendMode }) {
  const [sector, setSector] = useState('All Sectors (India Mid-Market)');
  const [leadCount, setLeadCount] = useState(15);
  const [geography, setGeography] = useState('India (any state)');
  const [alreadyInList, setAlreadyInList] = useState('');
  const [showIcpInfo, setShowIcpInfo] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [excludeSeen, setExcludeSeen] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onFindLeads({
      sector,
      count: parseInt(leadCount, 10) || 15,
      geography,
      excludeList: alreadyInList,
      excludeSeen
    }, false, false);
  };

  const handleNextBatch = () => {
    onFindLeads({
      sector,
      count: parseInt(leadCount, 10) || 15,
      geography,
      excludeList: alreadyInList,
      excludeSeen: true
    }, true, appendMode);
  };

  const handleReset = () => {
    setSector('All Sectors (India Mid-Market)');
    setLeadCount(15);
    setGeography('India (any state)');
    setAlreadyInList('');
    setExcludeSeen(true);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-6">
      
      {/* Header Bar inside Control Panel */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 mb-4 gap-2">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-slate-900 text-sm">Lead Research Parameters & Filters (FY25 Data)</h2>
          <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-300">
            Multi-Industry FY25 MCA Data
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowTutorial(!showTutorial)}
            className="text-xs text-amber-700 hover:text-amber-900 flex items-center space-x-1 font-bold bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded border border-amber-200 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>📖 Guide: Naye Leads Kaise Nikale?</span>
          </button>

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
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Hinglish Tutorial Card */}
      {showTutorial && (
        <div className="mb-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50/70 border border-amber-200 rounded-xl text-xs text-slate-800 relative">
          <button 
            onClick={() => setShowTutorial(false)}
            className="absolute top-2.5 right-3 text-amber-700 hover:text-amber-900 text-xs font-bold"
          >
            ✕ Close
          </button>
          <div className="font-bold text-amber-900 text-sm mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>💡 Har Industry Ke FY25 Naye Leads (No Data Repeat) Kaise Nikale?</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-700 mt-2">
            <div className="bg-white/80 p-2.5 rounded-lg border border-amber-100">
              <span className="font-bold text-blue-700 text-xs block mb-0.5">1. Multi-Industry FY25</span>
              Isme saare industries included hain: <strong>Manufacturing, D2C & FMCG, Logistics, Pharma & Healthcare, Chemicals, Auto, FinTech & SaaS</strong>. Direct working Website & LinkedIn links.
            </div>
            <div className="bg-white/80 p-2.5 rounded-lg border border-amber-100">
              <span className="font-bold text-emerald-700 text-xs block mb-0.5">2. Fetch Next Batch</span>
              <strong>"⚡ Fetch Next Batch (New Leads)"</strong> click karne par 100% naye non-repeating companies aayengi. Zero company ya field repeat nahi hoga.
            </div>
            <div className="bg-white/80 p-2.5 rounded-lg border border-amber-100">
              <span className="font-bold text-purple-700 text-xs block mb-0.5">3. Append Mode (Table me Add)</span>
              Agar aap chahte hain ki purane leads ke niche hi naye leads add hote jayein, to niche <strong>"Append new leads into same table"</strong> tick karein!
            </div>
          </div>
          {seenCount > 0 && (
            <div className="mt-3 pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-amber-900">
              <span>🛡️ Currently tracking <strong>{seenCount}</strong> previously fetched companies (Deduplication Active).</span>
              <button 
                onClick={onClearHistory}
                className="text-rose-700 hover:text-rose-900 underline flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-3 h-3 text-rose-600" />
                Clear History & Restart
              </button>
            </div>
          )}
        </div>
      )}

      {/* ICP Info Banner */}
      {showIcpInfo && (
        <div className="mb-4 p-3.5 bg-blue-50/80 border border-blue-200 rounded-lg text-xs text-slate-700 space-y-1">
          <div className="font-bold text-blue-900 mb-1">Target VCFO Ideal Customer Profile (ICP - All B2B Industries):</div>
          <ul className="list-disc list-inside space-y-0.5 text-slate-600">
            <li><strong>Sectors:</strong> Manufacturing, Logistics, Healthcare, D2C, FMCG, Chemicals, Auto, FinTech, SaaS & Tech Services</li>
            <li><strong>Financial Year:</strong> FY25 (FY 2024-2025 MCA Filings & Tofler FY25 Data)</li>
            <li><strong>Revenue:</strong> ₹5 Cr – ₹50 Cr ARR (Unverified flagged if outside)</li>
            <li><strong>Headcount:</strong> 20 – 250 employees (2025-26 LinkedIn metrics)</li>
            <li><strong>Finance Signal:</strong> Founder-led, outsourced CA, or no full-time CFO</li>
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
            <option value="All Sectors (India Mid-Market)">All Sectors (India Mid-Market)</option>
            <option value="Manufacturing & Industrial">Manufacturing & Industrial</option>
            <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
            <option value="Pharma & Healthcare">Pharma & Healthcare</option>
            <option value="D2C & FMCG">D2C & FMCG</option>
            <option value="Chemicals & Materials">Chemicals & Materials</option>
            <option value="FinTech & Financial Services">FinTech & Financial Services</option>
            <option value="SaaS & Tech Startups">SaaS & Tech Startups</option>
            <option value="AgriTech & Food Processing">AgriTech & Food Processing</option>
            <option value="IT & Tech Services">IT & Tech Services</option>
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
            placeholder="e.g. India (any state), Mumbai, NCR, Bengaluru"
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

        {/* Action Controls & Append Mode Toggle */}
        <div className="md:col-span-12 flex flex-wrap justify-between items-center pt-3 gap-3 border-t border-slate-100">
          
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-700">
            <div className="flex items-center space-x-1.5">
              <input 
                type="checkbox"
                id="excludeSeenCb"
                checked={excludeSeen}
                onChange={(e) => setExcludeSeen(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="excludeSeenCb" className="cursor-pointer font-medium select-none">
                Auto-exclude previously fetched companies ({seenCount} in memory)
              </label>
            </div>

            <div className="flex items-center space-x-1.5 bg-purple-50 text-purple-900 px-2.5 py-1 rounded border border-purple-200">
              <input 
                type="checkbox"
                id="appendModeCb"
                checked={appendMode}
                onChange={(e) => setAppendMode(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="appendModeCb" className="cursor-pointer font-bold select-none flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-purple-600" />
                Append new leads into same table (don't clear existing)
              </label>
            </div>
          </div>

          <div className="flex flex-wrap items-center space-x-2">
            
            {/* Standard Find Leads Button */}
            <button
              type="submit"
              disabled={isMining}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-5 py-2 rounded-lg shadow-sm hover:shadow transition-all flex items-center space-x-2 text-xs"
            >
              {isMining ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Auditing MCA FY25 Data...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>⚡ Find FY25 Leads</span>
                </>
              )}
            </button>

            {/* Fetch Next Batch Button */}
            <button
              type="button"
              onClick={handleNextBatch}
              disabled={isMining}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold px-5 py-2 rounded-lg shadow-sm hover:shadow transition-all flex items-center space-x-2 text-xs"
              title="Skip currently displayed companies and get a fresh batch of non-repeating FY25 leads!"
            >
              {isMining ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Mining Next Batch...</span>
                </>
              ) : (
                <>
                  {appendMode ? <PlusCircle className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  <span>{appendMode ? "⚡ Add Next Batch to Table" : "⚡ Fetch Next Batch (New Leads)"}</span>
                </>
              )}
            </button>

          </div>

        </div>

      </form>
    </div>
  );
}
