import {
  Car,
  Flame,
  Home,
  MapPin,
  Trees,
  Tv,
  UtensilsCrossed,
  WashingMachine as Washing,
} from "lucide-react";
import MapPinHomeIcon from "./MapPinHomeIcon";
const features = [
  { icon: Home, text: "3 Houses From Beach" },
  {
    icon: MapPinHomeIcon,
    text: "If You Want Houses, They Are All Next to Each Other",
  },
  {
    icon: MapPin,
    text: "23, 29, and 30 Farragut Ave, Seaside Park, NJ (All Beach Block)",
  },
  { icon: Trees, text: "Large Fenced-In Backyards" },
  { icon: UtensilsCrossed, text: "Fully Stocked Kitchens" },
  { icon: Washing, text: "Washer and Dryer" },
  { icon: Car, text: "Plenty of Off-Street Parking" },
  { icon: Flame, text: "Luxury Outdoor Seating Areas With Fire Pits" },
  { icon: Tv, text: "Smart TVs With High-Speed Internet" },
];

export default function PropertyFeatures() {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div
            key={index}
            className="grid grid-cols-[auto_1fr] items-center gap-3"
          >
            <Icon className="w-5 h-5 text-blue-600" />
            <span className="text-gray-700">{feature.text}</span>
          </div>
        );
      })}
    </div>
  );
}
