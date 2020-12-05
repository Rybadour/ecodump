import React, { Dispatch, SetStateAction } from "react";
import {
  RecipeCostPercentage,
  ItemPrice,
  RecipeCostProdPercentage,
} from "../../types";
import { formatNumber, RecipeVariant } from "../../utils/typedData";
import { Table, InputNumber, Slider } from "antd";
import { getColumn } from "../../utils/helpers";
import useLocalStorage from "../../context/useLocalStorage";

type SetItemPrice = (itemName: string, price: number) => void;
type Ing = {
  name: string;
  ammountM0?: number;
  ammountM1?: number;
  ammountM2?: number;
  ammountM3?: number;
  ammountM4?: number;
  ammountM5?: number;
  priceM0?: number;
  priceM1?: number;
  priceM2?: number;
  priceM3?: number;
  priceM4?: number;
  priceM5?: number;
};

// Fixes percentages so that the sum is 100%
const fixPercentages = (
  prodName: string,
  newPercentage: number,
  percentages: RecipeCostProdPercentage[]
) => {
  let sum = newPercentage;
  return percentages.map((t, index) => {
    let percentage = t.productName === prodName ? newPercentage : t.percentage;
    if (t.productName !== prodName) {
      if (sum + percentage > 100) {
        percentage = 100 - sum;
      }
      sum += percentage;
    }
    if (index === percentages.length - 1) {
      percentage += 100 - sum;
    }
    return {
      ...t,
      percentage,
    };
  });
};

const updateItemPercentage = (
  itemName: string,
  prodName: string,
  newPercentage: number,
  setCostPercentages: Dispatch<SetStateAction<RecipeCostPercentage[]>>
) => {
  setCostPercentages((prevItemPercentages) => {
    const itemPercentageIndex = prevItemPercentages.findIndex(
      (t) => t.itemName === itemName
    );
    const newItemPercentages = {
      ...prevItemPercentages[itemPercentageIndex],
      percentages: fixPercentages(
        prodName,
        newPercentage,
        prevItemPercentages[itemPercentageIndex].percentages
      ),
    };
    return [
      ...prevItemPercentages.slice(0, itemPercentageIndex),
      newItemPercentages,
      ...prevItemPercentages.slice(itemPercentageIndex + 1),
    ];
  });
};

const calcPrice = (ammount: number, price?: number) =>
  !price ? undefined : formatNumber(ammount * price);

const renderPrice = (ammount?: number, price?: number) => {
  if (!ammount) {
    return price + "$";
  }
  return `${ammount} ${price ? `(${price}$)` : ""}`;
};

const getIngredientColumns = (setItemPrice: SetItemPrice) => [
  getColumn("name"),
  {
    ...getColumn("price"),
    render: (
      price: number | undefined,
      item: { tag: string; name: string }
    ) => {
      if (item.tag === "COST") return;
      return (
        <>
          <InputNumber
            value={price}
            width="20"
            onChange={(newPrice) => setItemPrice(item.name, Number(newPrice))}
          />
        </>
      );
    },
  },
  {
    ...getColumn("M0"),
    render: (_: any, item: Ing) => renderPrice(item.ammountM0, item.priceM0),
  },
  {
    ...getColumn("M1"),
    render: (_: any, item: Ing) => renderPrice(item.ammountM1, item.priceM1),
  },
  {
    ...getColumn("M2"),
    render: (_: any, item: Ing) => renderPrice(item.ammountM2, item.priceM2),
  },
  {
    ...getColumn("M3"),
    render: (_: any, item: Ing) => renderPrice(item.ammountM3, item.priceM3),
  },
  {
    ...getColumn("M4"),
    render: (_: any, item: Ing) => renderPrice(item.ammountM4, item.priceM4),
  },
  {
    ...getColumn("M5"),
    render: (_: any, item: Ing) => renderPrice(item.ammountM5, item.priceM5),
  },
];

const getProductColumns = (
  recipe: RecipeVariant,
  setItemPrice: SetItemPrice,
  setCostPercentages: Dispatch<SetStateAction<RecipeCostPercentage[]>>
) => [
  getColumn("name"),
  getColumn("ammount"),
  {
    ...getColumn("costPercent", "Cost Percentage"),
    render: (costPercent: number, item: { name: string }) => {
      return (
        <InputNumber
          value={costPercent}
          width="20"
          onChange={(value) =>
            updateItemPercentage(
              recipe.name,
              item.name,
              Number(value),
              setCostPercentages
            )
          }
        />
      );
    },
  },
  getColumn("priceM0", "M0"),
  getColumn("priceM1", "M1"),
  getColumn("priceM2", "M2"),
  getColumn("priceM3", "M3"),
  getColumn("priceM4", "M4"),
  getColumn("priceM5", "M5"),
  {
    ...getColumn("price"),
    render: (price: number | undefined, item: { name: string }) => {
      return (
        <>
          <InputNumber
            value={price}
            width="20"
            onChange={(newPrice) => setItemPrice(item.name, Number(newPrice))}
          />
        </>
      );
    },
  },
];
export default ({
  recipe,
  prices,
  setItemPrice,
}: {
  recipe: RecipeVariant;
  prices: ItemPrice[];
  setItemPrice: SetItemPrice;
}) => {
  const [costPercentages, setCostPercentages] = useLocalStorage<
    RecipeCostPercentage[]
  >("costPercentages", []);
  const columns = getIngredientColumns(setItemPrice);
  const productColumns = getProductColumns(
    recipe,
    setItemPrice,
    setCostPercentages
  );

  // Finds unit price for each item and then calculate price of recipe ingredients based on module used
  const ingredients = recipe.ingredients
    .map((ing) => ({
      ...ing,
      price: prices.find((price) => price.itemName === ing.name)?.price,
    }))
    .map((ing) => ({
      ...ing,
      ammountM0: ing.ammount,
      priceM0: calcPrice(ing.ammount, ing.price),
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
  const itemCostPercentages = costPercentages.find(
    (t) => t.itemName === recipe.key
  );
  if (!itemCostPercentages) {
    const evenPercent = 100 / recipe.products.length;
    setCostPercentages((prev) => [
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
  const products = recipe.products.map((prod, index) => {
    const costPercent =
      itemCostPercentages?.percentages?.find((t) => t.productName === prod.name)
        ?.percentage ?? 0;
    return {
      ...prod,
      costPercent,
      priceM0:
        formatNumber(
          ((totalIngredientCosts.priceM0 / prod.ammount) * costPercent) / 100
        ) + "$",
      priceM1:
        formatNumber(
          ((totalIngredientCosts.priceM1 / prod.ammount) * costPercent) / 100
        ) + "$",
      priceM2:
        formatNumber(
          ((totalIngredientCosts.priceM2 / prod.ammount) * costPercent) / 100
        ) + "$",
      priceM3:
        formatNumber(
          ((totalIngredientCosts.priceM3 / prod.ammount) * costPercent) / 100
        ) + "$",
      priceM4:
        formatNumber(
          ((totalIngredientCosts.priceM4 / prod.ammount) * costPercent) / 100
        ) + "$",
      priceM5:
        formatNumber(
          ((totalIngredientCosts.priceM5 / prod.ammount) * costPercent) / 100
        ) + "$",
      price: prices.find((price) => price.itemName === prod.name)?.price,
    };
  });

  return (
    <div>
      <h4>Ingredients</h4>
      <Table dataSource={datasourceIngredients} columns={columns} />
      <h4>Products</h4>
      <Table dataSource={products} columns={productColumns} />
    </div>
  );
};
