import { setGlobal } from 'reactn';
import 'bootstrap/dist/css/bootstrap.css';

import '../index.css';
import '../App.css';

import { Analytics } from '@vercel/analytics/next';

setGlobal({
    error: '',
    link: '',
    loading: false,
    shortLink: '',
    statsCount: 0,
});

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Component {...pageProps} />
            <Analytics />
        </>
    );
}

export default MyApp;
