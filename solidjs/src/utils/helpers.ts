const removeTagsRegex = /(<([^>]+)>)/gi;
export const removeXmlTags = (name: string) =>
  name.replace(removeTagsRegex, "");
