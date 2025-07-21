'use client';

import React, { memo } from 'react';

interface AuthLeftSectionProps {
  mode: 'signin' | 'signup';
}

const AuthLeftSection: React.FC<AuthLeftSectionProps> = memo(({ mode }) => {
  const isSignup = mode === 'signup';

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
      {/* Enhanced background patterns matching home page */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large gradient orbs for depth */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-purple-200/15 dark:bg-purple-600/8 rounded-full blur-3xl"></div>

        {/* Subtle geometric accent shapes */}
        <div className="absolute top-32 left-32 w-20 h-20 bg-gradient-to-br from-violet-200/30 to-purple-200/30 dark:from-violet-800/20 dark:to-purple-700/20 rounded-3xl rotate-12 animate-pulse delay-3000"></div>
        <div className="absolute bottom-40 right-24 w-16 h-16 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 dark:from-blue-800/20 dark:to-cyan-700/20 rounded-2xl rotate-45 animate-pulse delay-4000"></div>
        <div className="absolute top-1/3 left-16 w-12 h-12 bg-gradient-to-br from-purple-200/30 to-pink-200/30 dark:from-purple-800/20 dark:to-pink-700/20 rounded-xl rotate-6 animate-pulse delay-5000"></div>
      </div>

      {/* Content container positioned relative to viewport */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen lg:fixed lg:top-0 lg:left-0 lg:w-1/2 lg:h-screen lg:flex lg:items-center lg:justify-center lg:pointer-events-none">
        <div className="max-w-xl p-12 mx-auto w-full lg:pointer-events-auto">
          <div className="space-y-8">
            {/* Modern header with integrated icon */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 leading-tight">
                    {currentContent.title}
                  </h2>
                </div>
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentContent.description}
              </p>
            </div>

            {/* Feature List - Enhanced cards matching home page style */}
            <div className="space-y-4">
              {currentContent.features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-lg rounded-2xl p-6 hover:shadow-xl hover:border-violet-300/60 dark:hover:border-violet-700/60 transition-all duration-500 transform hover:-translate-y-1 hover:scale-[1.02] overflow-hidden"
                >
                  {/* Background gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-transparent dark:from-violet-900/20 dark:via-transparent dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                  <div className="relative flex items-start space-x-4">
                    <div
                      className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${feature.bgColor} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      {renderIcon(feature.icon, 'relative w-6 h-6 text-white')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="relative font-bold text-slate-900 dark:text-slate-50 text-lg leading-tight mb-2 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="relative text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats section - Integrated glass morphism design */}
            {isSignup && 'stats' in currentContent && (
              <div className="relative">
                <div className="bg-gradient-to-r from-violet-50/80 to-purple-50/80 backdrop-blur-sm rounded-2xl p-6 border border-violet-200/50 shadow-xl">
                  {/* <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-violet-700 mb-1">
                        {currentContent.stats.primary.value}
                      </div>
                      <div className="text-sm text-slate-600 font-medium">
                        {currentContent.stats.primary.label}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-violet-700 mb-1">
                        {currentContent.stats.secondary.value}
                      </div>
                      <div className="text-sm text-slate-600 font-medium">
                        {currentContent.stats.secondary.label}
                      </div>
                    </div>
                  </div> */}
                  {/* Decorative elements */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full opacity-60"></div>
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-60"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

AuthLeftSection.displayName = 'AuthLeftSection';

export default AuthLeftSection;
