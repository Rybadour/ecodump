import classNames from "classnames";
import styles from "./Tooltip.module.css";
type Props = {
  text: string;
  children: any;
};
export default (props: Props) => (
  <div class={styles.hasTooltip}>
    <div
      role="tooltip"
      class={classNames(
        styles.tooltip,
        "absolute z-10 inline-block bg-gray-900 font-medium shadow-sm text-white py-2 px-3 text-sm rounded-lg"
      )}
    >
      {props.text}
    </div>
    {props.children}
  </div>
);
