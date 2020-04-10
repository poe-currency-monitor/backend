interface CurrencyLinePayReceive {
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

interface CurrencyLinePayReceiveSpark {
  data: number[];
  totalChange: number;
}

export interface POENinjaCurrencyLine {
  currencyTypeName: string;
  pay: CurrencyLinePayReceive;
  receive: CurrencyLinePayReceive;
  paySparkLine: CurrencyLinePayReceiveSpark;
  receiveSparkLine: CurrencyLinePayReceiveSpark;
  chaosEquivalent: number;
  lowConfidencePaySparkLine: CurrencyLinePayReceiveSpark;
  lowConfidenceReceiveSparkLine: CurrencyLinePayReceiveSpark;
  detailsId: string;
}

export interface POENinjaCurrencyDetail {
  id: number;
  icon: string;
  name: string;
  poeTradeId: number;
  tradeId: string;
}

export interface POENinjaLanguage {
  name: string;
  translations: {
    [key: string]: string;
  };
}

/**
 * poe.ninja response when accessing `poe.ninja/api/data/currencyoverview`.
 */
export interface POENinjaCurrencyOverviewResponse {
  lines: POENinjaCurrencyLine[];
  currencyDetails: POENinjaCurrencyDetail[];
  language: POENinjaLanguage;
}
