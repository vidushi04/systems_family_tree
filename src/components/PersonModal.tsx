import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Calendar } from 'lucide-react';
import { Person } from '../types';

interface PersonModalProps {
  person: Person | null;
  onClose: () => void;
}

export const PersonModal: React.FC<PersonModalProps> = ({ person, onClose }) => {
  if (!person) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-[280px] bg-white rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-stone-500 hover:text-stone-800 transition-colors z-20 shadow-sm"
          >
            <X size={16} />
          </button>

          <div className="p-6 flex flex-col items-center">
            {/* Portrait */}
            <div className="w-[100px] h-[120px] rounded-lg overflow-hidden border-2 border-stone-100 shadow-sm mb-4">
              <img
                src={person.portrait}
                alt={person.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Info */}
            <div className="text-center w-full">
              <h2 className="text-lg font-bold text-stone-900 mb-4 leading-tight">
                {person.name}
              </h2>

              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3 text-stone-600">
                  <Calendar size={14} className="mt-1 shrink-0 text-stone-400" />
                  <div className="text-xs">
                    <div className="font-semibold text-stone-400 uppercase tracking-wider text-[9px] mb-0.5">Lifespan</div>
                    <div>
                      {new Date(person.birthDate).getFullYear()} — {person.deathDate ? new Date(person.deathDate).getFullYear() : 'Present'}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-stone-600">
                  <MapPin size={14} className="mt-1 shrink-0 text-stone-400" />
                  <div className="text-xs">
                    <div className="font-semibold text-stone-400 uppercase tracking-wider text-[9px] mb-0.5">Location</div>
                    <div className="line-clamp-2">{person.location}</div>
                  </div>
                </div>
              </div>

              {person.bio && (
                <div className="mt-6 pt-4 border-t border-stone-100">
                  <p className="text-[11px] text-stone-500 leading-relaxed italic text-left">
                    {person.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
