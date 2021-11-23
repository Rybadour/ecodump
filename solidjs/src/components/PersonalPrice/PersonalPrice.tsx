import { useMainContext } from "../../hooks/MainContext";
import NumericInput from "../NumericInput";

type Props = {
  productName: string;
};

export default (props: Props) => {
  const { mainState, personalPricesState, update } = useMainContext();
  if (!mainState.currency) return <>"select currency"</>;
  return (
    <NumericInput
      value={personalPricesState?.[props.productName]?.[mainState.currency]}
      onChange={(newValue) =>
        update.personalPrice(props.productName, mainState.currency, newValue)
      }
    />
  );
};
