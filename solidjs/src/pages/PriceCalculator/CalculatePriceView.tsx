import { createStore } from "solid-js/store";
import Dropdown from "../../components/Dropdown";
import LabeledField from "../../components/LabeledField";
import Button from "../../components/Button";
import { useMainContext } from "../../hooks/MainContext";
import RadioToggle from "../../components/RadioToggle";
import PersonalPrice from "../../components/PersonalPrice";
import { createEffect, createMemo, createSignal, For } from "solid-js";
import Table, {
  TableBody,
  TableHeader,
  TableHeaderCol,
} from "../../components/Table";
import AveragePrice from "../../components/AveragePrice";
import {
  calcAmmount,
  calcPrice,
  convertToMarginMultiplier,
  fixPercentages,
  formatNumber,
  getRecipeEvenPercentages,
  sortByTextFn,
} from "../../utils/helpers";
import NumericInput from "../../components/NumericInput";
import Tooltip from "../../components/Tooltip";
import TagDropdown from "../../components/TagDropdown/TagDropdown";

type Props = {
  calculatePriceForProduct: string;
  onClose: () => void;
  showPricesForProductModal: (productName: string) => void;
};

type Store = {
  recipeKey?: string;
  craftAmmount: number;
  upgradeModule: number;
  recipeMargin: number;
};

const recipeMargins = [0, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100].map((t) => ({
  value: t,
  text: `${t} %`,
}));

const multipliers = [1, 0.9, 0.75, 0.6, 0.55, 0.5];

