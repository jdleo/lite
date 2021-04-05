export default function () {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{process.env['APP_NAME'] ?? 'lite.fyi'}</h1>
      <p style={styles.subtitle}>
        Link shorteners are too complicated.
        <br /> This one just makes your links shorter.
      </p>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    textAlign: 'center',
    marginTop: 50,
  },
  title: {
    fontFamily: "'Itim', cursive",
    fontSize: '4em',
    color: '#0f0f22',
  },
  subtitle: {
    fontFamily: "'Open Sans', sans-serif",
    fontSize: '1.3em',
    marginTop: 30,
    fontWeight: 600,
    color: '#636467',
  },
};
