// src/components/home/AboutSection.jsx
import { Link } from 'react-router-dom';
import SectionHeading from '../common/SectionHeading';

export default function AboutSection() {
  return (
    <section className="about-section">
      <div className="container">
        <div className="about-grid">
          <div className="about-content">
            <SectionHeading
              eyebrow="Who We Are"
              title="Ibadan's Most Trusted Voice"
              align="left"
            />
            <p>
              Petals 102.3 FM is a community radio station based in the heart of Ibadan, Oyo State.
              We are committed to delivering credible journalism, vibrant entertainment, and
              meaningful conversations that reflect the values and aspirations of our community.
            </p>
            <p>
              From breaking news to cultural programming, our team of dedicated broadcasters works
              tirelessly to keep you informed, engaged, and entertained — 24 hours a day, 7 days a week.
            </p>

            <div className="about-stats">
              <div className="stat-item">
                <span className="num">102.3</span>
                <span className="label">FM Frequency</span>
              </div>
              <div className="stat-item">
                <span className="num">24/7</span>
                <span className="label">Broadcasting</span>
              </div>
              <div className="stat-item">
                <span className="num">10+</span>
                <span className="label">Years On Air</span>
              </div>
            </div>

            <Link to="/about" className="btn btn-primary">
              Learn More <i className="fas fa-arrow-right" />
            </Link>
          </div>

          <div className="about-image">
            <div className="about-image-main">
              <img
                src="https://petals1023fm.com/wp-content/uploads/2024/09/petals_logo_copy-removebg-preview.png"
                alt="Petals 102.3 FM"
                style={{ background: 'linear-gradient(135deg, #081640, #0d2252)', padding: '40px', objectFit: 'contain' }}
              />
            </div>
            <div className="about-image-badge">
              <span className="big">102.3</span>
              <span className="small">FM Ibadan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
