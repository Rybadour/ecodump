import { createSignal, JSXElement, onCleanup, onMount } from "solid-js";
import styles from "./Tooltip.module.css";
import PortalMenuPosition, {
  CardinalPoint,
} from "../PortalMenuPosition/PortalMenuPosition";
type Props = {
  text: string;
  children: JSXElement;
  origin?: CardinalPoint;
  direction?: CardinalPoint;
};
export default (props: Props) => {
  let el: any;
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);
  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);
  onMount(() => {
    el?.addEventListener("mouseenter", openMenu, false);
    el?.addEventListener("mouseleave", closeMenu, false);
  });
  onCleanup(() => {
    el?.removeEventListener("mouseenter", openMenu);
    el?.removeEventListener("mouseleave", closeMenu);
  });
  return (
    <PortalMenuPosition
      isMenuOpen={isMenuOpen}
      renderMenu={() => (
        <>
          <div class="mb-1 inline-block bg-gray-900 font-medium shadow-sm text-white py-2 px-3 text-sm rounded-lg">
            {props.text}
          </div>
        </>
      )}
      origin={props.origin ?? "N"}
      direction={props.direction ?? "N"}
      class="z-50"
    >
      <div class="inline-block relative" ref={el}>
        <div class="border rounded border-dashed border-gray-200 hover:border-gray-500 inline-block">
          {props.children}
        </div>
        {isMenuOpen() && <div class={styles.tooltipArrow}></div>}
      </div>
    </PortalMenuPosition>
  );
};
