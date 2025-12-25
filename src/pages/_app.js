import { setGlobal } from 'reactn';
import 'bootstrap/dist/css/bootstrap.css';

import '../index.css';
import '../App.css';

setGlobal({
    error: '',
    link: '',
    loading: false,
    shortLink: '',
    statsCount: 0,
});

function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}

export default MyApp;
