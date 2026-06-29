// src/pages/Contact.jsx

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import './Contact.css';
import PageHeader from '../components/common/PageHeader';
import SectionHeading from '../components/common/SectionHeading';

export default function Contact() {
  const canvasRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [errors, setErrors] = useState({});

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
      navy: new THREE.Color('#0d2252')
    };

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20;
      const color = Math.random() > 0.7 ? colors.primary : colors.navy;
      colorArray[i] = color.r;
      colorArray[i + 1] = color.g;
      colorArray[i + 2] = color.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.04,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Floating Icons (Microphone shapes)
    const shapes = [];
    const geometries = [
      new THREE.SphereGeometry(0.15, 8, 8),
      new THREE.TorusGeometry(0.12, 0.04, 8, 8),
      new THREE.OctahedronGeometry(0.15),
      new THREE.CylinderGeometry(0.1, 0.1, 0.2, 6),
    ];

    for (let i = 0; i < 15; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? colors.primary : colors.navy,
        wireframe: Math.random() > 0.6,
        transparent: true,
        opacity: 0.15 + Math.random() * 0.2,
        metalness: 0.3,
        roughness: 0.7,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10 - 5
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      mesh.userData = {
        rotSpeed: 0.005 + Math.random() * 0.015,
        floatSpeed: 0.002 + Math.random() * 0.004,
        originalY: mesh.position.y,
        originalX: mesh.position.x,
      };
      scene.add(mesh);
      shapes.push(mesh);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(colors.primary, 0.6, 20);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xffffff, 0.3, 20);
    pointLight2.position.set(-5, -3, 5);
    scene.add(pointLight2);

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

      shapes.forEach((mesh, i) => {
        mesh.rotation.x += mesh.userData.rotSpeed;
        mesh.rotation.y += mesh.userData.rotSpeed * 0.7;
        mesh.position.y = mesh.userData.originalY + Math.sin(time * mesh.userData.floatSpeed + i) * 0.4;
        mesh.position.x = mesh.userData.originalX + Math.cos(time * mesh.userData.floatSpeed * 0.7 + i) * 0.3;
        mesh.position.x += (mouse.x * 0.3 - mesh.position.x * 0.01) * 0.005;
        mesh.position.y += (mouse.y * 0.3 - mesh.position.y * 0.01) * 0.005;
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

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error for this field when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Please enter a valid email';
    if (!form.subject.trim()) newErrors.subject = 'Subject is required';
    if (!form.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Auto dismiss errors after 5 seconds
      setTimeout(() => setErrors({}), 5000);
      return;
    }

    setSending(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setNotification({
        show: true,
        type: 'success',
        message: 'Thank you! Your message has been sent successfully. We will respond shortly.'
      });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      setNotification({
        show: true,
        type: 'error',
        message: 'Something went wrong. Please try again later.'
      });
    } finally {
      setSending(false);
      setTimeout(() => setNotification({ ...notification, show: false }), 6000);
    }
  };

  const contactCards = [
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Ibadan Office',
      content: '11a Obe Street, Bodija, Ibadan, Oyo State, Nigeria',
    },
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Lagos Office',
      content: '8b Kayode Alli Close, Omole Phase 1, Lagos, Nigeria',
    },
    {
      icon: 'fas fa-phone',
      title: 'Studio Line',
      content: '0815 067 8262',
      href: 'tel:+2348150678262',
    },
    {
      icon: 'fab fa-whatsapp',
      title: 'WhatsApp',
      content: '0806 215 1752',
      href: 'https://wa.me/2348062151752',
    },
    {
      icon: 'fas fa-envelope',
      title: 'News & General',
      content: 'news@petals1023fm.com',
      href: 'mailto:news@petals1023fm.com',
    },
    {
      icon: 'fas fa-envelope',
      title: 'Info & Adverts',
      content: 'info@petals1023fm.com',
      href: 'mailto:info@petals1023fm.com',
    },
  ];

  const socialLinks = [
    { icon: 'fab fa-facebook', url: '#' },
    { icon: 'fab fa-twitter', url: '#' },
    { icon: 'fab fa-instagram', url: '#' },
    { icon: 'fab fa-youtube', url: '#' },
    { icon: 'fab fa-tiktok', url: '#' },
  ];

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
    hidden: { y: 20, opacity: 0 },
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
      <canvas ref={canvasRef} className="contact-hero-canvas" />
      <div className="contact-hero-overlay" />

      {/* PageHeader with Framer Motion */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <PageHeader
          title="Contact"
          highlight="Us"
          subtitle="We're always happy to hear from you — reach out anytime."
          breadcrumb="Contact"
        />
      </motion.div>

      <motion.main
        className="contact-main"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <section className="contact-page-section">
          <div className="container">
            <motion.div variants={itemVariants}>
              <SectionHeading
                eyebrow="Reach Us"
                title="Let's Start a Conversation"
                subtitle="For news tips, adverts, partnerships, or just to say hello — we're here."
              />
            </motion.div>

            <div className="contact-grid">
              {/* Cards */}
              <div>
                <motion.div 
                  className="contact-cards"
                  variants={containerVariants}
                >
                  {contactCards.map(({ icon, title, content, href }) => (
                    <motion.div
                      key={title}
                      className="contact-card"
                      variants={itemVariants}
                      whileHover={{ y: -4 }}
                    >
                      <div className="contact-card-icon">
                        <i className={icon} />
                      </div>
                      <div className="contact-card-content">
                        <h4>{title}</h4>
                        {href ? (
                          <a href={href} target={href.startsWith('http') ? '_blank' : '_self'} rel="noreferrer">
                            {content}
                          </a>
                        ) : (
                          <p>{content}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Working Hours */}
                <motion.div 
                  className="contact-hours"
                  variants={itemVariants}
                >
                  <div className="hours-card">
                    <div className="hours-icon">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div className="hours-content">
                      <h4>Working Hours</h4>
                      <p><span>Monday - Friday:</span> 6:00 AM - 10:00 PM</p>
                      <p><span>Saturday - Sunday:</span> 8:00 AM - 8:00 PM</p>
                    </div>
                  </div>
                </motion.div>

                {/* Social Links */}
                <motion.div 
                  className="contact-social"
                  variants={itemVariants}
                >
                  <h4>Connect With Us</h4>
                  <div className="social-links">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.url}
                        className="social-link"
                        whileHover={{ y: -4, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <i className={social.icon}></i>
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Form */}
              <motion.form
                className="contact-form"
                variants={itemVariants}
                onSubmit={handleSubmit}
                noValidate
              >
                <h3>Send Us a Message</h3>
                <p className="contact-form-subtitle">Fill in the form below and we'll get back to you.</p>

                {/* Notification */}
                {notification.show && (
                  <motion.div 
                    className={`notification ${notification.type}`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <i className={`fas ${notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} />
                    <span>{notification.message}</span>
                    <button 
                      className="notification-close"
                      onClick={() => setNotification({ ...notification, show: false })}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </motion.div>
                )}

                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label>Full Name <span className="required">*</span></label>
                    <input 
                      name="name" 
                      value={form.name} 
                      onChange={handleChange} 
                      placeholder="Your name" 
                      required 
                      className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                  </div>
                  <div className="contact-form-group">
                    <label>Email Address <span className="required">*</span></label>
                    <input 
                      type="email" 
                      name="email" 
                      value={form.email} 
                      onChange={handleChange} 
                      placeholder="you@email.com" 
                      required 
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                </div>

                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label>Phone Number</label>
                    <input 
                      name="phone" 
                      value={form.phone} 
                      onChange={handleChange} 
                      placeholder="08xx xxx xxxx" 
                    />
                  </div>
                  <div className="contact-form-group">
                    <label>Subject <span className="required">*</span></label>
                    <input 
                      name="subject" 
                      value={form.subject} 
                      onChange={handleChange} 
                      placeholder="What is this about?" 
                      required 
                      className={errors.subject ? 'error' : ''}
                    />
                    {errors.subject && <span className="error-message">{errors.subject}</span>}
                  </div>
                </div>

                <div className="contact-form-group">
                  <label>Message <span className="required">*</span></label>
                  <textarea 
                    name="message" 
                    value={form.message} 
                    onChange={handleChange} 
                    placeholder="Tell us more..." 
                    required 
                    rows="5"
                    className={errors.message ? 'error' : ''}
                  />
                  {errors.message && <span className="error-message">{errors.message}</span>}
                </div>

                <button 
                  type="submit" 
                  className="contact-submit-btn"
                  disabled={sending}
                >
                  {sending ? (
                    <>
                      <i className="fas fa-spinner fa-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane" /> Send Message
                    </>
                  )}
                </button>
              </motion.form>
            </div>

            {/* Map */}
            <motion.div
              className="contact-map-wrapper"
              variants={itemVariants}
            >
              <div className="map-container">
                <iframe
                  src="https://maps.google.com/maps?q=Petals+FM+11a+Obe+St+Bodija+Ibadan&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  title="Petals FM Location"
                  loading="lazy"
                  allowFullScreen
                />
                <div className="map-pin">
                  <i className="fas fa-map-pin"></i>
                  <span>Petals FM 102.3</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </motion.main>
    </>
  );
}