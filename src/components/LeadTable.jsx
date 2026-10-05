import React from 'react';
import { ExternalLink, CheckCircle2, AlertCircle, Clock, Linkedin } from 'lucide-react';

export default function LeadTable({ leads }) {
  if (!leads || leads.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
        <p className="text-sm font-medium">No leads match the current filters or exclusion criteria.</p>
        <p className="text-xs text-slate-400 mt-1">Try resetting parameters or adjusting your search query.</p>
      </div>
    );
  }

  // Render Status Badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Priority':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Priority</span>;
      case 'Qualified':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">Qualified</span>;
      case 'Nurture':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300">Nurture</span>;
      case 'Verify size first':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 border border-orange-300">Verify size first</span>;
      case 'Disqualify':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-800 border border-rose-300">Disqualify</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">New</span>;
    }
  };

  // Render Score Pill
  const renderScorePill = (score) => {
    let colorClass = "bg-slate-100 text-slate-800 border-slate-300";
    if (score >= 8) colorClass = "bg-emerald-600 text-white font-bold";
    else if (score >= 6) colorClass = "bg-blue-600 text-white font-semibold";
    else if (score >= 4) colorClass = "bg-amber-500 text-white font-medium";
    else colorClass = "bg-rose-500 text-white font-medium";

    return (
      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs shadow-sm ${colorClass}`}>
        {score}
      </span>
    );
  };

  // Render Data Confidence
  const renderConfidence = (conf) => {
    if (conf === 'High') {
      return <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> High</span>;
    } else if (conf === 'Medium') {
      return <span className="text-amber-700 font-medium text-xs flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-500" /> Medium</span>;
    }
    return <span className="text-rose-700 font-medium text-xs flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 text-rose-500" /> Low</span>;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      
      {/* Scrollable Table Container */}
      <div className="overflow-x-auto custom-scrollbar max-h-[600px]">
        <table className="w-full text-left border-collapse text-xs">
          
          {/* 18 Column Table Header */}
          <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200 sticky top-0 z-20">
            <tr>
              <th scope="col" className="py-3 px-3 w-12 sticky-col-1 bg-slate-100 border-r border-slate-200 text-center">S.No</th>
              <th scope="col" className="py-3 px-4 min-w-[200px] sticky-col-2 bg-slate-100 border-r border-slate-200">Company Name</th>
              <th scope="col" className="py-3 px-3 min-w-[150px]">Website</th>
              <th scope="col" className="py-3 px-3 min-w-[180px]">Sector / Sub-sector</th>
              <th scope="col" className="py-3 px-3 min-w-[140px]">Location</th>
              <th scope="col" className="py-3 px-4 min-w-[250px]">Business Description</th>
              <th scope="col" className="py-3 px-3 min-w-[170px]">Revenue Indicator (5-50 Cr)</th>
              <th scope="col" className="py-3 px-3 min-w-[160px]">Employee Indicator</th>
              <th scope="col" className="py-3 px-4 min-w-[220px]">Finance Maturity Signal</th>
              <th scope="col" className="py-3 px-4 min-w-[180px]">Decision-Maker (LinkedIn)</th>
              <th scope="col" className="py-3 px-3 min-w-[140px]">Role</th>
              <th scope="col" className="py-3 px-3 min-w-[220px]">Source</th>
              <th scope="col" className="py-3 px-3 min-w-[200px]">Verified Contact Route</th>
              <th scope="col" className="py-3 px-4 min-w-[240px]">Pain Signal</th>
              <th scope="col" className="py-3 px-4 min-w-[240px]">Growth Event / Trigger</th>
              <th scope="col" className="py-3 px-3 min-w-[90px] text-center">Lead Score</th>
              <th scope="col" className="py-3 px-3 min-w-[130px]">Status</th>
              <th scope="col" className="py-3 px-3 min-w-[120px]">Data Confidence</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-200 bg-white">
            {leads.map((lead, idx) => {
              const linkedinUrl = lead.decisionMakerLinkedin || `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent((lead.decisionMakerName || '') + ' ' + lead.companyName)}`;

              return (
                <tr 
                  key={lead.id || idx} 
                  className="hover:bg-blue-50/40 transition-colors"
                >
                  
                  {/* 1. S.No */}
                  <td className="py-3 px-3 text-slate-500 font-semibold text-center sticky-col-1 bg-white border-r border-slate-200">
                    {lead.sNo}
                  </td>

                  {/* 2. Company Name */}
                  <td className="py-3 px-4 font-bold text-slate-900 sticky-col-2 bg-white border-r border-slate-200">
                    <span className="hover:text-blue-600 transition-colors">
                      {lead.companyName}
                    </span>
                  </td>

                  {/* 3. Website */}
                  <td className="py-3 px-3">
                    {lead.website ? (
                      <a 
                        href={lead.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center space-x-1 font-medium"
                      >
                        <span className="truncate max-w-[120px]">{lead.website.replace('https://', '').replace('http://', '').replace('www.', '')}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    ) : (
                      <span className="text-slate-400">Unverified</span>
                    )}
                  </td>

                  {/* 4. Sector / Sub-sector */}
                  <td className="py-3 px-3 text-slate-700">
                    <div className="font-semibold text-slate-900">{lead.sector}</div>
                    <div className="text-[11px] text-slate-500">{lead.subSector || ''}</div>
                  </td>

                  {/* 5. Location */}
                  <td className="py-3 px-3 text-slate-700 font-medium">
                    {lead.location}
                  </td>

                  {/* 6. Business Description */}
                  <td className="py-3 px-4 text-slate-600 leading-normal max-w-xs">
                    <p className="line-clamp-2">{lead.businessDescription}</p>
                  </td>

                  {/* 7. Revenue Indicator (5-50 Cr) */}
                  <td className="py-3 px-3 text-slate-800 font-medium">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${lead.revenueIndicator?.includes('Exceeds') || lead.revenueIndicator?.includes('Group') ? 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold' : 'bg-slate-100 text-slate-800'}`}>
                      {lead.revenueIndicator}
                    </span>
                  </td>

                  {/* 8. Employee Indicator */}
                  <td className="py-3 px-3 text-slate-700">
                    {lead.employeeIndicator}
                  </td>

                  {/* 9. Finance Maturity Signal */}
                  <td className="py-3 px-4 text-slate-700 font-medium">
                    <div className="flex items-start space-x-1">
                      <span className="text-slate-600 leading-normal">{lead.financeMaturitySignal}</span>
                    </div>
                  </td>

                  {/* 10. Decision-Maker Name + LinkedIn Hyperlink */}
                  <td className="py-3 px-4">
                    <a 
                      href={linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 text-blue-700 hover:text-blue-900 font-bold bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded border border-blue-200 transition-colors"
                      title={`Open ${lead.decisionMakerName || 'Decision Maker'} on LinkedIn`}
                    >
                      <Linkedin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      <span>{lead.decisionMakerName || "TBD"}</span>
                      <ExternalLink className="w-2.5 h-2.5 text-blue-500 opacity-70" />
                    </a>
                  </td>

                  {/* 11. Role */}
                  <td className="py-3 px-3 text-slate-600 font-medium">
                    {lead.role || "Founder/CEO (verify)"}
                  </td>

                  {/* 12. Source */}
                  <td className="py-3 px-3 text-slate-500 text-[11px] truncate max-w-[200px]">
                    {lead.source ? (
                      <span className="text-slate-600" title={lead.source}>
                        {lead.source.split(',')[0]}
                      </span>
                    ) : (
                      <span className="text-slate-400">Public search</span>
                    )}
                  </td>

                  {/* 13. Verified Contact Route */}
                  <td className="py-3 px-3 text-slate-700 font-medium text-[11px]">
                    {lead.verifiedContactRoute || "Generic company contact page"}
                  </td>

                  {/* 14. Pain Signal */}
                  <td className="py-3 px-4 text-slate-700 leading-normal max-w-xs">
                    <p className="line-clamp-2">{lead.painSignal || "None found"}</p>
                  </td>

                  {/* 15. Growth Event / Trigger */}
                  <td className="py-3 px-4 text-slate-800 leading-normal max-w-xs">
                    <span className="font-medium text-slate-900 line-clamp-2 bg-blue-50/70 p-1.5 rounded border border-blue-100">
                      {lead.growthEventTrigger || "None found"}
                    </span>
                  </td>

                  {/* 16. Lead Score */}
                  <td className="py-3 px-3 text-center">
                    {renderScorePill(lead.leadScore)}
                  </td>

                  {/* 17. Status */}
                  <td className="py-3 px-3">
                    {renderStatusBadge(lead.status)}
                  </td>

                  {/* 18. Data Confidence */}
                  <td className="py-3 px-3">
                    {renderConfidence(lead.dataConfidence)}
                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

      {/* Table Footer Stats */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 text-xs text-slate-500 flex justify-between items-center">
        <span>Showing <strong>{leads.length}</strong> B2B leads matching criteria</span>
        <span className="text-blue-700 font-medium">✓ Industry Worksheets & LinkedIn Hyperlinks Active</span>
      </div>

    </div>
  );
}
