import axios, { AxiosResponse } from "axios";
import { DOMAIN_NAME_GO } from "../envPaths";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FetchModels(): Promise<AxiosResponse<any, any>> {
    try {
        return axios.get(`${DOMAIN_NAME_GO}/fetch/model`, {
            withCredentials: true
        });
    } catch (error) {
        console.error(error);
        return Promise.reject(error); 
    }
}
