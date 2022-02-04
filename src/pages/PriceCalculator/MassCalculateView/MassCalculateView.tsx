import { For } from "solid-js";
import ModuleSelect from "../../../../react-deprecated/src/components/ModuleSelect";
import Accordion from "../../../components/Accordion/Accordion";
import AveragePrice from "../../../components/AveragePrice";
import Button from "../../../components/Button";
import Checkbox from "../../../components/Checkbox";
import Dropdown from "../../../components/Dropdown";
import Highlight from "../../../components/Highlight";
import LabeledField from "../../../components/LabeledField";
import ModuleRadioToggle from "../../../components/ModuleRadioToggle/ModuleRadioToggle";
import NumericInput from "../../../components/NumericInput";
import PersonalPrice from "../../../components/PersonalPrice";
import RadioToggle from "../../../components/RadioToggle";
import SkillLevelDropdown from "../../../components/SkillLevelDropdown/SkillLevelDropdown";
import Table, { TableBody, TableHeader, TableHeaderCol } from "../../../components/Table";
import { useMainContext } from "../../../hooks/MainContext";
import { useCalcContext } from "../context/CalcContext";
import { MassCalcContextProvider, useMassCalcContext } from "../context/MassCalcContext";

export default () => {
  const { get, update } = useMainContext();
  const { listProductsStore } = useCalcContext();
  const { massCalcStore } = useMassCalcContext();

  const cellClass = "px-3 py-2 whitespace-nowrap text-sm text-gray-500";

  return (
    <>
      {listProductsStore.state.massCalcVisible &&
        <>
          <div>
            <Button onClick={() => listProductsStore.update.hideMassCalc()}>Back</Button>
          </div>
          <Accordion
            notCollapsible
            startsOpen
            class="mt-2 gap-2"
            headerText={
              <span class="font-medium">Settings</span>
            }
          >
            <Table class="mb-3">
              <TableHeader>
                <TableHeaderCol>Profession</TableHeaderCol>
                <TableHeaderCol>Level</TableHeaderCol>
                <TableHeaderCol>Lavish</TableHeaderCol>
              </TableHeader>
              <TableBody>
                <For each={massCalcStore.professions()}>
                  {(skill) => <tr>
                    <td class={cellClass}>{skill}</td>
                    <td class={cellClass}>
                      <SkillLevelDropdown
                        level={massCalcStore.get.professionLevel(skill)}
                        onSelectLevel={(val) => {massCalcStore.update.professionLevel(skill, val)}}
                      />
                    </td>
                    <td class={cellClass}>
                      <Checkbox
                        label="Enabled"
                        checked={massCalcStore.get.professionLavish(skill)}
                        onChange={(val) => {massCalcStore.update.professionLavish(skill, val)}}
                      />
                    </td>
                  </tr>}
                </For>
              </TableBody>
            </Table>
            <Table class="mb-3">
              <TableHeader>
                <TableHeaderCol>Table</TableHeaderCol>
                <TableHeaderCol>Module</TableHeaderCol>
              </TableHeader>
              <TableBody>
                <For each={massCalcStore.tables()}>
                  {(table) => <tr>
                    <td class={cellClass}>{table}</td>
                    <td class={cellClass}>
                      <ModuleRadioToggle
                        module={massCalcStore.get.tableModule(table)}
                        onChange={(val) => {massCalcStore.update.tableModule(table, val)}}
                      />
                    </td>
                  </tr>}
                </For>
              </TableBody>
            </Table>
            <div class="flex gap-10 flex-wrap">
              <LabeledField vertical text="Profit Margin %">
                <NumericInput
                  value={5}
                  onChange={(val) => {}}
                />
              </LabeledField>
              <LabeledField vertical text="Calorie cost per 1000">
                <NumericInput
                  value={1}
                  onChange={(val) => {}}
                />
              </LabeledField>
            </div>
          </Accordion>
          <Accordion
            startsOpen
            class="mt-2"
            headerText={
              <span class="font-medium">Ingredients</span>
            }
          >
            <Table class="mb-3">
              <TableHeader>
                <TableHeaderCol>Name</TableHeaderCol>
                <TableHeaderCol>Average price</TableHeaderCol>
                <TableHeaderCol>Personal price</TableHeaderCol>
              </TableHeader>
              <TableBody>
                <For each={massCalcStore.ingredients()}>
                  {(i) => <tr>
                    <td class={cellClass}>{i.Name}</td>
                    <td class={cellClass}>
                      <AveragePrice name={i.Name} isSpecificItem={true} showPricesForProductsModal={() => {}}></AveragePrice>
                    </td>
                    <td class={cellClass}>
                      <PersonalPrice personalPriceId={i.Name} />
                    </td>
                  </tr>}
                </For>
              </TableBody>
            </Table>
          </Accordion>
          <Accordion
            notCollapsible
            startsOpen
            class="mt-2"
            headerText={
              <span class="font-medium">Products</span>
            }
          >
            <Table class="mb-3">
              <TableHeader>
                <TableHeaderCol>Name</TableHeaderCol>
                <TableHeaderCol>Production Cost</TableHeaderCol>
                <TableHeaderCol>Retail Cost</TableHeaderCol>
                <TableHeaderCol>Personal Price</TableHeaderCol>
              </TableHeader>
              <TableBody>
                <For each={massCalcStore.products()}>
                  {(prod) => <tr>
                    <td class={cellClass}>{prod.product.Name}</td>
                    <td class={cellClass}>
                      10
                    </td>
                    <td class={cellClass}>
                      10
                    </td>
                    <td class={cellClass}>
                      <PersonalPrice personalPriceId={prod.product.Name} />
                    </td>
                  </tr>}
                </For>
              </TableBody>
            </Table>
          </Accordion>
        </>
      }
    </>
  );
};
