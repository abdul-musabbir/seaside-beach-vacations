import JacuzziIcon from "@/Pages/src/assets/JacuzziIcon";
import {
    Car,
    Dog,
    Flame,
    Home,
    MapPin,
    Trees,
    Tv,
    UtensilsCrossed,
    WashingMachine as Washing,
} from "lucide-react";
import MapPinHomeIcon from "./MapPinHomeIcon";

export default function PropertyFeatures({ slug }: { slug: string }) {
    const features = [
        { icon: Home, text: "3 Houses From Beach" },
        {
            icon: MapPinHomeIcon,
            text: "If you want additional houses, 2, 3, 4 & 6 bedrooms",
        },
        {
            icon: MapPin,
            text: "23, 29, and 30 Farragut Ave, Seaside Park, NJ (All Beach Block)",
        },
        { icon: Trees, text: "Large Fenced-In Backyards" },
        { icon: UtensilsCrossed, text: "Fully Stocked Kitchens" },
        { icon: Washing, text: "Washer and Dryer" },
        { icon: Car, text: "Plenty of Parking" },
        { icon: Flame, text: "Luxury Outdoor Seating Areas With Fire Pits" },
        { icon: Tv, text: "Smart TVs With High-Speed Internet" },
        { icon: Dog, text: "Pet friendly" },
        slug === "ocean-oasis" && {
            icon: JacuzziIcon,
            text: "8 person jacuzzi",
        },
    ].filter(Boolean);

    return (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {features.map((feature: any, index) => {
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
