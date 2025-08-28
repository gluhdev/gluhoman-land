'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { NAVIGATION, CONTACT_INFO } from '@/constants';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Premium Glass Header */}
      <header 
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          isScrolled 
            ? 'glass-menu-strong' 
            : 'glass-menu'
        }`}
      >
        <div className="container max-w-7xl mx-auto flex h-24 items-center justify-between px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/images/logo.png" 
              alt="Глухомань логотип" 
              width={240} 
              height={80}
              className="h-16 md:h-18 w-auto object-contain"
              style={{
                filter: 'drop-shadow(2px 2px 0px white) drop-shadow(-2px -2px 0px white) drop-shadow(2px -2px 0px white) drop-shadow(-2px 2px 0px white)',
                marginTop: '10px',
                marginBottom: '10px'
              }}
            />
          </Link>

          {/* Desktop Navigation - Full Menu Always Visible */}
          <nav className="hidden md:flex items-center space-x-2">
            {NAVIGATION.map((item, index) => (
              <div key={item.name} className="relative group">
                {item.children ? (
                  <div className="relative">
                    <button className="flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-black text-foreground/80 hover:text-primary hover:bg-primary/10 transition-all duration-300" style={{
                      textShadow: '0 0 6px rgba(255, 255, 255, 0.9), 0 0 12px rgba(255, 255, 255, 0.6), 1px 1px 0px rgba(255, 255, 255, 0.8)'
                    }}>
                      <span>{item.name}</span>
                      <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
                    </button>
                    
                    {/* Premium Dropdown */}
                    <div className="absolute left-0 top-full mt-2 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="bg-white/95 backdrop-blur-xl border border-white/40 rounded-2xl p-2 shadow-2xl">
                        <div className="grid gap-1">
                          {item.children.map((child, childIndex) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className="block rounded-xl px-4 py-3 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-primary/10 transition-all duration-300"
                              style={{ animationDelay: `${childIndex * 50}ms` }}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                                <span>{child.name}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="px-4 py-2 rounded-xl text-sm font-black text-foreground/80 hover:text-primary hover:bg-primary/10 transition-all duration-300"
                    style={{
                      textShadow: '0 0 6px rgba(255, 255, 255, 0.9), 0 0 12px rgba(255, 255, 255, 0.6), 1px 1px 0px rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Contact and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Premium Phone Button */}
            <div className="hidden lg:flex">
              <Button 
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white rounded-xl px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => window.location.href = `tel:${CONTACT_INFO.phone[0].replace(/\s/g, '')}`}
              >
                <Phone className="h-4 w-4 mr-2" />
                {CONTACT_INFO.phone[0]}
              </Button>
            </div>

            {/* Contact Button and Mobile Menu - Only on Mobile */}
            <div className="md:hidden flex items-center space-x-2">
              <Button
                size="sm"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white rounded-xl p-3 shadow-lg"
                style={{
                  textShadow: '1px 1px 0px white, -1px -1px 0px white, 1px -1px 0px white, -1px 1px 0px white'
                }}
                onClick={() => window.location.href = `tel:${CONTACT_INFO.phone[0].replace(/\s/g, '')}`}
              >
                <Phone className="h-4 w-4" />
              </Button>
              
              {/* Mobile Menu Button */}
              <Button
                variant="outline"
                size="sm"
                className="glass-menu border-white/20 hover:bg-white/10 rounded-xl"
                style={{
                  textShadow: '1px 1px 0px white, -1px -1px 0px white, 1px -1px 0px white, -1px 1px 0px white'
                }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Premium Mobile Menu Overlay - Only on Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          {/* Enhanced Dark Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Mobile Menu Panel with Enhanced Glass Effect */}
          <div className="relative w-80 h-full bg-black/40 backdrop-blur-2xl border-r border-white/30 animate-mobile-menu">
            <div className="p-6 pt-24">
              {/* Mobile Logo */}
              <div className="mb-8">
                <Image 
                  src="/images/logo.png" 
                  alt="Глухомань логотип" 
                  width={220} 
                  height={73}
                  className="h-20 w-auto object-contain"
                  style={{
                    filter: 'drop-shadow(2px 2px 0px white) drop-shadow(-2px -2px 0px white) drop-shadow(2px -2px 0px white) drop-shadow(-2px 2px 0px white)'
                  }}
                />
              </div>

              {/* Mobile Navigation */}
              <nav className="space-y-2">
                {NAVIGATION.map((item, index) => (
                  <div key={item.name}>
                    {item.children ? (
                      <div className="space-y-2">
                        <div className="text-lg font-semibold text-white px-4 py-3 animate-mobile-menu-item"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                            <span>{item.name}</span>
                          </div>
                        </div>
                        <div className="ml-6 space-y-1">
                          {item.children.map((child, childIndex) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className="block rounded-xl px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 animate-mobile-menu-item menu-item-hover"
                              style={{ animationDelay: `${(index * 100) + (childIndex * 50) + 200}ms` }}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className="block rounded-xl px-4 py-3 text-lg font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 animate-mobile-menu-item menu-item-hover"
                        style={{ animationDelay: `${index * 100}ms` }}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                          <span>{item.name}</span>
                        </div>
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
              
              {/* Mobile Contact Info */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="space-y-3">
                  <div className="text-sm font-medium text-white/60 mb-4 animate-mobile-menu-item" style={{ animationDelay: '600ms' }}>
                    Зв&apos;яжіться з нами
                  </div>
                  {CONTACT_INFO.phone.slice(0, 2).map((phone, index) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\s/g, '')}`}
                      className="flex items-center space-x-3 rounded-xl px-4 py-3 hover:bg-white/10 transition-all duration-300 animate-mobile-menu-item"
                      style={{ animationDelay: `${700 + (index * 100)}ms` }}
                    >
                      <Phone className="h-4 w-4 text-accent" />
                      <span className="text-white/80">{phone}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-24"></div>
    </>
  );
}