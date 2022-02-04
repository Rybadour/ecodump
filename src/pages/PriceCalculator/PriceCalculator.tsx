import GamePricesModal from "../../components/GamePricesModal";
import ListProductsView from "./ListProductsView";
import CalculatePriceView from "./CalculatePriceView/CalculatePriceView";
import { CalcContextProvider } from "./context/CalcContext";
import { MassCalcContextProvider } from "./context/MassCalcContext";
import MassCalculateView from "./MassCalculateView/MassCalculateView";

export default () => {
  return (
    <CalcContextProvider>
      <ListProductsView />
      <GamePricesModal />
      <CalculatePriceView />
      <MassCalcContextProvider>
        <MassCalculateView />
      </MassCalcContextProvider>
    </CalcContextProvider>
  );
};
