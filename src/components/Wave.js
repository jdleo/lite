import Wave from 'react-wavify';

export default function WaveWrapper() {
  return (
    <Wave
      fill="#ff9bf5"
      paused={false}
      options={{
        height: 20,
        amplitude: 20,
        speed: 0.3,
        points: 5,
      }}
      style={{ position: 'fixed', bottom: -100 }}
    />
  );
}
