import { useState } from 'react';
import { useGlobal } from 'reactn';

export default function LinkOutput() {
  const [isCopying, setIsCopying] = useState(false);
  const [shortLink, setShortLink] = useGlobal('shortLink');

  const handleCopy = () => {
    if (isCopying || !shortLink) return;

    // Modern clipboard API
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shortLink).then(() => {
        setIsCopying(true);
        setTimeout(() => setIsCopying(false), 2000);
      });
    } else {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = shortLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setIsCopying(true);
      setTimeout(() => setIsCopying(false), 2000);
    }
  };

  if (!shortLink) return null;

  return (
    <div className="text-center" style={{ marginTop: '2rem' }}>
      <div className="result-box float-anim" onClick={handleCopy}>
        <div style={{ fontWeight: 700, fontSize: '1.4rem', letterSpacing: '-0.01em' }}>
          {isCopying ? 'Link Copied!' : shortLink}
        </div>
        <div
          style={{
            background: 'rgba(0,0,0,0.1)',
            padding: '8px 16px',
            borderRadius: '12px',
            fontSize: '0.9rem',
            fontWeight: 800
          }}
        >
          {isCopying ? '✅' : 'COPY'}
        </div>
      </div>
      <p style={{ marginTop: '1rem', opacity: 0.5, fontWeight: 500 }}>
        Tap the box to copy your new link
      </p>
    </div>
  );
}
