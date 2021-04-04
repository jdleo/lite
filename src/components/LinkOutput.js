import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import useWindowDimensions from '../helpers/useWindowDimensions';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function LinkOutput() {
  // state mgmt
  const { _, width } = useWindowDimensions();

  return (
    <Container style={{ ...styles.container, ...(width > 500 ? { width: '40%' } : { width: '80%' }) }}>
      <Row style={styles.row}>
        <Col xs={9} className="align-self-center text-center" style={styles.linkContainer}>
          link.fyi/bV56o
        </Col>
        <Col xs={3} className="align-self-center text-center" style={styles.copyContainer}>
          <FontAwesomeIcon icon={faCopy} />
        </Col>
      </Row>
    </Container>
  );
}

const styles = {
  container: {
    backgroundColor: '#ff9bf5',
    margin: 'auto',
    marginTop: 50,
    height: 70,
    borderRadius: 8,
    padding: 0,
  },
  col: { textAlign: 'center', verticalAlign: 'middle' },
  linkContainer: { fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: '1.4em' },
  copyContainer: {
    fontSize: '1.4em',
  },
  row: { height: '100%', color: '#0f0f22' },
};
