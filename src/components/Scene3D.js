import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';

// Car component
function Car() {
  const { scene } = useGLTF('/models/scooter.glb');
  const carRef = useRef();
  const i = useRef(0);

  useFrame(() => {
    if (carRef.current) {
      carRef.current.position.x = -Math.sin(i.current * Math.PI) * 11.8;
      carRef.current.position.z = -Math.cos(i.current * Math.PI) * 11.8;
      carRef.current.rotation.y = i.current * Math.PI + Math.PI/2;
      i.current -= 0.001;
    }
  });

  useEffect(() => {
    scene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
  }, [scene]);

  return <primitive ref={carRef} object={scene} scale={[0.32, 0.32, 0.32]} />;
}

// Cyclist component
function Cyclist({ azimuthalAngle, scrollSpeed }) {
  const { scene, animations } = useGLTF('/models/cyclist.glb');
  const { actions } = useAnimations(animations, scene);
  const cyclistRef = useRef();

  useEffect(() => {
    scene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    if (actions && animations[0]) {
      const action = actions[animations[0].name];
      if (action) {
        action.timeScale = 0;
        action.play();
      }
    }
  }, [scene, actions, animations]);

  useFrame(() => {
    if (cyclistRef.current) {
      cyclistRef.current.position.x = Math.sin(azimuthalAngle) * 11.4;
      cyclistRef.current.position.z = Math.cos(azimuthalAngle) * 11.4;
      cyclistRef.current.rotation.y = azimuthalAngle;
    }
    if (actions && animations[0]) {
      const action = actions[animations[0].name];
      if (action) {
        // Use smooth scrollSpeed with clamping to prevent jerky animation
        const smoothSpeed = Math.min(Math.abs(scrollSpeed) * 160, 2);
        action.timeScale = smoothSpeed;
      }
    }
  });

  return <primitive ref={cyclistRef} object={scene} scale={[0.33, 0.33, 0.33]} />;
}

// Other animated models
function AnimatedModel({ path, scale, position, rotation, animationSpeed = 1, animationIndex = 0 }) {
  const { scene, animations } = useGLTF(path);
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    scene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    if (actions && animations[animationIndex]) {
      const action = actions[animations[animationIndex].name];
      if (action) {
        action.timeScale = animationSpeed;
        action.play();
      }
    }
  }, [scene, actions, animations, animationSpeed, animationIndex]);

  return <primitive object={scene} scale={scale} position={position} rotation={rotation} />;
}

// Simple static model
function StaticModel({ path, scale, position, rotation }) {
  const { scene } = useGLTF(path);

  useEffect(() => {
    scene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
  }, [scene]);

  return <primitive object={scene} scale={scale} position={position} rotation={rotation} />;
}

// Mug with rotation
function Mug() {
  const { scene } = useGLTF('/models/mug.glb');
  const mugRef = useRef();

  useEffect(() => {
    scene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
  }, [scene]);

  useFrame(() => {
    if (mugRef.current) {
      mugRef.current.rotation.y -= 0.01;
    }
  });

  return <primitive ref={mugRef} object={scene} scale={[1, 1, 1]} position={[-6.5, 0, -8]} />;
}

