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

function App() {
  return (
    <div className="App">
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