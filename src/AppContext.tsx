import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
} from "react";
import useGetCurrencies from "./context/useGetCurrencies";
import useGetFilters from "./context/useGetFilters";
import useGetStores from "./context/useGetStores";
import useLocalStorage from "./context/useLocalStorage";
import {
  CurrencyList,
  GamePrice,
  ItemPrice,
  RecipeCostPercentage,
  RecipeCostProdPercentage,
  RecipeCraftAmmount,
  SelectedVariants,
} from "./types";
const emptyStoresDb = {
  Version: 1,
  Stores: [],
  ExportedAtYear: 0,
  ExportedAtMonth: 0,
  ExportedAtDay: 0,
  ExportedAtHour: 0,
  ExportedAtMin: 0,
  ExportedAt: "",
};
const AppContext = React.createContext<{
  currencyList: CurrencyList;
  setSelectedCurrency: (currencyName: string) => void;
  addNewCurrency: (
    currencyName: string,
    symbol: string,
    currencyToCopy: string
  ) => void;
  deleteCurrency: (currencyName: string) => void;
  resetCurrency: (currencyName: string) => void;
  currencySymbol: string;
  personalPrices: ItemPrice[];
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
  storesDb: StoresHistV1;
}>({
  currencyList: { selectedCurrency: "", currencies: [] },
  setSelectedCurrency: () => undefined,
  addNewCurrency: () => undefined,
  deleteCurrency: () => undefined,
  resetCurrency: () => undefined,
  currencySymbol: "",
  personalPrices: [],
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
  storesDb: emptyStoresDb,
});

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
  const { storesDbResponse } = useGetStores();
  const {
    currencyList,
    setSelectedCurrency,
    addNewCurrency,
    deleteCurrency,
    resetCurrency,
    updatePrice,
    currencySymbol,
    personalPrices,
    gamePrices,
  } = useGetCurrencies();
  const filters = useGetFilters();

  const [
    selectedVariants,
    setSelectedVariants,
  ] = useLocalStorage<SelectedVariants>("selectedVariant", {});

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

  console.log("rerender");

  return (
    <AppContext.Provider
      value={{
        storesDb: storesDbResponse?.data?.data?.data ?? emptyStoresDb,
        ...filters,

        currencyList,
        setSelectedCurrency,
        addNewCurrency,
        deleteCurrency,
        resetCurrency,
        updatePrice,
        currencySymbol,
        personalPrices,
        gamePrices,

        selectedVariants,
        setSelectedVariants,
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
