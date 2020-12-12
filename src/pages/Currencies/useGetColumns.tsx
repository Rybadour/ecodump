import React from "react";
import { Button, Popover, Select, Table } from "antd";
import { Currency, ItemPrice } from "../../types";
import { getColumn } from "../../utils/helpers";
import { useAppContext } from "../../AppContext";

export const { Option } = Select;

const popoverColumns = [getColumn("itemName", "item"), getColumn("price")];

export const useGetColumns = () => {
  const { currencyList, setCurrencyList } = useAppContext();
  return [
    getColumn("name"),
    getColumn("symbol"),
    {
      ...getColumn("itemPrices", "Prices"),
      render: (itemPrices: ItemPrice[], currency: Currency) => {
        return (
          <Popover
            placement="bottom"
            content={<Table dataSource={itemPrices} columns={popoverColumns} />}
            title={`Prices for ${currency.name}`}
            style={{ cursor: "pointer" }}
            trigger="click"
          >
            There are <Button type="link">{itemPrices.length}</Button> prices
            set
          </Popover>
        );
      },
    },
    {
      ...getColumn("Selected"),
      render: (_: unknown, currency: Currency) => {
        return currency.name === currencyList.selectedCurrency ? (
          "Selected"
        ) : (
          <Button
            onClick={() =>
              setCurrencyList((prev) => ({
                ...prev,
                selectedCurrency: currency.name,
              }))
            }
          >
            Select
          </Button>
        );
      },
    },
    {
      ...getColumn("Delete"),
      render: (_: unknown, currency: Currency) => {
        return currency.name === currencyList.selectedCurrency ? (
          <></>
        ) : (
          <Button
            onClick={() =>
              setCurrencyList((prev) => {
                const index = prev.currencies.findIndex(
                  (t) => t.name === currency.name
                );
                return {
                  ...prev,
                  currencies: [
                    ...prev.currencies.slice(0, index),
                    ...prev.currencies.slice(index + 1),
                  ],
                };
              })
            }
          >
            Delete
          </Button>
        );
      },
    },
  ];
};
