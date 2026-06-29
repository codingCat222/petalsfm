import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/global.css';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LivePlayer from './components/layout/LivePlayer';
import WhatsAppButton from './components/common/WhatsAppButton';
import CallButton from './components/common/CallButton';

import Home from './pages/Home';
import About from './pages/About';
import Management from './pages/Management';
import OAPs from './pages/OAPs';
import Podcasts from './pages/Podcasts';
import News from './pages/News';
import Contact from './pages/Contact';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/management" element={<Management />} />
          <Route path="/oaps" element={<OAPs />} />
          <Route path="/podcasts" element={<Podcasts />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
      <LivePlayer />
      <CallButton />
      <WhatsAppButton />
    </BrowserRouter>
  );
}