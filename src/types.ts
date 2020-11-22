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
