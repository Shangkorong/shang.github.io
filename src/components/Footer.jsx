import React from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '../data/mock';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    navigation: portfolioData.navigation,
    connect: [
      {
        name: 'Email',
        href: `mailto:${portfolioData.personal.email}`,
        external: false
      },
      {
        name: 'LinkedIn',
        href: portfolioData.personal.linkedin,
        external: true
      },
      {
        name: 'Resume',
        href: '/resume.pdf',
        external: false
      }
    ],
    resources: [
      {
        name: 'Case Studies',
        href: '#projects',
        external: false
      },
      {
        name: 'Research Papers',
        href: '#research',
        external: false
      },
      {
        name: 'Technical Blog',
        href: '/blog',
        external: false
      }
    ]
  };

  return (
    <footer className="bg-gradient-to-t from-[var(--color-dark)] to-[var(--color-primary)] border-t border-[var(--glass-border)]">
      <div className="container py-16">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer"
              onClick={scrollToTop}
            >
              <h3 className="heading-md text-on-glass font-mono">SK</h3>
            </motion.div>
            <p className="text-glass-secondary text-sm leading-relaxed">
              {portfolioData.personal.title}
            </p>
            <p className="text-glass-secondary text-sm leading-relaxed">
              {portfolioData.personal.tagline}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h4 className="heading-sm text-on-glass">Navigation</h4>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => {
                      const element = document.querySelector(link.href);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-glass-secondary hover:text-on-glass transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Links */}
          <div className="space-y-4">
            <h4 className="heading-sm text-on-glass">Connect</h4>
            <ul className="space-y-2">
              {footerLinks.connect.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : '_self'}
                    rel={link.external ? 'noopener noreferrer' : ''}
                    className="text-glass-secondary hover:text-on-glass transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="heading-sm text-on-glass">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-glass-secondary hover:text-on-glass transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tech Stack Tag Cloud */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass-panel p-6 mb-8"
        >
          <h4 className="heading-sm text-on-glass text-center mb-4">Technology Expertise</h4>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              ...portfolioData.skills.verification.slice(0, 4),
              ...portfolioData.skills.protocols.slice(0, 3),
              ...portfolioData.skills.tools.slice(0, 4)
            ].map((tech) => (
              <span
                key={tech}
                className="glass-panel-subtle px-3 py-1 text-xs text-glass-secondary font-mono hover:text-on-glass transition-colors duration-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Bottom Footer */}
        <div className="border-t border-[var(--glass-border)] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-glass-secondary text-sm">
              © {currentYear} {portfolioData.personal.name}. All rights reserved.
            </p>

            {/* Contact Info */}
            <div className="flex items-center gap-4 text-sm text-glass-secondary">
              <a
                href={`mailto:${portfolioData.personal.email}`}
                className="hover:text-on-glass transition-colors duration-200"
              >
                {portfolioData.personal.email}
              </a>
              <span>•</span>
              <a
                href={`tel:${portfolioData.personal.phone}`}
                className="hover:text-on-glass transition-colors duration-200"
              >
                {portfolioData.personal.phone}
              </a>
            </div>

            {/* Back to Top */}
            <motion.button
              onClick={scrollToTop}
              className="glass-button text-xs px-3 py-2 min-h-8"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Back to top"
            >
              ↑ Top
            </motion.button>
          </div>
        </div>
      </div>

      {/* Performance Note */}
      <div className="border-t border-[var(--glass-border)] py-4">
        <div className="container text-center">
          <p className="text-xs text-glass-secondary">
            Built with React, Framer Motion, and Three.js • Optimized for performance and accessibility
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;