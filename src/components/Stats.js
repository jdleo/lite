import { useEffect } from 'react';
import axios from 'axios';
import { useGlobal } from 'reactn';

export default function Stats() {
    const [count, setCount] = useGlobal('statsCount');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('/api/stats');
                setCount(res.data.count);
            } catch (err) {
                console.error('Failed to fetch stats');
            }
        };
        fetchStats();
    }, [setCount]);

    if (count === 0) return null;

    return (
        <div style={styles.container}>
            <span style={styles.number}>{count.toLocaleString()}</span>
            <span style={styles.text}> links generated thus far</span>
        </div>
    );
}

const styles = {
    container: {
        textAlign: 'center',
        marginBottom: '1.5rem',
        opacity: 0.8,
    },
    number: {
        fontWeight: 800,
        color: 'var(--primary)',
        fontSize: '1.2rem',
    },
    text: {
        fontWeight: 500,
        fontSize: '0.9rem',
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
};
