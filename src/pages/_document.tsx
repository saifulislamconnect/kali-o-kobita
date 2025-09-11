import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="bn">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="A beautiful Bengali poetry book in digital format" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
