import React, { useState } from 'react';

function Modals({ projects }) {
  const [openModal, setOpenModal] = useState(null);

  // 5 AI Projects with full details
  const myProjects = [
  // 1. DRUVA
  {
    title: 'Druva – AI Intelligent Dev Companion',
    subtitle: 'AI coding assistant that boosts developer productivity.',
    herobanner: '/images/druva-hero.jpg',
    link: 'https://druva-ai-developer-assistant.vercel.app/',
    sections: [
      { _type: 'subheadline', input: 'Developer Frustration' },
      { _type: 'text-field', input: 'Debugging, explanation, and code clarity take time. Druva simplifies all of it with a clean, fast, voice-enabled AI interface.' },
      { _type: 'subheadline', input: 'Developer Productivity Reimagined' },
      { _type: 'text-field', input: 'Built an AI-driven tool that explains code, generates snippets, and answers programming queries through text and voice. Smooth UI enhances the entire experience.' },
      { _type: 'product-image', url: '/images/druva-hero.jpg' },
      { _type: 'subheadline', input: 'Technologies' },
      { _type: 'text-field', input: 'React, TypeScript, Vite, Tailwind, Speech-to-Text, AI Models' }
    ],
    credits: ['Akash S – AI Engineer']
  },

  // 2. SOCA
  {
    title: 'SOCA – AI Smart Optimized Code Auditor',
    subtitle: 'AI-powered code reviewer that helps developers write cleaner, smarter code.',
    herobanner: '/images/soca-hero.jpg',
    link: 'https://soca-ai-driven-code-review-assistan.vercel.app/',
    sections: [
      { _type: 'subheadline', input: 'The Problem' },
      { _type: 'text-field', input: 'Code reviews are slow and inconsistent. SOCA accelerates the process by analyzing code instantly using AI.' },
      { _type: 'subheadline', input: 'AI Review Intelligence' },
      { _type: 'text-field', input: 'Built an AI system that highlights errors, suggests improvements, and provides explanations using LLM-powered analysis. The gamified mode boosts engagement for new developers.' },
      { _type: 'product-image', url: '/images/soca-hero.jpg' },
      { _type: 'subheadline', input: 'Technologies' },
      { _type: 'text-field', input: 'React, TypeScript, Tailwind, Gemini API' }
    ],
    credits: ['Akash S – AI Engineer']
  },

  // 3. MEDIBOT
  {
    title: 'MediBot – AI Health Assistant and Medical Diagnosis System',
    subtitle: 'Smart AI assistant for instant symptom checks and medical guidance.',
    herobanner: '/images/medibot-hero.jpg',
    link: 'https://medi-bot-rust.vercel.app/',
    sections: [
      { _type: 'subheadline', input: 'The Challenge' },
      { _type: 'text-field', input: 'Access to quick and reliable medical guidance is limited. MediBot bridges that gap by analyzing symptoms using AI to offer helpful insights.' },
      { _type: 'subheadline', input: 'The Solution' },
      { _type: 'text-field', input: 'Designed an AI-driven triage system with voice input, OCR, and preventive-care recommendations. Achieved fast and reliable assessments using advanced RAG architecture.' },
      { _type: 'product-image', url: '/images/medibot-hero.jpg' },
      { _type: 'subheadline', input: 'Technologies' },
      { _type: 'text-field', input: 'React, TypeScript, RAG, OCR, Speech-to-Text, Python' }
    ],
    credits: ['Akash S – AI Engineer']
  },

  // 4. CREZIA
  {
    title: 'Crezia – AI Text-to-Image Generator',
    subtitle: 'Transforming words into stunning visuals using generative AI.',
    herobanner: '/images/crezia-hero.jpg',
    link: 'https://crezia-ai-text-image-generator.vercel.app/',
    sections: [
      { _type: 'subheadline', input: 'The Vision' },
      { _type: 'text-field', input: 'Crezia reimagines creativity by converting simple text prompts into high-quality AI-generated artwork. It gives users a powerful visual creation tool without needing artistic skills.' },
      { _type: 'subheadline', input: 'How It Works' },
      { _type: 'text-field', input: 'Built an efficient text-to-image pipeline using Gemini + HuggingFace models, enabling fast style rendering, aspect control, and creative prompt enhancements.' },
      { _type: 'product-image', url: '/images/crezia-hero.jpg' },
      { _type: 'subheadline', input: 'Technologies' },
      { _type: 'text-field', input: 'React, TypeScript, Vite, Tailwind, Gemini API, HuggingFace' }
    ],
    credits: ['Akash S – AI Developer']
  },

  // 5. TRUVA
  {
    title: 'Truva – AI Customer Support Copilot',
    subtitle: 'An adaptive AI assistant that delivers fast, human-like customer support.',
    herobanner: '/images/truva-hero.jpg',
    link: 'https://truva-ai-assistant-customer-support.vercel.app/',
    sections: [
      { _type: 'subheadline', input: 'Customer Support Gap' },
      { _type: 'text-field', input: 'Support teams struggle with slow response times. Truva solves this by offering instant AI-driven responses and user understanding.' },
      { _type: 'subheadline', input: 'Smart Support Engine' },
      { _type: 'text-field', input: 'Built a memory-enabled chatbot that adapts to user context, provides real-time insights, and works seamlessly as a PWA on all devices.' },
      { _type: 'product-image', url: '/images/truva-hero.jpg' },
      { _type: 'subheadline', input: 'Technologies' },
      { _type: 'text-field', input: 'React, TypeScript, Tailwind, PWA, AI Memory Engine' }
    ],
    credits: ['Akash S – Full-Stack & AI Developer']
  }
];


  React.useEffect(() => {
    window.openModal = (index) => setOpenModal(index);
  }, []);

  const closeModal = () => setOpenModal(null);

  // Combine custom projects with Sanity projects
  const allProjects = [...myProjects, ...projects];

  return (
    <>
      {allProjects.map((project, index) => {
        // Handle both custom projects and Sanity projects
        const headerImage = project.herobanner || 
          (project.herobanner?.asset ? `https://cdn.sanity.io/images/jidqpryp/production/${project.herobanner.asset._ref.substring(6, project.herobanner.asset._ref.length-4)}.jpg` : '');
        
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
                } else if (section._type === 'text-field') {
                  return <p2 key={sIndex}>{section.input}</p2>;
                } else if (section._type === 'product-image') {
                  // Handle both URL and Sanity asset reference
                  const imgUrl = section.url || 
                    (section.asset ? `https://cdn.sanity.io/images/jidqpryp/production/${section.asset._ref.substring(6, section.asset._ref.length-4)}.jpg` : '');
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
