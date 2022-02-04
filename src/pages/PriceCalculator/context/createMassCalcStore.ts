import { Accessor, createMemo } from "solid-js";
import { createStore, Store } from "solid-js/store";
import { useMainContext } from "../../../hooks/MainContext";
import { createLocalStore } from "../../../utils/createLocalStore";
import { filterUnique } from "../../../utils/helpers";
import { useCalcContext } from "./CalcContext";

type StoreType = {
};

type ProductListingType = {
  product: CraftableProduct;
  cost: number;
  craftAmount: number;
}

type StoreUpdate = {
};

export type MassCalcStore = {
  state: Store<StoreType>;
  professions: Accessor<string[]>;
  tables: Accessor<string[]>;
  ingredients: Accessor<RecipeIngredient[]>;
  products: Accessor<ProductListingType[]>;
  get: {
    professionLevel: (name: string) => number;
    professionLavish: (name: string) => boolean;
    tableModule: (name: string) => number;
  };
  update: {
    professionLevel: (name: string, level: number) => void;
    professionLavish: (name: string, enabled: boolean) => void;
    tableModule: (name: string, module: number) => void;
  };
};

export default (): MassCalcStore => {
  const { mainState, get, allCraftableProducts, tagsResource } = useMainContext();
  const {listProductsStore} = useCalcContext();
  const [professionLevels, setProfessionLevels] = createStore<Record<string, number>>({});
  const [professionLavish, setProfessionLavish] = createStore<Record<string, boolean>>({});
  const [tableModule, setTableModule] = createStore<Record<string, number>>({});
  const [state, setState] = createStore<StoreType>(
    {
    }
  );

  const professions = createMemo(() => 
    listProductsStore.filteredProducts()
    ?.flatMap(
      (prod) => prod.RecipeVariants.flatMap(
        (v) => v.Recipe.SkillNeeds.flatMap(
          (sn) => sn.Skill
        )
      )
    ).filter(filterUnique) ?? []
  );

  const tables = createMemo(() => 
    listProductsStore.filteredProducts()?.flatMap(
      (prod) => prod.RecipeVariants.flatMap(
        (v) => v.Recipe.CraftStation
      )
    ).filter(filterUnique) ?? []
  );

  const ingredients = createMemo(() => 
    listProductsStore.filteredProducts()?.flatMap(
      (prod) => prod.RecipeVariants.flatMap(
        (v) => v.Variant.Ingredients
      )
    ).filter((ingredient, i, list) => 
      list.findIndex((other, j) => other.Name == ingredient.Name && i < j) < 0
    ) ?? []
  );

  const products = createMemo(() =>
    listProductsStore.filteredProducts()?.map((prod) => ({
      product: prod,
      cost: 0,
      craftAmount: 10,
    })) ?? []
  );

  /* *
  const [selectedProduct, setSelectedProduct] = createSignal<string>();

  const [selectedRecipes, setSelectedRecipes] = createSignal<SelectedRecipes>(
    {}
  );

  const professions = createMemo(() => )

  // Ingredients for the selected product (NOT the focused product!)
  const flatRecipeIngredientsTree = createMemo(() =>
    getFlatRecipeIngredients(
      allCraftableProducts() ?? [],
      selectedRecipes(),
      tagsResource() ?? {},
      selectedProduct() ?? ""
    )
  );
  /* */

  return {
    state,
    professions,
    tables,
    ingredients,
    products,
    get: {
      professionLevel: (name: string) => professionLevels[name],
      professionLavish: (name: string) => professionLavish[name],
      tableModule: (name: string) => tableModule[name],
    },
    update: {
      professionLevel: (name: string, level: number) => 
        setProfessionLevels({ [name]: level }),
      professionLavish: (name: string, enabled: boolean) =>
        setProfessionLavish({ [name]: enabled }),
      tableModule: (name: string, module: number) =>
        setTableModule({ [name]: module }),
    }
  };
};
