const removeTagsRegex = /(<([^>]+)>)/gi;
export const removeXmlTags = (name: string) =>
  name.replace(removeTagsRegex, "");

export const filterByText = (valueFilter: string, value: string) =>
  valueFilter.length === 0 ||
  value?.toLowerCase()?.indexOf(valueFilter?.toLowerCase()) >= 0;
