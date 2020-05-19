export interface POECharacter {
  name: string;
  league: string;
  classId: number;
  ascendencyClass: number;
  class: string;
  level: number;
  experience: number;
}

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
  descrText: string;
  frameType: number;
  stackSize?: number;
  maxStackSize?: number;
  inventoryId: string;
  explicitMods?: string[];
  flavourText?: string[];
  properties?: {
    displayMode: number;
    name: string;
    values: (string | number)[][];
    type?: number;
  }[];
}

export interface POEIncome {
  chaos: number;
  exalt: number;
  unit: number;
}

export interface POEItemIncome {
  item: POEItem;
  income: POEIncome;
}

export interface POEIncomeHistory {
  id: string;
  income: POEIncome;
  items: POEItemIncome[];
  tabId: string;
  date: Date;
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
