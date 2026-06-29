// src/pages/OAPs.jsx

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import './OAPs.css';
import PageHeader from '../components/common/PageHeader';

const oapsData = [
  {
    id: 1,
    name: "Faruq Akinkunmi",
    role: "Studio Manager",
    photo: "https://petals1023fm.com/wp-content/uploads/2024/09/faruq-267x352.jpg",
    show: "Morning Drive",
    time: "6:00 AM - 10:00 AM",
    description: "Starting your day with energy, news, and the best music to kickstart your morning."
  },
  {
    id: 2,
    name: "Toni Adeoye",
    role: "News Anchor",
    photo: null,
    show: "News At Noon",
    time: "12:00 PM - 1:00 PM",
    description: "Delivering accurate and timely news coverage to keep you informed."
  },
  {
    id: 3,
    name: "Petals OAP",
    role: "On-Air Personality",
    photo: null,
    show: "Evening Show",
    time: "4:00 PM - 7:00 PM",
    description: "Unwinding with the best evening vibes, music, and engaging conversations."
  }
];

const LOGO = 'https://petals1023fm.com/wp-content/uploads/2024/09/petals_logo_copy-removebg-preview.png';

export default function OAPs() {
  const canvasRef = useRef(null);
  const [selectedOAP, setSelectedOAP] = useState(null);
  
  // Three.js Background Setup
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
    
    // Colors
    const colors = {
      primary: new THREE.Color('#ff0040'),
      secondary: new THREE.Color('#0a1628'),
      accent: new THREE.Color('#ff6b6b'),
      navy: new THREE.Color('#0d2252')
    };
    
    // Particle System
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
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
    
    // Floating Microphone Shapes
    const shapes = [];
    const microphoneGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.6, 8);
    const micHeadGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    
    for (let i = 0; i < 12; i++) {
      const group = new THREE.Group();
      
      // Mic body
      const bodyMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? colors.primary : colors.accent,
        metalness: 0.6,
        roughness: 0.3,
        transparent: true,
        opacity: 0.3 + Math.random() * 0.3
      });
      const body = new THREE.Mesh(microphoneGeometry, bodyMat);
      body.position.y = 0.1;
      group.add(body);
      
      // Mic head
      const headMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? colors.accent : colors.primary,
        metalness: 0.4,
        roughness: 0.5,
        transparent: true,
        opacity: 0.3 + Math.random() * 0.3
      });
      const head = new THREE.Mesh(micHeadGeometry, headMat);
      head.position.y = 0.5;
      group.add(head);
      
      // Mic grille (torus)
      const grilleMat = new THREE.MeshStandardMaterial({
        color: colors.navy,
        wireframe: true,
        transparent: true,
        opacity: 0.2
      });
      const grille = new THREE.Mesh(
        new THREE.TorusGeometry(0.2, 0.02, 8, 8),
        grilleMat
      );
      grille.position.y = 0.5;
      group.add(grille);
      
      group.position.set(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10 - 5
      );
      group.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      group.scale.setScalar(0.5 + Math.random() * 0.5);
      
      group.userData = {
        speed: 0.001 + Math.random() * 0.003,
        rotSpeed: 0.005 + Math.random() * 0.015,
        floatSpeed: 0.002 + Math.random() * 0.004,
        originalY: group.position.y,
        originalX: group.position.x
      };
      scene.add(group);
      shapes.push(group);
    }
    
    // Lights
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
    
    // Mouse tracking
    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation Loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      
      // Rotate particles
      particlesMesh.rotation.y += 0.0003;
      particlesMesh.rotation.x = Math.sin(time * 0.05) * 0.02;
      
      // Animate shapes
      shapes.forEach((group, i) => {
        group.rotation.x += group.userData.rotSpeed;
        group.rotation.y += group.userData.rotSpeed * 0.7;
        group.position.y = group.userData.originalY + Math.sin(time * group.userData.floatSpeed + i) * 0.5;
        group.position.x = group.userData.originalX + Math.cos(time * group.userData.floatSpeed * 0.7 + i) * 0.3;
        
        // Mouse interaction
        group.position.x += (mouse.x * 0.5 - group.position.x * 0.01) * 0.005;
        group.position.y += (mouse.y * 0.5 - group.position.y * 0.01) * 0.005;
      });
      
      // Responsive camera
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Resize handler
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
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 20
      }
    },
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    }
  };

  const modalVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 25
      }
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <>
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="oaps-canvas"
      />
      
      {/* Overlay */}
      <div className="oaps-overlay" />
      
      <PageHeader
        title="Our OAPs"
        highlight=""
        subtitle="Meet the voices behind Petals FM 102.3"
        breadcrumb="OAPs"
      />
      
      <motion.main
        className="oaps-main"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <section className="oaps-page">
          <div className="container">
            {/* Intro Section */}
            <motion.div 
              className="oaps-intro"
              variants={itemVariants}
            >
              <motion.div 
                className="oaps-intro-badge"
                variants={itemVariants}
              >
                <i className="fas fa-microphone-alt"></i>
                <span>Meet Our Team</span>
              </motion.div>
              
              <motion.h3 
                className="oaps-heading"
                variants={itemVariants}
              >
                The Voices of <span className="highlight">Petals FM</span>
              </motion.h3>
              
              <motion.p
                variants={itemVariants}
              >
                At Petals FM 102.3, our On-Air Personalities (OAPs) are the heartbeat of our station, 
                bringing you the latest news, entertainment, music, and engaging conversations. 
                They are a diverse group of talented individuals who have their fingers on the pulse 
                of current trends and a deep connection with our listeners.
              </motion.p>
            </motion.div>

            {/* OAPs Grid - 3 Cards */}
            <motion.div 
              className="oaps-grid"
              variants={containerVariants}
            >
              {oapsData.map((oap) => (
                <motion.div
                  key={oap.id}
                  className="oap-card"
                  variants={cardVariants}
                  whileHover="hover"
                  onClick={() => setSelectedOAP(oap)}
                >
                  <div className="oap-card-inner">
                    <div className="oap-img-wrap">
                      <motion.img
                        src={oap.photo || LOGO}
                        alt={oap.name}
                        className="oap-image"
                        style={!oap.photo ? {
                          objectFit: 'contain',
                          background: 'linear-gradient(135deg, #0a1628, #1a0a20)',
                          padding: '20px'
                        } : {}}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      />
                      <div className="oap-img-overlay">
                        <div className="oap-onair-badge">
                          <span className="blink-dot"></span>
                          On Air
                        </div>
                      </div>
                    </div>
                    
                    <div className="oap-card-body">
                      <motion.h3 
                        className="oap-name"
                        whileHover={{ color: '#ff0040' }}
                      >
                        {oap.name}
                      </motion.h3>
                      <p className="oap-card-role">{oap.role}</p>
                      {oap.show && (
                        <div className="oap-card-show">
                          <i className="fas fa-microphone"></i>
                          <span>{oap.show}</span>
                        </div>
                      )}
                      {oap.time && (
                        <div className="oap-card-time">
                          <i className="far fa-clock"></i>
                          <span>{oap.time}</span>
                        </div>
                      )}
                      <motion.button 
                        className="oap-card-btn"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Learn More
                        <i className="fas fa-arrow-right"></i>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </motion.main>

      {/* OAP Modal */}
      <motion.div 
        className={`oap-modal ${selectedOAP ? 'active' : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: selectedOAP ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => setSelectedOAP(null)}
      >
        <motion.div 
          className="oap-modal-content"
          variants={modalVariants}
          initial="hidden"
          animate={selectedOAP ? "visible" : "hidden"}
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          {selectedOAP && (
            <>
              <button 
                className="oap-modal-close"
                onClick={() => setSelectedOAP(null)}
              >
                <i className="fas fa-times"></i>
              </button>
              
              <div className="oap-modal-grid">
                <div className="oap-modal-image">
                  <img
                    src={selectedOAP.photo || LOGO}
                    alt={selectedOAP.name}
                    style={!selectedOAP.photo ? {
                      objectFit: 'contain',
                      background: 'linear-gradient(135deg, #0a1628, #1a0a20)',
                      padding: '30px'
                    } : {}}
                  />
                </div>
                
                <div className="oap-modal-info">
                  <div className="oap-modal-badge">
                    <span className="blink-dot"></span>
                    Live Now
                  </div>
                  
                  <h3 className="oap-modal-name">{selectedOAP.name}</h3>
                  <p className="oap-modal-role">{selectedOAP.role}</p>
                  
                  <div className="oap-modal-details">
                    <div className="oap-modal-detail">
                      <i className="fas fa-microphone-alt"></i>
                      <div>
                        <span className="detail-label">Show</span>
                        <span className="detail-value">{selectedOAP.show}</span>
                      </div>
                    </div>
                    <div className="oap-modal-detail">
                      <i className="far fa-clock"></i>
                      <div>
                        <span className="detail-label">Time</span>
                        <span className="detail-value">{selectedOAP.time}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="oap-modal-description">
                    {selectedOAP.description}
                  </p>
                  
                  <div className="oap-modal-social">
                    <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
                    <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
                    <a href="#" className="social-link"><i className="fab fa-facebook"></i></a>
                    <a href="#" className="social-link"><i className="fab fa-youtube"></i></a>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}