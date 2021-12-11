import { createEffect, createMemo, JSXElement } from "solid-js";
import Sort from "../../svg/Sort";
import SortDown from "../../svg/SortDown";
import SortUp from "../../svg/SortUp";

export enum Direction {
  None,
  Asc,
  Desc,
}
type Props = {
  children: JSXElement;
  name?: string;
  sortTableByCol?: { col: string; dir: Direction };
  onSort?: (col: string, dir: Direction) => void;
};

const nextDirection = (dir: Direction): Direction => {
  switch (dir) {
    default:
    case Direction.None:
      return Direction.Asc;
    case Direction.Asc:
      return Direction.Desc;
    case Direction.Desc:
      return Direction.None;
  }
};

export default (props: Props) => {
  const isSortable = createMemo(
    () => props.name !== undefined && props.onSort !== undefined
  );
  const direction = createMemo(() =>
    !isSortable || props.sortTableByCol?.col !== props.name
      ? Direction.None
      : props.sortTableByCol?.dir ?? Direction.None
  );
  createEffect(() => {
    console.log(props.name, props.sortTableByCol, props.onSort);
    console.log("isSortable", isSortable());
    console.log("direction", direction());
  });
  return (
    <th
      scope="col"
      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
    >
      {!isSortable() && props.children}
      {isSortable() && (
        <button
          class="flex text-left text-xs font-medium text-gray-500 uppercase"
          onClick={() =>
            props.onSort?.(props.name ?? "", nextDirection(direction()))
          }
        >
          {props.children}
          {direction() === Direction.None && <Sort />}
          {direction() === Direction.Desc && <SortDown />}
          {direction() === Direction.Asc && <SortUp />}
        </button>
      )}
    </th>
  );
};
