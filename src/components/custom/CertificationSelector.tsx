'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAllFirmsWithCertifications } from '@/src/swr/useAllData';
import { Loader2, Award } from 'lucide-react';

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
  required?: boolean;
}

export default function CertificationSelector({
  selectedCertId,
  onCertificationChange,
  disabled = false,
  required = false,
}: CertificationSelectorProps) {
  const { firms, isLoading, error } = useAllFirmsWithCertifications();

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

  const handleCertificationSelect = (value: string) => {
    const certId = parseInt(value);
    onCertificationChange(certId);
  };

  if (error) {
    return (
      <div className="space-y-1.5 sm:space-y-2">
        <Label className="text-foreground font-medium">
          Certification exam to attend{' '}
          {required ? (
            <span className="text-destructive font-normal">*</span>
          ) : (
            <span className="text-muted-foreground font-normal">(Optional)</span>
          )}
        </Label>
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
          Unable to load certification exams. You can select one later from your dashboard.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5 sm:space-y-2">
      <Label htmlFor="certification" className="text-foreground font-medium">
        Certification exam to attend{' '}
        {required ? (
          <span className="text-destructive font-normal">*</span>
        ) : (
          <span className="text-muted-foreground font-normal">(Optional)</span>
        )}
      </Label>

      <Select
        value={selectedCertId ? selectedCertId.toString() : ''}
        onValueChange={handleCertificationSelect}
        disabled={disabled || isLoading}
      >
        <SelectTrigger className="border-input bg-background text-foreground hover:border-ring/50 focus:ring-ring/20 focus:border-ring transition-all duration-200 w-full">
          <SelectValue
            placeholder={
              isLoading
                ? 'Loading certifications...'
                : required
                ? 'Select a certification exam'
                : 'Select a certification exam (optional)'
            }
          />
        </SelectTrigger>
        <SelectContent className="max-h-80 bg-popover border-border">
          {isLoading && (
            <SelectItem value="loading" disabled>
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">Loading certifications...</span>
              </div>
            </SelectItem>
          )}

          {!isLoading &&
            allCertifications.map((cert) => (
              <SelectItem key={cert.cert_id} value={cert.cert_id.toString()}>
                <div className="flex items-center gap-2 py-1">
                  <Award className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="font-medium text-foreground truncate">{cert.name}</span>
                </div>
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}
