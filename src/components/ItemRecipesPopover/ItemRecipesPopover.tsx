import { Button, Popover } from "antd";
import React, { useState } from "react";
import { allItems, Item } from "../../utils/typedData";
import RecipePopup from "../RecipePopup";
import { CloseOutlined } from "@ant-design/icons";
type PropTypes = {
  itemName: string;
};
export default ({ itemName }: PropTypes) => {
  const [visible, setVisible] = useState(false);
  const variants = Object.values(allItems)
    .find((item: Item) => item.key === itemName)
    ?.productInRecipes?.map((recipe) => recipe.variants)
    .flat();
  const content = (
    <>
      {variants?.map((recipeVariant) =>
        recipeVariant ? (
          <div>
            <RecipePopup
              recipe={recipeVariant}
              buttonText={recipeVariant.key}
            />
          </div>
        ) : (
          <>?</>
        )
      )}
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
      <Button type="link">{itemName}</Button>
    </Popover>
  );
};
