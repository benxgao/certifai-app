'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

// --- Landing Page for AI-Driven IT Exam Simulator ---

export default function LandingPage() {
  const [navOpen, setNavOpen] = React.useState(false);

  return (
    <>
      {/* Header with Navigation */}
      <header className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
        <nav className="flex items-center justify-between py-4 px-6 lg:px-20 relative">
          {/* Hamburger for mobile */}
          <button
            className="lg:hidden flex items-center text-indigo-600 focus:outline-none"
            aria-label="Open navigation"
            onClick={() => setNavOpen((v) => !v)}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={navOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 8h16M4 16h16'}
              />
            </svg>
          </button>
          {/* Logo */}
          <div className="flex-1 flex justify-center lg:justify-start">
            <a
              href="#home"
              className="text-2xl font-bold text-indigo-600 mx-auto lg:mx-0"
              style={{ minWidth: 120 }}
            >
              CertifyIT
            </a>
          </div>
          {/* Desktop Nav */}
          <ul className="hidden lg:flex space-x-8 text-gray-700 font-medium">
            <li>
              <a href="#home" className="hover:text-indigo-600 transition">
                Home
              </a>
            </li>
            <li>
              <a href="#signup" className="hover:text-indigo-600 transition">
                Sign up
              </a>
            </li>
            <li>
              <a href="#login" className="hover:text-indigo-600 transition">
                Login
              </a>
            </li>
          </ul>
          {/* Spacer for right side on mobile */}
          <div className="w-7 h-7 lg:hidden" />
          {/* Mobile Dropdown */}
          {navOpen && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t z-50 lg:hidden animate-fade-in">
              <ul className="flex flex-col py-2 text-gray-700 font-medium">
                <li>
                  <a
                    href="#home"
                    className="block px-6 py-3 hover:bg-indigo-50"
                    onClick={() => setNavOpen(false)}
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="block px-6 py-3 hover:bg-indigo-50"
                    onClick={() => setNavOpen(false)}
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#signup"
                    className="block px-6 py-3 hover:bg-indigo-50"
                    onClick={() => setNavOpen(false)}
                  >
                    Sign up
                  </a>
                </li>
                <li>
                  <a
                    href="#login"
                    className="block px-6 py-3 hover:bg-indigo-50"
                    onClick={() => setNavOpen(false)}
                  >
                    Login
                  </a>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </header>

      {/* Add a spacer for the fixed header */}
      <div id="home" className="h-16" />

      {/* Hero with 2-column layout and dynamic background */}
      <section className="relative flex flex-col-reverse lg:flex-row items-center lg:justify-between py-20 px-6 lg:px-20 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500">
        {/* Text */}
        <div className="w-full lg:w-1/2 text-white">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">AI-Generated IT Exam Simulator</h1>
          <p className="mb-8 text-lg opacity-90">
            Practice IT certification exams with AI-generated questions, simulate real test
            environments, and analyze your strengths and weaknesses for a smarter path to success.
          </p>
          <Button className="bg-white text-indigo-600 py-3 px-8 rounded-full font-semibold hover:opacity-90">
            Register Interest
          </Button>
        </div>
        {/* Hero Image */}
        <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
          <div className="h-64 flex items-center justify-center text-white">Loading image...</div>
        </div>
        {/* Animated SVG blobs or particles could be added here */}
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 lg:px-20 bg-white">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
          What You Can Do with Our IT Exam Simulator
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {/* Feature 1: AI-Generated Questions */}
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition">
            <div className="h-12 w-12 mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-500 font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Generated Questions</h3>
            <p className="text-gray-600">
              Instantly generate practice questions tailored to your IT certification goals using
              advanced AI. Cover all major certifications including AWS, Azure, CompTIA, Cisco, and
              more.
            </p>
          </div>
          {/* Feature 2: Real Exam Simulation */}
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition">
            <div className="h-12 w-12 mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-500 font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Simulate Real Exams</h3>
            <p className="text-gray-600">
              Experience authentic exam conditions to build confidence and improve your time
              management. Mimic the format and timing of real IT certification exams.
            </p>
          </div>
          {/* Feature 3: Custom Exam Creation */}
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition">
            <div className="h-12 w-12 mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-500 font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Create Your Own Exams</h3>
            <p className="text-gray-600">
              Design personalized exams to focus on specific IT topics or skills you want to master.
              Perfect for targeted learning and group study.
            </p>
          </div>
          {/* Feature 4: Weakness Analysis */}
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition">
            <div className="h-12 w-12 mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-500 font-bold">4</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Weakness Analysis</h3>
            <p className="text-gray-600">
              Get detailed insights into your knowledge gaps and receive targeted recommendations to
              improve your IT certification readiness.
            </p>
          </div>
          {/* Feature 5: Pass Prediction */}
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition">
            <div className="h-12 w-12 mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-500 font-bold">5</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Pass Probability Prediction</h3>
            <p className="text-gray-600">
              AI predicts your chances of passing real certification exams based on your performance
              and progress.
            </p>
          </div>
          {/* Feature 6: Progress Tracking */}
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition">
            <div className="h-12 w-12 mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-500 font-bold">6</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
            <p className="text-gray-600">
              Monitor your improvement over time and celebrate your milestones as you prepare for IT
              certification exams.
            </p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-20 px-6 lg:px-20 bg-indigo-600 text-white text-center rounded-tl-3xl rounded-tr-3xl">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
          Start Practicing Smarter for IT Certifications Today
        </h2>
        <p className="mb-8 opacity-90">
          Take control of your IT certification journey with AI-powered exam simulation, custom
          practice, and detailed analytics.
        </p>
        <Button className="bg-white text-indigo-600 py-3 px-10 rounded-full font-semibold hover:opacity-90">
          Register Interest
        </Button>
      </section>
    </>
  );
}
