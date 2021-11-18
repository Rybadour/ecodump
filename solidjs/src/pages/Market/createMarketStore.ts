import { createMemo, createResource } from "solid-js";
import { createLocalStore } from "../../utils/createLocalStore";
import {
  filterByText,
  filterUnique,
  sortByTextExcludingWord,
} from "../../utils/helpers";
import { getStores } from "../../utils/restDbSdk";

type Store = {
  search: string;
  currency: string;
};
export default () => {
  const [storesResource] = createResource(getStores);
  const [state, setState] = createLocalStore<Store>(
    {
      search: "",
      currency: "",
    },
    "MarketStore"
  );
  const stores = createMemo(
    () =>
      ({
        ...storesResource(),
        Stores: storesResource()?.Stores.filter(
          (store) =>
            (filterByText(state.search, store.Name ?? "") ||
              filterByText(state.search, store.Owner ?? "")) &&
            filterByText(state.currency, store.CurrencyName ?? "")
        ),
      } as StoresResponse)
  );
  const allCurrencies = createMemo(() =>
    storesResource()
      ?.Stores.map((store) => store.CurrencyName)
      .filter(filterUnique)
      .sort(sortByTextExcludingWord("Credit"))
  );
  return {
    state,
    stores,
    setSearch: (newValue: string) => setState({ search: newValue }),
    setCurrencyFilter: (newValue: string) => setState({ currency: newValue }),
    allCurrencies,
  };
};
