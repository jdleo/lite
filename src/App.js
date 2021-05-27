import './App.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import { Navbar, Title, LinkInput, LinkOutput, Wave, Error, Spinner } from './components';

function App() {
  return (
    <>
      <Navbar />
      <Title />
      <LinkInput />
      <Spinner />
      <Error />
      <LinkOutput />
      <Wave />
    </>
  );
}

export default App;
