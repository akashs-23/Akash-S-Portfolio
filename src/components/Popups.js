import React, { useState } from 'react';
import projectsData from '../data/projects';

function Popups({ darkMode }) {
  const [cyclePos, setCyclePos] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);

  // This will be updated by Scene3D component
  React.useEffect(() => {
    const updateCyclePos = (pos) => setCyclePos(pos);
    const hideExploreInstructions = () => setShowInstructions(false);

    window.updateCyclePos = updateCyclePos;
    window.hideExploreInstructions = hideExploreInstructions;

    return () => {
      if (window.updateCyclePos === updateCyclePos) {
        delete window.updateCyclePos;
      }
      if (window.hideExploreInstructions === hideExploreInstructions) {
        delete window.hideExploreInstructions;
      }
    };
  }, []);

  const myProjects = projectsData;

 const popupContent = [
  { type: 'sign', text: "I build AI systems that are fast, useful, and human-focused." },
  { type: 'project', index: 0 },

  { type: 'sign', text: "Every project teaches me how to turn ideas into intelligent products." },
  { type: 'project', index: 1 },

  { type: 'sign', text: "I love creating systems that solve problems with clarity and precision." },
  { type: 'project', index: 2 },

  { type: 'sign', text: "Innovation drives me, from design to deployment." },
  { type: 'project', index: 3 },

  { type: 'connect' }
];



  const isVisible = (index) => {
    const totalItems = popupContent.length + 1; // +1 for initial instructions
    return cyclePos >= 0.025 + index/totalItems && cyclePos < 0.08 + index/totalItems;
  };

  return (
    <>
      <div className={`sign ${showInstructions ? 'visible' : 'hidden'}`} id="instructions">
        <div id="animation"></div>
        <div className="helptext" style={{ color: darkMode ? '#ffffff' : 'inherit' }}>
          <span>Drag to explore</span>
        </div>
      </div>

      {popupContent.map((popup, index) => {
        if (popup.type === 'sign') {
          return (
            <div key={index} className={`popup sign ${isVisible(index + 1) ? 'visible' : 'hidden'}`}>
              <span style={{ color: darkMode ? '#ffffff' : 'inherit' }}>
                {popup.text}
              </span>
            </div>
          );
        } else if (popup.type === 'connect') {
          return (
            <div key={index} className={`popup project ${isVisible(index + 1) ? 'visible' : 'hidden'}`}>
              <div className="content">
                <div className="text" style={{ textAlign: 'center' }}>
                  <h2 className="projecttitle" style={{ color: darkMode ? '#ffffff' : 'inherit' }}>
                    Thanks for exploring my world!
                  </h2>
                  <p className="subtitle" style={{ color: darkMode ? '#ffffff' : 'inherit' }}>
                    Have an idea? Let's build it.
                  </p>
                </div>
              </div>
              <a className="button primary" href="/contact">
                Let's Connect <i className="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          );
        } else if (popup.type === 'project') {
          const project = myProjects[popup.index] || {};
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
              <a className="button primary" href={project.link} target="_blank" rel="noopener noreferrer">
                View Project <i className="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          );
        }
        return null;
      })}
    </>
  );
}

export default Popups;
