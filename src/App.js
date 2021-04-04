import { useState } from 'react';
import './App.css';

import { Navbar, Title, LinkInput, LinkOutput, Wave } from './components';

function App() {
  // state mgmt
  const [link, setLink] = useState('');
  const [shortLink, setShortLink] = useState('');

  return (
    <>
      <Navbar />
      <Title />
      <LinkInput link={link} onChange={e => setLink(e.target.value)} setShortLink={setShortLink} />
      {shortLink !== '' && <LinkOutput shortLink={shortLink} />}
      <Wave />
    </>
  );
}

export default App;
