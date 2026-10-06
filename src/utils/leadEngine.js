import { INITIAL_LEAD_DATABASE, ADDITIONAL_VERIFIED_LEADS } from '../data/leadDatabase';
import * as XLSX from 'xlsx';

/**
 * Clean & Format LinkedIn Profile URLs
 * Fixes the LinkedIn login wall error by providing direct profile links
 * or a clean Google search lookup fallback.
 */
export function formatLinkedinUrl(lead) {
  if (lead.decisionMakerLinkedin && lead.decisionMakerLinkedin.startsWith('https://www.linkedin.com/in/')) {
    return lead.decisionMakerLinkedin;
  }
  
  // Safe Google Search lookup fallback (prevents 999 LinkedIn authwall error)
  const name = lead.decisionMakerName || 'CEO';
  const company = lead.companyName || '';
  return `https://www.google.com/search?q=${encodeURIComponent('site:linkedin.com/in/ ' + name + ' ' + company)}`;
}

/**
 * Calculates lead score according to prompt instructions:
 * Base 5; -3 if "Disqualify"; -1 if "Nurture" or "Verify size"; +2 if named decision maker; +2 if dated trigger. Cap 1-10.
 */
export function calculateLeadScore(lead) {
  let score = 5;

  const status = lead.status || '';
  if (status.includes('Disqualify')) {
    score -= 3;
  } else if (status.includes('Nurture') || status.includes('Verify size')) {
    score -= 1;
  }

  const decisionMaker = lead.decisionMakerName || '';
  if (decisionMaker && decisionMaker !== 'TBD' && decisionMaker.toLowerCase() !== 'not found') {
    score += 2;
  }

  const trigger = lead.growthEventTrigger || '';
  if (trigger && trigger !== 'None found' && (trigger.includes('2024') || trigger.includes('2025') || trigger.includes('2026') || trigger.includes('Series') || trigger.includes('funding') || trigger.includes('Expanded') || trigger.includes('Partnered') || trigger.includes('FY25'))) {
    score += 2;
  }

  return Math.min(10, Math.max(1, score));
}

export function parseExcludeList(excludeString) {
  if (!excludeString || excludeString.trim().toLowerCase() === 'none') {
    return new Set();
  }
  
  return new Set(
    excludeString
      .split(/,|\n/)
      .map(item => item.trim().toLowerCase())
      .filter(Boolean)
  );
}

/**
 * Smart Lead Mining Engine with Strict Zero-Repetition Deduplication
 */
export function generateLeads({ 
  sector = 'All Sectors (India Mid-Market)', 
  count = 15, 
  geography = 'India (any state)', 
  excludeList = '',
  seenCompanyNames = [],
  batchOffset = 0 
}) {
  const excludeSet = parseExcludeList(excludeList);
  
  // Add seen company names to exclude set for strict zero duplication
  seenCompanyNames.forEach(name => {
    if (name) excludeSet.add(name.toLowerCase());
  });

  // Combine and deduplicate master pool by unique company name
  const rawPool = [...INITIAL_LEAD_DATABASE, ...ADDITIONAL_VERIFIED_LEADS];
  const uniquePoolMap = new Map();
  rawPool.forEach(item => {
    if (!uniquePoolMap.has(item.companyName.toLowerCase())) {
      uniquePoolMap.set(item.companyName.toLowerCase(), item);
    }
  });
  const combinedPool = Array.from(uniquePoolMap.values());

  // 1. Filter out excluded / already seen companies
  let availablePool = combinedPool.filter(lead => {
    const nameLower = lead.companyName.toLowerCase();
    const websiteLower = (lead.website || '').toLowerCase();
    
    for (let excluded of excludeSet) {
      if (nameLower.includes(excluded) || excluded.includes(nameLower) || (websiteLower && websiteLower.includes(excluded))) {
        return false;
      }
    }
    return true;
  });

  // 2. Filter by sector if specified
  let sectorFiltered = availablePool;
  if (sector && sector !== 'All Sectors' && sector !== 'All Sectors (India Mid-Market)') {
    const normalizedSector = sector.toLowerCase().replace('&', 'and');
    sectorFiltered = availablePool.filter(lead => {
      const leadSector = (lead.sector || '').toLowerCase().replace('&', 'and');
      const leadSub = (lead.subSector || '').toLowerCase();
      return leadSector.includes(normalizedSector) || normalizedSector.includes(leadSector) || leadSub.includes(normalizedSector);
    });
    
    // If not enough in specific sector, fill with other available un-seen companies to meet requested count
    if (sectorFiltered.length < count) {
      const existingNames = new Set(sectorFiltered.map(l => l.companyName.toLowerCase()));
      const filler = availablePool.filter(l => !existingNames.has(l.companyName.toLowerCase()));
      sectorFiltered = [...sectorFiltered, ...filler];
    }
  }

  // 3. Slice up to requested count (strictly non-repeating)
  const selectedLeads = sectorFiltered.slice(0, count);

  // 4. Map and return formatted lead objects
  return selectedLeads.map((item, index) => {
    const calculatedScore = calculateLeadScore(item);
    const linkedinUrl = formatLinkedinUrl(item);

    return {
      ...item,
      sNo: index + 1,
      leadScore: calculatedScore,
      decisionMakerLinkedin: linkedinUrl,
      financialYear: item.financialYear || 'FY25'
    };
  });
}

