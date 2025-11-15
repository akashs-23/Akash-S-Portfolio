import React, { useState } from 'react';

function Popups({ projects, darkMode }) {
  const [cyclePos, setCyclePos] = useState(0);

  // This will be updated by Scene3D component
  React.useEffect(() => {
    window.updateCyclePos = (pos) => setCyclePos(pos);
  }, []);

  // 5 AI Projects to display in the world
  const myProjects = [
    {
      title: 'Druva – AI Intelligent Dev Companion',
      subtitle: 'AI assistant for code explanation and productivity.',
      thumbnail: '/images/druva-thumb.jpg',
      herobanner: '/images/druva-hero.jpg'
    },
    {
      title: 'SOCA – AI Smart Optimized Code Auditor',
      subtitle: 'AI-powered code reviews that boost clarity and quality.',
      thumbnail: '/images/soca-thumb.jpg',
      herobanner: '/images/soca-hero.jpg'
    },
    {
      title: 'MediBot – AI Medical Diagnosis System',
      subtitle: 'Smart AI assistant for quick symptom checks and health insights.',
      thumbnail: '/images/medibot-thumb.jpg',
      herobanner: '/images/medibot-hero.jpg'
    },
    {
      title: 'Crezia – AI Text-to Image Generator',
      subtitle: 'Create stunning images instantly from simple text prompts.',
      thumbnail: '/images/crezia-thumb.jpg',
      herobanner: '/images/crezia-hero.jpg'
    },
    {
      title: 'Truva – AI Customer Support Copilot',
      subtitle: 'Adaptive AI chat support that elevates customer experience.',
      thumbnail: '/images/truva-thumb.jpg',
      herobanner: '/images/truva-hero.jpg'
    }
  ];

 const popupContent = [
  { type: 'sign', text: "I build AI experiences that are fast, meaningful, and human-focused." },
  { type: 'project', index: 0 },

  { type: 'sign', text: "Every project teaches me how to turn ideas into intelligent products." },
  { type: 'project', index: 1 },

  { type: 'sign', text: "I love creating systems that solve problems with clarity and precision." },
  { type: 'project', index: 2 },

  { type: 'sign', text: "Innovation drives me — from design to deployment." },
  { type: 'project', index: 3 },

  { type: 'sign', text: "My goal is simple: build AI that feels powerful, seamless, and useful." },
  { type: 'project', index: 4 },
  
  { type: 'sign', text: "Thanks for exploring my world! Feel free to reach out and connect." }
];



  const isVisible = (index) => {
    const totalItems = popupContent.length + 1; // +1 for initial instructions
    return cyclePos >= 0.025 + index/totalItems && cyclePos < 0.08 + index/totalItems;
  };

  return (
    <>
      <div className={`sign ${isVisible(0) ? 'visible' : 'hidden'}`} id="instructions">
        <div id="animation"></div>
        <div className="helptext"><span className="helptext" style={{ color: darkMode ? '#ffffff' : 'inherit' }}>Drag to explore</span></div>
      </div>

      {popupContent.map((popup, index) => {
        if (popup.type === 'sign') {
          return (
            <div key={index} className={`popup sign ${isVisible(index + 1) ? 'visible' : 'hidden'}`}>
              <p2 style={{ color: darkMode ? '#ffffff' : 'inherit' }}>
                {popup.text}
                {popup.link && (
                  <a href="https://www.instagram.com/joshua_v_h/" target="_blank" rel="noreferrer" style={{color: '#5c30fd'}}>
                    Instagram
                  </a>
                )}
              </p2>
            </div>
          );
        } else if (popup.type === 'project') {
          // Use custom projects or fallback to Sanity projects
          const project = myProjects[popup.index] || (projects[popup.index] || {});
          const imageUrl = project.thumbnail || '';
          
          return (
            <div key={index} className={`popup project ${isVisible(index + 1) ? 'visible' : 'hidden'}`}>
              <div className="content">
                <img className="thumbnail" src={imageUrl} alt={project.title} />
                <div className="text">
                  <h2 className="projecttitle" style={{ color: darkMode ? '#ffffff' : 'inherit' }}>{project.title}</h2>
                  <p className="subtitle" style={{ color: darkMode ? '#ffffff' : 'inherit' }}>{project.subtitle}</p>
                </div>
              </div>
              <button className="button primary" onClick={() => window.openModal(popup.index)}>
                View Project <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          );
        }
        return null;
      })}
    </>
  );
}

export default Popups;
