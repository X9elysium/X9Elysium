import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import Services from "./components/Services";
import CaseStudies from "./components/CaseStudies";
import Partners from "./components/Partners";
import WhyChooseUs from "./components/WhyChooseUs";
import Team from "./components/Team";
import Testimonials from "./components/Testimonials";
import Tweets from "./components/Tweets";
import FAQ from "./components/FAQ";
import CTABanner from "./components/CTABanner";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main id="main-content">
        <Hero />
        <Services />
        <CaseStudies />
        <Partners />
        <WhyChooseUs />
        <Team />
        <Testimonials />
        <Tweets />
        <FAQ />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
