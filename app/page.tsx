'use client';

import React from 'react';

const Hero = () => (
  <section className="bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200 py-20">
    <div className="container mx-auto text-center">
      <h1 className="text-5xl font-bold text-purple-700 mb-6">
        Unlock Your Future with [Your Product/Service Name]
      </h1>
      <p className="text-xl text-gray-700 mb-8">
        Experience the smooth transition into tomorrow possibilities.
      </p>
      <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out">
        Get Started
      </button>
    </div>
  </section>
);

const Features = () => (
  <section className="py-16 bg-gray-50">
    <div className="container mx-auto text-center">
      <h2 className="text-3xl font-semibold text-purple-600 mb-10">
        Explore the Future-Forward Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 ease-in-out">
          <h3 className="text-xl font-semibold text-pink-500 mb-2">Innovation Hub</h3>
          <p className="text-gray-600">Discover cutting-edge solutions for tomorrow challenges.</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 ease-in-out">
          <h3 className="text-xl font-semibold text-pink-500 mb-2">Seamless Integration</h3>
          <p className="text-gray-600">Effortlessly connect with the future of technology.</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 ease-in-out">
          <h3 className="text-xl font-semibold text-pink-500 mb-2">Intuitive Interface</h3>
          <p className="text-gray-600">Navigate the future with ease and clarity.</p>
        </div>
      </div>
    </div>
  </section>
);

const Testimonials = () => (
  <section className="py-16 bg-purple-50">
    <div className="container mx-auto text-center">
      <h2 className="text-3xl font-semibold text-purple-600 mb-10">
        Trusted by Future-Minded Individuals
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-700 italic mb-4">
            &quot;This product has truly opened my eyes to the possibilities of tomorrow. The smooth
            experience is remarkable!&quot;
          </p>
          <p className="font-semibold text-pink-500">- A Visionary User</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-700 italic mb-4">
            &quot;The intuitive design and future-forward approach make this an essential tool for
            anyone looking ahead.&quot;
          </p>
          <p className="font-semibold text-pink-500">- An Early Adopter</p>
        </div>
      </div>
    </div>
  </section>
);

const CallToAction = () => (
  <section className="py-20 bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200">
    <div className="container mx-auto text-center">
      <h2 className="text-4xl font-bold text-purple-700 mb-8">Ready to Embrace the Future?</h2>
      <p className="text-xl text-gray-700 mb-10">
        Join our community of forward-thinkers and experience the smooth transition today.
      </p>
      <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out">
        Sign Up Now
      </button>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-gray-100 py-8 text-center text-gray-600">
    <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
  </footer>
);

export default function Home() {
  return (
    <div className="font-sans antialiased">
      <Hero />
      <Features />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
}
