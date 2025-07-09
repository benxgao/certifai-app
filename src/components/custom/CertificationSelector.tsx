'use client';

import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAllFirmsWithCertifications } from '@/src/swr/useAllData';
import { Loader2, Award, Building } from 'lucide-react';

interface Certification {
  cert_id: number;
  name: string;
  description?: string;
  firm_id: number;
}

interface CertificationSelectorProps {
  selectedCertId: number | null;
  onCertificationChange: (certId: number | null) => void;
  disabled?: boolean;
}

export default function CertificationSelector({
  selectedCertId,
  onCertificationChange,
  disabled = false,
}: CertificationSelectorProps) {
  const { firms, isLoading, error } = useAllFirmsWithCertifications();
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  // Flatten all certifications from all firms
  const allCertifications = React.useMemo(() => {
    if (!firms) return [];

    const certs: (Certification & { firmName: string; firmCode: string })[] = [];
    firms.forEach((firm) => {
      firm.certifications.forEach((cert) => {
        certs.push({
          ...cert,
          firmName: firm.name,
          firmCode: firm.code,
        });
      });
    });

    // Sort by firm name, then by certification name
    return certs.sort((a, b) => {
      if (a.firmName !== b.firmName) {
        return a.firmName.localeCompare(b.firmName);
      }
      return a.name.localeCompare(b.name);
    });
  }, [firms]);

  // Update selected certification when selectedCertId changes
  useEffect(() => {
    if (selectedCertId && allCertifications.length > 0) {
      const cert = allCertifications.find((c) => c.cert_id === selectedCertId);
      setSelectedCert(cert || null);
    } else {
      setSelectedCert(null);
    }
  }, [selectedCertId, allCertifications]);

  const handleCertificationSelect = (value: string) => {
    if (value === 'none') {
      setSelectedCert(null);
      onCertificationChange(null);
    } else {
      const certId = parseInt(value);
      const cert = allCertifications.find((c) => c.cert_id === certId);
      setSelectedCert(cert || null);
      onCertificationChange(certId);
    }
  };

  if (error) {
    return (
      <div className="space-y-1.5 sm:space-y-2">
        <Label className="text-slate-700 dark:text-slate-300 font-medium">
          Certification to pursue (Optional)
        </Label>
        <div className="text-sm text-red-600 dark:text-red-400 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800/50">
          Unable to load certifications. You can select one later from your dashboard.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5 sm:space-y-2">
      <Label htmlFor="certification" className="text-slate-700 dark:text-slate-300 font-medium">
        Certification to pursue{' '}
        <span className="text-slate-500 dark:text-slate-400 font-normal">(Optional)</span>
      </Label>

      <Select
        value={selectedCertId ? selectedCertId.toString() : 'none'}
        onValueChange={handleCertificationSelect}
        disabled={disabled || isLoading}
      >
        <SelectTrigger className="border-slate-200 dark:border-slate-700 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600">
          <SelectValue
            placeholder={
              isLoading ? 'Loading certifications...' : 'Select a certification (optional)'
            }
          />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          <SelectItem value="none">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">None - I&apos;ll choose later</span>
            </div>
          </SelectItem>

          {isLoading && (
            <SelectItem value="loading" disabled>
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading certifications...</span>
              </div>
            </SelectItem>
          )}

          {!isLoading &&
            allCertifications.map((cert) => (
              <SelectItem key={cert.cert_id} value={cert.cert_id.toString()}>
                <div className="flex items-start gap-2 py-1">
                  <Award className="h-4 w-4 text-violet-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
                      {cert.name}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        <Building className="h-3 w-3 mr-1" />
                        {cert.firmCode}
                      </Badge>
                    </div>
                  </div>
                </div>
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      {selectedCert && (
        <div className="text-sm text-slate-600 dark:text-slate-400 bg-violet-50 dark:bg-violet-900/20 p-3 rounded-lg border border-violet-200 dark:border-violet-800/50">
          <div className="flex items-start gap-2">
            <Award className="h-4 w-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-violet-800 dark:text-violet-200">
                {selectedCert.name}
              </div>
              {selectedCert.description && (
                <div className="text-violet-700 dark:text-violet-300 mt-1">
                  {selectedCert.description}
                </div>
              )}
              <div className="flex items-center gap-1 mt-2">
                <Building className="h-3 w-3" />
                <span className="text-xs font-medium">{(selectedCert as any).firmName}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-xs text-slate-500 dark:text-slate-400">
        You can always change or add certifications later from your dashboard.
      </div>
    </div>
  );
}
