import { Head } from "@inertiajs/react";
import React, { Suspense } from "react";
import Venmo from "./assets/venmo.svg";
import Zelle from "./assets/zelle.png";
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

function App({ listing_data }: { listing_data: any }) {
    return (
        <div className="min-h-screen">
            <Head title="Home" />
            <Suspense fallback={<Preloader />}>
                <Headers datas={listing_data} />
                <HeroSection />
                <div id="featured-tours">
                    <OurFeaturedTours ourFeaturedData={listing_data} />
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

export default React.memo(App);
