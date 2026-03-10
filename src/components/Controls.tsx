import React from 'react';
import { Search, Filter, SortAsc, Calendar, Users, Activity, X } from 'lucide-react';
import { Filters, SortOption, ViewType } from '../types';

interface ControlsProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  sort: SortOption;
  setSort: (sort: SortOption) => void;
  view: ViewType;
  setView: (view: ViewType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Controls: React.FC<ControlsProps> = ({ 
  filters, setFilters, sort, setSort, view, setView, searchQuery, setSearchQuery 
}) => {
  const years = Array.from({ length: 170 }, (_, i) => (1860 + i).toString());
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-stone-200 rounded-3xl p-8 shadow-xl shadow-stone-200/50 mb-12 relative overflow-hidden">
      {/* Subtle Saffron/Green Accents */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-white to-emerald-500 opacity-60" />
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Search & View Switcher */}
        <div className="flex-1 space-y-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by name, location or bio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-100/50 border border-stone-200 rounded-2xl pl-12 pr-12 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-2 block ml-1">Display View</label>
              <div className="flex bg-stone-100 p-1 rounded-xl">
                {(['table', 'tree', 'timeline'] as ViewType[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                      view === v ? 'bg-white text-emerald-700 shadow-sm' : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full sm:w-64">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-2 block ml-1">Sort Order</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="w-full bg-stone-100/50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="birth-asc">Birth (Oldest)</option>
                <option value="birth-desc">Birth (Newest)</option>
                <option value="death-asc">Death (Oldest)</option>
                <option value="death-desc">Death (Newest)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="lg:w-[450px] grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-2 ml-1">
              <Calendar size={12} /> Birth Year
            </label>
            <select
              value={filters.birthYear}
              onChange={(e) => setFilters({ ...filters, birthYear: e.target.value })}
              className="w-full bg-stone-100/50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold"
            >
              <option value="">All Years</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-2 ml-1">
              <Users size={12} /> Relationship
            </label>
            <select
              value={filters.relationship}
              onChange={(e) => setFilters({ ...filters, relationship: e.target.value as Filters['relationship'] })}
              className="w-full bg-stone-100/50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold"
            >
              <option value="all">All Members</option>
              <option value="descendants">Descendants</option>
              <option value="spouses">Spouses</option>
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-2 ml-1">
              <Activity size={12} /> Generation
            </label>
            <select
              value={filters.generation}
              onChange={(e) => setFilters({ ...filters, generation: e.target.value })}
              className="w-full bg-stone-100/50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold"
            >
              <option value="">All Generations</option>
              {[1, 2, 3, 4, 5].map(g => <option key={g} value={g.toString()}>Gen {g}</option>)}
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-2 ml-1">
              <Filter size={12} /> Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as Filters['status'] })}
              className="w-full bg-stone-100/50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold"
            >
              <option value="all">All Status</option>
              <option value="living">Living</option>
              <option value="deceased">Deceased</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button 
          onClick={() => {
            setFilters({
              birthMonth: '',
              birthYear: '',
              deathYear: '',
              relationship: 'all',
              generation: '',
              status: 'all'
            });
            setSearchQuery('');
          }}
          className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1"
        >
          <X size={12} /> Reset All
        </button>
      </div>
    </div>
  );
};
