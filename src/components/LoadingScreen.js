import React from 'react';

function LoadingScreen({ progress, onStart, showButton }) {
  return (
    <div id="loadingscreen">  
      <div id="loader-wrapper">
        <div className="title">Welcome to my world!</div>
        <h1 style={{textAlign: 'right'}}>
          <span>I’m Akash S — an AI Engineer passionate about building smart, purposeful systems that solve real problems and inspire progress.</span>
        </h1>
        <button className="button cta" onClick={showButton ? onStart : null} style={{ cursor: showButton ? 'pointer' : 'default' }}>
          {showButton ? (
            <>
              Explore my world <i className="fa-solid fa-arrow-right"></i>
            </>
          ) : (
            'Loading...'
          )}
        </button>
      </div>
    </div>
  );
}

export default LoadingScreen;
