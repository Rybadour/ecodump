import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
} from "react";
import useLocalStorage from "./context/useLocalStorage";
import { ItemPrice, SelectedVariants } from "./types";
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
