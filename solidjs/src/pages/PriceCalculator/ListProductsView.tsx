import { Accessor, For } from "solid-js";
import { StoreUpdate, Survivalist } from "./createPriceCalculatorStore";
import Table, {
  TableHeader,
  TableHeaderCol,
  TableBody,
} from "../../components/Table";
import SearchInput from "../../components/SearchInput";
import Dropdown from "../../components/Dropdown";
import Tooltip from "../../components/Tooltip";
import Pagination from "../../components/Pagination";
import { filterByTextEqual, formatNumber } from "../../utils/helpers";
import Button from "../../components/Button";
import type { Store } from "./createPriceCalculatorStore";
import { useMainContext } from "../../hooks/MainContext";
import PersonalPrice from "../../components/PersonalPrice/PersonalPrice";
import AveragePrice from "../../components/AveragePrice";

type Props = {
  state: Store;
  paginatedProducts: Accessor<CraftableProduct[] | undefined>;
  totalPages: Accessor<number>;
  stateUpdate: StoreUpdate;
};

export default (props: Props) => {
  const { mainState, update, allCurrencies, allProfessions, allCraftStations } =
    useMainContext();

  return (
    <>
      <div class="flex justify-between">
        <span></span>
        <div class="flex items-center gap-2 mb-2">
          <SearchInput
            value={props.state.search}
            onChange={props.stateUpdate.setSearch}
          />
          <Dropdown
            value={props.state.filterProfession}
            values={[
              { value: "", text: "Filter by Profession" },
              ...(allProfessions()?.map((name) => ({
                value: name,
                text: name,
              })) ?? []),
            ]}
            onChange={(newValue) =>
              props.stateUpdate.setFilterProfession(`${newValue}`)
            }
            origin="SE"
            direction="SW"
          />
          <Dropdown
            value={props.state.filterCraftStation}
            values={[
              { value: "", text: "Filter by crafting station" },
              ...(allCraftStations()?.map((name) => ({
                value: name,
                text: name,
              })) ?? []),
            ]}
            onChange={(newValue) =>
              props.stateUpdate.setFilterCraftStation(`${newValue}`)
            }
            origin="SE"
            direction="SW"
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
            onChange={(newValue) => update.currency(`${newValue}`)}
            origin="SE"
            direction="SW"
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableHeaderCol>Product Name</TableHeaderCol>
          <TableHeaderCol>Profession/Craft Station</TableHeaderCol>
          <TableHeaderCol>Average price</TableHeaderCol>
          <TableHeaderCol>Personal price</TableHeaderCol>
        </TableHeader>
        <TableBody>
          <For each={props.paginatedProducts()}>
            {(product) => (
              <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Tooltip text="Click to filter by recipe name">
                    <button
                      onClick={() => props.stateUpdate.setSearch(product.Name)}
                    >
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
                        filterByTextEqual(
                          props.state.filterProfession,
                          t.Skill
                        ) &&
                        filterByTextEqual(
                          props.state.filterCraftStation,
                          t.craftStation
                        )
                    )
                    .map((recipe) => (
                      <div>
                        <>
                          <Tooltip text="Click to filter by profession">
                            <button
                              onClick={() =>
                                props.stateUpdate.setFilterProfession(
                                  recipe.Skill
                                )
                              }
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
                              props.stateUpdate.setFilterCraftStation(
                                recipe.craftStation
                              )
                            }
                          >
                            {recipe.craftStation}
                          </button>
                        </Tooltip>
                      </div>
                    ))}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <AveragePrice
                    product={product}
                    showPricesForProductModal={
                      props.stateUpdate.showPricesForProductModal
                    }
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {!mainState.currency && "select currency"}
                  {mainState.currency && (
                    <div class="flex">
                      <PersonalPrice productName={product.Name} />
                      <Button
                        class="ml-2"
                        onClick={() =>
                          props.stateUpdate.calculatePriceForProduct(
                            product.Name
                          )
                        }
                      >
                        Calculate now
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </For>
        </TableBody>
      </Table>
      <Pagination
        currentPage={props.state.currentPage}
        totalPages={props.totalPages()}
        onChange={props.stateUpdate.setCurrentPage}
      />
    </>
  );
};
