// src/pages/Podcasts.jsx

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import './Podcasts.css';
import PageHeader from '../components/common/PageHeader';
import SectionHeading from '../components/common/SectionHeading';

const episodes = [
  {
    id: 1,
    title: 'The Polity',
    desc: 'In-depth political analysis and discussions on Nigeria\'s democratic landscape.',
    date: 'September 3, 2024',
    duration: '45 min',
    category: 'Politics',
    listens: '2.4K',
    featured: true
  },
  {
    id: 2,
    title: 'News At Noon with Toni Adeoye',
    desc: 'Your midday news roundup — local, national, and international headlines.',
    date: 'August 28, 2024',
    duration: '30 min',
    category: 'News',
    listens: '1.8K',
    featured: false
  },
  {
    id: 3,
    title: 'Morning Drive with Faruq',
    desc: 'Kickstart your morning with energy, music, and inspiring conversations.',
    date: 'August 25, 2024',
    duration: '60 min',
    category: 'Entertainment',
    listens: '3.1K',
    featured: false
  },
  {
    id: 4,
    title: 'Weekend Vibes',
    desc: 'Relax and unwind with the best weekend music and entertainment.',
    date: 'August 21, 2024',
    duration: '90 min',
    category: 'Music',
    listens: '4.2K',
    featured: false
  }
];

const categories = ['All', 'Politics', 'News', 'Entertainment', 'Music'];

