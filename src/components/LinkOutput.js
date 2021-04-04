import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import useWindowDimensions from '../helpers/useWindowDimensions';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function LinkOutput({ shortLink, setShortLink }) {
  // state mgmt
  const { _, width } = useWindowDimensions();
  const [isCopying, setIsCopying] = useState(false);

  // helper method to handle when container is tapped (should copy text)
  const handleCopy = () => {
    if (isCopying) return;

    // create temporary text area
    var textArea = document.createElement('textarea');
    textArea.value = shortLink;

    // avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    // focus and select
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    // try to copy
    try {
      var successful = document.execCommand('copy');
    } catch (err) {}

    // show copied to user, and get temp text
    setIsCopying(true);
    const temp = shortLink;
    setShortLink('Copied!');

    // remove temp text area
    document.body.removeChild(textArea);

    // after 1 second, remove copied text
    setTimeout(() => {
      setIsCopying(false);
      setShortLink(temp);
    }, 1000);
  };

  return (
    <Container
      style={{ ...styles.container, ...(width > 500 ? { width: '40%' } : { width: '80%' }) }}
      onClick={() => handleCopy()}
    >
      <Row style={styles.row}>
        <Col xs={9} className="align-self-center text-center" style={styles.linkContainer}>
          <span>{shortLink}</span>
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
    cursor: 'pointer',
  },
  col: { textAlign: 'center', verticalAlign: 'middle' },
  linkContainer: { fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: '1.4em' },
  copyContainer: {
    fontSize: '1.4em',
  },
  row: { height: '100%', color: '#0f0f22' },
};
