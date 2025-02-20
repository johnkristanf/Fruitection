import axios, { AxiosResponse } from "axios";
import { DOMAIN_NAME_PY } from "../envPaths";


interface TrainingInterface{
    version: string;
    trainingModelType: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TrainModel(data: TrainingInterface): Promise<AxiosResponse<any, any>> {
    try {
        return axios.post(`${DOMAIN_NAME_PY}/train/model`, data);
    } catch (error) {
        console.error(error);
        return Promise.reject(error); 
    }
}
