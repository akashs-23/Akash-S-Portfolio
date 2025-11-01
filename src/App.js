import React, { useState, useEffect } from 'react';
import './App.css';
import Scene3D from './components/Scene3D';
import LoadingScreen from './components/LoadingScreen';
import Menu from './components/Menu';
import DarkModeToggle from './components/DarkModeToggle';
import Popups from './components/Popups';
import Modals from './components/Modals';

function App() {
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Check time for auto dark mode
    const today = new Date();
    const time = today.getHours();
    if (time < 6 || time > 21) {
      setDarkMode(true);
    }

    // Fetch Sanity data
    const PROJECT_ID = "jidqpryp";
    const DATASET = "production";
    const QUERY = encodeURIComponent('*[_type == "project"] | order(order asc)');
    const URL = `https://${PROJECT_ID}.api.sanity.io/v2022-07-11/data/query/${DATASET}?query=${QUERY}`;

    fetch(URL)
      .then((res) => res.json())
      .then(({ result }) => {
        setProjects(result || []);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleStartClick = () => {
    setStarted(true);
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <div className="App">
      {loading && (
        <LoadingScreen 
          progress={loadingProgress}
          onStart={handleStartClick}
          showButton={loadingProgress >= 100}
        />
      )}
      
      <div id="logo" style={{ color: darkMode ? '#ffffff' : 'inherit' }}>AKASH S<br/>WORLD</div>
      
      <Menu darkMode={darkMode} />
      
      <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <Scene3D 
        darkMode={darkMode} 
        started={started}
        setLoadingProgress={setLoadingProgress}
      />
      
      <Popups projects={projects} darkMode={darkMode} />
      
      <Modals projects={projects} />
    </div>
  );
}

export default App;
