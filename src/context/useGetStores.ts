import { useMemo } from "react";
import { getStores, getStoresLastUpdate } from "../sdk/restDbSdk";
import { useQuery } from "react-query";
import { storesKey, storesLastUpdateKey } from "../utils/queryKeys";
import { GamePriceCurrencies } from "../types";
import { removeXmlTags } from "../utils/helpers";

const min2 = 1000 * 60 * 2;
const min30 = 1000 * 60 * 30;

export default () => {
  const storesLastUpdateResponse = useQuery(
    storesLastUpdateKey,
    getStoresLastUpdate,
    {
      staleTime: min2,
      cacheTime: min2,
    }
  );

  const storesDbResponse = useQuery(
    [storesKey, storesLastUpdateResponse?.data?.data?.data],
    getStores,
    {
      staleTime: min30,
      cacheTime: min30,
    }
  );

  const storesDb = storesDbResponse?.data?.data?.data;
  const fetchedGameCurrencies = useMemo(() => {
    return storesDb?.Stores.map((store) => ({
      currency: removeXmlTags(store.CurrencyName),
      items: store.AllOffers.map((offer) => ({
        ...offer,
        store: store.Name,
        storeOwner: store.Owner,
      })),
    })).reduce(
      (agg, t) => ({
        ...agg,
        [t.currency]: [...(agg[t.currency] ?? []), ...t.items],
      }),
      {} as GamePriceCurrencies
    );
  }, [storesDb]);

  return {
    storesLastUpdateResponse,
    storesDbResponse,
    fetchedGameCurrencies,
    storesDb,
  };
};
