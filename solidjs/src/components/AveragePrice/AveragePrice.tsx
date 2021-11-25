import { useMainContext } from "../../hooks/MainContext";
import Tooltip from "../Tooltip";
import { calcAvgPrice } from "../../utils/helpers";

type Props = {
  product?: CraftableProduct;
  showPricesForProductModal: (productName: string) => void;
};
export default (props: Props) => {
  const { mainState } = useMainContext();
  if (props.product == undefined) {
    return <>not found</>;
  }
  if (props.product.Offers.length <= 0) return <>no offers</>;
  const offersInCurrency = !mainState.currency
    ? []
    : props.product.Offers.filter((t) => t.CurrencyName === mainState.currency);
  if (mainState.currency && offersInCurrency.length === 0)
    return <>no offers in currency</>;

  const calculatedPrice = !mainState.currency
    ? 0
    : calcAvgPrice(
        props.product.Offers.filter(
          (t) =>
            t.CurrencyName === mainState.currency && !t.Buying && t.Quantity > 0
        ).map((offer) => ({
          price: offer.Price,
          quantity: offer.Quantity,
        }))
      );

  return (
    <Tooltip text="Click for ingame prices. Select currency for average.">
      <button
        class="px-2 py-1"
        onClick={() =>
          props.showPricesForProductModal(props.product?.Name ?? "")
        }
      >
        {!mainState.currency && "select currency"}
        {mainState.currency &&
          calculatedPrice &&
          `${calculatedPrice} ${mainState.currency}`}
      </button>
    </Tooltip>
  );
};
