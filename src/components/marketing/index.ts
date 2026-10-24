/**
 * Marketing components barrel export.
 *
 * These primitives constitute the marketing design-system layer.
 * They import only from `@/src/config/marketing-theme`, `@/src/lib/utils`,
 * and each other — no cross-dependency on custom/ or landing/ components.
 *
 * Layout:   MarketingPageShell, MarketingSection, PageHero, SectionIntro, StepList
 * Surfaces: MarketingCard, FeaturePanel, CtaPanel, FaqAccordion
 * Bits:     MarketingBadge, MarketingHeading, Chip, IconTile
 * Previews: visuals.tsx (PreviewWindow, ScoreRing, TopicRow, Sparkline)
 */

export { MarketingPageShell } from './MarketingPageShell';
export { MarketingSection } from './MarketingSection';
export { PageHero } from './PageHero';
export { SectionIntro } from './SectionIntro';
export { StepList } from './StepList';
export { MarketingCard } from './MarketingCard';
export { FeaturePanel, FeaturePanelHeader } from './FeaturePanel';
export { CtaPanel } from './CtaPanel';
export { FaqAccordion } from './FaqAccordion';
export { MarketingBadge } from './MarketingBadge';
export { MarketingHeading } from './MarketingHeading';
export { Chip } from './Chip';
export { IconTile } from './IconTile';

export type { MarketingPageShellProps } from './MarketingPageShell';
export type { MarketingSectionProps } from './MarketingSection';
export type { PageHeroProps } from './PageHero';
export type { SectionIntroProps } from './SectionIntro';
export type { Step, StepListProps } from './StepList';
export type { MarketingCardProps } from './MarketingCard';
export type { FeaturePanelProps, FeaturePanelHeaderProps } from './FeaturePanel';
export type { CtaPanelProps, CtaStat } from './CtaPanel';
export type { FaqAccordionProps, FaqItem } from './FaqAccordion';
export type { MarketingBadgeProps } from './MarketingBadge';
export type { MarketingHeadingProps } from './MarketingHeading';
export type { ChipProps } from './Chip';
export type { IconTileProps } from './IconTile';
export type { IconTileSize, IconTileVariant } from './IconTile';
