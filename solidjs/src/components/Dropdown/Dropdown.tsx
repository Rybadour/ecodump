import classNames from "classnames";
import { createSignal, For } from "solid-js";

type Props = {
  value: string | number;
  values: { value: string | number; text: string }[];
  onChange: (newValue: string | number) => void;
};
export default (props: Props) => {
  const [isMenuOpen, setMenuOpen] = createSignal(false);
  return (
    <div class="relative inline-block text-left">
      <div>
        <button
          type="button"
          class="inline-flex justify-center w-full rounded-md border border-gray-300 h-8 px-2 py-1 bg-white text-sm font-small text-black hover:bg-gray-50 focus:outline-none"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {props.values.find((t) => t.value == props.value)?.text}
          <svg
            class="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* <!--
    Dropdown menu, show/hide based on menu state.

    Entering: "transition ease-out duration-100"
      From: "transform opacity-0 scale-95"
      To: "transform opacity-100 scale-100"
    Leaving: "transition ease-in duration-75"
      From: "transform opacity-100 scale-100"
      To: "transform opacity-0 scale-95"
  --> */}
      {isMenuOpen() && (
        <div
          class={classNames(
            "origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transform focus:outline-none z-50",
            {
              ["transition ease-out duration-100 opacity-100 scale-100"]:
                isMenuOpen(),
              ["transition ease-in duration-75 opacity-0 scale-95"]:
                !isMenuOpen(),
            }
          )}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabindex="-1"
        >
          <div class="py-1" role="none">
            <For each={props.values}>
              {(item) => (
                <button
                  class={classNames(
                    "block px-4 py-2 text-sm w-full text-left",
                    {
                      ["bg-gray-100 text-gray-900"]: item.value == props.value,
                      ["text-gray-700"]: item.value != props.value,
                    }
                  )}
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    props.onChange(item.value);
                  }}
                >
                  {item.text}
                </button>
              )}
            </For>
          </div>
        </div>
      )}
    </div>
  );
};
