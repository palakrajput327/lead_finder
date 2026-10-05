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

  // Initial load with default inputs
  useEffect(() => {
    const initial = generateLeads({
      sector: 'SaaS & Tech Startups',
      count: 15,
      geography: 'India (any state)',
      excludeList: ''
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

  // Handle Find Leads button trigger
  const handleFindLeads = (params) => {
    setIsMining(true);
    
    // Simulate mining delay for seamless user experience
    setTimeout(() => {
      const minedLeads = generateLeads(params);
      setLeads(minedLeads);
      setFilteredLeads(minedLeads);
      setIsMining(false);
    }, 800);
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
        VCFO B2B Lead Mining System &bull; Strict Public Data Verification &bull; India DPDP Compliant
      </footer>

    </div>
  );
}
