import config from "@config/config.json";
import theme from "@config/theme.json";
import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";
import TagManager from "react-gtm-module";
import "styles/style.scss";

const App = ({ Component, pageProps }) => {
  const pf = theme.fonts.font_family.primary;
  const sf = theme.fonts.font_family.secondary;
  const [fontcss, setFontcss] = useState();
  
  useEffect(() => {
    fetch(
      `https://fonts.googleapis.com/css2?family=${pf}${
        sf ? "&family=" + sf : ""
      }&display=swap`
    ).then((res) => res.text().then((css) => setFontcss(css)));
  }, [pf, sf]);

  const tagManagerArgs = {
    gtmId: config.params.tag_manager_id,
  };
  
  useEffect(() => {
    setTimeout(() => {
      process.env.NODE_ENV === "production" &&
        config.params.tag_manager_id &&
        TagManager.initialize(tagManagerArgs);
    }, 5000);
  }, []);

  return (
    <>
      <Head>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `${fontcss}`,
          }}
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
      </Head>

      {/* Google Tag (gtag.js) */}
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-2SHBLBMKK0" />
      <Script id="google-tag">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-2SHBLBMKK0');
        `}
      </Script>

      {/* Klaviyo script */}
      <Script
        src="//static.klaviyo.com/onsite/js/klaviyo.js?company_id=XpEmXv"
        strategy="afterInteractive"
      />

      <Component {...pageProps} />
    </>
  );
};

export default App;
