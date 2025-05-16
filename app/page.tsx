'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { getFeatures, getPricingPlans } from '@/services/featureService';

// --- Landing Page for IT Certification Product ---

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
      {/* Hero with 2-column layout and dynamic background */}
      <section className="relative flex flex-col-reverse lg:flex-row items-center lg:justify-between py-20 px-6 lg:px-20 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500">
        {/* Text */}
        <div className="w-full lg:w-1/2 text-white">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Next-Gen AI-Powered IT Certification
          </h1>
          <p className="mb-8 text-lg opacity-90">
            Empower your learning journey with AI-driven study plans, real-time feedback, and a
            vibrant community.
          </p>
          <Button className="bg-white text-indigo-600 py-3 px-8 rounded-full font-semibold hover:opacity-90">
            Try It Free
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
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {getFeatures().map((f, i) => (
            <div
              key={i}
              className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition"
            >
              <div className="h-12 w-12 mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-500 font-bold">{i + 1}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section with Card Hover Effect */}
      <section id="pricing" className="py-20 px-6 lg:px-20 bg-gray-100">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">Choose Your Plan</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {getPricingPlans().map((plan, i) => (
            <div
              key={i}
              className="p-8 bg-white rounded-2xl border border-gray-200 transform hover:-translate-y-2 hover:shadow-2xl transition"
            >
              <h3 className="text-2xl font-semibold mb-4 text-indigo-600">{plan.name}</h3>
              <div className="text-4xl font-bold mb-6">
                {plan.price.replace('/mo', '')}
                <span className="text-lg font-normal">/mo</span>
              </div>
              <ul className="mb-6 space-y-2 text-gray-600">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-center">
                    <span className="mr-2 text-indigo-500">✓</span>
                    {feat}
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-indigo-600 text-white py-3 rounded-full hover:opacity-90">
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-20 px-6 lg:px-20 bg-indigo-600 text-white text-center rounded-tl-3xl rounded-tr-3xl">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Boost Your Career?</h2>
        <p className="mb-8 opacity-90">
          Join thousands of professionals accelerating their IT certification journey with us.
        </p>
        <Button className="bg-white text-indigo-600 py-3 px-10 rounded-full font-semibold hover:opacity-90">
          Register Now
        </Button>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-6 lg:px-20 bg-gray-800 text-gray-300 text-center">
        <div className="mb-4 flex justify-center space-x-6">
          <a href="#" className="hover:text-white">
            Privacy
          </a>
          <a href="#" className="hover:text-white">
            Terms
          </a>
          <a href="#" className="hover:text-white">
            Support
          </a>
        </div>
        <div>© {new Date().getFullYear()} CertifyIT. All rights reserved.</div>
      </footer>
    </div>
  );
}
