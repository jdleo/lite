import { Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';

export default function NavbarWrapper() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference on load
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <nav className="nav-container">
      <Container className="d-flex align-items-center justify-content-between">
        <a href="/" className="nav-brand">
          {process.env['APP_NAME'] ?? 'lite.fyi'}
        </a>
        <div className="d-flex align-items-center">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="nav-link border-0 background-none cursor-pointer"
            style={{ background: 'none', cursor: 'pointer' }}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <a
            href="https://github.com/jdleo/lite"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            GitHub
          </a>
        </div>
      </Container>
    </nav>
  );
}
