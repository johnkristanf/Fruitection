import axios, { AxiosResponse } from "axios";
import { DOMAIN_NAME_GO } from "../envPaths";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FetchPersonnelAccounts(): Promise<AxiosResponse<any, any>> {
    try {
        return axios.get("https://clamscanner.com/go/personnel/accounts", {
            withCredentials: true
        });
    } catch (error) {
        console.error(error);
        return Promise.reject(error); 
    }
}



export async function FetchAdminData() {

    try {
        const response = await axios.get(`${DOMAIN_NAME_GO}/admin/data`, {
            withCredentials: true
        });

        return response.data

    } catch (error) {
        console.error(error);
    }
}


export async function SignOut() {

    try {
        const response = await axios.post(`${DOMAIN_NAME_GO}/signout`, {}, {
            withCredentials: true
        });

       if(response.status === 200) window.location.href = "/"
       
    } catch (error) {
        console.error(error);
    }
}