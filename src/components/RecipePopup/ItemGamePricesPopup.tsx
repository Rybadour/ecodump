import React, { useState } from "react";
import { Button, Popover, Table, Tooltip } from "antd";
import { CloseOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { GamePrice } from "../../types";
import { getColumn } from "../../utils/helpers";
import { useAppContext } from "../../AppContext";
import { formatNumber } from "../../utils/typedData";

type PropTypes = {
  itemKey: string;
};
export default ({ itemKey }: PropTypes) => {
  const [visible, setVisible] = useState(false);
  const { updatePrice, gamePrices } = useAppContext();
  const itemGamePrices = gamePrices[itemKey] ?? [];

  if (!itemGamePrices) {
    return <></>;
  }

  if (itemGamePrices?.length === 0) {
    return <>NA</>;
  }

  const dataSource = (itemGamePrices ?? [])
    .sort((a, b) => {
      if (a.Buying === b.Buying) {
        return a.Quantity > b.Quantity ? -1 : 1;
      }
      return !a.Buying ? -1 : 1;
    })
    .map((t) => ({
      ...t,
      key: `${t.ItemName}-${t.store}-${t.Buying}-${t.Price}`,
    }));

  const meanValueCalc = itemGamePrices
    .filter((t) => !t.Buying)
    .reduce(
      (agg, next) => ({
        sum: agg.sum + next.Price * next.Quantity,
        count: agg.count + next.Quantity,
      }),
      { sum: 0, count: 0 } as { sum: number; count: number }
    );
  const calculatedPrice =
    meanValueCalc.count > 0
      ? formatNumber(meanValueCalc.sum / meanValueCalc.count)
      : undefined;

  return (
    <>
      {calculatedPrice !== undefined ? (
        <Tooltip
          title={`Fix this calculated value as your price for ${itemKey}`}
        >
          <Button
            type="primary"
            onClick={() => updatePrice(itemKey, calculatedPrice)}
          >
            {calculatedPrice}
          </Button>
        </Tooltip>
      ) : (
        "?"
      )}

      <Popover
        onVisibleChange={(vis) => setVisible(vis)}
        visible={visible}
        placement="bottom"
        content={
          <Table
            dataSource={dataSource}
            columns={[
              getColumn("store"),
              getColumn("storeOwner", "Store owner"),
              {
                ...getColumn("Price"),
                render: (price: number | undefined, gamePrice: GamePrice) => {
                  return price === undefined ? (
                    <></>
                  ) : (
                    <Tooltip
                      title={`Fix this value as the price for ${gamePrice.ItemName}`}
                    >
                      <Button
                        type="primary"
                        onClick={() => updatePrice(gamePrice.ItemName, price)}
                      >
                        {price}
                      </Button>
                    </Tooltip>
                  );
                },
              },
              getColumn("Quantity"),
              {
                ...getColumn("Buying"),
                render: (buying: boolean) =>
                  buying ? "buy order" : "sell order",
              },
            ]}
          />
        }
        title={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>Game prices for {itemGamePrices?.[0].ItemName}</h3>
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
        <Tooltip
          title={`This is a calculated mean price for ${itemGamePrices?.[0].ItemName} (only sell orders are taken into account). Click to check all available prices fetched from ingame. `}
        >
          <Button type="link">
            <QuestionCircleOutlined />
          </Button>
        </Tooltip>
      </Popover>
    </>
  );
};