export default function Podcasts() {
  const canvasRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [playingId, setPlayingId] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);

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
      colorArray[i + 1] = color.g;
      colorArray[i + 2] = color.b;
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

    // Floating Music Note Shapes
    const shapes = [];
    const noteGeometries = [
      new THREE.SphereGeometry(0.1, 8, 8),
      new THREE.CylinderGeometry(0.02, 0.02, 0.3, 6),
      new THREE.TorusGeometry(0.08, 0.02, 8, 8)
    ];

    for (let i = 0; i < 15; i++) {
      const group = new THREE.Group();

      // Note head
      const headMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? colors.primary : colors.accent,
        metalness: 0.4,
        roughness: 0.6,
        transparent: true,
        opacity: 0.3 + Math.random() * 0.3
      });
      const head = new THREE.Mesh(noteGeometries[0], headMat);
      group.add(head);

      // Note stem
      const stemMat = new THREE.MeshStandardMaterial({
        color: colors.navy,
        metalness: 0.3,
        roughness: 0.7,
        transparent: true,
        opacity: 0.4
      });
      const stem = new THREE.Mesh(noteGeometries[1], stemMat);
      stem.position.y = 0.2;
      group.add(stem);

      // Note flag
      const flagMat = new THREE.MeshStandardMaterial({
        color: colors.accent,
        wireframe: true,
        transparent: true,
        opacity: 0.2
      });
      const flag = new THREE.Mesh(noteGeometries[2], flagMat);
      flag.position.set(0.08, 0.3, 0);
      flag.rotation.x = Math.PI / 4;
      group.add(flag);

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

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(colors.primary, 0.8, 20);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(colors.accent, 0.4, 20);
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
      particlesMesh.rotation.x = Math.sin(time * 0.05) * 0.02;

      shapes.forEach((group, i) => {
        group.rotation.x += group.userData.rotSpeed;
        group.rotation.y += group.userData.rotSpeed * 0.7;
        group.position.y = group.userData.originalY + Math.sin(time * group.userData.floatSpeed + i) * 0.5;
        group.position.x = group.userData.originalX + Math.cos(time * group.userData.floatSpeed * 0.7 + i) * 0.3;

        group.position.x += (mouse.x * 0.5 - group.position.x * 0.01) * 0.005;
        group.position.y += (mouse.y * 0.5 - group.position.y * 0.01) * 0.005;
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

  // Filter episodes
  const filteredEpisodes = episodes.filter(ep => {
    const matchCategory = activeCategory === 'All' || ep.category === activeCategory;
    const matchSearch = ep.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       ep.desc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const featuredEpisodes = episodes.filter(ep => ep.featured);

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

  const episodeVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 80,
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
      <canvas ref={canvasRef} className="podcasts-canvas" />
      <div className="podcasts-overlay" />

      <PageHeader
        title="Petals FM"
        highlight="Podcasts"
        subtitle="Listen to your favourite shows on demand, anytime, anywhere."
        breadcrumb="Podcasts"
      />

      <motion.main
        className="podcasts-main"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <section className="podcasts-page">
          <div className="container">
            {/* Section Heading */}
            <motion.div variants={itemVariants}>
              <SectionHeading
                eyebrow="On Demand"
                title="Catch Up on Our Shows"
              />
            </motion.div>

            <motion.p
              className="podcasts-intro"
              variants={itemVariants}
            >
              Missed a show? No worries. Stream all our podcast episodes right here — from political
              discussions and news analysis to entertainment and community conversations. Petals FM,
              whenever you need us.
            </motion.p>

            {/* Search and Filter */}
            <motion.div
              className="podcasts-controls"
              variants={itemVariants}
            >
              <div className="podcasts-search">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search episodes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="clear-search">
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>

              <div className="podcasts-categories">
                {categories.map(cat => (
                  <motion.button
                    key={cat}
                    className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Featured Episode */}
            {featuredEpisodes.length > 0 && (
              <motion.div
                className="podcast-featured"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="featured-badge">
                  <i className="fas fa-star"></i>
                  Featured Episode
                </div>
                <div className="featured-card">
                  <div className="featured-content">
                    <span className="featured-category">{featuredEpisodes[0].category}</span>
                    <h3>{featuredEpisodes[0].title}</h3>
                    <p>{featuredEpisodes[0].desc}</p>
                    <div className="featured-meta">
                      <span><i className="fas fa-calendar"></i> {featuredEpisodes[0].date}</span>
                      <span><i className="fas fa-clock"></i> {featuredEpisodes[0].duration}</span>
                      <span><i className="fas fa-headphones"></i> {featuredEpisodes[0].listens} listens</span>
                    </div>
                    <motion.button
                      className="featured-play-btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPlayingId(playingId === featuredEpisodes[0].id ? null : featuredEpisodes[0].id)}
                    >
                      <i className={`fas fa-${playingId === featuredEpisodes[0].id ? 'pause' : 'play'}`}></i>
                      {playingId === featuredEpisodes[0].id ? 'Now Playing' : 'Listen Now'}
                    </motion.button>
                  </div>
                  <div className="featured-artwork">
                    <i className="fas fa-podcast"></i>
                    <div className="featured-wave">
                      <span></span><span></span><span></span>
                      <span></span><span></span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Embed */}
            <motion.div
              className="podcast-embed-wrap"
              variants={itemVariants}
            >
              <div className="embed-header">
                <i className="fas fa-headphones"></i>
                <span>Listen Live</span>
              </div>
              <iframe
                src="https://petals1023fm.com/pods/podcast.html"
                title="Petals FM Podcasts"
                scrolling="no"
              />
            </motion.div>

            {/* Episodes */}
            <motion.div
              className="podcast-episodes"
              variants={itemVariants}
            >
              <div className="episodes-header">
                <h3>Recent Episodes</h3>
                <span className="episodes-count">{filteredEpisodes.length} episodes</span>
              </div>

              {filteredEpisodes.length === 0 ? (
                <motion.div
                  className="no-episodes"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <i className="fas fa-microphone-slash"></i>
                  <p>No episodes found matching your criteria</p>
                </motion.div>
              ) : (
                filteredEpisodes.map((ep, i) => (
                  <motion.div
                    key={ep.id}
                    className={`episode-card ${playingId === ep.id ? 'playing' : ''}`}
                    variants={episodeVariants}
                    whileHover={{ y: -4 }}
                  >
                    <div className="episode-num">{String(i + 1).padStart(2, '0')}</div>
                    <div className="episode-info">
                      <div className="episode-top">
                        <h4>{ep.title}</h4>
                        <span className="episode-category">{ep.category}</span>
                      </div>
                      <p className="episode-desc">{ep.desc}</p>
                      <div className="episode-meta">
                        <span><i className="fas fa-calendar" /> {ep.date}</span>
                        <span><i className="fas fa-clock" /> {ep.duration}</span>
                        <span><i className="fas fa-headphones" /> {ep.listens}</span>
                      </div>
                    </div>
                    <div className="episode-actions">
                      <motion.button
                        className={`episode-play ${playingId === ep.id ? 'playing' : ''}`}
                        aria-label={`Play ${ep.title}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setPlayingId(playingId === ep.id ? null : ep.id)}
                      >
                        <i className={`fas fa-${playingId === ep.id ? 'pause' : 'play'}`} />
                      </motion.button>
                      <motion.button
                        className="episode-more"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedEpisode(ep)}
                      >
                        <i className="fas fa-ellipsis-v" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>

            {/* Subscribe Section */}
            <motion.div
              className="podcast-subscribe"
              variants={itemVariants}
            >
              <div className="subscribe-content">
                <h3>Never Miss an Episode</h3>
                <p>Subscribe to our podcast and get notified when new episodes drop.</p>
                <div className="subscribe-buttons">
                  <motion.a
                    href="#"
                    className="subscribe-btn apple"
                    whileHover={{ scale: 1.05 }}
                  >
                    <i className="fab fa-apple"></i>
                    Apple Podcasts
                  </motion.a>
                  <motion.a
                    href="#"
                    className="subscribe-btn spotify"
                    whileHover={{ scale: 1.05 }}
                  >
                    <i className="fab fa-spotify"></i>
                    Spotify
                  </motion.a>
                  <motion.a
                    href="#"
                    className="subscribe-btn google"
                    whileHover={{ scale: 1.05 }}
                  >
                    <i className="fab fa-google"></i>
                    Google Podcasts
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </motion.main>

      {/* Episode Modal */}
      <motion.div
        className={`episode-modal ${selectedEpisode ? 'active' : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: selectedEpisode ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => setSelectedEpisode(null)}
      >
        <motion.div
          className="episode-modal-content"
          variants={modalVariants}
          initial="hidden"
          animate={selectedEpisode ? "visible" : "hidden"}
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          {selectedEpisode && (
            <>
              <button
                className="episode-modal-close"
                onClick={() => setSelectedEpisode(null)}
              >
                <i className="fas fa-times"></i>
              </button>

              <div className="episode-modal-header">
                <span className="episode-modal-category">{selectedEpisode.category}</span>
                <h3>{selectedEpisode.title}</h3>
                <p>{selectedEpisode.desc}</p>
              </div>

              <div className="episode-modal-body">
                <div className="episode-modal-meta">
                  <div className="meta-item">
                    <i className="fas fa-calendar"></i>
                    <span>{selectedEpisode.date}</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-clock"></i>
                    <span>{selectedEpisode.duration}</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-headphones"></i>
                    <span>{selectedEpisode.listens} listens</span>
                  </div>
                </div>

                <div className="episode-modal-player">
                  <motion.button
                    className="modal-play-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setPlayingId(playingId === selectedEpisode.id ? null : selectedEpisode.id)}
                  >
                    <i className={`fas fa-${playingId === selectedEpisode.id ? 'pause' : 'play'}`}></i>
                  </motion.button>
                  <div className="modal-player-info">
                    <span className="modal-player-title">Now Playing</span>
                    <span className="modal-player-sub">{selectedEpisode.title}</span>
                  </div>
                </div>

                <div className="episode-modal-actions">
                  <button className="action-btn">
                    <i className="fas fa-download"></i>
                    Download
                  </button>
                  <button className="action-btn">
                    <i className="fas fa-share-alt"></i>
                    Share
                  </button>
                  <button className="action-btn">
                    <i className="fas fa-bookmark"></i>
                    Save
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}