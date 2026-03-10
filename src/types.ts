export type RelationshipType = 'spouse' | 'child' | 'parent';

export interface Person {
  id: string;
  name: string;
  portrait: string;
  birthDate: string; // ISO string or YYYY-MM-DD
  deathDate?: string;
  location: string;
  generation: number;
  gender: 'male' | 'female';
  spouseId?: string;
  parentIds: string[];
  childIds: string[];
  bio?: string;
}

export type ViewType = 'tree' | 'table' | 'timeline';

export interface Filters {
  birthMonth: string;
  birthYear: string;
  deathYear: string;
  relationship: 'all' | 'descendants' | 'spouses';
  generation: string;
  status: 'all' | 'living' | 'deceased';
}

export type SortOption = 'name-asc' | 'name-desc' | 'birth-asc' | 'birth-desc' | 'death-asc' | 'death-desc';
