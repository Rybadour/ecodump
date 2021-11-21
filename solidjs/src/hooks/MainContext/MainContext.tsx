import { Accessor, createEffect, createMemo, JSXElement } from "solid-js";
import {
  createSignal,
  createContext,
  useContext,
  createResource,
  Resource,
} from "solid-js";
import { filterUnique, sortByTextExcludingWord } from "../../utils/helpers";
import { getRecipes, getStores, listDBs } from "../../utils/restDbSdk";

type MainContextType = {
  config: Resource<Config | undefined>;
  storesResource: Resource<StoresResponse | undefined>;
  recipesResource: Resource<Recipe[] | undefined>;
  dbs: Accessor<DB[] | undefined>;
  allCurrencies: Accessor<string[] | undefined>;
  allProductsInStores: Accessor<ProductOffer[] | undefined>;
  allCraftableProducts: Accessor<CraftableProduct[] | undefined>;
};

const [config] = createResource(listDBs);
const [storesResource] = createResource(getStores);
const [recipesResource] = createResource(getRecipes);

const MainContext = createContext<MainContextType>({
  config,
  storesResource,
  recipesResource,
  dbs: () => [],
  allCurrencies: () => [],
  allProductsInStores: () => [],
  allCraftableProducts: () => [],
});
type Props = {
  children: JSXElement;
};
export const MainContextProvider = (props: Props) => {
  const dbs = createMemo(() => config()?.Dbs);

  const allCurrencies = createMemo(() =>
    storesResource()
      ?.Stores.map((store) => store.CurrencyName)
      .filter(filterUnique)
      .sort(sortByTextExcludingWord("Credit"))
  );
  const allProductsInStores = createMemo(() =>
    storesResource()
      ?.Stores.map((store) =>
        store.AllOffers.map(
          (offer) =>
            ({
              ...offer,
              StoreName: store.Name,
              StoreOwner: store.Owner,
              CurrencyName: store.CurrencyName,
            } as ProductOffer)
        )
      )
      .flat()
      .sort((a, b) => {
        const nameSort = a.ItemName.toLowerCase().localeCompare(
          b.ItemName.toLowerCase()
        );
        if (nameSort !== 0) {
          return nameSort;
        }
        return a.Buying ? 1 : -1;
      })
  );
  const allCraftableProducts = createMemo(() =>
    recipesResource()
      ?.map((recipe) =>
        recipe.Variants.map((variant) =>
          variant.Products.map((prod) => ({
            Name: prod.Name,
            Recipe: recipe,
            Variant: variant,
          }))
        )?.flat()
      )
      ?.flat()
      .sort((a, b) => a.Name.toLowerCase().localeCompare(b.Name.toLowerCase()))
  );

  const store = {
    storesResource,
    recipesResource,
    dbs,
    allCurrencies,
    allProductsInStores,
    allCraftableProducts,
  } as MainContextType;

  return (
    <MainContext.Provider value={store}>{props.children}</MainContext.Provider>
  );
};

export const useMainContext = () => useContext(MainContext);
