// src/components/home/QuickLinks.jsx
import { Link } from 'react-router-dom';

const cards = [
  {
    to: '/petals-news',
    icon: 'flaticonv3 flaticonv3-newspaper',
    title: 'The News',
    desc: 'Updates about happenings across the globe.',
    cta: 'Get started',
    bg: 'https://demo.casethemes.net/consultio-immigration/wp-content/uploads/2019/12/gallery-02.jpg',
    type: 'dark',
  },
  {
    to: '/about',
    icon: 'flaticonv5 flaticonv5-work',
    title: 'About Petals',
    desc: 'What do we stand for at Petals 102.3 FM?',
    cta: 'Learn more',
    type: 'light',
  },
  {
    to: '/oaps',
    icon: 'flaticonv5 flaticonv5-user-profile',
    title: 'Petals OAP',
    desc: 'Know more about the voices behind the mic.',
    cta: 'Meet the OAPs',
    type: 'light',
  },
  {
    to: '/podcasts',
    icon: 'material zmdi zmdi-collection-music',
    title: 'Petals Podcasts',
    desc: 'Never miss a show. Listen anytime anywhere.',
    cta: 'Listen now',
    type: 'light',
  },
];

export default function QuickLinks() {
  return (
    <section className="quick-links">
      <div className="container">
        <div className="quick-links-grid">
          {cards.map((card) => (
            <Link 
              to={card.to} 
              key={card.to} 
              className={`ql-card ql-card--${card.type}`}
            >
              {card.type === 'dark' && (
                <>
                  <img src={card.bg} alt="" className="ql-card-bg" />
                  <div className="ql-card-overlay" />
                </>
              )}
              <div className="ql-card-inner">
                <div className="ql-icon-wrap">
                  <i className={card.icon} />
                </div>
                <h3 className="ql-title">{card.title}</h3>
                <p className="ql-desc">{card.desc}</p>
                <span className="ql-btn">
                  {card.cta} <i className="zmdi zmdi-long-arrow-right" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}