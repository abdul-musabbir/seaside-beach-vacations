import { Head } from "@inertiajs/react";
import { MapPin } from "lucide-react";
import { lazy, Suspense, useEffect } from "react";
import BookingCalendar from "../components/BookingCalendar";
import Headers from "../components/Headers";
import Preloader from "../components/Preloader";
import ReviewSliderSinglePage from "../components/ReviewSliderSinglePage";

// Lazy-load components
const Footer = lazy(() => import("../components/Footer"));
const BookingForm = lazy(() => import("../components/BookingForm"));
const ImageSlider = lazy(() => import("../components/ImageSlider"));
const ImageGallery = lazy(() => import("../components/ImageGallery"));
const PropertyFeatures = lazy(() => import("../components/PropertyFeatures"));

function SinglePage({
    single_data,
    all_titles,
}: {
    single_data: any;
    all_titles: any;
}) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title={single_data?.title} />
            <Headers datas={all_titles} />

            {/* Image Slider */}
            <Suspense fallback={<Preloader />}>
                <ImageSlider
                    images={JSON.parse(single_data?.gallery_images || "[]")}
                />
            </Suspense>

            <div className="w-[92%] xl:max-w-screen-xl mx-auto px-4 py-16">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Content Area */}
                    <div className="flex-1 flex flex-col space-y-20">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold text-gray-900">
                                {single_data?.title}
                            </h1>
                            <div className="flex items-center gap-2 mt-2 text-gray-600">
                                <MapPin className="w-5 h-5" />
                                <span>{single_data?.location}</span>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                {single_data?.description}
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Features & Amenities
                            </h2>
                            <Suspense fallback={<div>Loading features...</div>}>
                                <PropertyFeatures />
                            </Suspense>
                        </div>

                        <BookingCalendar />

                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Photo Gallery
                            </h2>
                            <Suspense fallback={<div>Loading gallery...</div>}>
                                <ImageGallery
                                    images={JSON.parse(
                                        single_data?.gallery_images || "[]"
                                    )}
                                />
                            </Suspense>
                        </div>

                        <div className="w-full lg:max-w-2xl">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Reviews
                            </h2>
                            <div className="">
                                <div className="">
                                    <ReviewSliderSinglePage
                                        reivews={JSON.parse(
                                            single_data.reivews
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Location
                            </h2>
                            <div className="aspect-video rounded-lg overflow-hidden">
                                <iframe
                                    src={single_data?.map_url}
                                    className="w-full"
                                    height="450"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Booking Form */}
                    <div className="lg:w-[400px] flex-shrink-0">
                        <div className="sticky top-28">
                            <Suspense
                                fallback={<div>Loading booking form...</div>}
                            >
                                <BookingForm data={single_data} />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Suspense fallback={<div>Loading footer...</div>}>
                <Footer data={all_titles} />
            </Suspense>
        </div>
    );
}

export default SinglePage;
