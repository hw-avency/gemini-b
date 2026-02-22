import React from 'react';
import { useAppContext } from '../AppContext';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, MapPin, Edit2, Trash2 } from 'lucide-react';
import { Booking, Resource } from '../types';
import { dateLocales, getResourceTypeLabel, tText } from '../i18n';

type MyBookingsProps = {
  onEditBooking: (booking: Booking, resource: Resource) => void;
  selectedDate: string;
  showAllDates: boolean;
};

export const MyBookings: React.FC<MyBookingsProps> = ({ onEditBooking, selectedDate, showAllDates }) => {
  const { bookings, currentUser, resources, deleteBooking, language } = useAppContext();
  const [confirmingDeleteId, setConfirmingDeleteId] = React.useState<string | null>(null);

  const userBookings = bookings
    .filter((b) => b.userId === currentUser.id && (showAllDates || b.date === selectedDate))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (userBookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <Calendar size={48} className="mb-4 text-gray-300" />
        <p className="text-lg font-medium">{tText(language, 'noUpcomingBookings')}</p>
        <p className="text-sm">{tText(language, 'headToFloorplan')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">{tText(language, 'myBookings')}</h2>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          {userBookings.length} {userBookings.length === 1 ? tText(language, 'booking') : tText(language, 'bookings')}
        </span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {userBookings.map((booking) => {
          const resource = resources.find((r) => r.id === booking.resourceId);
          if (!resource) return null;

          return (
            <div key={booking.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${resource.type === 'desk' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{resource.name}</h3>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{getResourceTypeLabel(language, resource.type)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditBooking(booking, resource)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title={tText(language, 'editBooking')}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirmingDeleteId === booking.id) {
                        deleteBooking(booking.id);
                        setConfirmingDeleteId(null);
                      } else {
                        setConfirmingDeleteId(booking.id);
                      }
                    }}
                    className={`p-1.5 rounded transition-colors flex items-center gap-1 ${
                      confirmingDeleteId === booking.id ? 'text-white bg-red-600 hover:bg-red-700 px-2' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                    }`}
                    title={confirmingDeleteId === booking.id ? tText(language, 'confirmDelete') : tText(language, 'cancelBooking')}
                  >
                    <Trash2 size={16} />
                    {confirmingDeleteId === booking.id && <span className="text-xs font-medium">{tText(language, 'confirm')}</span>}
                  </button>
                </div>
              </div>

              <div className="mt-auto space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} className="text-gray-400" />
                  <span>{format(parseISO(booking.date), 'EEEE, MMMM d, yyyy', { locale: dateLocales[language] })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} className="text-gray-400" />
                  <span>{booking.startTime} - {booking.endTime}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
