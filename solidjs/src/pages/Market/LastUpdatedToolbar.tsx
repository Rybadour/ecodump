type Props = {
  exportedAt?: ExportedAt;
};
export default (props: Props) => (
  <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <span>Last exported on {props.exportedAt?.StringRepresentation} GMT</span>
  </div>
);
