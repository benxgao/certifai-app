import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FaHome, FaArrowLeft, FaCompass } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="p-12">
            <div className="text-center space-y-8">
              {/* 404 Illustration */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-violet-100 to-blue-100 dark:from-violet-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
                    <FaCompass className="w-16 h-16 text-violet-600 dark:text-violet-400 animate-pulse" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 dark:bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">!</span>
                  </div>
                </div>
              </div>

              {/* 404 Content */}
              <div className="space-y-4">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                  404
                </h1>
                <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
                  Page Not Found
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Oops! The page you&apos;re looking for seems to have wandered off. Let&apos;s get
                  you back on track.
                </p>
              </div>

              {/* Helpful Information */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-6">
                <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-3">
                  What happened?
                </h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2 text-left">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 dark:text-blue-400 mt-0.5">•</span>
                    <span>The URL might be typed incorrectly</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 dark:text-blue-400 mt-0.5">•</span>
                    <span>The page might have been moved or deleted</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 dark:text-blue-400 mt-0.5">•</span>
                    <span>You might need to sign in to access this content</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button
                  asChild
                  variant="outline"
                  className="min-w-[160px] h-12 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <Link href="javascript:history.back()">
                    <FaArrowLeft className="w-4 h-4 mr-2" />
                    Go Back
                  </Link>
                </Button>
                <Button
                  asChild
                  className="min-w-[160px] h-12 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 shadow-lg"
                >
                  <Link href="/">
                    <FaHome className="w-4 h-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
              </div>

              {/* Additional Navigation */}
              <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Looking for something specific?
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button asChild variant="ghost" size="sm" className="text-xs">
                    <Link href="/main/certifications">Certifications</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm" className="text-xs">
                    <Link href="/main/profile">Profile</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm" className="text-xs">
                    <Link href="/support">Support</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm" className="text-xs">
                    <Link href="/contact">Contact</Link>
                  </Button>
                </div>
              </div>

              {/* Help Section */}
              <div className="pt-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Still having trouble?{' '}
                  <Link
                    href="/support"
                    className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 underline underline-offset-2"
                  >
                    Contact our support team
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
