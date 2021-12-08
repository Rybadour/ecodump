import Dropdown from "../../../components/Dropdown";
import { sortByTextFn } from "../../../utils/helpers";

type Props = {
  selectedValue: string;
  recipeVariants: RecipeVariant[];
  setSelected: (selected: string) => void;
};

export default (props: Props) => {
  return (
    <>
      {(props.recipeVariants?.length ?? 0) === 1 && (
        <span class="border rounded px-2 py-1 mx-2 font-normal">
          {props.recipeVariants?.[0].Recipe.Untranslated}
        </span>
      )}
      {(props.recipeVariants?.length ?? 0) > 1 && (
        <div class="inline-block mx-2">
          <Dropdown
            value={props.selectedValue}
            values={[
              { value: "", text: "No recipe" },
              ...(
                props.recipeVariants?.map((t) => ({
                  text: t.Variant.Name,
                  value: t.Variant.Key,
                })) ?? []
              ).sort(sortByTextFn((t) => t.text)),
            ]}
            onChange={(newValue) => props.setSelected(`${newValue}`)}
          />
        </div>
      )}
    </>
  );
};
