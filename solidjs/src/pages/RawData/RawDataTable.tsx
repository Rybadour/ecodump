import { createEffect, createMemo, For } from "solid-js";
import Table, {
  TableHeader,
  TableHeaderCol,
  TableHeaderColAction,
  TableBody,
} from "../../components/table";
import createDBsStore from "../../util/createDBsStore";
import RawDataRow from "./RawDataRow";

export default () => {
  const { dbs } = createDBsStore();
  // const dbNames = createMemo(() => {
  //   return;
  //   if (dbs.loading || dbs() == null) return [];
  //   const dbUpdates = dbs() ?? {};
  //   return Object.keys(dbUpdates);
  // });
  // const dbNames =  ? Object.keys(dbs()) : [];
  createEffect(() => console.log("eff", dbs()));
  createEffect(() => console.log("eff2", Object.keys(dbs() ?? {}).join(" ")));
  return (
    <Table>
      <TableHeader>
        <TableHeaderCol text="FileName" />
        <TableHeaderCol text="Updates" />
        <TableHeaderColAction text="Download" />
      </TableHeader>
      <TableBody>
        <For each={Object.keys(dbs() ?? {})}>
          {(dbname) => (
            <RawDataRow
              filename={dbname}
              updates={(dbs() ?? {})[dbname]}
              file="asdasd"
            />
          )}
        </For>
      </TableBody>
    </Table>
  );
};
