import { createMemo } from "solid-js";
import createDebounce from "../../hooks/createDebounce";
import { useMainContext } from "../../hooks/MainContext";
import { createLocalStore } from "../../utils/createLocalStore";
import {
  filterByIncludesAny,
  filterByText,
  formatNumber,
} from "../../utils/helpers";

const pageSize = 100;
export type Store = {
  search: string;
  filterProfession: string;
  filterCraftStation: string;
  currentPage: number;
  showPricesForProductModal?: string;
  calculatePriceForProduct?: string;
};
export type StoreUpdate = {
  setSearch: (newSearch: string) => void;
  setFilterProfession: (newSearch: string) => void;
  setFilterCraftStation: (newSearch: string) => void;
  setCurrentPage: (newPage: number) => void;
  showPricesForProductModal: (showPricesForProductModal?: string) => void;
  calculatePriceForProduct: (product?: string) => void;
};
export const Survivalist = "Survivalist";

export default () => {
  const { allCraftableProducts } = useMainContext();
  const [state, setState] = createLocalStore<Store>(
    {
      search: "",
      filterProfession: "",
      filterCraftStation: "",
      currentPage: 1,
      showPricesForProductModal: undefined,
      calculatePriceForProduct: undefined,
    },
    "PriceCalculatorStore"
  );

  const filteredProducts = createMemo(() =>
    allCraftableProducts()?.filter(
      (product) =>
        filterByText(state.search, product.Name ?? "") &&
        filterByIncludesAny(
          [state.filterProfession],
          product.RecipeVariants.map((variant) =>
            variant.Recipe.SkillNeeds.map((t) => t.Skill)
          ).flat()
        ) &&
        filterByIncludesAny(
          [state.filterCraftStation],
          product.RecipeVariants.map(
            (variant) => variant.Recipe.CraftStation
          ).flat()
        )
    )
  );

  const paginatedProducts = createMemo(() =>
    filteredProducts()?.slice(
      (state.currentPage - 1) * pageSize,
      state.currentPage * pageSize
    )
  );

  const totalPages = createMemo(() =>
    Math.ceil((filteredProducts()?.length ?? 0) / pageSize)
  );
  const [setSearch] = createDebounce(
    (newSearch: string) => setState({ search: newSearch, currentPage: 1 }),
    200
  );
  return {
    state,
    paginatedProducts,
    totalPages,
    update: {
      setSearch,
      setFilterProfession: (newSearch: string) =>
        setState({
          filterProfession: newSearch === Survivalist ? "" : newSearch,
          currentPage: 1,
        }),
      setFilterCraftStation: (newSearch: string) =>
        setState({ filterCraftStation: newSearch, currentPage: 1 }),
      setCurrentPage: (newPage: number) => setState({ currentPage: newPage }),
      showPricesForProductModal: (showPricesForProductModal?: string) =>
        setState({ showPricesForProductModal }),
      calculatePriceForProduct: (product?: string) =>
        setState({ calculatePriceForProduct: product }),
    } as StoreUpdate,
  };
};
