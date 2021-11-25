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
      {state.showPricesForProductsModal && (
        <GamePricesModal
          name={state.showPricesForProductsModal.name}
          isSpecificProduct={state.showPricesForProductsModal.isSpecificProduct}
          onClose={() => update.hidePricesForProductsModal()}
        />
      )}
      {!!state.calculatePriceForProduct && (
        <CalculatePriceView
          calculatePriceForProduct={state.calculatePriceForProduct}
          onClose={() => update.calculatePriceForProduct(undefined)}
          showPricesForProductsModal={update.showPricesForProductsModal}
        />
      )}
    </>
  );
};
