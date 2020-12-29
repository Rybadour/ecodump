import React, { useMemo } from "react";
import { Table } from "antd";
import { allItems, Item } from "../../utils/typedData";
import { useAppContext } from "../../AppContext";
import { filterByIncludes, filterByText } from "../../utils/helpers";
import { useGetColumns } from "./useGetColumns";

const getProfessionAndCraftStations = (item: Item) => {
  const variants = item.productInRecipes
    .map((recipe) => recipe.variants)
    .flat();

  if (variants.length === 0) {
    return "NA";
  }
  const professionsAndCraftStations = item.productInRecipes.map(
    ({ skillNeeds, craftStation }) =>
      `${
        skillNeeds?.length === 0
          ? "No profession"
          : `${skillNeeds?.[0].skill} lvl${skillNeeds?.[0].level}`
      } @ ${craftStation ?? "No craft station"}`
  );

  return professionsAndCraftStations.length === 0
    ? "No recipes"
    : professionsAndCraftStations.join(", ");
};

export default () => {
  const {
    selectedVariants,
    filterProfessions,
    filterCraftStations,
    filterName,
    filterWithRecipe,
  } = useAppContext();
  const columns = useGetColumns();

  const items = useMemo(
    () =>
      Object.values(allItems).map((item) => ({
        ...item,
        profAndCraftStations: getProfessionAndCraftStations(item),
      })),
    []
  );

  const datasource = useMemo(
    () =>
      items.filter((item: Item) => {
        const variants = item.productInRecipes
          .map((recipe) => recipe.variants)
          .flat();
        const selectedVariant =
          variants.length === 0
            ? undefined
            : selectedVariants[item.key] ??
              item.productInRecipes[0].defaultVariant;
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

        return filterWithRecipe
          ? filterByText(filterName, item.key) &&
              filterByIncludes(filterProfessions, firstSkill) &&
              filterByIncludes(filterCraftStations, craftStation)
          : filterByText(filterName, item.key) && variants.length === 0;
      }),
    [
      items,
      filterCraftStations,
      filterName,
      filterProfessions,
      filterWithRecipe,
      selectedVariants,
    ]
  );
  return <Table dataSource={datasource} columns={columns} />;
};
