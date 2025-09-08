"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

// Navigation data centralized for better maintainability
const NAVIGATION_ITEMS = [
  { href: "/", labelKey: "nav.home" },
  { href: "/projeler", labelKey: "nav.projects" },
  { href: "/referanslar", labelKey: "nav.references" },
  { href: "/hakkimizda", labelKey: "nav.about" },
  { href: "/iletisim", labelKey: "nav.contact" },
] as const;

// Animated hamburger icon that transforms to X
const HamburgerIcon = ({ isOpen }: { isOpen: boolean }) => (
  <div className="relative w-6 h-6 flex flex-col justify-center items-center">
    {/* Top line */}
    <span
      className={`block w-5 h-0.5 bg-current transition-all duration-300 ease-in-out ${
        isOpen 
          ? 'rotate-45 translate-y-0.5' 
          : '-translate-y-1.5'
      }`}
    />
    {/* Middle line */}
    <span
      className={`block w-5 h-0.5 bg-current transition-all duration-300 ease-in-out ${
        isOpen 
          ? 'opacity-0' 
          : 'opacity-100'
      }`}
    />
    {/* Bottom line */}
    <span
      className={`block w-5 h-0.5 bg-current transition-all duration-300 ease-in-out ${
        isOpen 
          ? '-rotate-45 -translate-y-0.5' 
          : 'translate-y-1.5'
      }`}
    />
  </div>
);

// Optimized navigation link component
const NavLink = ({ 
  href, 
  children, 
  className, 
  onClick,
  showUnderline = false
}: {
  href: string;
  children: React.ReactNode;
  className: string;
  onClick?: () => void;
  showUnderline?: boolean;
}) => (
  <Link href={href} onClick={onClick} className={className}>
    {children}
    {showUnderline && (
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 ease-out group-hover:w-full"></span>
    )}
  </Link>
);

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = useTranslations('common');

  // Optimized handlers with useCallback
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);


  // Memoized class names for better performance
  const mobileMenuClasses = useMemo(() => 
    `md:hidden transition-all duration-300 ease-in-out ${
      isMobileMenuOpen 
        ? 'max-h-64 opacity-100' 
        : 'max-h-0 opacity-0 overflow-hidden'
    }`, [isMobileMenuOpen]
  );

  const desktopNavClasses = "text-white hover:text-gray-300 px-2 lg:px-3 py-2 text-sm lg:text-base font-medium transition-colors duration-200 relative group";
  const mobileNavClasses = "text-white hover:text-gray-300 hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200";

  return (
    <nav className="bg-[#262626] shadow-lg sticky top-0 z-50" role="navigation" aria-label={t('navbar.aria-label')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center" aria-label={t('navbar.homeLabel')}>
              <Image
                src="/sencer-logo.png"
                alt={t('navbar.logoAlt')}
                width={120}
                height={40}
                className="h-8 w-auto sm:h-10 transition-all duration-200"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-4 lg:ml-10 flex items-center space-x-4 lg:space-x-8">
              {NAVIGATION_ITEMS.map(({ href, labelKey }) => (
                <NavLink
                  key={href}
                  href={href}
                  className={desktopNavClasses}
                  showUnderline={true}
                >
                  {t(labelKey)}
                </NavLink>
              ))}
              
              {/* Language Switcher */}
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Language Switcher for Mobile */}
            <LanguageSwitcher />
            
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 p-2 rounded-md hover:scale-105 active:scale-95"
              aria-label={isMobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <HamburgerIcon isOpen={isMobileMenuOpen} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div 
          id="mobile-menu"
          className={mobileMenuClasses}
          aria-hidden={!isMobileMenuOpen}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#262626] border-t border-gray-700">
            {NAVIGATION_ITEMS.map(({ href, labelKey }) => (
              <NavLink
                key={href}
                href={href}
                onClick={closeMobileMenu}
                className={mobileNavClasses}
              >
                {t(labelKey)}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}