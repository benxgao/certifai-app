import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Clock } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { MarketingSection } from '@/src/components/marketing';
import { marketingTheme } from '@/src/config/marketing-theme';
import { cn } from '@/src/lib/utils';

interface PopularCertification {
  name: string;
  slug: string;
  firmCode: string;
  firmName: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  avgStudyTime: string;
}

const popularCertifications: PopularCertification[] = [
  {
    name: 'AWS Certified Solutions Architect - Associate',
    slug: 'aws-certified-solutions-architect',
    firmCode: 'AWS',
    firmName: 'Amazon Web Services',
    description:
      'Practice AWS cloud architecture with hands-on exams covering EC2, S3, VPC, IAM, and more. Available for IT professionals.',
    difficulty: 'Intermediate',
    avgStudyTime: '8–12 weeks',
  },
  {
    name: 'Cisco Certified Network Associate (CCNA)',
    slug: 'cisco-certified-network-associate-ccna',
    firmCode: 'CISCO',
    firmName: 'Cisco',
    description:
      'Foundation networking knowledge with practice exams covering routing, switching, wireless, and network fundamentals for network engineers.',
    difficulty: 'Intermediate',
    avgStudyTime: '6–12 weeks',
  },
  {
    name: 'Certified Kubernetes Administrator (CKA)',
    slug: 'certified-kubernetes-administrator',
    firmCode: 'CNCF',
    firmName: 'Cloud Native Computing Foundation',
    description:
      'Master Kubernetes administration with comprehensive practice exams covering container orchestration, cluster management, security, and troubleshooting for DevOps professionals.',
    difficulty: 'Advanced',
    avgStudyTime: '8–12 weeks',
  },
  {
    name: 'Google Cloud Professional Cloud Architect',
    slug: 'google-cloud-professional-cloud-architect',
    firmCode: 'GCP',
    firmName: 'Google Cloud Platform',
    description:
      'Design scalable GCP solutions with AI-powered practice exams covering Compute Engine, BigQuery, Kubernetes, and cloud-native architectures.',
    difficulty: 'Advanced',
    avgStudyTime: '10–14 weeks',
  },
  {
    name: 'HashiCorp Certified: Terraform Associate',
    slug: 'hashicorp-terraform-associate',
    firmCode: 'HASHICORP',
    firmName: 'HashiCorp',
    description:
      'Master infrastructure-as-code with comprehensive practice exams covering Terraform fundamentals, resource management, state management, and security for infrastructure specialists.',
    difficulty: 'Intermediate',
    avgStudyTime: '4–6 weeks',
  },
  {
    name: 'Azure Solutions Architect Expert',
    slug: 'azure-solutions-architect-expert',
    firmCode: 'AZURE',
    firmName: 'Microsoft Azure',
    description:
      'Design scalable Azure solutions with comprehensive practice exams covering architecture patterns, security, compliance, performance optimization, and cost management for enterprise architects.',
    difficulty: 'Advanced',
    avgStudyTime: '8–12 weeks',
  },
];

export default function PopularCertifications() {
  return (
    <MarketingSection className="relative">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className={marketingTheme.copy.eyebrow}>Popular tracks</p>
          <h2
            id="popular-certs-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 lg:text-4xl"
          >
            Pick a track. Any track.
          </h2>
          <p className={cn(marketingTheme.copy.body, 'mt-4')}>
            Six of the most-requested tracks. Every one runs the same loop: scope it,
            generate it, sit it, analyze it.
          </p>
        </div>
        <p className="shrink-0 text-xs font-medium text-slate-500 dark:text-slate-400">
          100+ tracks in the catalog
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
        {popularCertifications.map((cert) => (
          <Link
            key={cert.slug}
            href={`/certifications/${cert.firmCode}/${cert.slug}`}
            className={cn(
              'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white/85 p-6 backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-violet-300/80 hover:shadow-[0_1px_2px_rgba(15,23,42,0.04),0_22px_45px_-24px_rgba(124,58,237,0.30)] dark:border-slate-700/60 dark:bg-slate-900/50 dark:hover:border-violet-500/40',
              marketingTheme.focusRing,
            )}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-violet-400/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />

            <div className="flex items-start justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                {cert.firmName}
              </p>
              <ArrowUpRight
                className="h-4 w-4 shrink-0 text-slate-300 transition-colors duration-200 group-hover:text-violet-600 dark:text-slate-600 dark:group-hover:text-violet-300"
                aria-hidden="true"
              />
            </div>

            <h3 className="mt-3 text-base font-bold leading-snug tracking-tight text-slate-900 dark:text-slate-50 sm:text-lg">
              {cert.name}
            </h3>

            <p className="mt-3 flex-auto text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {cert.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-200/60 pt-4 dark:border-slate-700/60">
              <span className={`${marketingTheme.chip.base} ${marketingTheme.chip.neutral}`}>
                {cert.difficulty}
              </span>
              <span className={`${marketingTheme.chip.base} ${marketingTheme.chip.neutral}`}>
                <Clock className="h-3 w-3" aria-hidden="true" />
                {cert.avgStudyTime}
              </span>
              <span className="ml-auto text-xs font-semibold text-violet-700 transition-colors group-hover:text-violet-600 dark:text-violet-300 dark:group-hover:text-violet-200">
                Practice
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button
          asChild
          className={`${marketingTheme.button.primary} ${marketingTheme.focusRing} h-12 w-full gap-2 px-7 py-0 sm:w-auto`}
        >
          <Link href="/certifications">
            Explore all certifications
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </MarketingSection>
  );
}
