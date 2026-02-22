import React from 'react';
import { Resource, Booking } from '../types';
import { calculateBookingPercentage, getResourceBookingsForDate, timeToMinutes } from '../utils';
import { useAppContext } from '../AppContext';
import { Monitor, Users } from 'lucide-react';
import { tText } from '../i18n';

type ResourceMarkerProps = {
  resource: Resource;
  date: string;
  onClick: (resource: Resource) => void;
};

export const ResourceMarker: React.FC<ResourceMarkerProps> = ({ resource, date, onClick }) => {
  const { bookings, users, language } = useAppContext();
  const dayBookings = getResourceBookingsForDate(bookings, resource.id, date);

  const WORK_DAY_START = 6 * 60;
  const WORK_DAY_END = 18 * 60;
  const TOTAL_MINUTES = 720;

  let segments = [{ start: WORK_DAY_START, end: WORK_DAY_END, isBooked: false }];

  dayBookings.forEach(b => {
    const bStart = Math.max(WORK_DAY_START, timeToMinutes(b.startTime));
    const bEnd = Math.min(WORK_DAY_END, timeToMinutes(b.endTime));
    if (bStart >= bEnd) return;

    let newSegments: typeof segments = [];
    segments.forEach(seg => {
      if (seg.isBooked) {
        newSegments.push(seg);
        return;
      }
      if (bEnd <= seg.start || bStart >= seg.end) {
        newSegments.push(seg);
      } else {
        if (bStart > seg.start) {
          newSegments.push({ start: seg.start, end: bStart, isBooked: false });
        }
        newSegments.push({ start: Math.max(seg.start, bStart), end: Math.min(seg.end, bEnd), isBooked: true });
        if (bEnd < seg.end) {
          newSegments.push({ start: bEnd, end: seg.end, isBooked: false });
        }
      }
    });
    segments = newSegments;
  });

  const stops = segments.map(seg => {
    const startPct = ((seg.start - WORK_DAY_START) / TOTAL_MINUTES) * 100;
    const endPct = ((seg.end - WORK_DAY_START) / TOTAL_MINUTES) * 100;
    const color = seg.isBooked ? '#ef4444' : '#22c55e'; // red-500 : green-500
    return `${color} ${startPct.toFixed(2)}% ${endPct.toFixed(2)}%`;
  });

  const gradient = `conic-gradient(from 180deg, ${stops.join(', ')})`;

  // Find if someone is currently booked (for avatar display)
  // For simplicity, we just take the first booking of the day if it exists
  // In a real app, we might check if the current time falls within a booking
  const activeBooking = dayBookings.length > 0 ? dayBookings[0] : null;
  const activeUser = activeBooking ? users.find(u => u.id === activeBooking.userId) : null;

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
      style={{ left: `${resource.x}%`, top: `${resource.y}%` }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(resource);
      }}
    >
      <div className="relative flex items-center justify-center w-12 h-12">
        {/* Availability Indicator (Donut Chart) */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{ background: gradient }}
        />
        {/* Inner hole to make it a donut */}
        <div className="absolute inset-1 bg-white rounded-full z-0" />

        {/* Icon */}
        <div className="z-10 bg-white rounded-full p-1 shadow-sm group-hover:shadow-md transition-shadow">
          {resource.type === 'desk' ? (
            <Monitor size={18} className="text-gray-700" />
          ) : (
            <Users size={18} className="text-gray-700" />
          )}
        </div>

        {/* Avatar Overlay (if booked) */}
        {activeUser && resource.type === 'desk' && (
          <div className="absolute -top-2 -right-2 z-20">
            <img
              src={activeUser.avatarUrl}
              alt={activeUser.name}
              className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
              title={tText(language, 'bookedBy', { name: activeUser.name })}
            />
          </div>
        )}
      </div>
      
      {/* Tooltip/Label */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 pointer-events-none">
        {resource.name}
      </div>
    </div>
  );
};