/**
 * Creates a worksheet with native clickable hyperlinks for URL columns
 */
function createWorksheetWithHyperlinks(leadsList) {
  const headers = [
    "S.No", "Company Name", "Website", "Sector / Sub-sector", "Location", 
    "Business Description", "Revenue Indicator (FY25)", "Employee Indicator", 
    "Finance Maturity Signal", "Decision-Maker Name", "Decision-Maker LinkedIn", "Role", "Source", 
    "Verified Contact Route", "Pain Signal", "Growth Event / Trigger", 
    "Lead Score", "Status", "Data Confidence"
  ];

  // Map rows
  const rowData = leadsList.map(l => {
    const linkedinUrl = formatLinkedinUrl(l);
    const sourceUrl = l.source ? l.source.split(',')[0].trim() : 'https://www.google.com';

    return [
      l.sNo,
      l.companyName,
      l.website, // Col 2 (C)
      `${l.sector} - ${l.subSector || ''}`,
      l.location,
      l.businessDescription,
      l.revenueIndicator,
      l.employeeIndicator,
      l.financeMaturitySignal,
      l.decisionMakerName,
      linkedinUrl, // Col 10 (K)
      l.role,
      sourceUrl,   // Col 12 (M)
      l.verifiedContactRoute,
      l.painSignal,
      l.growthEventTrigger,
      l.leadScore,
      l.status,
      l.dataConfidence
    ];
  });

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rowData]);

  // Set column widths
  ws['!cols'] = [
    { wch: 6 },  // S.No
    { wch: 34 }, // Company Name
    { wch: 28 }, // Website
    { wch: 32 }, // Sector
    { wch: 24 }, // Location
    { wch: 45 }, // Description
    { wch: 32 }, // Revenue Indicator
    { wch: 30 }, // Employee
    { wch: 45 }, // Finance Maturity
    { wch: 24 }, // Decision Maker Name
    { wch: 50 }, // Decision Maker LinkedIn
    { wch: 24 }, // Role
    { wch: 42 }, // Source
    { wch: 38 }, // Contact Route
    { wch: 48 }, // Pain Signal
    { wch: 48 }, // Growth Trigger
    { wch: 12 }, // Score
    { wch: 16 }, // Status
    { wch: 16 }  // Confidence
  ];

  // Convert Website, Decision-Maker LinkedIn, and Source cells into native CLICKABLE Excel Hyperlinks!
  leadsList.forEach((l, index) => {
    const rowIndex = index + 2; // 1-indexed header + 1
    const linkedinUrl = formatLinkedinUrl(l);
    const sourceUrl = l.source ? l.source.split(',')[0].trim() : 'https://www.google.com';

    // Website Cell (Col C)
    const websiteCellRef = `C${rowIndex}`;
    if (ws[websiteCellRef] && l.website) {
      ws[websiteCellRef].l = { Target: l.website, Tooltip: `Open ${l.website}` };
    }

    // LinkedIn Cell (Col K)
    const linkedinCellRef = `K${rowIndex}`;
    if (ws[linkedinCellRef]) {
      ws[linkedinCellRef].l = { Target: linkedinUrl, Tooltip: `Open LinkedIn Profile for ${l.decisionMakerName || 'CEO'}` };
    }

    // Source Cell (Col M)
    const sourceCellRef = `M${rowIndex}`;
    if (ws[sourceCellRef] && sourceUrl) {
      ws[sourceCellRef].l = { Target: sourceUrl, Tooltip: `Open Public Source Link` };
    }
  });

  return ws;
}

