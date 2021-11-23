import SearchInput from "../../components/SearchInput";
import Dropdown from "../../components/Dropdown";
import createMarketStore from "./createMarketStore";
import StoresTable from "./StoresTable";
import RadioToggle from "../../components/RadioToggle";
import { Show } from "solid-js";
import ProductsTable from "./ProductsTable";
import Pagination from "../../components/Pagination";

export default () => {
  const {
    mainState,
    state,
    storesResource,
    stores,
    setSearch,
    setCurrencyFilter,
    toggleTableType,
    allCurrencies,
    products,
    storesTotalPages,
    productsTotalPages,
    setStoresPage,
    setProductsPage,
  } = createMarketStore();

  return (
    <div>
      <div class="flex justify-between">
        <span>
          Last exported on {storesResource()?.ExportedAt?.StringRepresentation}{" "}
          GMT
        </span>
        <div class="flex items-center gap-2 mb-2">
          <SearchInput value={state.search} onChange={setSearch} />
          <Dropdown
            value={mainState.currency}
            values={[
              { value: "", text: "All Currencies" },
              ...(allCurrencies()?.map((name) => ({
                value: name,
                text: name,
              })) ?? []),
            ]}
            onChange={(newValue) => setCurrencyFilter(`${newValue}`)}
          />
          <RadioToggle
            options={[
              { text: "Stores", value: "Stores" },
              { text: "Products", value: "Products" },
            ]}
            onChange={() => toggleTableType()}
            selected={state.isStoresTable ? "Stores" : "Products"}
          />
        </div>
      </div>
      <Show when={state.isStoresTable}>
        <StoresTable
          stores={stores}
          setSearch={setSearch}
          setCurrencyFilter={setCurrencyFilter}
        />
        <Pagination
          currentPage={state.storesPage}
          totalPages={storesTotalPages()}
          onChange={setStoresPage}
        />
      </Show>
      <Show when={!state.isStoresTable}>
        <ProductsTable
          products={products}
          setSearch={setSearch}
          setCurrencyFilter={setCurrencyFilter}
        />
        <Pagination
          currentPage={state.productsPage}
          totalPages={productsTotalPages()}
          onChange={setProductsPage}
        />
      </Show>
    </div>
  );
};
