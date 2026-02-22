import { User, Resource, Booking, Floor } from './types';
import { format } from 'date-fns';

export const USERS: User[] = [
  { id: 'u1', name: 'Alice Smith', avatarUrl: 'https://i.pravatar.cc/150?u=u1' },
  { id: 'u2', name: 'Bob Jones', avatarUrl: 'https://i.pravatar.cc/150?u=u2' },
  { id: 'u3', name: 'Charlie Brown', avatarUrl: 'https://i.pravatar.cc/150?u=u3' },
  { id: 'u4', name: 'Diana Prince', avatarUrl: 'https://i.pravatar.cc/150?u=u4' },
];

export const CURRENT_USER = USERS[0];

export const INITIAL_FLOORS: Floor[] = [
  { id: 'f1', name: '1st Floor', floorplanUrl: null },
  { id: 'f2', name: '2nd Floor', floorplanUrl: null },
];

export const INITIAL_RESOURCES: Resource[] = [
  { id: 'r1', name: 'Desk 1', type: 'desk', x: 20, y: 30, floorId: 'f1' },
  { id: 'r2', name: 'Desk 2', type: 'desk', x: 30, y: 30, floorId: 'f1' },
  { id: 'r3', name: 'Desk 3', type: 'desk', x: 40, y: 30, floorId: 'f1' },
  { id: 'r4', name: 'Desk 4', type: 'desk', x: 20, y: 50, floorId: 'f1' },
  { id: 'r5', name: 'Desk 5', type: 'desk', x: 30, y: 50, floorId: 'f1' },
  { id: 'r6', name: 'Room A', type: 'room', x: 70, y: 25, floorId: 'f1' },
  { id: 'r7', name: 'Room B', type: 'room', x: 70, y: 65, floorId: 'f1' },
  { id: 'r8', name: 'Desk 6', type: 'desk', x: 20, y: 30, floorId: 'f2' },
  { id: 'r9', name: 'Desk 7', type: 'desk', x: 30, y: 30, floorId: 'f2' },
  { id: 'r10', name: 'Room C', type: 'room', x: 70, y: 45, floorId: 'f2' },
];

const today = format(new Date(), 'yyyy-MM-dd');

export const INITIAL_BOOKINGS: Booking[] = [
  { id: 'b1', resourceId: 'r1', userId: 'u2', date: today, startTime: '08:00', endTime: '13:00' },
  { id: 'b2', resourceId: 'r2', userId: 'u3', date: today, startTime: '13:00', endTime: '18:00' },
  { id: 'b3', resourceId: 'r6', userId: 'u4', date: today, startTime: '10:00', endTime: '11:30' },
  { id: 'b4', resourceId: 'r6', userId: 'u1', date: today, startTime: '14:00', endTime: '15:00' },
];
