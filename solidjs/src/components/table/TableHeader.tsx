type Props = {
  children: any;
};
export default (props: Props) => (
  <thead class="bg-gray-50">
    <tr>{props.children}</tr>
  </thead>
);
