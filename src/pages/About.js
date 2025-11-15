import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
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
    
    // Image carousel auto-slide
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % avatarImages.length);
    }, 3000); // Change image every 3 seconds
    
    return () => clearInterval(imageInterval);
  }, [avatarImages.length]);

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
          <div className="avatar-glow">
            <div className="avatar-image-slider">
              {avatarImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Project ${index + 1}`}
                  className={`avatar-slide ${index === currentImageIndex ? 'active' : ''}`}
                />
              ))}
            </div>
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

      {/* Skills Galaxy */}
      <section className="skills-galaxy">
        <motion.div
          className="section-header-space"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="section-title-space">Skills Galaxy</h2>
          <p className="section-subtitle-space">Technologies I master across the cosmos</p>
        </motion.div>

        <div className="skills-orbit">
          {[
            { name: 'Python', icon: '🐍', level: 95, color: '#3b82f6' },
            { name: 'React.js', icon: '⚛️', level: 90, color: '#06b6d4' },
            { name: 'TensorFlow', icon: '🧠', level: 88, color: '#f59e0b' },
            { name: 'Azure', icon: '☁️', level: 85, color: '#0078d4' },
            { name: 'NLP & RAG', icon: '💬', level: 92, color: '#ec4899' },
            { name: 'TypeScript', icon: '📘', level: 87, color: '#3178c6' },
            { name: 'Docker', icon: '🐳', level: 83, color: '#2496ed' },
            { name: 'Node.js', icon: '🟢', level: 86, color: '#10b981' }
          ].map((skill, index) => (
            <motion.div
              key={index}
              className="skill-planet"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.2, rotate: 360 }}
            >
              <div className="skill-orbit-ring" style={{ borderColor: skill.color }}></div>
              <div className="skill-core" style={{ backgroundColor: skill.color }}>
                <span className="skill-icon-emoji">{skill.icon}</span>
              </div>
              <div className="skill-info">
                <div className="skill-name-text">{skill.name}</div>
                <div className="skill-percentage">{skill.level}%</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="space-timeline">
        <motion.div
          className="section-header-space"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="section-title-space">Journey Through Time</h2>
          <p className="section-subtitle-space">My evolution in the tech universe</p>
        </motion.div>

        <div className="timeline-warp">
          {[
            {
              year: 'Sep 2025 - Present',
              title: 'GenAI Developer',
              company: 'BGS Infotech',
              desc: 'Building GenAI-powered solutions including automated agents, RAG systems, and workflow automation tools using Python, Azure OpenAI, and vector databases.',
              icon: '🤖'
            },
            {
              year: 'Feb 2025 - May 2025',
              title: 'AI Intern',
              company: 'Prime Minds Consultancy',
              desc: 'Built intelligent product data extraction system using NLP models. Integrated LLM-based automation reducing manual workload by 60%.',
              icon: '🧠'
            },
            {
              year: 'May 2024 - Nov 2024',
              title: 'Project Intern',
              company: 'Kennametal Inc.',
              desc: 'Developed computer vision solution for manufacturing quality control. Implemented automated defect detection system for quality assurance.',
              icon: '👁️'
            },
            {
              year: '2021 - 2025',
              title: 'Bachelor of Engineering',
              company: 'Visvesvaraya Technological University',
              desc: 'Information Science & Technology • CGPA: 8.38/10 • Focused on AI/ML, Full-Stack Development, and Cloud Technologies.',
              icon: '🎓'
            }
          ].map((event, index) => (
            <motion.div
              key={index}
              className="timeline-node"
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="timeline-connector"></div>
              <div className="timeline-icon-wrapper">
                <span className="timeline-icon">{event.icon}</span>
              </div>
              <div className="timeline-card">
                <div className="timeline-year">{event.year}</div>
                <h3 className="timeline-event-title">{event.title}</h3>
                <div className="timeline-company-name">{event.company}</div>
                <p className="timeline-description">{event.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="space-cta">
        <motion.div
          className="cta-nebula"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="cta-title-space">Let's Build Something Incredible</h2>
          <p className="cta-desc-space">Ready to collaborate on the next AI innovation?</p>
          <div className="cta-actions">
            <a href="/contact" className="cta-button-primary">
              <span>Get In Touch</span>
              <i className="fas fa-rocket"></i>
            </a>
            <a href="https://github.com/Akash-62" target="_blank" rel="noopener noreferrer" className="cta-button-secondary">
              <i className="fab fa-github"></i>
              <span>GitHub</span>
            </a>
            <a href="https://linkedin.com/in/akash-s62" target="_blank" rel="noopener noreferrer" className="cta-button-secondary">
              <i className="fab fa-linkedin"></i>
              <span>LinkedIn</span>
            </a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="space-footer">
        <a href="/" className="back-to-world">
          <i className="fas fa-arrow-left"></i>
          <span>Return to Main World</span>
        </a>
        <p className="footer-credits">© 2025 Akash S • Crafted in the digital cosmos</p>
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
