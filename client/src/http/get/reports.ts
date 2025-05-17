/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from "axios";
import { FetchMapReportsParams } from "../../types/map";
import { DOMAIN_NAME_GO } from "../envPaths";

export function FetchReports(selectedFarm: string): Promise<AxiosResponse<any, any>> {
    try {
        return axios.get(`${DOMAIN_NAME_GO}/fetch/reports/${encodeURIComponent(selectedFarm)}`, {
            withCredentials: true
        });
    } catch (error) {
        console.error(error);
        return Promise.reject(error); 
    }
}


export function FetchMapReports({ year, month, durian }: FetchMapReportsParams): Promise<AxiosResponse<any, any>> {

    console.log("year: ", year);
    console.log("month: ", month);
    console.log("durian: ", durian);
    
    try {
        return axios.get(`${DOMAIN_NAME_GO}/fetch/map/reports/${year}/${month}/${encodeURIComponent(durian)}`, {
            withCredentials: true
        });
    } catch (error) {
        console.error(error);
        return Promise.reject(error); 
    }
}



export function FetchYearlyReportsPerCity(): Promise<AxiosResponse<any, any>> {
    try {
        return axios.get(`${DOMAIN_NAME_GO}/fetch/reports/city`, {
            withCredentials: true
        });
    } catch (error) {
        console.error(error);
        return Promise.reject(error); 
    }
}

export function FetchYearlyReportsPerFarm(): Promise<AxiosResponse<any, any>> {
    try {
        return axios.get(`${DOMAIN_NAME_GO}/fetch/reports/farm`, {
            withCredentials: true
        });
    } catch (error) {
        console.error(error);
        return Promise.reject(error); 
    }
}


export function FetchReportsPerMollusk(): Promise<AxiosResponse<any, any>> {
    try {
        return axios.get(`${DOMAIN_NAME_GO}/fetch/reports/mollusk`, {
            withCredentials: true
        });
    } catch (error) {
        console.error(error);
        return Promise.reject(error); 
    }
}

export async function GenerateReports(){
    try {
        const response = await axios.get(`${DOMAIN_NAME_GO}/generate/reports`, {
          responseType: 'blob', 
        });
  
        return response.data;
      } catch (error) {
        console.error('Error downloading Excel file:', error);
      }
}
