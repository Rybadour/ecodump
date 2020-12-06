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
          return <p>none</p>;
        }
        if (variants.length === 1) {
          return <p>{variants[0].key}</p>;
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
          return <p>NA</p>;
        }
        const selectedVariant =
          selectedVariants[item.key] ?? item.productInRecipes[0].defaultVariant;
        const skillNeeds = item.productInRecipes.find((t) =>
          t.variants.some((t) => t.key === selectedVariant)
        )?.skillNeeds;
        if (skillNeeds?.length === 0) {
          return <p>none</p>;
        }

        return (
          <p>
            {skillNeeds?.[0].skill} - {skillNeeds?.[0].level}
          </p>
        );
      },
    },
    {
      ...getColumn("crafting station"),
      render: (_: any, item: Item) => {
        const variants = item.productInRecipes
          .map((recipe) => recipe.variants)
          .flat();

        if (variants.length === 0) {
          return <p>NA</p>;
        }
        const selectedVariant =
          selectedVariants[item.key] ?? item.productInRecipes[0].defaultVariant;
        const craftStation = item.productInRecipes.find((t) =>
          t.variants.some((t) => t.key === selectedVariant)
        )?.craftStation;
        return <p>{craftStation ?? "none"}</p>;
      },
    },
    {
      ...getColumn("ingredients"),
      render: (ingredients: string[][], item: Item) => {
        const variants = item.productInRecipes
          .map((recipe) => recipe.variants)
          .flat();
        if (variants.length === 0) {
          return <p>NA</p>;
        }
        const selectedVariant =
          selectedVariants[item.key] ?? item.productInRecipes[0].defaultVariant;
        const variant = variants.find((t) => t.key === selectedVariant);

        if (variant === undefined) {
          return <p>NA</p>;
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
