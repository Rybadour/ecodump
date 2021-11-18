import SearchInput from "../../components/SearchInput";
import Dropdown from "../../components/Dropdown";
import createMarketStore from "./createMarketStore";
import StoresTable from "./StoresTable";

export default () => {
  const { state, stores, setSearch, setCurrencyFilter, allCurrencies } =
    createMarketStore();
  return (
    <div>
      <div class="flex justify-between">
        <span>
          Last exported on {stores()?.ExportedAt?.StringRepresentation} GMT
        </span>
        <div class="flex flex-row-reverse items-center gap-2 mb-2">
          <Dropdown
            value={state.currency}
            values={[
              { value: "", text: "All Currencies" },
              ...(allCurrencies()?.map((name) => ({
                value: name,
                text: name,
              })) ?? []),
            ]}
            onChange={(newValue) => setCurrencyFilter(`${newValue}`)}
          />
          <SearchInput value={state.search} onChange={setSearch} />
        </div>
      </div>
      <StoresTable stores={stores} />
    </div>
  );
};
