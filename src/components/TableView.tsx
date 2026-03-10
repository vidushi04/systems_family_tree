import React from 'react';
import { motion } from 'motion/react';
import { Person } from '../types';

interface TableViewProps {
  data: Person[];
  onPersonClick: (person: Person) => void;
}

export const TableView: React.FC<TableViewProps> = ({ data, onPersonClick }) => {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 border-bottom border-stone-200">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500">Member</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500">Lifespan</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500">Generation</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {data.map((person) => (
              <motion.tr 
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={person.id} 
                onClick={() => onPersonClick(person)}
                className="hover:bg-stone-50/80 transition-colors group cursor-pointer"
              >
                <td className="px-6 py-3">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-stone-200 shrink-0">
                      <img 
                        src={person.portrait} 
                        alt={person.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-stone-900 text-sm">{person.name}</div>
                      <div className="text-[10px] text-stone-400 uppercase tracking-wider">{person.location}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3 text-sm text-stone-600 font-medium">
                  {new Date(person.birthDate).getFullYear()} — {person.deathDate ? new Date(person.deathDate).getFullYear() : 'Present'}
                </td>
                <td className="px-6 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-100 text-stone-500 uppercase tracking-tighter">
                    Gen {person.generation}
                  </span>
                </td>
                <td className="px-6 py-3">
                  {person.deathDate ? (
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Deceased</span>
                  ) : (
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Living</span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length === 0 && (
        <div className="p-12 text-center text-stone-400 italic">
          No family members match the current filters.
        </div>
      )}
    </div>
  );
};
