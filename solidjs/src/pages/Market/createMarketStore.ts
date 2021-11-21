import { createMemo, createResource } from "solid-js";
import createDebounce from "../../hooks/createDebounce";
import { useMainContext } from "../../hooks/MainContext";
import { createLocalStore } from "../../utils/createLocalStore";
import {
  filterByText,
  filterUnique,
  sortByTextExcludingWord,
} from "../../utils/helpers";

const pageSize = 100;
type Store = {
  search: string;
  currency: string;
  isStoresTable: boolean;
  storesPage: number;
  productsPage: number;
};
export default () => {
  const { storesResource, allCurrencies, allProductsInStores } =
    useMainContext();
  const [state, setState] = createLocalStore<Store>(
    {
      search: "",
      currency: "",
      isStoresTable: true,
      storesPage: 1,
      productsPage: 1,
    },
    "MarketStore"
  );
  const stores = createMemo(
    () =>
      storesResource()
        ?.Stores.filter(
          (store) =>
            (filterByText(state.search, store.Name ?? "") ||
              filterByText(state.search, store.Owner ?? "")) &&
            filterByText(state.currency, store.CurrencyName ?? "")
        )
        .sort((a, b) =>
          a.Name.toLowerCase().localeCompare(b.Name.toLowerCase())
        )
        .slice(
          (state.storesPage - 1) * pageSize,
          state.storesPage * pageSize
        ) as Stores[]
  );
  const storesTotalPages = createMemo(() =>
    Math.ceil((storesResource()?.Stores?.length ?? 0) / pageSize)
  );

  const filteredProducts = createMemo(() =>
    (allProductsInStores() ?? []).filter(
      (product) =>
        (filterByText(state.search, product.ItemName ?? "") ||
          filterByText(state.search, product.StoreName ?? "") ||
          filterByText(state.search, product.StoreOwner ?? "")) &&
        filterByText(state.currency, product.CurrencyName ?? "")
    )
  );
  const productsTotalPages = createMemo(() =>
    Math.ceil((filteredProducts()?.length ?? 0) / pageSize)
  );
  const products = createMemo(() =>
    filteredProducts().slice(
      (state.productsPage - 1) * pageSize,
      state.productsPage * pageSize
    )
  );
  const [setSearch] = createDebounce(
    (newValue: string) =>
      setState({ search: newValue, storesPage: 1, productsPage: 1 }),
    200
  );
  return {
    state,
    storesResource,
    stores,
    setSearch,
    setCurrencyFilter: (newValue: string) =>
      setState({ currency: newValue, storesPage: 1, productsPage: 1 }),
    toggleTableType: () =>
      setState((prev) => ({ isStoresTable: !prev.isStoresTable })),
    setStoresPage: (pageNum: number) => setState({ storesPage: pageNum }),
    setProductsPage: (pageNum: number) => setState({ productsPage: pageNum }),
    allCurrencies,
    products,
    storesTotalPages,
    productsTotalPages,
  };
};
