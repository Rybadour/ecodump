import { Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import type { JSXElement } from "solid-js";
import { Portal } from "solid-js/web";

export type CardinalPoint = "NE" | "SE" | "SW" | "NW";
const defaultOrigin = "SW" as CardinalPoint;
const defaultDirection = "SE" as CardinalPoint;
type Props = {
  children: JSXElement;
  isMenuOpen: Accessor<boolean>;
  renderMenu: () => JSXElement;
  origin?: CardinalPoint;
  direction?: CardinalPoint;
};

const getOrigin = (
  coordinate: CardinalPoint,
  top: number,
  bottom: number,
  left: number,
  right: number
): { x: number; y: number } => {
  switch (coordinate) {
    case "NE":
      return { x: right, y: top };
    case "NW":
      return { x: left, y: top };
    case "SE":
      return { x: right, y: bottom };
    case "SW":
      return { x: left, y: bottom };
  }
};

const getShift = (coordinate: CardinalPoint): { x: string; y: string } => {
  switch (coordinate) {
    case "NE":
      return { x: "0px", y: "-100%" };
    case "NW":
      return { x: "-100%", y: "-100%" };
    case "SE":
      return { x: "0px", y: "0px" };
    case "SW":
      return { x: "-100%", y: "0px" };
  }
};

export default (props: Props) => {
  let el: any;
  const [menuPosition, setMenuPosition] = createSignal({
    left: "0px",
    top: "0px",
  });
  const updateMenuPosition = () => {
    const pos = el.getBoundingClientRect();

    const origin = getOrigin(
      props.origin ?? defaultOrigin,
      pos.top,
      pos.top + pos.height,
      pos.left,
      pos.left + pos.width
    );
    const shift = getShift(props.direction ?? defaultDirection);

    setMenuPosition({
      left: `${origin.x}px`,
      top: `${origin.y + document.documentElement.scrollTop}px`,
      transform: `translate3d(${shift.x}, ${shift.y}, 0)`,
    });
  };
  createEffect(() => {
    if (props.isMenuOpen()) {
      window.addEventListener("scroll", updateMenuPosition);
      window.addEventListener("resize", updateMenuPosition);
      updateMenuPosition();
    } else {
      window.removeEventListener("scroll", updateMenuPosition);
      window.removeEventListener("resize", updateMenuPosition);
    }
  });
  onCleanup(() => {
    window.removeEventListener("scroll", updateMenuPosition);
    window.removeEventListener("resize", updateMenuPosition);
  });
  return (
    <div ref={el}>
      {props.children}
      <Portal>
        <div class="absolute" style={menuPosition()}>
          {props.renderMenu()}
        </div>
      </Portal>
    </div>
  );
};
