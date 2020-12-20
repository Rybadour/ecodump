import { Select } from "antd";
import React from "react";
import { useAppContext } from "../../AppContext";
import RecipePopup from "../../components/RecipePopup";
import { getColumn } from "../../utils/helpers";
import { Item } from "../../utils/typedData";

export const { Option } = Select;

export const useGetColumns = () => {
  const {
    selectedVariants,
    setSelectedVariants,
    prices,
    updatePrice,
  } = useAppContext();
  return [
    getColumn("key", "Name"),
    {
      ...getColumn("recipes"),
      render: (recipes: any, item: Item) => {
        const variants = item.productInRecipes
          .map((recipe) => recipe.variants)
          .flat();

        if (variants.length === 0) {
          return "NA";
        }
        if (variants.length === 1) {
          return `${variants[0].key}`;
        }
        return (
          <Select
            value={
              selectedVariants[item.key] ??
              item.productInRecipes[0].defaultVariant
            }
            style={{ width: 250 }}
            onChange={(variant) =>
              setSelectedVariants((prev) => ({ ...prev, [item.key]: variant }))
            }
          >
            {item.productInRecipes
              .map((recipe) => recipe.variants)
              .flat()
              .map((variant) => (
                <Option key={variant.key} value={variant.key}>
                  {variant.key}
                </Option>
              ))}
          </Select>
        );
      },
    },
    {
      ...getColumn("profession"),
      render: (_: any, item: Item) => {
        const variants = item.productInRecipes
          .map((recipe) => recipe.variants)
          .flat();

        if (variants.length === 0) {
          return "NA";
        }
        const selectedVariant =
          selectedVariants[item.key] ?? item.productInRecipes[0].defaultVariant;
        const skillNeeds = item.productInRecipes.find((t) =>
          t.variants.some((t) => t.key === selectedVariant)
        )?.skillNeeds;
        if (skillNeeds?.length === 0) {
          return "None";
        }

        return `${skillNeeds?.[0].skill} - ${skillNeeds?.[0].level}`;
      },
    },
    {
      ...getColumn("crafting station"),
      render: (_: any, item: Item) => {
        const variants = item.productInRecipes
          .map((recipe) => recipe.variants)
          .flat();

        if (variants.length === 0) {
          return "NA";
        }
        const selectedVariant =
          selectedVariants[item.key] ?? item.productInRecipes[0].defaultVariant;
        const craftStation = item.productInRecipes.find((t) =>
          t.variants.some((t) => t.key === selectedVariant)
        )?.craftStation;
        return `${craftStation ?? "None"}`;
      },
    },
    {
      ...getColumn("ingredients"),
      render: (ingredients: string[][], item: Item) => {
        const variants = item.productInRecipes
          .map((recipe) => recipe.variants)
          .flat();
        if (variants.length === 0) {
          return "NA";
        }
        const selectedVariant =
          selectedVariants[item.key] ?? item.productInRecipes[0].defaultVariant;
        const variant = variants.find((t) => t.key === selectedVariant);

        if (variant === undefined) {
          return "NA";
        }

        return <RecipePopup recipe={variant} buttonText="Check recipe" />;
      },
    },
    {
      ...getColumn("price", "Fixed price"),
      render: (price: number, item: Item) => {
        return (
          <input
            value={prices.find((t) => t.itemName === item.key)?.price ?? "?"}
            style={{ width: 50 }}
            onChange={(evt) => {
              updatePrice(item.key, Number(evt.target.value));
            }}
          />
        );
      },
    },
  ];
};
