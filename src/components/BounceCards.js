import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './BounceCards.css';

const BounceCards = ({ 
  images = [], 
  containerWidth = 400, 
  containerHeight = 400, 
  animationDelay = 0.6,
  enableHover = true 
}) => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    if (!images.length) return;

    const cards = cardsRef.current;
    const container = containerRef.current;

    // Set container size
    gsap.set(container, {
      width: containerWidth,
      height: containerHeight,
    });

    // Position cards in a circular pattern initially
    const radius = Math.min(containerWidth, containerHeight) * 0.35;
    const angleStep = (Math.PI * 2) / images.length;

    cards.forEach((card, i) => {
      const angle = angleStep * i;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      gsap.set(card, {
        x,
        y,
        rotation: Math.random() * 20 - 10,
        scale: 0,
      });

      // Animate in with bounce
      gsap.to(card, {
        scale: 1,
        duration: 0.8,
        delay: animationDelay + i * 0.1,
        ease: 'back.out(1.7)',
      });

      // Continuous floating animation
      gsap.to(card, {
        y: y + (Math.random() * 20 - 10),
        x: x + (Math.random() * 20 - 10),
        rotation: Math.random() * 30 - 15,
        duration: 2 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    // Mouse move effect
    if (enableHover) {
      const handleMouseMove = (e) => {
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        cards.forEach((card, i) => {
          const distance = Math.sqrt(mouseX ** 2 + mouseY ** 2);
          const maxDistance = Math.sqrt(rect.width ** 2 + rect.height ** 2) / 2;
          const influence = Math.max(0, 1 - distance / maxDistance);

          gsap.to(card, {
            x: mouseX * influence * 0.1 + Math.cos(angleStep * i) * radius,
            y: mouseY * influence * 0.1 + Math.sin(angleStep * i) * radius,
            duration: 0.5,
            ease: 'power2.out',
          });
        });
      };

      const handleMouseLeave = () => {
        cards.forEach((card, i) => {
          const angle = angleStep * i;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          gsap.to(card, {
            x,
            y,
            duration: 0.8,
            ease: 'power2.out',
          });
        });
      };

      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [images, containerWidth, containerHeight, animationDelay, enableHover]);

  return (
    <div ref={containerRef} className="bounceCardsContainer">
      {images.map((src, index) => (
        <div
          key={index}
          ref={(el) => (cardsRef.current[index] = el)}
          className="card"
        >
          <img src={src} alt={`Project ${index + 1}`} className="image" />
        </div>
      ))}
    </div>
  );
};

export default BounceCards;
