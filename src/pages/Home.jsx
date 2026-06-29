// src/pages/Home.jsx

import '../styles/home.css';
import Hero from '../components/home/Hero';
import QuickLinks from '../components/home/QuickLinks';
import AboutSection from '../components/home/AboutSection';
import VideoSection from '../components/home/VideoSection';
import AppBanner from '../components/home/AppBanner';
import NewsCarousel from '../components/home/NewsCarousel';
import ContactSection from '../components/home/ContactSection';

export default function Home() {
  return (
    <>
      <Hero />
      <QuickLinks />
      <AboutSection />
      <VideoSection />
      <NewsCarousel />
      <AppBanner />
      <ContactSection />
    </>
  );
}