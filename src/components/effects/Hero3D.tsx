"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function Hero3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.012);

    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Silver torus (main ring)
    const torusGeo = new THREE.TorusGeometry(1.9, 0.06, 48, 128);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0xbbbbbb,
      metalness: 1,
      roughness: 0.25,
      emissive: 0x333333,
      emissiveIntensity: 0.15,
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.rotation.x = Math.PI / 2.4;
    scene.add(torus);

    // Inner second ring
    const torus2Geo = new THREE.TorusGeometry(1.45, 0.035, 32, 96);
    const torus2Mat = new THREE.MeshStandardMaterial({
      color: 0x999999,
      metalness: 1,
      roughness: 0.4,
      transparent: true,
      opacity: 0.7,
    });
    const torus2 = new THREE.Mesh(torus2Geo, torus2Mat);
    torus2.rotation.x = Math.PI / 2.4;
    torus2.rotation.y = 0.6;
    scene.add(torus2);

    // Orbiting sphere
    const sphereGeo = new THREE.SphereGeometry(0.18, 32, 32);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      metalness: 1,
      roughness: 0.1,
      emissive: 0x999999,
      emissiveIntensity: 0.6,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    // Second orbiting sphere
    const sphere2Geo = new THREE.SphereGeometry(0.1, 24, 24);
    const sphere2Mat = new THREE.MeshStandardMaterial({
      color: 0xaaaaaa,
      metalness: 1,
      roughness: 0.2,
      emissive: 0x666666,
      emissiveIntensity: 0.5,
    });
    const sphere2 = new THREE.Mesh(sphere2Geo, sphere2Mat);
    scene.add(sphere2);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x999999, 1.2);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    const pointLight = new THREE.PointLight(0x999999, 6, 20);
    pointLight.position.set(0, 2, 3);
    scene.add(pointLight);

    // Mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Resize
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // Animation loop
    const clock = new THREE.Clock();
    let raf = 0;
    const animate = () => {
      const t = clock.getElapsedTime();
      torus.rotation.y = t * 0.25;
      torus2.rotation.y = -t * 0.4;
      torus2.rotation.x = Math.PI / 2.4 + Math.sin(t * 0.3) * 0.1;

      sphere.position.set(
        Math.cos(t * 0.7) * 2.05,
        Math.sin(t * 0.9) * 0.6,
        Math.sin(t * 0.7) * 0.4
      );
      sphere2.position.set(
        Math.cos(t * 0.5 + 2) * 1.55,
        Math.sin(t * 0.6 + 1) * 0.4,
        Math.sin(t * 0.5 + 2) * 0.3
      );

      camera.position.x += (mouseX * 0.6 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 0.4 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      torusGeo.dispose();
      torusMat.dispose();
      torus2Geo.dispose();
      torus2Mat.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      sphere2Geo.dispose();
      sphere2Mat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className="pointer-events-none absolute right-[-80px] top-[6%] z-0 hidden h-[440px] w-[440px] lg:block xl:right-[-40px]"
    />
  );
}