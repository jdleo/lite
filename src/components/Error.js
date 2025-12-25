import { useGlobal } from 'reactn';

export default function Error() {
  const [error] = useGlobal('error');

  if (!error) return null;

  return (
    <div style={styles.container}>
      <div style={styles.badge}>
        {error}
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginTop: '2rem',
    display: 'flex',
    justifyContent: 'center',
  },
  badge: {
    background: 'rgba(255, 119, 119, 0.1)',
    color: '#ff7777',
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontWeight: 600,
    border: '1px solid rgba(255, 119, 119, 0.2)',
  },
};
