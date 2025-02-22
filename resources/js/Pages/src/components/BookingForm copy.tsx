import { addDays, format } from "date-fns";
import { Calendar, Info, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useNavigate } from "react-router-dom";
import { calculatePricing, getMinimumStayDays } from "../utils/pricing";

export default function BookingForm({ data }) {
  const [showCheckInCalendar, setShowCheckInCalendar] = useState(false);
  const [showCheckOutCalendar, setShowCheckOutCalendar] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [pricing, setPricing] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const checkInCalendarRef = useRef<HTMLDivElement>(null);
  const checkOutCalendarRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        checkInCalendarRef.current &&
        !checkInCalendarRef.current.contains(event.target as Node)
      ) {
        setShowCheckInCalendar(false);
      }
      if (
        checkOutCalendarRef.current &&
        !checkOutCalendarRef.current.contains(event.target as Node)
      ) {
        setShowCheckOutCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (checkIn && checkOut) {
      const newPricing = calculatePricing(
        checkIn,
        checkOut,
        adults,
        children,
        data
      );
      setPricing(newPricing);
      setErrorMessage(newPricing.errorMessage || null);
    }
  }, [checkIn, checkOut, adults, children, data]); // Add 'data' to dependencies

  const handleCheckInSelect = (date: Date | undefined) => {
    if (date) {
      setCheckIn(date);
      setShowCheckInCalendar(false);

      // Set default checkout date based on minimum stay
      const minStayDays = getMinimumStayDays(date, data); // Pass data here to get dynamic minimum stay
      setCheckOut(addDays(date, minStayDays));
    }
  };

  const handleCheckOutSelect = (date: Date | undefined) => {
    if (date) {
      setCheckOut(date);
      setShowCheckOutCalendar(false);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/checkout", { state: { data } });
  };

  const minStayDays = checkIn ? getMinimumStayDays(checkIn, data) : 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-lg space-y-6"
    >
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Book Your Stay</h3>
        <p className="text-gray-600">
          From {formatPrice(pricing?.nightlyRate)} per night
        </p>
      </div>

      {/* Date Selection */}
      <div className="space-y-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-in Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              readOnly
              value={checkIn ? format(checkIn, "MMM dd, yyyy") : ""}
              placeholder="Select check-in date"
              className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              onClick={() => setShowCheckInCalendar(!showCheckInCalendar)}
            />
          </div>
          {showCheckInCalendar && (
            <div
              ref={checkInCalendarRef}
              className="absolute z-10 bg-white shadow-lg rounded-lg mt-1"
            >
              <DayPicker
                mode="single"
                selected={checkIn}
                onSelect={handleCheckInSelect}
                defaultMonth={checkIn || undefined}
                disabled={[{ before: new Date() }]}
                className="border rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-out Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              readOnly
              value={checkOut ? format(checkOut, "MMM dd, yyyy") : ""}
              placeholder="Select check-out date"
              className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              onClick={() =>
                checkIn && setShowCheckOutCalendar(!showCheckOutCalendar)
              }
            />
          </div>
          {showCheckOutCalendar && checkIn && (
            <div
              ref={checkOutCalendarRef}
              className="absolute z-10 bg-white shadow-lg rounded-lg mt-1"
            >
              <DayPicker
                mode="single"
                selected={checkOut}
                onSelect={handleCheckOutSelect}
                defaultMonth={checkOut || checkIn}
                disabled={[{ before: addDays(checkIn, minStayDays) }]} // Disable dates less than minimum stay
                className="border rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center gap-2 text-red-700">
            <Info className="w-5 h-5" />
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Guest Selection */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Guests
        </label>
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} Adult{num !== 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
                className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {[0, 1, 2, 3, 4].map((num) => (
                  <option key={num} value={num}>
                    {num} Child{num !== 1 ? "ren" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Fees */}
      <div className="space-y-2 border-t pt-4">
        <div className="flex justify-between text-gray-600">
          <span>Cleaning fee</span>
          <span>{formatPrice(300)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Security deposit</span>
          <span>{formatPrice(1000)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Utility fee</span>
          <span>{formatPrice(150)}</span>
        </div>
      </div>

      {/* Dynamic Pricing Details */}
      {pricing && (
        <div className="space-y-4 border-t pt-4">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>
                {formatPrice(pricing.nightlyRate)} × {pricing.numberOfNights}{" "}
                nights
              </span>
              <span>{formatPrice(pricing.subtotal)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
              <span>Total</span>
              <span>{formatPrice(pricing.total)}</span>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
      >
        Book Now
      </button>

      <p className="text-sm text-gray-500 text-center">
        No payment required to book
      </p>
    </form>
  );
}
