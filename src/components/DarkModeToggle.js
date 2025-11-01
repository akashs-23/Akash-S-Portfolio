import React from 'react';

function DarkModeToggle({ darkMode, setDarkMode }) {
  return (
    <label className="button-round" id="switch">
      <input 
        id="myCheckbox" 
        type="checkbox" 
        checked={!darkMode}
        onChange={(e) => setDarkMode(!e.target.checked)}
      />
      <i id="moon" className="icon fa fa-moon fa-xl"></i>
      <i id="sun" className="icon fa fa-lightbulb fa-xl"></i>
    </label>
  );
}

export default DarkModeToggle;