export default (props: Props) => {
  const { allCraftableProducts, mainState, personalPricesState, update } =
    useMainContext();
  const [costPercentages, setCostPercentages] = createSignal<
    {
      productName: string;
      percentage: number;
    }[]
  >([]);
  const [tagSelection, setTagSelection] = createSignal<{
    [tagName: string]: string;
  }>({});

  const product = createMemo(() =>
    allCraftableProducts()?.find(
      (t) => t.Name === props.calculatePriceForProduct
    )
  );
  const [state, setState] = createStore<Store>({
    recipeKey: product()?.RecipeVariants?.[0].Recipe.Key,
    craftAmmount: 1,
    upgradeModule: 0,
    recipeMargin: 0,
  });
  const selectedRecipe = createMemo(() =>
    product()?.RecipeVariants?.find((t) => t.Recipe.Key === state.recipeKey)
  );
  createEffect(() => {
    const variant = selectedRecipe()?.Variant;
    if (variant !== undefined)
      setCostPercentages(getRecipeEvenPercentages(variant));
  });
  const recipeIngredients = createMemo(() => {
    if (!selectedRecipe()) return [];
    return selectedRecipe()?.Variant.Ingredients.map((ingredient) => {
      const quantity = formatNumber(
        ingredient.Ammount *
          (ingredient.IsStatic ? 1 : multipliers[state.upgradeModule])
      );
      const quantityBasedOnCraftAmmount = calcAmmount(
        quantity,
        state.craftAmmount
      );
      return {
        ...ingredient,
        calcQuantity: quantityBasedOnCraftAmmount,
        unitPrice: calcPrice(
          quantityBasedOnCraftAmmount / state.craftAmmount,
          personalPricesState?.[ingredient.Name]?.[mainState.currency]
        ),
        calcPrice: calcPrice(
          quantityBasedOnCraftAmmount,
          personalPricesState?.[ingredient.Name]?.[mainState.currency]
        ),
      };
    });
  });
  const totalIngredientCost = createMemo(
    () =>
      recipeIngredients()?.reduce((prev, next) => prev + next.calcPrice, 0) ?? 0
  );
  const unitCostWithProfit = createMemo(
    () =>
      (totalIngredientCost() / state.craftAmmount) *
      convertToMarginMultiplier(state.recipeMargin)
  );
  const recipeProducts = createMemo(() => {
    if (!selectedRecipe()) return [];
    return selectedRecipe()?.Variant.Products.map((product) => {
      const costPercentage =
        costPercentages().find((t) => t.productName === product.Name)
          ?.percentage ?? 0;
      return {
        ...product,
        costPercentage,
        productionCost: formatNumber(
          ((totalIngredientCost() / state.craftAmmount) *
            (costPercentage / 100)) /
            product.Ammount
        ),
        retailPrice: formatNumber(
          (unitCostWithProfit() * (costPercentage / 100)) / product.Ammount
        ),
      };
    });
  });

  return (
    <>
      <Button onClick={props.onClose}>Back</Button>
      <h2 class="font-medium text-gray-900">
        Calculating price for
        <span class="border rounded px-2 py-1 mx-2 font-normal">
          {props.calculatePriceForProduct}
        </span>
        with recipe
        {(product()?.RecipeVariants?.length ?? 1) === 1 && (
          <span class="border rounded px-2 py-1 mx-2 font-normal">
            {product()?.RecipeVariants?.[0].Recipe.Untranslated}
          </span>
        )}
        {(product()?.RecipeVariants?.length ?? 1) > 1 && (
          <div class="inline-block mx-2">
            <Dropdown
              value={state.recipeKey ?? ""}
              values={[
                { value: "", text: "Select a recipe" },
                ...(
                  product()?.RecipeVariants?.map((t) => ({
                    text: t.Recipe.Untranslated,
                    value: t.Recipe.Key,
                  })) ?? []
                ).sort(sortByTextFn((t) => t.text)),
              ]}
              onChange={(newValue) => setState({ recipeKey: `${newValue}` })}
            />
          </div>
        )}
        {!!state.recipeKey && (
          <>
            at table
            <span class="border rounded px-2 py-1 mx-2 font-normal">
              {selectedRecipe()?.Recipe.CraftStation[0]}
            </span>
          </>
        )}
      </h2>

      {!!selectedRecipe() && (
        <div>
          <div class="ingredients border rounded mt-4 pb-5">
            <div class="px-8 py-5 border-b bg-gray-50">
              <span class="font-medium">Ingredients</span>: Calculate the costs
              of your recipe ingredients
            </div>
            <div class="mt-5 px-8 flex gap-5 flex-wrap">
              <LabeledField vertical text="Craft ammount:">
                <RadioToggle
                  options={[
                    { text: "1", value: 1 },
                    { text: "10", value: 10 },
                    { text: "100", value: 100 },
                  ]}
                  onChange={(selected: string | number) =>
                    setState({ craftAmmount: Number(selected) })
                  }
                  selected={state.craftAmmount}
                />
              </LabeledField>
              <LabeledField vertical text="Upgrade module in use:">
                <RadioToggle
                  options={Array.from(new Array(6)).map((_, i) => ({
                    text: `M${i}`,
                    value: i,
                  }))}
                  onChange={(selected: string | number) =>
                    setState({ upgradeModule: Number(selected) })
                  }
                  selected={state.upgradeModule}
                />
              </LabeledField>
            </div>
            <div class="px-8 mt-8">
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
                  <For each={recipeIngredients()}>
                    {(ingredient) => (
                      <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ingredient.IsSpecificItem ? (
                            ingredient.Name
                          ) : (
                            <TagDropdown
                              tagName={ingredient.Tag}
                              selectedProduct={tagSelection()[ingredient.Tag]}
                              onSelectProduct={(prod) =>
                                setTagSelection((prev) => ({
                                  ...prev,
                                  [ingredient.Tag]: prod,
                                }))
                              }
                            />
                          )}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ingredient.calcQuantity}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <AveragePrice
                            product={allCraftableProducts()?.find(
                              (t) =>
                                t.Name ===
                                (ingredient.IsSpecificItem
                                  ? ingredient.Name
                                  : tagSelection()[ingredient.Tag])
                            )}
                            showPricesForProductModal={
                              props.showPricesForProductModal
                            }
                          />
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <PersonalPrice productName={ingredient.Name} />
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
            <div class="flex items-center px-8 mt-2">
              Recipe production cost is
              <span class="border rounded px-2 font-normal mx-1">
                {totalIngredientCost()}
              </span>
              .
              {state.craftAmmount > 1 && (totalIngredientCost() ?? 0) > 0 && (
                <>
                  {" "}
                  Cost for each repetition is
                  <span class="border rounded px-2 font-normal mx-1">
                    {(totalIngredientCost() ?? 0) / state.craftAmmount}
                  </span>
                  .
                </>
              )}
            </div>
          </div>
          <div class="products border rounded mt-6 pb-5">
            <div class="px-8 py-5 border-b bg-gray-50">
              <span class="font-medium">Products</span>: Distribute recipe costs
              between resulting products
            </div>
            <div class="px-8 mt-5 flex gap-5 flex-wrap">
              <LabeledField vertical text="Recipe margin:">
                <RadioToggle
                  options={recipeMargins}
                  onChange={(selected: string | number) =>
                    setState({ recipeMargin: Number(selected) })
                  }
                  selected={state.recipeMargin}
                />
              </LabeledField>
            </div>
            <div class="flex items-center px-8 mt-2">
              Cost per recipe with margin applied is
              <span class="font-bold border rounded px-2 font-normal mx-1">
                {unitCostWithProfit()}
              </span>
              {mainState.currency}
            </div>
            <div class="px-8 mt-8">
              <Table>
                <TableHeader>
                  <TableHeaderCol>Product name</TableHeaderCol>
                  <TableHeaderCol>Ammount</TableHeaderCol>
                  <TableHeaderCol>Cost Percentage</TableHeaderCol>
                  <TableHeaderCol>Production cost</TableHeaderCol>
                  <TableHeaderCol>Retail price</TableHeaderCol>
                  <TableHeaderCol>Personal price</TableHeaderCol>
                </TableHeader>
                <TableBody>
                  <For each={recipeProducts()}>
                    {(product) => (
                      <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.Name}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.Ammount}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <NumericInput
                            value={product.costPercentage}
                            onChange={(newValue) =>
                              setCostPercentages(
                                fixPercentages(
                                  costPercentages(),
                                  product.Name,
                                  newValue
                                )
                              )
                            }
                          />
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Tooltip text="Click to set your personal price">
                            <button
                              class="px-2 py-1"
                              onClick={() =>
                                update.personalPrice(
                                  product.Name,
                                  mainState.currency,
                                  product.productionCost
                                )
                              }
                            >
                              {`${product.productionCost} ${mainState.currency}`}
                            </button>
                          </Tooltip>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Tooltip text="Click to set your personal price">
                            <button
                              class="px-2 py-1"
                              onClick={() =>
                                update.personalPrice(
                                  product.Name,
                                  mainState.currency,
                                  product.retailPrice
                                )
                              }
                            >
                              {`${product.retailPrice} ${mainState.currency}`}
                            </button>
                          </Tooltip>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <PersonalPrice productName={product.Name} />
                        </td>
                      </tr>
                    )}
                  </For>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
