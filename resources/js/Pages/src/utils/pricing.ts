import {
  differenceInDays,
  differenceInWeeks,
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

export function getMinimumStayDays(checkIn: Date, data: any): number {
  if (isMemorialDayWeekend(checkIn)) {
    return 3;
  }
  if (isPeakSeason(checkIn)) {
    return 7;
  }
  return data?.meta["normal_minimum_stay"] ?? 2; // Use dynamic minimum stay from the database
}

export function calculatePricing(
  checkIn: Date | null,
  checkOut: Date | null,
  adults: number,
  children: number,
  data: any
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

  if (isMemorialDayWeekend(checkIn)) {
    const memorialPrice = data?.meta["memorial_day_price"] ?? 2000;
    if (numberOfNights < 3) {
      return {
        ...baseResult,
        nightlyRate: memorialPrice,
        errorMessage: "Memorial Day Weekend requires a minimum 3-night stay",
      };
    }
    const subtotal = memorialPrice * numberOfNights;
    const total = subtotal + CLEANING_FEE + SECURITY_DEPOSIT + UTILITY_FEE;
    return {
      ...baseResult,
      nightlyRate: memorialPrice,
      numberOfNights,
      subtotal,
      total,
      isValid: true,
    };
  }

  if (isPeakSeason(checkIn)) {
    const peakPrice = data?.meta["peak_season_price"] ?? 1000;
    if (numberOfNights < 7) {
      return {
        ...baseResult,
        nightlyRate: peakPrice,
        errorMessage: "Peak season requires a minimum 7-night stay",
      };
    }
    const subtotal = peakPrice * numberOfNights;
    const total = subtotal + CLEANING_FEE + SECURITY_DEPOSIT + UTILITY_FEE;
    return {
      ...baseResult,
      nightlyRate: peakPrice,
      numberOfNights,
      subtotal,
      total,
      isValid: true,
    };
  }

  const regularPrice = data?.meta["normal_price"] ?? 700;
  const subtotal = regularPrice * numberOfNights;
  const total = subtotal + CLEANING_FEE + SECURITY_DEPOSIT + UTILITY_FEE;

  return {
    ...baseResult,
    nightlyRate: regularPrice,
    numberOfNights,
    subtotal,
    total,
    isValid: true,
  };
}
