import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import CircularGallery from '../components/CircularGallery';
import LogoLoop from '../components/LogoLoop';
import ProfileCard from '../components/ProfileCard';
import ScrollStack, { ScrollStackItem } from '../components/ScrollStack';
import projectsData from '../data/projects';
import './About.css';

const projects = projectsData;

const capabilities = [
  {
    number: '01',
    title: 'LLM Systems',
    description: 'Applications designed around grounded responses, streaming UX, and practical workflows.'
  },
  {
    number: '02',
    title: 'RAG Pipelines',
    description: 'Retrieval flows that connect domain knowledge to useful, contextual AI responses.'
  },
  {
    number: '03',
    title: 'Agentic Workflows',
    description: 'Task-oriented AI experiences that coordinate tools and move users toward outcomes.'
  }
];

const journey = [
  {
    period: 'Jun 2026 - Present',
    role: 'AI Engineer',
    place: 'Rokkun (Client: SupplyWhy.ai)',
    description: 'Shipping a multi-tenant supply chain intelligence platform with FastAPI, Celery, PostgreSQL, and React, plus LLM pipelines for OEM signals and tariff document intelligence.'
  },
  {
    period: 'Sep 2025 - Apr 2026',
    role: 'AI Software Intern',
    place: 'BGS Infotech',
    description: 'Building RAG systems, AI agents, and GenAI solutions with Python and Azure OpenAI.'
  },
  {
    period: 'Feb - May 2025',
    role: 'AI Intern',
    place: 'Prime Minds Consultancy',
    description: 'Built an NLP-based extraction workflow that reduced manual effort through LLM automation.'
  },
  {
    period: '2021 - 2025',
    role: 'B.E. in Information Science',
    place: 'VTU',
    description: 'Graduated with an 8.38 CGPA, focused on software engineering and applied AI.'
  }
];

const stack = [
  { name: 'Python', iconClass: 'fab fa-python', color: '#3676ab' },
  { name: 'TypeScript', iconClass: 'fab fa-js', color: '#3178c6' },
  { name: 'JavaScript', iconClass: 'fab fa-js', color: '#f7df1e', iconColor: '#10131d' },
  { name: 'SQL', iconClass: 'fas fa-database', color: '#336791' },
  { name: 'Generative AI', iconClass: 'fas fa-wand-magic-sparkles', color: '#8b5cf6' },
  { name: 'LLMs', iconClass: 'fas fa-brain', color: '#7c3aed' },
  { name: 'RAG', iconClass: 'fas fa-book-open', color: '#ec4899' },
  { name: 'Prompt Engineering', iconClass: 'fas fa-terminal', color: '#06b6d4' },
  { name: 'AI Agents', iconClass: 'fas fa-robot', color: '#a855f7' },
  { name: 'Agentic Workflows', iconClass: 'fas fa-diagram-project', color: '#6366f1' },
  { name: 'LangChain', iconClass: 'fas fa-link', color: '#10b981' },
  { name: 'LangGraph', iconClass: 'fas fa-share-nodes', color: '#14b8a6' },
  { name: 'Vector Databases', iconClass: 'fas fa-layer-group', color: '#f97316' },
  { name: 'Model Fine-Tuning', iconClass: 'fas fa-sliders', color: '#f59e0b' },
  { name: 'LoRA', iconClass: 'fas fa-microchip', color: '#fb7185' },
  { name: 'Hugging Face', icon: '🤗', color: '#fbbf24' },
  { name: 'Transformers', iconClass: 'fas fa-arrows-rotate', color: '#f97316' },
  { name: 'Whisper', iconClass: 'fas fa-wave-square', color: '#06b6d4' },
  { name: 'Scikit-learn', iconClass: 'fas fa-chart-line', color: '#f97316' },
  { name: 'Pandas', iconClass: 'fas fa-table-cells', color: '#150458' },
  { name: 'NumPy', iconClass: 'fas fa-calculator', color: '#4d77cf' },
  { name: 'FastAPI', iconClass: 'fas fa-bolt', color: '#009688' },
  { name: 'React.js', iconClass: 'fab fa-react', color: '#087ea4' },
  { name: 'Next.js', iconClass: 'fas fa-n', color: '#20232a' },
  { name: 'Node.js', iconClass: 'fab fa-node-js', color: '#339933' },
  { name: 'Microsoft Azure', iconClass: 'fab fa-microsoft', color: '#0078d4' },
  { name: 'Docker', iconClass: 'fab fa-docker', color: '#2496ed' },
  { name: 'CI/CD Pipelines', iconClass: 'fas fa-code-branch', color: '#ef4444' },
  { name: 'Vercel', iconClass: 'fas fa-caret-up', color: '#20232a' },
  { name: 'PostgreSQL', iconClass: 'fas fa-database', color: '#336791' },
  { name: 'ChromaDB', iconClass: 'fas fa-cubes', color: '#f97316' },
  { name: 'SQLAlchemy', iconClass: 'fas fa-server', color: '#d9485f' }
];

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 }
};

function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={className}
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

