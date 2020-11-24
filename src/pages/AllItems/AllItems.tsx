import React, { Dispatch, SetStateAction, useMemo } from "react";
import { Table, Popover, Button, PageHeader } from "antd";
import { ItemPrice, Recipe } from "../../types";
import useRecipeHeaderFilters from "../../context/useRecipeHeaderFilters";
import HeaderFilters from "../../components/HeaderFilters";
import IngredientsPopupContent from "./IngredientsPopupContent";
import { getColumn } from "../../utils/helpers";
import useLocalStorage from "../../context/useLocalStorage";
import ModuleSelect from "../../components/ModuleSelect";

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
          <IngredientsPopupContent
            ingredients={ingredients}
            prices={prices}
            setPrices={setPrices}
          />
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
  const [prices, setPrices] = useLocalStorage<ItemPrice[]>("prices", []);
  const [upgrades, setUpgrades] = useLocalStorage<{
    bu: number;
    au: number;
    mu: number;
  }>("upgrades", { bu: 0, au: 0, mu: 0 });
  const filters = useRecipeHeaderFilters();

  const columns = useMemo(() => getColumns(prices, setPrices), [
    prices,
    setPrices,
  ]);

  const itemsWithRecipes = useMemo(
    () =>
      filters.filteredRecipes
        .map((recipe) =>
          Object.keys(recipe.variants)
            .map((variantKey) =>
              recipe.variants[variantKey].products.map((product) => ({
                ...recipe,
                key: `${recipe.key}_${product[0]}`,
                name: product[0],
                recipe: recipe.name,
                ingredients: recipe.variants[variantKey].ingredients,
                price: prices.find((t) => t.itemName === product[0])?.price,
              }))
            )
            .flat()
        )
        .flat(),
    [filters.filteredRecipes, prices]
  );

  // const allIngredients = useMemo(
  //   () =>
  //     itemsWithRecipes
  //       .map((t) =>
  //         Object.values(t.variants)
  //           .map((tt) =>
  //             tt.ingredients
  //               .filter((ttt) => ttt[0] === "ITEM")
  //               .map((ttt) => ttt[1])
  //           )
  //           .flat()
  //       )
  //       .flat()
  //       .filter(filterUnique),
  //   [itemsWithRecipes]
  // );

  // const itemsWithoutRecipes = useMemo(
  //   () =>
  //     allIngredients
  //       .filter((t) => itemsWithRecipes.find((tt) => tt.name === t) == null)
  //       .map((t) => ({
  //         key: t,
  //         name: t,
  //       })),
  //   [allIngredients, itemsWithRecipes]
  // );

  // const datasource = useMemo(
  //   () => itemsWithRecipes, //.concat(itemsWithoutRecipes),
  //   [itemsWithRecipes]
  // );

  console.log("prices", prices);
  return (
    <div>
      <PageHeader
        title="All items"
        subTitle="Here you can find all the items available in the game"
      />
      <HeaderFilters {...filters} />
      <div>
        <ModuleSelect
          value={upgrades.bu}
          setValue={(bu: number) => setUpgrades((prev) => ({ ...prev, bu }))}
          moduleName="Basic module"
        />
        &nbsp;
        <ModuleSelect
          value={upgrades.au}
          setValue={(au: number) => setUpgrades((prev) => ({ ...prev, au }))}
          moduleName="Advanced module"
        />
        &nbsp;
        <ModuleSelect
          value={upgrades.mu}
          setValue={(mu: number) => setUpgrades((prev) => ({ ...prev, mu }))}
          moduleName="Modern module"
        />
      </div>
      <Table dataSource={itemsWithRecipes} columns={columns} />
    </div>
  );
};
