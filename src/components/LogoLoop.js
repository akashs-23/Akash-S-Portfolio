import React from 'react';
import './LogoLoop.css';

const LogoLoop = ({
  items = [],
  speed = 30,
  direction = 'left',
  logoHeight = 60,
  gap = 40,
  pauseOnHover = true,
  fadeOut = true,
  scaleOnHover = true,
  showLabels = true,
}) => {
  const duration = `${items.length * 3}s`;
  const animationDirection = direction === 'right' ? 'reverse' : 'normal';

  // Duplicate items to create seamless loop
  const allItems = [...items, ...items];

  return (
    <div 
      className={`logo-loop-container horizontal ${fadeOut ? 'fade-out' : ''} ${pauseOnHover ? 'pause-hover' : ''}`}
      style={{ '--gap': `${gap}px` }}
    >
      <div 
        className="logo-loop-track"
        style={{ 
          '--duration': duration,
          animationDirection,
        }}
      >
        {allItems.map((item, index) => (
          <div 
            key={index} 
            className={`logo-loop-item ${scaleOnHover ? 'scale-hover' : ''}`}
            style={{ 
              '--logo-height': `${logoHeight}px`,
              '--item-color': item.color || '#fff'
            }}
            aria-label={item.name}
            title={item.name}
          >
            <div className="logo-item-inner" style={{ background: item.color }}>
              {item.iconClass ? (
                <i className={`logo-icon ${item.iconClass}`} style={{ color: item.iconColor || '#fff' }} aria-hidden="true"></i>
              ) : (
                <span className="logo-icon" aria-hidden="true">{item.icon}</span>
              )}
            </div>
            {showLabels && <span className="logo-name">{item.name}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoLoop;
