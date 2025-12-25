
import { useGlobal } from 'reactn';

export default function Spinner() {
  // state mgmt
  const [loading] = useGlobal('loading');

  return (
    loading && (
      <div style={styles.container}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  );
}

const styles = {
  container: {
    margin: 'auto',
    marginTop: 50,
    textAlign: 'center',
  },
};
