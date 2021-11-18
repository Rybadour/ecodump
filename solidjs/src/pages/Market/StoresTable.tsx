import Table, {
  TableHeader,
  TableHeaderCol,
  TableBody,
} from "../../components/table";
import { Accessor, For } from "solid-js";
import Tooltip from "../../components/Tooltip";

type Props = {
  stores: Accessor<Stores[]>;
  setSearch: (search: string) => void;
  setCurrencyFilter: (currency: string) => void;
};
export default (props: Props) => (
  <Table>
    <TableHeader>
      <TableHeaderCol text="Store Name" />
      <TableHeaderCol text="Store Owner" />
      <TableHeaderCol text="Currency" />
      <TableHeaderCol text="Balance" />
      <TableHeaderCol text="Offers" />
    </TableHeader>
    <TableBody>
      <For each={props.stores()}>
        {(store) => (
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <Tooltip text="Click to filter by store name">
                <button onClick={() => props.setSearch(store.Name)}>
                  {store.Name}
                </button>
              </Tooltip>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <Tooltip text="Click to filter by store owner">
                <button onClick={() => props.setSearch(store.Owner)}>
                  {store.Owner}
                </button>
              </Tooltip>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <Tooltip text="Click to filter by currency">
                <button
                  onClick={() => props.setCurrencyFilter(store.CurrencyName)}
                >
                  {store.CurrencyName}
                </button>
              </Tooltip>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {store.Balance}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {store.AllOffers.length}
            </td>
          </tr>
        )}
      </For>
    </TableBody>
  </Table>
);
