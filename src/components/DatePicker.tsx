import React, { useState, useRef, useEffect } from 'react';
import { format, addMonths, subMonths, addDays, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

type DatePickerProps = {
  selectedDate: string;
  onChange: (date: string) => void;
};

export const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(parseISO(selectedDate));
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setCurrentMonth(parseISO(selectedDate));
  }, [selectedDate]);

  const handlePrev = () => {
    if (isOpen) {
      setCurrentMonth(subMonths(currentMonth, 1));
    } else {
      onChange(format(subDays(parseISO(selectedDate), 1), 'yyyy-MM-dd'));
    }
  };

  const handleNext = () => {
    if (isOpen) {
      setCurrentMonth(addMonths(currentMonth, 1));
    } else {
      onChange(format(addDays(parseISO(selectedDate), 1), 'yyyy-MM-dd'));
    }
  };

  const handleDateClick = (date: Date) => {
    onChange(format(date, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start on Monday
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const dateFormat = "MMMM yyyy";
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  return (
    <div className="relative flex items-center gap-2" ref={popoverRef}>
      <button 
        onClick={handlePrev}
        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            isOpen ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'
          } rounded-xl min-w-[220px] justify-center`}
        >
          <CalendarIcon className="text-gray-500" size={18} />
          <span className="text-sm font-medium text-gray-800">
            {isOpen ? format(currentMonth, dateFormat) : format(parseISO(selectedDate), 'EEEE, MMM d, yyyy')}
          </span>
        </button>

        {isOpen && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 p-4 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 w-72">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-400 py-1">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day, i) => {
                const isSelected = isSameDay(day, parseISO(selectedDate));
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isToday = isSameDay(day, new Date());

                return (
                  <button
                    key={i}
                    onClick={() => handleDateClick(day)}
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors mx-auto
                      ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}
                      ${isSelected ? 'bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-sm' : ''}
                      ${isToday && !isSelected ? 'text-blue-600 font-semibold bg-blue-50' : ''}
                    `}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={handleNext}
        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};
