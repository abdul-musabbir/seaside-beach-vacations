import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import { lazy, Suspense, useEffect } from "react";
import { useParams } from "react-router-dom";
import BookingCalendar from "../components/BookingCalendar";
import Headers from "../components/Headers";
import Preloader from "../components/Preloader";
import ReviewSliderSinglePage from "../components/ReviewSliderSinglePage";
import { useData } from "../lib/dataContext";

// Lazy-load components
const Footer = lazy(() => import("../components/Footer"));
const BookingForm = lazy(() => import("../components/BookingForm"));
const ImageSlider = lazy(() => import("../components/ImageSlider"));
const ImageGallery = lazy(() => import("../components/ImageGallery"));
const PropertyFeatures = lazy(() => import("../components/PropertyFeatures"));

function SinglePage() {
  const { id } = useParams();
  const { getSingleData } = useData();

  // Use React Query to fetch data directly from API
  const { data, isLoading, isError } = useQuery({
    queryKey: ["listing", id],
    queryFn: () => getSingleData(id!),
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    retry: 2, // Retry twice if request fails
    enabled: !!id, // Only run the query if the id exists
    select: (data) => data?.[0], // Select the first item from the response
  });

  // Scroll to the top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.title = data?.title
      ? `${data.title} | Seaside Beach Vacations`
      : "Loading...";
  }, [data]);

  if (isLoading) return <Preloader />;
  if (isError) return <div>Error loading property data.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Headers />

      {/* Image Slider */}
      <Suspense fallback={<Preloader />}>
        <ImageSlider images={JSON.parse(data?.gallery_images || "[]")} />
      </Suspense>

      <div className="w-[92%] xl:max-w-screen-xl mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Content Area */}
          <div className="flex-1 space-y-20">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">
                {data?.title}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span>{data?.location}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {data?.description}
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
                  images={JSON.parse(data?.gallery_images || "[]")}
                />
              </Suspense>
            </div>

            <div className="max-w-2xl flex">
              <div className="w-full flex flex-col">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Reviews
                </h2>
                <div className="flex justify-center">
                  <ReviewSliderSinglePage homeId={data?.id} />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Location
              </h2>
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  src={data?.map_url}
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
              <Suspense fallback={<div>Loading booking form...</div>}>
                <BookingForm data={data} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Suspense fallback={<div>Loading footer...</div>}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default SinglePage;
