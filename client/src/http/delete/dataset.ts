import axios, { AxiosResponse } from "axios";
import { DeleteDatasetClassType } from "../../types/datasets";
import { DOMAIN_NAME_GO } from "../envPaths";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DeleteDatasetClass(data: DeleteDatasetClassType): Promise<AxiosResponse<any, any>> {

    try {
        return axios.delete(`${DOMAIN_NAME_GO}/delete/class/${encodeURIComponent(data.class_id)}/${encodeURIComponent(data.className)}`, {
            withCredentials: true
        });
    } catch (error) {
        console.error(error);
        return Promise.reject(error); 
    }
}
