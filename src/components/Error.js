import { MainContextConsumer } from '../context/main-context';

export default function Error({ error }) {
  return (
    <MainContextConsumer>
      {ctx =>
        ctx.state.error !== '' && (
          <div style={styles.container}>
            {console.info(ctx.state.error)}
            <span style={styles.span}>Error: {ctx.state.error}</span>
          </div>
        )
      }
    </MainContextConsumer>
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
