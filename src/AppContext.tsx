import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
} from "react";
import useLocalStorage from "./context/useLocalStorage";
import {
  ItemPrice,
  RecipeCostPercentage,
  RecipeCostProdPercentage,
  RecipeCraftAmmount,
  SelectedVariants,
} from "./types";
const AppContext = React.createContext<{
  prices: ItemPrice[];
  updatePrice: (itemName: string, newPrice: number) => void;
  selectedVariants: SelectedVariants;
  setSelectedVariants: Dispatch<SetStateAction<SelectedVariants>>;
  filterProfessions: string[];
  setFilterProfessions: Dispatch<SetStateAction<string[]>>;
  filterCraftStations: string[];
  setFilterCraftStations: Dispatch<SetStateAction<string[]>>;
  filterName: string;
  setFilterName: Dispatch<SetStateAction<string>>;
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
  prices: [],
  updatePrice: () => undefined,
  selectedVariants: {},
  setSelectedVariants: () => undefined,
  filterProfessions: [],
  setFilterProfessions: () => undefined,
  filterCraftStations: [],
  setFilterCraftStations: () => undefined,
  filterName: "",
  setFilterName: () => undefined,
  itemCostPercentages: [],
  setItemCostPercentages: () => undefined,
  updateItemCostPercentage: () => undefined,
  getRecipeCraftAmmount: () => 0,
  updateRecipeCraftAmmount: () => undefined,
});

const updatePrice = (
  setPrices: Dispatch<SetStateAction<ItemPrice[]>>,
  itemName: string,
  newPrice: number
) => {
  if (Number.isNaN(newPrice)) return;
  setPrices((prevPrices) => {
    const index = prevPrices.findIndex((t) => t.itemName === itemName);
    return index >= 0
      ? [
          ...prevPrices.slice(0, index),
          { ...prevPrices[index], price: newPrice },
          ...prevPrices.slice(index + 1),
        ]
      : [
          ...prevPrices,
          {
            itemName: itemName,
            price: newPrice,
          },
        ];
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
  const [prices, setPrices] = useLocalStorage<ItemPrice[]>("prices", []);
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

  const updatePriceMemo = useCallback(
    (itemName: string, newPrice: number) =>
      updatePrice(setPrices, itemName, newPrice),
    [setPrices]
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

  return (
    <AppContext.Provider
      value={{
        prices,
        updatePrice: updatePriceMemo,
        selectedVariants,
        setSelectedVariants,
        filterProfessions,
        setFilterProfessions,
        filterCraftStations,
        setFilterCraftStations,
        filterName,
        setFilterName,
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
