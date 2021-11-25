import { createMemo, createSignal, For } from "solid-js";
import { useMainContext } from "../../hooks/MainContext";
import {
  calcTotalPages,
  filterByIncludesAny,
  paginateArray,
  tagPersonalPriceId,
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
  name: string;
  isSpecificProduct: boolean;
};
const pageSize = 10;

export default (props: Props) => {
  const { allProductsInStores, mainState, update, tagsResource } =
    useMainContext();
  const [currentPage, setCurrentPage] = createSignal(1);
  const productNames = createMemo(() =>
    props.isSpecificProduct ? [props.name] : tagsResource()?.[props.name] ?? []
  );
  const filteredProducts = createMemo(() =>
    allProductsInStores()
      ?.filter(
        (product) =>
          filterByIncludesAny(productNames(), [product.ItemName]) &&
          (!mainState.currency || product.CurrencyName === mainState.currency)
      )
      .sort((a, b) => {
        if (a.Buying === b.Buying) {
          return a.Price - b.Price;
        }
        return !a.Buying ? -1 : 1;
      })
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
        <div class="flex-grow mt-3 text-center sm:mt-0 sm:text-left">
          <ModalHeader>
            Ingame prices for product{productNames().length > 1 ? "s" : ""}:{" "}
            {productNames().join(", ")}
          </ModalHeader>
          <div class="mt-2">
            <Table>
              <TableHeader>
                <TableHeaderCol>Product Name</TableHeaderCol>
                <TableHeaderCol>Store Name</TableHeaderCol>
                <TableHeaderCol>Store Owner</TableHeaderCol>
                <TableHeaderCol>Quantity</TableHeaderCol>
                <TableHeaderCol>Price</TableHeaderCol>
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
                        <Tooltip text="Click to set your personal price">
                          <button
                            class="px-2 py-1"
                            onClick={() => {
                              //Updates both personal price for this product as well as tag price if !isSpecificProduct
                              update.personalPrice(
                                product.ItemName,
                                product.CurrencyName,
                                product.Price
                              );
                              if (!props.isSpecificProduct) {
                                update.personalPrice(
                                  tagPersonalPriceId(props.name),
                                  product.CurrencyName,
                                  product.Price
                                );
                              }
                            }}
                          >
                            {`${product.Price} ${product.CurrencyName}`}
                          </button>
                        </Tooltip>
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
