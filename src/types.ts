export type User = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type ResourceType = 'desk' | 'room';

export type Resource = {
  id: string;
  name: string;
  type: ResourceType;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
};

export type Booking = {
  id: string;
  resourceId: string;
  userId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
};
