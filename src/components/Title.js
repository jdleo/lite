export default function Title() {
  return (
    <div className="title-section text-center">
      <h1 className="nav-brand float-anim" style={{ fontSize: '5.5rem', marginBottom: '1.5rem', display: 'inline-block' }}>
        {process.env['APP_NAME'] ?? 'lite.fyi'}
      </h1>
      <p style={styles.subtitle}>
        Stop sending ugly links.
        <br />
        <span style={{ opacity: 0.6, fontSize: '1.1rem' }}>
          Minimal. Fast. Privacy-first.
        </span>
      </p>
    </div>
  );
}

const styles = {
  subtitle: {
    fontSize: '1.8rem',
    fontWeight: 600,
    lineHeight: 1.3,
    maxWidth: '600px',
    margin: '0 auto 4rem auto',
    letterSpacing: '-0.02em',
  }
};
