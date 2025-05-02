/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Tooltip, useMap, Marker, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import '/public/map.css';
import 'leaflet/dist/leaflet.css';

import { FetchMapReports } from '../../http/get/reports';
import { useQuery } from 'react-query';
import { ReportedCasesTypes } from '../../types/reported';
import { SetViewOnClickProps } from '../../types/map';
import Swal from 'sweetalert2';

// const redIcon = new L.Icon({
//   iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   tooltipAnchor: [16, -28],
//   shadowSize: [41, 41],
// });

// const greenIcon = new L.Icon({
//   iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   tooltipAnchor: [16, -28],
//   shadowSize: [41, 41],
// });

// const redCircleOptions: L.CircleMarkerOptions = {
//   color: 'red',
//   fillColor: 'transparent',
//   fillOpacity: 0,
//   weight: 1,
// };

// const greenCircleOptions: L.CircleMarkerOptions = {
//   color: 'green',
//   fillColor: 'transparent',
//   fillOpacity: 0,
//   weight: 1,
// };


const orangeIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

const blackIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});


const greenIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});



const yellowIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});


const orangeCircleOptions: L.CircleMarkerOptions = {
  color: 'orange',
  fillColor: 'transparent',
  fillOpacity: 0,
  weight: 1,
};

const blackCircleOptions: L.CircleMarkerOptions = {
  color: 'black',
  fillColor: 'transparent',
  fillOpacity: 0,
  weight: 1,
};


const greenCircleOptions: L.CircleMarkerOptions = {
  color: 'green',
  fillColor: 'transparent',
  fillOpacity: 0,
  weight: 1,
};


const yellowCircleOptions: L.CircleMarkerOptions = {
  color: 'yellow',
  fillColor: 'transparent',
  fillOpacity: 0,
  weight: 1,
};

