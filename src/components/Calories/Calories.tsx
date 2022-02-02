import { useMainContext } from "../../hooks/MainContext";
import { formatNumber } from "../../utils/helpers";
import NumericInput from "../NumericInput";

export default () => {
    const { mainState, update } = useMainContext();
    return (
        <div class="flex gap-1">
            <NumericInput value={mainState.calorieCost} onChange={(val) => update.calorieCost(val)} />
            <div class="self-center">per 1000 calories</div>
        </div>
    );
};