// Flowers and Trees - OPTIMIZED with real InstancedMesh
function FlowersAndTrees() {
  const { scene: treelineScene } = useGLTF('/models/treeline.glb');
  const { scene: flowerScene } = useGLTF('/models/flower.glb');
  const { scene: treeScene } = useGLTF('/models/tree.glb');
  const blossomRef = useRef();
  const stemRef = useRef();
  const treeRef = useRef();

  // Change treeline color to blue (matching the image)
  useEffect(() => {
    if (treelineScene) {
      treelineScene.traverse((node) => {
        if (node.isMesh && node.material) {
          node.material = node.material.clone();
          node.material.color.set(new THREE.Color(0x5B7FDF)); // Blue color from image
        }
      });
    }
  }, [treelineScene]);

  useEffect(() => {
    if (!blossomRef.current || !stemRef.current || !treeRef.current) return;
    if (!treelineScene.children[0] || !flowerScene || !treeScene) return;

    const surface = treelineScene.children[0];
    if (!surface.geometry) return;

    const sampler = new MeshSurfaceSampler(surface).build();
    const tempPosition = new THREE.Vector3();
    const dummy = new THREE.Object3D();

    const blossomPalette = [0xBDD1FF, 0xD5E1FF, 0xEEF2FF];
    const treePalette = [0x2E7D32, 0x388E3C, 0x43A047]; // Green tree colors

    // Position 500 flowers
    for (let i = 0; i < 500; i++) {
      sampler.sample(tempPosition);
      dummy.position.set(tempPosition.x, tempPosition.y - 0.03, tempPosition.z);
      dummy.rotation.y = Math.random() * Math.PI * 2;
      const scale = Math.random() * 0.03 + 0.02;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      
      blossomRef.current.setMatrixAt(i, dummy.matrix);
      stemRef.current.setMatrixAt(i, dummy.matrix);
      
      const color = new THREE.Color(blossomPalette[Math.floor(Math.random() * blossomPalette.length)]);
      blossomRef.current.setColorAt(i, color);
      stemRef.current.setColorAt(i, color);
    }
    
    blossomRef.current.instanceMatrix.needsUpdate = true;
    stemRef.current.instanceMatrix.needsUpdate = true;
    if (blossomRef.current.instanceColor) blossomRef.current.instanceColor.needsUpdate = true;
    if (stemRef.current.instanceColor) stemRef.current.instanceColor.needsUpdate = true;

    // Keep the stage + audience area clear of trees so nothing overlaps them.
    const inStageZone = (x, z) => x > -9 && x < -2.5 && z > 1 && z < 8;

    // Position 80 trees
    for (let i = 0; i < 80; i++) {
      sampler.sample(tempPosition);
      let tries = 0;
      while (inStageZone(tempPosition.x, tempPosition.z) && tries < 30) {
        sampler.sample(tempPosition);
        tries++;
      }
      dummy.position.set(tempPosition.x, tempPosition.y, tempPosition.z);
      dummy.rotation.set(Math.PI / 2, 0, Math.random() * Math.PI);
      const scale = Math.random() * 0.05 + 0.04;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      
      treeRef.current.setMatrixAt(i, dummy.matrix);
      
      const color = new THREE.Color(treePalette[Math.floor(Math.random() * treePalette.length)]);
      treeRef.current.setColorAt(i, color);
    }
    
    treeRef.current.instanceMatrix.needsUpdate = true;
    if (treeRef.current.instanceColor) treeRef.current.instanceColor.needsUpdate = true;
  }, [treelineScene, flowerScene, treeScene]);

  const blossom = flowerScene.getObjectByName('Blossom');
  const stem = flowerScene.getObjectByName('Stem');
  const tree = treeScene.getObjectByName('tree');

  if (!blossom || !stem || !tree) return null;

  return (
    <>
      <primitive object={treelineScene} />
      
      {/* 500 Flower Blossoms in ONE InstancedMesh */}
      <instancedMesh ref={blossomRef} args={[blossom.geometry, null, 500]} castShadow receiveShadow>
        <meshLambertMaterial emissive={0xBDD1FF} emissiveIntensity={0.5} />
      </instancedMesh>

      {/* 500 Flower Stems in ONE InstancedMesh */}
      <instancedMesh ref={stemRef} args={[stem.geometry, null, 500]} castShadow receiveShadow>
        <meshLambertMaterial />
      </instancedMesh>

      {/* 80 Trees in ONE InstancedMesh */}
      <instancedMesh ref={treeRef} args={[tree.geometry, null, 80]} castShadow receiveShadow>
        <meshLambertMaterial />
      </instancedMesh>
    </>
  );
}

