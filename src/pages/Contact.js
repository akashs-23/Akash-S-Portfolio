import React from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

function Contact({ darkMode }) {
  const whatsappNumber = '919880528258';
  const email = 'akashsofficial62@gmail.com';
  const phone = '+919880528258';

  const openWhatsApp = () => {
    const message = "Hey Akash! 👋 I'd like to connect with you.";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className={`contact-space-wrapper ${darkMode ? 'dark' : ''}`}>
      {/* Animated Space Background */}
      <div className="contact-stars-container"></div>
      <div className="contact-nebula-bg"></div>

      <div className="contact-container">
        {/* Header */}
        <section className="contact-space-header">
          <h1 className="contact-space-title">Let's Connect</h1>
          <p className="contact-space-subtitle">Pick your preferred way to reach out — I'm just one click away!</p>
        </section>

        {/* Main Contact Options */}
        <div className="contact-quick-actions">
          {/* WhatsApp - Primary CTA */}
          <button onClick={openWhatsApp} className="contact-primary-btn whatsapp-btn">
            <div className="btn-icon">
              <i className="fab fa-whatsapp"></i>
            </div>
            <div className="btn-content">
              <span className="btn-title">Chat on WhatsApp</span>
              <span className="btn-subtitle">Quick & Easy — Let's Talk!</span>
            </div>
            <i className="fas fa-arrow-right btn-arrow"></i>
          </button>

          {/* Email */}
          <a 
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=Hello%20Akash!`}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-primary-btn email-btn"
          >
            <div className="btn-icon">
              <i className="fas fa-envelope"></i>
            </div>
            <div className="btn-content">
              <span className="btn-title">Send an Email</span>
              <span className="btn-subtitle">{email}</span>
            </div>
            <i className="fas fa-arrow-right btn-arrow"></i>
          </a>

          {/* Call */}
          <a href={`tel:${phone}`} className="contact-primary-btn call-btn">
            <div className="btn-icon">
              <i className="fas fa-phone-alt"></i>
            </div>
            <div className="btn-content">
              <span className="btn-title">Give me a Call</span>
              <span className="btn-subtitle">+91-9880528258</span>
            </div>
            <i className="fas fa-arrow-right btn-arrow"></i>
          </a>
        </div>

        {/* Location Badge */}
        <div className="location-badge">
          <i className="fas fa-map-marker-alt"></i>
          <span>Based in Bangalore, India</span>
        </div>

        {/* Social & Resume Section */}
        <div className="contact-secondary-grid">
          {/* Social Media */}
          <div className="social-section">
            <h3 className="section-label">
              <i className="fas fa-globe"></i>
              Find me online
            </h3>
            <div className="social-links-row">
              <a href="https://github.com/Akash-62" target="_blank" rel="noopener noreferrer" className="social-icon-btn github">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://linkedin.com/in/akash-s62" target="_blank" rel="noopener noreferrer" className="social-icon-btn linkedin">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="https://x.com/Akash_Dachu_" target="_blank" rel="noopener noreferrer" className="social-icon-btn twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=8ccsjqt" target="_blank" rel="noopener noreferrer" className="social-icon-btn instagram">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Resume Download */}
          <div className="resume-section">
            <h3 className="section-label">
              <i className="fas fa-file-alt"></i>
              Want my resume?
            </h3>
            <a href="/resume section/AKASH S [2025].pdf" download className="resume-download-btn">
              <i className="fas fa-download"></i>
              <span>Download Resume</span>
            </a>
          </div>
        </div>

        {/* Back Button */}
        <section className="contact-back-section">
          <Link to="/" className="back-to-world-button">
            <span className="btn-bg"></span>
            <span className="btn-glow"></span>
            <span className="btn-particles">
              <span></span><span></span><span></span><span></span><span></span>
            </span>
            <span className="btn-inner">
              <i className="fas fa-rocket"></i>
              <span>Return to Main World</span>
            </span>
          </Link>
        </section>
      </div>
    </div>
  );
}

export default Contact;
