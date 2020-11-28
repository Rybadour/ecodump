import React, { Dispatch, SetStateAction } from "react";
import { Select, Input } from "antd";

const { Option } = Select;
type PropTypes = {
  professions: string[];
  craftStations: string[];
  filterProfessions: string[];
  setFilterProfessions: Dispatch<SetStateAction<string[]>>;
  filterCraftStations: string[];
  setFilterCraftStations: Dispatch<SetStateAction<string[]>>;
  filterName: string;
  setFilterName: Dispatch<SetStateAction<string>>;
};

export default ({
  professions,
  craftStations,
  filterProfessions,
  setFilterProfessions,
  filterCraftStations,
  setFilterCraftStations,
  filterName,
  setFilterName,
}: PropTypes) => {
  return (
    <>
      <Input
        value={filterName}
        onChange={(evt) => setFilterName(evt.target.value)}
        placeholder="Filter by name"
        style={{ width: "80%", textAlign: "center" }}
      />
      <Select
        value={filterProfessions}
        onChange={setFilterProfessions}
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
        value={filterCraftStations}
        onChange={setFilterCraftStations}
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
