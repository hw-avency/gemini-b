import React from 'react';
import { useAppContext } from '../AppContext';
import { format, parseISO } from 'date-fns';
import { Users, Clock, MapPin } from 'lucide-react';
import { dateLocales, tText } from '../i18n';

type AttendanceListProps = {
  selectedDate: string;
};

export const AttendanceList: React.FC<AttendanceListProps> = ({ selectedDate }) => {
  const { users, bookings, resources, language } = useAppContext();

  const attendees = users
    .map((user) => {
      const userBookings = bookings.filter((b) => b.userId === user.id && b.date === selectedDate);
      return { user, bookings: userBookings, isPresent: userBookings.length > 0 };
    })
    .filter((a) => a.isPresent);

  if (attendees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <Users size={48} className="mb-4 text-gray-300" />
        <p className="text-lg font-medium">{tText(language, 'noOneInOffice')}</p>
        <p className="text-sm">
          {tText(language, 'noBookingsForDate', {
            date: format(parseISO(selectedDate), 'MMMM d, yyyy', { locale: dateLocales[language] }),
          })}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">{tText(language, 'attendance')}</h2>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          {attendees.length} {attendees.length === 1 ? tText(language, 'personPresent') : tText(language, 'peoplePresent')}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {attendees.map(({ user, bookings: userBookings }) => (
          <div key={user.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full border border-gray-200" />
              <div>
                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="mt-auto space-y-2">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{tText(language, 'bookings')}</h4>
              {userBookings.map((booking) => {
                const resource = resources.find((r) => r.id === booking.resourceId);
                return (
                  <div key={booking.id} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <MapPin size={14} className="text-gray-400 shrink-0" />
                    <span className="truncate flex-1">{resource?.name || tText(language, 'unknown')}</span>
                    <div className="flex items-center gap-1 text-xs font-mono text-gray-500 shrink-0">
                      <Clock size={12} />
                      {booking.startTime}-{booking.endTime}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
