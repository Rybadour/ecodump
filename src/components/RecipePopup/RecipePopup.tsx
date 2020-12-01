import React from "react";
import { ItemPrice } from "../../types";
import { formatNumber, RecipeVariant } from "../../utils/typedData";
import { Table } from "antd";
import { getColumn } from "../../utils/helpers";

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
        <input
          value={price === undefined ? "?" : +price.toFixed(2)}
          style={{ width: 50 }}
          onChange={(evt) => {
            setItemPrice(item.name, Number(evt.target.value));
          }}
        />
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
// const formatNumber = (num: number) => +num.toFixed(2);
// const multipliers = [1, 0.9, 0.75, 0.6, 0.55, 0.5];
// const getMultiplierValue = (locked: boolean, value: number, index: number) =>
//   formatNumber(value * (locked ? 1 : multipliers[index]));

// const getColumnValue = (
//   locked: boolean,
//   value: number,
//   price: number | undefined,
//   index: number
// ) => {
//   const quantity = getMultiplierValue(locked, value, index);
//   return `${quantity} ${
//     price === undefined ? "" : `(${formatNumber(price * quantity)}$)`
//   }`;
// };

const getProductColumns = () => [getColumn("name"), getColumn("ammount")];
export default ({
  recipe,
  prices,
  setItemPrice,
}: {
  recipe: RecipeVariant;
  prices: ItemPrice[];
  setItemPrice: SetItemPrice;
}) => {
  const columns = getIngredientColumns(setItemPrice);
  const productColumns = getProductColumns();
  //   const mappedIngredients = ingredients.map((t) => {
  //     const name = t[1];
  //     const value = Number(t[2]);
  //     const price = prices.find((t) => t.itemName === name)?.price;
  //     const isLocked = t[3] === "True";
  //     return {
  //       name,
  //       price,
  //       value,
  //       isLocked,
  //       M0: getColumnValue(isLocked, value, price, 0),
  //       M1: getColumnValue(isLocked, value, price, 1),
  //       M2: getColumnValue(isLocked, value, price, 2),
  //       M3: getColumnValue(isLocked, value, price, 3),
  //       M4: getColumnValue(isLocked, value, price, 4),
  //       M5: getColumnValue(isLocked, value, price, 5),
  //     };
  //   });
  //   const totalPrice = mappedIngredients
  //     .filter((t) => t.price !== undefined)
  //     // .reduce((prev: number, curr) => prev + curr.value * (curr.price ?? 0), 0);
  //     .map((t) => ({
  //       M0:
  //         (t.price ?? 0) * Math.ceil(getMultiplierValue(t.isLocked, t.value, 0)),
  //       M1:
  //         (t.price ?? 0) * Math.ceil(getMultiplierValue(t.isLocked, t.value, 1)),
  //       M2:
  //         (t.price ?? 0) * Math.ceil(getMultiplierValue(t.isLocked, t.value, 2)),
  //       M3:
  //         (t.price ?? 0) * Math.ceil(getMultiplierValue(t.isLocked, t.value, 3)),
  //       M4:
  //         (t.price ?? 0) * Math.ceil(getMultiplierValue(t.isLocked, t.value, 4)),
  //       M5:
  //         (t.price ?? 0) * Math.ceil(getMultiplierValue(t.isLocked, t.value, 5)),
  //     }))
  //     .reduce(
  //       (prev, curr) => ({
  //         M0: prev.M0 + curr.M0,
  //         M1: prev.M1 + curr.M1,
  //         M2: prev.M2 + curr.M2,
  //         M3: prev.M3 + curr.M3,
  //         M4: prev.M4 + curr.M4,
  //         M5: prev.M5 + curr.M5,
  //       }),
  //       { M0: 0, M1: 0, M2: 0, M3: 0, M4: 0, M5: 0 }
  //     );
  //   console.log(
  //     "prev",
  //     mappedIngredients
  //       .filter((t) => t.price !== undefined)
  //       // .reduce((prev: number, curr) => prev + curr.value * (curr.price ?? 0), 0);
  //       .map((t) => ({
  //         M0: (t.price ?? 0) * getMultiplierValue(t.isLocked, t.value, 0),
  //         M1: (t.price ?? 0) * getMultiplierValue(t.isLocked, t.value, 1),
  //         M2: (t.price ?? 0) * getMultiplierValue(t.isLocked, t.value, 2),
  //         M3: (t.price ?? 0) * getMultiplierValue(t.isLocked, t.value, 3),
  //         M4: (t.price ?? 0) * getMultiplierValue(t.isLocked, t.value, 4),
  //         M5: (t.price ?? 0) * getMultiplierValue(t.isLocked, t.value, 5),
  //       }))
  //   );
  //   console.log("totalPrice", totalPrice);
  //   const datasource = mappedIngredients.concat({
  //     name: "Total",
  //     price: undefined,
  //     value: 1,
  //     isLocked: true,
  //     M0: `${formatNumber(totalPrice.M0)}$`,
  //     M1: `${formatNumber(totalPrice.M1)}$`,
  //     M2: `${formatNumber(totalPrice.M2)}$`,
  //     M3: `${formatNumber(totalPrice.M3)}$`,
  //     M4: `${formatNumber(totalPrice.M4)}$`,
  //     M5: `${formatNumber(totalPrice.M5)}$`,
  //   });

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
  const totalCosts = ingredients.reduce(
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
      priceM0: formatNumber(totalCosts.priceM0),
      priceM1: formatNumber(totalCosts.priceM1),
      priceM2: formatNumber(totalCosts.priceM2),
      priceM3: formatNumber(totalCosts.priceM3),
      priceM4: formatNumber(totalCosts.priceM4),
      priceM5: formatNumber(totalCosts.priceM5),
    },
  ];
  const products = recipe.products;

  return (
    <div>
      <h4>Ingredients</h4>
      <Table dataSource={datasourceIngredients} columns={columns} />
      <h4>Products</h4>
      <Table dataSource={products} columns={productColumns} />
    </div>
  );
};
