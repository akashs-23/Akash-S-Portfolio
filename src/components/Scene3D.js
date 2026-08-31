import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';

const STAGE_CENTER = new THREE.Vector2(-6.85, 3.69);
const STAGE_FRONT = new THREE.Vector2(-0.829, 0.56);
const STAGE_RIGHT = new THREE.Vector2(0.56, 0.829);
const STAGE_TREES = [
  [-9.4, 0.3, 0.07],
  [-9, 1.5, 0.055],
  [-6.6, 6.6, 0.065],
  [-6, 6.75, 0.055],
  [-4.8, 7.2, 0.06],
  [-3.8, 5.9, 0.075],
  [-3.6, 3.5, 0.055],
  [-4.5, 1.5, 0.065]
];

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

    // Keep only the rotated stage and audience footprint clear.
    const inStageZone = (x, z) => {
      const dx = x - STAGE_CENTER.x;
      const dz = z - STAGE_CENTER.y;
      const acrossStage = dx * STAGE_RIGHT.x + dz * STAGE_RIGHT.y;
      const inFrontOfStage = dx * STAGE_FRONT.x + dz * STAGE_FRONT.y;
      return Math.abs(acrossStage) < 2.35 && inFrontOfStage > -1.5 && inFrontOfStage < 4.4;
    };
    const inCyclistLane = (x, z) => {
      const distanceFromCenter = Math.hypot(x, z);
      return distanceFromCenter > 9.75 && distanceFromCenter < 13;
    };

    // Position 80 trees
    for (let i = 0; i < 80; i++) {
      const fixedTree = STAGE_TREES[i];
      if (fixedTree) {
        tempPosition.set(fixedTree[0], 0, fixedTree[1]);
      } else {
        sampler.sample(tempPosition);
        let tries = 0;
        while ((inStageZone(tempPosition.x, tempPosition.z) || inCyclistLane(tempPosition.x, tempPosition.z)) && tries < 30) {
          sampler.sample(tempPosition);
          tries++;
        }
      }
      dummy.position.set(tempPosition.x, tempPosition.y, tempPosition.z);
      dummy.rotation.set(Math.PI / 2, 0, fixedTree ? i * 0.73 : Math.random() * Math.PI);
      const scale = fixedTree ? fixedTree[2] : Math.random() * 0.05 + 0.04;
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
  const faceStage = Math.atan2(-STAGE_FRONT.x, -STAGE_FRONT.y);
  const crowdLayout = [
    { distance: 1.1, offset: -1.48, turn: -0.08, scale: 0.46 },
    { distance: 1.06, offset: -0.46, turn: 0.1, scale: 0.51 },
    { distance: 1.14, offset: 0.57, turn: -0.05, scale: 0.47 },
    { distance: 1.08, offset: 1.5, turn: 0.07, scale: 0.5 },
    { distance: 1.5, offset: -1.65, turn: 0.12, scale: 0.49 },
    { distance: 1.56, offset: -0.84, turn: -0.14, scale: 0.44 },
    { distance: 1.47, offset: 0.02, turn: 0.04, scale: 0.52 },
    { distance: 1.58, offset: 0.86, turn: 0.13, scale: 0.46 },
    { distance: 1.49, offset: 1.64, turn: -0.1, scale: 0.5 },
    { distance: 1.92, offset: -1.38, turn: -0.12, scale: 0.48 },
    { distance: 1.86, offset: -0.44, turn: 0.15, scale: 0.53 },
    { distance: 1.95, offset: 0.5, turn: -0.06, scale: 0.45 },
    { distance: 1.88, offset: 1.4, turn: 0.09, scale: 0.49 }
  ];
  const shirtColors = [0xe85d4a, 0xf2c14e, 0x2a9d8f, 0xf4f1de, 0x5c6ac4, 0xe76f51, 0x6a994e];
  const pantsColors = [0x243b53, 0x5b3a29, 0x2f4858, 0x393e46, 0x6b705c];
  const skinColors = [0x8d5524, 0xc68642, 0xe0ac69, 0xf1c27d, 0xffdbac];
  const people = crowdLayout.map(({ distance, offset, turn, scale }, index) => ({
      key: index,
      position: [
        STAGE_CENTER.x + STAGE_FRONT.x * distance + STAGE_RIGHT.x * offset,
        -0.01,
        STAGE_CENTER.y + STAGE_FRONT.y * distance + STAGE_RIGHT.y * offset
      ],
      rotation: [0, faceStage + turn, 0],
      scale,
      shirtColor: shirtColors[index % shirtColors.length],
      pantsColor: pantsColors[(index * 2) % pantsColors.length],
      skinColor: skinColors[(index * 3) % skinColors.length]
    }));

  return (
    <>
      {people.map(({ key, ...person }) => (
        <Person key={key} {...person} />
      ))}
    </>
  );
}

const Person = React.memo(function Person({ position, rotation, scale, shirtColor, pantsColor, skinColor }) {
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

    const pants = clonedScene.getObjectByName('pants');
    if (pants) {
      pants.traverse((node) => {
        if (node.isMesh) {
          node.material = node.material.clone();
          node.material.color.set(new THREE.Color(pantsColor));
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
  }, [clonedScene, shirtColor, pantsColor, skinColor]);

  return <primitive object={clonedScene} scale={[scale, scale, scale]} position={position} rotation={rotation} />;
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
        <AnimatedModel
          path="/models/shin-chan_and_shiro.glb"
          scale={[0.2, 0.2, 0.2]}
          position={[STAGE_CENTER.x + STAGE_FRONT.x * 0.18, 0.54, STAGE_CENTER.y + STAGE_FRONT.y * 0.18]}
          rotation={[0, Math.atan2(STAGE_RIGHT.x, STAGE_RIGHT.y), 0]}
        />
        <AnimatedModel path="/models/suraj-doremon.glb" scale={[0.30, 0.30, 0.30]} position={[8, 0, 7]} rotation={[0, Math.atan2(8, 7), 0]} />
        
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
