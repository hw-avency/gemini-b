import { Booking } from './types';
import { parse, isBefore, isAfter, isEqual, format } from 'date-fns';

export const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

export const minutesToTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

export const checkOverlap = (start1: string, end1: string, start2: string, end2: string): boolean => {
  const s1 = timeToMinutes(start1);
  const e1 = timeToMinutes(end1);
  const s2 = timeToMinutes(start2);
  const e2 = timeToMinutes(end2);
  
  return s1 < e2 && s2 < e1;
};

export const getResourceBookingsForDate = (bookings: Booking[], resourceId: string, date: string) => {
  return bookings.filter(b => b.resourceId === resourceId && b.date === date);
};

export const calculateBookingPercentage = (bookings: Booking[], date: string, resourceId: string): number => {
  const dayBookings = getResourceBookingsForDate(bookings, resourceId, date);
  const WORK_DAY_START = 6 * 60; // 06:00
  const WORK_DAY_END = 18 * 60; // 18:00
  const TOTAL_WORK_MINUTES = WORK_DAY_END - WORK_DAY_START;

  let bookedMinutes = 0;
  dayBookings.forEach(b => {
    const s = Math.max(timeToMinutes(b.startTime), WORK_DAY_START);
    const e = Math.min(timeToMinutes(b.endTime), WORK_DAY_END);
    if (e > s) {
      bookedMinutes += (e - s);
    }
  });

  return Math.min(100, Math.max(0, (bookedMinutes / TOTAL_WORK_MINUTES) * 100));
};

export const isDeskAlreadyBookedByUser = (bookings: Booking[], userId: string, date: string, startTime: string, endTime: string, resources: any[]): boolean => {
  const userBookings = bookings.filter(b => b.userId === userId && b.date === date);
  for (const b of userBookings) {
    const resource = resources.find(r => r.id === b.resourceId);
    if (resource?.type === 'desk') {
      if (checkOverlap(startTime, endTime, b.startTime, b.endTime)) {
        return true;
      }
    }
  }
  return false;
};

export const isResourceAvailable = (bookings: Booking[], resourceId: string, date: string, startTime: string, endTime: string, excludeBookingId?: string): boolean => {
  const dayBookings = getResourceBookingsForDate(bookings, resourceId, date).filter(b => b.id !== excludeBookingId);
  for (const b of dayBookings) {
    if (checkOverlap(startTime, endTime, b.startTime, b.endTime)) {
      return false;
    }
  }
  return true;
};
