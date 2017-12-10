export type Game = {
  nodes: Node[];
  transits: Transit[];
};

export type ObjectWithId = {
  id: string;
};

export type Node = ObjectWithId & {
  id: string;
  playerId: string;
  coordinates: { x: number; y: number };
  numUnits: number;
  rate: number;
};

export type Transit = ObjectWithId & {
  id: string;
  playerId: string;
  numUnits: number;
  to: string;
  from: string;
  departureTime: number;
  arrivalTime: number;
};
