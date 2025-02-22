import { Check } from "lucide-react";

export default function HowToBook({
  Venmo,
  Zelle,
}: {
  Venmo: string;
  Zelle: string;
}) {
  return (
    <div className="w-[92%] xl:max-w-screen-xl mx-auto px-4 py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Image Grid */}
        <div className="grid grid-cols-2 gap-4 relative">
          <div className="col-span-2 ">
            <img
              src="https://seasidebeachvacations.com/images/beach-escape/1.jpg"
              alt="Temple view"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <div>
            <img
              src="https://seasidebeachvacations.com/images/ocean-oasis/1.jpg"
              alt="Travelers on cliff"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
          <div>
            <img
              src="https://seasidebeachvacations.com/images/unit-1/1.jpg"
              alt="Adventure jeep"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Right side - Content */}
        <div className="lg:pl-12">
          <h2 className="text-4xl font-bold mb-6">How to Book</h2>
          <p className="text-gray-600 mb-8">
            Follow those simple steps and secure your reservation.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="flex items-center space-x-3">
              {/* <div className="flex-shrink-0 w-5 h-5 text-green-500">✓</div> */}
              <Check className="w-5 h-5 flex-shrink-0 text-green-500" />
              <span>Find best house</span>
            </div>
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 flex-shrink-0 text-green-500" />
              <span>Book a reservation</span>
            </div>
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 flex-shrink-0 text-green-500" />
              <span>Pay secuirity deposit</span>
            </div>
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 flex-shrink-0 text-green-500" />
              <span>Secure your reservation</span>
            </div>
          </div>

          {/* Payment Section */}
          <div>
            <p className="text-gray-600 mb-8">
              Payment can be made by Venmo, Zelle, or by check. Deposit is due
              at the time of booking to secure your rental date. The rest of the
              rental payment will be put into a pay plan for your convenience.
              The entire rental must be paid off a month prior to the date of
              rental..
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Payment is secure and safe
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <img src={Venmo} alt="Venmo" className="w-24" />
              <img src={Zelle} alt="Zelle" className="h-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
