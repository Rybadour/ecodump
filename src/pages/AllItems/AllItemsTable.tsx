import React, { useMemo } from "react";
import { Table } from "antd";
import { allItems, Item } from "../../utils/typedData";
import { useAppContext } from "../../AppContext";
import { filterByIncludes, filterByText } from "../../utils/helpers";
import { useGetColumns } from "./useGetColumns";

export default () => {
  const {
    selectedVariants,
    filterProfessions,
    filterCraftStations,
    filterName,
    filterWithRecipe,
  } = useAppContext();
  const columns = useGetColumns();

  const datasource = useMemo(
    () =>
      Object.values(allItems).filter((item: Item) => {
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
      filterCraftStations,
      filterName,
      filterProfessions,
      filterWithRecipe,
      selectedVariants,
    ]
  );
  return <Table dataSource={datasource} columns={columns} />;
};
