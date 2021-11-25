import { useMainContext } from "../../hooks/MainContext";
import Tooltip from "../Tooltip";
import { calcAvgPrice } from "../../utils/helpers";
import { createEffect, createMemo } from "solid-js";

type Props = {
  name: string;
  isSpecificItem: boolean;
  showPricesForProductsModal: (Name: string, IsSpecificItem: boolean) => void;
};
export default (props: Props) => {
  const { mainState, tagsResource, allProductsInStores } = useMainContext();

  const avgPrice = createMemo(() => {
    const products = props.isSpecificItem
      ? [props.name]
      : tagsResource()?.[props.name] ?? [];
    const prodOffersInStores =
      allProductsInStores()?.filter((t) => products.includes(t.ItemName)) ?? [];
    if (prodOffersInStores.length <= 0) return { errorMessage: "no offers" };
    const offersInCurrency = !mainState.currency
      ? []
      : prodOffersInStores.filter(
          (t) => t.CurrencyName === mainState.currency
        ) ?? [];
    if (mainState.currency && offersInCurrency.length === 0)
      return { errorMessage: "no offers in currency" };

    return {
      calculatedPrice: !mainState.currency
        ? 0
        : calcAvgPrice(
            offersInCurrency
              .filter((t) => !t.Buying && t.Quantity > 0)
              ?.map((offer) => ({
                price: offer.Price,
                quantity: offer.Quantity,
              })) ?? []
          ),
    };
  });
  if (avgPrice().errorMessage) {
    return <>{avgPrice().errorMessage}</>;
  }

  return (
    <Tooltip text="Click for ingame prices. Select currency for average.">
      <button
        class="px-2 py-1"
        onClick={() =>
          props.showPricesForProductsModal(props.name, props.isSpecificItem)
        }
      >
        {!mainState.currency && "select currency"}
        {mainState.currency &&
          avgPrice() &&
          `${avgPrice().calculatedPrice} ${mainState.currency}`}
      </button>
    </Tooltip>
  );
};
