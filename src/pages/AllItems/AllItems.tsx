import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Table, Popover, Button, PageHeader } from "antd";
import { ItemPrice, Recipe } from "../../types";
import useRecipeHeaderFilters from "../../context/useRecipeHeaderFilters";
import HeaderFilters from "../../components/HeaderFilters";
import IngredientsPopupContent from "./IngredientsPopupContent";
import { getColumn } from "../../utils/helpers";

const getColumns = (
  prices: ItemPrice[],
  setPrices: Dispatch<SetStateAction<ItemPrice[]>>
) => [
  getColumn("name"),
  getColumn("recipe"),
  getColumn("profession"),
  getColumn("craftStation", "Crafting station"),
  {
    ...getColumn("ingredients"),
    render: (ingredients: string[][], item: Recipe) => (
      <Popover
        placement="left"
        content={
          <IngredientsPopupContent ingredients={ingredients} prices={prices} />
        }
        title="Ingredients"
        style={{ cursor: "pointer" }}
      >
        <Button>{ingredients[0][0]}</Button>
      </Popover>
    ),
  },
  {
    ...getColumn("price", "Fixed price"),
    render: (price: number, item: Recipe) => {
      return (
        <input
          value={prices.find((t) => t.itemName === item.name)?.price ?? ""}
          style={{ width: 50 }}
          onChange={(evt) => {
            const newPrice = Number(evt.target.value);
            if (Number.isNaN(newPrice)) return;
            setPrices((prevPrices) => {
              const index = prevPrices.findIndex(
                (t) => t.itemName === item.name
              );
              return index >= 0
                ? [
                    ...prevPrices.slice(0, index),
                    { ...prevPrices[index], price: newPrice },
                    ...prevPrices.slice(index + 1),
                  ]
                : [
                    ...prevPrices,
                    {
                      itemName: item.name,
                      price: newPrice,
                    },
                  ];
            });
          }}
        />
      );
    },
  },
];

export default () => {
  const [prices, setPrices] = useState<ItemPrice[]>([]);
  const filters = useRecipeHeaderFilters();
  const datasource = filters.filteredRecipes
    .map((recipe) =>
      Object.keys(recipe.variants)
        .map((variantKey) =>
          recipe.variants[variantKey].products.map((product) => ({
            ...recipe,
            key: recipe.key + product[0],
            name: product[0],
            recipe: recipe.name,
            ingredients: recipe.variants[variantKey].ingredients,
            price: prices.find((t) => t.itemName === product[0])?.price,
          }))
        )
        .flat()
    )
    .flat();

  console.log("prices1", prices);
  const columns = useMemo(() => getColumns(prices, setPrices), [
    prices,
    setPrices,
  ]);
  console.log("prices2", prices);
  console.log("here", datasource);

  return (
    <div>
      <PageHeader
        title="All items"
        subTitle="Here you can find all the items available in the game"
      />
      <HeaderFilters {...filters} />
      <Table dataSource={datasource} columns={columns} />
    </div>
  );
};
