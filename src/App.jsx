import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputControls from './components/InputControls';
import ExportBar from './components/ExportBar';
import LeadTable from './components/LeadTable';
import VerificationDisclaimer from './components/VerificationDisclaimer';
import { generateLeads } from './utils/leadEngine';

export default function App() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [isMining, setIsMining] = useState(false);
  const [appendMode, setAppendMode] = useState(false);
  
  // Track seen company names across sessions to prevent duplicates
  const [seenCompanyNames, setSeenCompanyNames] = useState(() => {
    try {
      const saved = localStorage.getItem('vcfo_seen_leads_fy25');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [batchOffset, setBatchOffset] = useState(0);

  // Initial load with multi-industry default parameters
  useEffect(() => {
    const initial = generateLeads({
      sector: 'All Sectors (India Mid-Market)',
      count: 15,
      geography: 'India (any state)',
      excludeList: '',
      seenCompanyNames: [],
      batchOffset: 0
    });
    setLeads(initial);
    setFilteredLeads(initial);
  }, []);

  // Filter leads based on search query
  useEffect(() => {
    if (!searchFilter.trim()) {
      setFilteredLeads(leads);
      return;
    }
    const query = searchFilter.toLowerCase();
    const result = leads.filter(l => 
      l.companyName?.toLowerCase().includes(query) ||
      l.sector?.toLowerCase().includes(query) ||
      l.subSector?.toLowerCase().includes(query) ||
      l.location?.toLowerCase().includes(query) ||
      l.decisionMakerName?.toLowerCase().includes(query) ||
      l.status?.toLowerCase().includes(query) ||
      l.painSignal?.toLowerCase().includes(query) ||
      l.growthEventTrigger?.toLowerCase().includes(query)
    );
    setFilteredLeads(result);
  }, [searchFilter, leads]);

  // Save seen companies to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vcfo_seen_leads_fy25', JSON.stringify(seenCompanyNames));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  }, [seenCompanyNames]);

  // Handle Find Leads & Fetch Next Batch triggers
  const handleFindLeads = (params, isNextBatch = false, shouldAppend = false) => {
    setIsMining(true);
    
    setTimeout(() => {
      let updatedSeen = [...seenCompanyNames];
      
      // Exclude all currently visible leads
      const currentNames = leads.map(l => l.companyName);
      if (isNextBatch && leads.length > 0) {
        updatedSeen = Array.from(new Set([...updatedSeen, ...currentNames]));
        setSeenCompanyNames(updatedSeen);
      }

      const nextOffset = isNextBatch ? batchOffset + 1 : 0;
      if (!isNextBatch) {
        setBatchOffset(0);
      } else {
        setBatchOffset(nextOffset);
      }

      const minedLeads = generateLeads({
        ...params,
        seenCompanyNames: isNextBatch ? updatedSeen : (params.excludeSeen ? updatedSeen : []),
        batchOffset: nextOffset
      });

      if (shouldAppend || (isNextBatch && appendMode)) {
        // Append new non-duplicate leads to existing table
        const combined = [...leads, ...minedLeads].map((item, idx) => ({ ...item, sNo: idx + 1 }));
        setLeads(combined);
        setFilteredLeads(combined);
      } else {
        setLeads(minedLeads);
        setFilteredLeads(minedLeads);
      }

      setIsMining(false);
    }, 600);
  };

  // Reset seen history
  const handleClearHistory = () => {
    setSeenCompanyNames([]);
    setBatchOffset(0);
    localStorage.removeItem('vcfo_seen_leads_fy25');
    
    const fresh = generateLeads({
      sector: 'All Sectors (India Mid-Market)',
      count: 15,
      geography: 'India (any state)',
      excludeList: '',
      seenCompanyNames: [],
      batchOffset: 0
    });
    setLeads(fresh);
    setFilteredLeads(fresh);
  };

  // Compute stats for header
  const totalLeads = leads.length;
  const priorityCount = leads.filter(l => l.status === 'Priority').length;
  const qualifiedCount = leads.filter(l => l.status === 'Qualified').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      
      {/* Application Top Bar */}
      <Header 
        totalLeads={totalLeads} 
        priorityCount={priorityCount} 
        qualifiedCount={qualifiedCount} 
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Input Parameters & Automatic Lead Trigger */}
        <InputControls 
          onFindLeads={handleFindLeads} 
          isMining={isMining} 
          seenCount={seenCompanyNames.length}
          onClearHistory={handleClearHistory}
          appendMode={appendMode}
          setAppendMode={setAppendMode}
        />

        {/* Excel & CSV Export Bar */}
        <ExportBar 
          leads={filteredLeads} 
          searchFilter={searchFilter} 
          setSearchFilter={setSearchFilter} 
        />

        {/* Master 18-Column Lead Table */}
        <LeadTable 
          leads={filteredLeads} 
        />

        {/* 2-Line Verification Disclaimer Note */}
        <VerificationDisclaimer />

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400 mt-8">
        VCFO B2B Lead Mining System &bull; Multi-Industry FY25 MCA Data &bull; Cumulative & Batch Deduplication Modes &bull; India DPDP Compliant
      </footer>

    </div>
  );
}
