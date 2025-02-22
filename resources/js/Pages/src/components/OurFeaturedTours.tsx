import { Bath, Bed, Coffee, MapPin, Users } from "lucide-react";
import { useCallback } from "react";
import { Link } from "react-router-dom";
import { useData } from "../lib/dataContext";
import VideoPopup from "./VideoPopup";
type GetPriceLabel = (
  priceType: string,
  price: number,
  minStay: number
) => string | JSX.Element;

export default function OurFeaturedTours() {
  const { data: ourFeaturedData, loading } = useData();

  const getPriceLabel: GetPriceLabel = useCallback(
    (priceType: string, price: number, minStay: number) => {
      let priceLabel;

      if (priceType === "normal") {
        if (minStay === 7) {
          priceLabel = `$${price.toFixed(2)} per week`;
        } else {
          priceLabel = (
            <span>
              <span className="text-2xl font-bold">${price.toFixed(2)}</span>{" "}
              <span className="font-medium text-gray-600">/ night</span>
            </span>
          );

          // return priceLabel;
        }
      } else {
        if (minStay === 7) {
          priceLabel = `$${price.toFixed(2)} per week`;
        } else if (minStay > 1) {
          priceLabel = `$${price.toFixed(2)} per ${minStay} nights`;
        } else {
          priceLabel = `$${price.toFixed(2)} per night`;
        }
      }

      return priceLabel;
    },
    []
  );

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg animate-pulse">
      <div className="relative">
        <div className="w-full h-64 bg-gray-200" />
        <div className="absolute top-4 right-4 p-2 bg-white rounded-full">
          <div className="w-5 h-5 bg-gray-300 rounded-full" />
        </div>
        <div className="absolute top-4 left-4 bg-gray-200 px-3 py-1 rounded-full font-medium text-sm" />
      </div>
      <div className="p-6">
        <div className="w-3/4 h-6 bg-gray-200 mb-4" />
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          <div className="w-2/4 h-4 bg-gray-200" />
        </div>
        <div className="flex justify-between items-center">
          <div className="w-1/2 h-6 bg-gray-200" />
          <div className="w-32 h-10 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-[92%] xl:max-w-screen-xl mx-auto px-4 py-16">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-3xl font-bold mb-2">Our Featured Tours</h2>
          <p className="text-gray-600">
            Favorite destinations based on customer reviews
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          // Display skeleton loaders when loading
          Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : ourFeaturedData?.length > 0 ? (
          ourFeaturedData.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-lg"
            >
              <div className="relative">
                <Link to={"/" + item.slug || "#"}>
                  <img
                    src={item?.feature_image || "default-image.jpg"} // Fallback image
                    alt={item?.title || "No Title"}
                    className="w-full h-64 object-cover"
                  />
                </Link>
                {[0, 1].includes(index) && (
                  <button className="absolute top-4 right-4 ">
                    <VideoPopup
                      videoLink={
                        index === 0
                          ? "ZNdPZZcGjrc"
                          : index === 1
                          ? "ZNdPZZcGjrc"
                          : ""
                      }
                    />
                  </button>
                )}
              </div>
              <div className="p-6">
                <Link to={"/" + item.slug || "#"}>
                  <h3 className="text-3xl font-bold mb-2">
                    {item?.title || "No Title"}
                  </h3>
                </Link>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{item?.location || "Unknown Location"}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-2 text-gray-500" />
                    <span>{item.meta.num_sleeps} Guests</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Bed className="w-5 h-5 mr-2 text-gray-500" />
                    <span>{item.meta.num_bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Bath className="w-5 h-5 mr-2 text-gray-500" />
                    <span>{item.meta.num_bathrooms} Bathrooms</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Coffee className="w-5 h-5 mr-2 text-gray-500" />
                    <span>kitchen</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="">
                      {getPriceLabel(
                        item.price_type,
                        Number(item.price),
                        Number(item.minimum_stay)
                      )}
                    </span>
                  </div>
                  <Link
                    to={"/" + item.slug || "#"} // Ensure the slug exists
                    className="bg-black text-white px-4 py-2 rounded-full cursor-pointer"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-3">
            No featured tours available.
          </p>
        )}
      </div>
    </div>
  );
}
