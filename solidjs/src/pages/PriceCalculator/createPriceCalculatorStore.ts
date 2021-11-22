import { createMemo } from "solid-js";
import createDebounce from "../../hooks/createDebounce";
import { useMainContext } from "../../hooks/MainContext";
import { createLocalStore } from "../../utils/createLocalStore";
import {
  filterByText,
  filterByTextEqual,
  filterUnique,
  formatNumber,
} from "../../utils/helpers";

const pageSize = 100;
type Store = {
  search: string;
  filterProfession: string;
  filterCraftStation: string;
  currentPage: number;
  showPricesForProduct?: string;
};

const calcAvgPrice = (items: { price: number; quantity: number }[]) => {
  const avgCalc = items.reduce(
    (agg, next) => ({
      sum: agg.sum + next.price * next.quantity,
      count: agg.count + next.quantity,
    }),
    { sum: 0, count: 0 } as { sum: number; count: number }
  );
  return avgCalc.count > 0 ? formatNumber(avgCalc.sum / avgCalc.count) : null;
};

export default () => {
  const {
    recipesResource,
    allCraftableProducts,
    allCurrencies,
    mainState,
    update,
  } = useMainContext();
  const [state, setState] = createLocalStore<Store>(
    {
      search: "",
      filterProfession: "",
      filterCraftStation: "",
      currentPage: 1,
      showPricesForProduct: undefined,
    },
    "PriceCalculatorStore"
  );

  const filteredProducts = createMemo(() =>
    allCraftableProducts()
      ?.filter(
        (product) =>
          filterByText(state.search, product.Name ?? "") &&
          filterByTextEqual(
            state.filterProfession,
            product.Recipe.SkillNeeds[0]?.Skill ?? ""
          ) &&
          filterByTextEqual(
            state.filterCraftStation,
            product.Recipe.CraftStation[0] ?? ""
          )
      )
      .map((product) => ({
        ...product,
        calculatedPrice: !mainState.currency
          ? null
          : calcAvgPrice(
              product.Offers.filter(
                (t) =>
                  t.CurrencyName === mainState.currency &&
                  !t.Buying &&
                  t.Quantity > 0
              ).map((offer) => ({
                price: offer.Price,
                quantity: offer.Quantity,
              }))
            ),
      }))
  );

  const paginatedProducts = createMemo(() =>
    filteredProducts()?.slice(
      (state.currentPage - 1) * pageSize,
      state.currentPage * pageSize
    )
  );

  const allProfessions = createMemo(() =>
    recipesResource()
      ?.map((recipe) => recipe.SkillNeeds.map((t) => t.Skill))
      .flat()
      .filter(filterUnique)
  );

  const allCraftStations = createMemo(() =>
    recipesResource()
      ?.map((recipe) => recipe.CraftStation)
      .flat()
      .filter(filterUnique)
  );

  const totalPages = createMemo(() =>
    Math.ceil((filteredProducts()?.length ?? 0) / pageSize)
  );
  const [setSearch] = createDebounce(
    (newSearch: string) => setState({ search: newSearch, currentPage: 1 }),
    200
  );
  return {
    mainState,
    state,
    allProfessions,
    allCraftStations,
    allCurrencies,
    paginatedProducts,
    setSearch,
    setFilterProfession: (newSearch: string) =>
      setState({ filterProfession: newSearch, currentPage: 1 }),
    setFilterCraftStation: (newSearch: string) =>
      setState({ filterCraftStation: newSearch, currentPage: 1 }),
    setCurrentPage: (newPage: number) => setState({ currentPage: newPage }),
    setCurrencyFilter: (newValue: string) => update.currency(newValue),
    totalPages,
    showPricesForProduct: (showPricesForProduct?: string) =>
      setState({ showPricesForProduct }),
    updatePersonalPrice: update.personalPrice,
  };
};
