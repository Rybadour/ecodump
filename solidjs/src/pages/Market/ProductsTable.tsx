import Table, {
  TableHeader,
  TableHeaderCol,
  TableBody,
} from "../../components/TableT";
import { Accessor, For } from "solid-js";
import Tooltip from "../../components/Tooltip";

type Props = {
  products: Accessor<ProductOffer[] | undefined>;
  setSearch: (search: string) => void;
  setCurrencyFilter: (currency: string) => void;
};
export default (props: Props) => (
  <Table>
    <TableHeader>
      <TableHeaderCol text="Product Name" />
      <TableHeaderCol text="Store Name" />
      <TableHeaderCol text="Store Owner" />
      <TableHeaderCol text="Quantity" />
      <TableHeaderCol text="Price" />
    </TableHeader>
    <TableBody>
      <For each={props.products()}>
        {(product) => (
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <Tooltip text="Click to filter by product name">
                <button onClick={() => props.setSearch(product.ItemName)}>
                  {product.ItemName}
                </button>
              </Tooltip>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <Tooltip text="Click to filter by store name">
                <button onClick={() => props.setSearch(product.StoreName)}>
                  {product.StoreName}
                </button>
              </Tooltip>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <Tooltip text="Click to filter by store owner">
                <button onClick={() => props.setSearch(product.StoreOwner)}>
                  {product.StoreOwner}
                </button>
              </Tooltip>
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
              {product.Buying
                ? `Buying ${product.Limit} for`
                : `Selling ${product.MaxNumWanted} for`}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {product.Price}
              &nbsp;
              <Tooltip text="Click to filter by currency">
                <button
                  onClick={() => props.setCurrencyFilter(product.CurrencyName)}
                >
                  {product.CurrencyName}
                </button>
              </Tooltip>
            </td>
          </tr>
        )}
      </For>
    </TableBody>
  </Table>
);
