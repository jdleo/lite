import axios from 'axios';
import { useGlobal } from 'reactn';
import isValidURL from '../helpers/isValidURL';

export default function LinkInput() {
  const [error, setError] = useGlobal('error');
  const [link, setLink] = useGlobal('link');
  const [loading, setLoading] = useGlobal('loading');
  const [shortLink, setShortLink] = useGlobal('shortLink');
  const [statsCount, setStatsCount] = useGlobal('statsCount');

  const handleShorten = async () => {
    if (!link.trim()) return;

    if (isValidURL(link.trim())) {
      setError('');
      setLoading(true);
      setShortLink('');

      // Optimistic Update
      setStatsCount(statsCount + 1);

      // Give the premium spinner some stage time
      await new Promise(r => setTimeout(r, 600));

      const generateProof = async (ts) => {
        const SALT = 'lite-fyi-2026-experimental-salt';
        const msgBuffer = new TextEncoder().encode(ts + SALT);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      };

      try {
        const ts = Date.now();
        const proof = await generateProof(ts);
        const res = await axios.post('/api/shrink', { link: link.trim(), proof, ts });

        if (!res.data?.success) {
          // Rollback on failure
          setStatsCount(statsCount);
          setError(res.data.error || 'Something went wrong');
        } else {
          setShortLink(res.data.shortLink);
        }
      } catch (err) {
        // Rollback on network error
        setStatsCount(statsCount);
        setError('Failed to reach server');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Invalid link format');
    }
  };

  return (
    <div className="search-wrapper">
      <input
        className="search-input"
        type="url"
        placeholder="Drop a long link here..."
        value={link}
        onChange={e => setLink(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleShorten()}
      />
      <button
        className="search-button"
        onClick={handleShorten}
        disabled={loading || !link.trim()}
      >
        {loading ? (
          <div className="btn-spinner" role="status"></div>
        ) : 'Shorten'}
      </button>
    </div>
  );
}
