import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Resource, Booking, Floor } from './types';
import { USERS, CURRENT_USER, INITIAL_RESOURCES, INITIAL_BOOKINGS, INITIAL_FLOORS } from './data';
import { Language } from './i18n';

type AppContextType = {
  users: User[];
  currentUser: User;
  resources: Resource[];
  bookings: Booking[];
  floors: Floor[];
  selectedFloorId: string;
  setSelectedFloorId: (id: string) => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  isGridEnabled: boolean;
  setIsGridEnabled: (val: boolean) => void;
  gridSize: number;
  setGridSize: (val: number) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  defaultResourceSettings: Record<string, Partial<Resource>>;
  setDefaultResourceSettings: (settings: Record<string, Partial<Resource>>) => void;
  addResource: (resource: Resource) => void;
  updateResource: (resource: Resource) => void;
  deleteResource: (id: string) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (booking: Booking) => void;
  deleteBooking: (id: string) => void;
  updateFloor: (floor: Floor) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isGridEnabled, setIsGridEnabled] = useState(false);
  const [gridSize, setGridSize] = useState(5);
  const [defaultResourceSettings, setDefaultResourceSettings] = useState<Record<string, Partial<Resource>>>({});
  const [language, setLanguage] = useState<Language>('de');
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [floors, setFloors] = useState<Floor[]>(INITIAL_FLOORS);
  const [selectedFloorId, setSelectedFloorId] = useState<string>(INITIAL_FLOORS[0].id);

  const addResource = (resource: Resource) => setResources([...resources, resource]);
  const updateResource = (updated: Resource) => setResources(resources.map(r => r.id === updated.id ? updated : r));
  const deleteResource = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
    setBookings(bookings.filter(b => b.resourceId !== id));
  };

  const addBooking = (booking: Booking) => setBookings([...bookings, booking]);
  const updateBooking = (updated: Booking) => setBookings(bookings.map(b => b.id === updated.id ? updated : b));
  const deleteBooking = (id: string) => setBookings(bookings.filter(b => b.id !== id));

  const updateFloor = (updated: Floor) => setFloors(floors.map(f => f.id === updated.id ? updated : f));

  return (
    <AppContext.Provider value={{
      users: USERS,
      currentUser: CURRENT_USER,
      resources,
      bookings,
      floors,
      selectedFloorId,
      setSelectedFloorId,
      isAdmin,
      setIsAdmin,
      isGridEnabled,
      setIsGridEnabled,
      gridSize,
      setGridSize,
      language,
      setLanguage,
      defaultResourceSettings,
      setDefaultResourceSettings,
      addResource,
      updateResource,
      deleteResource,
      addBooking,
      updateBooking,
      deleteBooking,
      updateFloor
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
