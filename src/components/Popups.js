import React, { useState } from 'react';

function Popups({ projects, darkMode }) {
  const [cyclePos, setCyclePos] = useState(0);

  // This will be updated by Scene3D component
  React.useEffect(() => {
    window.updateCyclePos = (pos) => setCyclePos(pos);
  }, []);

  const popupContent = [
  { type: 'sign', text: "Ever since I was a kid, I’ve loved cartoons like Shinchan and Doraemon — they taught me how imagination can create entire worlds." },
  { type: 'sign', text: "That same spark led me to explore technology, where I could turn ideas into something real through code and design." },
  { type: 'project', index: 0 },
  { type: 'sign', text: "During my engineering journey in Bangalore, I started building AI projects that mix creativity, logic, and purpose." },
  { type: 'project', index: 1 },
  { type: 'sign', text: "Working on different internships helped me see how AI can solve real-world problems and make life easier for people." },
  { type: 'project', index: 2 },
  { type: 'project', index: 3 },
  { type: 'sign', text: "Now I'm focused on designing intelligent, human-centered systems — with the same curiosity I had watching cartoons." }
];

  const isVisible = (index) => {
    return cyclePos >= 0.025 + index/popupContent.length && cyclePos < 0.08 + index/popupContent.length;
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
        } else if (popup.type === 'project' && projects[popup.index]) {
          const project = projects[popup.index];
          const imageUrl = project.thumbnail ? 
            `https://cdn.sanity.io/images/jidqpryp/production/${project.thumbnail.asset._ref.substring(6, project.thumbnail.asset._ref.length-4)}.jpg` : '';
          
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
                View {popup.index < 2 ? (popup.index === 0 ? 'Bachelor' : 'Master') + ' Thesis' : 'project'} <i className="fa-solid fa-arrow-right"></i>
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
