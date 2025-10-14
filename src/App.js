import React from 'react';
import './styles/globals.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Research from './components/Research';
import Awards from './components/Awards';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AnimatedBackground from './components/AnimatedBackground';

function App() {
  return (
    <div className="App relative">  {/* ← ADDED 'relative' HERE */}
      <AnimatedBackground />
      <Header />
      <main>
        <Hero />
        <Skills />
        <Projects />
        <Research />
        <Awards />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
