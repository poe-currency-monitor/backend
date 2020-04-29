export interface Language {
  name: string;
  translations: {
    [key: string]: string;
  };
}

export namespace Currency {
  interface LinePayReceive {
    id: number;
    league_id: number;
    pay_currency_id: number;
    get_currency_id: number;
    sample_time_utc: string;
    count: number;
    value: number;
    data_point_count: number;
    includes_secondary: boolean;
  }

  interface LinePayReceiveSpark {
    data: number[];
    totalChange: number;
  }

  export interface Line {
    currencyTypeName: string;
    pay: LinePayReceive;
    receive: LinePayReceive;
    paySparkLine: LinePayReceiveSpark;
    receiveSparkLine: LinePayReceiveSpark;
    chaosEquivalent: number;
    lowConfidencePaySparkLine: LinePayReceiveSpark;
    lowConfidenceReceiveSparkLine: LinePayReceiveSpark;
    detailsId: string;
  }

  export interface Detail {
    id: number;
    icon: string;
    name: string;
    poeTradeId: number;
    tradeId: string;
  }

  /**
   * poe.ninja response when accessing `poe.ninja/api/data/currencyoverview`.
   */
  export interface Response {
    lines: Line[];
    currencyDetails: Detail[];
    language: Language;
  }
}

export namespace Item {
  interface Sparkline {
    data: number[];
    totalChange: number;
  }

  interface Modifier {
    text: string;
    optional: boolean;
  }

  export interface Line {
    artFilename: string | null;
    baseType: string | null;
    chaosValue: number;
    corrupted: boolean;
    count: number;
    detailsId: string;
    exaltedValue: number;
    explicitModifiers: Modifier[];
    flavourText: string;
    gemLevel: number;
    gemQuality: number;
    icon: string;
    id: number;
    implicitModifiers: Modifier[];
    itemClass: number;
    itemType: string;
    levelRequired: number;
    links: number;
    lowConfidenceSparkline: Sparkline;
    mapTier: number;
    name: string;
    prophecyText: string | null;
    sparkline: Sparkline;
    stackSize: number;
    tradeInfo: string | null;
    variant: string | null;
  }

  export interface Response {
    lines: Line[];
    language: Language;
  }
}