function SetViewOnClick({ MapCoor }: SetViewOnClickProps) {
  const map = useMap();
  map.setView(MapCoor, map.getZoom());

  return null;
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

function Map({ setMapCoor, MapCoor, setOpenReportsModal }: any) {
  
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [selectedMonth, setSelectedMonth] = useState<string>("All");
  const [selectedDurian, setSelectedDurian] = useState<string>("All");

  useEffect(() => {
    const today = new Date();
    const currentMonthName = monthNames[today.getMonth()];
    setSelectedMonth(currentMonthName);
}, []);

  const reports_query = useQuery(
    ['reported_cases', selectedYear, selectedMonth, selectedDurian],
    () => FetchMapReports({ year: selectedYear, month: selectedMonth, durian: selectedDurian }),
    {
      onSuccess: () => {
        Swal.close(); 
      },
      onError: () => {
        Swal.close(); 
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch reports!',
        });
      },
    }
  );

  const reports: ReportedCasesTypes[] = Array.isArray(reports_query.data?.data) ? reports_query.data.data : [];

  useEffect(() => {
    if (reports_query.isFetching) {
      Swal.fire({
        title: 'Loading reports...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
    } else {
      Swal.close();
    }
  }, [reports_query.isFetching]);

  console.log("reports map data: ", reports);
  console.log("reports_query ", reports_query);

  console.log("Selected Month: ", selectedMonth);
  console.log("Selected Durian: ", selectedDurian);
  console.log("Selected Year: ", selectedYear);


  return (
    <div className="h-screen w-full mt-10 pb-20">
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-md">
        {/* <h1 className="text-gray-700 font-bold text-3xl">Reports Map</h1> */}
        <h1 className="text-green-600 font-bold text-4xl">Fruitection Reports Map</h1>


        <div className="flex items-end justify-center gap-5 w-full">
          <div className="flex flex-col justify-center w-full gap-2">
            <h1 className="font-bold text-center">View Reports by</h1>

            <div className="flex gap-2">

              <select
                className="bg-green-600 text-white font-bold rounded-md focus:outline-none p-2"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {Array.from({ length: new Date().getFullYear() - 2024 + 1 }, (_, i) => 2024 + i)
                  .reverse()
                  .map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                ))}
              </select>

              <select
                className="bg-green-600 text-white font-bold rounded-md focus:outline-none p-2"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {monthNames.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>

              <select
                className="bg-green-600 text-white font-bold rounded-md focus:outline-none p-2"
                value={selectedDurian}
                onChange={(e) => setSelectedDurian(e.target.value)}
              >
                <option value={'Durian Blight'}>Phytophthora Palmivora Fruit Rot (Late Stage)</option>
                <option value={'Durian Spot'}>Phytophthora Palmivora Fruit Rot (Early Stage)</option>
                <option value={'Leaf Spot'}>Leaf Spot</option>
                <option value={'Leaf Blight'}>Leaf Blight</option>
              </select>
            </div>
          </div>
          <button onClick={() => setOpenReportsModal(true)} className="rounded-md p-2 text-white font-bold bg-green-600 w-full hover:opacity-75 hover:cursor-pointer">
            Reports
          </button>
        </div>
      </div>

      <div className="relative w-full h-full flex justify-center z-10">
        <MapContainer center={MapCoor} zoom={13} scrollWheelZoom={false} attributionControl={false} className="w-full h-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <SetViewOnClick MapCoor={MapCoor} />

          {reports?.map((data) => {
            
            const diseaseType = data.durian_disease_type.toLowerCase();
            let icon: L.Icon;
            let circleOptions: L.CircleMarkerOptions;
            let formattedDdt: string;

            if (diseaseType === 'durian blight') {
              icon = orangeIcon; 
              circleOptions = orangeCircleOptions; // Assuming you have orangeCircleOptions defined
              formattedDdt = 'Phytophthora Palmivora Fruit Rot (Late Stage)';
            } else if (diseaseType === 'durian spot') {
              icon = blackIcon; 
              circleOptions = blackCircleOptions; // Assuming you have blackCircleOptions defined
              formattedDdt = 'Phytophthora Palmivora Fruit Rot (Early Stage)';
            } else if (diseaseType === 'leaf spot') {
              icon = greenIcon;
              circleOptions = greenCircleOptions;
              formattedDdt = 'Durian Leaf Spot';
            } else if (diseaseType === 'leaf blight') {
              icon = yellowIcon;
              circleOptions = yellowCircleOptions;
              formattedDdt = 'Durian Leaf Blight';
            } else {
              icon = greenIcon; // Or any other default icon
              circleOptions = greenCircleOptions; // Or any other default circle options
              formattedDdt = data.durian_disease_type;
            }
        

            return (
              <div key={data.report_id}>
                <Marker
                  position={[data.latitude, data.longitude]}
                  eventHandlers={{
                    click: () => setMapCoor([data.latitude, data.longitude]),
                  }}
                  icon={icon}
                >
                  <Tooltip>
                    {data.reporter_name} <br />
                    {formattedDdt} <br />
                    {data.city} City, {data.street}, {data.province} <br />
                    {data.reportedAt} <br />
                    {data.latitude}° N, {data.longitude}° E
                  </Tooltip>
                </Marker>

                <CircleMarker
                  center={[data.latitude, data.longitude]}
                  pathOptions={circleOptions}
                  radius={8}
                />
              </div>
            );
          })}
        </MapContainer>

        {/* Floating Legend */}
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg" style={{ zIndex: 9999 }}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <img
                src="https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png"
                width={20}
                height={30}
                alt="Orange Marker"
              />
              <h1 className="text-sm">Phytophthora Palmivora Fruit Rot (Late Stage)</h1>
            </div>

            <div className="flex items-center gap-2">
              <img
                src="https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png"
                width={20}
                height={30}
                alt="Black Marker"
              />
              <h1 className="text-sm">Phytophthora Palmivora Fruit Rot (Early Stage)</h1>
            </div>

            <div className="flex items-center gap-2">
              <img
                src="https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png"
                width={20}
                height={30}
                alt="Brown Marker"
              />
              <h1 className="text-sm">Durian Leaf Spot</h1>
            </div>

            <div className="flex items-center gap-2">
              <img
                src="https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png"
                width={20}
                height={30}
                alt="Light Green Marker"
              />
              <h1 className="text-sm">Durian Leaf Blight</h1>
            </div>
          
          </div>
        </div>

       
      </div>
    </div>
  );
}

export default Map;