// Random people
function RandomPeople() {
  // Audience standing in front of the stage (stage platform ~x[-7.9,-5.4] z[2.2,4.9]),
  // arranged in two tidy rows on the +x side, all facing back toward the stage (-x).
  // Stage backdrop sits at the back (z~2.5-4.1) and the structure (truss + speakers)
  // reaches z~5.8, so the crowd stands beyond that (z>=6.2) facing the stage (-z).
  const FACE_STAGE = Math.PI; // man.glb faces -z (toward the stage)
  // Tight 2x4 audience block, centred on the stage centre (x=-6.65), close to the stage
  // (just clear of the structure at z~5.8), all facing the stage (-z).
  const people = [
    { key: 0, position: [-5.6, -0.01, 6.1], rotation: [0, FACE_STAGE, 0], shirtColor: 0xFA6D6D, skinColor: 0x8d5524 },
    { key: 1, position: [-6.3, -0.01, 6.1], rotation: [0, FACE_STAGE, 0], shirtColor: 0xffffff, skinColor: 0xc68642 },
    { key: 2, position: [-7.0, -0.01, 6.1], rotation: [0, FACE_STAGE, 0], shirtColor: 0xFA6D6D, skinColor: 0xe0ac69 },
    { key: 3, position: [-7.7, -0.01, 6.1], rotation: [0, FACE_STAGE, 0], shirtColor: 0xffffff, skinColor: 0xf1c27d },
    { key: 4, position: [-5.6, -0.01, 6.8], rotation: [0, FACE_STAGE, 0], shirtColor: 0xFA6D6D, skinColor: 0xffdbac },
    { key: 5, position: [-6.3, -0.01, 6.8], rotation: [0, FACE_STAGE, 0], shirtColor: 0xffffff, skinColor: 0x8d5524 },
    { key: 6, position: [-7.0, -0.01, 6.8], rotation: [0, FACE_STAGE, 0], shirtColor: 0xFA6D6D, skinColor: 0xc68642 },
    { key: 7, position: [-7.7, -0.01, 6.8], rotation: [0, FACE_STAGE, 0], shirtColor: 0xffffff, skinColor: 0xe0ac69 }
  ];

  return (
    <>
      {people.map(({ key, ...person }) => (
        <Person key={key} {...person} />
      ))}
    </>
  );
}

const Person = React.memo(function Person({ position, rotation, shirtColor, skinColor }) {
  const { scene } = useGLTF('/models/man.glb');
  const clonedScene = React.useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    clonedScene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    const shirt = clonedScene.getObjectByName('shirt');
    if (shirt) {
      shirt.traverse((node) => {
        if (node.isMesh) {
          node.material = node.material.clone();
          node.material.color.set(new THREE.Color(shirtColor));
        }
      });
    }

    const body = clonedScene.getObjectByName('body');
    if (body) {
      body.traverse((node) => {
        if (node.isMesh) {
          node.material = node.material.clone();
          node.material.color.set(new THREE.Color(skinColor));
        }
      });
    }
  }, [clonedScene, shirtColor, skinColor]);

  return <primitive object={clonedScene} scale={[0.49, 0.49, 0.49]} position={position} rotation={rotation} />;
});

