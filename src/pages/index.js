import Head from 'next/head';
import LinkInput from '../components/LinkInput';
import Navbar from '../components/Navbar';
import Title from '../components/Title';
import LinkOutput from '../components/LinkOutput';
import Wave from '../components/Wave';
import Error from '../components/Error';
import Spinner from '../components/Spinner';
import Stats from '../components/Stats';

export default function Home() {
    return (
        <>
            <Head>
                <meta name="google-site-verification" content="dhSzTdOJZ38TMDMcHz_0Wy1CY3i-Pja-AtUK66Po6MY" />
            </Head>
            <Navbar />
            <Title />
            <Stats />
            <LinkInput />
            <Spinner />
            <Error />
            <LinkOutput />
            <Wave />
        </>
    );
}
