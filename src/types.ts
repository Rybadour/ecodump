export interface RecipesFile {
  recipes: {
    [key: string]: {
      defaultVariant: string;
      craftStn: string[];
      skillNeeds: string[][];
      numberOfVariants: string;
      variants: {
        [key: string]: {
          untranslated: string;
          ingredients: string[][];
          products: string[][];
        };
      };
    };
  };
}

export interface ItemPrice {
  itemName: string;
  price: number;
}

export interface RecipeCostProdPercentage {
  productName: string;
  percentage: number;
}

export interface RecipeCostPercentage {
  itemName: string;
  percentages: RecipeCostProdPercentage[];
}

export type RecipeVariant = {
  untranslated: string;
  ingredients: string[][];
  products: string[][];
};

export type Recipe = {
  key: string;
  name: string;
  profession: string;
  numberOfProfessions: number;
  craftStation: string;
  numberOfCraftStations: number;
  numberOfVariants: number;
  variants: {
    [key: string]: RecipeVariant;
  };
};

export type Item = {
  key: string;
  name: string;
  profession: string;
  numberOfProfessions: number;
  craftStation: string;
  numberOfCraftStations: number;
  numberOfVariants: number;
  variants: string[];
  ingredients: string[][];
  products: string[][];
};
