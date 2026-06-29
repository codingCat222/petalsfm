// src/components/common/SectionHeading.jsx
export default function SectionHeading({ eyebrow, title, subtitle, align = 'center' }) {
  return (
    <div className="section-heading" style={{ textAlign: align }}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}
