import React, { Dispatch, SetStateAction } from "react";
import { ItemPrice } from "../../types";
import { RecipeVariant } from "../../utils/typedData";
import { Table } from "antd";
import { getColumn } from "../../utils/helpers";

const getColumns = (setPrices: Dispatch<SetStateAction<ItemPrice[]>>) => [
  getColumn("name"),
  //   {
  //     ...getColumn("price"),
  //     render: (price: number | undefined, item: { name: string }) => (
  //       <input
  //         value={price === undefined ? "?" : price.toFixed(2)}
  //         onChange={(evt) => {
  //           const newPrice = Number(evt.target.value);
  //           if (Number.isNaN(newPrice)) {
  //             return;
  //           }
  //           setPrices((prevPrices) => {
  //             const index = prevPrices.findIndex((t) => t.itemName === item.name);
  //             if (index < 0) {
  //               return [
  //                 ...prevPrices,
  //                 {
  //                   itemName: item.name,
  //                   price: newPrice,
  //                 },
  //               ];
  //             } else {
  //               return [
  //                 ...prevPrices.slice(0, index),
  //                 { ...prevPrices[index], price: newPrice },
  //                 ...prevPrices.slice(index + 1),
  //               ];
  //             }
  //           });
  //         }}
  //       />
  //     ),
  //   },
  getColumn("ammount", "M0"),
  getColumn("ammountM1", "M1"),
  getColumn("ammountM2", "M2"),
  getColumn("ammountM3", "M3"),
  getColumn("ammountM4", "M4"),
  getColumn("ammountM5", "M5"),
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

export default ({
  recipe,
  prices,
  setPrices,
}: {
  recipe: RecipeVariant;
  prices: ItemPrice[];
  setPrices: Dispatch<SetStateAction<ItemPrice[]>>;
}) => {
  const columns = getColumns(setPrices);
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

  const datasource = recipe.ingredients;

  return (
    <div>
      <Table dataSource={datasource} columns={columns} />
    </div>
  );
};
