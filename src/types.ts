export interface RecipesFile {
    recipes: {[key:string]: {
        defaultVariant: string,
        craftStn: string[],
        skillNeeds: string[][],
        numberOfVariants: string,
        variants: {[key:string]: {
            untranslated: string,
            ingredients: string[][],
            products: string[][]
        }},
    }}
};