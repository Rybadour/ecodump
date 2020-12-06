import { Button, Popover } from "antd";
import React from "react";
import { allItems, Item } from "../../utils/typedData";
import RecipePopup from "../RecipePopup";
type PropTypes = {
  itemName: string;
};
export default ({ itemName }: PropTypes) => {
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
      placement="bottom"
      content={content}
      title="Recipes"
      style={{ cursor: "pointer" }}
    >
      <Button type="link">{itemName}</Button>
    </Popover>
  );
};
