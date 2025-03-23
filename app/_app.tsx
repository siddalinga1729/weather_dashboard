import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { initGA, logPageView } from '../utils/analytics'; // Create an analytics utility

function MyApp({ Component, pageProps }: { Component: React.ElementType; pageProps: any }) {
  const router = useRouter();

  useEffect(() => {
    initGA();
    logPageView();

    router.events.on('routeChangeComplete', logPageView);
    return () => {
      router.events.off('routeChangeComplete', logPageView);
    };
  }, [router.events]);

  return <Component {...pageProps} />;
}

export default MyApp; 