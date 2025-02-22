import { addDays, format } from "date-fns";
import { Calendar, Info, Users } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useNavigate } from "react-router-dom";
import {
  calculatePricing,
  getMinimumStayDays,
  PricingDetails,
} from "../utils/pricingList";
import { Listing } from "../utils/types";

export default function BookingForm({ data }: { data: Listing }) {
  const [showCheckInCalendar, setShowCheckInCalendar] = useState(false);
  const [showCheckOutCalendar, setShowCheckOutCalendar] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [pricing, setPricing] = useState<PricingDetails | null>(null);
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
        Number(data.meta.normal_price),
        Number(data.meta.peak_season_price),
        Number(data.meta.memorial_day_price),
        Number(data.meta.peak_season_price)
      );
      setPricing(newPricing);
      setErrorMessage(newPricing.errorMessage || null);
    }
  }, [checkIn, checkOut, adults, children]);

  const handleCheckInSelect = (date: Date | undefined) => {
    if (date) {
      setCheckIn(date);
      setShowCheckInCalendar(false);

      // Set default checkout date based on minimum stay
      const minStayDays = getMinimumStayDays(date);
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

  // const getCurrentRate = (date: Date | null = null) => {
  //   if (date) {
  //     if (isMemorialDayWeekend(date)) {
  //       return 2000;
  //     }
  //     if (isPeakSeason(date)) {
  //       return 1000;
  //     }
  //   }
  //   return 700;
  // };

  const handleSubmit = (e): void => {
    e.preventDefault();
    if (pricing) {
      const subtotalprice = pricing.subtotal;
      navigate("/checkout", {
        state: { data, checkIn, checkOut, adults, subtotalprice },
      });
    }
  };

  function GenerateGuest(sleeps: number) {
    const count: number[] = [];
    for (let i = 1; i <= sleeps; i++) {
      count.push(i);
    }
    return count;
  }

  function GenerateTotalPrice(
    bookingCost: number,
    cleaningFee: number,
    utilityFee: number
  ): number {
    return Number(bookingCost) + Number(cleaningFee) + Number(utilityFee);
  }
  type GetPriceLabel = (
    priceType: string,
    price: number,
    minStay: number
  ) => string | JSX.Element;

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

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-lg space-y-6"
    >
      <div className="space-y-2">
        {/* <p className="text-gray-600">
          From {formatPrice(getCurrentRate(checkIn))} per night
          {checkIn && isPeakSeason(checkIn) && " (Peak Season)"}
          {checkIn &&
          isMemorialDayWeekend(checkIn) &&
          " (Memorial Day Weekend)"}
          </p> */}

        <p>
          {getPriceLabel(
            data.price_type,
            Number(data.price),
            Number(data.minimum_stay)
          )}
        </p>
        <h3 className="text-xl font-semibold">Book Your Stay</h3>
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
              className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer outline-none"
              onClick={() => setShowCheckInCalendar(!showCheckInCalendar)}
            />
          </div>
          {showCheckInCalendar && (
            <div
              ref={checkInCalendarRef}
              className="absolute z-10 bg-white p-2.5 shadow-lg rounded-lg mt-1 border"
            >
              <DayPicker
                mode="single"
                selected={checkIn}
                onSelect={handleCheckInSelect}
                defaultMonth={checkIn || undefined}
                disabled={[{ before: new Date() }]}
                className="rounded-lg"
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
              className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer outline-none"
              onClick={() =>
                checkIn && setShowCheckOutCalendar(!showCheckOutCalendar)
              }
            />
          </div>
          {showCheckOutCalendar && checkIn && (
            <div
              ref={checkOutCalendarRef}
              className="absolute z-10 bg-white p-2.5 shadow-lg rounded-lg mt-1 border"
            >
              <DayPicker
                mode="single"
                selected={checkOut}
                onSelect={handleCheckOutSelect}
                defaultMonth={checkOut || checkIn}
                disabled={[{ before: addDays(checkIn, 1) }]}
                className="rounded-lg"
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
                className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {GenerateGuest(Number(data.meta.num_sleeps)).map((num) => (
                  <option key={num} value={num}>
                    {num} Guest{num !== 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Fees */}
      <div className="space-y-2 border-t pt-4">
        {pricing && (
          <div className="flex justify-between text-gray-600">
            <span>Booking Cost</span>
            <span>{formatPrice(pricing.subtotal)}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-600">
          <span>Cleaning fee</span>
          <span>{data.meta.cleaning_fees}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Utility fee</span>
          <span>{data.meta.utility_fees}</span>
        </div>
      </div>

      {/* Dynamic Pricing Details */}
      {pricing && (
        <div className="space-y-4">
          <div className="flex justify-between font-semibold text-lg pt-2 border-t">
            <span>Total</span>
            <span>
              {formatPrice(
                GenerateTotalPrice(
                  pricing.subtotal,
                  data.meta.cleaning_fees,
                  data.meta.utility_fees
                )
              )}
            </span>
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
