
import { createContext, JSXElement, useContext } from "solid-js";
import createPriceCalculatorStore, {
  ListProductsStore,
} from "./createListProductsStore";
import createMassCalcStore, { MassCalcStore } from "./createMassCalcStore";

type ContextType = {
  listProductsStore: ListProductsStore;
  massCalcStore: MassCalcStore;
};

const MassCalcContext = createContext<ContextType>({} as ContextType);
export const MassCalcContextProvider = (props: { children: JSXElement }) => {
  const listProductsStore = createPriceCalculatorStore();
  const massCalcStore = createMassCalcStore();

  const value = {
    listProductsStore,
    massCalcStore,
  } as ContextType;
  return (
    <MassCalcContext.Provider value={value}>
      {props.children}
    </MassCalcContext.Provider>
  );
};

export const useMassCalcContext = () => useContext(MassCalcContext);
