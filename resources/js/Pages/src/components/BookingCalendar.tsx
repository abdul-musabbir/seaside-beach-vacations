import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type BookingType = {
  checkIn: Date;
  checkOut: Date;
};

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Demo bookings with overlapping dates
const DEMO_BOOKINGS: BookingType[] = [
  {
    checkIn: new Date(1995, 1, 5),
    checkOut: new Date(1995, 1, 10),
  },
  {
    checkIn: new Date(1995, 1, 10),
    checkOut: new Date(1995, 1, 13),
  },
  {
    checkIn: new Date(1995, 1, 15),
    checkOut: new Date(1995, 1, 20),
  },
  {
    checkIn: new Date(1995, 1, 20),
    checkOut: new Date(1995, 1, 25),
  },
];

function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 1, 1));

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateBooked = (date: Date) => {
    return DEMO_BOOKINGS.some(
      (booking) => date > booking.checkIn && date < booking.checkOut
    );
  };

  const isCheckInDate = (date: Date) => {
    return DEMO_BOOKINGS.some(
      (booking) =>
        date.getDate() === booking.checkIn.getDate() &&
        date.getMonth() === booking.checkIn.getMonth() &&
        date.getFullYear() === booking.checkIn.getFullYear()
    );
  };

  const isCheckOutDate = (date: Date) => {
    return DEMO_BOOKINGS.some(
      (booking) =>
        date.getDate() === booking.checkOut.getDate() &&
        date.getMonth() === booking.checkOut.getMonth() &&
        date.getFullYear() === booking.checkOut.getFullYear()
    );
  };

  const isSplitDay = (date: Date) => {
    return isCheckInDate(date) && isCheckOutDate(date);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (direction === "prev") {
        newDate.setMonth(prevDate.getMonth() - 1);
      } else {
        newDate.setMonth(prevDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-full aspect-square" />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const isBooked = isDateBooked(date);
      const isCheckin = isCheckInDate(date);
      const isCheckout = isCheckOutDate(date);
      const isSplit = isSplitDay(date);

      days.push(
        <div
          key={day}
          className={`relative h-full aspect-square border border-gray-100 ${
            isBooked
              ? "bg-red-50"
              : "bg-white hover:bg-gray-50 transition-colors"
          }`}
        >
          <span className="absolute top-1 left-1 text-sm font-medium z-10 text-gray-700">
            {day}
          </span>

          {/* Split day visualization */}
          {isSplit && (
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-green-100 clip-diagonal-start" />
              <div className="absolute inset-0 bg-blue-100 clip-diagonal-end" />
            </div>
          )}

          {/* Regular check-in/out visualization */}
          {!isSplit && (
            <>
              {isCheckin && (
                <div className="absolute inset-0 bg-blue-100 clip-diagonal-end" />
              )}
              {isCheckout && (
                <div className="absolute inset-0 bg-green-100 clip-diagonal-start" />
              )}
            </>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="lg:min-h-screen min-h-[50vh]">
      <div className="bg-white rounded-xl p-4 sm:p-6 w-full ">
        <div className="mb-2 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
            Availability Calendar
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Check our available dates for your perfect stay
          </p>
        </div>

        <div className="mb-2 sm:mb-6 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-medium text-gray-800">
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <div className="flex gap-1 sm:gap-2">
            <button
              onClick={() => navigateMonth("prev")}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
            <button
              onClick={() => navigateMonth("next")}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px mb-4">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="aspect-square flex items-center justify-center text-xs sm:text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px">{renderCalendar()}</div>

        <div className="mt-4 sm:mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 clip-diagonal-end" />
            <span className="text-gray-600">Check-in</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 clip-diagonal-start" />
            <span className="text-gray-600">Check-out</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-50 border border-red-100 rounded" />
            <span className="text-gray-600">Booked</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingCalendar;