// Scene Controller
function SceneController({ darkMode, started, setLoadingProgress, onAzimuthChange, onScrollSpeedChange }) {
  const { camera, scene } = useThree();
  const controlsRef = useRef();
  const spotLightRef = useRef();
  const spotLightTargetRef = useRef();
  const sunLightRef = useRef();
  const [instructionsHidden, setInstructionsHidden] = useState(false);
  const lastPos = useRef(null);
  const smoothScrollSpeed = useRef(0);

  useEffect(() => {
    // Create spotlight target and add to scene
    if (!spotLightTargetRef.current) {
      spotLightTargetRef.current = new THREE.Object3D();
      scene.add(spotLightTargetRef.current);
    }
    
    // Link spotlight to target
    if (spotLightRef.current && spotLightTargetRef.current) {
      spotLightRef.current.target = spotLightTargetRef.current;
    }
    
    // Set directional light target to center
    if (sunLightRef.current) {
      sunLightRef.current.target.position.set(0, 0, 0);
      sunLightRef.current.target.updateMatrixWorld();
    }
  }, [scene]);

  useEffect(() => {
    if (started) {
      new TWEEN.Tween(camera.position)
        .to({ x: 0, y: 3, z: 16 }, 1000)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();
    }
  }, [started, camera]);

  useFrame(() => {
    TWEEN.update();
    
    if (controlsRef.current) {
      const azimuthalAngle = controlsRef.current.getAzimuthalAngle();
      onAzimuthChange(azimuthalAngle);

      // Update spotlight position to follow camera rotation in dark mode
      if (darkMode && spotLightRef.current && spotLightTargetRef.current) {
        spotLightRef.current.position.x = Math.sin(azimuthalAngle) * 12.4;
        spotLightRef.current.position.z = Math.cos(azimuthalAngle) * 12.4;
        spotLightTargetRef.current.position.x = Math.sin(azimuthalAngle) * 9;
        spotLightTargetRef.current.position.z = Math.cos(azimuthalAngle) * 9;
      }

      // Calculate cycle position
      let cyclePos = azimuthalAngle / (Math.PI * 2);
      if (cyclePos < 0) {
        cyclePos = 0.5 + (0.5 + cyclePos);
      }
      if (window.updateCyclePos) {
        window.updateCyclePos(cyclePos);
      }

      // Calculate scroll speed with smoothing
      const newPos = azimuthalAngle;
      let delta = 0;
      if (lastPos.current != null) {
        delta = newPos - lastPos.current;
        // Handle wrapping at 2PI boundary
        if (delta > Math.PI) delta -= Math.PI * 2;
        if (delta < -Math.PI) delta += Math.PI * 2;
      }
      lastPos.current = newPos;
      
      // Smooth the scroll speed with lerp for buttery smooth animation
      const targetSpeed = Math.abs(delta);
      smoothScrollSpeed.current += (targetSpeed - smoothScrollSpeed.current) * 0.1;
      onScrollSpeedChange(smoothScrollSpeed.current);

      // Hide instructions
      if ((azimuthalAngle >= 0.1 || azimuthalAngle < -0.1) && !instructionsHidden) {
        setInstructionsHidden(true);
        if (window.hideExploreInstructions) {
          window.hideExploreInstructions();
        }
      }
    }
  });

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        minPolarAngle={Math.PI / 2.4}
        maxPolarAngle={Math.PI / 2.15}
        minDistance={16}
        maxDistance={30}
        enableDamping={true}
        dampingFactor={0.05}
        rotateSpeed={0.25}
        target={[0, 0, 0]}
      />
      
      {/* Lights */}
      <hemisphereLight
        color={new THREE.Color().setHSL(0.6, 1, 0.6)}
        groundColor={new THREE.Color().setHSL(0.095, 1, 0.75)}
        intensity={darkMode ? 0.01 : 0.6}
        position={[0, 500, 0]}
      />
      
      {/* Directional Light for Day Mode */}
      <directionalLight
        ref={sunLightRef}
        visible={!darkMode}
        castShadow={!darkMode}
        position={[0, 12, 12]}
        intensity={1}
        color={new THREE.Color().setHSL(0.1, 1, 0.95)}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={26}
        shadow-camera-top={13}
        shadow-camera-bottom={-13}
        shadow-camera-left={-13}
        shadow-camera-right={13}
        shadow-normalBias={0.02}
      />
      
      {/* Spotlight for Night Mode - follows camera */}
      <spotLight
        ref={spotLightRef}
        visible={darkMode}
        castShadow={darkMode}
        position={[0, 3.5, 0]}
        intensity={6}
        distance={8}
        angle={Math.PI / 3.5}
        penumbra={0.8}
        decay={1}
        color={0xffffff}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={2}
        shadow-normalBias={0.02}
      />
    </>
  );
}

