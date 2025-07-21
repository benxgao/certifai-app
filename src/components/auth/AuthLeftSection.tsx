'use client';

import React, { memo } from 'react';

interface AuthLeftSectionProps {
  mode: 'signin' | 'signup';
}

const AuthLeftSection: React.FC<AuthLeftSectionProps> = memo(({ mode }) => {
  // Marketing copy
  const content = {
    signup: {
      title: 'Transform Your Career',
      description:
        'Join a growing number of beta users who are accelerating their certification success with AI-powered learning.',
      // stats: {
      //   primary: { value: 'Looks positive', label: 'Beta Success Rate' },
      //   secondary: { value: 'A growing number', label: 'Early Adopters' },
      // },
      features: [
        {
          icon: 'check',
          title: 'AI-Powered Questions',
          description: 'Unlimited practice with smart difficulty adjustment',
          bgColor: 'from-emerald-500 to-green-600',
        },
        {
          icon: 'clock',
          title: 'Real Exam Simulation',
          description: 'Authentic testing environment with timer',
          bgColor: 'from-blue-500 to-cyan-600',
        },
        {
          icon: 'chart',
          title: 'Smart Analytics',
          description: 'Track progress and identify growth opportunities',
          bgColor: 'from-violet-500 to-purple-600',
        },
      ],
    },
    signin: {
      title: 'Start Your Learning Journey',
      description:
        'Continue your IT certification journey with AI-powered practice exams and personalized learning insights.',
      features: [
        {
          icon: 'check',
          title: 'Resume Progress',
          description: 'Pick up where you left off',
          bgColor: 'from-emerald-500 to-green-600',
        },
        {
          icon: 'chart',
          title: 'View Analytics',
          description: 'Track your performance',
          bgColor: 'from-blue-500 to-cyan-600',
        },
        {
          icon: 'lightning',
          title: 'Continue Learning',
          description: 'Access new practice sessions',
          bgColor: 'from-violet-500 to-purple-600',
        },
      ],
    },
  };

  const currentContent = content[mode];

  const renderIcon = (iconType: string, className: string) => {
    switch (iconType) {
      case 'check':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'clock':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'chart':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        );
      case 'lightning':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="hidden lg:flex lg:flex-col lg:justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-full">
      {/* Enhanced background decoration matching signin/signup right side */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large gradient orbs for depth */}
        <div className="absolute top-10 left-10 w-48 h-48 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl lg:block"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl lg:block"></div>

        {/* Desktop patterns */}
        <div className="absolute top-20 left-16 w-32 h-32 bg-violet-200/15 dark:bg-violet-600/8 rounded-full blur-2xl lg:block"></div>
        <div className="absolute bottom-32 right-16 w-40 h-40 bg-blue-200/15 dark:bg-blue-600/8 rounded-full blur-2xl lg:block"></div>

        {/* Subtle geometric accent shapes */}
        <div className="absolute top-32 left-20 w-16 h-16 bg-gradient-to-br from-violet-200/30 to-purple-200/30 dark:from-violet-800/20 dark:to-purple-700/20 rounded-2xl rotate-12 animate-pulse delay-3000 lg:block"></div>
        <div className="absolute bottom-40 right-20 w-12 h-12 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 dark:from-blue-800/20 dark:to-cyan-700/20 rounded-xl rotate-45 animate-pulse delay-4000 lg:block"></div>
      </div>

      {/* Content container with precise form alignment */}
      <div className="relative z-10 flex flex-col lg:fixed lg:top-30 lg:left-0 lg:w-1/2 lg:h-screen lg:pointer-events-none">
        <div className="flex items-center justify-center py-4 sm:py-8 lg:py-20 px-4 sm:px-6 lg:px-16  lg:pointer-events-auto">
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-lg xl:max-w-xl">
            {/* Main content container matching form card positioning */}
            <div className="pt-4 sm:pt-6 lg:pt-6">
              {/* Header section with exact form alignment */}
              <div className="mb-6 sm:mb-8 lg:mb-10">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight">
                  {currentContent.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                  {currentContent.description}
                </p>
              </div>

              {/* Feature list with form-like spacing */}
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                {currentContent.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-violet-300/60 dark:hover:border-violet-700/60"
                  >
                    <div
                      className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${feature.bgColor} rounded-xl flex items-center justify-center shadow-md`}
                    >
                      {renderIcon(feature.icon, 'w-5 h-5 sm:w-6 sm:h-6 text-white')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-50 text-sm sm:text-base lg:text-lg leading-tight mb-1 sm:mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

AuthLeftSection.displayName = 'AuthLeftSection';

export default AuthLeftSection;
