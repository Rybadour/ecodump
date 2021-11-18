import { createEffect } from "solid-js";
import SearchInput from "../../components/SearchInput";
import { createLocalStore } from "../../utils/createLocalStore";
import createMarketStore from "./createMarketStore";
import LastUpdatedToolbar from "./LastUpdatedToolbar";
import StoresTable from "./StoresTable";

export default () => {
  const { state, stores, setSearch } = createMarketStore();
  return (
    <div>
      <LastUpdatedToolbar exportedAt={stores()?.ExportedAt} />
      <SearchInput value={state.search} onChange={setSearch} />
      <StoresTable stores={stores} />
    </div>
  );
};
