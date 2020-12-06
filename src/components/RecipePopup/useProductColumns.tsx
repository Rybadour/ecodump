import { Button, InputNumber } from "antd";
import React from "react";
import { useAppContext } from "../../AppContext";
import { getColumn } from "../../utils/helpers";
import { RecipeVariant } from "../../utils/typedData";

export default (recipe: RecipeVariant) => {
  const { updatePrice, updateItemCostPercentage } = useAppContext();

  return [
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
              updateItemCostPercentage(recipe.name, item.name, Number(value))
            }
          />
        );
      },
    },
    {
      ...getColumn("priceM0", "M0"),
      render: (price: number, item: { name: string }) => (
        <Button
          onClick={() => updatePrice(item.name, price)}
          title="Set this price"
        >
          {price}
        </Button>
      ),
    },
    {
      ...getColumn("priceM1", "M1"),
      render: (price: number, item: { name: string }) => (
        <Button
          onClick={() => updatePrice(item.name, price)}
          title="Set this price"
        >
          {price} $
        </Button>
      ),
    },
    {
      ...getColumn("priceM2", "M2"),
      render: (price: number, item: { name: string }) => (
        <Button
          onClick={() => updatePrice(item.name, price)}
          title="Set this price"
        >
          {price} $
        </Button>
      ),
    },
    {
      ...getColumn("priceM3", "M3"),
      render: (price: number, item: { name: string }) => (
        <Button
          onClick={() => updatePrice(item.name, price)}
          title="Set this price"
        >
          {price} $
        </Button>
      ),
    },
    {
      ...getColumn("priceM4", "M4"),
      render: (price: number, item: { name: string }) => (
        <Button
          onClick={() => updatePrice(item.name, price)}
          title="Set this price"
        >
          {price} $
        </Button>
      ),
    },
    {
      ...getColumn("priceM5", "M5"),
      render: (price: number, item: { name: string }) => (
        <Button
          onClick={() => updatePrice(item.name, price)}
          title="Set this price"
        >
          {price} $
        </Button>
      ),
    },
    {
      ...getColumn("price"),
      render: (price: number | undefined, item: { name: string }) => {
        return (
          <>
            <InputNumber
              value={price}
              width="20"
              onChange={(newPrice) => updatePrice(item.name, Number(newPrice))}
            />
          </>
        );
      },
    },
  ];
};
