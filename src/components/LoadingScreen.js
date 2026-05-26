import React, { useEffect, useState } from 'react';

function LoadingScreen({ progress, onStart, showButton }) {
  const [buttonReady, setButtonReady] = useState(false);
  const displayedProgress = Math.min(Math.round(progress), 100);

  useEffect(() => {
    if (!showButton) {
      setButtonReady(false);
      return undefined;
    }

    const revealTimer = setTimeout(() => setButtonReady(true), 550);
    return () => clearTimeout(revealTimer);
  }, [showButton]);

  return (
    <div id="loadingscreen">  
      <div id="loader-wrapper">
        <div className="title">Welcome to my world!</div>
        <h1 style={{textAlign: 'right'}}>
          <span>I'm Akash — AI/ML &amp; Software Engineer. I build LLM systems, RAG pipelines &amp; agentic products that actually work.</span>
        </h1>
        <button
          className={`button cta ${buttonReady ? 'cta-ready' : 'cta-loading'}`}
          onClick={buttonReady ? onStart : undefined}
          disabled={!buttonReady}
          aria-label={buttonReady ? 'Explore my world' : `Loading my world, ${displayedProgress}% complete`}
        >
          {!buttonReady && (
            <span
              className="cta-progress-fill"
              style={{ '--load-progress': `${displayedProgress}%` }}
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={displayedProgress}
            />
          )}
          <span className="cta-content">
          {buttonReady ? (
            <>
              Explore my world <i className="fa-solid fa-arrow-right"></i>
            </>
          ) : (
            <>
              <span className="cta-loader-ring" aria-hidden="true"></span>
              <span>Loading</span>
              <span className="cta-percentage">{displayedProgress}%</span>
            </>
          )}
          </span>
        </button>
      </div>
    </div>
  );
}

export default LoadingScreen;
