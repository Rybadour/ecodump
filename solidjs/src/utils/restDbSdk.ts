import { removeXmlTags } from "./helpers";

const REACT_APP_DB = "http://176.10.152.250:3030";
const endpoints = {
  list: () => `${REACT_APP_DB}/operations/list`,
  readDB: (dbname: string, path: string = "/") =>
    `${REACT_APP_DB}/${dbname}?path=${path}`,
};

async function fetchAsync<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const result = (await response.json()) as DbResponse<T>;
  if (result == null || !result.success) {
    throw new Error("Response not successful");
  }

  return result.data;
}

export const listDBs = () => fetchAsync<Dictionary<number>>(endpoints.list());

export const readDB = (dbname: string, path: string = "/") =>
  fetchAsync(endpoints.readDB(dbname, path));

// export const getStoresLastUpdate = () =>
//   fetchAsync<DbResponse<number>>(
//     endpoints.readDB("stores", "/ExportedAt/Ticks")
//   );

export const getStores = () =>
  fetchAsync<StoresResponse>(endpoints.readDB("stores")).then((response) => ({
    ...response,
    Stores: response.Stores.map((store) => ({
      ...store,
      Name: removeXmlTags(store.Name),
    })),
  }));

// export const getRecipes = () =>
//   fetchAsync<DbResponse<RecipeV1[]>>(endpoints.readDB("recipes"));

// export const getTags = () =>
//   fetchAsync<DbResponse<Record<string, string[]>>>(endpoints.readDB("tags"));
