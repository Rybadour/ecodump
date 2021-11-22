import { Accessor, createMemo, JSXElement } from "solid-js";
import { createContext, useContext, createResource, Resource } from "solid-js";
import { Store } from "solid-js/store";
import { createLocalStore } from "../../utils/createLocalStore";
import { filterUnique, sortByTextExcludingWord } from "../../utils/helpers";
import { getRecipes, getStores, getTags, listDBs } from "../../utils/restDbSdk";

type MainContextType = {
  config: Resource<Config | undefined>;
  storesResource: Resource<StoresResponse | undefined>;
  recipesResource: Resource<Recipe[] | undefined>;
  tagsResource: Resource<Record<string, string[]> | undefined>;
  dbs: Accessor<DB[] | undefined>;
  allCurrencies: Accessor<string[] | undefined>;
  allProductsInStores: Accessor<ProductOffer[] | undefined>;
  allCraftableProducts: Accessor<CraftableProduct[] | undefined>;
  mainState: Store<MainStore>;
  update: {
    currency: (newCurrency: string) => void;
  };
};

const [config] = createResource(listDBs);
const [storesResource] = createResource(
  () => config()?.Dbs?.find((db) => db.Name === "Stores")?.Bin ?? null,
  getStores
);
const [recipesResource] = createResource(
  () => config()?.Dbs?.find((db) => db.Name === "Recipes")?.Bin ?? null,
  getRecipes
);
const [tagsResource] = createResource(
  () => config()?.Dbs?.find((db) => db.Name === "Tags")?.Bin ?? null,
  getTags
);

const MainContext = createContext<MainContextType>({
  config,
  storesResource,
  recipesResource,
  tagsResource,
  dbs: () => [],
  allCurrencies: () => [],
  allProductsInStores: () => [],
  allCraftableProducts: () => [],
  mainState: {
    currency: "",
  },
  update: { currency: () => undefined },
});
type Props = {
  children: JSXElement;
};
type MainStore = {
  currency: string;
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
            Offers: allProductsInStores()?.filter(
              (t) => t.ItemName === prod.Name
            ),
          }))
        )?.flat()
      )
      ?.flat()
      .sort((a, b) => a.Name.toLowerCase().localeCompare(b.Name.toLowerCase()))
  );
  const [mainState, setState] = createLocalStore<MainStore>(
    {
      currency: "",
    },
    "MainStore"
  );

  const value = {
    config,
    storesResource,
    recipesResource,
    tagsResource,
    dbs,
    allCurrencies,
    allProductsInStores,
    allCraftableProducts,
    mainState,
    update: {
      currency: (newCurrency: string) => setState({ currency: newCurrency }),
    },
  } as MainContextType;

  return (
    <MainContext.Provider value={value}>{props.children}</MainContext.Provider>
  );
};

export const useMainContext = () => useContext(MainContext);
