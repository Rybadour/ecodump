import { Slider, InputNumber, Tooltip } from "antd";
import React from "react";
import { useAppContext } from "../../AppContext";
import { InfoCircleOutlined } from "@ant-design/icons";

type PropTypes = {
  recipeName: string;
};
export default ({ recipeName }: PropTypes) => {
  const { getRecipeMargin, updateRecipeMargin } = useAppContext();

  return (
    <div style={{paddingBottom: "8px", display: 'flex', alignItems: 'center'}}>
      <span>Recipe margin: </span>&nbsp;
        <InputNumber
        min={0}
        max={25}
        value={getRecipeMargin(recipeName)}
        onChange={(value) => updateRecipeMargin(recipeName, Number(value))}
        style={{width: '60px'}}
      />&nbsp;%&nbsp;
      <Tooltip title="Use this to add a profit margin to your prices. It's recomended you use lower margins like 5% on items that are sold a lot (ex: food, iron bars, building mats, etc) and higher margins like 20% on one time purchases (ex: cars, craft tables, etc).">
        <InfoCircleOutlined />
      </Tooltip>
      <Slider
          min={0}
          max={25}
          value={getRecipeMargin(recipeName)}
          onChange={(value: number) => updateRecipeMargin(recipeName, value)}
          style={{width: '400px', marginLeft: '20px'}}
        />
    </div>
  );
};
