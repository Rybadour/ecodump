import axios from 'axios';

const baseUrl = 'http://localhost:3030';
const endpoints = {
    list: () => `${baseUrl}/operations/list`,
    readDB: (dbname: string) => `${baseUrl}/${dbname}?path=/`,
}

export const listDBs = () => axios.get<Dictionary<Dictionary<number>>>(endpoints.list());

export const readDB = (dbname: string) => axios.get(endpoints.readDB(dbname));