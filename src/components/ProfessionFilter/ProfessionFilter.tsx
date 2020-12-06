import React from "react";
import { Select } from "antd";
import { useAppContext } from "../../AppContext";
import { allProfessions } from "../../utils/typedData";

const { Option } = Select;

export default () => {
  const { filterProfessions, setFilterProfessions } = useAppContext();
  return (
    <Select
      value={filterProfessions}
      onChange={setFilterProfessions}
      mode="multiple"
      allowClear
      placeholder="Filter by profession"
      style={{ width: "80%" }}
    >
      {allProfessions.map((profession: string) => (
        <Option key={profession} value={profession}>
          {profession}
        </Option>
      ))}
    </Select>
  );
};
