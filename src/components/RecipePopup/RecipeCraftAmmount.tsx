import { Radio, Tooltip } from "antd";
import React from "react";
import { useAppContext } from "../../AppContext";
import { InfoCircleOutlined } from "@ant-design/icons";

type PropTypes = {
  recipeName: string;
};
export default ({ recipeName }: PropTypes) => {
  const { getRecipeCraftAmmount, updateRecipeCraftAmmount } = useAppContext();

  return (
    <div>
      <span>Craft ammount:</span> &nbsp;
      <Radio.Group
        value={getRecipeCraftAmmount(recipeName).toFixed(0)}
        onChange={(e) =>
          updateRecipeCraftAmmount(recipeName, Number(e.target.value))
        }
      >
        <Radio.Button value="1" type="primary">
          1
        </Radio.Button>
        <Radio.Button value="10">10</Radio.Button>
        <Radio.Button value="100">100</Radio.Button>
      </Radio.Group>
      &nbsp;
      <Tooltip title="This is used to round up (or not) the recipe ingredients. When crafting just one item the module reductions are rounded up to the nearest integer.">
        <InfoCircleOutlined />
      </Tooltip>
    </div>
  );
};
