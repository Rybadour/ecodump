import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
} from "react";
import useLocalStorage from "./context/useLocalStorage";
import { getStores, getStoresLastUpdate } from "./sdk/restDbSdk";
import {
  Currency,
  CurrencyList,
  GamePrice,
  ItemPrice,
  RecipeCostPercentage,
  RecipeCostProdPercentage,
  RecipeCraftAmmount,
  SelectedVariants,
} from "./types";
const AppContext = React.createContext<{
  currencyList: CurrencyList;
  setCurrencyList: Dispatch<SetStateAction<CurrencyList>>;
  currencySymbol: string;
  prices: ItemPrice[];
  gamePrices: { [key: string]: GamePrice[] };
  updatePrice: (
    itemName: string,
    newPrice: number | undefined,
    currencyName?: string
  ) => void;
  selectedVariants: SelectedVariants;
  setSelectedVariants: Dispatch<SetStateAction<SelectedVariants>>;
  filterProfessions: string[];
  setFilterProfessions: Dispatch<SetStateAction<string[]>>;
  filterCraftStations: string[];
  setFilterCraftStations: Dispatch<SetStateAction<string[]>>;
  filterName: string;
  setFilterName: Dispatch<SetStateAction<string>>;
  filterWithRecipe: boolean;
  setFilterWithRecipe: Dispatch<SetStateAction<boolean>>;
  itemCostPercentages: RecipeCostPercentage[];
  setItemCostPercentages: Dispatch<SetStateAction<RecipeCostPercentage[]>>;
  updateItemCostPercentage: (
    itemName: string,
    prodName: string,
    newPercentage: number
  ) => void;
  getRecipeCraftAmmount: (recipeName: string) => number;
  updateRecipeCraftAmmount: (recipeName: string, newAmmount: number) => void;
}>({
  currencyList: { selectedCurrency: "", currencies: [] },
  setCurrencyList: () => undefined,
  currencySymbol: "",
  prices: [],
  updatePrice: () => undefined,
  gamePrices: {},
  selectedVariants: {},
  setSelectedVariants: () => undefined,
  filterProfessions: [],
  setFilterProfessions: () => undefined,
  filterCraftStations: [],
  setFilterCraftStations: () => undefined,
  filterName: "",
  setFilterName: () => undefined,
  filterWithRecipe: true,
  setFilterWithRecipe: () => undefined,
  itemCostPercentages: [],
  setItemCostPercentages: () => undefined,
  updateItemCostPercentage: () => undefined,
  getRecipeCraftAmmount: () => 0,
  updateRecipeCraftAmmount: () => undefined,
});

const getNewPriceArray = (
  prevPrices: ItemPrice[],
  itemPriceIndex: number,
  itemName: string,
  newPrice: number | undefined
) => {
  // Delete itemPrice if newPrice is undefined
  if (newPrice === undefined && itemPriceIndex >= 0) {
    return [
      ...prevPrices.slice(0, itemPriceIndex),
      ...prevPrices.slice(itemPriceIndex + 1),
    ];
  }

  // Update itemPrice if it exists in array
  if (newPrice !== undefined && itemPriceIndex >= 0) {
    return [
      ...prevPrices.slice(0, itemPriceIndex),
      { ...prevPrices[itemPriceIndex], price: newPrice },
      ...prevPrices.slice(itemPriceIndex + 1),
    ];
  }

  // Add new itemPrice if it doesn't exist in array yet
  if (newPrice !== undefined && itemPriceIndex < 0) {
    return [
      ...prevPrices,
      {
        itemName: itemName,
        price: newPrice,
      },
    ];
  }

  return prevPrices;
};

