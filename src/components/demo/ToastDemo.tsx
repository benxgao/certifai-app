'use client';

import React, { useState } from 'react';
import { ActionButton } from '@/src/components/custom/ActionButton';
import { toastHelpers } from '@/src/lib/toast';
import { FaPlay, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import EnhancedNotificationBar from '@/src/components/custom/NotificationBar';

/**
 * Demo component to showcase the improved toast notification system
 * Tests all notification types with the new dashboard-consistent styling
 * Now includes integration with the enhanced notification bar
 */
export default function ToastDemo() {
  const [showNotificationBar, setShowNotificationBar] = useState(true);

  const handleSuccessToast = () => {
    toastHelpers.success.examCreated('demo-exam-123');
  };

  const handleErrorToast = () => {
    toastHelpers.error.examSubmissionFailed(
      'Network connection timeout. Please check your internet connection and try again.',
    );
  };

  const handleWarningToast = () => {
    toastHelpers.warning.examTimeRemaining(15);
  };

  const handleInfoToast = () => {
    toastHelpers.info.examAutoSave();
  };

  const handlePromiseToast = () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve('Success!');
        } else {
          reject(new Error('Demo error'));
        }
      }, 3000);
    });

    toastHelpers.promise.createExam(promise, {
      loading: 'Creating your demo exam...',
      success: '🎉 Demo exam created successfully!',
      error: 'Failed to create demo exam',
    });
  };

  const handleConfirmToast = () => {
    toastHelpers.confirm(
      'Are you sure you want to delete this demo exam?',
      () => {
        toastHelpers.success.examDeleted();
      },
      () => {
        toastHelpers.info.loadingData();
      },
    );
  };

  const handleComplexToast = () => {
    toastHelpers.success.examReady();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-violet-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-violet-950/20">
      {/* Enhanced Notification Bar */}
      {showNotificationBar && (
        <EnhancedNotificationBar
          message="🧪 This is a demo environment showcasing toast and notification bar integration"
          variant="info"
          ctaText="View Components"
          ctaLink="/demo"
          dismissible
          onDismiss={() => setShowNotificationBar(false)}
          showIcon
        />
      )}

      <div className="p-8 max-w-4xl mx-auto space-y-8 pt-16">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            🍞 Enhanced Toast Demo
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
            Test the improved toast notification system with dashboard-consistent glass-morphism
            styling and notification bar integration
          </p>
          {!showNotificationBar && (
            <ActionButton onClick={() => setShowNotificationBar(true)} variant="outline" size="sm">
              Show Notification Bar
            </ActionButton>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Toast Types */}
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-2xl rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Basic Notifications
            </h2>

            <ActionButton
              onClick={handleSuccessToast}
              variant="primary"
              size="lg"
              icon={<FaCheckCircle className="w-4 h-4" />}
              className="w-full"
            >
              Success Toast
            </ActionButton>

            <ActionButton
              onClick={handleErrorToast}
              variant="outline"
              size="lg"
              icon={<FaExclamationTriangle className="w-4 h-4" />}
              className="w-full text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-950/20"
            >
              Error Toast
            </ActionButton>

            <ActionButton
              onClick={handleWarningToast}
              variant="secondary"
              size="lg"
              icon={<FaExclamationTriangle className="w-4 h-4" />}
              className="w-full bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700"
            >
              Warning Toast
            </ActionButton>

            <ActionButton
              onClick={handleInfoToast}
              variant="outline"
              size="lg"
              icon={<FaInfoCircle className="w-4 h-4" />}
              className="w-full text-blue-600 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-blue-950/20"
            >
              Info Toast
            </ActionButton>
          </div>

          {/* Advanced Toast Features */}
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-2xl rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Advanced Features
            </h2>

            <ActionButton
              onClick={handlePromiseToast}
              variant="primary"
              size="lg"
              icon={<FaPlay className="w-4 h-4" />}
              className="w-full"
            >
              Promise Toast (3s)
            </ActionButton>

            <ActionButton
              onClick={handleConfirmToast}
              variant="outline"
              size="lg"
              className="w-full"
            >
              Confirmation Dialog
            </ActionButton>

            <ActionButton
              onClick={handleComplexToast}
              variant="success"
              size="lg"
              className="w-full"
            >
              Action Button Toast
            </ActionButton>

            <ActionButton
              onClick={() => toastHelpers.dismissAll()}
              variant="secondary"
              size="lg"
              className="w-full"
            >
              Dismiss All Toasts
            </ActionButton>
          </div>
        </div>

        {/* Style Preview */}
        <div className="bg-gradient-to-r from-violet-50/80 to-blue-50/80 dark:from-violet-950/20 dark:to-blue-950/20 border border-violet-200/60 dark:border-violet-700/60 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
            ✨ Enhanced Features
          </h3>
          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span>Glass-morphism backdrop blur effects</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-violet-500 rounded-full"></span>
              <span>Gradient backgrounds for different toast types</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Enhanced shadows and depth for modern look</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              <span>Improved button styling with gradients</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
              <span>Dark mode compatibility with enhanced contrast</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
