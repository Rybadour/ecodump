type Props = {
  filename: string;
  updates: number;
  file: string;
};
export default (props: Props) => {
  return (
    <tr>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {props.filename}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {props.updates}
      </td>
      {/* <td class="px-6 py-4 whitespace-nowrap">
      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
        Active
      </span>
    </td> */}
      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <a href="#" class="text-indigo-600 hover:text-indigo-900">
          Download
        </a>
      </td>
    </tr>
  );
};
