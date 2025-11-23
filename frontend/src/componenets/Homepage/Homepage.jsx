import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import Hero from "./Hero";
import Features from "./Features";
import HowItWorks from "./HowitWorks";
import FireSection from "./FireSection";
import FAQSection from "./FAQSection";
import CTASection from "./CTASection";
import Footer from "../Footer";

const Homepage = () => {
  const location = useLocation();

  useEffect(() => {
    const scrollToId = (id) => {
      if (!id) return;
      const el = document.getElementById(id);
      if (el) {
        // small timeout to allow page render/layout
        setTimeout(
          () => el.scrollIntoView({ behavior: "smooth", block: "start" }),
          50
        );
      }
    };

    // 1. check navigation state
    const requested = location?.state?.scrollTo;
    if (requested) {
      scrollToId(requested);
      // clear the state so back/refresh won't re-trigger
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname + (window.location.hash || "")
      );
      return;
    }

    // 2. support direct hash links like /#fireSection
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      scrollToId(id);
    }
  }, [location]);

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <FireSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Homepage;
