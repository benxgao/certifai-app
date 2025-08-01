'use client';

import React, { memo } from 'react';

interface AuthLeftSectionProps {
  mode: 'signin' | 'signup';
}

const AuthLeftSection: React.FC<AuthLeftSectionProps> = memo(({ mode }) => {
  // Concise marketing copy optimized for reduced height
  const content = {
    signup: {
      title: 'Master IT Certifications',
      subtitle: 'AWS • Azure • GCP & More',
      description:
        'AI-powered practice exams with personalized study plans to accelerate your certification success.',
      badge: {
        text: 'Free Beta',
        highlight: true,
      },
      features: [
        {
          icon: 'brain',
          title: 'AI-Powered Learning',
          description: 'Adaptive questions targeting knowledge gaps',
          bgColor: 'from-violet-500 to-purple-600',
        },
        {
          icon: 'clock',
          title: 'Real Exam Simulation',
          description: 'Authentic testing environment & timing',
          bgColor: 'from-blue-500 to-cyan-600',
        },
      ],
    },
    signin: {
      title: 'Welcome Back!',
      subtitle: 'Continue Your Progress',
      description:
        'Resume your certification journey with AI-powered practice exams and detailed analytics.',
      badge: {
        text: 'Ready to Learn',
        highlight: false,
      },
      features: [
        {
          icon: 'play',
          title: 'Resume Learning',
          description: 'Pick up where you left off',
          bgColor: 'from-violet-500 to-purple-600',
        },
        {
          icon: 'chart',
          title: 'View Analytics',
          description: 'Track your performance insights',
          bgColor: 'from-emerald-500 to-green-600',
        },
      ],
    },
  };

  const currentContent = content[mode];

  const renderIcon = (iconType: string, className: string) => {
    switch (iconType) {
      case 'brain':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        );
      case 'play':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
        );
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
    <div className="hidden lg:flex lg:flex-col lg:justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-violet-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-violet-950/20 min-h-full">
      {/* Enhanced background decoration with more sophisticated patterns */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Multiple gradient orbs for depth - matching landing page style */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-purple-200/15 dark:bg-purple-600/8 rounded-full blur-2xl"></div>

        {/* Subtle gradient overlay for enhanced depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-blue-50/30 dark:from-violet-900/10 dark:via-transparent dark:to-blue-900/10"></div>
      </div>

      {/* Content container with precise form alignment - compact version */}
      <div className="relative z-10 flex flex-col lg:fixed lg:top-30 lg:left-0 lg:w-1/2 lg:h-screen lg:pointer-events-none">
        <div className="flex items-center justify-end py-3 sm:py-6 lg:py-12 px-4 sm:px-6 lg:px-18 lg:pointer-events-auto">
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-lg xl:max-w-xl">
            {/* Main content container - compact spacing */}
            <div className="pt-3 sm:pt-4 lg:pt-6">
              {/* Compact beta badge */}
              <div className="inline-flex items-center gap-2 bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800/50 rounded-full px-3 py-1.5 mb-4 backdrop-blur-sm">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    currentContent.badge.highlight ? 'bg-violet-500 animate-pulse' : 'bg-violet-400'
                  }`}
                  aria-hidden="true"
                ></div>
                <span className="text-xs font-medium text-violet-700 dark:text-violet-300">
                  {currentContent.badge.text}
                </span>
              </div>

              {/* Enhanced header section with better typography hierarchy */}
              <div className="mb-6 sm:mb-8 lg:mb-10">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2 sm:mb-3 leading-tight">
                  {currentContent.title}
                </h2>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight">
                  {currentContent.subtitle}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  {currentContent.description}
                </p>
              </div>

              {/* Compact feature list with reduced spacing */}
              <div className="space-y-3 sm:space-y-4">
                {currentContent.features.map((feature, index) => (
                  <div
                    key={index}
                    className="group flex items-center space-x-3 p-4 sm:p-5 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-violet-300/60 dark:hover:border-violet-700/60 hover:scale-[1.01] hover:-translate-y-0.5 relative overflow-hidden"
                  >
                    {/* Compact decorative elements */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-300"></div>
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-300"></div>

                    {/* Subtle hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

                    <div className="relative z-10 flex items-center space-x-3 w-full">
                      <div
                        className={`flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br ${feature.bgColor} rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300`}
                      >
                        {renderIcon(feature.icon, 'w-5 h-5 sm:w-6 sm:h-6 text-white')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-50 text-sm sm:text-base leading-tight mb-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
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
