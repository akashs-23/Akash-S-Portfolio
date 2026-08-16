import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Contact.css';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.2, 0.8, 0.2, 1] }
  })
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.2, 0.8, 0.2, 1] }
  })
};

function Contact({ darkMode }) {
  const whatsappNumber = '919880528258';
  const email = 'akashsofficial62@gmail.com';
  const phone = '+919880528258';

  const openWhatsApp = () => {
    const message = "Hey Akash! 👋 I'd like to connect with you.";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const socials = [
    { label: 'GitHub', icon: 'fab fa-github', href: 'https://github.com/Akash-62', cls: 'github' },
    { label: 'LinkedIn', icon: 'fab fa-linkedin-in', href: 'https://linkedin.com/in/akash-s62', cls: 'linkedin' },
    { label: 'Twitter', icon: 'fab fa-twitter', href: 'https://x.com/Akash_Dachu_', cls: 'twitter' },
    { label: 'Instagram', icon: 'fab fa-instagram', href: 'https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=8ccsjqt', cls: 'instagram' },
  ];

  return (
    <div className={`ct-wrap ${darkMode ? 'dark' : ''}`}>
      {/* Background orbs */}
      <div className="ct-orb ct-orb-1" aria-hidden="true" />
      <div className="ct-orb ct-orb-2" aria-hidden="true" />
      <div className="ct-orb ct-orb-3" aria-hidden="true" />
      <div className="ct-grid-overlay" aria-hidden="true" />

      <div className="ct-container">

        {/* Hero */}
        <motion.header
          className="ct-hero"
          initial="hidden"
          animate="visible"
        >
          <motion.div className="ct-status-badge" variants={fadeUp} custom={0}>
            <span className="ct-pulse" />
            Available for opportunities
          </motion.div>

          <motion.h1 className="ct-title" variants={fadeUp} custom={1}>
            Let&apos;s Build<br />
            <span className="ct-title-gradient">Something Great</span>
          </motion.h1>

          <motion.p className="ct-subtitle" variants={fadeUp} custom={2}>
            Got an idea? Let&apos;s talk.
          </motion.p>

          <motion.div className="ct-location" variants={fadeUp} custom={3}>
            <i className="fas fa-location-dot" aria-hidden="true" />
            Bangalore, India
          </motion.div>
        </motion.header>

        {/* Primary action cards */}
        <motion.div
          className="ct-actions"
          initial="hidden"
          animate="visible"
        >
          {[
            {
              cls: 'wa',
              iconBg: 'linear-gradient(135deg,#25d366,#128c7e)',
              icon: 'fab fa-whatsapp',
              label: 'Chat on WhatsApp',
              sub: 'Quick & Easy, Let\'s Talk!',
              accent: '#25d366',
              onClick: openWhatsApp,
              as: 'button'
            },
            {
              cls: 'em',
              iconBg: 'linear-gradient(135deg,#f97316,#ea580c)',
              icon: 'fas fa-envelope',
              label: 'Send an Email',
              sub: email,
              accent: '#f97316',
              href: `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=Hello%20Akash!`,
              as: 'a'
            },
            {
              cls: 'ph',
              iconBg: 'linear-gradient(135deg,#3b82f6,#2563eb)',
              icon: 'fas fa-phone-alt',
              label: 'Give me a Call',
              sub: '+91-9880528258',
              accent: '#3b82f6',
              href: `tel:${phone}`,
              as: 'a'
            }
          ].map((item, i) => {
            const inner = (
              <>
                <span className="ct-card-shimmer" aria-hidden="true" />
                <span className="ct-card-icon" style={{ background: item.iconBg }}>
                  <i className={item.icon} aria-hidden="true" />
                </span>
                <span className="ct-card-body">
                  <span className="ct-card-label">{item.label}</span>
                  <span className="ct-card-sub">{item.sub}</span>
                </span>
                <span className="ct-card-arrow">
                  <i className="fas fa-arrow-right" aria-hidden="true" />
                </span>
                <span className="ct-card-glow" style={{ '--accent': item.accent }} aria-hidden="true" />
              </>
            );

            return (
              <motion.div
                key={item.cls}
                className={`ct-card ct-card-${item.cls}`}
                variants={scaleIn}
                custom={i}
                style={{ '--accent': item.accent }}
              >
                {item.as === 'button' ? (
                  <button className="ct-card-inner" onClick={item.onClick}>
                    {inner}
                  </button>
                ) : (
                  <a className="ct-card-inner" href={item.href} target="_blank" rel="noopener noreferrer">
                    {inner}
                  </a>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Social + Resume row */}
        <motion.div
          className="ct-bottom-row"
          initial="hidden"
          animate="visible"
        >
          <motion.div className="ct-social-card" variants={fadeUp} custom={0}>
            <p className="ct-section-eyebrow">
              <i className="fas fa-globe" aria-hidden="true" /> Find me online
            </p>
            <div className="ct-socials">
              {socials.map((s, i) => (
                <motion.a
                  key={s.cls}
                  className={`ct-social-btn ct-social-${s.cls}`}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  variants={scaleIn}
                  custom={i * 0.5}
                  whileHover={{ y: -5, scale: 1.12 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className={s.icon} aria-hidden="true" />
                  <span>{s.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div className="ct-resume-card" variants={fadeUp} custom={1}>
            <p className="ct-section-eyebrow">
              <i className="fas fa-file-alt" aria-hidden="true" /> Want my resume?
            </p>
            <a
              href="/resume%20section/Akash%20S%5B2026%5D.pdf"
              download
              className="ct-resume-btn"
            >
              <span className="ct-resume-shimmer" aria-hidden="true" />
              <i className="fas fa-download" aria-hidden="true" />
              <span>Download Resume</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="ct-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Link to="/" className="ct-back-btn">
            <span className="ct-back-bg" aria-hidden="true" />
            <span className="ct-back-glow" aria-hidden="true" />
            <span className="ct-back-inner">
              <i className="fas fa-arrow-left" aria-hidden="true" />
              Return to main world
            </span>
          </Link>
          <p className="ct-copy">&copy; {new Date().getFullYear()} Akash S</p>
        </motion.footer>
      </div>
    </div>
  );
}

export default Contact;
