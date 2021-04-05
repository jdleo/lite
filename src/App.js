import { useState } from 'react';
import './App.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import { Navbar, Title, LinkInput, LinkOutput, Wave, Error, Spinner } from './components';

function App() {
  // state mgmt
  const [link, setLink] = useState('');
  const [shortLink, setShortLink] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Navbar />
      <Title />
      <LinkInput
        link={link}
        onChange={e => setLink(e.target.value)}
        setShortLink={setShortLink}
        setError={setError}
        setLoading={setLoading}
      />
      {loading && <Spinner />}
      {error !== '' && <Error error={error} />}
      {shortLink !== '' && <LinkOutput shortLink={shortLink} setShortLink={setShortLink} />}
      <Wave />
    </>
  );
}

export default App;
