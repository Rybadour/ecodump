export const filterUnique = <T>(value: T, index: number, self: T[]) => self.indexOf(value) === index;

export const filterByIncludes = (valuesToFilter: string[], value: string) => valuesToFilter.length === 0 || valuesToFilter[0].length === 0 || valuesToFilter.includes(value);

export const fiterByText = (valueFilter: string, value: string) => valueFilter.length === 0 || value.toLowerCase().indexOf(valueFilter.toLowerCase()) >= 0;