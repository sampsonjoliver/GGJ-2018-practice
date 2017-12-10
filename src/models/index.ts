export type Node = {
  id: string;
  playerId: string;
  coordinates: { x: number; y: number };
  numUnits: number;
  rate: number;
};

export type Transit = {
  id: string;
  playerId: string;
  numUnits: number;
  to: string;
  from: string;
  departureTime: number;
  arrivalTime: number;
};
