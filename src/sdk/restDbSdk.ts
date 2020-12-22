import axios from "axios";

// const baseUrl = "http://92.32.88.81:3030";
const baseUrl = "http://localhost:3030";
const endpoints = {
  list: () => `${baseUrl}/operations/list`,
  readDB: (dbname: string, path: string = "/") =>
    `${baseUrl}/${dbname}?path=${path}`,
};

export const listDBs = () =>
  axios.get<Dictionary<Dictionary<number>>>(endpoints.list());

export const readDB = (dbname: string, path: string = "/") =>
  axios.get(endpoints.readDB(dbname, path));

export const getStoresLastUpdate = () =>
  axios.get<DbResponse<string>>(endpoints.readDB("stores", "/ExportedAt"));

export const getStores = () =>
  axios.get<DbResponse<StoresHistV1>>(endpoints.readDB("stores"));
