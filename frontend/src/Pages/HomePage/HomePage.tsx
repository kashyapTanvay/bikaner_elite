import WhatWeOffer from "../../components/HomeComponents/WhatWeOffer/WhatWeOffer";
import Hero from "../../components/HomeComponents/Hero/Hero";
import FeaturedProducts from "../../components/HomeComponents/FeaturedProducts/FeaturedProducts";
import AboutSection from "../../components/HomeComponents/AboutSection/AboutSection";
import StoresSection from "../../components/HomeComponents/StoresSection/StoresSection";
import CTASection from "../../components/HomeComponents/CTASection/CTASection";
import BestSellers from "../../components/HomeComponents/BestSellers/BestSellers";
import HealthyRange from "../../components/HomeComponents/HealthyRange/HealthyRange";
import Celebrate from "../../components/HomeComponents/Celebrate/Celebrate";
import Reviews from "../../components/HomeComponents/Reviews/Reviews";
import Innovation from "../../components/HomeComponents/Innovation/Innovation";
import Availability from "../../components/HomeComponents/Availability/Availability";

const HomePage = () => {
  return (
    <>
      <section className="section" style={{ paddingBottom: 0 }}>
        <Hero />
      </section>
      <WhatWeOffer />
      <BestSellers />
      <FeaturedProducts />
      <HealthyRange />
      <Celebrate />
      <AboutSection />
      <StoresSection />
      <Innovation />
      <Reviews />
      <CTASection />
      <Availability />
    </>
  );
};

export default HomePage;
