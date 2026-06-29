// src/components/home/ContactSection.jsx

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import './ContactSection.css';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const canvasRef = useRef(null);
  
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
      accent: new THREE.Color('#ff6b6b')
    };
    
    // Particle System
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20;
      const color = Math.random() > 0.7 ? colors.primary : colors.secondary;
      colorArray[i] = color.r;
      colorArray[i+1] = color.g;
      colorArray[i+2] = color.b;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Floating Geometric Shapes
    const shapes = [];
    const geometries = [
      new THREE.SphereGeometry(0.3, 16, 16),
      new THREE.TorusGeometry(0.3, 0.1, 16, 32),
      new THREE.OctahedronGeometry(0.3),
      new THREE.TorusKnotGeometry(0.2, 0.08, 64, 8)
    ];
    
    for (let i = 0; i < 20; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshStandardMaterial({
        color: i % 3 === 0 ? colors.primary : colors.accent,
        wireframe: Math.random() > 0.5,
        transparent: true,
        opacity: 0.3 + Math.random() * 0.3,
        metalness: 0.3,
        roughness: 0.7
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
        rotSpeed: 0.005 + Math.random() * 0.01,
        floatSpeed: 0.002 + Math.random() * 0.003,
        originalY: mesh.position.y
      };
      scene.add(mesh);
      shapes.push(mesh);
    }
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(colors.primary, 1, 20);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(colors.accent, 0.5, 20);
    pointLight2.position.set(-5, -3, 5);
    scene.add(pointLight2);
    
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
      particlesMesh.rotation.y += 0.0005;
      particlesMesh.rotation.x = Math.sin(time * 0.1) * 0.02;
      
      // Animate shapes
      shapes.forEach((mesh, i) => {
        mesh.rotation.x += mesh.userData.rotSpeed;
        mesh.rotation.y += mesh.userData.rotSpeed * 0.7;
        mesh.position.y = mesh.userData.originalY + Math.sin(time * mesh.userData.floatSpeed + i) * 0.5;
        
        // Mouse interaction
        mesh.position.x += (mouse.x * 0.5 - mesh.position.x * 0.01) * 0.01;
        mesh.position.y += (mouse.y * 0.5 - mesh.position.y * 0.01) * 0.01;
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
  
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ name: '', phone: '', message: '' });
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
  
  const floatVariants = {
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
  
  return (
    <motion.section 
      className="contact-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="contact-canvas"
      />
      
      {/* Gradient Overlay */}
      <div className="contact-overlay" />
      
      <div className="container">
        <motion.div 
          className="contact-header"
          variants={itemVariants}
        >
          <motion.div 
            className="item--sub-title"
            variants={itemVariants}
          >
            Get in touch
            <span></span>
          </motion.div>
          
          <motion.h3 
            className="item--title"
            variants={itemVariants}
          >
            Don't hesitate to contact us for inquiries or eye witness report!
          </motion.h3>
        </motion.div>

        <motion.div 
          className="contact-grid"
          variants={itemVariants}
        >
          <motion.div 
            className="contact-form-wrapper"
            variants={itemVariants}
          >
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <motion.div 
                  className="form-group"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <input 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    placeholder="Your name*" 
                    required 
                  />
                </motion.div>
                
                <motion.div 
                  className="form-group"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <input 
                    name="phone" 
                    value={form.phone} 
                    onChange={handleChange} 
                    placeholder="Phone number..." 
                    required 
                  />
                </motion.div>
              </div>
              
              <motion.div 
                className="form-group"
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <textarea 
                  name="message" 
                  value={form.message} 
                  onChange={handleChange} 
                  placeholder="Message..." 
                  rows="8"
                  required 
                />
              </motion.div>
              
              <motion.button 
                type="submit" 
                className="btn btn-submit"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {submitted ? (
                  <>
                    <i className="fas fa-check" /> Sent!
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane" /> Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          <motion.div 
            className="contact-info-wrapper"
            variants={itemVariants}
          >
            <motion.p 
              className="contact-address"
              variants={itemVariants}
            >
              Our offices are located at 11a Obe St, Bodija, Ibadan and 8b Kayode Alli close, off Titilayo Adedoyin, Omole phase 1, Lagos
            </motion.p>

            <div className="contact-features">
              <motion.div 
                className="contact-feature"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="contact-feature-icon">
                  <i className="fas fa-headphones" />
                </div>
                <h4>Quality programming</h4>
              </motion.div>
              
              <motion.div 
                className="contact-feature"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="contact-feature-icon">
                  <i className="fas fa-newspaper" />
                </div>
                <h4>Trustworthy news</h4>
              </motion.div>
            </div>

            <motion.div 
              className="contact-phone"
              variants={itemVariants}
            >
              <motion.a 
                className="ct-phone-icon"
                variants={floatVariants}
                animate="float"
                href="tel:+2348062151752"
              >
                <i className="fas fa-phone" />
              </motion.a>
              
              <div className="ct-phone-holder">
                <span className="label-phone">Our line is always open</span>
                <a className="phone-number" href="tel:+2348062151752">+234 806 215 1752</a>
              </div>
              
              <motion.a 
                href="mailto:info@petals1023fm.com" 
                className="btn btn-email"
                whileHover={{ scale: 1.05 }}
              >
                <i className="fas fa-envelope" /> Send a mail
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}