import {
  getIngredientId,
  getRecipeEvenPercentages,
} from "./../../../utils/helpers";
import {
  getFlatRecipeIngredients,
  RecipeNodeFlat,
} from "./../../../utils/recipeHelper";
import { useMainContext } from "./../../../hooks/MainContext/MainContext";
import { createLocalStore } from "../../../utils/createLocalStore";
import { Store } from "solid-js/store";
import { Accessor, createMemo, createSignal } from "solid-js";
import { getSelectedOrFirstRecipeVariant } from "../../../utils/recipeHelper";
import {
  calcAmmount,
  calcPrice,
  formatNumber,
  convertToMarginMultiplier,
} from "../../../utils/helpers";

type StoreType = {
  showRecipes: boolean;
  focusedProd?: { name: string; isSpecificProduct: boolean };
};

type StoreUpdate = {
  setShowRecipes: (showRecipes: boolean) => void;
  setFocusedProduct: (focusedProd: string, isSpecificProduct: boolean) => void;
};

type SelectedRecipes = {
  [key: string]: string;
};

export type PriceCalcStore = {
  state: Store<StoreType>;
  craftModule: Accessor<number>;
  craftAmmount: Accessor<number>;
  recipeMargin: Accessor<number>;
  focusedNode: Accessor<RecipeNodeFlat | undefined>;
  selectedVariant: Accessor<RecipeVariant | undefined>;
  recipeIngredients: Accessor<
    (RecipeIngredient & {
      calcQuantity: number;
      unitPrice: number;
      calcPrice: number;
    })[]
  >;
  totalIngredientCost: Accessor<number>;
  unitCostWithProfit: Accessor<number>;
  recipeProducts: Accessor<
    {
      costPercentage: number;
      productionCost: number;
      retailPrice: number;
      Name: string;
      Ammount: number;
    }[]
  >;
  costPercentages: Accessor<
    {
      prod: string;
      perc: number;
    }[]
  >;
  selectedProduct: Accessor<string | undefined>;
  selectedRecipes: Accessor<SelectedRecipes>;
  setSelectedProduct: (prod: string | undefined) => void;
  setSelectedRecipes: SetSignal<SelectedRecipes>;
  update: StoreUpdate;
};

const multipliers = [1, 0.9, 0.75, 0.6, 0.55, 0.5];
export default (): PriceCalcStore => {
  const { get, allCraftableProducts, tagsResource } = useMainContext();
  const [state, setState] = createLocalStore<StoreType>(
    {
      showRecipes: false,
      focusedProd: undefined,
    },
    "PriceCalculatorPriceCalcStore"
  );

  const [selectedProduct, setSelectedProduct] = createSignal<string>();

  const [selectedRecipes, setSelectedRecipes] = createSignal<SelectedRecipes>(
    {}
  );

  const craftModule = createMemo(() =>
    get.craftModule(state.focusedProd?.name)
  );
  const craftAmmount = createMemo(() =>
    get.craftAmmount(state.focusedProd?.name)
  );

  const flatRecipeIngredients = createMemo(() =>
    getFlatRecipeIngredients(
      allCraftableProducts() ?? [],
      selectedRecipes(),
      tagsResource() ?? {},
      selectedProduct() ?? ""
    )
  );

  const focusedNode = createMemo(() =>
    flatRecipeIngredients().find(
      (t) => t.ingredientId == state.focusedProd?.name
    )
  );

  const selectedVariant = createMemo(() =>
    getSelectedOrFirstRecipeVariant(
      focusedNode()?.recipeVariants ?? [],
      selectedRecipes()[state.focusedProd?.name ?? ""]
    )
  );

  const recipeMargin = createMemo(() =>
    get.recipeMargin(selectedVariant()?.Recipe.Key)
  );

  const costPercentages = createMemo(() => {
    const variant = selectedVariant()?.Variant;
    if (variant == null) return [];
    return get.costPercentage(variant.Key) ?? getRecipeEvenPercentages(variant);
  });

  const recipeIngredients = createMemo(() => {
    const variant = selectedVariant();
    if (variant == undefined) return [];
    return variant.Variant.Ingredients.map((ingredient) => {
      const quantity = formatNumber(
        ingredient.Ammount *
          (ingredient.IsStatic ? 1 : multipliers[craftModule()])
      );
      const quantityBasedOnCraftAmmount = calcAmmount(quantity, craftAmmount());
      return {
        ...ingredient,
        calcQuantity: quantityBasedOnCraftAmmount,
        unitPrice: calcPrice(
          quantityBasedOnCraftAmmount / craftAmmount(),
          get.personalPrice(getIngredientId(ingredient))
        ),
        calcPrice: calcPrice(
          quantityBasedOnCraftAmmount,
          get.personalPrice(getIngredientId(ingredient))
        ),
      };
    });
  });

  const totalIngredientCost = createMemo(() =>
    formatNumber(
      recipeIngredients()?.reduce((prev, next) => prev + next.calcPrice, 0) ?? 0
    )
  );

  const unitCostWithProfit = createMemo(() =>
    formatNumber(
      (totalIngredientCost() / craftAmmount()) *
        convertToMarginMultiplier(recipeMargin())
    )
  );

  const recipeProducts = createMemo(() => {
    const variant = selectedVariant();
    if (variant == undefined) return [];
    return variant.Variant.Products.map((product) => {
      const costPercentage =
        costPercentages().find((t) => t.prod === product.Name)?.perc ?? 0;
      return {
        ...product,
        costPercentage,
        productionCost: formatNumber(
          ((totalIngredientCost() / craftAmmount()) * (costPercentage / 100)) /
            product.Ammount
        ),
        retailPrice: formatNumber(
          (unitCostWithProfit() * (costPercentage / 100)) / product.Ammount
        ),
      };
    });
  });

  return {
    state,
    craftModule,
    craftAmmount,
    recipeMargin,
    recipeIngredients,
    totalIngredientCost,
    unitCostWithProfit,
    recipeProducts,
    focusedNode,
    selectedVariant,
    selectedProduct,
    selectedRecipes,
    costPercentages,
    setSelectedProduct: (prod: string | undefined) => {
      setSelectedProduct(prod);
      if (prod != undefined)
        setState({ focusedProd: { name: prod, isSpecificProduct: true } });
    },
    setSelectedRecipes,
    update: {
      setShowRecipes: (newValue: boolean) =>
        setState({ showRecipes: newValue }),
      setFocusedProduct: (prod: string, isSpecificProduct: boolean) =>
        setState({
          focusedProd: { name: prod, isSpecificProduct },
        }),
    } as StoreUpdate,
  };
};
