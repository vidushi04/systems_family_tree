/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { familyData } from './data/familyData';
import { ViewType, Filters, SortOption, Person } from './types';
import { Controls } from './components/Controls';
import { TreeView } from './components/TreeView';
import { TableView } from './components/TableView';
import { TimelineView } from './components/TimelineView';
import { PersonModal } from './components/PersonModal';
import { History, Info } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<ViewType>('table');
  const [sort, setSort] = useState<SortOption>('birth-asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [filters, setFilters] = useState<Filters>({
    birthMonth: '',
    birthYear: '',
    deathYear: '',
    relationship: 'all',
    generation: '',
    status: 'all'
  });

  const filteredAndSortedData = useMemo(() => {
    let result = [...familyData];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.location.toLowerCase().includes(query) ||
        p.bio?.toLowerCase().includes(query)
      );
    }

    // Filtering
    if (filters.birthYear) {
      result = result.filter(p => p.birthDate.startsWith(filters.birthYear));
    }
    if (filters.birthMonth) {
      result = result.filter(p => p.birthDate.split('-')[1] === filters.birthMonth);
    }
    if (filters.generation) {
      result = result.filter(p => p.generation === parseInt(filters.generation));
    }
    if (filters.status === 'living') {
      result = result.filter(p => !p.deathDate);
    } else if (filters.status === 'deceased') {
      result = result.filter(p => !!p.deathDate);
    }
    if (filters.relationship === 'descendants') {
      result = result.filter(p => p.parentIds.length > 0 || p.id === 'motilal');
    } else if (filters.relationship === 'spouses') {
      result = result.filter(p => p.spouseId && p.parentIds.length === 0 && p.id !== 'motilal');
    }

    // Sorting
    result.sort((a, b) => {
      switch (sort) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'birth-asc':
          return new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime();
        case 'birth-desc':
          return new Date(b.birthDate).getTime() - new Date(a.birthDate).getTime();
        case 'death-asc':
          return (a.deathDate ? new Date(a.deathDate).getTime() : Infinity) - (b.deathDate ? new Date(b.deathDate).getTime() : Infinity);
        case 'death-desc':
          return (b.deathDate ? new Date(b.deathDate).getTime() : -Infinity) - (a.deathDate ? new Date(a.deathDate).getTime() : -Infinity);
        default:
          return 0;
      }
    });

    return result;
  }, [filters, sort, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-200 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-200 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Header */}
        <header className="mb-16 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-100 text-stone-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-6"
          >
            <History size={12} />
            Modern Indian History
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-light tracking-tight text-stone-900 mb-6"
          >
            The Nehru-Gandhi <span className="italic text-emerald-800">Dynasty</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-stone-500 leading-relaxed text-lg"
          >
            An interactive exploration of one of the most prominent political families in modern history, 
            spanning five generations of leadership and legacy.
          </motion.p>
        </header>

        {/* Controls */}
        <Controls 
          filters={filters} 
          setFilters={setFilters} 
          sort={sort} 
          setSort={setSort}
          view={view}
          setView={setView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Main Content Area */}
        <main className="min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              {view === 'tree' && <TreeView data={filteredAndSortedData} onPersonClick={setSelectedPerson} />}
              {view === 'table' && <TableView data={filteredAndSortedData} onPersonClick={setSelectedPerson} />}
              {view === 'timeline' && <TimelineView data={filteredAndSortedData} onPersonClick={setSelectedPerson} />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Detail Modal */}
        <PersonModal 
          person={selectedPerson} 
          onClose={() => setSelectedPerson(null)} 
        />

        {/* Footer Info */}
        <footer className="mt-24 pt-12 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-8 text-stone-400 text-sm">
          <div className="flex items-center gap-2">
            <Info size={16} />
            <span>Data curated for educational purposes.</span>
          </div>
          <div className="flex gap-8">
            <span className="hover:text-stone-600 transition-colors cursor-pointer">Archive</span>
            <span className="hover:text-stone-600 transition-colors cursor-pointer">Sources</span>
            <span className="hover:text-stone-600 transition-colors cursor-pointer">Privacy</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
