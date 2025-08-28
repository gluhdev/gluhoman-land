'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        setIsVisible(false);
      }, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-accent transition-all duration-500 ${
        !isLoading ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center text-white">
        {/* Simple Logo */}
        <div className="mb-8">
          <div className="relative inline-block">
            <Image
              src="/images/logo.png"
              alt="Глухомань"
              width={300}
              height={100}
              className="h-24 md:h-32 w-auto mx-auto animate-logo-slide-in relative z-10"
              style={{
                filter: 'drop-shadow(2px 2px 0px white) drop-shadow(-2px -2px 0px white) drop-shadow(2px -2px 0px white) drop-shadow(-2px 2px 0px white)'
              }}
              priority
            />
          </div>
        </div>

        {/* Welcome Text */}
        <div className="mb-8 animate-text-appear">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Ласкаво просимо
          </h1>
          <p className="text-lg text-white/90">
            до ресторанно-готельного комплексу
          </p>
        </div>

        {/* Simple Loading Spinner */}
        <div className="flex items-center justify-center animate-spinner-appear">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-4 h-4 bg-white/30 rounded-full animate-ping"></div>
      <div className="absolute top-20 right-20 w-6 h-6 bg-white/20 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-20 w-3 h-3 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-10 right-10 w-5 h-5 bg-white/25 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
    </div>
  );
}