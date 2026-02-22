import React, { useState } from 'react';
import { Resource, Booking } from '../types';
import { useAppContext } from '../AppContext';
import { isDeskAlreadyBookedByUser, isResourceAvailable, getResourceBookingsForDate, timeToMinutes } from '../utils';
import { X, Clock, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { getResourceTypeLabel, tText } from '../i18n';

type BookingModalProps = {
  resource: Resource;
  selectedDate: string;
  onClose: () => void;
  existingBooking?: Booking;
};

export const BookingModal: React.FC<BookingModalProps> = ({ resource, selectedDate, onClose, existingBooking }) => {
  const { currentUser, bookings, addBooking, updateBooking, resources, isAdmin, updateResource, deleteResource, deleteBooking, language } = useAppContext();

  const currentResource = resources.find((r) => r.id === resource.id) || resource;

  const [date, setDate] = useState(existingBooking?.date || selectedDate);
  const [startTime, setStartTime] = useState(existingBooking?.startTime || '06:00');
  const [endTime, setEndTime] = useState(existingBooking?.endTime || '12:00');
  const [error, setError] = useState<string | null>(null);

  const [isEditingResource, setIsEditingResource] = useState(false);
  const [resourceName, setResourceName] = useState(currentResource.name);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isConfirmingBookingDelete, setIsConfirmingBookingDelete] = useState(false);

  const handleDeskPreset = (start: string, end: string) => {
    setStartTime(start);
    setEndTime(end);
  };

  const handleSave = () => {
    setError(null);

    if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
      setError(tText(language, 'endAfterStart'));
      return;
    }

    if (!isResourceAvailable(bookings, resource.id, date, startTime, endTime, existingBooking?.id)) {
      setError(tText(language, 'alreadyBookedResource'));
      return;
    }

    if (resource.type === 'desk') {
      const otherBookings = existingBooking ? bookings.filter((b) => b.id !== existingBooking.id) : bookings;
      if (isDeskAlreadyBookedByUser(otherBookings, currentUser.id, date, startTime, endTime, resources)) {
        setError(tText(language, 'alreadyBookedDesk'));
        return;
      }
    }

    const newBooking: Booking = {
      id: existingBooking?.id || `b${Date.now()}`,
      resourceId: resource.id,
      userId: currentUser.id,
      date,
      startTime,
      endTime,
    };

    if (existingBooking) {
      updateBooking(newBooking);
    } else {
      addBooking(newBooking);
    }
    onClose();
  };

  const handleUpdateResource = () => {
    updateResource({ ...currentResource, name: resourceName });
    setIsEditingResource(false);
  };

  const handleDeleteResource = () => {
    if (isConfirmingDelete) {
      deleteResource(resource.id);
      onClose();
    } else {
      setIsConfirmingDelete(true);
    }
  };

  const handleDeleteBooking = () => {
    if (existingBooking) {
      if (isConfirmingBookingDelete) {
        deleteBooking(existingBooking.id);
        onClose();
      } else {
        setIsConfirmingBookingDelete(true);
      }
    }
  };

  const dayBookings = getResourceBookingsForDate(bookings, resource.id, date).filter((b) => b.id !== existingBooking?.id);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            {isEditingResource ? (
              <input
                type="text"
                value={resourceName}
                onChange={(e) => setResourceName(e.target.value)}
                className="font-semibold text-lg border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                autoFocus
              />
            ) : (
              <h2 className="text-xl font-semibold text-gray-800">{currentResource.name}</h2>
            )}
            <p className="text-sm text-gray-500 capitalize">{getResourceTypeLabel(language, currentResource.type)}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-2 text-sm">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{tText(language, 'date')}</label>
              <div className="relative">
                <CalendarIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {resource.type === 'desk' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{tText(language, 'duration')}</label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => handleDeskPreset('06:00', '12:00')}
                    className={`py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
                      startTime === '06:00' && endTime === '12:00' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {tText(language, 'morning')} (06:00 - 12:00)
                  </button>
                  <button
                    onClick={() => handleDeskPreset('12:00', '18:00')}
                    className={`py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
                      startTime === '12:00' && endTime === '18:00' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {tText(language, 'afternoon')} (12:00 - 18:00)
                  </button>
                  <button
                    onClick={() => handleDeskPreset('06:00', '18:00')}
                    className={`py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
                      startTime === '06:00' && endTime === '18:00' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {tText(language, 'fullDay')} (06:00 - 18:00)
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{tText(language, 'timeSlot')}</label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <span className="text-gray-500">{tText(language, 'to')}</span>
                  <div className="relative flex-1">
                    <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{tText(language, 'todaysSchedule')}</h4>
                  {dayBookings.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">{tText(language, 'noOtherBookings')}</p>
                  ) : (
                    <div className="space-y-2">
                      {dayBookings
                        .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
                        .map((b) => (
                          <div key={b.id} className="flex items-center gap-3 text-sm p-2 bg-gray-50 rounded border border-gray-100">
                            <div className="font-mono text-gray-600 bg-white px-2 py-1 rounded shadow-sm text-xs">
                              {b.startTime} - {b.endTime}
                            </div>
                            <div className="text-gray-700 truncate">{tText(language, 'booked')}</div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
          {isAdmin ? (
            <div className="flex gap-2">
              {isEditingResource ? (
                <button onClick={handleUpdateResource} className="px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                  {tText(language, 'saveName')}
                </button>
              ) : (
                <button
                  onClick={() => setIsEditingResource(true)}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {tText(language, 'editName')}
                </button>
              )}
              <button
                onClick={handleDeleteResource}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isConfirmingDelete ? 'text-white bg-red-600 hover:bg-red-700' : 'text-red-600 bg-white border border-red-200 hover:bg-red-50'
                }`}
              >
                {isConfirmingDelete ? tText(language, 'confirmDelete') : tText(language, 'delete')}
              </button>
            </div>
          ) : (
            <div></div>
          )}

          <div className="flex gap-3">
            {existingBooking && (
              <button
                onClick={handleDeleteBooking}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isConfirmingBookingDelete ? 'text-white bg-red-600 hover:bg-red-700' : 'text-red-600 bg-white border border-red-200 hover:bg-red-50'
                }`}
              >
                {isConfirmingBookingDelete ? tText(language, 'confirmDelete') : tText(language, 'deleteBooking')}
              </button>
            )}
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              {tText(language, 'cancel')}
            </button>
            <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors">
              {existingBooking ? tText(language, 'updateBooking') : tText(language, 'bookNow')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
