import { Check } from "lucide-react";

export default function BookingGuideline() {
  return (
    <div className="w-[92%] xl:max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Image Section */}
        <div className="relative md:order-2">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden">
            <img
              src="https://seasidebeachvacations.com/images/unit-2/16.jpg"
              alt="Beach house"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-8 md:order-1">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-[#0A2540]">
              Rental Note and
              <br />
              Booking Guideline
            </h1>

            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Check className="mt-1 text-blue-600" size={20} />
                <span className="text-[#425466]">Key code entry.</span>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="mt-1 text-blue-600" size={20} />
                <span className="text-[#425466]">
                  All rentals are pet-friendly.
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="mt-1 text-blue-600" size={20} />
                <span className="text-[#425466]">
                  Beach badges not included with rentals.
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="mt-1 text-blue-600" size={20} />
                <span className="text-[#425466]">
                  $500 property damage security deposit for every rental.
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="mt-1 text-blue-600" size={20} />
                <span className="text-[#425466]">
                  All rentals have a $125 cleaning fee and $100 weekly utility
                  fee.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
