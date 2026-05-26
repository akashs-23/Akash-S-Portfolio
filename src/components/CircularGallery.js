import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';
import { useCallback, useEffect, useRef, useState } from 'react';
import './CircularGallery.css';

function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function createTextTexture(gl, text, font, color) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = font;
  const metrics = context.measureText(text);
  const fontSize = parseInt(font, 10) || 30;
  canvas.width = Math.ceil(metrics.width) + 28;
  canvas.height = Math.ceil(fontSize * 1.4) + 16;
  context.font = font;
  context.fillStyle = color;
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

class Title {
  constructor({ gl, plane, text, textColor, font }) {
    const { texture, width, height } = createTextTexture(gl, text, font, textColor);
    const geometry = new Plane(gl);
    const program = new Program(gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true
    });
    this.mesh = new Mesh(gl, { geometry, program });
    const textHeight = plane.scale.y * 0.13;
    this.mesh.scale.set(textHeight * (width / height), textHeight, 1);
    this.mesh.position.y = -plane.scale.y * 0.5 - textHeight * 0.65;
    this.mesh.setParent(plane);
  }
}

class Media {
  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius,
    font
  }) {
    this.extra = 0;
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.createShader();
    this.createMesh();
    this.onResize();
    this.createTitle();
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: true });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) + cos(p.y * 2.0 + uTime)) * (0.08 + uSpeed * 0.35);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }

        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          float alpha = 1.0 - smoothstep(-0.002, 0.002, d);
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [1, 1] },
        uSpeed: { value: 0 },
        uTime: { value: Math.random() * 100 },
        uBorderRadius: { value: this.borderRadius }
      },
      transparent: true
    });

    const image = new Image();
    image.src = this.image;
    image.onload = () => {
      texture.image = image;
      this.program.uniforms.uImageSizes.value = [image.naturalWidth, image.naturalHeight];
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    });
    this.plane.setParent(this.scene);
  }

  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      text: this.text,
      textColor: this.textColor,
      font: this.font
    });
  }

  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra;
    const x = this.plane.position.x;
    const halfViewport = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const absoluteBend = Math.abs(this.bend);
      const radius = (halfViewport * halfViewport + absoluteBend * absoluteBend) / (2 * absoluteBend);
      const effectiveX = Math.min(Math.abs(x), halfViewport);
      const arc = radius - Math.sqrt(radius * radius - effectiveX * effectiveX);
      this.plane.position.y = this.bend > 0 ? -arc : arc;
      this.plane.rotation.z = (this.bend > 0 ? -1 : 1) * Math.sign(x) * Math.asin(effectiveX / radius);
    }

    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = scroll.current - scroll.last;
    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    const isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    const isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === 'right' && isBefore) this.extra -= this.widthTotal;
    if (direction === 'left' && isAfter) this.extra += this.widthTotal;
  }

  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) this.viewport = viewport;
    const scale = this.screen.height / 1500;
    this.plane.scale.y = (this.viewport.height * (900 * scale)) / this.screen.height;
    this.plane.scale.x = (this.viewport.width * (700 * scale)) / this.screen.width;
    this.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.width = this.plane.scale.x + 2;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

class GalleryApp {
  constructor(container, {
    items,
    bend,
    textColor,
    borderRadius,
    font,
    scrollSpeed,
    scrollEase
  }) {
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0, position: 0 };
    this.onCheckDebounce = debounce(() => this.onCheck(), 180);
    this.createRenderer();
    this.createCamera();
    this.scene = new Transform();
    this.onResize();
    this.geometry = new Plane(this.gl, { heightSegments: 40, widthSegments: 80 });
    this.createMedias(items, bend, textColor, borderRadius, font);
    this.addEventListeners();
    this.update();
  }

  createRenderer() {
    this.renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio || 1, 2) });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createMedias(items, bend, textColor, borderRadius, font) {
    const doubledItems = items.concat(items);
    this.medias = doubledItems.map((item, index) => new Media({
      geometry: this.geometry,
      gl: this.gl,
      image: item.image,
      index,
      length: doubledItems.length,
      scene: this.scene,
      screen: this.screen,
      text: item.text,
      viewport: this.viewport,
      bend,
      textColor,
      borderRadius,
      font
    }));
  }

  onPointerDown = (event) => {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = event.clientX;
    this.container.setPointerCapture?.(event.pointerId);
  };

  onPointerMove = (event) => {
    if (!this.isDown) return;
    const distance = (this.start - event.clientX) * (this.scrollSpeed * 0.025);
    this.scroll.target = this.scroll.position + distance;
  };

  onPointerUp = () => {
    this.isDown = false;
    this.onCheck();
  };

  onWheel = (event) => {
    this.scroll.target += (event.deltaY > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.onCheckDebounce();
  };

  onCheck() {
    const width = this.medias?.[0]?.width;
    if (!width) return;
    const item = width * Math.round(Math.abs(this.scroll.target) / width);
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }

  onResize = () => {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.screen.width / this.screen.height });
    const fieldOfView = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fieldOfView / 2) * this.camera.position.z;
    this.viewport = { width: height * this.camera.aspect, height };
    this.medias?.forEach((media) => media.onResize({ screen: this.screen, viewport: this.viewport }));
  };

  update = () => {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
    this.medias.forEach((media) => media.update(this.scroll, direction));
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update);
  };

  addEventListeners() {
    window.addEventListener('resize', this.onResize);
    this.container.addEventListener('wheel', this.onWheel);
    this.container.addEventListener('pointerdown', this.onPointerDown);
    this.container.addEventListener('pointermove', this.onPointerMove);
    this.container.addEventListener('pointerup', this.onPointerUp);
    this.container.addEventListener('pointercancel', this.onPointerUp);
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.onResize);
    this.container.removeEventListener('wheel', this.onWheel);
    this.container.removeEventListener('pointerdown', this.onPointerDown);
    this.container.removeEventListener('pointermove', this.onPointerMove);
    this.container.removeEventListener('pointerup', this.onPointerUp);
    this.container.removeEventListener('pointercancel', this.onPointerUp);
    this.gl.canvas.remove();
  }
}

