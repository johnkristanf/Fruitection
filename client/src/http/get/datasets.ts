/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from "axios";
import { DOMAIN_NAME_GO, DOMAIN_NAME_PY } from "../envPaths";

export async function FetchDatasetClassesDashboard(): Promise<AxiosResponse | any> {

    try {
        return axios.get(`${DOMAIN_NAME_GO}/fetch/dataset/class`, {
            withCredentials: true
        });
      
    } catch (error) {
        console.error(error);
    }
}


export function FetchDatasetClasses(): Promise<AxiosResponse<any, any>> {
    try {
        return axios.get(`${DOMAIN_NAME_GO}/fetch/dataset/class`, {
            withCredentials: true
        });
    } catch (error) {
        console.error(error);
        return Promise.reject(error); 
    }
}




export async function FetchDatasetClassImages(datasetClass: string): Promise<AxiosResponse<any, any>>  {
    console.log("classFolderName", datasetClass)

    try {
        return axios.get(`${DOMAIN_NAME_PY}/fetch/images/${encodeURIComponent(datasetClass)}`, {
            withCredentials: true
        });

    } catch (error) {
        console.error(error);
        return Promise.reject(error); 
    }
}

