'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white/80 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-blue-600">
            TransparentLedger
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-gray-900 hover:text-blue-600">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-900 hover:text-blue-600">
              How It Works
            </a>
            <Link 
              href="/auth/login" 
              className="text-sm font-medium text-gray-900 hover:text-blue-600"
            >
              Sign In
            </Link>
            <Link 
              href="/auth/register" 
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <span className="h-6 w-6">✕</span>
              ) : (
                <span className="h-6 w-6">☰</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
          <a
            href="#features"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            How It Works
          </a>
          <Link
            href="/auth/login"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsMenuOpen(false)}
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