function About() {
  const navigate = useNavigate();
  const pageRef = useRef(null);

  return (
    <div className="about-page" ref={pageRef}>
      <div className="about-aurora about-aurora-one" aria-hidden="true"></div>
      <div className="about-aurora about-aurora-two" aria-hidden="true"></div>
      <div className="about-grid-bg" aria-hidden="true"></div>

      <header className="about-header">
        <Link to="/" className="about-brand">
          <span className="brand-dot"></span>
          <span>AKASH S</span>
        </Link>
        <nav className="about-nav" aria-label="About page navigation">
          <a href="#projects">Work</a>
          <a href="#journey">Journey</a>
          <Link to="/contact" className="nav-contact">Contact</Link>
        </nav>
      </header>

      <main className="about-main">
        <section className="about-hero">
          <motion.div
            className="about-hero-copy"
            initial="hidden"
            animate="visible"
            variants={reveal}
            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="about-status">
              <span className="status-pulse"></span>
              AI/ML + Software Engineer
            </div>
            <h1>
              Building AI products that turn
              <span className="about-gradient"> complex problems </span>
              into usable experiences.
            </h1>
            <p className="about-lead">
              I&apos;m Akash S, focused on LLM-powered systems, RAG pipelines,
              agentic AI workflows, and AI products that solve real problems.
            </p>
            <div className="about-actions">
              <Link to="/contact" className="about-primary">
                Let&apos;s connect <i className="fas fa-arrow-right" aria-hidden="true"></i>
              </Link>
              <a
                href="https://github.com/Akash-62"
                target="_blank"
                rel="noopener noreferrer"
                className="about-secondary"
              >
                <i className="fab fa-github" aria-hidden="true"></i> GitHub
              </a>
            </div>
          </motion.div>

          <motion.div
            className="about-profile-column"
            initial={{ opacity: 0, x: 34 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.16, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <ProfileCard
              name="Akash S"
              title="AI/ML & Software Engineer"
              handle="akash-s62"
              status="Available"
              contactText="Contact"
              avatarUrl="/images/akash-profile-card.png"
              miniAvatarUrl="/images/akash-profile-card.png"
              showUserInfo={true}
              enableTilt={true}
              enableMobileTilt={false}
              behindGlowEnabled={true}
              behindGlowColor="rgba(117, 123, 253, 0.28)"
              behindGlowSize="56%"
              innerGradient="linear-gradient(145deg, rgba(96, 73, 110, 0.2) 0%, rgba(113, 196, 255, 0.1) 100%)"
              onContactClick={() => navigate('/contact')}
            />
            <div className="profile-stats">
              <div className="profile-stat">
                <strong>4</strong>
                <span>Featured AI products</span>
              </div>
              <div className="profile-stat">
                <strong>8.38</strong>
                <span>Engineering CGPA</span>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="about-stack" aria-label="Technology stack">
          <LogoLoop
            items={stack}
            direction="left"
            logoHeight={58}
            gap={34}
            pauseOnHover={true}
            fadeOut={true}
            scaleOnHover={true}
            showLabels={true}
          />
        </section>

        <section className="about-section" id="projects">
          <Reveal className="section-intro">
            <div>
              <span className="section-eyebrow">Selected Work</span>
              <h2>AI products built for real interaction</h2>
            </div>
            <p>Live projects spanning agriculture, developer tooling, code quality, and creative AI.</p>
          </Reveal>

          <Reveal className="project-gallery-frame">
            <CircularGallery
              items={projects}
              cardMode={true}
              scrollSpeed={1.7}
            />
          </Reveal>
        </section>

        <section className="about-section capability-section">
          <Reveal className="section-intro">
            <div>
              <span className="section-eyebrow">What I Build</span>
              <h2>From intelligence to interface</h2>
            </div>
          </Reveal>
          <ScrollStack
            className="capability-stack"
            scrollContainerRef={pageRef}
            itemDistance={34}
            itemScale={0.025}
            itemStackDistance={24}
            stackPosition="17%"
            scaleEndPosition="9%"
            baseScale={0.93}
            rotationAmount={0.35}
            blurAmount={0.45}
            revealFromStack={true}
          >
            {capabilities.map((capability) => (
              <ScrollStackItem key={capability.title} itemClassName="capability-card">
                <span>{capability.number}</span>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </section>

        <section className="about-section journey-section-modern" id="journey">
          <Reveal className="section-intro">
            <div>
              <span className="section-eyebrow">Experience</span>
              <h2>Journey so far</h2>
            </div>
          </Reveal>
          <div className="journey-timeline">
            {journey.map((event, index) => (
              <Reveal key={event.role} className="journey-row" delay={index * 0.07}>
                <div className="journey-period">{event.period}</div>
                <div className="journey-marker" aria-hidden="true"><span></span></div>
                <div className="journey-detail">
                  <h3>{event.role}</h3>
                  <span>{event.place}</span>
                  <p>{event.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal className="about-cta">
          <div>
            <span className="section-eyebrow">Start A Conversation</span>
            <h2>Have an AI idea worth building?</h2>
            <p>Let&apos;s turn it into a useful product with a clear user experience.</p>
          </div>
          <div className="about-cta-actions">
            <Link to="/contact" className="about-primary">Contact me</Link>
            <a
              href="/resume%20section/Akash%20S%5B2026%5D.pdf"
              className="about-secondary"
              download
            >
              Resume
            </a>
          </div>
        </Reveal>
      </main>

      <footer className="about-footer-modern">
        <Link to="/" className="back-world">
          <i className="fas fa-arrow-left" aria-hidden="true"></i> Return to main world
        </Link>
        <p>(c) {new Date().getFullYear()} Akash S</p>
      </footer>
    </div>
  );
}

export default About;
