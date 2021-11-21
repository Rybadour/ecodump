import { createMemo, createResource } from "solid-js";
import createDebounce from "../../hooks/createDebounce";
import { useMainContext } from "../../hooks/MainContext";
import { createLocalStore } from "../../utils/createLocalStore";
import {
  filterByText,
  filterByTextEqual,
  filterUnique,
} from "../../utils/helpers";
import { getRecipes } from "../../utils/restDbSdk";

const pageSize = 100;
type Store = {
  search: string;
  filterProfession: string;
  filterCraftStation: string;
  currentPage: number;
};
export default () => {
  const { recipesResource, allCraftableProducts } = useMainContext();
  const [state, setState] = createLocalStore<Store>(
    {
      search: "",
      filterProfession: "",
      filterCraftStation: "",
      currentPage: 1,
    },
    "PriceCalculatorStore"
  );

  const filteredProducts = createMemo(() =>
    allCraftableProducts()?.filter(
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
    state,
    allProfessions,
    allCraftStations,
    paginatedProducts,
    setSearch,
    setFilterProfession: (newSearch: string) =>
      setState({ filterProfession: newSearch, currentPage: 1 }),
    setFilterCraftStation: (newSearch: string) =>
      setState({ filterCraftStation: newSearch, currentPage: 1 }),
    setCurrentPage: (newPage: number) => setState({ currentPage: newPage }),
    totalPages,
  };
};
