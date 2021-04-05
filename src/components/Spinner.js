import PuffLoader from 'react-spinners/PuffLoader';

export default function Spinner({ loading }) {
  return (
    <div style={styles.container}>
      <PuffLoader color={'#ff9bf5'} size={100} loading={loading} css={{ display: 'block', margin: '0 auto' }} />
    </div>
  );
}

const styles = {
  container: {
    margin: 'auto',
    marginTop: 50,
  },
};
