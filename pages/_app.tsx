import type { AppProps } from 'next/app';
import '../app/globals.css'; // adjust path if needed

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;