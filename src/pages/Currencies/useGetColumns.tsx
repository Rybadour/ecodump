import React from "react";
import { Button, Popconfirm, Popover, Select, Table, Tooltip } from "antd";
import {
  SelectOutlined,
  DeleteOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { Currency, ItemPrice } from "../../types";
import { getColumn } from "../../utils/helpers";
import { useAppContext } from "../../AppContext";
import { useGetPriceColumns } from "./useGetPriceColumns";

export const { Option } = Select;

export const useGetColumns = () => {
  const { currencyList, setCurrencyList } = useAppContext();
  const getPopoverColumns = useGetPriceColumns();
  return [
    getColumn("name"),
    getColumn("symbol"),
    {
      ...getColumn("itemPrices", "Prices"),
      render: (itemPrices: ItemPrice[], currency: Currency) => {
        return (
          <Popover
            placement="bottom"
            content={
              <Table
                dataSource={itemPrices}
                columns={getPopoverColumns(currency)}
              />
            }
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
      render: (_: unknown, currency: Currency) =>
        currency.name === currencyList.selectedCurrency && "Selected",
    },
    {
      ...getColumn("Delete"),
      render: (_: unknown, currency: Currency) => {
        return (
          <>
            {currency.name !== currencyList.selectedCurrency && (
              <Tooltip title="Select currency">
                <Button
                  icon={<SelectOutlined />}
                  onClick={() =>
                    setCurrencyList((prev) => ({
                      ...prev,
                      selectedCurrency: currency.name,
                    }))
                  }
                />
              </Tooltip>
            )}
            {
              <Popconfirm
                title={`Are you sure to reset prices for currency ${currency.name} with ${currency.itemPrices.length} prices?`}
                onConfirm={() =>
                  setCurrencyList((prev) => {
                    const index = prev.currencies.findIndex(
                      (t) => t.name === currency.name
                    );
                    return {
                      ...prev,
                      currencies: [
                        ...prev.currencies.slice(0, index),
                        {
                          ...prev.currencies[index],
                          itemPrices: [],
                        },
                        ...prev.currencies.slice(index + 1),
                      ],
                    };
                  })
                }
                okText="Yes"
                cancelText="No"
              >
                <Tooltip title="Clear all prices">
                  <Button icon={<ClearOutlined />} />
                </Tooltip>
              </Popconfirm>
            }
            {currency.name !== currencyList.selectedCurrency && (
              <Popconfirm
                title={`Are you sure to delete currency with ${currency.itemPrices.length} prices?`}
                onConfirm={() =>
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
                okText="Yes"
                cancelText="No"
              >
                <Tooltip title="Delete">
                  <Button icon={<DeleteOutlined />} />
                </Tooltip>
              </Popconfirm>
            )}
          </>
        );
      },
    },
  ];
};
