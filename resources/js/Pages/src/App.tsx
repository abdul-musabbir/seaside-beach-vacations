import Venmo from "./assets/venmo.svg";
import Zelle from "./assets/zelle.png";

import React, { Suspense, useEffect } from "react";
import ContactForm from "./components/ContactForm";
import Preloader from "./components/Preloader";

// Lazy-load components
const HeroSection = React.lazy(() => import("./components/HeroSection"));
const OurFeaturedTours = React.lazy(
    () => import("./components/OurFeaturedTours")
);
const FacilitiesSection = React.lazy(
    () => import("./components/FacilitiesSection")
);
const BookingGuideline = React.lazy(
    () => import("./components/BookingGuideline")
);
const HowToBook = React.lazy(() => import("./components/HowToBook"));
const TesnimonialsSection = React.lazy(
    () => import("./components/TesnimonialsSection")
);
const Footer = React.lazy(() => import("./components/Footer"));
const Headers = React.lazy(() => import("./components/Headers"));

function App() {
    useEffect(() => {
        document.title = "Seaside Beach Vacations";
    }, []);

    return (
        <div className="min-h-screen">
            <Suspense fallback={<Preloader />}>
                <Headers />
                <HeroSection />
                <div id="featured-tours">
                    <OurFeaturedTours />
                </div>

                <div id="features-and-amenities">
                    <FacilitiesSection />
                </div>

                <div id="how-to-book">
                    <BookingGuideline />
                </div>
                <HowToBook Venmo={Venmo} Zelle={Zelle} />
                <TesnimonialsSection />
                <div id="contact-us">
                    <ContactForm />
                </div>
                <Footer />
            </Suspense>
        </div>
    );
}

export default React.memo(App); // Wrap App with React.memo for optimization
