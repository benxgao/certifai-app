'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';

interface ScreenshotSlideshowProps {
  className?: string;
}

const ScreenshotSlideshow: React.FC<ScreenshotSlideshowProps> = ({ className }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const slideshowRef = useRef<HTMLDivElement>(null);

  // Screenshot images from public/images/landing/screenshots - memoized for performance
  const screenshots = useMemo(
    () => [
      {
        src: '/images/landing/screenshots/1.png',
        alt: 'CertifAI Dashboard - Practice Exams',
        title: 'AI-Powered Practice Exams',
      },
      {
        src: '/images/landing/screenshots/2.png',
        alt: 'CertifAI Exam Interface - Real-time Results',
        title: 'Real-time Performance Analytics',
      },
      {
        src: '/images/landing/screenshots/3.png',
        alt: 'CertifAI Progress Tracking - Detailed Insights',
        title: 'Comprehensive Progress Tracking',
      },
      {
        src: '/images/landing/screenshots/4.png',
        alt: 'CertifAI Study Materials - Interactive Learning',
        title: 'Interactive Study Materials',
      },
    ],
    [],
  );

  // Intersection Observer to only start animation when in view
  useEffect(() => {
    if (typeof window === 'undefined' || !slideshowRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    observer.observe(slideshowRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Auto-advance slides only when in view
  useEffect(() => {
    if (!isPlaying || !isInView) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % screenshots.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isPlaying, isInView, screenshots.length]);

  // Preload next image for smoother transitions
  useEffect(() => {
    const nextSlideIndex = (currentSlide + 1) % screenshots.length;
    if (typeof window !== 'undefined') {
      const img = new window.Image();
      img.src = screenshots[nextSlideIndex].src;
    }
  }, [currentSlide, screenshots]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % screenshots.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  return (
    <div
      ref={slideshowRef}
      className={`relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-xl overflow-hidden ${className}`}
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Main slideshow container - Made taller for bigger appearance */}
      <div className="relative aspect-[16/10]">
        {screenshots.map((screenshot, index) => {
          // Only render current slide and adjacent slides for better performance
          const shouldRender =
            Math.abs(index - currentSlide) <= 1 ||
            (currentSlide === 0 && index === screenshots.length - 1) ||
            (currentSlide === screenshots.length - 1 && index === 0);

          if (!shouldRender) return null;

          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={screenshot.src}
                alt={screenshot.alt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={index === 0}
                loading={index === 0 ? 'eager' : 'lazy'}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFnyMolemMcTGWjKw8HgZhSplkwKMgZIjPJJl3+dR8I6jrfMcA3xS+1LILZJqP4vUFGjWCjFTN4pDHi9nCwpPPQWCKzjOkqGj1XvuKWCEqT06vW2mMoTYUwV"
              />
            </div>
          );
        })}

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 opacity-0 hover:opacity-100 group-hover:opacity-100 cursor-pointer"
          aria-label="Previous slide"
        >
          <svg
            className="w-5 h-5 text-slate-700 dark:text-slate-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 opacity-0 hover:opacity-100 group-hover:opacity-100 cursor-pointer"
          aria-label="Next slide"
        >
          <svg
            className="w-5 h-5 text-slate-700 dark:text-slate-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Play/Pause button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute top-4 right-4 w-8 h-8 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 opacity-0 hover:opacity-100 group-hover:opacity-100 cursor-pointer"
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          {isPlaying ? (
            <svg
              className="w-4 h-4 text-slate-700 dark:text-slate-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-slate-700 dark:text-slate-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Title overlay - Only covers the title bar area */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="bg-gradient-to-t from-black/70 via-black/40 to-transparent p-6">
            <h3 className="text-white font-semibold text-lg mb-1">
              {screenshots[currentSlide].title}
            </h3>
            <p className="text-white/90 text-sm">
              Experience the power of AI-driven certification training
            </p>
          </div>
        </div>
      </div>

      {/* Dot indicators - Positioned above the title overlay */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {screenshots.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 cursor-pointer ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
        <div
          className="h-full bg-violet-500 transition-all duration-100 ease-linear"
          style={{
            width: isPlaying ? `${((currentSlide + 1) / screenshots.length) * 100}%` : '0%',
          }}
        />
      </div>
    </div>
  );
};

export default ScreenshotSlideshow;
