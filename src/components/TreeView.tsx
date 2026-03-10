import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Person } from '../types';

interface TreeViewProps {
  data: Person[];
  onPersonClick: (person: Person) => void;
}

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: 'spouse' | 'child';
}

export const TreeView: React.FC<TreeViewProps> = ({ data, onPersonClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const generations = useMemo(() => {
    const uniqueGens = Array.from(new Set(data.map(p => p.generation)));
    return uniqueGens.sort((a: number, b: number) => a - b);
  }, [data]);

  const getSpouse = (person: Person) => {
    if (!person.spouseId) return null;
    return data.find(p => p.id === person.spouseId);
  };

  const calculateLines = () => {
    if (!containerRef.current || !contentRef.current) return;

    const contentRect = contentRef.current.getBoundingClientRect();
    const newLines: Line[] = [];

    // Group people by their parent sets to draw shared lines
    const parentSets = new Map<string, string[]>(); // key: sorted parent IDs, value: child IDs
    data.forEach(p => {
      if (p.parentIds.length > 0) {
        const key = [...p.parentIds].sort().join(',');
        if (!parentSets.has(key)) parentSets.set(key, []);
        parentSets.get(key)!.push(p.id);
      }
    });

    // Draw Spouse Lines
    data.forEach(person => {
      if (person.spouseId && person.id < person.spouseId) {
        const p1El = document.getElementById(`person-${person.id}`);
        const p2El = document.getElementById(`person-${person.spouseId}`);
        if (p1El && p2El) {
          const r1 = p1El.getBoundingClientRect();
          const r2 = p2El.getBoundingClientRect();
          newLines.push({
            x1: r1.right - contentRect.left,
            y1: r1.top - contentRect.top + r1.height / 2,
            x2: r2.left - contentRect.left,
            y2: r2.top - contentRect.top + r2.height / 2,
            type: 'spouse'
          });
        }
      }
    });

    // Draw Parent-Child Lines
    parentSets.forEach((childIds, parentKey) => {
      const parentIds = parentKey.split(',');
      const parentEls = parentIds.map(id => document.getElementById(`person-${id}`)).filter(Boolean) as HTMLElement[];
      const childEls = childIds.map(id => document.getElementById(`person-${id}`)).filter(Boolean) as HTMLElement[];

      if (parentEls.length > 0 && childEls.length > 0) {
        // Calculate parent connection point (midpoint of all parents)
        let parentX = 0;
        let parentY = 0;
        parentEls.forEach(el => {
          const r = el.getBoundingClientRect();
          parentX += r.left - contentRect.left + r.width / 2;
          parentY = Math.max(parentY, r.bottom - contentRect.top);
        });
        parentX /= parentEls.length;

        // Calculate children connection points
        const childPoints = childEls.map(el => {
          const r = el.getBoundingClientRect();
          return {
            x: r.left - contentRect.left + r.width / 2,
            y: r.top - contentRect.top
          };
        });

        const minY = Math.min(...childPoints.map(p => p.y));
        const midY = parentY + (minY - parentY) / 2;

        // Vertical line from parents to midY
        newLines.push({ x1: parentX, y1: parentY, x2: parentX, y2: midY, type: 'child' });

        // Horizontal line spanning all children and the parent connection
        const minX = Math.min(parentX, ...childPoints.map(p => p.x));
        const maxX = Math.max(parentX, ...childPoints.map(p => p.x));
        newLines.push({ x1: minX, y1: midY, x2: maxX, y2: midY, type: 'child' });

        // Vertical lines to each child
        childPoints.forEach(cp => {
          newLines.push({ x1: cp.x, y1: midY, x2: cp.x, y2: cp.y, type: 'child' });
        });
      }
    });

    setLines(newLines);
  };

  useEffect(() => {
    if (!contentRef.current) return;

    const observer = new ResizeObserver(() => {
      if (contentRef.current) {
        setDimensions({
          width: contentRef.current.scrollWidth,
          height: contentRef.current.scrollHeight
        });
        calculateLines();
      }
    });

    observer.observe(contentRef.current);
    
    // Also recalculate after a short delay to ensure initial layout is stable
    const timer = setTimeout(calculateLines, 500);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [data]);

  return (
    <div className="relative overflow-x-auto pb-32" ref={containerRef}>
      <div 
        ref={contentRef}
        className="min-w-[2000px] flex flex-col items-center gap-48 py-24 relative z-10"
      >
        <svg 
          className="absolute top-0 left-0 pointer-events-none z-0"
          style={{ width: dimensions.width, height: dimensions.height }}
        >
          {lines.map((line, i) => (
            <line
              key={i}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={line.type === 'spouse' ? '#E65100' : '#607D8B'}
              strokeWidth="2"
              strokeDasharray={line.type === 'spouse' ? '6 4' : '0'}
              strokeLinecap="round"
            />
          ))}
        </svg>
        
        {generations.map((gen) => {
          const members = data.filter(p => p.generation === gen);
          
          const processedIds = new Set<string>();
          const groups: { primary: Person; spouse?: Person }[] = [];

          members.forEach(p => {
            if (processedIds.has(p.id)) return;
            const spouse = getSpouse(p);
            if (spouse && members.find(m => m.id === spouse.id)) {
              groups.push({ primary: p, spouse });
              processedIds.add(p.id);
              processedIds.add(spouse.id);
            } else {
              groups.push({ primary: p });
              processedIds.add(p.id);
            }
          });

          return (
            <div key={gen} className="flex justify-center gap-32 w-full relative">
              <div className="absolute left-8 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-bold uppercase tracking-[0.4em] text-stone-300 whitespace-nowrap">
                Generation {gen}
              </div>
              {groups.map((group, idx) => (
                <div key={idx} className="flex items-center gap-12">
                  <div id={`person-${group.primary.id}`}>
                    <PersonCard person={group.primary} onClick={() => onPersonClick(group.primary)} />
                  </div>
                  {group.spouse && (
                    <div id={`person-${group.spouse.id}`}>
                      <PersonCard person={group.spouse} onClick={() => onPersonClick(group.spouse!)} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PersonCard = ({ person, onClick }: { person: Person; onClick: () => void }) => (
  <motion.button
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    onClick={onClick}
    className="w-[180px] h-[220px] bg-white border border-stone-200 rounded-3xl shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col items-center justify-center p-4 group overflow-hidden text-center"
  >
    <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border border-stone-100 shrink-0">
      <img 
        src={person.portrait} 
        alt={person.name}
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
        referrerPolicy="no-referrer"
      />
    </div>
    <div className="flex flex-col items-center gap-1">
      <h3 className="text-sm font-medium text-stone-900 leading-tight">
        {person.name}
      </h3>
      <div className="text-[11px] text-stone-500 font-medium uppercase tracking-wider">
        {new Date(person.birthDate).getFullYear()} — {person.deathDate ? new Date(person.deathDate).getFullYear() : 'Present'}
      </div>
      <div className="text-[10px] text-stone-400 mt-1 italic">
        {person.location}
      </div>
    </div>
  </motion.button>
);
