import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { portfolioData } from '../data/mock';

const Awards = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });

  const AwardCard = ({ award, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="glass-panel p-6 hover:transform hover:scale-105 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-highlight)] to-[var(--color-accent)] rounded-lg flex items-center justify-center text-2xl">
          🏆
        </div>
        <div className="flex-1">
          <h3 className="heading-sm text-on-glass mb-2">{award.title}</h3>
          <p className="text-glass-secondary text-sm mb-1">{award.organization}</p>
          <span className="glass-panel-subtle px-2 py-1 text-xs text-[var(--color-highlight)] font-mono">
            {award.year}
          </span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section ref={ref} className="section bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-dark)]" id="awards">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="heading-xl text-on-glass mb-6">Recognition & Achievements</h2>
          <p className="body-lg text-glass-secondary max-w-3xl mx-auto">
            Academic excellence, competitive achievements, and professional recognition 
            in mathematics, engineering, and technical communication
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {portfolioData.awards.map((award, index) => (
            <AwardCard key={`${award.title}-${award.year}`} award={award} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="glass-panel p-8"
        >
          <h3 className="heading-lg text-on-glass text-center mb-8">Professional Development</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {portfolioData.training.map((training, index) => (
              <motion.div
                key={training}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.05 }}
                className="glass-panel-subtle p-4 text-center space-y-2 hover:border-[var(--color-highlight)] transition-all duration-200"
              >
                <div className="text-2xl mb-2">📜</div>
                <h4 className="text-sm text-on-glass font-mono leading-tight">
                  {training}
                </h4>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16"
        >
          <div className="glass-panel p-8">
            <h3 className="heading-lg text-on-glass text-center mb-6">Companies I Admire</h3>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="glass-panel-subtle p-4 mb-8 text-center"
            >
              <p className="text-sm text-glass-secondary">
                <strong className="text-[var(--color-highlight)]">Disclaimer:</strong> 
                The following companies are listed purely as professional admiration and aspiration. 
                No current or past employment relationship is implied.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {portfolioData.companies.map((company, index) => (
                <motion.div
                  key={company.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                  className="glass-panel-subtle p-4 text-center space-y-3 hover:transform hover:scale-105 transition-all duration-300"
                >
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-accent)] rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-on-glass">
                      {company.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-glass">{company.name}</h4>
                    <p className="text-xs text-glass-secondary mt-1">
                      {company.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Awards;