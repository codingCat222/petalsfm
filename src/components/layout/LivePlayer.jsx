// src/components/layout/LivePlayer.jsx

import { useState, useRef, useEffect } from 'react';
import '../../styles/player.css';

const LOGO = 'https://petals1023fm.com/wp-content/uploads/2024/09/petals_logo_copy-removebg-preview.png';
const STREAM_URL = 'https://radio.fmmaria.com:8070/radio.mp3';

export default function LivePlayer() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [status, setStatus] = useState('Ready to play');
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(STREAM_URL);
    audio.volume = volume;
    audioRef.current = audio;

    audio.addEventListener('waiting', () => setStatus('Buffering...'));
    audio.addEventListener('playing', () => setStatus('Live'));
    audio.addEventListener('error', () => setStatus('Stream unavailable'));
    audio.addEventListener('stalled', () => setStatus('Connecting...'));

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      audio.src = '';
      setPlaying(false);
      setStatus('Paused');
    } else {
      audio.src = STREAM_URL;
      audio.volume = volume;
      audio.play().catch(() => setStatus('Playback failed'));
      setPlaying(true);
      setStatus('Connecting...');
    }
  };

  const handleVolume = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const isBuffering = status === 'Buffering...' || status === 'Connecting...';

  return (
    <div className="live-player">
      <div className="player-inner">
        <div className="player-station">
          <img src={LOGO} alt="Petals FM" className="player-logo" />
          <div className="player-station-name">
            Petals FM
            <span>102.3 Ibadan</span>
          </div>
        </div>

        {playing && (
          <div className="player-live-badge">
            <span className="blink" />
            Live
          </div>
        )}

        <div className="player-controls">
          <button
            className={`player-play-btn ${playing ? 'playing' : ''}`}
            onClick={togglePlay}
            aria-label={playing ? 'Pause' : 'Play live stream'}
          >
            <i className={`fas fa-${playing ? 'pause' : 'play'}`} />
          </button>
        </div>

        <div className="player-now-playing">
          <div className="label">Now Playing</div>
          <div className="track">
            {playing ? 'Petals 102.3 FM — Live Stream' : 'Tap play to listen live'}
          </div>
        </div>

        <div className={`player-status ${isBuffering ? 'buffering' : ''}`}>
          {status}
        </div>

        <div className="player-volume">
          <i className={`fas fa-volume-${volume === 0 ? 'xmark' : volume < 0.5 ? 'low' : 'high'}`} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolume}
            className="volume-slider"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}