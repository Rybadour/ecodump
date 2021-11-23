import { For } from "solid-js";
import createPriceCalculatorStore from "./createPriceCalculatorStore";
import GamePricesModal from "../../components/GamePricesModal";
import ListProductsView from "./ListProductsView";
import CalculatePriceView from "./CalculatePriceView";

export default () => {
  const { state, update, paginatedProducts, totalPages } =
    createPriceCalculatorStore();

  return (
    <>
      {!state.calculatePriceForProduct && (
        <ListProductsView
          state={state}
          stateUpdate={update}
          paginatedProducts={paginatedProducts}
          totalPages={totalPages}
        />
      )}
      {state.showPricesForProductModal && (
        <GamePricesModal
          productName={state.showPricesForProductModal}
          onClose={() => update.showPricesForProductModal(undefined)}
        />
      )}
      {!!state.calculatePriceForProduct && (
        <CalculatePriceView
          calculatePriceForProduct={state.calculatePriceForProduct}
          onClose={() => update.calculatePriceForProduct(undefined)}
          showPricesForProductModal={update.showPricesForProductModal}
        />
      )}
    </>
  );
};
