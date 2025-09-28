import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { portfolioData } from '../data/mock';
import EnhancedCard from './EnhancedCard';

const Research = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });

  const ResearchCard = ({ project, index }) => (
    <EnhancedCard
      className="p-6"
      tabIndex={0}
      role="article"
      ariaLabel={`Research project: ${project.title}`}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <span className={`glass-panel-subtle px-3 py-1 text-xs font-mono ${
            project.status === 'Published' 
              ? 'text-[var(--color-highlight)]' 
              : 'text-glass-secondary'
          }`}>
            {project.status}
          </span>
          {project.collaborators && (
            <span className="text-xs text-glass-secondary">
              Collaborative Work
            </span>
          )}
        </div>

        <div>
          <h3 className="heading-sm text-on-glass mb-3">{project.title}</h3>
          <p className="body-md text-glass-secondary leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="glass-panel-subtle px-2 py-1 text-xs text-on-glass font-mono"
            >
              {tech}
            </span>
          ))}
        </div>

        {project.collaborators && (
          <div className="pt-3 border-t border-[var(--glass-border)]">
            <span className="text-sm text-glass-secondary">
              Collaborators: {project.collaborators.join(', ')}
            </span>
          </div>
        )}
      </div>
    </EnhancedCard>
  );

  return (
    <section ref={ref} className="section bg-[var(--color-dark)]" id="research">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="heading-xl text-on-glass mb-6">Research & Innovation</h2>
          <p className="body-lg text-glass-secondary max-w-3xl mx-auto">
            Exploring the intersection of machine learning, signal processing, and hardware design 
            through multidisciplinary research projects and collaborative innovation
          </p>
        </motion.div>

        {/* Research Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {portfolioData.research.map((project, index) => (
            <ResearchCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Research Interests */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="glass-panel p-8"
        >
          <h3 className="heading-lg text-on-glass text-center mb-8">Current Research Interests</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "NoC Design",
                description: "Network-on-Chip architectures for multi-core systems",
                icon: "🔗"
              },
              {
                title: "Fault Tolerance", 
                description: "Error detection and recovery in safety-critical systems",
                icon: "🛡️"
              },
              {
                title: "Energy Efficiency",
                description: "Low-power VLSI design and optimization techniques",
                icon: "⚡"
              },
              {
                title: "Neuromorphic Computing",
                description: "Brain-inspired computing architectures and verification",
                icon: "🧠"
              }
            ].map((interest, index) => (
              <motion.div
                key={interest.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="glass-panel-subtle p-4 text-center space-y-2"
              >
                <div className="text-3xl mb-2">{interest.icon}</div>
                <h4 className="heading-sm text-on-glass">{interest.title}</h4>
                <p className="text-sm text-glass-secondary">{interest.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Publications CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="glass-panel p-6">
            <h3 className="heading-md text-on-glass mb-3">
              Interested in collaboration?
            </h3>
            <p className="body-md text-glass-secondary mb-4">
              Open to research partnerships in hardware verification, ML acceleration, and emerging computing paradigms
            </p>
            <motion.a
              href={`mailto:${portfolioData.personal.email}?subject=Research Collaboration`}
              className="glass-button highlight"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start a Conversation
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Research;