/**
 * Exports data table into an Excel Workbook with Industry Worksheets AND Clickable Hyperlinks!
 */
export function exportToExcel(leads, filename = 'VCFO_FY25_B2B_Leads_India.xlsx') {
  const workbook = XLSX.utils.book_new();

  // 1. Master Sheet (All Mined FY25 Leads)
  const masterWs = createWorksheetWithHyperlinks(leads);
  XLSX.utils.book_append_sheet(workbook, masterWs, "FY25 Master Leads");

  // 2. Group leads by Sector / Industry
  const industryGroups = {};
  leads.forEach(lead => {
    let sectorName = lead.sector || "Other Industry";
    let cleanSheetName = sectorName.replace(/[\\/?*:[\]]/g, '').slice(0, 30);
    if (!industryGroups[cleanSheetName]) {
      industryGroups[cleanSheetName] = [];
    }
    industryGroups[cleanSheetName].push(lead);
  });

  // 3. Create a separate worksheet (Tab) for each Industry with hyperlinks!
  Object.keys(industryGroups).forEach(industryTab => {
    const groupWs = createWorksheetWithHyperlinks(industryGroups[industryTab]);
    XLSX.utils.book_append_sheet(workbook, groupWs, industryTab);
  });

  XLSX.writeFile(workbook, filename);
}

export function exportToCSV(leads, filename = 'VCFO_FY25_B2B_Leads_India.csv') {
  const headers = [
    "S.No", "Company Name", "Website", "Sector / Sub-sector", "Location", 
    "Business Description", "Revenue Indicator (FY25)", "Employee Indicator", 
    "Finance Maturity Signal", "Decision-Maker Name", "Decision-Maker LinkedIn", "Role", "Source", 
    "Verified Contact Route", "Pain Signal", "Growth Event / Trigger", 
    "Lead Score", "Status", "Data Confidence"
  ];

  const rows = leads.map(l => [
    l.sNo,
    `"${(l.companyName || '').replace(/"/g, '""')}"`,
    `"${(l.website || '').replace(/"/g, '""')}"`,
    `"${(l.sector + ' - ' + (l.subSector || '')).replace(/"/g, '""')}"`,
    `"${(l.location || '').replace(/"/g, '""')}"`,
    `"${(l.businessDescription || '').replace(/"/g, '""')}"`,
    `"${(l.revenueIndicator || '').replace(/"/g, '""')}"`,
    `"${(l.employeeIndicator || '').replace(/"/g, '""')}"`,
    `"${(l.financeMaturitySignal || '').replace(/"/g, '""')}"`,
    `"${(l.decisionMakerName || '').replace(/"/g, '""')}"`,
    `"${(formatLinkedinUrl(l) || '').replace(/"/g, '""')}"`,
    `"${(l.role || '').replace(/"/g, '""')}"`,
    `"${(l.source || '').replace(/"/g, '""')}"`,
    `"${(l.verifiedContactRoute || '').replace(/"/g, '""')}"`,
    `"${(l.painSignal || '').replace(/"/g, '""')}"`,
    `"${(l.growthEventTrigger || '').replace(/"/g, '""')}"`,
    l.leadScore,
    `"${(l.status || '').replace(/"/g, '""')}"`,
    `"${(l.dataConfidence || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," 
    + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
