import React, { useEffect, useMemo, useState } from "react";
import { Table, Select, Input, Popover, Button, PageHeader } from "antd";
import useRestDb, { DbContent } from "../../context/useRestDb";
import { RecipesFile } from "../../types";
import {
  filterByIncludes,
  filterUnique,
  fiterByText,
} from "../../utils/helpers";
import VariantsPopupContent from "./VariantsPopupContent";

const { Option } = Select;

type Item = {
  key: string;
  name: string;
  profession: string;
  numberOfProfessions: number;
  craftStation: string;
  numberOfCraftStations: number;
  numberOfVariants: number;
  variants: string[];
  ingredients: string[][];
  products: string[][];
};
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

const getRecipes = (file: DbContent<unknown>): Item[] => {
  if (!file.isReady) return [];

  const recipesFile = file?.result as RecipesFile;
  return Object.values(recipesFile.recipes).map((t) => ({
    key: t.defaultVariant,
    name: t.defaultVariant,
    profession: t.skillNeeds?.[0]?.[0],
    numberOfProfessions: t.skillNeeds.length,
    craftStation: t.craftStn[0],
    numberOfCraftStations: t.craftStn.length,
    numberOfVariants: Number(t.numberOfVariants),
    variants: Object.keys(t.variants),
    ingredients: t.variants[t.defaultVariant]?.ingredients,
    products: t.variants[t.defaultVariant]?.products,
    price: "?",
  }));
};

export default () => {
  const [professions, setProfessions] = useState<string[]>([]);
  const [filterProfession, setFilterProfession] = useState<string[]>([]);
  const [craftStations, setCraftStations] = useState<string[]>([]);
  const [filterCraftStations, setFilterCraftStations] = useState<string[]>([]);
  const [filterName, setFilterName] = useState<string>("");
  const { jsonFiles } = useRestDb();
  const jsonRecipes = jsonFiles["crafting recipes"];
  const recipes = useMemo(() => getRecipes(jsonRecipes), [jsonRecipes]);
  useEffect(() => {
    setProfessions(
      recipes
        .map((t) => t.profession)
        .filter(filterUnique)
        .sort()
    );
    setCraftStations(
      recipes
        .map((t) => t.craftStation)
        .filter(filterUnique)
        .sort()
    );
  }, [recipes]);

  const dataSource = useMemo(() => {
    return recipes.filter(
      (t) =>
        fiterByText(filterName, t.name) &&
        filterByIncludes(filterProfession, t.profession) &&
        filterByIncludes(filterCraftStations, t.craftStation)
    );
  }, [recipes, filterName, filterProfession, filterCraftStations]);

  // console.log('jsonRecipes', jsonRecipes)
  console.log(
    "dataSource",
    dataSource.filter((t) => t.ingredients.some((tt) => tt[0] !== "ITEM"))
  );

  return (
    <div>
      <PageHeader
        title="All recipes"
        subTitle="Here you can find all the crafting recipes available in the game"
      />
      <Input
        value={filterName}
        onChange={(evt) => setFilterName(evt.target.value)}
        placeholder="Filter by name"
        style={{ width: "80%", textAlign: "center" }}
      />
      <Select
        onChange={(value: string) => setFilterProfession(`${value}`.split(","))}
        mode="multiple"
        allowClear
        placeholder="Filter by profession"
        style={{ width: "80%" }}
      >
        {professions.map((profession: string) => (
          <Option key={profession} value={profession}>
            {profession}
          </Option>
        ))}
      </Select>
      <Select
        onChange={(value: string) =>
          setFilterCraftStations(`${value}`.split(","))
        }
        mode="multiple"
        allowClear
        placeholder="Filter by crafting station"
        style={{ width: "80%" }}
      >
        {craftStations.map((craftStation: string) => (
          <Option key={craftStation} value={craftStation}>
            {craftStation}
          </Option>
        ))}
      </Select>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
};
