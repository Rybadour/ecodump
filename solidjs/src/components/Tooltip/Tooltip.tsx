import type { JSXElement } from "solid-js";
import classNames from "classnames";
import styles from "./Tooltip.module.css";
type Props = {
  text: string;
  children: JSXElement;
};
export default (props: Props) => (
  <div class={styles.hasTooltip}>
    <div
      role="tooltip"
      class={classNames(
        styles.tooltip,
        "absolute z-15 inline-block bg-gray-900 font-medium shadow-sm text-white py-2 px-3 text-sm rounded-lg"
      )}
    >
      {props.text}
    </div>
    {props.children}
  </div>
);
