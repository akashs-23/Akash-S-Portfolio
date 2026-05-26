import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './StaggeredMenu.css';

function StaggeredMenu({
  position = 'right',
  colors = ['#B497CF', '#5227FF'],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className = '',
  logoUrl,
  menuButtonColor = '#fff',
  openMenuButtonColor = '#fff',
  accentColor = '#5227FF',
  changeMenuColorOnOpen = true,
  isFixed = false,
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const panelRef = useRef(null);
  const layersRef = useRef(null);
  const toggleRef = useRef(null);
  const iconRef = useRef(null);

  const closeMenu = useCallback(() => {
    setOpen((currentlyOpen) => {
      if (currentlyOpen) onMenuClose?.();
      return false;
    });
  }, [onMenuClose]);

  const toggleMenu = useCallback(() => {
    setOpen((currentlyOpen) => {
      const nextOpen = !currentlyOpen;
      if (nextOpen) onMenuOpen?.();
      else onMenuClose?.();
      return nextOpen;
    });
  }, [onMenuClose, onMenuOpen]);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const preLayers = Array.from(layersRef.current?.querySelectorAll('.sm-prelayer') || []);
    if (!panel) return undefined;

    const offscreen = position === 'left' ? -100 : 100;
    const context = gsap.context(() => {
      gsap.set(panel, { clearProps: 'transform,opacity,visibility' });
      gsap.set(preLayers, { xPercent: offscreen });
      gsap.set(toggleRef.current, { color: menuButtonColor });
      gsap.set(iconRef.current, { rotate: 0, transformOrigin: '50% 50%' });
    }, wrapperRef);

    return () => context.revert();
  }, [menuButtonColor, position]);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const preLayers = Array.from(layersRef.current?.querySelectorAll('.sm-prelayer') || []);
    if (!panel) return undefined;

    const offscreen = position === 'left' ? -100 : 100;
    const itemLabels = Array.from(panel.querySelectorAll('.sm-panel-item-label'));
    const numberedItems = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
    const socialTitle = panel.querySelector('.sm-socials-title');
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));
    const context = gsap.context(() => {
      const timeline = gsap.timeline();
      gsap.to(toggleRef.current, {
        color: changeMenuColorOnOpen && open ? openMenuButtonColor : menuButtonColor,
        duration: 0.25,
        ease: 'power2.out'
      });
      gsap.to(iconRef.current, {
        rotate: open ? 225 : 0,
        duration: open ? 0.7 : 0.33,
        ease: open ? 'power4.out' : 'power3.inOut'
      });

      if (!open) {
        timeline.to(preLayers, {
          xPercent: offscreen,
          duration: 0.32,
          ease: 'power3.in',
          overwrite: 'auto'
        });
        return;
      }

      gsap.set(preLayers, { visibility: 'visible' });
      gsap.set(itemLabels, { yPercent: 140, rotate: 9 });
      gsap.set(numberedItems, { '--sm-num-opacity': 0 });
      if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
      gsap.set(socialLinks, { y: 20, opacity: 0 });

      preLayers.forEach((layer, index) => {
        timeline.fromTo(
          layer,
          { xPercent: offscreen },
          { xPercent: 0, duration: 0.5, ease: 'power4.out' },
          index * 0.07
        );
      });
      const panelStart = preLayers.length ? (preLayers.length - 1) * 0.07 + 0.08 : 0;
      timeline.to(
        itemLabels,
        {
          yPercent: 0,
          rotate: 0,
          duration: 0.85,
          stagger: 0.08,
          ease: 'power4.out'
        },
        panelStart + 0.12
      );
      timeline.to(
        numberedItems,
        { '--sm-num-opacity': 1, duration: 0.45, stagger: 0.07, ease: 'power2.out' },
        panelStart + 0.2
      );
      if (socialTitle) {
        timeline.to(socialTitle, { opacity: 1, duration: 0.4 }, panelStart + 0.38);
      }
      timeline.to(
        socialLinks,
        { y: 0, opacity: 1, duration: 0.42, stagger: 0.06, ease: 'power3.out' },
        panelStart + 0.41
      );
    }, wrapperRef);

    return () => context.revert();
  }, [
    changeMenuColorOnOpen,
    menuButtonColor,
    open,
    openMenuButtonColor,
    position
  ]);

  useEffect(() => {
    if (!open) return undefined;

    const handleEscape = (event) => {
      if (event.key === 'Escape') closeMenu();
    };
    const handleClickAway = (event) => {
      if (!closeOnClickAway) return;
      if (
        panelRef.current
        && !panelRef.current.contains(event.target)
        && toggleRef.current
        && !toggleRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('pointerdown', handleClickAway);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('pointerdown', handleClickAway);
    };
  }, [closeMenu, closeOnClickAway, open]);

  return (
    <div
      ref={wrapperRef}
      className={`staggered-menu-wrapper${isFixed ? ' fixed-wrapper' : ''} ${className}`.trim()}
      style={{ '--sm-accent': accentColor }}
      data-position={position}
      data-open={open || undefined}
    >
      <div ref={layersRef} className="sm-prelayers" aria-hidden="true">
        {colors.slice(0, 4).map((color, index) => (
          <div key={color + index} className="sm-prelayer" style={{ background: color }}></div>
        ))}
      </div>

      <header className={`staggered-menu-header${logoUrl ? '' : ' sm-header-without-logo'}`}>
        {logoUrl && (
          <img className="sm-logo-img" src={logoUrl} alt="Akash S World" draggable={false} />
        )}
        <button
          ref={toggleRef}
          className="sm-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="staggered-menu-panel"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={toggleMenu}
        >
          <span className="sm-toggle-label">{open ? 'Close' : 'Menu'}</span>
          <span ref={iconRef} className="sm-icon" aria-hidden="true">
            <span className="sm-icon-line"></span>
            <span className="sm-icon-line sm-icon-line-v"></span>
          </span>
        </button>
      </header>

      <aside
        id="staggered-menu-panel"
        ref={panelRef}
        className="staggered-menu-panel"
        aria-hidden={!open}
      >
        <div className="sm-panel-inner">
          <ul className="sm-panel-list" data-numbering={displayItemNumbering || undefined}>
            {items.map((item) => (
              <li className="sm-panel-item-wrap" key={item.label}>
                <a
                  className="sm-panel-item"
                  href={item.link}
                  aria-label={item.ariaLabel}
                  onClick={closeMenu}
                >
                  <span className="sm-panel-item-label">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>

          {displaySocials && socialItems.length > 0 && (
            <div className="sm-socials" aria-label="Social links">
              <h3 className="sm-socials-title">Connect</h3>
              <ul className="sm-socials-list">
                {socialItems.map((item) => (
                  <li key={item.label}>
                    <a
                      className="sm-socials-link"
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.icon
                        ? <i className={item.icon} aria-hidden="true" />
                        : <span className="sm-social-text">{item.text}</span>
                      }
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export default StaggeredMenu;
