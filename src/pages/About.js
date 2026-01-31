import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import LogoLoop from '../components/LogoLoop';
import './About.css';

function About({ darkMode }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Profile photos - Add your photos as profile1.jpg, profile2.jpg, profile3.jpg in public/images/
  const avatarImages = [
    '/images/profile1.jpg',
    '/images/profile2.jpg',
    '/images/profile3.jpg'
  ];

  useEffect(() => {
    gsap.fromTo(
      '.hero-text',
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.25 }
    );
    
    // Create stars
    const createStars = () => {
      const starsContainer = document.querySelector('.stars-container');
      if (!starsContainer) return;
      
      // Clear existing stars first
      starsContainer.innerHTML = '';
      
      for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        star.style.animationDuration = `${2 + Math.random() * 3}s`;
        starsContainer.appendChild(star);
      }
    };
    
    createStars();
  }, []);

  // Separate useEffect for image carousel to prevent dependency issues
  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 3000);
    
    return () => clearInterval(imageInterval);
  }, []);

  const projects = [
    {
      id: 1,
      title: 'Druva – AI Intelligent Dev Companion',
      description: 'AI-powered developer assistant with code analysis and voice-based queries for hands-free workflows',
      tech: ['React', 'TypeScript', 'Vite', 'Tailwind', 'Speech-to-Text'],
      image: '/assets/druva.jpg',
      link: 'https://druva-ai-developer-assistant.vercel.app/',
      color: '#3b82f6'
    },
    {
      id: 2,
      title: 'SOCA – AI Smart Optimized Code Auditor',
      description: 'AI code reviewer with automated feedback, debugging tips, and gamified challenge mode',
      tech: ['React', 'TypeScript', 'Tailwind', 'AI Review'],
      image: '/assets/soca.jpg',
      link: 'https://soca-ai-driven-code-review-assistan.vercel.app/',
      color: '#8b5cf6'
    },
    {
      id: 3,
      title: 'MediBot – AI Health Assistant',
      description: 'AI health assistant for symptom triage, preventive care with multilingual voice input and OCR',
      tech: ['React', 'TypeScript', 'RAG', 'OCR', 'Voice Input'],
      image: '/assets/medibot.jpg',
      link: 'https://medi-bot-rust.vercel.app/',
      color: '#ec4899'
    },
    {
      id: 4,
      title: 'Crezia – AI Text-to-Image Generator',
      description: 'Real-time text-to-image generator with custom styles, ratios, and fast rendering',
      tech: ['React', 'TypeScript', 'Vite', 'Gemini', 'Hugging Face'],
      image: '/assets/crezia.jpg',
      link: 'https://crezia-ai-text-image-generator.vercel.app/',
      color: '#10b981'
    },
    {
      id: 5,
      title: 'Truva – AI Customer Support Copilot',
      description: 'AI support assistant with memory, insights, and adaptive conversation flows in a responsive PWA',
      tech: ['React', 'TypeScript', 'Tailwind', 'PWA'],
      image: '/assets/truva.jpg',
      link: 'https://truva-ai-assistant-customer-support.vercel.app/',
      color: '#f59e0b'
    }
  ];

  return (
    <div className={`space-about-wrapper ${darkMode ? 'dark' : ''}`}>
      {/* Animated Space Background */}
      <div className="stars-container"></div>
      <div className="nebula-bg"></div>
      
      {/* Hero Section */}
      <section className="space-hero">
        <motion.div
          className="hero-avatar-container"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring" }}
        >
          <div className="avatar-orbit"></div>
          <div className="avatar-orbit avatar-orbit-2"></div>
          <div className="avatar-glow">
            <div className="avatar-image-slider">
              {avatarImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Profile ${index + 1}`}
                  className={`avatar-slide ${index === currentImageIndex ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
          <div className="avatar-dots">
            {avatarImages.map((_, index) => (
              <button
                key={index}
                className={`avatar-dot ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
                aria-label={`View photo ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
        
        <motion.h1
          className="hero-text space-title"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Akash S
        </motion.h1>

        <motion.div
          className="role-tags"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <span className="role-tag">GenAI Developer</span>
          <span className="role-tag">Software Engineer</span>
          <span className="role-tag">Full-Stack AI</span>
        </motion.div>

        <motion.p
          className="hero-text hero-bio"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          Software Engineer & GenAI Developer with hands-on experience building LLM applications, NLP systems, and full-stack AI products.
          <br />
          Currently developing scalable GenAI solutions including RAG pipelines, AI agents, and workflow automation tools.
        </motion.p>

        <motion.div
          className="hero-stats"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          <div className="stat-item">
            <div className="stat-value">3+</div>
            <div className="stat-label">Internships</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-value">5</div>
            <div className="stat-label">AI Projects</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-value">8.38</div>
            <div className="stat-label">CGPA</div>
          </div>
        </motion.div>
      </section>

      {/* Featured Projects */}
      <section className="projects-constellation">
        <motion.div
          className="section-header-space"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="section-title-space">Featured Projects</h2>
          <p className="section-subtitle-space">Explore my universe of creations</p>
        </motion.div>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="project-planet"
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              onClick={() => setSelectedProject(project)}
            >
              <div className="planet-glow" style={{ backgroundColor: project.color }}></div>
              <div className="project-content">
                <div className="project-number">0{project.id}</div>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.description}</p>
                <div className="project-tech">
                  {project.tech.map((tech, i) => (
                    <span key={i} className="tech-badge">{tech}</span>
                  ))}
                </div>
                <button className="view-project-btn">
                  <span>View Project</span>
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Skills Galaxy - LogoLoop */}
      <section className="skills-galaxy">
        <motion.div
          className="section-header-space"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="section-title-space">Tech Stack</h2>
          <p className="section-subtitle-space">Technologies I work with daily</p>
        </motion.div>

        <LogoLoop
          items={[
            { icon: '🐍', name: 'Python', color: '#3b82f6' },
            { icon: '⚛️', name: 'React', color: '#06b6d4' },
            { icon: '🧠', name: 'TensorFlow', color: '#f59e0b' },
            { icon: '☁️', name: 'Azure', color: '#0078d4' },
            { icon: '💬', name: 'NLP/RAG', color: '#ec4899' },
            { icon: '📘', name: 'TypeScript', color: '#3178c6' },
            { icon: '🐳', name: 'Docker', color: '#2496ed' },
            { icon: '🟢', name: 'Node.js', color: '#10b981' },
            { icon: '🔥', name: 'PyTorch', color: '#ee4c2c' },
            { icon: '📊', name: 'Pandas', color: '#150458' },
            { icon: '🌐', name: 'FastAPI', color: '#009688' },
            { icon: '⚡', name: 'LangChain', color: '#22c55e' },
            { icon: '🗄️', name: 'PostgreSQL', color: '#336791' },
            { icon: '🔑', name: 'OpenAI', color: '#412991' },
            { icon: '🚀', name: 'Vercel', color: '#000' },
            { icon: '💻', name: 'VS Code', color: '#007acc' }
          ]}
          speed={25}
          direction="left"
          logoHeight={70}
          gap={50}
          pauseOnHover={true}
          fadeOut={true}
          scaleOnHover={true}
        />
      </section>

      {/* Journey Section */}
      <section className="journey-section">
        <motion.div
          className="section-header-space"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="section-title-space">My Journey</h2>
          <p className="section-subtitle-space">From learning to building the future</p>
        </motion.div>

        <div className="journey-cards">
          {[
            {
              year: '2025 - Present',
              title: 'GenAI Developer',
              company: 'BGS Infotech',
              desc: 'Building GenAI solutions, RAG systems, and AI agents using Python, Azure OpenAI, and vector databases.',
              icon: '🤖',
              color: '#8b5cf6'
            },
            {
              year: 'Feb - May 2025',
              title: 'AI Intern',
              company: 'Prime Minds Consultancy',
              desc: 'Built NLP-based product extraction system. Reduced manual workload by 60% with LLM automation.',
              icon: '🧠',
              color: '#ec4899'
            },
            {
              year: 'May - Nov 2024',
              title: 'Project Intern',
              company: 'Kennametal Inc.',
              desc: 'Developed computer vision solution for manufacturing quality control and defect detection.',
              icon: '👁️',
              color: '#06b6d4'
            },
            {
              year: '2021 - 2025',
              title: 'B.E. in ISE',
              company: 'VTU',
              desc: 'Information Science & Engineering • CGPA: 8.38/10 • AI/ML, Full-Stack, Cloud',
              icon: '🎓',
              color: '#f59e0b'
            }
          ].map((event, index) => (
            <motion.div
              key={index}
              className="journey-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{ '--card-color': event.color }}
            >
              <div className="journey-card-icon" style={{ background: event.color }}>
                <span>{event.icon}</span>
              </div>
              <div className="journey-card-content">
                <span className="journey-year">{event.year}</span>
                <h3 className="journey-title">{event.title}</h3>
                <span className="journey-company">{event.company}</span>
                <p className="journey-desc">{event.desc}</p>
              </div>
              <div className="journey-card-line" style={{ background: event.color }}></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="cta-section-new">
        <motion.div
          className="cta-card-new"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Animated background orbs */}
          <div className="cta-orb cta-orb-1"></div>
          <div className="cta-orb cta-orb-2"></div>
          
          <motion.h2 
            className="cta-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Ready to <span className="gradient-text">collaborate</span>?
          </motion.h2>
          
          <motion.p 
            className="cta-subtext"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Let's build the next generation of AI-powered solutions together
          </motion.p>
          
          <motion.div 
            className="cta-buttons"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a href="/contact" className="cta-btn-primary">
              <span>Let's Talk</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a href="https://github.com/Akash-62" target="_blank" rel="noopener noreferrer" className="cta-btn-icon">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://linkedin.com/in/akash-s62" target="_blank" rel="noopener noreferrer" className="cta-btn-icon">
              <i className="fab fa-linkedin"></i>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <a href="/" className="footer-back-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span>Return to Main World</span>
        </a>
        <p className="footer-copyright">© {new Date().getFullYear()} Akash S • Crafted with ❤️</p>
      </footer>

      {/* Project Modal */}
      {selectedProject && (
        <motion.div
          className="project-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            className="project-modal"
            initial={{ scale: 0.8, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setSelectedProject(null)}>
              <i className="fas fa-times"></i>
            </button>
            <h2>{selectedProject.title}</h2>
            <p>{selectedProject.description}</p>
            <div className="modal-tech">
              {selectedProject.tech.map((tech, i) => (
                <span key={i}>{tech}</span>
              ))}
            </div>
            <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="modal-link">
              View on GitHub <i className="fas fa-external-link-alt"></i>
            </a>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default About;
