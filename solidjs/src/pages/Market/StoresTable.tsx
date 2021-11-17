import Table, {
  TableHeader,
  TableHeaderCol,
  TableBody,
} from "../../components/table";
import { For, Resource } from "solid-js";

type Props = {
  stores: Resource<StoresResponse | undefined>;
};
export default (props: Props) => (
  <Table>
    <TableHeader>
      <TableHeaderCol text="Name" />
      <TableHeaderCol text="Owner" />
      <TableHeaderCol text="Currency" />
      <TableHeaderCol text="Balance" />
      <TableHeaderCol text="Offers" />
    </TableHeader>
    <TableBody>
      <For
        each={props
          .stores()
          ?.Stores?.sort((a, b) =>
            a.Name.toLowerCase().localeCompare(b.Name.toLowerCase())
          )}
      >
        {(store) => (
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {store.Name}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {store.Owner}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {store.CurrencyName}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {store.Balance}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              TODO
            </td>
          </tr>
        )}
      </For>
    </TableBody>
  </Table>
);
