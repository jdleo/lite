import { useGlobal } from 'reactn';

export default function Spinner() {
  const [loading] = useGlobal('loading');

  if (!loading) return null;

  return (
    <div className="spinner-container">
      <div className="premium-spinner" role="status"></div>
    </div>
  );
}
