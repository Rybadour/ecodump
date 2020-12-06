import React from "react";
import { PageHeader } from "antd";
import AllItemsTable from "./AllItemsTable";
import NameFilter from "../../components/NameFilter";
import ProfessionFilter from "../../components/ProfessionFilter";
import CraftingStationFilter from "../../components/CraftingStationFilter";

export default () => {
  console.log("Rerender");

  return (
    <div>
      <PageHeader
        title="All items"
        subTitle="Here you can find all the items and their recipes"
      />
      <NameFilter />
      <ProfessionFilter />
      <CraftingStationFilter />
      {/* <div>
        <ModuleSelect
          value={upgrades.bu}
          setValue={(bu: number) => setUpgrades((prev) => ({ ...prev, bu }))}
          moduleName="Basic module"
        />
        &nbsp;
        <ModuleSelect
          value={upgrades.au}
          setValue={(au: number) => setUpgrades((prev) => ({ ...prev, au }))}
          moduleName="Advanced module"
        />
        &nbsp;
        <ModuleSelect
          value={upgrades.mu}
          setValue={(mu: number) => setUpgrades((prev) => ({ ...prev, mu }))}
          moduleName="Modern module"
        />
      </div> */}
      <AllItemsTable />
    </div>
  );
};