const updatePrice = (
  setCurrencies: Dispatch<SetStateAction<CurrencyList>>,
  itemName: string,
  newPrice: number | undefined,
  currencyName?: string
) => {
  if (newPrice !== undefined && Number.isNaN(newPrice)) return;
  setCurrencies((prevCurrencies) => {
    const prevSelectedCurrencyIndex = prevCurrencies.currencies.findIndex(
      (t) => t.name === (currencyName ?? prevCurrencies.selectedCurrency)
    );
    const prevPrices =
      prevCurrencies.currencies[prevSelectedCurrencyIndex]?.itemPrices ?? [];
    const index = prevPrices.findIndex((t) => t.itemName === itemName);

    return {
      ...prevCurrencies,
      currencies: [
        ...prevCurrencies.currencies.slice(0, prevSelectedCurrencyIndex),
        {
          ...prevCurrencies.currencies[prevSelectedCurrencyIndex],
          itemPrices: getNewPriceArray(prevPrices, index, itemName, newPrice),
        },
        ...prevCurrencies.currencies.slice(prevSelectedCurrencyIndex + 1),
      ],
    };
  });
};

// Fixes percentages so that the sum is 100%
const fixPercentages = (
  prodName: string,
  newPercentage: number,
  percentages: RecipeCostProdPercentage[]
) => {
  let sum = newPercentage;
  return percentages.map((t, index) => {
    let percentage = t.productName === prodName ? newPercentage : t.percentage;
    if (t.productName !== prodName) {
      if (sum + percentage > 100) {
        percentage = 100 - sum;
      }
      sum += percentage;
    }
    if (index === percentages.length - 1) {
      percentage += 100 - sum;
    }
    return {
      ...t,
      percentage,
    };
  });
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [storesDb, setStoresDb] = useLocalStorage<StoresHistV1>("storesDb", {
    Version: 1,
    Stores: [],
    ExportedAtYear: 0,
    ExportedAtMonth: 0,
    ExportedAtDay: 0,
    ExportedAtHour: 0,
    ExportedAtMin: 0,
    ExportedAt: "",
  });

  const [currencyList, setCurrencyList] = useLocalStorage<CurrencyList>(
    "currencyList",
    {
      selectedCurrency: "default",
      currencies: [
        { name: "default", symbol: "$", itemPrices: [], gamePrices: [] },
      ],
    }
  );
  const [
    selectedVariants,
    setSelectedVariants,
  ] = useLocalStorage<SelectedVariants>("selectedVariant", {});

  const [filterProfessions, setFilterProfessions] = useLocalStorage<string[]>(
    "filterProfessions",
    []
  );

  const [filterCraftStations, setFilterCraftStations] = useLocalStorage<
    string[]
  >("filterCraftStations", []);

  const [filterName, setFilterName] = useLocalStorage<string>("filter", "");

  const [filterWithRecipe, setFilterWithRecipe] = useLocalStorage<boolean>(
    "filterRecipe",
    true
  );

  const updatePriceMemo = useCallback(
    (itemName: string, newPrice: number | undefined, currencyName?: string) =>
      updatePrice(setCurrencyList, itemName, newPrice, currencyName),
    [setCurrencyList]
  );

  const [itemCostPercentages, setItemCostPercentages] = useLocalStorage<
    RecipeCostPercentage[]
  >("costPercentages", []);

  const [
    recipeCraftAmmounts,
    setRecipeCraftAmmounts,
  ] = useLocalStorage<RecipeCraftAmmount>("RecipeCraftAmmount", {});

  const updateItemCostPercentage = useCallback(
    (itemName: string, prodName: string, newPercentage: number) => {
      setItemCostPercentages((prevItemPercentages) => {
        const itemPercentageIndex = prevItemPercentages.findIndex(
          (t) => t.itemName === itemName
        );
        const newItemPercentages = {
          ...prevItemPercentages[itemPercentageIndex],
          percentages: fixPercentages(
            prodName,
            newPercentage,
            prevItemPercentages[itemPercentageIndex].percentages
          ),
        };
        return [
          ...prevItemPercentages.slice(0, itemPercentageIndex),
          newItemPercentages,
          ...prevItemPercentages.slice(itemPercentageIndex + 1),
        ];
      });
    },
    [setItemCostPercentages]
  );

  const getRecipeCraftAmmount = useCallback(
    (recipeName: string) => recipeCraftAmmounts[recipeName] ?? 1,
    [recipeCraftAmmounts]
  );

  const updateRecipeCraftAmmount = useCallback(
    (recipeName: string, newAmmount: number) => {
      setRecipeCraftAmmounts((prev) => ({ ...prev, [recipeName]: newAmmount }));
    },
    [setRecipeCraftAmmounts]
  );

  const prices = useMemo(() => {
    return (
      currencyList.currencies.find(
        (t) => t.name === currencyList.selectedCurrency
      )?.itemPrices ?? []
    );
  }, [currencyList.currencies, currencyList.selectedCurrency]);

  const gamePrices = useMemo(() => {
    return (
      currencyList.currencies.find(
        (t) => t.name === currencyList.selectedCurrency
      )?.gamePrices ?? []
    ).reduce(
      (agg, next) => ({
        ...agg,
        [next.ItemName]: [...(agg[next.ItemName] ?? []), next],
      }),
      {} as { [key: string]: GamePrice[] }
    );
  }, [currencyList.currencies, currencyList.selectedCurrency]);

  const currencySymbol = useMemo(
    () =>
      currencyList.currencies.find(
        (t) => t.name === currencyList.selectedCurrency
      )?.symbol ?? "$",
    [currencyList]
  );

  // Fetches last update and triggers state update if it changed
  getStoresLastUpdate().then((lastUpdateResponse) => {
    console.log("TODO: Figure out a way of only do this once every 2 minutes");
    if (
      lastUpdateResponse?.data?.success &&
      lastUpdateResponse.data.data !== storesDb.ExportedAt
    ) {
      getStores().then((storesResponse) => {
        if (storesResponse.data.success) {
          // Updates stores database
          setStoresDb(storesResponse.data.data);

          // Merge with currencyList
          const gameCurrencies = storesResponse.data.data.Stores.filter(
            (t) => t.CurrencyName.indexOf("Credit") <= 0
          )
            .map((store) => ({
              currency: store.CurrencyName,
              items: store.AllOffers.map((offer) => ({
                ...offer,
                store: store.Name,
                storeOwner: store.Owner,
              })),
            }))
            .reduce(
              (agg, t) => ({
                ...agg,
                [t.currency]: [...(agg[t.currency] ?? []), ...t.items],
              }),
              {} as { [key: string]: Array<unknown> }
            );

          const newCurrencies = [
            // Update gamePrices on existing currencies
            ...currencyList.currencies.map((currency) => ({
              ...currency,
              gamePrices: gameCurrencies[currency.name],
            })),
            // Creates new currencies from gamePrices
            ...Object.keys(gameCurrencies)
              .filter((currencyName) =>
                currencyList.currencies.every(
                  (currency) => currency.name !== currencyName
                )
              )
              .map((currencyName) => ({
                name: currencyName,
                symbol: currencyName.substr(0, 2),
                itemPrices: [],
                gamePrices: gameCurrencies[currencyName],
              })),
          ] as Currency[];

          setCurrencyList((prev) => ({
            ...prev,
            currencies: newCurrencies,
          }));
        }
      });
    }
  });

  return (
    <AppContext.Provider
      value={{
        currencyList,
        setCurrencyList,
        currencySymbol,
        prices,
        updatePrice: updatePriceMemo,
        gamePrices,
        selectedVariants,
        setSelectedVariants,
        filterProfessions,
        setFilterProfessions,
        filterCraftStations,
        setFilterCraftStations,
        filterName,
        setFilterName,
        filterWithRecipe,
        setFilterWithRecipe,
        itemCostPercentages,
        setItemCostPercentages,
        updateItemCostPercentage,
        getRecipeCraftAmmount,
        updateRecipeCraftAmmount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
