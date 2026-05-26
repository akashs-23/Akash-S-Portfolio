import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import './ProfileCard.css';

const DEFAULT_INNER_GRADIENT = 'linear-gradient(145deg, #302257 0%, #10253d 54%, #101727 100%)';

const ANIMATION_CONFIG = {
  INITIAL_DURATION: 1200,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
  ENTER_TRANSITION_MS: 180
};

const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);
const round = (value, precision = 3) => parseFloat(value.toFixed(precision));
const adjust = (value, fromMin, fromMax, toMin, toMax) => (
  round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin))
);

function ProfileCardComponent({
  avatarUrl = '',
  iconUrl = '',
  grainUrl = '',
  innerGradient,
  behindGlowEnabled = true,
  behindGlowColor,
  behindGlowSize,
  className = '',
  enableTilt = true,
  enableMobileTilt = false,
  mobileTiltSensitivity = 5,
  miniAvatarUrl,
  name = 'Akash S',
  title = 'AI/ML Engineer',
  handle = 'akash-s62',
  status = 'Available',
  contactText = 'Contact',
  showUserInfo = true,
  onContactClick
}) {
  const wrapRef = useRef(null);
  const shellRef = useRef(null);
  const enterTimerRef = useRef(null);
  const leaveRafRef = useRef(null);

  const tiltEngine = useMemo(() => {
    if (!enableTilt) return null;

    let rafId = null;
    let running = false;
    let lastTs = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let initialUntil = 0;
    const defaultTau = 0.14;
    const initialTau = 0.6;

    const setVarsFromXY = (x, y) => {
      const shell = shellRef.current;
      const wrap = wrapRef.current;
      if (!shell || !wrap) return;

      const width = shell.clientWidth || 1;
      const height = shell.clientHeight || 1;
      const percentX = clamp((100 / width) * x);
      const percentY = clamp((100 / height) * y);
      const centerX = percentX - 50;
      const centerY = percentY - 50;
      const properties = {
        '--pointer-x': `${percentX}%`,
        '--pointer-y': `${percentY}%`,
        '--background-x': `${adjust(percentX, 0, 100, 35, 65)}%`,
        '--background-y': `${adjust(percentY, 0, 100, 35, 65)}%`,
        '--pointer-from-center': `${clamp(Math.hypot(centerY, centerX) / 50, 0, 1)}`,
        '--pointer-from-top': `${percentY / 100}`,
        '--pointer-from-left': `${percentX / 100}`,
        '--rotate-x': `${round(-(centerX / 5))}deg`,
        '--rotate-y': `${round(centerY / 4)}deg`
      };

      Object.entries(properties).forEach(([key, value]) => {
        wrap.style.setProperty(key, value);
      });
    };

    const step = (timestamp) => {
      if (!running) return;
      if (lastTs === 0) lastTs = timestamp;
      const deltaTime = (timestamp - lastTs) / 1000;
      lastTs = timestamp;
      const tau = timestamp < initialUntil ? initialTau : defaultTau;
      const factor = 1 - Math.exp(-deltaTime / tau);
      currentX += (targetX - currentX) * factor;
      currentY += (targetY - currentY) * factor;
      setVarsFromXY(currentX, currentY);

      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        rafId = requestAnimationFrame(step);
      } else {
        running = false;
        lastTs = 0;
        rafId = null;
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      lastTs = 0;
      rafId = requestAnimationFrame(step);
    };

    return {
      setImmediate(x, y) {
        currentX = x;
        currentY = y;
        setVarsFromXY(x, y);
      },
      setTarget(x, y) {
        targetX = x;
        targetY = y;
        start();
      },
      toCenter() {
        const shell = shellRef.current;
        if (shell) this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2);
      },
      beginInitial(durationMs) {
        initialUntil = performance.now() + durationMs;
        start();
      },
      getCurrent() {
        return { x: currentX, y: currentY, tx: targetX, ty: targetY };
      },
      cancel() {
        if (rafId) cancelAnimationFrame(rafId);
        running = false;
        lastTs = 0;
        rafId = null;
      }
    };
  }, [enableTilt]);

  const getOffsets = (event, element) => {
    const rect = element.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const handlePointerMove = useCallback((event) => {
    const shell = shellRef.current;
    if (!shell || !tiltEngine) return;
    const { x, y } = getOffsets(event, shell);
    tiltEngine.setTarget(x, y);
  }, [tiltEngine]);

  const handlePointerEnter = useCallback((event) => {
    const shell = shellRef.current;
    const wrap = wrapRef.current;
    if (!shell || !wrap || !tiltEngine) return;

    shell.classList.add('active', 'entering');
    wrap.classList.add('active');
    if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
    enterTimerRef.current = window.setTimeout(() => {
      shell.classList.remove('entering');
    }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);

    const { x, y } = getOffsets(event, shell);
    tiltEngine.setTarget(x, y);
  }, [tiltEngine]);

  const handlePointerLeave = useCallback(() => {
    const shell = shellRef.current;
    const wrap = wrapRef.current;
    if (!shell || !wrap || !tiltEngine) return;

    tiltEngine.toCenter();
    const checkSettle = () => {
      const { x, y, tx, ty } = tiltEngine.getCurrent();
      if (Math.hypot(tx - x, ty - y) < 0.6) {
        shell.classList.remove('active');
        wrap.classList.remove('active');
        leaveRafRef.current = null;
      } else {
        leaveRafRef.current = requestAnimationFrame(checkSettle);
      }
    };

    if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
    leaveRafRef.current = requestAnimationFrame(checkSettle);
  }, [tiltEngine]);

  const handleDeviceOrientation = useCallback((event) => {
    const shell = shellRef.current;
    if (!shell || !tiltEngine || event.beta == null || event.gamma == null) return;

    const centerX = shell.clientWidth / 2;
    const centerY = shell.clientHeight / 2;
    const x = clamp(centerX + event.gamma * mobileTiltSensitivity, 0, shell.clientWidth);
    const y = clamp(
      centerY + (event.beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * mobileTiltSensitivity,
      0,
      shell.clientHeight
    );
    tiltEngine.setTarget(x, y);
  }, [tiltEngine, mobileTiltSensitivity]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!enableTilt || !tiltEngine || !shell) return undefined;

    shell.addEventListener('pointerenter', handlePointerEnter);
    shell.addEventListener('pointermove', handlePointerMove);
    shell.addEventListener('pointerleave', handlePointerLeave);

    const handleClick = () => {
      if (!enableMobileTilt || window.location.protocol !== 'https:') return;
      const motionEvent = window.DeviceMotionEvent;
      if (motionEvent && typeof motionEvent.requestPermission === 'function') {
        motionEvent.requestPermission()
          .then((state) => {
            if (state === 'granted') {
              window.addEventListener('deviceorientation', handleDeviceOrientation);
            }
          })
          .catch(() => {});
      } else {
        window.addEventListener('deviceorientation', handleDeviceOrientation);
      }
    };

    shell.addEventListener('click', handleClick);
    tiltEngine.setImmediate(
      shell.clientWidth - ANIMATION_CONFIG.INITIAL_X_OFFSET,
      ANIMATION_CONFIG.INITIAL_Y_OFFSET
    );
    tiltEngine.toCenter();
    tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);

    return () => {
      shell.removeEventListener('pointerenter', handlePointerEnter);
      shell.removeEventListener('pointermove', handlePointerMove);
      shell.removeEventListener('pointerleave', handlePointerLeave);
      shell.removeEventListener('click', handleClick);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
      if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
      tiltEngine.cancel();
    };
  }, [
    enableTilt,
    enableMobileTilt,
    tiltEngine,
    handleDeviceOrientation,
    handlePointerEnter,
    handlePointerLeave,
    handlePointerMove
  ]);

  const cardStyle = useMemo(() => ({
    '--icon': iconUrl ? `url(${iconUrl})` : 'none',
    '--grain': grainUrl ? `url(${grainUrl})` : 'none',
    '--inner-gradient': innerGradient || DEFAULT_INNER_GRADIENT,
    '--behind-glow-color': behindGlowColor || 'rgba(125, 190, 255, 0.67)',
    '--behind-glow-size': behindGlowSize || '50%'
  }), [iconUrl, grainUrl, innerGradient, behindGlowColor, behindGlowSize]);

  return (
    <div ref={wrapRef} className={`pc-card-wrapper ${className}`.trim()} style={cardStyle}>
      {behindGlowEnabled && <div className="pc-behind" />}
      <div ref={shellRef} className="pc-card-shell">
        <section className="pc-card">
          <div className="pc-inside">
            <div className="pc-shine" />
            <div className="pc-glare" />
            <div className="pc-content pc-avatar-content">
              <img className="avatar" src={avatarUrl} alt={`${name} avatar`} />
              {showUserInfo && (
                <div className="pc-user-info">
                  <div className="pc-user-details">
                    <div className="pc-mini-avatar">
                      <img src={miniAvatarUrl || avatarUrl} alt="" />
                    </div>
                    <div className="pc-user-text">
                      <div className="pc-handle">@{handle}</div>
                      <div className="pc-status">{status}</div>
                    </div>
                  </div>
                  <button className="pc-contact-btn" onClick={onContactClick} type="button">
                    {contactText}
                  </button>
                </div>
              )}
            </div>
            <div className="pc-content pc-title-content">
              <div className="pc-details">
                <h3>{name}</h3>
                <p>{title}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const ProfileCard = React.memo(ProfileCardComponent);

export default ProfileCard;
