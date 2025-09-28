import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { portfolioData } from '../data/mock';
import EnhancedCard from './EnhancedCard';
import MiniChip3D from './MiniChip3D';

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });

  const skillCategories = [
    {
      title: 'Verification',
      skills: portfolioData.skills.verification,
      icon: '🔬',
      color: 'var(--color-highlight)'
    },
    {
      title: 'Protocols & IP',
      skills: portfolioData.skills.protocols,
      icon: '🔗',
      color: 'var(--color-secondary)'
    },
    {
      title: 'Tools & Environment',
      skills: portfolioData.skills.tools,
      icon: '🛠️',
      color: 'var(--color-accent)'
    },
    {
      title: 'Domains & Research',
      skills: portfolioData.skills.domains,
      icon: '🔍',
      color: 'var(--color-primary)'
    }
  ];

  return (
    <section ref={ref} className="section bg-[var(--color-dark)]" id="skills">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="heading-xl text-on-glass mb-6">Technical Expertise</h2>
          <p className="body-lg text-glass-secondary max-w-3xl mx-auto">
            Comprehensive skill set in digital design verification, protocol validation, 
            and advanced semiconductor testing methodologies
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
          {skillCategories.map((category, categoryIndex) => {
            const has3D = category.title === 'Protocols & IP' || category.title === 'Verification';
            const chipType = category.title === 'Protocols & IP' ? 'protocol' : 'chip';
            
            return (
              <EnhancedCard
                key={category.title}
                className="p-6 space-y-4"
                has3D={has3D}
                render3D={(isHovered) => 
                  <MiniChip3D 
                    isHovered={isHovered} 
                    type={chipType}
                    className="w-full h-full" 
                  />
                }
                tabIndex={0}
                role="button"
                ariaLabel={`${category.title} skills category`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${category.color}20`, border: `2px solid ${category.color}` }}
                  >
                    {category.icon}
                  </div>
                  <h3 className="heading-sm text-on-glass">{category.title}</h3>
                </div>
                
                <div className="space-y-2">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ 
                        duration: 0.5, 
                        delay: categoryIndex * 0.2 + skillIndex * 0.1 
                      }}
                      className="glass-panel-subtle px-3 py-2 text-sm text-glass-secondary font-mono hover:text-on-glass hover:border-[var(--color-highlight)] transition-all duration-200"
                    >
                      {skill}
                    </motion.div>
                  ))}
                </div>
              </EnhancedCard>
            );
          })}
        </div>

        {/* Professional Training Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16"
        >
          <h3 className="heading-lg text-on-glass text-center mb-8">Professional Training & Certifications</h3>
          <div className="glass-panel p-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {portfolioData.training.map((training, index) => (
                <motion.div
                  key={training}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  className="glass-panel-subtle p-3 text-center text-sm text-glass-secondary hover:text-on-glass transition-all duration-200"
                >
                  {training}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;