import config from "@config/config.json";
import theme from "@config/theme.json";
import Head from "next/head";
import Script from "next/script"; // Import Script component
import { useEffect, useState } from "react";
import TagManager from "react-gtm-module";
import "styles/style.global.scss";

const App = ({ Component, pageProps }) => {
  // Import google font css
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

  // Google Tag Manager (GTM)
  const tagManagerArgs = {
    gtmId: config.params.tag_manager_id,
  };

  useEffect(() => {
    if (process.env.NODE_ENV === "production" && config.params.tag_manager_id) {
      TagManager.initialize(tagManagerArgs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        {/* Google font css */}
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
        {/* Responsive meta */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
      </Head>
      {/* GTM script */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${config.params.tag_manager_id}');`,
        }}
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${config.params.tag_manager_id}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        ></iframe>
      </noscript>
      <Component {...pageProps} />
    </>
  );
};

export default App;
