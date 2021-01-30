import { Table } from "antd";
import React, { useMemo } from "react";
import { useAppContext } from "../../AppContext";
import { filterUnique } from "../../utils/helpers";
import { useGetColumns } from "./useGetColumns";

export default () => {
  const { storesDb } = useAppContext();
  console.log("storesDb", storesDb);
  const currencyNames = useMemo(
    () => [
      ...storesDb.Stores.map((t) => t.CurrencyName)
        .filter(filterUnique)
        .filter((t) => t.indexOf("Credit") <= 0),
      "Credit",
    ],
    [storesDb.Stores]
  );
  const ownerNames = useMemo(
    () => storesDb.Stores.map((t) => t.Owner).filter(filterUnique),
    [storesDb.Stores]
  );
  const columns = useGetColumns(currencyNames, ownerNames);
  return (
    <>
      <p>
        Last exported on <b>{storesDb.ExportedAt}</b> GMT
      </p>
      <br />
      <Table
        dataSource={storesDb.Stores.sort((a, b) =>
          a.Balance > b.Balance ? -1 : 1
        ).map((t, i) => ({
          ...t,
          key: `${t.Name}_${i}`,
        }))}
        columns={columns}
      />
    </>
  );
};
