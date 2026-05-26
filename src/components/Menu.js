import React from 'react';
import StaggeredMenu from './StaggeredMenu';

function Menu({ darkMode }) {
  const menuItems = [
    { label: "Akash's World", ariaLabel: "Return to Akash's world", link: '/' },
    { label: 'About', ariaLabel: 'Learn about Akash', link: '/about' },
    { label: 'Contact', ariaLabel: 'Contact Akash', link: '/contact' }
  ];
  const socialItems = [
    { label: 'WhatsApp', icon: 'fab fa-whatsapp', link: 'https://wa.me/919880528258' },
    { label: 'LinkedIn', icon: 'fab fa-linkedin-in', link: 'https://linkedin.com/in/akash-s62' },
    { label: 'X', icon: null, text: '𝕏', link: 'https://x.com/Akash_Dachu_' }
  ];

  return (
    <StaggeredMenu
      isFixed={true}
      position="right"
      items={menuItems}
      socialItems={socialItems}
      displaySocials={true}
      displayItemNumbering={true}
      colors={['#303c92', '#757BFD']}
      menuButtonColor={darkMode ? '#ffffff' : '#10131d'}
      openMenuButtonColor="#ffffff"
      changeMenuColorOnOpen={true}
      accentColor="#757BFD"
    />
  );
}

export default Menu;
