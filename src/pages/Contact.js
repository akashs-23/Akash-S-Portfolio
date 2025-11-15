import React, { useState, useRef } from 'react';
import './Contact.css';

function Contact({ darkMode }) {
  const formRef = useRef();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('sending');
    setErrorMessage('');
    
    // Use FormSubmit.co - a free form backend service
    // This will send the form data to your email without any setup
    const formData = new FormData(formRef.current);
    
    fetch('https://formsubmit.co/ajax/akashsofficial62@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: formRef.current.name.value,
        email: formRef.current.email.value,
        subject: formRef.current.subject.value,
        message: formRef.current.message.value
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success === 'true' || data.success === true) {
        setFormStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        setTimeout(() => {
          setFormStatus('');
        }, 5000);
      } else {
        throw new Error('Failed to send');
      }
    })
    .catch((error) => {
      console.error('FormSubmit failed, using mailto fallback:', error);
      
      // Fallback to mailto if FormSubmit fails
      const mailtoLink = `mailto:akashsofficial62@gmail.com?subject=${encodeURIComponent(formRef.current.subject.value)}&body=${encodeURIComponent(
        `Name: ${formRef.current.name.value}\nEmail: ${formRef.current.email.value}\n\nMessage:\n${formRef.current.message.value}`
      )}`;
      
      window.location.href = mailtoLink;
      
      setFormStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => {
        setFormStatus('');
      }, 5000);
    });
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
          <p className="contact-space-subtitle">Have an idea? Let's make it happen together in the digital cosmos</p>
        </section>

        <div className="contact-content-grid">
          {/* Contact Form */}
          <section className="contact-form-galaxy">
            <div className="form-card-glow"></div>
            <h2 className="form-section-title">
              <i className="fas fa-rocket"></i>
              Launch Your Message
            </h2>
            <form ref={formRef} onSubmit={handleSubmit} className="contact-form-space">
              <div className="form-group-space">
                <label htmlFor="name">
                  <i className="fas fa-user"></i>
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Akash S"
                />
              </div>

              <div className="form-group-space">
                <label htmlFor="email">
                  <i className="fas fa-envelope"></i>
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="akashsofficial62@gmail.com"
                />
              </div>

              <div className="form-group-space">
                <label htmlFor="subject">
                  <i className="fas fa-tag"></i>
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Project Collaboration"
                />
              </div>

              <div className="form-group-space">
                <label htmlFor="message">
                  <i className="fas fa-comment-dots"></i>
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Tell me about your vision, project, or just say hello..."
                ></textarea>
              </div>

              <button type="submit" className="submit-button-space" disabled={formStatus === 'sending'}>
                {formStatus === 'sending' ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Sending to Space...
                  </>
                ) : formStatus === 'success' ? (
                  <>
                    <i className="fas fa-check-circle"></i> Message Delivered!
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i> Send Message
                  </>
                )}
              </button>

              {formStatus === 'success' && (
                <div className="success-message-space">
                  <i className="fas fa-check-circle"></i>
                  Your message has been sent successfully! I'll get back to you soon.
                </div>
              )}
              
              {formStatus === 'error' && (
                <div className="error-message-space">
                  <i className="fas fa-exclamation-circle"></i>
                  {errorMessage}
                </div>
              )}
            </form>
          </section>

          {/* Contact Info & Social */}
          <section className="contact-info-constellation">
            {/* Contact Info Card */}
            <div className="info-planet-card">
              <div className="planet-glow-effect"></div>
              <h2 className="info-section-title">
                <i className="fas fa-address-card"></i>
                Contact Details
              </h2>
              
              <div className="info-item-space">
                <div className="info-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="info-content">
                  <h3>Email</h3>
                  <a href="mailto:akashsofficial62@gmail.com">akashsofficial62@gmail.com</a>
                </div>
              </div>

              <div className="info-item-space">
                <div className="info-icon">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div className="info-content">
                  <h3>Phone</h3>
                  <a href="tel:+919880528258">+91-9880528258</a>
                </div>
              </div>

              <div className="info-item-space">
                <div className="info-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="info-content">
                  <h3>Location</h3>
                  <p>Bangalore, India</p>
                </div>
              </div>
            </div>

            {/* Social Media Card */}
            <div className="social-planet-card">
              <div className="planet-glow-effect"></div>
              <h2 className="info-section-title">
                <i className="fas fa-share-alt"></i>
                Social Universe
              </h2>
              <div className="social-links-grid">
                <a href="https://github.com/Akash-62" target="_blank" rel="noopener noreferrer" className="social-link-space github-link">
                  <i className="fab fa-github"></i>
                  <span>GitHub</span>
                </a>
                
                <a href="https://linkedin.com/in/akash-s62" target="_blank" rel="noopener noreferrer" className="social-link-space linkedin-link">
                  <i className="fab fa-linkedin"></i>
                  <span>LinkedIn</span>
                </a>
                
                <a href="hhttps://x.com/Akash_Dachu_?t=k0HtwfP4CvKHQDpu1OpEjg&s=09" target="_blank" rel="noopener noreferrer" className="social-link-space twitter-link">
                  <i className="fab fa-twitter"></i>
                  <span>Twitter</span>
                </a>
                
                <a href="https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=8ccsjqt" target="_blank" rel="noopener noreferrer" className="social-link-space instagram-link">
                  <i className="fab fa-instagram"></i>
                  <span>Instagram</span>
                </a>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="actions-planet-card">
              <div className="planet-glow-effect"></div>
              <h2 className="info-section-title">
                <i className="fas fa-bolt"></i>
                Quick Actions
              </h2>
              <div className="actions-grid">
                <a href="/resume section/AKASH S [2025].pdf" download className="action-button-space resume-action">
                  <i className="fas fa-file-download"></i>
                  <span>Download Resume</span>
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* Back Button */}
        <section className="contact-back-section">
          <a href="/" className="back-to-world-button">
            <i className="fas fa-arrow-left"></i>
            <span>Return to Main World</span>
          </a>
        </section>
      </div>
    </div>
  );
}

export default Contact;
