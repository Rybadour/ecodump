declare interface DbResponse<T> {
  success: boolean;
  data: T;
}

declare interface Dictionary<T> {
  [key: string]: T;
}

declare interface OffersV1 {
  ItemName: string;
  Buying: boolean;
  Price: number;
  Quantity: number;
  Limit: number;
  MaxNumWanted: number;
  MinDurability: number;
}

declare interface StoresV1 {
  Name: string;
  Owner: string;
  Balance: number;
  CurrencyName: string;
  Enabled: boolean;
  AllOffers: OffersV1[];
}

declare interface StoresHistV1 {
  Version: number;
  Stores: StoresV1[];
  ExportedAtYear: number;
  ExportedAtMonth: number;
  ExportedAtDay: number;
  ExportedAtHour: number;
  ExportedAtMin: number;
  ExportedAt: string;
}
