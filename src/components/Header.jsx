import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '../data/mock';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'glass-panel' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo/Name */}
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <h1 className="font-mono text-xl font-bold text-on-glass">
              SK
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {portfolioData.navigation.map((item, index) => (
              <motion.button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-glass-secondary hover:text-on-glass transition-colors duration-300 relative group focus:text-on-glass"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[var(--color-highlight)] to-transparent group-hover:w-full group-focus:w-full transition-all duration-300"></span>
              </motion.button>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <motion.button
              className="glass-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('#contact')}
            >
              Hire Me
            </motion.button>
            <motion.a
              href="/resume.pdf"
              download
              className="glass-button primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Resume
            </motion.a>
          </div>

          {/* Mobile Menu Button - Animated Grid Dots */}
          <div className="block md:hidden">
            <motion.button
              className="relative w-12 h-12 glass-panel-subtle rounded-lg flex items-center justify-center group hover:bg-white/10 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="grid grid-cols-3 gap-1 p-2">
                {[...Array(9)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-highlight), #ffffff)',
                      boxShadow: '0 0 4px var(--color-highlight)',
                    }}
                    animate={{
                      scale: isMobileMenuOpen 
                        ? (i === 4 ? 1.2 : 0)
                        : 1,
                      rotate: isMobileMenuOpen ? 180 : 0,
                      opacity: isMobileMenuOpen && (i === 0 || i === 2 || i === 6 || i === 8) 
                        ? 0
                        : 1,
                    }}
                    transition={{ 
                      duration: 0.3, 
                      delay: i * 0.02,
                      ease: [0.4, 0.0, 0.2, 1] 
                    }}
                  />
                ))}
              </div>
              
              {/* Subtle glow effect on hover */}
              <motion.div
                className="absolute inset-0 rounded-lg bg-gradient-to-br from-[var(--color-highlight)]/0 to-[var(--color-highlight)]/0 group-hover:from-[var(--color-highlight)]/10 group-hover:to-transparent transition-all duration-300 pointer-events-none"
              />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          className="mobile-sidebar-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sliding Sidebar */}
      <motion.div
        className="mobile-sidebar"
        initial={{ x: '100%' }}
        animate={{ x: isMobileMenuOpen ? 0 : '100%' }}
        transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--glass-border)]">
            <h2 className="text-lg font-semibold text-on-glass">Menu</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6 text-on-glass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-6">
            <nav className="space-y-2 px-6">
              {portfolioData.navigation && portfolioData.navigation.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="flex items-center w-full text-left text-glass-secondary hover:text-on-glass hover:bg-white/5 focus:text-on-glass focus:bg-white/10 transition-all duration-300 py-3 px-4 rounded-lg group"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: isMobileMenuOpen ? index * 0.05 : 0 }}
                  whileHover={{ x: 8 }}
                >
                  <span className="flex-1">{item.name}</span>
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              ))}
            </nav>
          </div>

          {/* Sidebar Footer - CTA Buttons */}
          <div className="p-6 border-t border-[var(--glass-border)] space-y-3">
            <motion.button
              className="glass-button w-full"
              onClick={() => scrollToSection('#contact')}
              whileTap={{ scale: 0.98 }}
            >
              Hire Me
            </motion.button>
            <motion.a
              href="/resume.pdf"
              download
              className="glass-button primary w-full text-center block"
              whileTap={{ scale: 0.98 }}
            >
              Download Resume
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
};

export default Header;
