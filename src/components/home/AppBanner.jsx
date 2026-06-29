// src/components/home/AppBanner.jsx

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import './AppBanner.css';

const STREAM_URL = 'https://radio.fmmaria.com:8070/radio.mp3';

export default function AppBanner() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [status, setStatus] = useState('Ready to play');
  const audioRef = useRef(null);
  
  useEffect(() => {
    const audio = new Audio();
    audio.volume = 0.8;
    audioRef.current = audio;

    // Event listeners
    audio.addEventListener('waiting', () => setStatus('Buffering...'));
    audio.addEventListener('playing', () => setStatus('Live'));
    audio.addEventListener('error', () => setStatus('Stream unavailable'));
    audio.addEventListener('stalled', () => setStatus('Connecting...'));
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setStatus('Ready to play');
    });

    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      audio.src = '';
      setIsPlaying(false);
      setStatus('Paused');
      setCurrentTime(0);
    } else {
      audio.src = STREAM_URL;
      audio.volume = 0.8;
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setStatus('Connecting...');
        })
        .catch(() => setStatus('Playback failed'));
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isBuffering = status === 'Buffering...' || status === 'Connecting...';

  // Animation variants
  const pulseVariants = {
    playing: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    stopped: {
      scale: 1
    }
  };
  
  const waveVariants = {
    playing: {
      height: ["4px", "16px", "4px"],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    stopped: {
      height: "4px"
    }
  };

  return (
    <motion.section 
      className="app-banner"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="container">
        <div className="app-banner-inner">
          {/* Left Content */}
          <motion.div 
            className="app-banner-content"
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="app-banner-badge">
              <i className="fas fa-mobile-alt"></i>
              Mobile App
            </div>
            
            <h2 className="app-banner-title">
              The <span className="highlight">Petals Mobile</span> App
            </h2>
            
            <p className="app-banner-description">
              Get the best of programming and news at your fingertips. 
              Stay connected with Petals 102.3 FM wherever you go.
            </p>
            
            <div className="app-banner-features">
              <div className="feature-item">
                <i className="fas fa-broadcast"></i>
                <span>Live Radio Streaming</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-newspaper"></i>
                <span>Breaking News Alerts</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-music"></i>
                <span>Music &amp; Entertainment</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-comments"></i>
                <span>Interactive Polls &amp; Feedback</span>
              </div>
            </div>
            
            <div className="app-banner-buttons">
              <motion.a 
                className="btn btn-download btn-android"
                href="https://play.google.com/store/apps/details?id=com.petals1023fm.app"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="btn-icon" viewBox="0 0 512 512" width="28" height="28">
                  <path fill="currentColor" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                </svg>
                <div className="btn-text">
                  <span className="btn-small">Get it on</span>
                  <span className="btn-large">Google Play</span>
                </div>
              </motion.a>
              
              <motion.a 
                className="btn btn-download btn-ios"
                href="https://apps.apple.com/app/petals-1023-fm/id1234567890"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="btn-icon" viewBox="0 0 384 512" width="28" height="28">
                  <path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-48.4-19.5-76.4-19.5-44.3 0-80.8 25.3-101.2 61.6-21.5 36.8-26.2 83.7-12.1 132.8 13.6 47.2 44.1 88.7 82.9 88.7 27.6 0 39.5-18.9 75.4-18.9 35.4 0 44.9 18.9 75.4 18.9 39.1 0 68.5-40.7 82.5-88.7 14.9-51.5 10.1-97.9-8.5-129.4zm-35.8-83.3c-24.6-28.5-62.1-45.9-104.7-46.6 10.2-31.4 30.4-54.8 60.8-69.8 27.9-13.8 59.5-18.3 88.5-16.2 11.5 30.1 26.9 64.1 32.5 100.5-35.4 5.2-63.4 22.8-77.1 52.1z"/>
                </svg>
                <div className="btn-text">
                  <span className="btn-small">Download on the</span>
                  <span className="btn-large">App Store</span>
                </div>
              </motion.a>
            </div>
          </motion.div>
          
          {/* Right Content - Phone Mockup with Functional Radio */}
          <motion.div 
            className="app-banner-mockup"
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="phone-mockup">
              <div className="phone-screen">
                <div className="phone-status-bar">
                  <span className="time">9:41</span>
                  <div className="status-icons">
                    <i className="fas fa-signal"></i>
                    <i className="fas fa-wifi"></i>
                    <i className="fas fa-battery-three-quarters"></i>
                  </div>
                </div>
                <div className="phone-content">
                  <div className="app-logo-mini">
                    <i className="fas fa-radio"></i>
                    <span className="logo-name">Petals</span>
                  </div>
                  
                  <div className="phone-feature-grid">
                    <div className="phone-feature">
                      <i className="fas fa-broadcast"></i>
                      <span>Live</span>
                    </div>
                    <div className="phone-feature">
                      <i className="fas fa-newspaper"></i>
                      <span>News</span>
                    </div>
                    <div className="phone-feature">
                      <i className="fas fa-music"></i>
                      <span>Music</span>
                    </div>
                    <div className="phone-feature">
                      <i className="fas fa-comment"></i>
                      <span>Chat</span>
                    </div>
                  </div>
                  
                  {/* Radio Player - Functional with real stream */}
                  <div className="phone-player">
                    <div className="player-header">
                      <div className="player-station">
                        <span className="station-name">Petals 102.3 FM</span>
                        <span className="station-frequency">
                          {isPlaying ? (
                            <span className="live-indicator">
                              <span className="blink-dot"></span>
                              {isBuffering ? 'BUFFERING' : 'LIVE'}
                            </span>
                          ) : (
                            'OFF AIR'
                          )}
                        </span>
                      </div>
                      <div className="player-signal">
                        <motion.div 
                          className="signal-bar"
                          animate={isPlaying && !isBuffering ? "playing" : "stopped"}
                          variants={waveVariants}
                        />
                        <motion.div 
                          className="signal-bar"
                          animate={isPlaying && !isBuffering ? "playing" : "stopped"}
                          variants={waveVariants}
                          transition={{ delay: 0.1 }}
                        />
                        <motion.div 
                          className="signal-bar"
                          animate={isPlaying && !isBuffering ? "playing" : "stopped"}
                          variants={waveVariants}
                          transition={{ delay: 0.2 }}
                        />
                        <motion.div 
                          className="signal-bar"
                          animate={isPlaying && !isBuffering ? "playing" : "stopped"}
                          variants={waveVariants}
                          transition={{ delay: 0.3 }}
                        />
                      </div>
                    </div>
                    
                    <div className="player-artwork">
                      <div className="artwork-content">
                        <i className="fas fa-radio"></i>
                        <span>102.3 FM</span>
                      </div>
                      <motion.div 
                        className="artwork-pulse"
                        animate={isPlaying && !isBuffering ? "playing" : "stopped"}
                        variants={pulseVariants}
                      />
                      {isBuffering && isPlaying && (
                        <div className="buffering-overlay">
                          <span>Loading...</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="player-info">
                      <span className="player-title">Now Playing</span>
                      <span className="player-subtitle">
                        {isPlaying ? 'Petals 102.3 FM — Live Stream' : 'Tap play to listen live'}
                      </span>
                    </div>
                    
                    <div className="player-status-text">
                      <span className={`status-badge ${isBuffering && isPlaying ? 'buffering' : ''}`}>
                        {status}
                      </span>
                    </div>
                    
                    <div className="player-progress">
                      <div className="progress-bar">
                        <div 
                          className={`progress-fill ${isPlaying ? 'active' : ''}`}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <div className="progress-time">
                        <span>{formatTime(currentTime)}</span>
                        <span>{isPlaying ? 'LIVE' : '--:--'}</span>
                      </div>
                    </div>
                    
                    <div className="player-controls">
                      <button className="control-btn" aria-label="Previous">
                        <i className="fas fa-step-backward"></i>
                      </button>
                      <motion.button 
                        className={`control-btn play-btn ${isPlaying ? 'playing' : ''}`}
                        onClick={togglePlay}
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.1 }}
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                      >
                        <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`}></i>
                      </motion.button>
                      <button className="control-btn" aria-label="Next">
                        <i className="fas fa-step-forward"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="phone-home-button"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}