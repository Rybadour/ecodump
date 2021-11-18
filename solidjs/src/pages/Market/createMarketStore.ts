import { createMemo, createResource } from "solid-js";
import { createLocalStore } from "../../utils/createLocalStore";
import {
  filterByText,
  filterUnique,
  sortByTextExcludingWord,
} from "../../utils/helpers";
import { getStores } from "../../utils/restDbSdk";

const pageSize = 200;
type Store = {
  search: string;
  currency: string;
  isStoresTable: boolean;
  storesPage: number;
  productsPage: number;
};
export default () => {
  const [storesResource] = createResource(getStores);
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
  const allCurrencies = createMemo(() =>
    storesResource()
      ?.Stores.map((store) => store.CurrencyName)
      .filter(filterUnique)
      .sort(sortByTextExcludingWord("Credit"))
  );
  const allProducts = createMemo(() =>
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
  const filteredProducts = createMemo(() =>
    (allProducts() ?? []).filter(
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
  return {
    state,
    storesResource,
    stores,
    setSearch: (newValue: string) =>
      setState({ search: newValue, storesPage: 1, productsPage: 1 }),
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
