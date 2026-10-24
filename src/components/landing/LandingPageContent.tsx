import React from 'react';
import LandingHeader from '@/src/components/custom/LandingHeader';
import { MarketingPageShell } from '@/src/components/marketing';
import Hero from './Hero';
import FeatureBento from './FeatureBento';
import HowItWorks from './HowItWorks';
import AnalysisSection from './AnalysisSection';
import PopularCertifications from './PopularCertifications';
import LandingFaq from './LandingFaq';
import FinalCta from './FinalCta';

export default function LandingPageContent() {
  return (
    <MarketingPageShell>
      <LandingHeader />

      <main>
        <Hero />
        <FeatureBento />
        <HowItWorks />
        <AnalysisSection />
        <PopularCertifications />
        <LandingFaq />
        <FinalCta />
      </main>
    </MarketingPageShell>
  );
}
