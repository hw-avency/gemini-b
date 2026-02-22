import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { ResourceMarker } from './ResourceMarker';
import { Resource } from '../types';
import { format } from 'date-fns';

type FloorplanProps = {
  selectedDate: string;
  onResourceClick: (resource: Resource) => void;
};

export const Floorplan: React.FC<FloorplanProps> = ({ selectedDate, onResourceClick }) => {
  const { resources, isAdmin, addResource, floorplanUrl } = useAppContext();
  const [newResourcePos, setNewResourcePos] = useState<{ x: number, y: number } | null>(null);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAdmin) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setNewResourcePos({ x, y });
  };

  const handleAddResource = (type: 'desk' | 'room') => {
    if (!newResourcePos) return;
    
    const newResource: Resource = {
      id: `r${Date.now()}`,
      name: `New ${type === 'desk' ? 'Desk' : 'Room'}`,
      type,
      x: newResourcePos.x,
      y: newResourcePos.y,
    };
    
    addResource(newResource);
    setNewResourcePos(null);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-video bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Background SVG or Image */}
      {floorplanUrl ? (
        <img src={floorplanUrl} alt="Floorplan" className="w-full h-full object-cover" onClick={handleMapClick} />
      ) : (
        <svg
          className="w-full h-full text-gray-300"
          viewBox="0 0 800 450"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={handleMapClick}
        >
          {/* Mock Floorplan Lines */}
          <rect width="800" height="450" fill="#f9fafb" />
          <path d="M 50 50 L 750 50 L 750 400 L 50 400 Z" stroke="currentColor" strokeWidth="4" />
          <path d="M 50 200 L 400 200" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
          <path d="M 600 50 L 600 400" stroke="currentColor" strokeWidth="4" />
          <path d="M 600 225 L 750 225" stroke="currentColor" strokeWidth="4" />
          
          {/* Labels */}
          <text x="225" y="125" fill="#9ca3af" fontSize="24" fontFamily="sans-serif" textAnchor="middle">Open Space</text>
          <text x="675" y="137.5" fill="#9ca3af" fontSize="20" fontFamily="sans-serif" textAnchor="middle">Meeting A</text>
          <text x="675" y="312.5" fill="#9ca3af" fontSize="20" fontFamily="sans-serif" textAnchor="middle">Meeting B</text>
        </svg>
      )}

      {/* Resources */}
      {resources.map((resource) => (
        <ResourceMarker
          key={resource.id}
          resource={resource}
          date={selectedDate}
          onClick={onResourceClick}
        />
      ))}

      {/* Admin Add Resource Context Menu */}
      {isAdmin && newResourcePos && (
        <div
          className="absolute bg-white rounded-lg shadow-xl border border-gray-200 p-2 z-50 transform -translate-x-1/2 -translate-y-full mt-[-10px]"
          style={{ left: `${newResourcePos.x}%`, top: `${newResourcePos.y}%` }}
        >
          <div className="text-xs font-semibold text-gray-500 mb-2 px-2">Add Resource</div>
          <div className="flex flex-col gap-1">
            <button
              className="px-4 py-2 text-sm text-left hover:bg-gray-100 rounded transition-colors"
              onClick={() => handleAddResource('desk')}
            >
              Add Desk
            </button>
            <button
              className="px-4 py-2 text-sm text-left hover:bg-gray-100 rounded transition-colors"
              onClick={() => handleAddResource('room')}
            >
              Add Room
            </button>
            <button
              className="px-4 py-2 text-sm text-left text-red-500 hover:bg-red-50 rounded transition-colors mt-1"
              onClick={() => setNewResourcePos(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
