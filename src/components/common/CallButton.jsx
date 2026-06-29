import './CallButton.css';

const CALL_LINK = 'tel:+2348150678262';

export default function CallButton() {
  return (
    <a
      href={CALL_LINK}
      className="call-float"
      aria-label="Call Petals 102.3 FM studio line"
    >
      <i className="fas fa-phone-alt call-float__icon" />
      <span className="call-float__label">Studio line</span>
    </a>
  );
}