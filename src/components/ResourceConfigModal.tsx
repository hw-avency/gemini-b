import React, { useState, useEffect } from 'react';
import { Resource, ResourceType, DurationType } from '../types';
import { useAppContext } from '../AppContext';
import { Monitor, Users, Car, X } from 'lucide-react';

type ResourceConfigModalProps = {
  initialPos: { x: number, y: number };
  onClose: () => void;
};

export const ResourceConfigModal: React.FC<ResourceConfigModalProps> = ({ initialPos, onClose }) => {
  const { addResource, selectedFloorId, defaultResourceSettings, setDefaultResourceSettings } = useAppContext();
  
  const [type, setType] = useState<ResourceType>('desk');
  const [name, setName] = useState('New Desk');
  const [durationType, setDurationType] = useState<DurationType>('precise');
  const [bookableFrom, setBookableFrom] = useState('06:00');
  const [bookableTo, setBookableTo] = useState('18:00');
  const [interval, setInterval] = useState(30);

  // Load defaults when type changes
  useEffect(() => {
    const defaults = defaultResourceSettings[type];
    if (defaults) {
      if (defaults.durationType) setDurationType(defaults.durationType);
      if (defaults.bookableFrom) setBookableFrom(defaults.bookableFrom);
      if (defaults.bookableTo) setBookableTo(defaults.bookableTo);
      if (defaults.interval) setInterval(defaults.interval);
    }
  }, [type, defaultResourceSettings]);

  const handleTypeChange = (newType: ResourceType) => {
    setType(newType);
    setName(`New ${newType === 'desk' ? 'Desk' : newType === 'room' ? 'Room' : 'Parking'}`);
  };

  const handleSave = () => {
    const newResource: Resource = {
      id: `r${Date.now()}`,
      name,
      type,
      x: initialPos.x,
      y: initialPos.y,
      floorId: selectedFloorId,
      durationType,
      bookableFrom: durationType === 'precise' ? bookableFrom : undefined,
      bookableTo: durationType === 'precise' ? bookableTo : undefined,
      interval: durationType === 'precise' ? interval : undefined,
    };
    
    // Save defaults
    setDefaultResourceSettings({
      ...defaultResourceSettings,
      [type]: {
        durationType,
        bookableFrom,
        bookableTo,
        interval
      }
    });

    addResource(newResource);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-800">Configure Resource</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleTypeChange('desk')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  type === 'desk' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-200 text-gray-600'
                }`}
              >
                <Monitor size={24} className="mb-2" />
                <span className="text-xs font-medium">Desk</span>
              </button>
              <button
                onClick={() => handleTypeChange('room')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  type === 'room' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-200 text-gray-600'
                }`}
              >
                <Users size={24} className="mb-2" />
                <span className="text-xs font-medium">Room</span>
              </button>
              <button
                onClick={() => handleTypeChange('parking')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  type === 'parking' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-200 text-gray-600'
                }`}
              >
                <Car size={24} className="mb-2" />
                <span className="text-xs font-medium">Parking</span>
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Duration Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Booking Duration</label>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  durationType === 'precise' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setDurationType('precise')}
              >
                Precise (Timeslot)
              </button>
              <button
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  durationType === 'full_half_day' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setDurationType('full_half_day')}
              >
                Full/Half Day
              </button>
            </div>
          </div>

          {/* Precise Settings */}
          {durationType === 'precise' && (
            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Bookable From</label>
                  <input
                    type="time"
                    value={bookableFrom}
                    onChange={(e) => setBookableFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Bookable To</label>
                  <input
                    type="time"
                    value={bookableTo}
                    onChange={(e) => setBookableTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Interval</label>
                <select
                  value={interval}
                  onChange={(e) => setInterval(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={1}>1 minute</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Save Resource
          </button>
        </div>
      </div>
    </div>
  );
};
