type Props = {
  children: any;
};
export default (props: Props) => (
  <tbody class="bg-white divide-y divide-gray-200">{props.children}</tbody>
);
