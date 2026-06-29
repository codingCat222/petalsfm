// src/pages/About.jsx

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import './About.css';
import PageHeader from '../components/common/PageHeader';

export default function About() {
  const canvasRef = useRef(null);
  const [counters, setCounters] = useState({
    frequency: 0,
    broadcasting: 0,
    rank: 0,
    listeners: 0
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef(null);
  
  // Three.js Background - ONLY for hero
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true,
      antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const colors = {
      primary: new THREE.Color('#ff0040'),
      secondary: new THREE.Color('#0a1628'),
      accent: new THREE.Color('#ff6b6b'),
      navy: new THREE.Color('#0d2252')
    };
    
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20;
      const color = Math.random() > 0.7 ? colors.primary : colors.navy;
      colorArray[i] = color.r;
      colorArray[i+1] = color.g;
      colorArray[i+2] = color.b;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.04,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    const shapes = [];
    const geometries = [
      new THREE.SphereGeometry(0.2, 16, 16),
      new THREE.TorusGeometry(0.2, 0.08, 16, 32),
      new THREE.OctahedronGeometry(0.2),
      new THREE.TorusKnotGeometry(0.15, 0.06, 64, 8),
      new THREE.IcosahedronGeometry(0.2)
    ];
    
    for (let i = 0; i < 15; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshStandardMaterial({
        color: i % 3 === 0 ? colors.primary : colors.accent,
        wireframe: Math.random() > 0.5,
        transparent: true,
        opacity: 0.2 + Math.random() * 0.3,
        metalness: 0.3,
        roughness: 0.7,
        emissive: i % 3 === 0 ? colors.primary : colors.accent,
        emissiveIntensity: 0.1
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10 - 5
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      mesh.userData = {
        speed: 0.001 + Math.random() * 0.003,
        rotSpeed: 0.005 + Math.random() * 0.015,
        floatSpeed: 0.002 + Math.random() * 0.004,
        originalY: mesh.position.y,
        originalX: mesh.position.x
      };
      scene.add(mesh);
      shapes.push(mesh);
    }
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(colors.primary, 0.8, 20);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(colors.accent, 0.4, 20);
    pointLight2.position.set(-5, -3, 5);
    scene.add(pointLight2);
    
    const pointLight3 = new THREE.PointLight(0xffffff, 0.3, 20);
    pointLight3.position.set(0, 10, 0);
    scene.add(pointLight3);
    
    camera.position.z = 8;
    camera.position.y = 1;
    
    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      
      particlesMesh.rotation.y += 0.0003;
      particlesMesh.rotation.x = Math.sin(time * 0.05) * 0.02;
      
      shapes.forEach((mesh, i) => {
        mesh.rotation.x += mesh.userData.rotSpeed;
        mesh.rotation.y += mesh.userData.rotSpeed * 0.7;
        mesh.position.y = mesh.userData.originalY + Math.sin(time * mesh.userData.floatSpeed + i) * 0.5;
        mesh.position.x = mesh.userData.originalX + Math.cos(time * mesh.userData.floatSpeed * 0.7 + i) * 0.3;
        
        mesh.position.x += (mouse.x * 0.5 - mesh.position.x * 0.01) * 0.005;
        mesh.position.y += (mouse.y * 0.5 - mesh.position.y * 0.01) * 0.005;
      });
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Counter Animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            startCounters();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [hasAnimated]);

  const startCounters = () => {
    const targets = {
      frequency: 102.3,
      broadcasting: 24,
      rank: 1,
      listeners: 1000000
    };

    const duration = 2000;
    const startTime = Date.now();

    const updateCounters = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCounters({
        frequency: targets.frequency * easeOut,
        broadcasting: Math.round(targets.broadcasting * easeOut),
        rank: Math.round(targets.rank * easeOut),
        listeners: Math.round(targets.listeners * easeOut)
      });

      if (progress < 1) {
        requestAnimationFrame(updateCounters);
      } else {
        setCounters({
          frequency: targets.frequency,
          broadcasting: targets.broadcasting,
          rank: targets.rank,
          listeners: targets.listeners
        });
      }
    };

    // Start with a small delay
    setTimeout(() => {
      requestAnimationFrame(updateCounters);
    }, 300);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  };

  // Animation variants - ONLY for hero
  const heroVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      {/* 3D Canvas - ONLY for hero */}
      <canvas ref={canvasRef} className="about-hero-canvas" />
      <div className="about-hero-overlay" />

      {/* PageHeader with Framer Motion */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <PageHeader
          title="About"
          highlight="Us"
          subtitle="Welcome to Petals FM 102.3 Ibadan – Your Premier Source for Entertainment and Information!"
          breadcrumb="About"
        />
      </motion.div>
      
      <main className="about-main">
        {/* About Section */}
        <section className="about-page">
          <div className="container">
            <div className="about-page-grid">
              <div className="about-page-content">
                <h3 className="about-page-heading">
                  Welcome to Petals FM 102.3 – Your Radio Station
                </h3>

                <p>
                  At Petals FM 102.3, we believe in the power of radio to inform, entertain, and unite our community. As a leading radio station, we are committed to delivering high-quality programming that resonates with our listeners and reflects the vibrant culture of our audience.
                </p>

                <p>
                  Our mission is to be more than just a radio station; we are a trusted friend, a source of reliable news, and a platform for voices to be heard.
                </p>

                <p>
                  Founded with the vision of creating a radio station that truly serves its community, Petals FM 102.3 has grown to become a household name. We have always strived to connect with our listeners on a personal level, offering a mix of local and international content that caters to a wide range of tastes and interests.
                </p>

                <p>
                  From our humble beginnings, we have evolved, embracing the latest technology to bring you crisp, clear sound and interactive shows that keep you engaged.
                </p>

                <div className="about-page-image-mobile">
                  <img
                    src="https://petals1023fm.com/wp-content/uploads/2024/09/petals.webp"
                    alt="Petals 102.3 FM"
                  />
                </div>
              </div>

              <div className="about-page-image">
                <img
                  src="https://petals1023fm.com/wp-content/uploads/2024/09/petals.webp"
                  alt="Petals 102.3 FM"
                />
                <div className="about-image-overlay">
                  <div className="about-image-badge">
                    <i className="fas fa-radio"></i>
                    <span>102.3 FM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section - With Counter */}
        <section className="about-stats" ref={statsRef}>
          <div className="container">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">
                  {counters.frequency % 1 === 0 ? 
                    counters.frequency : 
                    counters.frequency.toFixed(1)
                  }
                </div>
                <div className="stat-label">FM Frequency</div>
                <div className="stat-icon">
                  <i className="fas fa-radio"></i>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-number">{counters.broadcasting}</div>
                <div className="stat-label">Live Broadcasting</div>
                <div className="stat-icon">
                  <i className="fas fa-broadcast"></i>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-number">#{counters.rank}</div>
                <div className="stat-label">In Ibadan</div>
                <div className="stat-icon">
                  <i className="fas fa-trophy"></i>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-number">{formatNumber(counters.listeners)}+</div>
                <div className="stat-label">Listeners</div>
                <div className="stat-icon">
                  <i className="fas fa-headphones"></i>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Clients Section */}
        <section className="about-clients">
          <div className="container">
            <div className="clients-carousel">
              {/* Add client logos here when available */}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}