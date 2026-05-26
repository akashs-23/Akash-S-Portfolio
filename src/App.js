import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Scene3D from './components/Scene3D';
import LoadingScreen from './components/LoadingScreen';
import Menu from './components/Menu';
import DarkModeToggle from './components/DarkModeToggle';
import Popups from './components/Popups';
import Modals from './components/Modals';
import About from './pages/About';
import Contact from './pages/Contact';

function HomeOnlyToggle({ darkMode, setDarkMode, loading }) {
  const location = useLocation();
  if (location.pathname !== '/' || loading) return null;
  return <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const today = new Date();
    const time = today.getHours();
    if (time < 6 || time > 21) {
      setDarkMode(true);
    }

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
    <Router>
      <div className="App">
        <div id="logo" style={{ color: darkMode ? '#ffffff' : 'inherit' }}>AKASH S<br/>WORLD</div>

        <Menu darkMode={darkMode} />

        <HomeOnlyToggle darkMode={darkMode} setDarkMode={setDarkMode} loading={loading} />

        <Routes>
          <Route path="/" element={
            <>
              {loading && (
                <LoadingScreen
                  progress={loadingProgress}
                  onStart={handleStartClick}
                  showButton={loadingProgress >= 100}
                />
              )}

              <Scene3D
                darkMode={darkMode}
                started={started}
                setLoadingProgress={setLoadingProgress}
              />

              <Popups projects={projects} darkMode={darkMode} />

              <Modals projects={projects} />
            </>
          } />

          <Route path="/about" element={<About darkMode={darkMode} />} />
          <Route path="/contact" element={<Contact darkMode={darkMode} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
