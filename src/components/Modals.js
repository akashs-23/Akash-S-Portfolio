import React, { useState } from 'react';
import projectsData from '../data/projects';

function Modals({ projects }) {
  const [openModal, setOpenModal] = useState(null);

  const myProjects = projectsData.map((project) => ({
    ...project,
    herobanner: project.herobanner || project.thumbnail,
    sections: [
      { _type: 'subheadline', input: 'Overview' },
      { _type: 'text-field', input: project.detail || project.description || project.subtitle },
      { _type: 'subheadline', input: 'Technologies' },
      { _type: 'text-field', input: project.tech?.join(', ') || 'AI systems, product engineering, and deployment.' }
    ],
    credits: ['Akash S - AI Engineer']
  }));

  React.useEffect(() => {
    window.openModal = (index) => setOpenModal(index);
  }, []);

  const closeModal = () => setOpenModal(null);
  const allProjects = [...myProjects, ...projects];

  return (
    <>
      {allProjects.map((project, index) => {
        const headerImage = project.herobanner ||
          (project.herobanner?.asset ? `https://cdn.sanity.io/images/jidqpryp/production/${project.herobanner.asset._ref.substring(6, project.herobanner.asset._ref.length - 4)}.jpg` : '');

        return (
          <div key={index} className={`modal ${openModal === index ? 'show' : ''}`} id={`myModal${index + 1}`}>
            <div className="header" style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0, 0.2), rgba(0,0,0, 1)), url(${headerImage})` }}>
              <div className="header-wrapper">
                <div className="title projectheadline">{project.title}</div>
              </div>
              <div className="modal-close-btn" onClick={closeModal}>
                <i className="icon fa-solid fa-xmark fa-xl"></i>
              </div>
            </div>
            <div className="modal-content-wrapper">
              <h1 className="modal-subtitle">{project.subtitle}</h1>

              {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-live-link">
                  <span className="link-icon">🚀</span>
                  <span className="link-text">View Live Project</span>
                  <span className="link-arrow">→</span>
                </a>
              )}

              {project.sections && project.sections.map((section, sIndex) => {
                if (section._type === 'subheadline') {
                  return <h1 key={sIndex}>{section.input}</h1>;
                }
                if (section._type === 'text-field') {
                  return <p key={sIndex}>{section.input}</p>;
                }
                if (section._type === 'product-image') {
                  const imgUrl = section.url ||
                    (section.asset ? `https://cdn.sanity.io/images/jidqpryp/production/${section.asset._ref.substring(6, section.asset._ref.length - 4)}.jpg` : '');
                  return <img key={sIndex} className="project-img" src={imgUrl} alt="" />;
                }
                return null;
              })}

              {project.credits && project.credits.length > 0 && (
                <div className="credits">
                  {project.credits.map((credit, cIndex) => (
                    <p key={cIndex} className="credit">{credit}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}

export default Modals;
