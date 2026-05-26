import { useCallback, useLayoutEffect, useRef } from 'react';
import Lenis from 'lenis';
import './ScrollStack.css';

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  scrollContainerRef,
  revealFromStack = false,
  onStackComplete
}) => {
  const scrollerRef = useRef(null);
  const cardsRef = useRef([]);
  const animationFrameRef = useRef(null);
  const lenisRef = useRef(null);
  const stackCompletedRef = useRef(false);
  const lastTransformsRef = useRef(new Map());
  const isUpdatingRef = useRef(false);
  const isExternalScroll = Boolean(scrollContainerRef);

  const resolveScrollContainer = useCallback(() => {
    if (useWindowScroll) return window;
    return scrollContainerRef?.current || scrollerRef.current;
  }, [scrollContainerRef, useWindowScroll]);

  const calculateProgress = useCallback((scrollTop, start, end) => {
    if (scrollTop <= start) return 0;
    if (scrollTop >= end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePosition = useCallback((value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value);
  }, []);

  const getScrollData = useCallback(() => {
    const container = resolveScrollContainer();
    if (!container) return { scrollTop: 0, containerHeight: 0 };
    if (container === window) {
      return { scrollTop: window.scrollY, containerHeight: window.innerHeight };
    }
    return { scrollTop: container.scrollTop, containerHeight: container.clientHeight };
  }, [resolveScrollContainer]);

  const getElementOffset = useCallback((element) => {
    const container = resolveScrollContainer();
    const stack = scrollerRef.current;
    if (!element || !container || !stack) return 0;
    let localOffset = 0;
    let currentElement = element;

    while (currentElement && currentElement !== stack) {
      localOffset += currentElement.offsetTop;
      currentElement = currentElement.offsetParent;
    }

    if (container === window) {
      return stack.getBoundingClientRect().top + window.scrollY + localOffset;
    }
    if (container === stack) return localOffset;
    const containerRect = container.getBoundingClientRect();
    const stackOffset = stack.getBoundingClientRect().top - containerRect.top + container.scrollTop;
    return stackOffset + localOffset;
  }, [resolveScrollContainer]);

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPositionPx = parsePosition(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePosition(scaleEndPosition, containerHeight);
    const endElement = scrollerRef.current?.querySelector('.scroll-stack-end');
    const pinEnd = getElementOffset(endElement) - containerHeight / 2;

    if (revealFromStack) {
      const firstCardTop = getElementOffset(cardsRef.current[0]);
      const revealStart = firstCardTop - stackPositionPx;
      const revealTravel = Math.max(itemDistance * 2, cardsRef.current[0].offsetHeight * 0.68);

      cardsRef.current.forEach((card, index) => {
        const cardTop = getElementOffset(card);
        const itemStart = revealStart + Math.max(0, index - 1) * revealTravel;
        const progress = index === 0 ? 1 : calculateProgress(scrollTop, itemStart, itemStart + revealTravel);
        const collapsedY = firstCardTop + itemStackDistance * index - cardTop;
        const collapsedScale = Math.max(baseScale, 1 - itemScale * index);
        const nextTransform = {
          translateY: Math.round(collapsedY * (1 - progress) * 100) / 100,
          scale: Math.round((collapsedScale + (1 - collapsedScale) * progress) * 1000) / 1000,
          rotation: Math.round(index * rotationAmount * (1 - progress) * 100) / 100,
          blur: Math.round(index * blurAmount * (1 - progress) * 100) / 100
        };
        const previous = lastTransformsRef.current.get(index);
        const hasChanged = !previous
          || Math.abs(previous.translateY - nextTransform.translateY) > 0.1
          || Math.abs(previous.scale - nextTransform.scale) > 0.001
          || Math.abs(previous.rotation - nextTransform.rotation) > 0.1
          || Math.abs(previous.blur - nextTransform.blur) > 0.1;

        if (hasChanged) {
          card.style.transform = `translate3d(0, ${nextTransform.translateY}px, 0) scale(${nextTransform.scale}) rotate(${nextTransform.rotation}deg)`;
          card.style.filter = nextTransform.blur ? `blur(${nextTransform.blur}px)` : '';
          lastTransformsRef.current.set(index, nextTransform);
        }

        if (index === cardsRef.current.length - 1) {
          if (progress >= 1 && !stackCompletedRef.current) {
            stackCompletedRef.current = true;
            onStackComplete?.();
          } else if (progress < 1) {
            stackCompletedRef.current = false;
          }
        }
      });

      isUpdatingRef.current = false;
      return;
    }

    let topCardIndex = 0;

    cardsRef.current.forEach((card, index) => {
      const triggerStart = getElementOffset(card) - stackPositionPx - itemStackDistance * index;
      if (scrollTop >= triggerStart) topCardIndex = index;
    });

    cardsRef.current.forEach((card, index) => {
      const cardTop = getElementOffset(card);
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * index;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + index * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? index * rotationAmount * scaleProgress : 0;
      const blur = blurAmount && index < topCardIndex ? (topCardIndex - index) * blurAmount : 0;

      let translateY = 0;
      if (scrollTop >= triggerStart && scrollTop <= pinEnd) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * index;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * index;
      }

      const nextTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100
      };
      const previous = lastTransformsRef.current.get(index);
      const hasChanged = !previous
        || Math.abs(previous.translateY - nextTransform.translateY) > 0.1
        || Math.abs(previous.scale - nextTransform.scale) > 0.001
        || Math.abs(previous.rotation - nextTransform.rotation) > 0.1
        || Math.abs(previous.blur - nextTransform.blur) > 0.1;

      if (hasChanged) {
        card.style.transform = `translate3d(0, ${nextTransform.translateY}px, 0) scale(${nextTransform.scale}) rotate(${nextTransform.rotation}deg)`;
        card.style.filter = nextTransform.blur ? `blur(${nextTransform.blur}px)` : '';
        lastTransformsRef.current.set(index, nextTransform);
      }

      if (index === cardsRef.current.length - 1) {
        const lastCardActive = scrollTop >= triggerStart && scrollTop <= pinEnd;
        if (lastCardActive && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!lastCardActive) {
          stackCompletedRef.current = false;
        }
      }
    });

    isUpdatingRef.current = false;
  }, [
    baseScale,
    blurAmount,
    calculateProgress,
    getElementOffset,
    getScrollData,
    itemDistance,
    itemScale,
    itemStackDistance,
    onStackComplete,
    parsePosition,
    revealFromStack,
    rotationAmount,
    scaleEndPosition,
    stackPosition
  ]);

  const setupScrollTracking = useCallback(() => {
    const container = resolveScrollContainer();
    if (!container) return () => {};

    if (isExternalScroll) {
      container.addEventListener('scroll', updateCardTransforms, { passive: true });
      window.addEventListener('resize', updateCardTransforms);
      return () => {
        container.removeEventListener('scroll', updateCardTransforms);
        window.removeEventListener('resize', updateCardTransforms);
      };
    }

    const options = useWindowScroll
      ? {
        duration: 1.2,
        smoothWheel: true,
        syncTouch: true,
        touchMultiplier: 2
      }
      : {
        wrapper: container,
        content: scrollerRef.current?.querySelector('.scroll-stack-inner'),
        duration: 1.2,
        smoothWheel: true,
        syncTouch: true,
        touchMultiplier: 2
      };
    const lenis = new Lenis(options);
    lenis.on('scroll', updateCardTransforms);
    lenisRef.current = lenis;

    const animate = (time) => {
      lenis.raf(time);
      animationFrameRef.current = window.requestAnimationFrame(animate);
    };
    animationFrameRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) window.cancelAnimationFrame(animationFrameRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isExternalScroll, resolveScrollContainer, updateCardTransforms, useWindowScroll]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    const cards = Array.from(scroller.querySelectorAll('.scroll-stack-card'));
    const transformsCache = lastTransformsRef.current;
    cardsRef.current = cards;
    cards.forEach((card, index) => {
      card.style.marginBottom = index < cards.length - 1 ? `${itemDistance}px` : '0';
      card.style.zIndex = `${revealFromStack ? cards.length - index : index + 1}`;
      card.style.transition = `filter ${scaleDuration}s ease`;
    });

    const teardown = setupScrollTracking();
    updateCardTransforms();

    return () => {
      teardown();
      stackCompletedRef.current = false;
      cardsRef.current = [];
      transformsCache.clear();
      isUpdatingRef.current = false;
    };
  }, [children, itemDistance, revealFromStack, scaleDuration, setupScrollTracking, updateCardTransforms]);

  return (
    <div
      className={`scroll-stack-scroller${isExternalScroll ? ' scroll-stack-scroller--external' : ''}${revealFromStack ? ' scroll-stack-scroller--reveal' : ''} ${className}`.trim()}
      ref={scrollerRef}
    >
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" aria-hidden="true"></div>
      </div>
    </div>
  );
};

export default ScrollStack;
