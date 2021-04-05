import Loader from 'react-loader-spinner';

export default function Spinner({ loading }) {
  return (
    <div style={styles.container}>
      <Loader type={'Circles'} color={'#ff9bf5'} height={100} width={100} style={{ margin: 'auto' }} />
    </div>
  );
}

const styles = {
  container: {
    margin: 'auto',
    marginTop: 50,
    textAlign: 'center',
  },
};
