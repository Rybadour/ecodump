import {
  Accessor,
  createMemo,
  JSXElement,
  createContext,
  useContext,
  createResource,
  Resource,
} from "solid-js";
import { Store } from "solid-js/store";
import { createLocalStore } from "../../utils/createLocalStore";
import {
  filterUnique,
  sortByText,
  sortByTextExcludingWord,
} from "../../utils/helpers";
import { getRecipes, getStores, getTags, listDBs } from "../../utils/restDbSdk";

type MainContextType = {
  config: Resource<Config | undefined>;
  storesResource: Resource<StoresResponse | undefined>;
  recipesResource: Resource<Recipe[] | undefined>;
  tagsResource: Resource<Record<string, string[]> | undefined>;
  dbs: Accessor<DB[] | undefined>;
  allCurrencies: Accessor<string[] | undefined>;
  allProfessions: Accessor<string[] | undefined>;
  allCraftStations: Accessor<string[] | undefined>;
  allProductsInStores: Accessor<ProductOffer[] | undefined>;
  allCraftableProducts: Accessor<CraftableProduct[] | undefined>;
  mainState: Store<MainStore>;
  personalPricesState: Store<PersonalPricesStore>;
  update: {
    currency: (newCurrency: string) => void;
    personalPrice: (
      product: string,
      currency: string,
      newPrice: number
    ) => void;
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
  allProfessions: () => [],
  allCraftStations: () => [],
  allProductsInStores: () => [],
  allCraftableProducts: () => [],
  mainState: {
    currency: "",
  },
  personalPricesState: {},
  update: {
    currency: () => undefined,
    personalPrice: (product: string, currency: string, newPrice: number) =>
      undefined,
  },
});
type Props = {
  children: JSXElement;
};
type MainStore = {
  currency: string;
};

type PersonalPricesStore = {
  [productName: string]: { [currency: string]: number };
};

export const MainContextProvider = (props: Props) => {
  const [personalPricesState, setPersonalPricesState] =
    createLocalStore<PersonalPricesStore>({}, "PersonalPricesStore");

  const [mainState, setState] = createLocalStore<MainStore>(
    {
      currency: "",
    },
    "MainStore"
  );

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
  const allCraftableProducts = createMemo(() => {
    const CraftableProductsDict =
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
        ?.reduce(
          (prev, next) => ({
            ...prev,
            [next.Name]: {
              Name: next.Name,
              RecipeVariants: [
                ...(prev[next.Name]?.RecipeVariants ?? []),
                { Recipe: next.Recipe, Variant: next.Variant },
              ],
            } as CraftableProduct,
          }),
          {} as { [name: string]: CraftableProduct }
        ) ?? {};

    return Object.values(CraftableProductsDict)
      .map(
        (prod) =>
          ({
            ...prod,
            Offers: allProductsInStores()?.filter(
              (t) => t.ItemName === prod.Name
            ),
          } as CraftableProduct)
      )
      .sort(
        (a, b) =>
          a.Name?.toLowerCase()?.localeCompare(b.Name?.toLowerCase() ?? "") ?? 0
      );
  });

  const allProfessions = createMemo(() =>
    recipesResource()
      ?.map((recipe) => recipe.SkillNeeds.map((t) => t.Skill))
      .flat()
      .filter(filterUnique)
      .sort(sortByText)
  );

  const allCraftStations = createMemo(() =>
    recipesResource()
      ?.map((recipe) => recipe.CraftStation)
      .flat()
      .filter(filterUnique)
      .sort(sortByText)
  );

  const value = {
    config,
    storesResource,
    recipesResource,
    tagsResource,
    dbs,
    allCurrencies,
    allProfessions,
    allCraftStations,
    allProductsInStores,
    allCraftableProducts,
    mainState,
    personalPricesState,
    update: {
      currency: (newCurrency: string) => setState({ currency: newCurrency }),
      personalPrice: (product: string, currency: string, newPrice: number) =>
        setPersonalPricesState((prev) => ({
          [product]: { ...(prev[product] ?? {}), [currency]: newPrice },
        })),
    },
  } as MainContextType;

  return (
    <MainContext.Provider value={value}>{props.children}</MainContext.Provider>
  );
};

export const useMainContext = () => useContext(MainContext);
