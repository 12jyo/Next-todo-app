import '../styles/tailwind.css'
import '../styles/globals.css'
import {SessionProvider} from 'next-auth/react';

const MyApp = ({ Component,  pageProps: {session, ...pageProps} }) => {
  return (
    <SessionProvider session={session}>
      <div className="h-screen text-center text-gray-100 bg-gray-900">
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
};

export default MyApp;
