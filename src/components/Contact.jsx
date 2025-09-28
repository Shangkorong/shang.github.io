import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { portfolioData } from '../data/mock';

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Create mailto link with form data
    const emailBody = `Name: ${formData.name}%0D%0ACompany: ${formData.company}%0D%0A%0D%0AMessage:%0D%0A${formData.message}`;
    const mailtoLink = `mailto:${portfolioData.personal.email}?subject=${formData.subject}&body=${emailBody}`;
    window.location.href = mailtoLink;
  };

  const contactMethods = [
    {
      icon: '📧',
      label: 'Email',
      value: portfolioData.personal.email,
      href: `mailto:${portfolioData.personal.email}`,
      description: 'Best for detailed project discussions'
    },
    {
      icon: '📱',
      label: 'Phone',
      value: portfolioData.personal.phone,
      href: `tel:${portfolioData.personal.phone}`,
      description: 'Available for calls during IST business hours'
    },
    {
      icon: '💼',
      label: 'LinkedIn',
      value: 'Professional Profile',
      href: portfolioData.personal.linkedin,
      description: 'Connect for professional networking'
    }
  ];

  return (
    <section ref={ref} className="section bg-[var(--color-dark)]" id="contact">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="heading-xl text-on-glass mb-6">Let's Connect</h2>
          <p className="body-lg text-glass-secondary max-w-3xl mx-auto">
            Ready to discuss verification challenges, explore collaboration opportunities, 
            or learn more about building robust semiconductor testing solutions?
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="glass-panel p-8 space-y-6">
              <h3 className="heading-md text-on-glass mb-6">Get in Touch</h3>
              
              {contactMethods.map((method, index) => (
                <motion.a
                  key={method.label}
                  href={method.href}
                  target={method.label === 'LinkedIn' ? '_blank' : '_self'}
                  rel={method.label === 'LinkedIn' ? 'noopener noreferrer' : ''}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="glass-panel-subtle p-4 block hover:transform hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{method.icon}</div>
                    <div className="flex-1">
                      <h4 className="heading-sm text-on-glass mb-1">{method.label}</h4>
                      <p className="text-[var(--color-highlight)] font-mono text-sm mb-2">
                        {method.value}
                      </p>
                      <p className="text-glass-secondary text-sm">
                        {method.description}
                      </p>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Availability */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="glass-panel p-6"
            >
              <h4 className="heading-sm text-on-glass mb-4">Current Availability</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-[var(--color-highlight)] rounded-full"></span>
                  <span className="text-glass-secondary">Open to new opportunities</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-[var(--color-highlight)] rounded-full"></span>
                  <span className="text-glass-secondary">Available for consulting projects</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-[var(--color-highlight)] rounded-full"></span>
                  <span className="text-glass-secondary">Interested in research collaborations</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="glass-panel p-8">
              <h3 className="heading-md text-on-glass mb-6">Send a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm text-glass-secondary mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full glass-panel-subtle p-3 text-on-glass placeholder-glass-secondary/60 border border-[var(--glass-border)] rounded-lg focus:border-[var(--color-highlight)] focus:outline-none transition-colors duration-200"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm text-glass-secondary mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full glass-panel-subtle p-3 text-on-glass placeholder-glass-secondary/60 border border-[var(--glass-border)] rounded-lg focus:border-[var(--color-highlight)] focus:outline-none transition-colors duration-200"
                      placeholder="your.email@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm text-glass-secondary mb-2">
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full glass-panel-subtle p-3 text-on-glass placeholder-glass-secondary/60 border border-[var(--glass-border)] rounded-lg focus:border-[var(--color-highlight)] focus:outline-none transition-colors duration-200"
                    placeholder="Your company or organization"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm text-glass-secondary mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full glass-panel-subtle p-3 text-on-glass placeholder-glass-secondary/60 border border-[var(--glass-border)] rounded-lg focus:border-[var(--color-highlight)] focus:outline-none transition-colors duration-200"
                    placeholder="Brief subject line"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm text-glass-secondary mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full glass-panel-subtle p-3 text-on-glass placeholder-glass-secondary/60 border border-[var(--glass-border)] rounded-lg focus:border-[var(--color-highlight)] focus:outline-none transition-colors duration-200 resize-vertical"
                    placeholder="Tell me about your project, opportunity, or question..."
                  />
                </div>

                <motion.button
                  type="submit"
                  className="glass-button highlight w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send Message
                </motion.button>
              </form>

              <p className="text-xs text-glass-secondary mt-4 text-center">
                Form submissions will open your email client. Alternatively, you can reach out directly via email or LinkedIn.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Quick CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="glass-panel p-8">
            <h3 className="heading-md text-on-glass mb-6">Ready to start a project?</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.a
                href={`mailto:${portfolioData.personal.email}?subject=Project Discussion`}
                className="glass-button primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Discuss Project
              </motion.a>
              <motion.a
                href="/resume.pdf"
                download
                className="glass-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Download Resume
              </motion.a>
              <motion.a
                href={portfolioData.personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Connect on LinkedIn
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;