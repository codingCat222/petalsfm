import './WhatsAppButton.css';

const WA_LINK = 'https://wa.me/2348062151752?text=Hello%20Petals%20102.3%20FM';

export default function WhatsAppButton() {
  return (
    <a
      href={WA_LINK}
      className="wa-float"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
    >
      <i className="fab fa-whatsapp wa-float__icon" />
      <span className="wa-float__label">Chat with us</span>
    </a>
  );
}