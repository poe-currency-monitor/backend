export interface POETab {
  n: string;
  i: number;
  id: string;
  type: string;
  hidden: boolean;
  selected: boolean;

  colour: {
    r: string;
    g: string;
    b: string;
  };

  srcL: string;
  srcC: string;
  srcR: string;
}

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

export interface POEStashTabItemsResponse {
  numTabs: number;
  items: POEItem[];
}

export interface POEStashTabItemsWithTabsResponse {
  numTabs: number;
  tabs: POETab[];
  items: POEItem[];
}
