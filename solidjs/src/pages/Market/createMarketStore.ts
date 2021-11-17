import { createResource } from "solid-js";
import { getStores } from "../../utils/restDbSdk";

export default () => {
  const [stores] = createResource(getStores);
  return {
    stores,
  };
};
