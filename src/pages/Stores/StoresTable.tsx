import { Table } from "antd";
import React from "react";
import { useAppContext } from "../../AppContext";
import { useGetColumns } from "./useGetColumns";

export default () => {
  const { storesDb } = useAppContext();
  console.log("storesDb", storesDb);
  const columns = useGetColumns();
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
