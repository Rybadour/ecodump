import { Button, Popover, Tooltip } from "antd";
import React, { useState } from "react";
import { allItems, Item } from "../../utils/typedData";
import RecipePopup from "../RecipePopup";
import { CloseOutlined } from "@ant-design/icons";
import PopupWrapper from "../PopupWrapper";
type PropTypes = {
  itemName: string;
};
export default ({ itemName }: PropTypes) => {
  const [visible, setVisible] = useState(false);
  const variants =
    (
      Object.values(allItems)
        .find((item: Item) => item.key === itemName)
        ?.productInRecipes?.map((recipe) =>
          recipe.variants.map((variant) => ({
            ...variant,
            craftStation: recipe.craftStation,
            skillNeeds: recipe.skillNeeds,
          }))
        ) ?? []
    ).flat() ?? [];

  const content = (
    <>
      {variants.map((recipeVariant, index) => {
        const requirements = `${
          recipeVariant.skillNeeds?.length === 0
            ? "None"
            : `Required ${recipeVariant.skillNeeds?.[0].skill} lvl ${recipeVariant.skillNeeds?.[0].level}`
        } @ ${recipeVariant.craftStation ?? "None"}`;
        return (
          <div key={recipeVariant.key}>
            <PopupWrapper
              popupTitle={`Recipe ${recipeVariant.name}`}
              buttonText={recipeVariant.key}
              buttonTooltip={`Click to calculate the item price using the recipe ${recipeVariant.key} in a popover`}
            >
              <RecipePopup description={requirements} recipe={recipeVariant} />
            </PopupWrapper>

            {!(variants && variants.length === 1) && `(${requirements})`}
          </div>
        );
      })}
    </>
  );
  if (!variants || variants.length === 0) {
    return <>{itemName}</>;
  }
  if (variants && variants.length === 1) {
    return content;
  }
  return (
    <Popover
      onVisibleChange={(vis) => setVisible(vis)}
      visible={visible}
      placement="bottom"
      content={content}
      title={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>Recipes</h3>
          <Button
            onClick={() => setVisible(false)}
            type="link"
            icon={<CloseOutlined />}
          />
        </div>
      }
      style={{ cursor: "pointer" }}
      trigger="click"
    >
      <Tooltip title="Show recipes for this item">
        <Button type="link">{itemName}</Button>
      </Tooltip>
    </Popover>
  );
};
