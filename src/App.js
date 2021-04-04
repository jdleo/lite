import { useState } from 'react';
import './App.css';

import { Navbar, Title, LinkInput, LinkOutput, Wave, Error } from './components';

function App() {
  // state mgmt
  const [link, setLink] = useState('');
  const [shortLink, setShortLink] = useState('');
  const [error, setError] = useState('');

  return (
    <>
      <Navbar />
      <Title />
      <LinkInput link={link} onChange={e => setLink(e.target.value)} setShortLink={setShortLink} setError={setError} />
      {error !== '' && <Error error={error} />}
      {shortLink !== '' && <LinkOutput shortLink={shortLink} setShortLink={setShortLink} />}
      <Wave />
    </>
  );
}

export default App;
