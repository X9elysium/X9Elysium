import TwSizeIndicator from "@components/TwSizeIndicator";
import config from "@config/config.json";
import { Html, Head, Main, NextScript } from 'next/document';
import Document from 'next/document';

const Document = () => {
  // destructuring items from config object
  // googletagmanager
  // test 2
  const { favicon } = config.site;
  return (
    <Html lang="en">
      <Head>

    <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
          <script async src="https://www.googletagmanager.com/gtag/js?id=GTM-PTM5F7CJ"></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'GTM-PTM5F7CJ');
              `,
            }}
          />
  
        {/* favicon */}
        <link rel="shortcut icon" href={favicon} />
        {/* theme meta */}
        <meta name="theme-name" content="andromeda-light-nextjs" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#fff"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#000"
        />
      </Head>
      <body>
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-PTM5F7CJ"
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
          </noscript>
        <Main />
        <TwSizeIndicator />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
