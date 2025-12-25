import { setGlobal } from 'reactn';
import 'bootstrap/dist/css/bootstrap.css';

import '../index.css';
import '../App.css';

// set global, default state
setGlobal({
    error: '',
    link: '',
    loading: false,
    shortLink: '',
});

function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}

export default MyApp;
