import React, { useState } from 'react';
import { AppProvider, useAppContext } from './AppContext';
import { Floorplan } from './components/Floorplan';
import { BookingModal } from './components/BookingModal';
import { MyBookings } from './components/MyBookings';
import { AttendanceList } from './components/AttendanceList';
import { Resource, Booking } from './types';
import { Calendar, Map, List, Settings, Upload, User as UserIcon, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, subDays, parseISO } from 'date-fns';

const MainApp = () => {
  const { currentUser, isAdmin, setIsAdmin, setFloorplanUrl, bookings } = useAppContext();
  const [view, setView] = useState<'map' | 'list' | 'attendance'>('map');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [showAllDates, setShowAllDates] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  // Modal State
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | undefined>(undefined);

  const handlePrevDay = () => {
    const prevDate = subDays(parseISO(selectedDate), 1);
    setSelectedDate(format(prevDate, 'yyyy-MM-dd'));
    if (view === 'list') setShowAllDates(false);
  };

  const handleNextDay = () => {
    const nextDate = addDays(parseISO(selectedDate), 1);
    setSelectedDate(format(nextDate, 'yyyy-MM-dd'));
    if (view === 'list') setShowAllDates(false);
  };

  const handleResourceClick = (resource: Resource) => {
    const userBooking = bookings.find(b => b.resourceId === resource.id && b.date === selectedDate && b.userId === currentUser.id);
    setSelectedResource(resource);
    setEditingBooking(userBooking);
  };

  const handleEditBooking = (booking: Booking, resource: Resource) => {
    setSelectedResource(resource);
    setEditingBooking(booking);
    setView('map'); // Switch to map view to show modal
  };

  const handleCloseModal = () => {
    setSelectedResource(null);
    setEditingBooking(undefined);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFloorplanUrl(url);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Map className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">SpaceBook</h1>
          </div>

          <div className="flex items-center gap-6">
            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setView('map')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === 'map' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Map size={16} />
                Floorplan
              </button>
              <button
                onClick={() => setView('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List size={16} />
                My Bookings
              </button>
              <button
                onClick={() => setView('attendance')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === 'attendance' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users size={16} />
                Attendance
              </button>
            </nav>

            {/* Admin Toggle & User Profile */}
            <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                  />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${isAdmin ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isAdmin ? 'transform translate-x-4' : ''}`}></div>
                </div>
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors hidden sm:block">
                  Admin Mode
                </span>
              </label>

              <div className="relative">
                <button 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded-lg transition-colors"
                >
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-8 h-8 rounded-full border border-gray-200" />
                  <span className="text-sm font-medium hidden sm:block">{currentUser.name}</span>
                </button>
                
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <button 
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        // Add preferences logic here if needed
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Settings size={16} />
                      Preferences
                    </button>
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button 
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        // Add logout logic here if needed
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <UserIcon size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrevDay}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="relative flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl">
                <Calendar className="text-gray-500" size={18} />
                <span className="text-sm font-medium text-gray-800">
                  {format(parseISO(selectedDate), 'EEEE, MMM d, yyyy')}
                </span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    if (view === 'list' && e.target.value) {
                      setShowAllDates(false);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              <button 
                onClick={handleNextDay}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight size={20} />
              </button>

              {view === 'list' && (
                <button
                  onClick={() => setShowAllDates(!showAllDates)}
                  className={`ml-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    showAllDates ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {showAllDates ? 'Showing All' : 'View All'}
                </button>
              )}
            </div>

            {isAdmin && view === 'map' && (
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 cursor-pointer transition-colors">
                  <Upload size={16} />
                  Upload Floorplan
                  <input type="file" accept="image/*,.svg" className="hidden" onChange={handleFileUpload} />
                </label>
                <div className="text-xs text-gray-500 hidden sm:block">
                  Click map to add resources
                </div>
              </div>
            )}
          </div>

          {view === 'map' ? (
            <Floorplan selectedDate={selectedDate} onResourceClick={handleResourceClick} />
          ) : view === 'list' ? (
            <MyBookings onEditBooking={handleEditBooking} selectedDate={selectedDate} showAllDates={showAllDates} />
          ) : (
            <AttendanceList selectedDate={selectedDate} />
          )}
        </div>
      </main>

      {/* Modals */}
      {selectedResource && (
        <BookingModal
          resource={selectedResource}
          selectedDate={selectedDate}
          onClose={handleCloseModal}
          existingBooking={editingBooking}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
