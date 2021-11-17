type Props = {
  filename: string;
  updates: number;
  downloadFile: (filename: string) => void;
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
      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          class="text-indigo-800 hover:text-indigo-900"
          onclick={() => props.downloadFile(props.filename)}
        >
          Download
        </button>
      </td>
    </tr>
  );
};
