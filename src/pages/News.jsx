import { useState, useEffect } from 'react';
import './news.css';
import PageHeader from '../components/common/PageHeader';

const CATEGORY_SLUGS = ["All", "Business", "Creative", "Oyo State", "Politics", "Sports", "Strategy"];

export default function News() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeCategorySlug, setActiveCategorySlug] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryMap, setCategoryMap] = useState({});
  const [categoryCounts, setCategoryCounts] = useState({});
  const postsPerPage = 6;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://petals1023fm.com/wp-json/wp/v2/categories?per_page=100');
        const data = await res.json();

        const idToName = {};
        const nameToId = {};
        data.forEach(cat => {
          idToName[cat.id] = cat.name;
          nameToId[cat.name.toLowerCase()] = cat.id;
        });

        setCategoryMap({ idToName, nameToId });

        const counts = { All: 0 };
        const allRes = await fetch('https://petals1023fm.com/wp-json/wp/v2/posts?per_page=1');
        counts.All = parseInt(allRes.headers.get('X-WP-Total')) || 0;

        for (const slug of CATEGORY_SLUGS) {
          if (slug === 'All') continue;
          const catId = nameToId[slug.toLowerCase()];
          if (catId) {
            const r = await fetch(
              `https://petals1023fm.com/wp-json/wp/v2/posts?per_page=1&categories=${catId}`
            );
            counts[slug] = parseInt(r.headers.get('X-WP-Total')) || 0;
          } else {
            counts[slug] = 0;
          }
        }
        setCategoryCounts(counts);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (Object.keys(categoryMap).length === 0) return;
    fetchPosts();
  }, [activeCategory, currentPage, categoryMap]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const categoryParam = activeCategory ? `&categories=${activeCategory}` : '';
      const response = await fetch(
        `https://petals1023fm.com/wp-json/wp/v2/posts?per_page=${postsPerPage}&page=${currentPage}${categoryParam}&_embed`
      );

      const total = response.headers.get('X-WP-Total');
      setTotalPages(Math.ceil(parseInt(total) / postsPerPage));

      const data = await response.json();

      const formattedPosts = data.map(post => {
        const catId = post.categories?.[0];
        const categoryName = catId ? (categoryMap.idToName?.[catId] || 'General') : 'General';
        const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;
        const dateObj = new Date(post.date);

        return {
          id: post.id,
          title: post.title.rendered,
          excerpt: post.excerpt.rendered.replace(/<[^>]*>/g, ''),
          date: dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          dateObj,
          category: categoryName,
          image: imageUrl,
          link: post.link,
        };
      });

      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (slug) => {
    const catId = slug === 'All' ? null : categoryMap.nameToId?.[slug.toLowerCase()] || null;
    setActiveCategory(catId);
    setActiveCategorySlug(slug);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="news-loading">
        <div className="loader"></div>
        <p>Loading news...</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Petals"
        highlight="News"
        subtitle="Breaking stories, community updates, and in-depth reporting from Ibadan and beyond."
        breadcrumb="Petals News"
      />

      <section className="news-page">
        <div className="container">
          <div className="news-page-layout">

            <div className="news-main">
              {posts.length === 0 ? (
                <div className="no-news">
                  <p>No news articles found.</p>
                </div>
              ) : (
                <div className="news-hentry">
                  {posts.map((post) => (
                    <article key={post.id} className="single-hentry">
                      {post.image && (
                        <div className="entry-featured">
                          <a href={post.link} style={{ backgroundImage: `url(${post.image})` }}>
                            <img src={post.image} alt={post.title} />
                          </a>
                          <div className="entry-date">
                            <span>{String(post.dateObj.getDate()).padStart(2, '0')}</span>
                            <span>
                              {post.dateObj.toLocaleDateString('en-US', {
                                month: 'short',
                                year: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="entry-body">
                        <div className="entry-holder">
                          <h2 className="entry-title">
                            <a href={post.link}>{post.title}</a>
                          </h2>
                          <ul className="entry-meta">
                            <li className="item-date">
                              <i className="fac fac-calendar-alt" /> {post.date}
                            </li>
                            <li className="item-author">
                              <i className="fac fac-user" /> <a href="#">News Room</a>
                            </li>
                            <li className="item-comment">
                              <i className="fac fac-comments" /> <a href="#">No Comments</a>
                            </li>
                          </ul>
                          <div className="entry-excerpt">{post.excerpt}…</div>
                          <div className="entry-readmore">
                            <a href={post.link} className="btn-text text-gradient">
                              <i className="fac fac-angle-right" />
                              <span>Read More</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="news-pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <i className="fas fa-chevron-left" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                    <button
                      key={num}
                      className={num === currentPage ? 'active' : ''}
                      onClick={() => setCurrentPage(num)}
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <i className="fas fa-chevron-right" />
                  </button>
                </div>
              )}
            </div>

            {/* FIX 1: Repaired broken <a tag — attributes were floating outside the opening tag */}
            {/* FIX 2: Added missing </aside> closing tag */}
            <aside className="news-sidebar">
              <div className="sidebar-widget">
                <h4>Categories</h4>
                <ul className="sidebar-categories">
                  {CATEGORY_SLUGS.map(slug => (
                    <li key={slug}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCategoryClick(slug);
                        }}
                        className={activeCategorySlug === slug ? 'active' : ''}
                      >
                        {slug}
                        <span className="count">{categoryCounts[slug] ?? 0}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="sidebar-widget listen-live">
                <h4>Listen Live</h4>
                <p>Tune in to Petals 102.3 FM live and catch all the latest news as it happens.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => document.querySelector('.player-play-btn')?.click()}
                >
                  <i className="fas fa-play" /> Play Live Stream
                </button>
              </div>
            </aside>

          </div>
        </div>
      </section>
    </>
  );
}