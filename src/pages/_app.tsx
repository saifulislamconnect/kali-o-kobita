import '@/styles/globals.css';
import { AppProps } from 'next/app';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;700&display=swap" rel="stylesheet" />
        <title>কালি ও কবিতা - একটি বাংলা প্রেমের প্রচেষ্টা</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
