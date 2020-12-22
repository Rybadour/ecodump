import React, { useState } from "react";
import { Button, Popover, Table } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { Currency, ItemPrice } from "../../types";
import { useGetPriceColumns } from "./useGetPriceColumns";

type PropTypes = {
  itemPrices: ItemPrice[];
  currency: Currency;
};
export default ({ itemPrices, currency }: PropTypes) => {
  const [visible, setVisible] = useState(false);
  const getPricePopoverColumns = useGetPriceColumns();
  return (
    <>
      There are
      <Popover
        onVisibleChange={(vis) => setVisible(vis)}
        visible={visible}
        placement="bottom"
        content={
          <Table
            dataSource={itemPrices.map((t) => ({ ...t, key: t.itemName }))}
            columns={getPricePopoverColumns(currency)}
          />
        }
        title={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>My fixed prices for currency {currency.name}</h3>
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
        <Button type="link">{itemPrices?.length ?? 0}</Button>
      </Popover>
      prices set
    </>
  );
};
