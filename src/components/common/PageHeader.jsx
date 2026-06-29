// src/components/common/PageHeader.jsx
import { Link } from 'react-router-dom';

export default function PageHeader({ title, highlight, subtitle, breadcrumb }) {
  return (
    <div className="page-header">
      <div className="container">
        {breadcrumb && (
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">›</span>
            <span>{breadcrumb}</span>
          </div>
        )}
        <h1>
          {title} {highlight && <span>{highlight}</span>}
        </h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}
