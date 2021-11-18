import { Show } from "solid-js";
import RadioToggle from "../RadioToggle";
type Props = {
  totalPages: number;
  currentPage: number;
  onChange: (page: number) => void;
};
export default (props: Props) => (
  <Show when={props.totalPages > 1}>
    <div class="flex justify-center mt-2">
      <RadioToggle
        options={Array.from(
          Array.from(new Array(Math.min(props.totalPages, 20))).map(
            (_, i) => `${i + 1}`
          )
        )}
        onChange={(selected: string) => props.onChange(Number(selected))}
        selected={`${props.currentPage}`}
      />
    </div>
  </Show>
);
