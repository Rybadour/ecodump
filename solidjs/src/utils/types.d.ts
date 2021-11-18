declare interface DbResponse<T> {
  success: boolean;
  data: T;
}

declare interface Dictionary<T> {
  [key: string]: T;
}

declare interface ExportedAt {
  Year: number;
  Month: number;
  Day: number;
  Hour: number;
  Min: number;
  Sec: number;
  StringRepresentation: string;
  Ticks: number;
}

declare interface StoresResponse {
  Version: number;
  Stores: Stores[];
  ExportedAt: ExportedAt;
}

declare interface Stores {
  Name: string;
  Owner: string;
  Balance: number;
  CurrencyName: string;
  Enabled: boolean;
  AllOffers: Offers[];
}

declare interface Offers {
  ItemName: string;
  Buying: boolean;
  Price: number;
  Quantity: number;
  Limit: number;
  MaxNumWanted: number;
  MinDurability: number;
}

declare interface ProductOffer extends Offers {
  StoreName: string;
  StoreOwner: string;
  CurrencyName: string;
}

// declare interface StoresHistV1 {
//   Version: number;
//   Stores: StoresV1[];
//   ExportedAtYear: number;
//   ExportedAtMonth: number;
//   ExportedAtDay: number;
//   ExportedAtHour: number;
//   ExportedAtMin: number;
//   ExportedAt: string;
// }

// declare interface RecipeV1 {
//   Key: string;
//   Untranslated: string;
//   BaseCraftTime: number;
//   BaseLaborCost: number;
//   BaseXPGain: number;
//   CraftStation: string[];
//   DefaultVariant: string;
//   NumberOfVariants: number;
//   SkillNeeds: {
//     Skill: string;
//     Level: number;
//   }[];
//   Variants: {
//     Key: string;
//     Name: string;
//     Ingredients: RecipeV1Ingredient[];
//     Products: {
//       Name: string;
//       Ammount: number;
//     }[];
//   }[];
// }

// declare interface RecipeV1Ingredient {
//   IsSpecificItem: boolean;
//   Tag: string;
//   Name: string;
//   Ammount: number;
//   IsStatic: boolean;
// }
