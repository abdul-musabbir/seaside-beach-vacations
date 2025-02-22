import {
  differenceInDays,
  differenceInWeeks,
  getDay,
  isSaturday,
  isValid,
  isWithinInterval,
  lastDayOfMonth,
  startOfWeek,
  subWeeks,
} from "date-fns";

export interface PricingDetails {
  nightlyRate: number;
  numberOfNights: number;
  subtotal: number;
  cleaningFee: number;
  securityDeposit: number;
  utilityFee: number;
  total: number;
  isValid: boolean;
  errorMessage?: string;
}

const CLEANING_FEE = 300;
const SECURITY_DEPOSIT = 1000;
const UTILITY_FEE = 150;

export function getPeakSeasonStartDate(year: number): Date {
  const juneLastDay = lastDayOfMonth(new Date(year, 5)); // 5 is June (0-based)
  const lastSaturday = startOfWeek(juneLastDay, { weekStartsOn: 6 }); // Find the last Saturday
  const fullWeeksInJune = Math.floor(
    differenceInWeeks(lastSaturday, new Date(year, 5, 1))
  );

  return fullWeeksInJune === 4
    ? subWeeks(lastSaturday, 2) // Start 3rd week from last
    : subWeeks(lastSaturday, 1); // Start 4th week from last
}

export function isMemorialDayWeekend(date: Date): boolean {
  // Memorial Day is the last Monday in May
  const year = date.getFullYear();
  const mayLastDay = lastDayOfMonth(new Date(year, 4)); // 4 is May (0-based)
  const memorialDay = startOfWeek(mayLastDay, { weekStartsOn: 1 }); // Find the last Monday
  const memorialDayWeekend = {
    start: new Date(
      memorialDay.getFullYear(),
      memorialDay.getMonth(),
      memorialDay.getDate() - 3
    ), // Friday
    end: memorialDay,
  };

  return isWithinInterval(date, memorialDayWeekend);
}

export function isPeakSeason(date: Date): boolean {
  const year = date.getFullYear();
  const peakSeasonStart = getPeakSeasonStartDate(year);
  const peakSeasonEnd = new Date(year, 8, 1); // September 1st

  return isWithinInterval(date, { start: peakSeasonStart, end: peakSeasonEnd });
}

export function getMinimumStayDays(checkIn: Date): number {
  if (isMemorialDayWeekend(checkIn)) {
    return 3;
  }
  if (isPeakSeason(checkIn)) {
    return 7;
  }
  return 2;
}

// default pricing
// const BASE_NIGHTLY_RATE = 700;
// const PEAK_SEASON_NIGHTLY_RATE = 1000;
// const MEMORIAL_DAY_NIGHTLY_RATE = 2000;
// const PEAK_SEASON_WEEKLY_RATE = 7000;

export function calculatePricing(
  checkIn: Date | null,
  checkOut: Date | null,
  adults: number,
  children: number,
  BASE_NIGHTLY_RATE: number,
  PEAK_SEASON_NIGHTLY_RATE: number,
  MEMORIAL_DAY_NIGHTLY_RATE: number,
  PEAK_SEASON_WEEKLY_RATE: number
): PricingDetails {
  const baseResult: PricingDetails = {
    nightlyRate: 0,
    numberOfNights: 0,
    subtotal: 0,
    cleaningFee: CLEANING_FEE,
    securityDeposit: SECURITY_DEPOSIT,
    utilityFee: UTILITY_FEE,
    total: 0,
    isValid: false,
  };

  if (!checkIn || !checkOut || !isValid(checkIn) || !isValid(checkOut)) {
    return { ...baseResult, errorMessage: "Please select valid dates" };
  }

  if (checkIn >= checkOut) {
    return {
      ...baseResult,
      errorMessage: "Check-out date must be after check-in date",
    };
  }

  const numberOfNights = differenceInDays(checkOut, checkIn);

  // Check Memorial Day Weekend booking rules
  if (isMemorialDayWeekend(checkIn)) {
    if (numberOfNights < 3) {
      return {
        ...baseResult,
        nightlyRate: MEMORIAL_DAY_NIGHTLY_RATE,
        errorMessage: "Memorial Day Weekend requires a minimum 3-night stay",
      };
    }
    if (getDay(checkIn) !== 5) {
      // 5 is Friday
      return {
        ...baseResult,
        nightlyRate: MEMORIAL_DAY_NIGHTLY_RATE,
        errorMessage: "Memorial Day Weekend bookings must start on Friday",
      };
    }
    const nightlyRate = MEMORIAL_DAY_NIGHTLY_RATE;
    const subtotal = nightlyRate * numberOfNights;
    const total = subtotal + CLEANING_FEE + SECURITY_DEPOSIT + UTILITY_FEE;

    return {
      ...baseResult,
      nightlyRate,
      numberOfNights,
      subtotal,
      total,
      isValid: true,
    };
  }

  // Check Peak Season booking rules
  if (isPeakSeason(checkIn)) {
    if (numberOfNights < 7) {
      return {
        ...baseResult,
        nightlyRate: PEAK_SEASON_NIGHTLY_RATE,
        errorMessage: "Peak season requires a minimum 7-night stay",
      };
    }
    if (!isSaturday(checkIn)) {
      return {
        ...baseResult,
        nightlyRate: PEAK_SEASON_NIGHTLY_RATE,
        errorMessage: "Peak season bookings must start on Saturday",
      };
    }
    if (!isSaturday(checkOut)) {
      return {
        ...baseResult,
        nightlyRate: PEAK_SEASON_NIGHTLY_RATE,
        errorMessage: "Peak season bookings must be Saturday to Saturday",
      };
    }

    const fullWeeks = Math.floor(numberOfNights / 7);
    const remainingNights = numberOfNights % 7;

    if (remainingNights > 0) {
      return {
        ...baseResult,
        nightlyRate: PEAK_SEASON_NIGHTLY_RATE,
        errorMessage: "Peak season bookings must be in full weeks",
      };
    }

    const subtotal = fullWeeks * PEAK_SEASON_WEEKLY_RATE;
    const total = subtotal + CLEANING_FEE + SECURITY_DEPOSIT + UTILITY_FEE;

    return {
      ...baseResult,
      nightlyRate: PEAK_SEASON_NIGHTLY_RATE,
      numberOfNights,
      subtotal,
      total,
      isValid: true,
    };
  }

  // Regular season booking rules
  if (numberOfNights < 2) {
    return {
      ...baseResult,
      nightlyRate: BASE_NIGHTLY_RATE,
      errorMessage: "Regular season requires a minimum 2-night stay",
    };
  }

  const nightlyRate = BASE_NIGHTLY_RATE;
  const subtotal = nightlyRate * numberOfNights;
  const total = subtotal + CLEANING_FEE + SECURITY_DEPOSIT + UTILITY_FEE;

  return {
    ...baseResult,
    nightlyRate,
    numberOfNights,
    subtotal,
    total,
    isValid: true,
  };
}
