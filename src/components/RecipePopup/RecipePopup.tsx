import React from "react";
import { formatNumber, RecipeVariant } from "../../utils/typedData";
import { Table, Button, Popover } from "antd";
import useIngredientColumns from "./useIngredientColumns";
import useProductColumns from "./useProductColumns";
import { useAppContext } from "../../AppContext";
import RecipeCraftAmmount from "./RecipeCraftAmmount";

// https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
const calcAmmount = (ammount: number, craftAmmout: number) => {
  return (ammount * craftAmmout) / craftAmmout;
};
const calcPrice = (ammount: number, price?: number) =>
  !price ? 0 : formatNumber(ammount * price);

type PropTypes = {
  recipe: RecipeVariant;
  buttonText: string;
};

export default ({ recipe, buttonText }: PropTypes) => {
  const {
    prices,
    itemCostPercentages,
    setItemCostPercentages,
    getRecipeCraftAmmount,
  } = useAppContext();
  const columns = useIngredientColumns();
  const productColumns = useProductColumns(recipe);
  const craftAmmount = getRecipeCraftAmmount(recipe.key);

  // Finds unit price for each item and then calculate price of recipe ingredients based on module used
  const ingredients = recipe.ingredients
    .map((ing) => ({
      ...ing,
      price: prices.find((price) => price.itemName === ing.name)?.price,
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
    }));

  // Sums the prices of each ingredient in the recipe to get the last row
  const totalIngredientCosts = ingredients.reduce(
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
  );
  // Creates the final datasource for ingredients using the ingredients and adding a new row for the totals
  const datasourceIngredients = [
    ...ingredients,
    {
      tag: "COST",
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
  ];

  // Initializes cost percentages on the first time
  const currentItemCostPercentages = itemCostPercentages.find(
    (t) => t.itemName === recipe.key
  );
  if (!currentItemCostPercentages) {
    const evenPercent = 100 / recipe.products.length;
    setItemCostPercentages((prev) => [
      ...prev,
      {
        itemName: recipe.key,
        percentages: recipe.products.map((prod, index) => ({
          productName: prod.name,
          percentage:
            index !== recipe.products.length - 1
              ? evenPercent
              : 100 - (recipe.products.length - 1) * evenPercent,
        })),
      },
    ]);
  }

  // Adds cost percentage and predicts price of products based on percentage
  const products = recipe.products.map((prod) => {
    const costPercent =
      currentItemCostPercentages?.percentages?.find(
        (t) => t.productName === prod.name
      )?.percentage ?? 0;
    return {
      ...prod,
      costPercent,
      priceM0: formatNumber(
        ((totalIngredientCosts.priceM0 / prod.ammount) * costPercent) / 100
      ),
      priceM1: formatNumber(
        ((totalIngredientCosts.priceM1 / prod.ammount) * costPercent) / 100
      ),
      priceM2: formatNumber(
        ((totalIngredientCosts.priceM2 / prod.ammount) * costPercent) / 100
      ),
      priceM3: formatNumber(
        ((totalIngredientCosts.priceM3 / prod.ammount) * costPercent) / 100
      ),
      priceM4: formatNumber(
        ((totalIngredientCosts.priceM4 / prod.ammount) * costPercent) / 100
      ),
      priceM5: formatNumber(
        ((totalIngredientCosts.priceM5 / prod.ammount) * costPercent) / 100
      ),
      price: prices.find((price) => price.itemName === prod.name)?.price,
    };
  });

  return (
    <Popover
      placement="bottom"
      content={
        <div>
          <h4>Ingredients</h4>
          <RecipeCraftAmmount recipeName={recipe.key} />
          <Table dataSource={datasourceIngredients} columns={columns} />
          <h4>Products</h4>
          <Table dataSource={products} columns={productColumns} />
        </div>
      }
      title="Recipe"
      style={{ cursor: "pointer" }}
      trigger="click"
    >
      <Button type="link">{buttonText}</Button>
    </Popover>
  );
};
