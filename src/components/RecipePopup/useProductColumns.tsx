import { Button, InputNumber, Tooltip } from "antd";
import React from "react";
import { useAppContext } from "../../AppContext";
import { getColumn } from "../../utils/helpers";
import { RecipeVariant } from "../../utils/typedData";

export default (recipe: RecipeVariant) => {
  const { updatePrice, updateRecipeCostPercentage } = useAppContext();

  return [
    getColumn("name"),
    getColumn("ammount"),
    {
      ...getColumn("costPercent", "Cost Percentage"),
      render: (costPercent: number, item: { name: string }) => {
        return (
          <Tooltip title="Cost percentage is used to distribute the cost of the recipe by the output products to help you calculate how much you should charge for each product.">
            <InputNumber
              value={costPercent}
              width="20"
              onChange={(value) =>
                updateRecipeCostPercentage(recipe, item.name, Number(value))
              }
            />
          </Tooltip>
        );
      },
    },
    {
      ...getColumn("priceM0", "M0"),
      render: (price: number, item: { name: string }) => (
        <Tooltip
          title={`Calculated value for this product if item was produced using no module. Click to fix this value as the price for ${item.name}`}
        >
          <Button onClick={() => updatePrice(item.name, price)} type="primary">
            {price}
          </Button>
        </Tooltip>
      ),
    },
    {
      ...getColumn("priceM1", "M1"),
      render: (price: number, item: { name: string }) => (
        <Tooltip
          title={`Calculated value for this product if item was produced using a module level 1. Click to fix this value as the price for ${item.name}`}
        >
          <Button onClick={() => updatePrice(item.name, price)} type="primary">
            {price} $
          </Button>
        </Tooltip>
      ),
    },
    {
      ...getColumn("priceM2", "M2"),
      render: (price: number, item: { name: string }) => (
        <Tooltip
          title={`Calculated value for this product if item was produced using a module level 2. Click to fix this value as the price for ${item.name}`}
        >
          <Button onClick={() => updatePrice(item.name, price)} type="primary">
            {price} $
          </Button>
        </Tooltip>
      ),
    },
    {
      ...getColumn("priceM3", "M3"),
      render: (price: number, item: { name: string }) => (
        <Tooltip
          title={`Calculated value for this product if item was produced using a module level 3. Click to fix this value as the price for ${item.name}`}
        >
          <Button onClick={() => updatePrice(item.name, price)} type="primary">
            {price} $
          </Button>
        </Tooltip>
      ),
    },
    {
      ...getColumn("priceM4", "M4"),
      render: (price: number, item: { name: string }) => (
        <Tooltip
          title={`Calculated value for this product if item was produced using a module level 4. Click to fix this value as the price for ${item.name}`}
        >
          <Button onClick={() => updatePrice(item.name, price)} type="primary">
            {price} $
          </Button>
        </Tooltip>
      ),
    },
    {
      ...getColumn("priceM5", "M5"),
      render: (price: number, item: { name: string }) => (
        <Tooltip
          title={`Calculated value for this product if item was produced using a module level 5. Click to fix this value as the price for ${item.name}`}
        >
          <Button onClick={() => updatePrice(item.name, price)} type="primary">
            {price} $
          </Button>
        </Tooltip>
      ),
    },
    {
      ...getColumn("price"),
      render: (price: number | undefined, item: { name: string }) => {
        return (
          <Tooltip title="Update your fixed price for this item">
            <InputNumber
              value={price}
              width="20"
              onChange={(newPrice) => updatePrice(item.name, Number(newPrice))}
            />
          </Tooltip>
        );
      },
    },
  ];
};
