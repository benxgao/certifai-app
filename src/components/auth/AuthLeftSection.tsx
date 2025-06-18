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
        'Join 500+ beta users who are accelerating their certification success with AI-powered learning.',
      stats: {
        primary: { value: '90%', label: 'Beta Success Rate' },
        secondary: { value: '500+', label: 'Early Adopters' },
      },
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
          description: 'Track progress and identify weak areas',
          bgColor: 'from-violet-500 to-purple-600',
        },
      ],
    },
    signin: {
      title: 'Welcome Back',
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

  const getMainIcon = () => {
    if (isSignup) {
      return (
        <svg
          className="w-8 h-8 text-violet-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      );
    } else {
      return (
        <svg
          className="w-8 h-8 text-violet-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      );
    }
  };

  return (
    <div className="hidden lg:flex lg:items-center lg:justify-center relative overflow-hidden bg-gradient-to-br from-violet-50 via-purple-25 to-indigo-50 min-h-full">
      {/* Light geometric background patterns */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle geometric shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-violet-100/50 to-purple-100/50 rounded-2xl rotate-12 animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-gradient-to-br from-cyan-100/50 to-blue-100/50 rounded-xl rotate-45 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-gradient-to-br from-pink-100/50 to-rose-100/50 rounded-lg rotate-6 animate-pulse delay-2000"></div>

        {/* Modern grid pattern */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-16 right-32 w-2 h-20 bg-gradient-to-b from-violet-300 to-transparent rounded-full"></div>
          <div className="absolute bottom-24 left-24 w-20 h-2 bg-gradient-to-r from-cyan-300 to-transparent rounded-full"></div>
          <div className="absolute top-1/3 right-20 w-1 h-12 bg-gradient-to-b from-pink-300 to-transparent rounded-full"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-xl p-12">
        <div className="space-y-8">
          {/* Modern header with integrated icon */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                {getMainIcon()}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-slate-900 leading-tight">
                  {currentContent.title}
                </h2>
              </div>
            </div>
            <p className="text-lg text-slate-600 leading-relaxed">{currentContent.description}</p>
          </div>

          {/* Feature List - Clean cards integrated with background */}
          <div className="space-y-3">
            {currentContent.features.map((feature, index) => (
              <div
                key={index}
                className="group flex items-start space-x-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-slate-200/50 hover:bg-white/80 hover:border-slate-300/60 hover:shadow-lg transition-all duration-300"
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 bg-gradient-to-br ${feature.bgColor} rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200`}
                >
                  {renderIcon(feature.icon, 'w-5 h-5 text-white')}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 text-base leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats section - Integrated glass morphism design */}
          {isSignup && 'stats' in currentContent && (
            <div className="relative">
              <div className="bg-gradient-to-r from-violet-50/80 to-purple-50/80 backdrop-blur-sm rounded-2xl p-6 border border-violet-200/50 shadow-xl">
                <div className="grid grid-cols-2 gap-6">
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
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full opacity-60"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-60"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

AuthLeftSection.displayName = 'AuthLeftSection';

export default AuthLeftSection;
