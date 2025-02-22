import {
  Car,
  Flame,
  Home,
  MapPin,
  MoreHorizontal,
  Trees,
  Tv,
  UtensilsCrossed,
  WashingMachine,
} from "lucide-react";
import MapPinHouseIcon from "./MapPinHomeIcon";
export default function FacilitiesSection() {
  return (
    <div className="w-[92%] xl:max-w-screen-xl mx-auto px-4 py-16 md:py-24">
      <div className="flex flex-col gap-12 justify-center items-center">
        {/* Left side - Content */}
        <div className="col-span-2 max-w-2xl text-center mx-auto">
          <h2 className="text-4xl font-bold mb-6">Features and Amenities</h2>
          <p className="text-gray-600 mb-8">
            Experience luxury and comfort with our comprehensive range of
            amenities designed to make your stay exceptional. Each facility is
            carefully maintained to ensure your complete satisfaction.
          </p>
        </div>

        {/* Right side - Facilities Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mx-auto">
          {[
            {
              icon: (
                <div className="w-12 h-12 flex items-center justify-center bg-emerald-100 rounded-xl mb-3">
                  <Home className="w-6 h-6 text-emerald-500" />
                </div>
              ),
              name: "3 Houses From Beach",
            },
            {
              icon: (
                <div className="w-12 h-12 flex items-center justify-center bg-emerald-100 rounded-xl mb-3">
                  <MapPinHouseIcon className="w-6 h-6 text-emerald-500" />
                </div>
              ),
              name: "If You Want Houses, They Are All Next to Each Other",
            },
            {
              icon: (
                <div className="w-12 h-12 flex items-center justify-center bg-emerald-100 rounded-xl mb-3">
                  <MapPin className="w-6 h-6 text-emerald-500" />
                </div>
              ),
              name: "23, 29, and 30 Farragut Ave, Seaside Park, NJ (All Beach Block)",
            },
            {
              icon: (
                <div className="w-12 h-12 flex items-center justify-center bg-emerald-100 rounded-xl mb-3">
                  <Trees className="w-6 h-6 text-emerald-500" />
                </div>
              ),
              name: "Large Fenced-In Backyards",
            },
            {
              icon: (
                <div className="w-12 h-12 flex items-center justify-center bg-emerald-100 rounded-xl mb-3">
                  <UtensilsCrossed className="w-6 h-6 text-emerald-500" />
                </div>
              ),
              name: "Fully Stocked Kitchens",
            },
            {
              icon: (
                <div className="w-12 h-12 flex items-center justify-center bg-emerald-100 rounded-xl mb-3">
                  <WashingMachine className="w-6 h-6 text-emerald-500" />
                </div>
              ),
              name: "Washer and Dryer",
            },
            {
              icon: (
                <div className="w-12 h-12 flex items-center justify-center bg-emerald-100 rounded-xl mb-3">
                  <Car className="w-6 h-6 text-emerald-500" />
                </div>
              ),
              name: "Plenty of Off-Street Parking",
            },
            {
              icon: (
                <div className="w-12 h-12 flex items-center justify-center bg-emerald-100 rounded-xl mb-3">
                  <Flame className="w-6 h-6 text-emerald-500" />
                </div>
              ),
              name: "Luxury Outdoor Seating Areas With Fire Pits",
            },
            {
              icon: (
                <div className="w-12 h-12 flex items-center justify-center bg-emerald-100 rounded-xl mb-3">
                  <Tv className="w-6 h-6 text-emerald-500" />
                </div>
              ),
              name: "Smart TVs With High-Speed Internet",
            },
            {
              icon: (
                <div className="w-12 h-12 flex items-center justify-center bg-emerald-100 rounded-xl mb-3">
                  <MoreHorizontal className="w-6 h-6 text-emerald-500" />
                </div>
              ),
              name: "Many More Features",
            },
          ].map((facility, index) => (
            <div
              key={index}
              className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {facility.icon}
              <h3 className="text-sm font-medium text-gray-800 text-opacity-60">
                {facility.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
