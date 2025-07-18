/**
 * Toast Notification Demo Component
 * This component demonstrates all available toast notifications in the application.
 * Useful for testing and showcasing the notification system.
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toastHelpers } from '@/src/lib/toast';

export default function ToastDemo() {
  const handlePromiseDemo = () => {
    // Simulate an async operation
    const mockPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve('Operation successful!');
        } else {
          reject(new Error('Operation failed!'));
        }
      }, 2000);
    });

    toastHelpers.promise.submitExam(mockPromise);
  };

  const handleConfirmDemo = () => {
    toastHelpers.confirm(
      'Are you sure you want to delete this exam?',
      () => console.log('Exam deleted!'),
      () => console.log('Delete cancelled'),
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>🍞 Toast Notification Demo</CardTitle>
          <p className="text-sm text-muted-foreground">
            Test all available toast notifications in the application
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Success Notifications */}
          <div>
            <h3 className="text-lg font-semibold mb-3">✅ Success Notifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toastHelpers.success.examSubmitted()}
              >
                Exam Submitted
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toastHelpers.success.answerSaved()}
              >
                Answer Saved
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toastHelpers.success.examCreated('exam-123')}
              >
                Exam Created
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toastHelpers.success.profileUpdated()}
              >
                Profile Updated
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toastHelpers.success.emailVerificationSent()}
              >
                Email Verification
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toastHelpers.success.examDeleted()}
              >
                Exam Deleted
              </Button>
            </div>
          </div>

          <Separator />

          {/* Error Notifications */}
          <div>
            <h3 className="text-lg font-semibold mb-3">❌ Error Notifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toastHelpers.error.examSubmissionFailed('Network timeout')}
              >
                Exam Submit Failed
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toastHelpers.error.answerSaveFailed('Connection lost')}
              >
                Answer Save Failed
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toastHelpers.error.examCreationFailed('Invalid parameters')}
              >
                Exam Creation Failed
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toastHelpers.error.missingInformation()}
              >
                Missing Info
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toastHelpers.error.authenticationFailed()}
              >
                Auth Failed
              </Button>
              <Button variant="outline" size="sm" onClick={() => toastHelpers.error.networkError()}>
                Network Error
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toastHelpers.error.rateLimitExceeded('in 1 hour')}
              >
                Rate Limited
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toastHelpers.error.examDeletionFailed('Permission denied')}
              >
                Delete Failed
              </Button>
            </div>
          </div>

          <Separator />

          {/* Info Notifications */}
          <div>
            <h3 className="text-lg font-semibold mb-3">ℹ️ Info Notifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Button variant="outline" size="sm" onClick={() => toastHelpers.info.examAutoSave()}>
                Auto Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toastHelpers.info.passwordRequired()}
              >
                Password Required
              </Button>
              <Button variant="outline" size="sm" onClick={() => toastHelpers.info.loadingData()}>
                Loading Data
              </Button>
            </div>
          </div>

          <Separator />

          {/* Warning Notifications */}
          <div>
            <h3 className="text-lg font-semibold mb-3">⚠️ Warning Notifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toastHelpers.warning.unsavedChanges()}
              >
                Unsaved Changes
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toastHelpers.warning.examTimeRemaining(15)}
              >
                Time Warning
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toastHelpers.warning.slowConnection()}
              >
                Slow Connection
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toastHelpers.warning.autoSaveEnabled()}
              >
                Auto Save Info
              </Button>
            </div>
          </div>

          <Separator />

          {/* Loading and Promise Notifications */}
          <div>
            <h3 className="text-lg font-semibold mb-3">⏳ Loading & Promise Notifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const toastId = toastHelpers.loading.examSubmission();
                  setTimeout(() => toastHelpers.dismiss(toastId), 3000);
                }}
              >
                Loading Toast
              </Button>
              <Button variant="outline" size="sm" onClick={handlePromiseDemo}>
                Promise Demo
              </Button>
              <Button variant="outline" size="sm" onClick={handleConfirmDemo}>
                Confirmation
              </Button>
            </div>
          </div>

          <Separator />

          {/* Utility Functions */}
          <div>
            <h3 className="text-lg font-semibold mb-3">🛠️ Utility Functions</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Button variant="destructive" size="sm" onClick={() => toastHelpers.dismissAll()}>
                Dismiss All
              </Button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Pro tip:</strong> Check your browser&apos;s console for confirmation
              actions and promise results. This demo component is for development purposes only.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
