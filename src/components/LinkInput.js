import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import useWindowDimensions from '../helpers/useWindowDimensions';

export default function LinkInput() {
  // state mgmt
  const { _, width } = useWindowDimensions();

  return (
    <Container style={{ ...styles.container, ...(width > 500 ? { width: '60%' } : { width: '90%' }) }}>
      <Row style={styles.row}>
        <Col xs={8} md={9}>
          <input placeholder={'Paste your link...'} style={styles.input} />
        </Col>
        <Col xs={4} md={3}>
          <button style={styles.button}>Lite!</button>
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
