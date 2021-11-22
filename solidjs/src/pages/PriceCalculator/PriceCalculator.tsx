import { For } from "solid-js";
import createPriceCalculatorStore from "./createPriceCalculatorStore";
import Table, {
  TableHeader,
  TableHeaderCol,
  TableBody,
} from "../../components/Table";
import SearchInput from "../../components/SearchInput";
import Dropdown from "../../components/Dropdown";
import Tooltip from "../../components/Tooltip";
import Pagination from "../../components/Pagination";
import GamePricesModal from "../../components/GamePricesModal";

export default () => {
  const {
    mainState,
    state,
    allProfessions,
    allCraftStations,
    allCurrencies,
    paginatedProducts,
    setSearch,
    setFilterProfession,
    setFilterCraftStation,
    setCurrencyFilter,
    totalPages,
    setCurrentPage,
    showPricesForProduct,
  } = createPriceCalculatorStore();

  return (
    <>
      <div class="flex justify-between">
        <span></span>
        <div class="flex items-center gap-2 mb-2">
          <SearchInput value={state.search} onChange={setSearch} />
          <Dropdown
            value={state.filterProfession}
            values={[
              { value: "", text: "Filter by Profession" },
              ...(allProfessions()?.map((name) => ({
                value: name,
                text: name,
              })) ?? []),
            ]}
            onChange={(newValue) => setFilterProfession(`${newValue}`)}
          />
          <Dropdown
            value={state.filterCraftStation}
            values={[
              { value: "", text: "Filter by crafting station" },
              ...(allCraftStations()?.map((name) => ({
                value: name,
                text: name,
              })) ?? []),
            ]}
            onChange={(newValue) => setFilterCraftStation(`${newValue}`)}
          />
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
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableHeaderCol text="Product Name" />
          <TableHeaderCol text="Profession/Craft Station" />
          <TableHeaderCol text="Average price" />
          <TableHeaderCol text="Fixed price" />
        </TableHeader>
        <TableBody>
          <For each={paginatedProducts()}>
            {(product) => (
              <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Tooltip text="Click to filter by recipe name">
                    <button onClick={() => setSearch(product.Name)}>
                      {product.Name}
                    </button>
                  </Tooltip>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.Recipe.SkillNeeds.map((skill) => (
                    <>
                      <Tooltip text="Click to filter by profession">
                        <button
                          onClick={() => setFilterProfession(skill.Skill)}
                        >
                          {skill.Skill}
                        </button>
                      </Tooltip>
                      {` lvl${skill.Level}`}
                    </>
                  ))}
                  {product.Recipe.SkillNeeds.length > 0 && ` @ `}
                  {product.Recipe.CraftStation.map((station) => (
                    <Tooltip text="Click to filter by craft station">
                      <button onClick={() => setFilterCraftStation(station)}>
                        {station}
                      </button>
                    </Tooltip>
                  ))}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Tooltip text="Click for ingame prices. Select currency for average.">
                    <button onClick={() => showPricesForProduct(product.Name)}>
                      {(product.Offers.length <= 0 ||
                        (mainState.currency && !product.calculatedPrice)) &&
                        "no offers in currency"}
                      {product.Offers.length > 0 &&
                        !mainState.currency &&
                        "select currency"}
                      {mainState.currency &&
                        product.calculatedPrice &&
                        `${product.calculatedPrice} ${mainState.currency}`}
                    </button>
                  </Tooltip>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  TODO
                </td>
              </tr>
            )}
          </For>
        </TableBody>
      </Table>
      <Pagination
        currentPage={state.currentPage}
        totalPages={totalPages()}
        onChange={setCurrentPage}
      />
      {state.showPricesForProduct && (
        <GamePricesModal
          productName={state.showPricesForProduct}
          onClose={() => showPricesForProduct(undefined)}
        />
      )}
    </>
  );
};
