import createMarketStore from "./createMarketStore";
import LastUpdatedToolbar from "./LastUpdatedToolbar";
import StoresTable from "./StoresTable";

export default () => {
  const { stores } = createMarketStore();
  return (
    <div>
      <LastUpdatedToolbar exportedAt={stores()?.ExportedAt} />
      <StoresTable stores={stores} />
    </div>
  );
};
