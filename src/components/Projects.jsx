import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { portfolioData } from '../data/mock';
import EnhancedCard from './EnhancedCard';
import EnhancedModal from './EnhancedModal';
import MiniChip3D from './MiniChip3D';

const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });
  const [selectedProject, setSelectedProject] = useState(null);

  const ProjectCard = ({ project, index }) => {
    const has3D = index === 0 || project.category === 'Bus Protocol Verification';
    
    return (
      <EnhancedCard
        className="p-6"
        has3D={has3D}
        render3D={(isHovered) => 
          <MiniChip3D 
            isHovered={isHovered} 
            type="protocol"
            className="w-full h-full" 
          />
        }
        onClick={() => setSelectedProject(project)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setSelectedProject(project);
          }
        }}
        tabIndex={0}
        role="button"
        ariaLabel={`View details for ${project.title}`}
      >
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="heading-sm text-on-glass mb-2">{project.title}</h3>
              <span className="glass-panel-subtle px-3 py-1 text-xs text-glass-secondary font-mono">
                {project.category}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[var(--color-highlight)] text-sm font-mono">
                {project.status}
              </span>
            </div>
          </div>

          <p className="body-md text-glass-secondary leading-relaxed">
            {project.impact}
          </p>

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

          <motion.div 
            className="pt-4 border-t border-[var(--glass-border)]"
            whileHover={{ x: 5 }}
          >
            <span className="text-[var(--color-highlight)] text-sm font-mono flex items-center gap-2">
              View Case Study 
              <span className="text-lg">→</span>
            </span>
          </motion.div>
        </div>
      </EnhancedCard>
    );
  };

  const ProjectModal = ({ project, onClose }) => (
    <EnhancedModal
      isOpen={!!project}
      onClose={onClose}
      className="p-8"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="heading-lg text-on-glass mb-2">{project.title}</h2>
          <span className="glass-panel-subtle px-3 py-1 text-sm text-glass-secondary font-mono">
            {project.category}
          </span>
        </div>
        <button
          onClick={onClose}
          className="glass-button text-sm px-4 py-2 min-h-10"
          aria-label="Close case study"
        >
          ✕
        </button>
      </div>

      <div className="space-y-6">
        <p className="body-lg text-glass-secondary leading-relaxed">
          {project.description}
        </p>

        <div>
          <h3 className="heading-sm text-on-glass mb-4">Key Features & Implementation</h3>
          <ul className="space-y-2">
            {project.keyFeatures.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-[var(--color-highlight)] mt-2">•</span>
                <span className="body-md text-glass-secondary">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="heading-sm text-on-glass mb-4">Technologies & Tools</h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="glass-panel-subtle px-3 py-2 text-sm text-on-glass font-mono"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="heading-sm text-on-glass mb-4">Architecture Overview</h3>
          <div className="glass-panel-subtle p-6">
            <div className="text-center text-glass-secondary">
              <div className="w-full h-48 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-lg flex items-center justify-center mb-4">
                <span className="text-on-glass font-mono">Architecture Diagram</span>
              </div>
              <p className="text-sm">Detailed architecture diagrams and waveforms available in full case study PDF</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-8 pt-6 border-t border-[var(--glass-border)]">
        <motion.button
          className="glass-button primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Download PDF Case Study
        </motion.button>
        <motion.button
          className="glass-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
        >
          Close
        </motion.button>
      </div>
    </EnhancedModal>
  );

  return (
    <section ref={ref} className="section bg-gradient-to-br from-[var(--color-dark)] to-[var(--color-primary)]" id="projects">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="heading-xl text-on-glass mb-6">Projects & Case Studies</h2>
          <p className="body-lg text-glass-secondary max-w-3xl mx-auto">
            Comprehensive verification environments showcasing robust, reusable solutions 
            for high-performance silicon validation across multiple protocols and domains
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {portfolioData.projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <div className="glass-panel p-8">
            <h3 className="heading-md text-on-glass mb-4">
              Ready to explore detailed case studies?
            </h3>
            <p className="body-md text-glass-secondary mb-6">
              Each project includes comprehensive documentation with architecture diagrams, 
              waveforms, coverage reports, and reusable code examples.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.a
                href="/case-studies"
                className="glass-button primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All Case Studies
              </motion.a>
              <motion.a
                href={`mailto:${portfolioData.personal.email}`}
                className="glass-button highlight"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Discuss Your Project
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </section>
  );
};

export default Projects;