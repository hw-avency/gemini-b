import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Resource, Booking } from './types';
import { USERS, CURRENT_USER, INITIAL_RESOURCES, INITIAL_BOOKINGS } from './data';

type AppContextType = {
  users: User[];
  currentUser: User;
  resources: Resource[];
  bookings: Booking[];
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  addResource: (resource: Resource) => void;
  updateResource: (resource: Resource) => void;
  deleteResource: (id: string) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (booking: Booking) => void;
  deleteBooking: (id: string) => void;
  floorplanUrl: string | null;
  setFloorplanUrl: (url: string | null) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [floorplanUrl, setFloorplanUrl] = useState<string | null>(null);

  const addResource = (resource: Resource) => setResources([...resources, resource]);
  const updateResource = (updated: Resource) => setResources(resources.map(r => r.id === updated.id ? updated : r));
  const deleteResource = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
    setBookings(bookings.filter(b => b.resourceId !== id));
  };

  const addBooking = (booking: Booking) => setBookings([...bookings, booking]);
  const updateBooking = (updated: Booking) => setBookings(bookings.map(b => b.id === updated.id ? updated : b));
  const deleteBooking = (id: string) => setBookings(bookings.filter(b => b.id !== id));

  return (
    <AppContext.Provider value={{
      users: USERS,
      currentUser: CURRENT_USER,
      resources,
      bookings,
      isAdmin,
      setIsAdmin,
      addResource,
      updateResource,
      deleteResource,
      addBooking,
      updateBooking,
      deleteBooking,
      floorplanUrl,
      setFloorplanUrl
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
