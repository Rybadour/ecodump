import { createMemo } from "solid-js";
import Dropdown from "../Dropdown";

type Props = {
    level: number,
    onSelectLevel: (level: number) => void;
};

export default (props: Props) => {
    let values = [];
    for (let i = 0; i < 7; ++i)
        values.push({
            value: i,
            text: "Level " + (i + 1)
        });

    return (
        <Dropdown
            value={props.level}
            values={values}
            onChange={(newValue) => props.onSelectLevel(Number(newValue))}
        />
    );
};
