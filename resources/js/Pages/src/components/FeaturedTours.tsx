import { Bath, Bed, ChefHat, Heart, MapPin, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// TypeScript interface for tour data
interface Listing {
  id: number;
  title: string;
  name: string;
  num_bedrooms: number;
  num_sleeps: number;
  num_bathrooms: number;
  peak_season_price: number;
  slug: string;
  image_url: string;
  tag: string; // e.g., "Top Rated", "Best Sale", "25% Off"
}

// API endpoint (Replace with your actual API URL)
const API_URL = "https://your-api.com/featured-tours";

const FeaturedTours = () => {
  const [tours, setTours] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch tours");
        const data = await response.json();
        setTours(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  // Loading state
  if (loading)
    return <p className="text-center py-10">Loading featured tours...</p>;

  // Error state
  if (error)
    return <p className="text-center py-10 text-red-600">Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-3xl font-bold mb-2">Our Featured Tours</h2>
          <p className="text-gray-600">
            Favorite destinations based on customer reviews
          </p>
        </div>
      </div>

      {/* Tour Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tours.map((tour) => (
          <div
            key={tour.id}
            className="bg-white rounded-xl overflow-hidden shadow-lg"
          >
            <div className="relative">
              <img
                src={tour.image_url || "https://via.placeholder.com/800x600"}
                alt={tour.title}
                className="w-full h-64 object-cover"
              />
              <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md">
                <Heart className="w-5 h-5 text-red-500" />
              </button>
              {tour.tag && (
                <div className="absolute top-4 left-4 bg-purple-50 text-purple-800 px-3 py-1 rounded-full font-medium text-sm">
                  {tour.tag}
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">{tour.title}</h3>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{tour.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center">
                  <Bed className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{tour.num_bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{tour.num_sleeps} Sleeps</span>
                </div>
                <div className="flex items-center">
                  <Bath className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{tour.num_bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center">
                  <ChefHat className="w-4 h-4 mr-2 text-gray-500" />
                  <span>Kitchen</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold">
                    ${tour.peak_season_price}
                  </span>
                  <span className="text-gray-600"> / night</span>
                </div>
                <Link
                  to={`/tours/${tour.slug}`}
                  className="bg-black text-white px-4 py-2 rounded-full"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedTours;
