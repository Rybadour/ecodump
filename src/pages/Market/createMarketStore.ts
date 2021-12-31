import { createEffect, createMemo } from "solid-js";
import createDebounce from "../../hooks/createDebounce";
import { useMainContext } from "../../hooks/MainContext";
import { createLocalStore } from "../../utils/createLocalStore";
import { filterByText } from "../../utils/helpers";

const pageSize = 100;
type Store = {
  search: string;
  isStoresTable: boolean;
  storesPage: number;
  productsPage: number;
  filterByOwner: boolean;
};
export default () => {
  const {
    storesResource,
    allProductsInStores,
    mainState,
    update,
  } = useMainContext();
  const [state, setState] = createLocalStore<Store>(
    {
      search: "",
      isStoresTable: true,
      storesPage: 1,
      productsPage: 1,
      filterByOwner: false,
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
            filterByText(mainState.currency, store.CurrencyName ?? "") &&
            (!state.filterByOwner ||
              mainState.userName.length === 0 ||
              filterByText(mainState.userName, store.Owner ?? ""))
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
        filterByText(mainState.currency, product.CurrencyName ?? "") &&
        (!state.filterByOwner ||
          mainState.userName.length === 0 ||
          filterByText(mainState.userName, product.StoreOwner ?? ""))
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
  createEffect(() => {
    // We want to updated state when currency changes
    // TODO: is there a better way to do this?
    mainState.currency;
    setState({ storesPage: 1, productsPage: 1 });
  });
  return {
    state,
    stores,
    setSearch,
    setCurrencyFilter: (newValue: string) => update.currency(newValue),
    toggleTableType: () =>
      setState((prev) => ({ isStoresTable: !prev.isStoresTable })),
    setStoresPage: (pageNum: number) => setState({ storesPage: pageNum }),
    setProductsPage: (pageNum: number) => setState({ productsPage: pageNum }),
    setFilterByOwner: (filterByOwner: boolean) =>
      setState({ filterByOwner: filterByOwner }),
    products,
    storesTotalPages,
    productsTotalPages,
    clearFilters: () => setState({
      search: "",
      storesPage: 1,
      productsPage: 1,
      filterByOwner:false
    })
  };
};
