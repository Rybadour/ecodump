import { createMemo, createResource } from "solid-js";
import { createLocalStore } from "../../utils/createLocalStore";
import { filterByText } from "../../utils/helpers";
import { getStores } from "../../utils/restDbSdk";

export default () => {
  const [storesResource] = createResource(getStores);
  const [state, setState] = createLocalStore(
    {
      search: "",
    },
    "MarketStore"
  );
  const stores = createMemo(
    () =>
      ({
        ...storesResource(),
        Stores: storesResource()?.Stores.filter(
          (store) =>
            filterByText(state.search, store.Name ?? "") ||
            filterByText(state.search, store.Owner ?? "")
        ),
      } as StoresResponse)
  );
  return {
    state,
    stores,
    setSearch: (newValue: string) => setState({ search: newValue }),
  };
};
