'use client';

import React, { useState } from 'react';
import EnhancedNotificationBar from '@/src/components/custom/NotificationBar';
import { ActionButton } from '@/src/components/custom/ActionButton';
import {
  DashboardCard,
  DashboardCardHeader,
  DashboardCardContent,
} from '@/src/components/ui/dashboard-card';
import { Badge } from '@/src/components/ui/badge';
import { Bell, Star, Sparkles } from 'lucide-react';

/**
 * Demo component to showcase the improved NotificationBar component
 * with all variants and styling options from the design system
 */
export default function NotificationBarDemo() {
  const [notifications, setNotifications] = useState({
    info: true,
    success: true,
    warning: true,
    promo: true,
    announcement: true,
    beta: true,
  });

  const [enhancedMode, setEnhancedMode] = useState(true);

  const handleDismiss = (variant: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [variant]: false }));
  };

  const resetAll = () => {
    setNotifications({
      info: true,
      success: true,
      warning: true,
      promo: true,
      announcement: true,
      beta: true,
    });
  };

  const notificationConfigs = [
    {
      variant: 'info' as const,
      message: 'New feature available: AI-powered question recommendations are now live!',
      ctaText: 'Learn More',
      ctaLink: '/features',
    },
    {
      variant: 'success' as const,
      message: 'Your certification exam has been successfully completed with a score of 89%!',
      ctaText: 'View Results',
      ctaLink: '/results',
    },
    {
      variant: 'warning' as const,
      message: 'Your exam session will expire in 15 minutes. Save your progress now.',
      ctaText: 'Save Progress',
      ctaLink: '/save',
    },
    {
      variant: 'promo' as const,
      message: '🎉 Limited time offer: Get 50% off premium certification courses!',
      ctaText: 'Claim Offer',
      ctaLink: '/pricing',
    },
    {
      variant: 'announcement' as const,
      message:
        'Scheduled maintenance on Sunday 2AM-4AM EST. All services will be temporarily unavailable.',
      ctaText: 'More Info',
      ctaLink: '/maintenance',
    },
    {
      variant: 'beta' as const,
      message:
        'Try our new adaptive learning engine - personalized question difficulty based on performance!',
      ctaText: 'Join Beta',
      ctaLink: '/beta',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-violet-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-violet-950/20 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8 md:px-8 md:py-12 space-y-10">
        {/* Header */}
        <DashboardCard>
          <DashboardCardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                  📢 NotificationBar Demo
                </h1>
                <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                  Showcase of the enhanced notification bar with glass-morphism styling and design
                  system integration
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant="secondary"
                  className="bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-100"
                >
                  Style Guide v2
                </Badge>
              </div>
            </div>
          </DashboardCardHeader>
          <DashboardCardContent>
            <div className="space-y-6">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Enhanced Mode:
                  </span>
                  <button
                    onClick={() => setEnhancedMode(!enhancedMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${
                      enhancedMode ? 'bg-violet-600' : 'bg-slate-200 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        enhancedMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <ActionButton onClick={resetAll} variant="outline" size="sm">
                  Reset All Notifications
                </ActionButton>
              </div>

              {/* Features List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-300">
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    ✨ Enhanced Features
                  </h3>
                  <ul className="space-y-1">
                    <li>• Glass-morphism backdrop blur effects</li>
                    <li>• Gradient backgrounds with proper contrast</li>
                    <li>• Variant-specific icons and colors</li>
                    <li>• Improved hover and focus states</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    🎨 Design System
                  </h3>
                  <ul className="space-y-1">
                    <li>• Consistent with Certifai design language</li>
                    <li>• Responsive typography and spacing</li>
                    <li>• Accessible focus indicators</li>
                    <li>• Smooth animations and transitions</li>
                  </ul>
                </div>
              </div>
            </div>
          </DashboardCardContent>
        </DashboardCard>

        {/* Notification Examples */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Notification Variants
          </h2>

          <div className="space-y-4">
            {notificationConfigs.map(
              (config) =>
                notifications[config.variant] && (
                  <div key={config.variant}>
                    <EnhancedNotificationBar
                      {...config}
                      dismissible
                      onDismiss={() => handleDismiss(config.variant)}
                      showIcon
                      enhanced={enhancedMode}
                    />
                  </div>
                ),
            )}
          </div>
        </section>

        {/* Code Examples */}
        <DashboardCard>
          <DashboardCardHeader>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Usage Examples
            </h2>
          </DashboardCardHeader>
          <DashboardCardContent>
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                  Basic Usage
                </h3>
                <pre className="bg-slate-900 dark:bg-slate-950 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                  {`<EnhancedNotificationBar
  message="Your action was successful!"
  variant="success"
  ctaText="View Details"
  ctaLink="/details"
  dismissible
  onDismiss={() => setShowNotification(false)}
  showIcon
  enhanced={false} // Disable enhanced styling
/>`}
                </pre>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                  Enhanced Mode (Default)
                </h3>
                <pre className="bg-slate-900 dark:bg-slate-950 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                  {`<EnhancedNotificationBar
  message="🎉 Welcome to the new dashboard experience!"
  variant="promo"
  ctaText="Take Tour"
  ctaLink="/tour"
  showIcon
/>`}
                </pre>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                  Custom Icon
                </h3>
                <pre className="bg-slate-900 dark:bg-slate-950 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                  {`<EnhancedNotificationBar
  message="Beta feature available!"
  variant="beta"
  customIcon={<Star className="h-5 w-5" />}
/>`}
                </pre>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                  Enhanced Mode
                </h3>
                <pre className="bg-slate-900 dark:bg-slate-950 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                  {`<EnhancedNotificationBar
  message="🎉 Welcome to the new dashboard experience!"
  variant="promo"
  ctaText="Take Tour"
  ctaLink="/tour"
  showIcon
/>`}
                </pre>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                  Custom Icon
                </h3>
                <pre className="bg-slate-900 dark:bg-slate-950 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                  {`<NotificationBar
  message="Beta feature available!"
  variant="beta"
  customIcon={<Star className="h-5 w-5" />}
  enhanced={true}
/>`}
                </pre>
              </div>
            </div>
          </DashboardCardContent>
        </DashboardCard>

        {/* Variants Documentation */}
        <DashboardCard>
          <DashboardCardHeader>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Available Variants
            </h2>
          </DashboardCardHeader>
          <DashboardCardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  variant: 'info',
                  desc: 'General information',
                  color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-100',
                },
                {
                  variant: 'success',
                  desc: 'Positive actions',
                  color:
                    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-100',
                },
                {
                  variant: 'warning',
                  desc: 'Important alerts',
                  color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-100',
                },
                {
                  variant: 'promo',
                  desc: 'Marketing offers',
                  color: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-100',
                },
                {
                  variant: 'announcement',
                  desc: 'System updates',
                  color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-100',
                },
                {
                  variant: 'beta',
                  desc: 'New features',
                  color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-100',
                },
              ].map((item) => (
                <div
                  key={item.variant}
                  className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-slate-200/60 dark:border-slate-700/60"
                >
                  <Badge className={`mb-2 ${item.color}`}>{item.variant}</Badge>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </DashboardCardContent>
        </DashboardCard>
      </div>
    </div>
  );
}
