'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Award, ArrowRight, ExternalLink } from 'lucide-react';

import { Button } from '@/src/components/ui/button';
import { Chip } from '@/src/components/marketing';
import { CertificationsCatalogJsonLd } from '@/src/components/seo/JsonLd';
import { marketingTheme } from '@/src/config/marketing-theme';
import { FirmWithCertifications } from '@/src/lib/server-actions/certifications';
import { createSlug } from '@/src/utils/slug';
import { cn } from '@/src/lib/utils';
import { AlertMessage } from './AlertMessage';
import CertificationSearchControls from './CertificationSearchControls';

interface CertificationsOverviewClientProps {
  initialFirms: FirmWithCertifications[];
  initialError?: string;
  defaultFirmFilter?: string;
}

/** "65 questions" / "40–60 questions", or null when the vendor range is unknown. */
function questionRange(min?: number, max?: number): string | null {
  if (!min && !max) return null;
  if (!max || min === max) return `${min} questions`;
  return `${min}–${max} questions`;
}

/** Some records store the exam-guide URL in `description`; never render that as prose. */
function isUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

export default function CertificationsOverviewClient({
  initialFirms,
  initialError,
  defaultFirmFilter,
}: CertificationsOverviewClientProps) {
  const [firms] = useState<FirmWithCertifications[]>(initialFirms);
  const [error] = useState<string | null>(initialError || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFirm, setSelectedFirm] = useState<string | null>(defaultFirmFilter || null);

  const filteredFirms = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    let filtered = firms;

    if (selectedFirm) {
      filtered = filtered.filter((firm) => firm.code === selectedFirm);
    }

    if (needle) {
      filtered = filtered.filter(
        (firm) =>
          firm.name.toLowerCase().includes(needle) ||
          firm.description.toLowerCase().includes(needle) ||
          firm.certifications.some(
            (cert) =>
              cert.name.toLowerCase().includes(needle) ||
              (cert.description && cert.description.toLowerCase().includes(needle)),
          ),
      );
    }

    return filtered;
  }, [firms, searchTerm, selectedFirm]);

  const totalCertifications = firms.reduce((sum, firm) => sum + firm.certification_count, 0);
  const vendorsWithCerts = firms.filter((firm) => firm.certification_count > 0).length;
  const filteredCertifications = filteredFirms.reduce(
    (sum, firm) => sum + firm.certification_count,
    0,
  );
  const hasFilters = Boolean(searchTerm || selectedFirm);
  const activeFirmName = firms.find((firm) => firm.code === selectedFirm)?.name;

  if (error) {
    return (
      <div className="mx-auto max-w-md py-12 text-center">
        <div className="space-y-4">
          <AlertMessage message="We couldn’t load the catalog just now." variant="error" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {error
              ? `The catalog request failed: ${error}`
              : 'The catalog request failed. Reloading usually fixes it.'}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className={`${marketingTheme.button.primary} ${marketingTheme.focusRing} h-11 px-6 py-0`}
          >
            Refresh page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <CertificationsCatalogJsonLd
        totalCertifications={totalCertifications}
        totalFirms={vendorsWithCerts}
      />

      {/* Stats + search */}
      <div className={cn(marketingTheme.surface.feature, 'p-6 sm:p-7')}>
        <dl className="grid grid-cols-3 gap-4 border-b border-slate-200/70 pb-5 dark:border-slate-700/60">
          {[
            { value: vendorsWithCerts, label: 'Vendors' },
            { value: totalCertifications, label: 'Certifications' },
            {
              value: vendorsWithCerts > 0 ? Math.round(totalCertifications / vendorsWithCerts) : 0,
              label: 'Avg per vendor',
            },
          ].map((stat, index) => (
            <div key={stat.label} className={cn(index > 0 && 'border-l border-slate-200/70 pl-4 dark:border-slate-700/60')}>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                {stat.label}
              </dt>
              <dd className="mt-1.5 text-2xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-5">
          <CertificationSearchControls
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search certifications or vendors..."
            controls={
              <select
                value={selectedFirm || ''}
                onChange={(event) => setSelectedFirm(event.target.value || null)}
                aria-label="Filter by vendor"
                className={cn(
                  'h-12 w-full rounded-xl border border-slate-200/80 bg-white/80 px-3 text-sm text-slate-700 backdrop-blur-sm transition-colors',
                  'hover:border-slate-300 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500',
                  'dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-slate-600',
                  marketingTheme.focusRing,
                )}
              >
                <option value="">All vendors</option>
                {firms.map((firm) => (
                  <option key={firm.id} value={firm.code}>
                    {firm.name}
                  </option>
                ))}
              </select>
            }
          />
        </div>
      </div>

      {/* Result summary */}
      {hasFilters && (
        <div className={cn(marketingTheme.surface.callout, 'flex flex-wrap items-center justify-between gap-3')}>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {filteredFirms.length} vendor{filteredFirms.length === 1 ? '' : 's'} ·{' '}
            {filteredCertifications} certification
            {filteredCertifications === 1 ? '' : 's'}
            {searchTerm && (
              <>
                {' '}
                matching <span className={marketingTheme.copy.strong}>“{searchTerm}”</span>
              </>
            )}
            {activeFirmName && <> from {activeFirmName}</>}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedFirm(null);
            }}
            className={cn(marketingTheme.copy.link, marketingTheme.focusRing)}
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Certifications by vendor */}
      <div className="space-y-5">
        {filteredFirms.length === 0 ? (
          <div className={cn(marketingTheme.surface.feature, 'px-6 py-14 text-center')}>
            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
              No certifications found
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {hasFilters
                ? 'Try a different search term or switch the vendor filter back to “All vendors”.'
                : 'The catalog is empty right now. Reload the page or check back shortly.'}
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedFirm(null);
                }}
                className={cn(marketingTheme.copy.link, 'mt-4', marketingTheme.focusRing)}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          filteredFirms.map((firm) => (
            <section
              key={firm.id}
              aria-labelledby={`firm-${firm.code}`}
              className={cn(marketingTheme.surface.feature, 'p-6 sm:p-7')}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3
                      id={`firm-${firm.code}`}
                      className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50"
                    >
                      {firm.name}
                    </h3>
                    <Chip>
                      {firm.certification_count} certification
                      {firm.certification_count === 1 ? '' : 's'}
                    </Chip>
                  </div>
                  {firm.description && (
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {firm.description}
                    </p>
                  )}
                </div>

                {firm.website_url && (
                  <a
                    href={firm.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(marketingTheme.copy.link, 'shrink-0', marketingTheme.focusRing)}
                  >
                    Official website
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}
              </div>

              {!Array.isArray(firm.certifications) || firm.certifications.length === 0 ? (
                <p className="mt-6 rounded-2xl border border-dashed border-slate-300/70 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  Certifications for this vendor are being added.
                </p>
              ) : (
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {firm.certifications.map((cert) => {
                    const range = questionRange(cert.min_quiz_counts, cert.max_quiz_counts);
                    const descriptionText =
                      cert.description && !isUrl(cert.description) ? cert.description : null;

                    return (
                      <Link
                        key={cert.cert_id}
                        href={`/certifications/${firm.code}/${createSlug(cert.name)}`}
                        className={cn(
                          'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white/85 p-5 backdrop-blur-sm',
                          'transition-[border-color,box-shadow] duration-300 hover:border-violet-300/80 hover:shadow-[0_1px_2px_rgba(15,23,42,0.04),0_22px_45px_-24px_rgba(124,58,237,0.30)]',
                          'dark:border-slate-700/60 dark:bg-slate-900/50 dark:hover:border-violet-500/40',
                          marketingTheme.focusRing,
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-x-5 top-0 h-px bg-linear-to-r from-transparent via-violet-400/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        />

                        <div className="flex items-start gap-2.5">
                          <Award
                            className="mt-0.5 h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400"
                            aria-hidden="true"
                          />
                          <h4 className="text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100">
                            {cert.name}
                          </h4>
                        </div>

                        {descriptionText && (
                          <p className="mt-2 flex-auto text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-3">
                            {descriptionText}
                          </p>
                        )}

                        <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-200/60 pt-3 dark:border-slate-700/60">
                          {range ? (
                            <Chip>{range}</Chip>
                          ) : (
                            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                              Question range on request
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-violet-700 transition-colors group-hover:text-violet-600 dark:text-violet-300 dark:group-hover:text-violet-200">
                            Practice
                            <ArrowRight className="h-3 w-3" aria-hidden="true" />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          ))
        )}
      </div>
    </div>
  );
}
