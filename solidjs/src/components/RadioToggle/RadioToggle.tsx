import classNames from "classnames";
import { For } from "solid-js";
type Props = {
  options: string[];
  onChange: (selected: string) => void;
  selected: string;
};
export default (props: Props) => (
  <div class="inline-flex shadow-sm rounded-md" role="group">
    <For each={props.options}>
      {(option, index) => (
        <button
          type="button"
          class={classNames(
            "border-gray-900 bg-transparent text-sm font-medium px-4 py-1 h-8",
            {
              ["z-10 bg-gray-900 text-white"]: option == props.selected,
              ["text-gray-900 hover:bg-gray-900 hover:text-white"]:
                option != props.selected,
              ["rounded-l-lg border"]: index() === 0,
              ["rounded-r-md border"]: index() === props.options.length - 1,
              ["border-t border-b"]:
                index() > 0 && index() < props.options.length - 1,
              ["border-l"]: index() > 1 && index() < props.options.length - 1,
            }
          )}
          onClick={() =>
            option !== props.selected ? props.onChange(option) : undefined
          }
        >
          {option}
        </button>
      )}
    </For>
  </div>
);
