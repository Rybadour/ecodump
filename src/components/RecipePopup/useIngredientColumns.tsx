import { InputNumber } from "antd";
import React from "react";
import { useAppContext } from "../../AppContext";
import { getColumn } from "../../utils/helpers";
import ItemRecipesPopover from "../ItemRecipesPopover";

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
const renderPrice = (ammount?: number, price?: number) => {
  if (!ammount) {
    return price + "$";
  }
  return `${ammount} ${price ? `(${price}$)` : ""}`;
};

export default () => {
  const { updatePrice } = useAppContext();
  return [
    {
      ...getColumn("name"),
      render: (name: string, item: { tag: string }) =>
        item.tag === "COST" ? (
          <>{name}</>
        ) : (
          <ItemRecipesPopover itemName={name} />
        ),
    },
    {
      ...getColumn("price"),
      render: (
        price: number | undefined,
        item: { tag: string; name: string }
      ) => {
        if (item.tag === "COST") return;
        return (
          <>
            <InputNumber
              value={price}
              width="20"
              onChange={(newPrice) => updatePrice(item.name, Number(newPrice))}
            />
          </>
        );
      },
    },
    {
      ...getColumn("M0"),
      render: (_: any, item: Ing) => renderPrice(item.ammountM0, item.priceM0),
    },
    {
      ...getColumn("M1"),
      render: (_: any, item: Ing) => renderPrice(item.ammountM1, item.priceM1),
    },
    {
      ...getColumn("M2"),
      render: (_: any, item: Ing) => renderPrice(item.ammountM2, item.priceM2),
    },
    {
      ...getColumn("M3"),
      render: (_: any, item: Ing) => renderPrice(item.ammountM3, item.priceM3),
    },
    {
      ...getColumn("M4"),
      render: (_: any, item: Ing) => renderPrice(item.ammountM4, item.priceM4),
    },
    {
      ...getColumn("M5"),
      render: (_: any, item: Ing) => renderPrice(item.ammountM5, item.priceM5),
    },
  ];
};
