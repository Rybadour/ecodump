import React from "react";
import { ItemPrice } from "../../types";
import { Table } from "antd";
import { getColumn } from "../../utils/helpers";

const columns = [
  getColumn("name"),
  getColumn("M0"),
  getColumn("M1"),
  getColumn("M2"),
  getColumn("M3"),
  getColumn("M4"),
  getColumn("M5"),
];
const multipliers = [1, 0.9, 0.75, 0.6, 0.55, 0.5];
const getMultiplierValue = (locked: boolean, value: number, index: number) =>
  (value * (locked ? 1 : multipliers[index])).toFixed(2);

export default ({
  ingredients,
  prices,
}: {
  ingredients: string[][];
  prices: ItemPrice[];
}) => {
  const price = 1;
  const datasource = ingredients.map((t) => {
    const value = Number(t[2]);
    const isLocked = t[3] === "True";
    return {
      name: t[1],
      M0: value.toFixed(2),
      basePrice: price,
      M1: getMultiplierValue(isLocked, value, 1),
      M1Price: getMultiplierValue(isLocked, price, 1),
      M2: getMultiplierValue(isLocked, value, 2),
      M2Price: getMultiplierValue(isLocked, price, 2),
      M3: getMultiplierValue(isLocked, value, 3),
      M3Price: getMultiplierValue(isLocked, price, 3),
      M4: getMultiplierValue(isLocked, value, 4),
      M4Price: getMultiplierValue(isLocked, price, 4),
      M5: getMultiplierValue(isLocked, value, 5),
      M5Price: getMultiplierValue(isLocked, price, 5),
    };
  });
  return (
    <div>
      <Table dataSource={datasource} columns={columns} />
    </div>
  );
};
