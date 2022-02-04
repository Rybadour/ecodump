import RadioToggle from "../RadioToggle";

type Props = {
  module: number,
  onChange: (module: number) => void,
};

export default (props: Props) => (
  <RadioToggle
    options={Array.from(new Array(6)).map((_, i) => ({
      text: `M${i}`,
      value: i,
    }))}
    onChange={(selected: string | number) =>
      props.onChange(Number(selected))
    }
    selected={props.module}
  />
);