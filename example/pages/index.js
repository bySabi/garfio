import Link, { PathPrefix } from '../components/link';

export default () => (
  <PathPrefix prefix={process.env.BACKEND_URL}>
    <div style={{ textAlign: 'center' }}>
      <h1>Garfio usage examples</h1>
      <ul style={{ listStyle: 'none' }}>
        <li>
          <Link href="/counterNested">
            <a>Nested Counters with "Container"</a>
          </Link>
        </li>
        <li>
          <Link href="/counters10x40">
            <a>Counters 10x40 with "Store"</a>
          </Link>
        </li>
        <li>
          <Link href="/counter">
            <a>Counter with "Simple"</a>
          </Link>
        </li>
      </ul>
    </div>
  </PathPrefix>
);
