import { For } from "solid-js";
import createPriceCalculatorStore, {
  Survivalist,
} from "./createPriceCalculatorStore";
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
import { filterByTextEqual, formatNumber } from "../../utils/helpers";
import NumericInput from "../../components/NumericInput";

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
    updatePersonalPrice,
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
          <TableHeaderCol text="Personal price" />
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
                  {product.RecipeVariants.map((recipeVariant) =>
                    recipeVariant.Recipe.CraftStation.map((craftStation) =>
                      (recipeVariant.Recipe.SkillNeeds.length > 0
                        ? recipeVariant.Recipe.SkillNeeds
                        : [{ Skill: Survivalist, Level: 0 }]
                      ).map((skillNeed) => ({
                        Skill: skillNeed.Skill,
                        SkillLevel: skillNeed.Level,
                        craftStation,
                      }))
                    ).flat()
                  )
                    .flat()
                    // Remove duplicates:
                    .filter(
                      (value, index, self) =>
                        self.findIndex(
                          (t) =>
                            t.Skill === value.Skill &&
                            t.SkillLevel === value.SkillLevel &&
                            t.craftStation === value.craftStation
                        ) === index
                    )
                    // Filter by profession and crafting station filters
                    .filter(
                      (t) =>
                        filterByTextEqual(state.filterProfession, t.Skill) &&
                        filterByTextEqual(
                          state.filterCraftStation,
                          t.craftStation
                        )
                    )
                    .map((recipe) => (
                      <div>
                        <>
                          <Tooltip text="Click to filter by profession">
                            <button
                              onClick={() => setFilterProfession(recipe.Skill)}
                            >
                              {recipe.Skill}
                            </button>
                          </Tooltip>
                          {` lvl${recipe.SkillLevel}`}
                        </>
                        {recipe.Skill && ` @ `}
                        <Tooltip text="Click to filter by craft station">
                          <button
                            onClick={() =>
                              setFilterCraftStation(recipe.craftStation)
                            }
                          >
                            {recipe.craftStation}
                          </button>
                        </Tooltip>
                      </div>
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
                  {!mainState.currency && "select currency"}
                  {mainState.currency && (
                    <NumericInput
                      value={product.PersonalPrices?.[mainState.currency]}
                      onChange={(newValue) =>
                        updatePersonalPrice(
                          product.Name,
                          mainState.currency,
                          newValue
                        )
                      }
                    />
                  )}
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
