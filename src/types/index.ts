export type BowType = 'Recurve' | 'Barebow';

export interface RoundDistance {
  distanceMeters: number;
  endCount: number;
  arrowsPerEnd: number;
}

export interface RoundDefinition {
  id: string;
  name: string;
  distances: RoundDistance[];
  goldScore: number;
  maxArrowScore: number;
  allowances: number[];
}

export interface Archer {
  id: string;
  name: string;
  bowType: BowType;
  handicap: number | null;
  scores: (number | null)[];
}

export interface OpponentArcher {
  id: string;
  name: string;
  bowType: BowType;
  handicap: number | null;
  totalScore: number;
}

export interface OpponentClub {
  id: string;
  clubName: string;
  archers: OpponentArcher[];
}

export interface Session {
  id: string;
  clubName: string;
  date: string;
  roundId: string;
  archers: Archer[];
  opponents: OpponentClub[];
}
