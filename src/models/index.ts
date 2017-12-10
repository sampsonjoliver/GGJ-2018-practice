export type ObjectWithId = {
  id?: string;
};

export type Game = {
  tick: number;
  nodes: Node[];
  transits: Transit[];
};

export type Node = ObjectWithId & {
  playerId: string;
  coordinates: { x: number; y: number };
  numUnits: number;
  rate: number;
};

export type Transit = ObjectWithId & {
  playerId: string;
  numUnits: number;
  to: string;
  from: string;
  departureTime: number | 'PENDING';
  arrivalTime: number | 'PENDING';
  isPending: boolean;
  isResolved: boolean;
};
