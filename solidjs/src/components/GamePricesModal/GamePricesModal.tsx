import { createMemo, createSignal, For } from "solid-js";
import { useMainContext } from "../../hooks/MainContext";
import {
  calcTotalPages,
  filterByTextEqual,
  paginateArray,
} from "../../utils/helpers";
import Table, {
  TableHeader,
  TableHeaderCol,
  TableBody,
} from "../../components/Table";
import Modal from "../Modal";
import ModalHeader from "../Modal/ModalHeader";
import Pagination from "../Pagination";
import Tooltip from "../Tooltip";
type Props = {
  onClose: () => void;
  productName: string;
};
const pageSize = 10;

export default (props: Props) => {
  const { allProductsInStores, mainState } = useMainContext();
  const [currentPage, setCurrentPage] = createSignal(1);
  const filteredProducts = createMemo(() =>
    allProductsInStores()
      ?.filter(
        (product) =>
          filterByTextEqual(props.productName, product.ItemName) &&
          (!mainState.currency || product.CurrencyName === mainState.currency)
      )
      .sort((a, b) => a.Price - b.Price)
  );
  const paginatedProducts = createMemo(() =>
    paginateArray(currentPage(), pageSize, filteredProducts())
  );
  const totalPages = createMemo(() =>
    calcTotalPages(pageSize, filteredProducts())
  );
  return (
    <Modal onClose={props.onClose}>
      <div class="sm:flex sm:items-start">
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <ModalHeader>
            Ingame prices for product {props.productName}
          </ModalHeader>
          <div class="mt-2">
            <Table>
              <TableHeader>
                <TableHeaderCol text="Product Name" />
                <TableHeaderCol text="Store Name" />
                <TableHeaderCol text="Store Owner" />
                <TableHeaderCol text="Quantity" />
                <TableHeaderCol text="Price" />
              </TableHeader>
              <TableBody>
                <For each={paginatedProducts()}>
                  {(product) => (
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.ItemName}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.StoreName}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.StoreOwner}
                      </td>

                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {product.Buying
                          ? `Buying ${product.Limit} for`
                          : `Selling ${product.MaxNumWanted} for`}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {`${product.Price} ${product.CurrencyName}`}
                        {/* TODO: <Tooltip text="Click to set your personal price">
                          <button
                            onClick={() =>
                              props.setCurrencyFilter?.(product.CurrencyName)
                            }
                          >
                            {`${product.Price} ${product.CurrencyName}`}
                          </button>
                        </Tooltip> */}
                      </td>
                    </tr>
                  )}
                </For>
              </TableBody>
            </Table>
            <Pagination
              currentPage={currentPage()}
              totalPages={totalPages()}
              onChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