// Main Scene3D Component
function Scene3D({ darkMode, started, setLoadingProgress }) {
  const [azimuthalAngle, setAzimuthalAngle] = useState(0);
  const [scrollSpeed, setScrollSpeed] = useState(0);

  const { progress } = useProgress();

  useEffect(() => {
    setLoadingProgress(progress);
  }, [progress, setLoadingProgress]);

  const bgGradient = darkMode 
    ? 'linear-gradient(0deg, hsl(220, 50%,20%) 50%, hsl(220,80%,5%) 100%)'
    : 'linear-gradient(0deg, hsl(210, 70%,65%) 50%, hsl(214,80%,70%) 100%)'; // Blue sea gradient

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: bgGradient,
      cursor: 'grab'
    }}>
      <Canvas
        camera={{ position: [0, 30, 30], fov: 64, near: 1, far: 90 }}
        shadows={{ type: THREE.VSMShadowMap }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
          outputColorSpace: THREE.SRGBColorSpace
        }}
        performance={{ min: 0.5 }}
        dpr={[1, 2]}
        frameloop="always"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          outline: 'none'
        }}
      >
        <SceneController 
          darkMode={darkMode} 
          started={started}
          setLoadingProgress={setLoadingProgress}
          onAzimuthChange={setAzimuthalAngle}
          onScrollSpeedChange={setScrollSpeed}
        />
        
        <StaticModel path="/models/island.glb" scale={[1, 1, 1]} position={[0, 0, 0]} />
        <Car />
        <Mug />
        <AnimatedModel path="/models/joshua.glb" scale={[1, 1, 1]} position={[-3.5, 0, 10]} rotation={[0, 0, 0]} />
        <AnimatedModel path="/models/clapper.glb" scale={[1.4, 1.4, 1.4]} position={[9.5, 0, -1]} rotation={[0, Math.PI/8, 0]} />
        <Cyclist azimuthalAngle={azimuthalAngle} scrollSpeed={scrollSpeed} />
        <AnimatedModel path="/models/stag.glb" scale={[0.2, 0.2, 0.2]} position={[6, 0, -7]} rotation={[0, Math.PI/2, 0]} />
        <AnimatedModel path="/models/robo.glb" scale={[0.5, 0.5, 0.5]} position={[0, 0, -9.5]} rotation={[0, -Math.PI, 0]} animationIndex={14} />
        
        {/* Anime Characters - smaller and positioned forward */}
        <AnimatedModel path="/models/shin-chan_and_shiro.glb" scale={[0.2, 0.2, 0.2]} position={[-6.65, 0.54, 4.3]} rotation={[0, Math.PI, 0]} />
        <AnimatedModel path="/models/suraj-doremon.glb" scale={[0.30, 0.30, 0.30]} position={[8, 0, 7]} rotation={[0, -Math.PI/4, 0]} />
        
        <FlowersAndTrees />
        <RandomPeople />
      </Canvas>
    </div>
  );
}

export default Scene3D;

// Preload models
useGLTF.preload('/models/island.glb');
useGLTF.preload('/models/scooter.glb');
useGLTF.preload('/models/mug.glb');
useGLTF.preload('/models/joshua.glb');
useGLTF.preload('/models/clapper.glb');
useGLTF.preload('/models/cyclist.glb');
useGLTF.preload('/models/stag.glb');
useGLTF.preload('/models/robo.glb');
useGLTF.preload('/models/shin-chan_and_shiro.glb');
useGLTF.preload('/models/suraj-doremon.glb');
useGLTF.preload('/models/man.glb');
useGLTF.preload('/models/tree.glb');
useGLTF.preload('/models/flower.glb');
useGLTF.preload('/models/treeline.glb');
