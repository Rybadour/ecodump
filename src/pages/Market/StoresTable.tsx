import Table, {
  TableHeader,
  TableHeaderCol,
  TableBody,
} from "../../components/Table";
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
      <TableHeaderCol>Store Name</TableHeaderCol>
      <TableHeaderCol>Store Owner</TableHeaderCol>
      <TableHeaderCol>Currency</TableHeaderCol>
      <TableHeaderCol>Balance</TableHeaderCol>
      <TableHeaderCol>Offers</TableHeaderCol>
    </TableHeader>
    <TableBody>
      <For each={props.stores()}>
        {(store) => (
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <Tooltip text="Click to filter by store name">
                <button
                  class="px-2 py-1"
                  onClick={() => props.setSearch(store.Name)}
                >
                  {store.Name}
                </button>
              </Tooltip>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <Tooltip text="Click to filter by store owner">
                <button
                  class="px-2 py-1"
                  onClick={() => props.setSearch(store.Owner)}
                >
                  {store.Owner}
                </button>
              </Tooltip>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <Tooltip text="Click to filter by currency">
                <button
                  class="px-2 py-1"
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
