export interface SetViewOnClickProps {
    MapCoor: [number, number];
}

export interface MapProps {
    setMapCoor: React.Dispatch<React.SetStateAction<[number, number]>>;
    MapCoor: [number, number];
    setOpenReportsModal: React.Dispatch<React.SetStateAction<boolean>>;
}
  

export interface FetchMapReportsParams {
    year: string;
    month: string;
    durian: string;
}
