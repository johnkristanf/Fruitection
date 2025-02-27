import axios, { AxiosResponse } from "axios";
import { DatasetClassTypes, DeleteImageDataTypes } from "../../types/datasets";
import { DOMAIN_NAME_GO, DOMAIN_NAME_PY } from "../envPaths";

export async function UploadNewImage(uploadFormData: FormData): Promise<boolean | undefined>{

    try {
        const response = await axios.post(`${DOMAIN_NAME_PY}/upload/dataset/images`, uploadFormData, {
            headers: { 
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log("response upload: ", response)
        if(response.status === 201) return true

    } catch (error) {
        console.error(error);
        return false
    }
}



export async function AddNewDatasetClass(data: DatasetClassTypes){

    try {
        return axios.post(`${DOMAIN_NAME_GO}/add/dataset/class`, data, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        console.error(error);
    }
}

export async function EditDatasetClass(data: DatasetClassTypes){

    try {
        return axios.post(`${DOMAIN_NAME_GO}/edit/dataset/class`, data, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        console.error(error);
    }
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DeleteDatasetImage({ selectedKeys, class_id, datasetClass }: DeleteImageDataTypes): Promise<AxiosResponse<any, any>> {
    try {

        const payload = {
            image_keys: selectedKeys, 
            class_id: class_id,
            datasetClass: datasetClass
        }

        return axios.post(`${DOMAIN_NAME_PY}/delete/image`, payload, 
            { withCredentials: true }
        );

    } catch (error) {
        console.error(error);
        return Promise.reject(error); 
    }
}
