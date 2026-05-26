import React, { useState } from 'react';

function DarkModeToggle({ darkMode, setDarkMode }) {
  const [hovered, setHovered] = useState(false);

  const style = hovered
    ? { backgroundColor: '#542BEC', color: '#ffffff' }
    : { backgroundColor: '#ffffff', color: '#000000' };

  return (
    <label
      className="button-round"
      id="switch"
      style={style}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onPointerUp={() => setHovered(false)}
    >
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
