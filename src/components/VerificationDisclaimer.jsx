import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function VerificationDisclaimer() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 mt-4 flex items-start space-x-2.5">
      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
      <div className="space-y-0.5">
        <p className="font-bold text-amber-950">Verification & Data Coverage Note:</p>
        <p className="text-amber-900 leading-normal">
          <strong>1. Revenue & Financials:</strong> Private company revenues are estimated from FY24 MCA filings & Tofler/Zauba public registry summaries; exact FY25 audited statements require formal MCA document retrieval.<br />
          <strong>2. Contact Routes & Finance Team:</strong> Key personnel roles are verified via public LinkedIn company profiles; direct personal mobile numbers and non-public personal email addresses were strictly omitted in compliance with India's DPDP framework.
        </p>
      </div>
    </div>
  );
}
