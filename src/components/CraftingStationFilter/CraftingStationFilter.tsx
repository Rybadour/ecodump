import React from "react";
import { Select } from "antd";
import { allCraftStations } from "../../utils/typedData";
import { useAppContext } from "../../AppContext";

const { Option } = Select;

export default () => {
  const {
    filterWithRecipe,
    filterCraftStations,
    setFilterCraftStations,
  } = useAppContext();
  return (
    <Select
      value={filterCraftStations}
      onChange={setFilterCraftStations}
      mode="multiple"
      allowClear
      placeholder="Filter by crafting station"
      style={{ width: "80%" }}
      disabled={!filterWithRecipe}
    >
      {allCraftStations.map((craftStation: string) => (
        <Option key={craftStation} value={craftStation}>
          {craftStation}
        </Option>
      ))}
    </Select>
  );
};
