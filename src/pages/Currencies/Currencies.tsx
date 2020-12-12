import React from "react";
import { PageHeader } from "antd";
import CurrenciesTable from "./CurrenciesTable";
import AddCurrencyModal from "./AddCurrencyModal";

export default () => (
  <>
    <PageHeader
      title="Currencies"
      subTitle="Here you can list your personal saved currencies. Selected one currency and set it's prices on the other tabs."
    />
    <AddCurrencyModal />
    <CurrenciesTable />
  </>
);
