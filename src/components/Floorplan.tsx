import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { ResourceMarker } from './ResourceMarker';
import { ResourceConfigModal } from './ResourceConfigModal';
import { Resource } from '../types';
import { tText } from '../i18n';

type FloorplanProps = {
  selectedDate: string;
  onResourceClick: (resource: Resource) => void;
};

export const Floorplan: React.FC<FloorplanProps> = ({ selectedDate, onResourceClick }) => {
  const { resources, floors, selectedFloorId, isAdmin, isGridEnabled, gridSize, language } = useAppContext();
  const [newResourcePos, setNewResourcePos] = useState<{ x: number, y: number } | null>(null);

  const currentFloor = floors.find(f => f.id === selectedFloorId);
  const floorResources = resources.filter(r => r.floorId === selectedFloorId);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAdmin) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top) / rect.height) * 100;

    let x = rawX;
    let y = rawY;

    if (isGridEnabled) {
      // Snap to a grid based on an 800x450 coordinate system
      const snapX = (gridSize / 800) * 100;
      const snapY = (gridSize / 450) * 100;
      x = Math.round(rawX / snapX) * snapX;
      y = Math.round(rawY / snapY) * snapY;
    }

    setNewResourcePos({ x, y });
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-video bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Background SVG or Image */}
      {currentFloor?.floorplanUrl ? (
        <img 
          src={currentFloor.floorplanUrl} 
          alt="Floorplan" 
          className={`w-full h-full object-cover ${isAdmin ? 'cursor-crosshair' : ''}`} 
          onClick={handleMapClick} 
        />
      ) : (
        <svg
          className={`w-full h-full text-gray-300 ${isAdmin ? 'cursor-crosshair' : ''}`}
          viewBox="0 0 800 450"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={handleMapClick}
        >
          {/* Mock Floorplan Lines */}
          <rect width="800" height="450" fill="#f9fafb" />
          
          {/* Grid Overlay */}
          {isAdmin && isGridEnabled && (
            <g stroke="#e5e7eb" strokeWidth="0.5" opacity="0.5">
              {Array.from({ length: Math.ceil(800 / gridSize) + 1 }).map((_, i) => (
                <line key={`v-${i}`} x1={i * gridSize} y1="0" x2={i * gridSize} y2="450" />
              ))}
              {Array.from({ length: Math.ceil(450 / gridSize) + 1 }).map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={i * gridSize} x2="800" y2={i * gridSize} />
              ))}
            </g>
          )}

          <path d="M 50 50 L 750 50 L 750 400 L 50 400 Z" stroke="currentColor" strokeWidth="4" />
          
          {selectedFloorId === 'f1' ? (
            <>
              <path d="M 50 200 L 400 200" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M 600 50 L 600 400" stroke="currentColor" strokeWidth="4" />
              <path d="M 600 225 L 750 225" stroke="currentColor" strokeWidth="4" />
              
              {/* Labels */}
              <text x="225" y="125" fill="#9ca3af" fontSize="24" fontFamily="sans-serif" textAnchor="middle">{tText(language, 'openSpace')}</text>
              <text x="675" y="137.5" fill="#9ca3af" fontSize="20" fontFamily="sans-serif" textAnchor="middle">{tText(language, 'meetingA')}</text>
              <text x="675" y="312.5" fill="#9ca3af" fontSize="20" fontFamily="sans-serif" textAnchor="middle">{tText(language, 'meetingB')}</text>
            </>
          ) : (
            <>
              <path d="M 50 225 L 750 225" stroke="currentColor" strokeWidth="4" />
              <path d="M 400 50 L 400 225" stroke="currentColor" strokeWidth="4" />
              <path d="M 600 225 L 600 400" stroke="currentColor" strokeWidth="4" />
              
              {/* Labels */}
              <text x="225" y="137.5" fill="#9ca3af" fontSize="24" fontFamily="sans-serif" textAnchor="middle">{tText(language, 'quietZone')}</text>
              <text x="575" y="137.5" fill="#9ca3af" fontSize="20" fontFamily="sans-serif" textAnchor="middle">{tText(language, 'lounge')}</text>
              <text x="325" y="312.5" fill="#9ca3af" fontSize="24" fontFamily="sans-serif" textAnchor="middle">{tText(language, 'openSpace2')}</text>
              <text x="675" y="312.5" fill="#9ca3af" fontSize="20" fontFamily="sans-serif" textAnchor="middle">{tText(language, 'meetingC')}</text>
            </>
          )}
        </svg>
      )}

      {/* Resources */}
      {floorResources.map((resource) => (
        <ResourceMarker
          key={resource.id}
          resource={resource}
          date={selectedDate}
          onClick={onResourceClick}
        />
      ))}

      {/* Admin Add Resource Context Menu */}
      {isAdmin && newResourcePos && (
        <ResourceConfigModal
          initialPos={newResourcePos}
          onClose={() => setNewResourcePos(null)}
        />
      )}
    </div>
  );
};
