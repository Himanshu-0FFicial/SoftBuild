'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, Layers, Palette, Sparkles } from 'lucide-react';

interface PCModelCanvasProps {
  initialColor?: 'Obsidian Black' | 'Ceramic White' | 'Gunmetal Grey';
  initialRgb?: 'Cyan' | 'Amber' | 'Violet' | 'Ice' | 'Off';
  showControls?: boolean;
  className?: string;
  autoRotateSpeed?: number;
}

export const PCModelCanvas: React.FC<PCModelCanvasProps> = ({
  initialColor = 'Obsidian Black',
  initialRgb = 'Cyan',
  showControls = true,
  className = '',
  autoRotateSpeed = 0.005,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [caseColor, setCaseColor] = useState(initialColor);
  const [rgbLighting, setRgbLighting] = useState(initialRgb);
  const [explodedView, setExplodedView] = useState(false);
  const [glassRemoved, setGlassRemoved] = useState(false);

  // References for three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const partsGroupRef = useRef<THREE.Group | null>(null);
  const glassPanelRef = useRef<THREE.Mesh | null>(null);
  const gpuMeshRef = useRef<THREE.Mesh | null>(null);
  const coolerMeshRef = useRef<THREE.Mesh | null>(null);
  const rgbLightsRef = useRef<THREE.PointLight[]>([]);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 500;
    const height = mountRef.current.clientHeight || 450;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4, 3, 5);
    camera.lookAt(0, 0, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const rimLight1 = new THREE.DirectionalLight(0x00e5ff, 2.0);
    rimLight1.position.set(-5, 6, -3);
    scene.add(rimLight1);

    const rimLight2 = new THREE.DirectionalLight(0xffffff, 1.5);
    rimLight2.position.set(5, 5, 5);
    scene.add(rimLight2);

    // Internal RGB Point Lights
    const rgbLight1 = new THREE.PointLight(0x00e5ff, 3.5, 6);
    rgbLight1.position.set(0, 0.8, 0.5);
    scene.add(rgbLight1);

    const rgbLight2 = new THREE.PointLight(0x00e5ff, 2.5, 5);
    rgbLight2.position.set(0, -0.6, 0.8);
    scene.add(rgbLight2);

    rgbLightsRef.current = [rgbLight1, rgbLight2];

    // 5. Construct PC Geometry
    const partsGroup = new THREE.Group();
    partsGroupRef.current = partsGroup;

    // Outer Main Chassis Body
    const chassisGeo = new THREE.BoxGeometry(2.2, 3.2, 3.8);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x121418,
      roughness: 0.25,
      metalness: 0.8,
    });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    partsGroup.add(chassis);

    // Inside Interior Cavity
    const innerGeo = new THREE.BoxGeometry(2.05, 3.05, 3.65);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x08090b,
      roughness: 0.6,
      metalness: 0.4,
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    partsGroup.add(inner);

    // Motherboard Backplate
    const mbGeo = new THREE.BoxGeometry(0.1, 2.4, 2.4);
    const mbMat = new THREE.MeshStandardMaterial({
      color: 0x1a1e24,
      roughness: 0.3,
      metalness: 0.9,
    });
    const mb = new THREE.Mesh(mbGeo, mbMat);
    mb.position.set(-0.9, 0.1, 0);
    partsGroup.add(mb);

    // GPU (Flagship triple-fan graphics card)
    const gpuGeo = new THREE.BoxGeometry(0.7, 0.9, 2.6);
    const gpuMat = new THREE.MeshStandardMaterial({
      color: 0x22262e,
      roughness: 0.2,
      metalness: 0.85,
    });
    const gpu = new THREE.Mesh(gpuGeo, gpuMat);
    gpu.position.set(-0.3, -0.5, 0.2);
    partsGroup.add(gpu);
    gpuMeshRef.current = gpu;

    // GPU RGB Lightbar
    const gpuLedGeo = new THREE.BoxGeometry(0.08, 0.08, 2.4);
    const gpuLedMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
    const gpuLed = new THREE.Mesh(gpuLedGeo, gpuLedMat);
    gpuLed.position.set(0.06, -0.1, 0.2);
    partsGroup.add(gpuLed);

    // CPU Liquid Cooler Pump Block with circular LCD
    const pumpGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.25, 32);
    const pumpMat = new THREE.MeshStandardMaterial({ color: 0x111317, metalness: 0.9 });
    const pump = new THREE.Mesh(pumpGeo, pumpMat);
    pump.rotation.z = Math.PI / 2;
    pump.position.set(-0.7, 0.6, 0);
    partsGroup.add(pump);
    coolerMeshRef.current = pump;

    // Pump LCD Screen Glow
    const lcdGeo = new THREE.CircleGeometry(0.32, 32);
    const lcdMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
    const lcd = new THREE.Mesh(lcdGeo, lcdMat);
    lcd.rotation.y = Math.PI / 2;
    lcd.position.set(-0.55, 0.6, 0);
    partsGroup.add(lcd);

    // Radiator and Top Fans
    const radGeo = new THREE.BoxGeometry(1.6, 0.3, 3.2);
    const radMat = new THREE.MeshStandardMaterial({ color: 0x1e2229, metalness: 0.7 });
    const rad = new THREE.Mesh(radGeo, radMat);
    rad.position.set(0, 1.4, 0);
    partsGroup.add(rad);

    // Tempered Glass Side Panel
    const glassGeo = new THREE.BoxGeometry(0.06, 3.1, 3.7);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x111111,
      transparent: true,
      opacity: 0.35,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.85,
      ior: 1.5,
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(1.1, 0, 0);
    partsGroup.add(glass);
    glassPanelRef.current = glass;

    scene.add(partsGroup);

    // Interactive mouse drag to rotate
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const domElement = renderer.domElement;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !partsGroupRef.current) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      partsGroupRef.current.rotation.y += deltaX * 0.008;
      partsGroupRef.current.rotation.x += deltaY * 0.008;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (partsGroupRef.current && !isDragging) {
        partsGroupRef.current.rotation.y += autoRotateSpeed;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current) return;
      const newW = mountRef.current.clientWidth;
      const newH = mountRef.current.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [autoRotateSpeed]);

  // React to RGB lighting changes
  useEffect(() => {
    let hex = 0x00e5ff;
    if (rgbLighting === 'Amber') hex = 0xffb300;
    if (rgbLighting === 'Violet') hex = 0xc084fc;
    if (rgbLighting === 'Ice') hex = 0xe0f2fe;
    if (rgbLighting === 'Off') hex = 0x000000;

    rgbLightsRef.current.forEach((light) => {
      light.color.setHex(hex);
      light.intensity = rgbLighting === 'Off' ? 0 : 3.5;
    });
  }, [rgbLighting]);

  // React to exploded view toggle
  useEffect(() => {
    if (!gpuMeshRef.current || !coolerMeshRef.current || !glassPanelRef.current) return;

    if (explodedView) {
      gpuMeshRef.current.position.set(0.6, -0.5, 0.8);
      coolerMeshRef.current.position.set(-0.7, 0.6, 0.8);
      glassPanelRef.current.position.set(2.2, 0, 0);
    } else {
      gpuMeshRef.current.position.set(-0.3, -0.5, 0.2);
      coolerMeshRef.current.position.set(-0.7, 0.6, 0);
      glassPanelRef.current.position.set(1.1, 0, 0);
    }
  }, [explodedView]);

  // React to Glass Removed toggle
  useEffect(() => {
    if (glassPanelRef.current) {
      glassPanelRef.current.visible = !glassRemoved;
    }
  }, [glassRemoved]);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-80 sm:h-[420px] cursor-grab active:cursor-grabbing relative" />

      {/* Floating Interactive Controls */}
      {showControls && (
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-xs">
          {/* Chassis Finish */}
          <div className="flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-400 font-medium">Chassis:</span>
            {(['Obsidian Black', 'Ceramic White', 'Gunmetal Grey'] as const).map((col) => (
              <button
                key={col}
                onClick={() => setCaseColor(col)}
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                  caseColor === col
                    ? 'bg-white text-black font-bold'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {col.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* RGB Illumination */}
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-gray-400 font-medium">RGB:</span>
            {(['Cyan', 'Amber', 'Violet', 'Ice', 'Off'] as const).map((rgb) => (
              <button
                key={rgb}
                onClick={() => setRgbLighting(rgb)}
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                  rgbLighting === rgb
                    ? 'bg-cyan-400 text-black font-bold shadow-[0_0_10px_rgba(0,229,255,0.5)]'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {rgb}
              </button>
            ))}
          </div>

          {/* Exploded & Glass Toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExplodedView(!explodedView)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                explodedView
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                  : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/20'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>{explodedView ? 'Collapse View' : 'Exploded View'}</span>
            </button>

            <button
              onClick={() => setGlassRemoved(!glassRemoved)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                glassRemoved
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                  : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/20'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>{glassRemoved ? 'Glass Off' : 'Glass On'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
