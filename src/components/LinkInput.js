import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';

import useWindowDimensions from '../helpers/useWindowDimensions';
import isValidURL from '../helpers/isValidURL';

export default function LinkInput({ onChange, link, setShortLink, setError, setLoading }) {
  // state mgmt
  const { width } = useWindowDimensions();

  // helper function for handling link shortener button
  const handleShorten = async () => {
    // validate url
    if (isValidURL(link.trim())) {
      // make post request
      const res = await axios.post('.netlify/functions/shrink', { link: link.trim() });

      // clear error (if any), and set loading
      setError('');
      setLoading(true);

      // error check
      if (res.data) {
        if (res.data.success) {
          setShortLink(res.data.shortLink);
          setLoading(false);
        } else {
          // set error (if any)
          setError(res.data.error);
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError(res.data);
      }
    } else {
      setError('Your link is invalid');
    }
  };

  return (
    <Container style={{ ...styles.container, ...(width > 500 ? { width: '60%' } : { width: '90%' }) }}>
      <Row style={styles.row}>
        <Col xs={8} md={9}>
          <input placeholder={'Paste your link...'} style={styles.input} value={link} onChange={onChange} />
        </Col>
        <Col xs={4} md={3}>
          <button style={styles.button} onClick={() => handleShorten()}>
            Lite!
          </button>
        </Col>
      </Row>
    </Container>
  );
}

const styles = {
  container: {
    backgroundColor: '#eeeeee',
    margin: 'auto',
    marginTop: 40,
    height: 60,
    borderRadius: 8,
    padding: 0,
  },
  row: { height: '100%' },
  input: {
    backgroundColor: '#eeeeee',
    width: '100%',
    height: '100%',
    border: 'none',
    outline: 'none',
    paddingLeft: 20,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    fontFamily: "'Open Sans', sans-serif",
    fontWeight: 500,
    fontSize: '1.4em',
    color: '#9e9e9e',
  },
  button: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ff9bf5',
    outline: 'none',
    border: 'none',
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    fontFamily: "'Open Sans', sans-serif",
    fontWeight: 700,
    fontSize: '1.3em',
    color: '#0f0f22',
  },
};
