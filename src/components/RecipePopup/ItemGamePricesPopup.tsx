import React, { useState } from "react";
import { Button, Popover, Table, Tooltip } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { GamePrice } from "../../types";
import { getColumn } from "../../utils/helpers";
import { useAppContext } from "../../AppContext";
import { formatNumber } from "../../utils/typedData";

type PropTypes = {
  gamePrices: GamePrice[];
};
export default ({ gamePrices }: PropTypes) => {
  const [visible, setVisible] = useState(false);
  const { updatePrice } = useAppContext();
  if (!gamePrices) {
    return <></>;
  }

  if (gamePrices?.length === 0) {
    return <>NA</>;
  }

  const dataSource = (gamePrices ?? []).sort((a, b) => {
    if (a.Buying === b.Buying) {
      return a.Quantity > b.Quantity ? -1 : 1;
    }
    return !a.Buying ? -1 : 1;
  });

  const meanValueCalc = gamePrices
    .filter((t) => !t.Buying)
    .reduce(
      (agg, next) => ({
        sum: agg.sum + next.Price * next.Quantity,
        count: agg.count + next.Quantity,
      }),
      { sum: 0, count: 0 } as { sum: number; count: number }
    );

  return (
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
          <h3>Game prices for {gamePrices?.[0].ItemName}</h3>
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
        title={`This is a calculated mean price for ${gamePrices?.[0].ItemName} (only sell orders are taken into account). Click to check all available prices fetched from ingame. `}
      >
        <Button type="link">
          {meanValueCalc.count > 0
            ? formatNumber(meanValueCalc.sum / meanValueCalc.count)
            : "?"}
        </Button>
      </Tooltip>
    </Popover>
  );
};
