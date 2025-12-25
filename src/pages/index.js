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
