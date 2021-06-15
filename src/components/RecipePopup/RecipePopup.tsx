import React, { useMemo } from "react";
import { formatNumber, RecipeVariant } from "../../utils/typedData";
import { Table, Divider } from "antd";
import useIngredientColumns from "./useIngredientColumns";
import useProductColumns from "./useProductColumns";
import { useAppContext } from "../../AppContext";
import RecipeCraftAmmount from "./RecipeCraftAmmount";
import RecipeMargin from "./RecipeMargin";
import { convertToMultiplier } from "../../utils/helpers";
import { ItemTypes } from "../../utils/constants";

const calcAmmount = (ammount: number, craftAmmout: number) => {
  return Math.ceil(ammount * craftAmmout) / craftAmmout;
};
const calcPrice = (ammount: number, price?: number) =>
  !price ? 0 : formatNumber(ammount * price);

type PropTypes = {
  description: string;
  recipe: RecipeVariant;
};

export default ({ recipe, description }: PropTypes) => {
  const {
    personalPrices,
    getRecipeCostPercentage,
    getRecipeCraftAmmount,
    getRecipeMargin,
  } = useAppContext();
  const ingredientColumns = useIngredientColumns();
  const productColumns = useProductColumns(recipe);
  const craftAmmount = getRecipeCraftAmmount(recipe.key);
  const marginMultiplier = convertToMultiplier(getRecipeMargin(recipe.key));

  // Finds unit price for each item and then calculate price of recipe ingredients based on module used
  const ingredients = useMemo(
    () =>
      recipe.ingredients
        .map((ing) => ({
          ...ing,
          price: personalPrices.find((price) => price.itemName === ing.name)
            ?.price,
        }))
        .map((ing) => ({
          ...ing,
          ammountM0: calcAmmount(Number(ing.ammount), craftAmmount),
          ammountM1: calcAmmount(ing.ammountM1, craftAmmount),
          ammountM2: calcAmmount(ing.ammountM2, craftAmmount),
          ammountM3: calcAmmount(ing.ammountM3, craftAmmount),
          ammountM4: calcAmmount(ing.ammountM4, craftAmmount),
          ammountM5: calcAmmount(ing.ammountM5, craftAmmount),
        }))
        .map((ing) => ({
          ...ing,
          priceM0: calcPrice(ing.ammountM0, ing.price),
          priceM1: calcPrice(ing.ammountM1, ing.price),
          priceM2: calcPrice(ing.ammountM2, ing.price),
          priceM3: calcPrice(ing.ammountM3, ing.price),
          priceM4: calcPrice(ing.ammountM4, ing.price),
          priceM5: calcPrice(ing.ammountM5, ing.price),
        })),
    [craftAmmount, personalPrices, recipe.ingredients]
  );

  // Sums the prices of each ingredient in the recipe to get the last row
  const totalIngredientCosts = useMemo(
    () =>
      ingredients.reduce(
        (prev, ing) => ({
          ...prev,
          priceM0: prev.priceM0 + (ing.priceM0 ?? 0),
          priceM1: prev.priceM1 + (ing.priceM1 ?? 0),
          priceM2: prev.priceM2 + (ing.priceM2 ?? 0),
          priceM3: prev.priceM3 + (ing.priceM3 ?? 0),
          priceM4: prev.priceM4 + (ing.priceM4 ?? 0),
          priceM5: prev.priceM5 + (ing.priceM5 ?? 0),
        }),
        {
          priceM0: 0,
          priceM1: 0,
          priceM2: 0,
          priceM3: 0,
          priceM4: 0,
          priceM5: 0,
        }
      ),
    [ingredients]
  );

  // Creates the final datasource for ingredients using the ingredients and adding a new row for the totals
  const datasourceIngredients = useMemo(
    () =>
      [
        ...ingredients,
        {
          tag: ItemTypes.COST,
          name: "Cost",
          ammountM0: undefined,
          ammountM1: undefined,
          ammountM2: undefined,
          ammountM3: undefined,
          ammountM4: undefined,
          ammountM5: undefined,
          priceM0: formatNumber(totalIngredientCosts.priceM0),
          priceM1: formatNumber(totalIngredientCosts.priceM1),
          priceM2: formatNumber(totalIngredientCosts.priceM2),
          priceM3: formatNumber(totalIngredientCosts.priceM3),
          priceM4: formatNumber(totalIngredientCosts.priceM4),
          priceM5: formatNumber(totalIngredientCosts.priceM5),
        },
      ].map((t) => ({ ...t, key: t.name })),
    [
      ingredients,
      totalIngredientCosts.priceM0,
      totalIngredientCosts.priceM1,
      totalIngredientCosts.priceM2,
      totalIngredientCosts.priceM3,
      totalIngredientCosts.priceM4,
      totalIngredientCosts.priceM5,
    ]
  );

  const recipeCostPercentage = useMemo(
    () => getRecipeCostPercentage(recipe),
    [getRecipeCostPercentage, recipe]
  );

  // Adds cost percentage and predicts price of products based on percentage
  const products = useMemo(
    () =>
      recipe.products.map((prod) => {
        const costPercent =
          recipeCostPercentage?.percentages?.find(
            (t) => t.productName === prod.name
          )?.percentage ?? 0;

        return {
          ...prod,
          key: prod.name,
          costPercent,
          priceM0: formatNumber(
            (((totalIngredientCosts.priceM0 / prod.ammount) * costPercent) /
              100) *
              marginMultiplier
          ),
          priceM1: formatNumber(
            (((totalIngredientCosts.priceM1 / prod.ammount) * costPercent) /
              100) *
              marginMultiplier
          ),
          priceM2: formatNumber(
            (((totalIngredientCosts.priceM2 / prod.ammount) * costPercent) /
              100) *
              marginMultiplier
          ),
          priceM3: formatNumber(
            (((totalIngredientCosts.priceM3 / prod.ammount) * costPercent) /
              100) *
              marginMultiplier
          ),
          priceM4: formatNumber(
            (((totalIngredientCosts.priceM4 / prod.ammount) * costPercent) /
              100) *
              marginMultiplier
          ),
          priceM5: formatNumber(
            (((totalIngredientCosts.priceM5 / prod.ammount) * costPercent) /
              100) *
              marginMultiplier
          ),
          price: personalPrices.find((price) => price.itemName === prod.name)
            ?.price,
        };
      }),
    [
      marginMultiplier,
      personalPrices,
      recipe.products,
      recipeCostPercentage,
      totalIngredientCosts.priceM0,
      totalIngredientCosts.priceM1,
      totalIngredientCosts.priceM2,
      totalIngredientCosts.priceM3,
      totalIngredientCosts.priceM4,
      totalIngredientCosts.priceM5,
    ]
  );

  return (
    <div>
      {description}
      <Divider />
      <h3>Ingredients</h3>
      <RecipeCraftAmmount recipeName={recipe.key} />
      <Table dataSource={datasourceIngredients} columns={ingredientColumns} />
      <h3>Products</h3>
      <RecipeMargin recipeName={recipe.key} />
      <Table dataSource={products} columns={productColumns} />
    </div>
  );
};
