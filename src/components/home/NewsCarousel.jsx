// src/components/home/NewsCarousel.jsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './NewsCarousel.css';

const RSS_FEEDS = [
  'https://api.rss2json.com/v1/api.json?rss_url=https://punchng.com/feed/',
  'https://api.rss2json.com/v1/api.json?rss_url=https://www.vanguardngr.com/feed/',
  'https://api.rss2json.com/v1/api.json?rss_url=https://guardian.ng/feed/',
  'https://api.rss2json.com/v1/api.json?rss_url=https://dailypost.ng/feed/',
  'https://api.rss2json.com/v1/api.json?rss_url=https://www.premiumtimesng.com/feed/'
];

export default function NewsCarousel() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const allArticles = [];
      
      for (const feedUrl of RSS_FEEDS) {
        try {
          const response = await fetch(feedUrl);
          const data = await response.json();
          
          if (data.items && data.items.length > 0) {
            const articles = data.items.slice(0, 3).map((item) => ({
              id: `${data.feed?.title}-${item.guid || Math.random()}`,
              title: item.title || 'No title',
              excerpt: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) || 'Read more...',
              date: new Date(item.pubDate || Date.now()).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }),
              category: data.feed?.title || 'News',
              image: item.thumbnail || item.enclosure?.link || null,
              link: item.link || '#',
            }));
            allArticles.push(...articles);
          }
        } catch (err) {
          console.error('Failed to fetch from feed:', err);
          continue;
        }
      }

      if (allArticles.length > 0) {
        // Shuffle and take first 10
        const shuffled = allArticles.sort(() => 0.5 - Math.random());
        setPosts(shuffled.slice(0, 10));
      } else {
        setPosts(getFallbackNews());
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Unable to load news. Please refresh the page.');
      setPosts(getFallbackNews());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackNews = () => {
    return [
      {
        id: 1,
        title: 'Welcome to Petals 102.3 FM News',
        excerpt: 'Stay informed with the latest news, entertainment, and updates from Ibadan and beyond.',
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        category: 'Petals FM',
        image: null,
        link: '#',
      },
      {
        id: 2,
        title: 'Nigeria News Roundup',
        excerpt: 'Catch up on the most important stories making headlines across Nigeria today.',
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        category: 'Nigeria',
        image: null,
        link: '#',
      },
      {
        id: 3,
        title: 'Stay Tuned for Breaking News',
        excerpt: 'Petals 102.3 FM brings you the latest updates as they happen.',
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        category: 'Breaking',
        image: null,
        link: '#',
      },
    ];
  };

  useEffect(() => {
    if (posts.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % posts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [posts]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % posts.length);
  };

  if (loading) {
    return (
      <section className="news-section">
        <div className="container">
          <div className="news-loading">
            <div className="loader"></div>
            <p>Loading news...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="news-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="item--sub-title style9 show-line">
            News
            <span className="line-left"></span>
            <span className="line-right"></span>
          </div>
          <h3 className="item--title">News you can trust</h3>
        </motion.div>

        {error && (
          <div className="news-error">
            <p>{error}</p>
            <button onClick={fetchNews} className="btn btn-primary">
              <i className="fas fa-sync" /> Retry
            </button>
          </div>
        )}

        <div className="news-carousel">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              className="news-carousel-slide"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              {posts[currentSlide] && (
                <article className="news-card featured">
                  {posts[currentSlide].image ? (
                    <motion.img 
                      src={posts[currentSlide].image} 
                      alt={posts[currentSlide].title} 
                      className="news-card-img"
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.6 }}
                    />
                  ) : (
                    <div className="news-card-img-placeholder">
                      <i className="fas fa-newspaper" />
                    </div>
                  )}
                  <motion.div 
                    className="news-card-body"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <span className="news-card-category">{posts[currentSlide].category}</span>
                    <h3 className="news-card-title">{posts[currentSlide].title}</h3>
                    <p className="news-card-excerpt">{posts[currentSlide].excerpt}</p>
                    <div className="news-card-meta">
                      <span><i className="fas fa-calendar-alt" /> {posts[currentSlide].date}</span>
                    </div>
                  </motion.div>
                </article>
              )}
            </motion.div>
          </AnimatePresence>

          <motion.button 
            className="carousel-btn prev" 
            onClick={prevSlide}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <i className="fas fa-chevron-left" />
          </motion.button>

          <motion.button 
            className="carousel-btn next" 
            onClick={nextSlide}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <i className="fas fa-chevron-right" />
          </motion.button>
        </div>

        <motion.div 
          className="carousel-dots"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {posts.map((_, index) => (
            <motion.button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}