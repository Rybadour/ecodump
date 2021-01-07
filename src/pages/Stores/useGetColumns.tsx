import React from "react";
import { getColumn } from "../../utils/helpers";
import StorePricesPopup from "./StorePricesPopup";

export const useGetColumns = () => {
  return [
    getColumn("Name"),
    getColumn("Owner"),
    getColumn("CurrencyName", "Currency name"),
    getColumn("Balance"),
    {
      ...getColumn("AllOffers", "Buy & Sell orders"),
      render: (allOffers: OffersV1[], store: StoresV1) => (
        <StorePricesPopup
          allOffers={allOffers}
          popupTitle={`Orders for store ${store.Name}`}
        />
      ),
    },
  ];
};
