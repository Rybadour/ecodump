import React from "react";
import { Select, Input } from "antd";
import { HeaderFilters } from "../../context/useRecipeHeaderFilters";

const { Option } = Select;

export default ({
  professions,
  setFilterProfession,
  craftStations,
  setFilterCraftStations,
  filterName,
  setFilterName,
}: HeaderFilters) => {
  return (
    <>
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
    </>
  );
};
