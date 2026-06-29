// src/components/home/Hero.jsx

import { useState, useEffect, useCallback } from 'react';
import './Hero.css';

const slides = [
  {
    id: 1,
    image: 'https://petals1023fm.com/wp-content/uploads/2024/09/rsw_1300h_800-5.webp',
    eyebrow: 'Live from Ibadan',
    heading: ['Your Voice,', 'Your Station'],
    sub: 'Petals 102.3 FM — news, music, and conversations that move the city.',
  },
  {
    id: 2,
    image: 'https://petals1023fm.com/wp-content/uploads/2024/09/rsw_984h_537.webp',
    eyebrow: 'Credible Journalism',
    heading: ['Truth You Can', 'Trust'],
    sub: 'Delivering accurate, impactful reporting to the Ibadan community and beyond.',
  },
  {
    id: 3,
    image: 'https://petals1023fm.com/wp-content/uploads/2024/09/rsw_1300h_800-6.webp',
    eyebrow: 'Community First',
    heading: ['The Voice of', 'Ibadan'],
    sub: 'From breaking news to culture, we bring the pulse of the city to your ears every day.',
  },
  {
    id: 4,
    image: 'https://petals1023fm.com/wp-content/uploads/2024/09/rsw_1160h_633.webp',
    eyebrow: 'Entertainment & Culture',
    heading: ['Music That Moves', 'You'],
    sub: 'The best in Afrobeats, news, talk, and everything in between — 24/7.',
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToSlide = useCallback((index) => {
    setCurrent(index);
  }, []);

  // Auto-play with pause on hover
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(nextSlide, 5500);
    return () => clearInterval(interval);
  }, [isPlaying, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <section 
      className="hero"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Slides */}
      <div className="hero-slides-wrapper">
        {slides.map((slide, i) => (
          <div 
            key={slide.id} 
            className={`hero-slide ${i === current ? 'active' : ''}`}
            style={{
              transform: i === current ? 'scale(1)' : 'scale(1.05)',
              transition: 'transform 0.8s ease, opacity 0.8s ease'
            }}
          >
            <img src={slide.image} alt="" />
            <div className="hero-overlay" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="hero-content">
        <div className="container">
          <div className="hero-text">
            <div className="hero-eyebrow">
              <span>{slides[current].eyebrow}</span>
            </div>
            <h1>
              {slides[current].heading[0]}
              <span className="accent">{slides[current].heading[1]}</span>
            </h1>
            <p>{slides[current].sub}</p>
            <div className="hero-actions">
              <button
                className="btn btn-primary"
                onClick={() => document.querySelector('.player-play-btn')?.click()}
              >
                <i className="fas fa-play" /> Listen Live
              </button>
              <a href="/news" className="btn btn-outline">
                Latest News
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="hero-controls">
        <button 
          className="hero-nav-btn prev" 
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <i className="fas fa-chevron-left" />
        </button>
        <button 
          className="hero-nav-btn next" 
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <i className="fas fa-chevron-right" />
        </button>
      </div>

      {/* Dots */}
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === current ? 'active' : ''}`}
            onClick={() => goToSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Play/Pause Button */}
      <button 
        className="hero-play-btn"
        onClick={() => setIsPlaying(!isPlaying)}
        aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
      >
        <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`} />
      </button>

      {/* Scroll Indicator */}
      <div className="hero-scroll">
        <span>Scroll</span>
        <i className="fas fa-chevron-down" />
      </div>
    </section>
  );
}