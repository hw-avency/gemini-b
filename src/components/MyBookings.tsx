import React from 'react';
import { useAppContext } from '../AppContext';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, MapPin, Edit2, Trash2 } from 'lucide-react';
import { Booking, Resource } from '../types';

type MyBookingsProps = {
  onEditBooking: (booking: Booking, resource: Resource) => void;
};

export const MyBookings: React.FC<MyBookingsProps> = ({ onEditBooking }) => {
  const { bookings, currentUser, resources, deleteBooking } = useAppContext();
  const [confirmingDeleteId, setConfirmingDeleteId] = React.useState<string | null>(null);

  const userBookings = bookings
    .filter((b) => b.userId === currentUser.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (userBookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <Calendar size={48} className="mb-4 text-gray-300" />
        <p className="text-lg font-medium">No upcoming bookings</p>
        <p className="text-sm">Head to the floorplan to book a desk or room.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Bookings</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {userBookings.map((booking) => {
          const resource = resources.find((r) => r.id === booking.resourceId);
          if (!resource) return null;

          return (
            <div
              key={booking.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${resource.type === 'desk' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{resource.name}</h3>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{resource.type}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditBooking(booking, resource)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Edit Booking"
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
                      confirmingDeleteId === booking.id
                        ? 'text-white bg-red-600 hover:bg-red-700 px-2'
                        : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                    }`}
                    title={confirmingDeleteId === booking.id ? "Confirm Delete" : "Cancel Booking"}
                  >
                    <Trash2 size={16} />
                    {confirmingDeleteId === booking.id && <span className="text-xs font-medium">Confirm</span>}
                  </button>
                </div>
              </div>

              <div className="mt-auto space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} className="text-gray-400" />
                  <span>{format(parseISO(booking.date), 'EEEE, MMMM d, yyyy')}</span>
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
