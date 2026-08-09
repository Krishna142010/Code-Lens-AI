import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer" style={{ padding: '40px 0', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
      <div className="footer-inner container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p className="footer-text" style={{ color: 'var(--text-muted)' }}>
          Built with ❤️ for Iris Hacks IV
        </p>
        <div className="footer-links" style={{ display: 'flex', gap: '16px' }}>
          <a href="#" style={{ color: 'var(--text-secondary)' }}>GitHub</a>
          <a href="https://iris-hacks-iv.devpost.com/" style={{ color: 'var(--text-secondary)' }}>DevPost</a>
        </div>
      </div>
    </footer>
  );
}
