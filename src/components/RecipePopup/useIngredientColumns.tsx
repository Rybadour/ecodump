import { InputNumber, Tooltip } from "antd";
import React from "react";
import { useAppContext } from "../../AppContext";
import { getColumn } from "../../utils/helpers";
import ItemRecipesPopover from "../ItemRecipesPopover";
import TagItemsPopover from "../TagItemsPopover";
import ItemGamePricesPopup from "../ItemGamePricesPopup";
import TagGamePricesPopover from "../TagGamePricesPopover";
import { ItemTypes } from "../../utils/constants";

type Ing = {
  name: string;
  ammountM0?: number;
  ammountM1?: number;
  ammountM2?: number;
  ammountM3?: number;
  ammountM4?: number;
  ammountM5?: number;
  priceM0?: number;
  priceM1?: number;
  priceM2?: number;
  priceM3?: number;
  priceM4?: number;
  priceM5?: number;
};
const renderPrice = (
  moduleLevel: number,
  itemName: string,
  currencySymbol: string,
  ammount?: number,
  price?: number
) => {
  const module =
    moduleLevel === 0 ? "no module" : `a module level ${moduleLevel}`;
  if (!ammount) {
    // This is for the cost row
    return (
      <Tooltip
        title={`Sum of all the item costs for this recipe using ${module}`}
      >
        {price} {currencySymbol}
      </Tooltip>
    );
  }
  return (
    <Tooltip
      title={`Using ${module} you will need ${ammount} ${itemName}. ${
        !price
          ? ""
          : `At current price that will cost you ${price} ${currencySymbol}`
      }`}
    >
      {ammount} {price ? `(${price}${currencySymbol})` : ""}
    </Tooltip>
  );
};

export default () => {
  const { updatePrice, currencySymbol } = useAppContext();
  return [
    {
      ...getColumn("name"),
      render: (name: string, item: { tag: ItemTypes }) => {
        switch (item.tag) {
          case ItemTypes.TAG:
            return <TagItemsPopover tag={name} />;
          case ItemTypes.ITEM:
            return <ItemRecipesPopover itemName={name} />;
          default:
            return <>{name}</>;
        }
      },
    },
    {
      ...getColumn("gamePrices", "Game prices"),
      render: (_: unknown, item: { tag: ItemTypes; name: string }) => {
        switch (item.tag) {
          case ItemTypes.TAG:
            return <TagGamePricesPopover tag={item.name} />;
          case ItemTypes.ITEM:
            return <ItemGamePricesPopup itemKey={item.name} />;
          default:
            return null;
        }
      },
    },
    {
      ...getColumn("price"),
      render: (
        price: number | undefined,
        item: { tag: ItemTypes; name: string }
      ) => {
        if (item.tag === ItemTypes.COST) return;
        return (
          <Tooltip title="Update your fixed price for this item">
            <InputNumber
              value={price}
              width="20"
              onChange={(newPrice) => updatePrice(item.name, Number(newPrice))}
            />
          </Tooltip>
        );
      },
    },
    {
      ...getColumn("M0"),
      render: (_: any, item: Ing) =>
        renderPrice(0, item.name, currencySymbol, item.ammountM0, item.priceM0),
    },
    {
      ...getColumn("M1"),
      render: (_: any, item: Ing) =>
        renderPrice(1, item.name, currencySymbol, item.ammountM1, item.priceM1),
    },
    {
      ...getColumn("M2"),
      render: (_: any, item: Ing) =>
        renderPrice(2, item.name, currencySymbol, item.ammountM2, item.priceM2),
    },
    {
      ...getColumn("M3"),
      render: (_: any, item: Ing) =>
        renderPrice(3, item.name, currencySymbol, item.ammountM3, item.priceM3),
    },
    {
      ...getColumn("M4"),
      render: (_: any, item: Ing) =>
        renderPrice(4, item.name, currencySymbol, item.ammountM4, item.priceM4),
    },
    {
      ...getColumn("M5"),
      render: (_: any, item: Ing) =>
        renderPrice(5, item.name, currencySymbol, item.ammountM5, item.priceM5),
    },
  ];
};
