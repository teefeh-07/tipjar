import React from 'react';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-links">
        <a href="/docs">Documentation</a>
        <a href="https://github.com/teefeh-07/tipjar" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="/docs/contributing">Contributing</a>
        <a href="https://explorer.hiro.so" target="_blank" rel="noopener noreferrer">Stacks Explorer</a>
      </div>
      <div className="footer-info">
        <p>&copy; {new Date().getFullYear()} Tipjar. Built on Stacks blockchain.</p>
        <p className="footer-tagline">Empowering creators through decentralized micro-tips.</p>
      </div>
    </footer>
  );
}
