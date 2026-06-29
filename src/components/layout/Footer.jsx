// src/components/layout/Footer.jsx

import { Link } from 'react-router-dom';
import '../../styles/footer.css';

const LOGO = 'https://petals1023fm.com/wp-content/uploads/2024/09/petals_logo_copy-removebg-preview.png';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <img src={LOGO} alt="Petals 102.3 FM" />
              </div>
              <p>
                Located in the vibrant city of Ibadan, Petals FM 102.3 is your go-to radio station for a diverse range of programming that caters to every taste.
              </p>
              <div className="footer-studio-lines">
                <h4>Studio Lines:</h4>
                <p>
                  <a href="tel:+2348150678262">0815 067 8262</a> | <a href="https://api.whatsapp.com/send?text=Hello%20Petals%20102.3%20FM&phone=+23408062151752">0806 215 1752</a> (Whatsapp)
                </p>
              </div>
            </div>

            <div className="footer-col">
              <h4>Newsletter</h4>
              <p>Subscribe our newsletter to get our latest update & news</p>
              <div className="footer-socials">
                <a href="https://www.facebook.com/PetalsFMIbadan" target="_blank" rel="noreferrer" aria-label="Facebook">
                  <i className="fab fa-facebook-f" />
                </a>
                <a href="https://www.tiktok.com/@petals102.3fm.iba" target="_blank" rel="noreferrer" aria-label="TikTok">
                  <i className="fab fa-tiktok" />
                </a>
                <a href="https://www.instagram.com/petalsfm1023" target="_blank" rel="noreferrer" aria-label="Instagram">
                  <i className="fab fa-instagram" />
                </a>
                <a href="https://www.x.com/petalsfm" target="_blank" rel="noreferrer" aria-label="Twitter">
                  <i className="fab fa-x-twitter" />
                </a>
                <a href="https://www.youtube.com/@PetalsFm102.3" target="_blank" rel="noreferrer" aria-label="YouTube">
                  <i className="fab fa-youtube" />
                </a>
              </div>
            </div>

            <div className="footer-col">
              <h4>Contact</h4>
              <div className="footer-contact-item">
                <div className="icon"><i className="fas fa-map-marker-alt" /></div>
                <div className="info">
                  11a Obe Street, Bodija,<br /> Ibadan, Nigeria
                </div>
              </div>
              <div className="footer-contact-item">
                <div className="icon"><i className="fas fa-phone-alt" /></div>
                <div className="info">
                  <a href="tel:+2348150678262">0815 067 8262 (Studio Line)</a>
                </div>
              </div>
              <div className="footer-contact-item">
                <div className="icon"><i className="fab fa-whatsapp" /></div>
                <div className="info">
                  <a href="https://api.whatsapp.com/send?text=Hello%20Petals%20102.3%20FM&phone=+23408062151752">0806-215-1752 (Whatsapp)</a>
                </div>
              </div>
              <div className="footer-contact-item">
                <div className="icon"><i className="fas fa-envelope" /></div>
                <div className="info">
                  <a href="mailto:news@petals1023fm.com">news@petals1023fm.com</a><br />
                  <a href="mailto:info@petals1023fm.com">info@petals1023fm.com</a>
                </div>
              </div>
            </div>

            <div className="footer-col">
              <h4>Instagram</h4>
              <div className="footer-instagram-placeholder">
                <p>Error: No feed found.</p>
                <p>Please go to the Instagram Feed settings page to create a feed.</p>
              </div>
              <div className="footer-app-buttons">
                <a href="https://play.google.com/store/apps/details?id=com.petals1023fm.app" target="_blank" rel="noreferrer">
                  <img src="https://petals1023fm.com/wp-content/uploads/2019/10/petals-android.png" alt="Google Play" />
                </a>
                <a href="https://apps.apple.com/us/app/petals-102-3-fm-official/id6730125718" target="_blank" rel="noreferrer">
                  <img src="https://petals1023fm.com/wp-content/uploads/2019/10/5a902db97f96951c82922874.png" alt="App Store" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© 2024 All rights reserved. Petals 102.3 FM.</p>
        </div>
      </div>
    </footer>
  );
}