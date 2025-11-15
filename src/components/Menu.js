import React from 'react';

function Menu({ darkMode }) {
  return (
    <nav role="navigation">
      <div id="menuToggle">
        <input type="checkbox" />
        <span style={{background: darkMode ? 'white' : 'black'}}></span>
        <span style={{background: darkMode ? 'white' : 'black'}}></span>
        <span style={{background: darkMode ? 'white' : 'black'}}></span>
        <ul id="menu">
          <a href="/"><li className="active">Akash'S World</li></a>
          <a href="/about"><li>About</li></a>
          <a href="/contact"><li>Contact</li></a>
        </ul>
      </div>
    </nav>
  );
}

export default Menu;
