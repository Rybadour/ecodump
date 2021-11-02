type Props = {
  text: string;
};
export default (props: Props) => (
  <th scope="col" class="relative px-6 py-3">
    <span class="sr-only">{props.text}</span>
  </th>
);
