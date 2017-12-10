export type ObjectWithId = {
  id?: string;
};

export type Game = ObjectWithId & {
  tick: number;
};

export type Node = ObjectWithId & {
  playerId: string;
  coordinates: { x: number; y: number };
  numUnits: number;
  rate: number;
};

export type Player = ObjectWithId & {
  name: string;
  colour: string;
};

export type Transit = ObjectWithId & {
  playerId: string;
  numUnits: number;
  to: string;
  from: string;
  departureTick: number;
  arrivalTick: number;
  isPending: boolean;
  isResolved: boolean;
};
