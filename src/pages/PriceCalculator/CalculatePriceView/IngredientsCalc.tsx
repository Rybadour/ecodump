import { For } from "solid-js";
import Accordion from "../../../components/Accordion/Accordion";
import AveragePrice from "../../../components/AveragePrice";
import LabeledField from "../../../components/LabeledField";
import PersonalPrice from "../../../components/PersonalPrice";
import RadioToggle from "../../../components/RadioToggle";
import Table, {
  TableBody,
  TableHeader,
  TableHeaderCol,
} from "../../../components/Table";
import Tooltip from "../../../components/Tooltip";
import { useMainContext } from "../../../hooks/MainContext";
import { formatNumber, getIngredientId } from "../../../utils/helpers";
import { useCalcContext } from "../context/CalcContext";
import RecipePicker from "./RecipePicker";

export default () => {
  const { get, update, tagsResource } = useMainContext();
  const { priceCalcStore, listProductsStore } = useCalcContext();

  return (
    <>
      <Accordion
        startsOpen
        class="mt-4"
        headerText={
          <span>
            <span class="font-medium">Ingredients</span>: Calculating costs for
            recipe
            <RecipePicker
              selectedValue={
                priceCalcStore.focusedNode()?.selectedVariant?.Variant.Key ?? ""
              }
              recipeVariants={
                priceCalcStore.focusedNode()?.recipeVariants ?? []
              }
              setSelected={(selected: string) =>
                priceCalcStore.setSelectedRecipes((prev) => ({
                  ...prev,
                  [priceCalcStore.focusedNode()?.ingredientId ?? ""]: selected,
                }))
              }
            />
            {!!priceCalcStore.focusedNode()?.selectedVariant?.Variant.Key && (
              <>
                at table
                <span class="border rounded px-2 py-1 mx-2 font-normal">
                  {priceCalcStore.selectedVariant()?.Recipe.CraftStation[0]}
                </span>
              </>
            )}
          </span>
        }
      >
        <div class="flex gap-5 flex-wrap">
          <LabeledField vertical text="Craft ammount:">
            <RadioToggle
              options={[
                { text: "1", value: 1 },
                { text: "10", value: 10 },
                { text: "100", value: 100 },
              ]}
              onChange={(selected: string | number) =>
                update.craftAmmount(
                  priceCalcStore.state.focusedProd?.name ?? "",
                  Number(selected)
                )
              }
              selected={get.craftAmmount(
                priceCalcStore.state.focusedProd?.name
              )}
            />
          </LabeledField>
          <LabeledField vertical text="Upgrade module in use:">
            <RadioToggle
              options={Array.from(new Array(6)).map((_, i) => ({
                text: `M${i}`,
                value: i,
              }))}
              onChange={(selected: string | number) =>
                update.craftModule(
                  priceCalcStore.state.focusedProd?.name ?? "",
                  Number(selected)
                )
              }
              selected={get.craftModule(priceCalcStore.state.focusedProd?.name)}
            />
          </LabeledField>
        </div>
        <div class="mt-8">
          <Table>
            <TableHeader>
              <TableHeaderCol>Ingredient name</TableHeaderCol>
              <TableHeaderCol>Quantity</TableHeaderCol>
              <TableHeaderCol>Average price</TableHeaderCol>
              <TableHeaderCol>Personal price</TableHeaderCol>
              <TableHeaderCol>Unit price</TableHeaderCol>
              <TableHeaderCol>Total price</TableHeaderCol>
            </TableHeader>
            <TableBody>
              <For each={priceCalcStore.recipeIngredients()}>
                {(ingredient) => (
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ingredient.IsSpecificItem ? (
                        ingredient.Name
                      ) : (
                        <Tooltip
                          text={`One of: ${tagsResource()?.[
                            ingredient.Tag
                          ]?.join(", ")}`}
                          origin="NW"
                          direction="NE"
                        >
                          <div class="inline-block px-2 py-1">{`Tag ${ingredient.Tag}`}</div>
                        </Tooltip>
                      )}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ingredient.calcQuantity}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <AveragePrice
                        name={
                          ingredient.IsSpecificItem
                            ? ingredient.Name
                            : ingredient.Tag
                        }
                        isSpecificItem={ingredient.IsSpecificItem}
                        showPricesForProductsModal={
                          listProductsStore.update.showPricesForProductsModal
                        }
                      />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <PersonalPrice
                        personalPriceId={getIngredientId(ingredient)}
                      />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatNumber(ingredient.unitPrice)}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatNumber(ingredient.calcPrice)}
                    </td>
                  </tr>
                )}
              </For>
            </TableBody>
          </Table>
        </div>

        <div class="flex items-center mt-8">
          Recipe production cost is
          <span class="border rounded px-2 font-normal mx-1">
            {priceCalcStore.totalIngredientCost()}
          </span>
          .
          {priceCalcStore.craftAmmount() > 1 &&
            (priceCalcStore.totalIngredientCost() ?? 0) > 0 && (
              <>
                {" "}
                Cost for each repetition is
                <span class="border rounded px-2 font-normal mx-1">
                  {formatNumber(
                    (priceCalcStore.totalIngredientCost() ?? 0) /
                      priceCalcStore.craftAmmount()
                  )}
                </span>
                .
              </>
            )}
        </div>
      </Accordion>
    </>
  );
};