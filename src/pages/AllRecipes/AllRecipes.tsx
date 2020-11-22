import React from "react";
import { Table, Popover, Button, PageHeader } from "antd";
import { Item } from "../../types";
import VariantsPopupContent from "./VariantsPopupContent";
import useRecipeHeaderFilters from "../../context/useRecipeHeaderFilters";
import HeaderFilters from "../../components/HeaderFilters";

const getColumn = (name: string, title?: string) => ({
  title:
    title !== undefined ? title : name.charAt(0).toUpperCase() + name.slice(1),
  dataIndex: name,
  key: name,
});

const columns = [
  getColumn("name"),
  getColumn("profession"),
  getColumn("craftStation", "Crafting station"),
  {
    ...getColumn("numberOfVariants", "Nr of variants"),
    render: (numberOfVariants: string, item: Item) => (
      <Popover
        placement="left"
        content={<VariantsPopupContent variants={item.variants} />}
        title="Available variants"
        style={{ cursor: "pointer" }}
      >
        <Button>{numberOfVariants}</Button>
      </Popover>
    ),
  },
];

export default () => {
  const filters = useRecipeHeaderFilters();

  return (
    <div>
      <PageHeader
        title="All recipes"
        subTitle="Here you can find all the crafting recipes available in the game"
      />
      <HeaderFilters {...filters} />
      <Table dataSource={filters.filteredRecipes} columns={columns} />
    </div>
  );
};
