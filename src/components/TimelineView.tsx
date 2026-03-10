import React from 'react';
import { motion } from 'motion/react';
import { Person } from '../types';

interface TimelineViewProps {
  data: Person[];
  onPersonClick: (person: Person) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ data, onPersonClick }) => {
  const startYear = 1860;
  const endYear = 2030;
  const totalYears = endYear - startYear;

  const getPosition = (dateStr: string) => {
    const year = new Date(dateStr).getFullYear();
    return ((year - startYear) / totalYears) * 100;
  };

  // Sort by birth year for vertical stacking
  const sortedData = [...data].sort((a, b) => 
    new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime()
  );

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm overflow-x-auto">
      <div className="min-w-[1200px] relative pt-12 pb-12">
        {/* Background Grid Lines */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 9 }, (_, i) => 1860 + i * 20).map(year => {
            const left = ((year - startYear) / totalYears) * 100;
            return (
              <div 
                key={year} 
                className="absolute top-0 bottom-0 border-l border-dashed border-stone-100" 
                style={{ left: `${left}%` }}
              />
            );
          })}
        </div>

        {/* Year Markers */}
        <div className="absolute top-0 left-0 w-full h-8 border-b border-stone-100">
          {Array.from({ length: 9 }, (_, i) => 1860 + i * 20).map(year => {
            const left = ((year - startYear) / totalYears) * 100;
            return (
              <div 
                key={year} 
                className="absolute text-[10px] font-bold text-stone-300 -translate-x-1/2"
                style={{ left: `${left}%` }}
              >
                {year}
                <div className="absolute left-1/2 top-4 w-px h-2 bg-stone-200" />
              </div>
            );
          })}
        </div>

        {/* Timeline Rows */}
        <div className="space-y-12 mt-12 relative z-10">
          {sortedData.map((person) => {
            const left = getPosition(person.birthDate);
            
            return (
              <div key={person.id} className="relative h-24 group">
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => onPersonClick(person)}
                  style={{ left: `${left}%` }}
                  className="absolute flex items-center bg-white border border-stone-200 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-300 transition-all overflow-hidden w-[300px] h-20 text-left group"
                >
                  <div className="w-20 h-20 shrink-0 overflow-hidden">
                    <img 
                      src={person.portrait} 
                      alt={person.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-between h-full flex-1 overflow-hidden">
                    <div className="text-[10px] font-bold text-stone-900 leading-tight line-clamp-2 max-w-[180px]">
                      {person.name}
                    </div>
                    <div className="flex justify-between items-end text-[11px] font-semibold text-indigo-700">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-stone-400 uppercase tracking-tighter">Born</span>
                        <span>{new Date(person.birthDate).getFullYear()}</span>
                      </div>
                      {person.deathDate && (
                        <div className="flex flex-col text-right">
                          <span className="text-[9px] text-stone-400 uppercase tracking-tighter">Died</span>
                          <span>{new Date(person.deathDate).getFullYear()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.button>
                
                {/* Vertical Guide Line */}
                <div 
                  className="absolute top-0 bottom-0 w-px bg-stone-100 -z-10" 
                  style={{ left: `${left}%` }} 
                />
              </div>
            );
          })}
        </div>
      </div>
      
      {data.length === 0 && (
        <div className="p-12 text-center text-stone-400 italic">
          No family members match the current filters.
        </div>
      )}
    </div>
  );
};
