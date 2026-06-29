// src/components/home/VideoSection.jsx

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import './VideoSection.css';

function RadioWaves() {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.1;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1.5, 0.5, 64, 8]} />
      <meshStandardMaterial color="#ff0040" emissive="#ff0040" emissiveIntensity={0.2} wireframe transparent opacity={0.4} />
    </mesh>
  );
}

function Particles() {
  const particlesRef = useRef();
  const count = 500;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
  }

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#ff0040" size={0.03} transparent opacity={0.5} />
    </points>
  );
}

export default function VideoSection() {
  const videos = [
    {
      id: 'ABpbaAsf8yc',
      title: 'Introducing all new Petal...',
      channel: 'Petals Fm102.3',
      views: '1.2K views',
      date: '2 months ago'
    },
    {
      id: '-pfgqllAXIM',
      title: 'Yinka Odumakin The punchl...',
      channel: 'Petals Fm102.3',
      views: '856 views',
      date: '3 months ago'
    },
    {
      id: 'ObudRpvl02c',
      title: '1 Year Anniversary of Yin...',
      channel: 'Petals Fm102.3',
      views: '2.4K views',
      date: '1 month ago'
    }
  ];

  const [currentVideo, setCurrentVideo] = useState(0);

  return (
    <section className="video-section">
      <div className="video-3d-container">
        <Canvas camera={{ position: [0, 0, 6] }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} />
          <Stars radius={10} depth={30} count={400} factor={6} saturation={0} fade />
          <RadioWaves />
          <Particles />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
        </Canvas>
      </div>
      <div className="container">
        <motion.div
          className="video-section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="item--sub-title style9 show-line">
            Video Track
            <span className="line-left"></span>
            <span className="line-right"></span>
          </div>
          <h3 className="item--title">Stories. Impact. Memories</h3>
        </motion.div>

        <div className="video-wrapper">
          <motion.div
            className="video-main"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="video-player">
              <img
                src={`https://img.youtube.com/vi/${videos[currentVideo].id}/hqdefault.jpg`}
                alt={videos[currentVideo].title}
                className="video-bg-img"
              />
              <div className="video-play-overlay">
                <motion.div
                  className="play-button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <i className="fas fa-play" />
                </motion.div>
              </div>
              <div className="video-channel-info">
                <div className="channel-avatar">
                  <img src="https://petals1023fm.com/wp-content/uploads/2024/09/petals_logo_copy-removebg-preview.png" alt="Petals FM" />
                </div>
                <div className="channel-details">
                  <h4 className="video-title">{videos[currentVideo].title}</h4>
                  <div className="channel-name">{videos[currentVideo].channel}</div>
                  <div className="video-meta">{videos[currentVideo].views} • {videos[currentVideo].date}</div>
                </div>
                <button className="watch-btn">
                  Watch on <i className="fab fa-youtube" /> YouTube
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="video-sidebar"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="sidebar-label">Up Next</div>
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                className={`video-sidebar-item ${index === currentVideo ? 'active' : ''}`}
                onClick={() => setCurrentVideo(index)}
                whileHover={{ x: 5 }}
              >
                <img
                  src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                  alt={video.title}
                />
                <div className="sidebar-item-details">
                  <h4>{video.title}</h4>
                  <span>{video.channel}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}