function MediaCircularGallery({
  items = [],
  bend = 3,
  textColor = '#ffffff',
  borderRadius = 0.05,
  font = 'bold 30px Space Grotesk',
  scrollSpeed = 2,
  scrollEase = 0.05
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !items.length) return undefined;
    const app = new GalleryApp(containerRef.current, {
      items,
      bend,
      textColor,
      borderRadius,
      font,
      scrollSpeed,
      scrollEase
    });
    return () => app.destroy();
  }, [items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase]);

  return <div className="circular-gallery" ref={containerRef} />;
}

function getCircularOffset(index, activeIndex, length) {
  let offset = index - activeIndex;
  const boundary = Math.ceil(length / 2);

  if (offset >= boundary) offset -= length;
  if (offset < -Math.floor(length / 2)) offset += length;
  return offset;
}

function ProjectCardGallery({ items, scrollSpeed }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerStartRef = useRef(null);
  const hasDraggedRef = useRef(false);
  const suppressClickRef = useRef(false);
  const wheelTimerRef = useRef(null);
  const length = items.length;

  const changeSlide = useCallback((direction) => {
    if (!length) return;
    setActiveIndex((current) => (current + direction + length) % length);
  }, [length]);

  useEffect(() => () => {
    if (wheelTimerRef.current) window.clearTimeout(wheelTimerRef.current);
  }, []);

  const handlePointerDown = (event) => {
    pointerStartRef.current = event.clientX;
    hasDraggedRef.current = false;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (pointerStartRef.current === null) return;
    hasDraggedRef.current = Math.abs(event.clientX - pointerStartRef.current) > 8;
  };

  const handlePointerUp = (event) => {
    if (pointerStartRef.current === null) return;
    const distance = event.clientX - pointerStartRef.current;
    pointerStartRef.current = null;
    if (Math.abs(distance) < 44) return;
    suppressClickRef.current = true;
    changeSlide(distance < 0 ? 1 : -1);
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
  };

  const handleWheel = (event) => {
    if (wheelTimerRef.current || Math.abs(event.deltaY) < 4) return;
    changeSlide(event.deltaY > 0 ? 1 : -1);
    wheelTimerRef.current = window.setTimeout(() => {
      wheelTimerRef.current = null;
    }, Math.max(220, 480 / scrollSpeed));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      changeSlide(-1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      changeSlide(1);
    }
  };

  const preventDraggedClick = (event) => {
    if (suppressClickRef.current || hasDraggedRef.current) {
      event.preventDefault();
      hasDraggedRef.current = false;
    }
  };

  return (
    <div
      className="circular-gallery circular-gallery--cards"
      role="region"
      tabIndex={0}
      aria-label="Featured project gallery. Drag, scroll, or use arrow keys to browse."
      onWheel={handleWheel}
      onKeyDown={handleKeyDown}
    >
      <div
        className="circular-card-stage"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {items.map((item, index) => {
          const offset = getCircularOffset(index, activeIndex, length);
          const distance = Math.abs(offset);
          const isActive = index === activeIndex;

          return (
            <a
              key={item.title}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`circular-project-card${isActive ? ' is-active' : ''}`}
              style={{ '--offset': offset, '--distance': distance, '--accent': item.accent, zIndex: length - distance }}
              aria-hidden={!isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={preventDraggedClick}
              draggable={false}
            >
              <span className="circular-project-top">
                <span className="circular-project-index">0{index + 1}</span>
                <span className="circular-project-live"><span aria-hidden="true"></span>Live</span>
              </span>
              <strong className="circular-project-title">{item.title}</strong>
              <span className="circular-project-description">{item.description}</span>
              <span className="circular-project-detail">{item.detail}</span>
              <span className="circular-project-stack" aria-label={`${item.title} technology stack`}>
                {item.tech.map((technology) => (
                  <span key={technology}>{technology}</span>
                ))}
              </span>
              <span className="circular-project-action">
                View live project <i className="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>
              </span>
            </a>
          );
        })}
      </div>
      <div className="circular-card-controls">
        <button type="button" onClick={() => changeSlide(-1)} aria-label="Previous project">
          <i className="fas fa-arrow-left" aria-hidden="true"></i>
        </button>
        <span className="circular-card-hint">Drag or scroll to explore</span>
        <span className="circular-card-dots" aria-label={`Project ${activeIndex + 1} of ${length}`}>
          {items.map((item, index) => (
            <button
              key={item.title}
              className={index === activeIndex ? 'active' : ''}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View ${item.title}`}
            ></button>
          ))}
        </span>
        <button type="button" onClick={() => changeSlide(1)} aria-label="Next project">
          <i className="fas fa-arrow-right" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  );
}

export default function CircularGallery({ cardMode = false, items = [], ...props }) {
  if (cardMode) {
    return <ProjectCardGallery items={items} scrollSpeed={props.scrollSpeed ?? 2} />;
  }

  return <MediaCircularGallery items={items} {...props} />;
}
