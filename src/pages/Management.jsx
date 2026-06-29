// src/pages/Management.jsx

import '../styles/pages.css';
import PageHeader from '../components/common/PageHeader';

export default function Management() {
  return (
    <>
      <PageHeader
        title="Management"
        highlight=""
        subtitle="Meet the management of Petals FM 102.3 Ibadan – Your Premier Source for Entertainment and Information!"
        breadcrumb="Management"
      />
      <main>
        <section className="management-page">
          <div className="container">
            <div className="management-grid">
              {/* Yinka Odumakin */}
              <div className="management-card">
                <div className="management-card-image">
                  <img
                    src="https://petals1023fm.com/wp-content/uploads/2024/09/yinkaodumakin-600x600.webp"
                    alt="Yinka Odumakin"
                  />
                </div>
                <div className="management-card-body">
                  <h3>Yinka Odumakin</h3>
                  <span className="management-card-role">Former Chairman</span>
                  <p>
                    Yinka Odumakin, the former Chairman of Petals FM 102.3, was a multifaceted individual whose contributions resonated across various spheres. A political activist, journalist, media consultant, and staunch human rights advocate.
                  </p>
                  <a href="/yinka-odumakin" className="btn btn-outline">
                    Read More <i className="fas fa-arrow-right" />
                  </a>
                </div>
              </div>

              {/* Dr. Joe Odumakin */}
              <div className="management-card">
                <div className="management-card-image">
                  <img
                    src="https://petals1023fm.com/wp-content/uploads/2024/09/joeodumakin-600x600.webp"
                    alt="Dr. Joe Odumakin"
                  />
                </div>
                <div className="management-card-body">
                  <h3>Dr. Joe Odumakin</h3>
                  <span className="management-card-role">The Chairman</span>
                  <p>
                    Dr. Joe Odumakin, is a symbol of courage, justice and peace. She illuminates the path for countless individuals striving for a brighter tomorrow. Her journey, marked by academic excellence and unwavering determination, epitomizes resilience in the face of adversity.
                  </p>
                  <a href="/dr-joe-odumakin" className="btn btn-outline">
                    Read More <i className="fas fa-arrow-right" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}