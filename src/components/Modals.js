import React, { useState } from 'react';

function Modals({ projects }) {
  const [openModal, setOpenModal] = useState(null);

  React.useEffect(() => {
    window.openModal = (index) => setOpenModal(index);
  }, []);

  const closeModal = () => setOpenModal(null);

  return (
    <>
      {projects.map((project, index) => {
        const headerImage = project.herobanner ? 
          `https://cdn.sanity.io/images/jidqpryp/production/${project.herobanner.asset._ref.substring(6, project.herobanner.asset._ref.length-4)}.jpg` : '';
        
        return (
          <div key={index} className={`modal ${openModal === index ? 'show' : ''}`} id={`myModal${index + 1}`}>
            <div className="header" style={{backgroundImage: `linear-gradient(to bottom, rgba(0,0,0, 0.2), rgba(0,0,0, 1)), url(${headerImage})`}}>
              <div className="header-wrapper">
                <div className="title projectheadline">{project.title}</div>
              </div>
              <div className="button-round close" onClick={closeModal}>
                <i className="icon fa-solid fa-xmark fa-xl"></i>
              </div>
            </div>
            <div className="modal-content-wrapper">
              <h1 className="modal-subtitle">{project.subtitle}</h1>
              
              {index === 0 && (
                <div className="embed-container">
                  <iframe 
                    className="video" 
                    src="https://player.vimeo.com/video/190451314?h=5b038d6e31" 
                    width="640" 
                    height="360" 
                    frameBorder="0" 
                    allowFullScreen
                    title="Project Video"
                  ></iframe>
                </div>
              )}
              
              {project.sections && project.sections.map((section, sIndex) => {
                if (section._type === 'subheadline') {
                  return <h1 key={sIndex}>{section.input}</h1>;
                } else if (section._type === 'text-field') {
                  return <p2 key={sIndex}>{section.input}</p2>;
                } else if (section._type === 'product-image') {
                  const imgUrl = `https://cdn.sanity.io/images/jidqpryp/production/${section.asset._ref.substring(6, section.asset._ref.length-4)}.jpg`;
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
