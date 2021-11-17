import { For } from "solid-js";
import Table, {
  TableHeader,
  TableHeaderCol,
  TableHeaderColAction,
  TableBody,
} from "../../components/table";
import createDBsStore from "../../utils/createDBsStore";
import RawDataRow from "./RawDataRow";

export default () => {
  const { dbs, downloadFile } = createDBsStore();
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
              downloadFile={downloadFile}
            />
          )}
        </For>
      </TableBody>
    </Table>
  );
};
