export interface POEItem {
  verified: boolean;
  w: number;
  h: number;
  x: number;
  y: number;
  icon: string;
  league: string;
  id: string;
  name: string;
  typeLine: string;
  identified: boolean;
  ilvl: number;
  descText: string;
  frameType: number;
  stackSize: number;
  maxStackSize: number;
  inventoryId: string;
  explicitMods?: string[];
  flavourText?: string[];
}
