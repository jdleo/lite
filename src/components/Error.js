import { useGlobal } from 'reactn';

export default function Error() {
  // get global hook for error
  const [error] = useGlobal('error');

  return (
    error !== '' && (
      <div style={styles.container}>
        <span style={styles.span}>Error: {error}</span>
      </div>
    )
  );
}

const styles = {
  container: {
    marginTop: 40,
    width: '100%',
    textAlign: 'center',
  },
  span: {
    fontFamily: "'Open Sans', sans-serif",
    fontSize: '1em',
    marginTop: 30,
    fontWeight: 600,
    color: '#ff7777',
  },
};
