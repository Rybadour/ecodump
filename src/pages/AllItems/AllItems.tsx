import React, { Dispatch, SetStateAction, useMemo } from "react";
import { Table, Popover, Button, PageHeader, Select } from "antd";
import { ItemPrice } from "../../types";
import HeaderFilters from "../../components/HeaderFilters";

import { filterByIncludes, fiterByText, getColumn } from "../../utils/helpers";
import useLocalStorage from "../../context/useLocalStorage";
import {
  allCraftStations,
  allItems,
  allProfessions,
  Item,
} from "../../utils/typedData";
import RecipePopup from "../../components/RecipePopup";

const { Option } = Select;
console.log("typedData", allItems);
console.log(
  "here",
  Object.values(allItems).filter((t) =>
    t.productInRecipes.some((tt) =>
      tt.variants.some((ttt) => ttt.products.length > 2)
    )
  )
);

const updatePrice = (
  setPrices: Dispatch<SetStateAction<ItemPrice[]>>,
  itemName: string,
  newPrice: number
) => {
  if (Number.isNaN(newPrice)) return;
  setPrices((prevPrices) => {
    const index = prevPrices.findIndex((t) => t.itemName === itemName);
    return index >= 0
      ? [
          ...prevPrices.slice(0, index),
          { ...prevPrices[index], price: newPrice },
          ...prevPrices.slice(index + 1),
        ]
      : [
          ...prevPrices,
          {
            itemName: itemName,
            price: newPrice,
          },
        ];
  });
};

type SelectedVariants = { [item: string]: string };

const getColumns = (
  prices: ItemPrice[],
  setPrices: Dispatch<SetStateAction<ItemPrice[]>>,
  selectedVariants: SelectedVariants,
  setSelectedVariants: Dispatch<SetStateAction<SelectedVariants>>,
  setfilterName: Dispatch<SetStateAction<string>>
) => [
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

      const setItemPrice = (itemName: string, newPrice: number) =>
        updatePrice(setPrices, itemName, newPrice);

      return (
        <Popover
          placement="bottom"
          content={
            <RecipePopup
              recipe={variant}
              prices={prices}
              setItemPrice={setItemPrice}
              searchItem={(itemName: string) => setfilterName(itemName)}
            />
          }
          title="Recipe"
          style={{ cursor: "pointer" }}
        >
          <Button>Check recipe</Button>
        </Popover>
      );
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
            updatePrice(setPrices, item.key, Number(evt.target.value));
          }}
        />
      );
    },
  },
];

export default () => {
  const [prices, setPrices] = useLocalStorage<ItemPrice[]>("prices", []);
  const [
    selectedVariants,
    setSelectedVariants,
  ] = useLocalStorage<SelectedVariants>("selectedVariant", {});

  const [filterProfessions, setFilterProfessions] = useLocalStorage<string[]>(
    "filterProfessions",
    []
  );

  const [filterCraftStations, setFilterCraftStations] = useLocalStorage<
    string[]
  >("filterCraftStations", []);

  const [filterName, setFilterName] = useLocalStorage<string>("filter", "");

  // const [upgrades, setUpgrades] = useLocalStorage<{
  //   bu: number;
  //   au: number;
  //   mu: number;
  // }>("upgrades", { bu: 0, au: 0, mu: 0 });
  // const filters = useRecipeHeaderFilters();

  const columns = useMemo(
    () =>
      getColumns(
        prices,
        setPrices,
        selectedVariants,
        setSelectedVariants,
        setFilterName
      ),
    [prices, selectedVariants, setFilterName, setPrices, setSelectedVariants]
  );

  // const itemsWithRecipes = useMemo(
  //   () =>
  //     filters.filteredRecipes
  //       .map((recipe) =>
  //         Object.keys(recipe.variants)
  //           .map((variantKey) =>
  //             recipe.variants[variantKey].products.map((product) => ({
  //               ...recipe,
  //               key: `${recipe.key}_${product[0]}`,
  //               name: product[0],
  //               recipe: recipe.name,
  //               ingredients: recipe.variants[variantKey].ingredients,
  //               price: prices.find((t) => t.itemName === product[0])?.price,
  //             }))
  //           )
  //           .flat()
  //       )
  //       .flat(),
  //   [filters.filteredRecipes, prices]
  // );

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

  // console.log("prices", prices);
  const datasource = Object.values(allItems).filter((item: Item) => {
    const variants = item.productInRecipes
      .map((recipe) => recipe.variants)
      .flat();
    const selectedVariant =
      variants.length === 0
        ? undefined
        : selectedVariants[item.key] ?? item.productInRecipes[0].defaultVariant;
    const skillNeeds = !selectedVariant
      ? undefined
      : item.productInRecipes.find((t) =>
          t.variants.some((t) => t.key === selectedVariant)
        )?.skillNeeds;
    const firstSkill = skillNeeds?.[0]?.skill ?? "none";
    const craftStation =
      (!selectedVariant
        ? undefined
        : item.productInRecipes.find((t) =>
            t.variants.some((t) => t.key === selectedVariant)
          )?.craftStation) ?? "none";

    return (
      fiterByText(filterName, item.key) &&
      filterByIncludes(filterProfessions, firstSkill) &&
      filterByIncludes(filterCraftStations, craftStation)
    );
  });

  return (
    <div>
      <PageHeader
        title="All items"
        subTitle="Here you can find all the items and their recipes"
      />
      <HeaderFilters
        professions={allProfessions}
        craftStations={allCraftStations}
        filterProfessions={filterProfessions}
        setFilterProfessions={setFilterProfessions}
        filterCraftStations={filterCraftStations}
        setFilterCraftStations={setFilterCraftStations}
        filterName={filterName}
        setFilterName={setFilterName}
      />
      {/* <div>
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
      </div> */}
      <Table dataSource={datasource} columns={columns} />
    </div>
  );
};
