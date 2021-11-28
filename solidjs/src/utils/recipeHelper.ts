import { getTagPersonalPriceId } from "./helpers";
type SelectedRecipeVariants = { [key: string]: string };
type RecipeNode = {
  ingredientId: string;
  productName: string;
  recipeVariants: RecipeVariant[];
  selectedVariant?: RecipeVariant;
  isTag: boolean;
};
type RecipeNodeTree = RecipeNode & {
  ancestors?: RecipeNodeTree[];
};
export type RecipeNodeFlat = RecipeNode & {
  level: number;
};

export const getSelectedRecipeVariant = (
  recipeVariants: RecipeVariant[],
  recipeVariantKey?: string
) =>
  recipeVariantKey
    ? recipeVariants.find((t) => t.Variant.Key === recipeVariantKey)
    : undefined;

export const getSelectedOrFirstRecipeVariant = (
  recipeVariants: RecipeVariant[],
  recipeVariantKey?: string
): RecipeVariant | undefined =>
  getSelectedRecipeVariant(recipeVariants, recipeVariantKey) ??
  recipeVariants?.[0];

const getRecipeTreeForProduct = (
  allCraftableProducts: CraftableProduct[],
  selectedVariants: SelectedRecipeVariants,
  allTags: Record<string, string[]>,
  productName: string,
  avoidLoop: string[]
): RecipeNodeTree => {
  const craftableProduct = allCraftableProducts.find(
    (t) => t.Name === productName
  );
  if (craftableProduct == null)
    return {
      ingredientId: productName,
      productName,
      recipeVariants: [],
      isTag: false,
    };
  const selectedVariant = getSelectedOrFirstRecipeVariant(
    craftableProduct.RecipeVariants,
    selectedVariants[productName]
  );
  const ancestors = avoidLoop.includes(productName)
    ? []
    : selectedVariant?.Variant.Ingredients.map((t) =>
        getRecipeTreeForIngredient(
          allCraftableProducts,
          selectedVariants,
          allTags,
          t,
          [...avoidLoop, productName]
        )
      );

  return {
    ingredientId: productName,
    isTag: false,
    productName,
    recipeVariants: craftableProduct.RecipeVariants,
    selectedVariant,
    ancestors,
  };
};

const getRecipeTreeForTag = (
  allCraftableProducts: CraftableProduct[],
  selectedVariants: SelectedRecipeVariants,
  allTags: Record<string, string[]>,
  tagName: string,
  avoidLoop: string[]
): RecipeNodeTree => {
  const ingredientId = getTagPersonalPriceId(tagName);
  const productsInTag = allTags[tagName] ?? [];
  const craftableProducts = allCraftableProducts.filter((t) =>
    productsInTag.includes(t.Name)
  );
  if (craftableProducts == null || craftableProducts.length == 0)
    return {
      ingredientId,
      productName: `Tag: ${tagName}`,
      recipeVariants: [],
      isTag: true,
    };
  const recipeVariants = craftableProducts.map((t) => t.RecipeVariants).flat();
  const selectedVariant = getSelectedRecipeVariant(
    recipeVariants,
    selectedVariants[ingredientId]
  );
  const ancestors =
    avoidLoop.includes(ingredientId) || selectedVariant == null
      ? []
      : selectedVariant.Variant.Ingredients.map((t) =>
          getRecipeTreeForIngredient(
            allCraftableProducts,
            selectedVariants,
            allTags,
            t,
            [...avoidLoop, ingredientId]
          )
        );

  return {
    ingredientId,
    isTag: true,
    productName: `Tag: ${tagName}`,
    recipeVariants: recipeVariants,
    selectedVariant,
    ancestors,
  };
};

const getRecipeTreeForIngredient = (
  allCraftableProducts: CraftableProduct[],
  selectedVariants: SelectedRecipeVariants,
  allTags: Record<string, string[]>,
  ingredient: {
    IsSpecificItem: boolean;
    Tag: string;
    Name: string;
  },
  avoidLoop: string[]
) =>
  ingredient.IsSpecificItem
    ? getRecipeTreeForProduct(
        allCraftableProducts,
        selectedVariants,
        allTags,
        ingredient.Name,
        avoidLoop
      )
    : getRecipeTreeForTag(
        allCraftableProducts,
        selectedVariants,
        allTags,
        ingredient.Tag,
        avoidLoop
      );
const flattenRecipeTreeNode = (
  node: RecipeNodeTree,
  level = 0
): RecipeNodeFlat[] => {
  return [
    {
      ingredientId: node.ingredientId,
      isTag: node.isTag,
      productName: node.productName,
      recipeVariants: node.recipeVariants,
      selectedVariant: node.selectedVariant,
      level,
    },
    ...(
      node.ancestors?.map((t) => flattenRecipeTreeNode(t, level + 1)) ?? []
    ).flat(),
  ];
};

export const getFlatRecipeIngredients = (
  allCraftableProducts: CraftableProduct[],
  selectedRecipes: SelectedRecipeVariants,
  allTags: Record<string, string[]>,
  productName: string
) => {
  const result = getRecipeTreeForProduct(
    allCraftableProducts,
    selectedRecipes,
    allTags,
    productName,
    []
  );
  return flattenRecipeTreeNode(result);
};
