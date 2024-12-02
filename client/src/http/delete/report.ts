import axios, { AxiosResponse } from "axios";
import { DOMAIN_NAME_GO } from "../envPaths";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DeleteReport(report_id: number): Promise<AxiosResponse<any, any>> {

    try {
        return axios.delete(`${DOMAIN_NAME_GO}/delete/reports/${encodeURIComponent(report_id)}`, {
            withCredentials: true
        });
    } catch (error) {
        console.error(error);
        return Promise.reject(error); 
    }
}
