import  { Suspense, lazy } from "react";
import { useQuery } from "react-query";
import { ThreeCircles } from 'react-loader-spinner';
import { FetchDatasetClassesDashboard } from "../../http/get/datasets";
import { FetchReportsPerMollusk, FetchYearlyReportsPerFarm } from "../../http/get/reports";
import { ReportsPerMollusk, YearlyReportPerFarm } from "../../types/reported";
import { DatasetClassTypes } from "../../types/datasets";

const Chart = lazy(() => import("react-google-charts").then(module => ({ default: module.Chart })));

export function Charts() {
    return (
        <>
            {/* <div className="flex gap-5 h-full w-full">

                <Suspense fallback={<ThreeCircles color="#E53E3E" height={80} width={80} />}>
                    <ReportedPerProvince />
                </Suspense>

                <Suspense fallback={<ThreeCircles color="#E53E3E" height={80} width={80} />}>
                    <ReportedPerCity />
                </Suspense>
            </div> */}

            <div className="flex gap-5 h-full w-full">

                <Suspense fallback={<ThreeCircles color="#E53E3E" height={80} width={80} />}>
                    <ReportedDurianDiseaseTypes />
                </Suspense>

                
                <Suspense fallback={<ThreeCircles color="#E53E3E" height={80} width={80} />}>
                    <ReportedPerFarm />
                </Suspense>


            </div>

            <Suspense fallback={<ThreeCircles color="#E53E3E" height={80} width={80} />}>
                <DatasetClasses />
            </Suspense>

            
        </>
    );
}

// function ReportedPerCity() {
//     const reports_query = useQuery("perCity_reports", FetchYearlyReportsPerCity);
//     const reports: YearlyReportPerCity[] = Array.isArray(reports_query.data?.data) ? reports_query.data.data : [];
  
//     const cities = Array.from(new Set(reports && reports.map(report => report.city)));
  
//     const data: (string | number)[][] = [["Year", ...cities]];
  
//     const reportsMap: { [year: string]: { [city: string]: number } } = {};
  
//     reports.forEach((report) => {
//         if (!reportsMap[report.year]) {
//             reportsMap[report.year] = {};
//         }
//         reportsMap[report.year][report.city] = report.reports_count;
//     });
  
//     Object.keys(reportsMap).forEach((year) => {
//         const row: (string | number)[] = [year];
//         cities.forEach((city) => {
//             row.push(reportsMap[year][city] || 0);
//         });
//         data.push(row);
//     });
  
//     const options = {
//         chart: {
//             title: "Reported Red Listed Mollusk Per City",
//             subtitle: "Yearly Reported Cases",
//         },

//     };

//     return (
//         <div className="rounded-md bg-white p-4 h-full w-full">
//             <h1 className="text-gray-600 font-bold text-3xl mb-4">Reported Red Listed Per City</h1>

//             {reports_query.isLoading ? (
//                 <div className="h-[70%] w-full flex items-center justify-center">
//                     <ThreeCircles color="#E53E3E" height={80} width={80} />
//                 </div>
//             ) : (
//                 <>
//                     {reports.length === 0 ? (
//                         <div className="h-[70%] w-full flex items-center justify-center">
//                             <div className="text-red-800 font-bold text-xl text-red-800 text-center">No reported cases yet</div>
//                         </div>
                        
//                     ) : (
//                         <Chart
//                             chartType="Bar"
//                             width="100%"
//                             height="90%"
//                             data={data}
//                             options={options}
//                         />
//                     )}
//                 </>
//             )}
//         </div>
//     );
// }


// function ReportedPerFarm() {
//     const reports_query = useQuery('perFarm_reports', FetchYearlyReportsPerFarm);
//     const reports: YearlyReportPerFarm[] = Array.isArray(reports_query.data?.data)
//         ? reports_query.data.data
//         : [];

//     console.log("reports per farm: ", reports)

//     const farmData: { [farm: string]: number } = {};
//     reports.forEach((report) => {
//         if (!farmData[report.farm]) {
//             farmData[report.farm] = 0;
//         }
//         farmData[report.farm] += report.count;
//     });

//     const farms = Object.keys(farmData).sort((a, b) => farmData[a] - farmData[b]);
//     const midPoint = Math.floor(farms.length / 2);

//     // Create separate series for red and blue segments
//     const redData: (string | number)[][] = [['Farm', 'Report Count']];
//     const blueData: (string | number)[][] = [['Farm', 'Report Count']];

//     farms.forEach((farm, index) => {
//         if (index < midPoint) {
//             redData.push([farm, farmData[farm]]);
//         } else {
//             blueData.push([farm, farmData[farm]]);
//         }
//     });

//     const options = {
//         hAxis: { title: 'Farm' },
//         vAxis: { title: 'Report Count' },
//         legend: { position: 'none' },
//         curveType: 'function',
//         series: {
//             0: { color: 'red' },
//             1: { color: 'blue' },
//         },
//     };

//     // Combine data for the Chart component
//     const data: (string | number)[][] = [['Farm', 'Report Count']];
//     if (redData.length > 1) {
//         data.push(...redData.slice(1)); // Exclude header
//     }
//     if (blueData.length > 1) {
//         data.push(...blueData.slice(1));
//     }

//     return (
//         <div className="rounded-md bg-white p-4 h-full w-full">
//             <h1 className="text-gray-600 font-bold text-2xl">Durian Disease Per Farm</h1>
//             <h1 className="text-gray-400 text-md mb-4">Total Reported Cases</h1>

//             {reports_query.isLoading ? (
//                 <div className="h-[70%] w-full flex items-center justify-center">
//                     <ThreeCircles color="#E53E3E" height={80} width={80} />
//                 </div>
//             ) : (
//                 <>
//                     {reports.length === 0 ? (
//                         <div className="h-[70%] w-full flex items-center justify-center">
//                             <div className="text-red-800 font-bold text-xl text-center">No reported cases yet</div>
//                         </div>
//                     ) : (
//                         <div className="flex justify-center items-center p-5 w-full h-full">
//                             <Chart
//                                 chartType="LineChart"
//                                 width="100%"
//                                 height="90%"
//                                 data={data}
//                                 options={options}
//                             />
//                         </div>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// }


function ReportedPerFarm() {
    const reports_query = useQuery('perFarm_reports', FetchYearlyReportsPerFarm);
    const reports: YearlyReportPerFarm[] = Array.isArray(reports_query.data?.data)
        ? reports_query.data.data
        : [];

    console.log("reports per farm: ", reports);

    // Prepare data structure to organize by farm and year
    const farmYearData = {};
    const allYears = new Set();
    const allFarms = new Set();

    // Process the data to organize by farm and year
    reports.forEach((report) => {
        const { farm, year, count } = report;
        
        allYears.add(year);
        allFarms.add(farm);
        
        // @ts-expect-error no error
        if (!farmYearData[farm]) {
            // @ts-expect-error no error
            farmYearData[farm] = {};
        }

        // @ts-expect-error no error
        farmYearData[farm][year] = count;
    });

    // Convert the processed data into a format suitable for Google Charts
    const chartData = [];
    
    // Create the header row with year as the first column and each farm as subsequent columns
    const headerRow = ['Year'];
        
    // @ts-expect-error no error
    allFarms.forEach(farm => headerRow.push(farm));
    chartData.push(headerRow);

    // Add data rows for each year
    const sortedYears = Array.from(allYears).sort();
    sortedYears.forEach(year => {
        const yearRow = [year];
        allFarms.forEach(farm => {
            // @ts-expect-error no error
            yearRow.push(farmYearData[farm]?.[year] || 0);
        });
        chartData.push(yearRow);
    });

    const options = {
        hAxis: { title: 'Year' },
        vAxis: { title: 'Report Count' },
        legend: { position: 'bottom' },
        curveType: 'function', // Creates smoother lines
        colors: ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#8B4513', '#FF7F00'], // Google colors + some extras
    };

    return (
        <div className="rounded-md bg-white p-4 h-full w-full">
            <h1 className="text-gray-600 font-bold text-2xl">Durian Disease Reports Per Farm</h1>
            <h1 className="text-gray-400 text-md mb-4">By Year</h1>

            {reports_query.isLoading ? (
                <div className="h-[70%] w-full flex items-center justify-center">
                    <ThreeCircles color="#E53E3E" height={80} width={80} />
                </div>
            ) : (
                <>
                    {reports.length === 0 ? (
                        <div className="h-[70%] w-full flex items-center justify-center">
                            <div className="text-red-800 font-bold text-xl text-center">No reported cases yet</div>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center p-5 w-full h-full">
                            <Chart
                                chartType="LineChart"
                                width="100%"
                                height="90%"
                                data={chartData}
                                options={options}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}


function ReportedDurianDiseaseTypes() {
    const reports_query = useQuery("perMollusk_reports", FetchReportsPerMollusk);
    const reports: ReportsPerMollusk[] = reports_query.data?.data ?? [];

    console.log("reports per durian type", reports);

    // Updated data structure for LineChart
    const data: (string | number)[][] = [
        ["Durian Type", "Report Count"] // Headers without "style"
    ];

    if (reports.length > 0) {
        reports.forEach((item) => {
            const ddt = item.durian_disease_type;

            // Format disease names
            const formattedDdt =
                ddt.toLowerCase() === 'durian blight' ? 'Phytophthora Palmivora Fruit Rot (Late Stage)' :
                ddt.toLowerCase() === 'durian spot' ? 'Phytophthora Palmivora Fruit Rot (Early Stage)' :
                ddt;

            data.push([formattedDdt, item.durian_disease_count]); // Remove color field
        });
    }

    const options = {
        title: "Durian Disease Types",
        curveType: "function",
        legend: { position: "none" },
        series: {
            0: { color: "#22C55E" }, // Tailwind bg-green-700 equivalent in hex
        },
    };

    return (
        <div className="rounded-md bg-white p-4 h-full w-full"> 
            <h1 className="text-gray-600 font-bold text-2xl">Durian Disease Types</h1>
            <h1 className="text-gray-400 text-md mb-4">Yearly Reported Cases</h1>

            {reports_query.isLoading ? (
                <div className="h-[70%] w-full flex items-center justify-center">
                    <ThreeCircles color="#E53E3E" height={80} width={80} />
                </div>
            ) : (
                <>
                    {reports.length === 0 ? (
                        <div className="h-[70%] w-full flex items-center justify-center">
                            <div className="text-red-800 font-bold text-xl text-center">No reported cases yet</div>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center p-5 w-full h-full">
                            <Chart
                                chartType="ColumnChart" // Changed to LineChart
                                width="100%"
                                height="90%"
                                data={data}
                                options={options}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}


function DatasetClasses() {
    const datasets_query = useQuery("dataset_classes", FetchDatasetClassesDashboard);
    const datasetclasses: DatasetClassTypes[] = datasets_query.data?.data ?? [];

    const data = [["Class", "Count"]];

    if (datasetclasses) {
        datasetclasses.forEach((item) => {

            const formattedDdt = item.name.toLowerCase() === 'durian blight' ? 'Phytophthora Palmivora Fruit Rot (Late Stage)' : item.name.toLowerCase() === 'durian spot' ? 'Phytophthora Palmivora Fruit Rot (Early Stage)' : item.name;
            data.push([formattedDdt, item.count]);
        });
    }

    const options = {
        chart: {
            title: "Reported Durian Disease Per District",
            subtitle: "Yearly Reported Cases",
        },

        is3D: true,

        slices: {
            4: { color: "#b87333" }, 
            5: { color: "#000000" }, 
        },
    };

    return (
        <div className="rounded-md p-4 h-[80%] w-full bg-white mt-5"> 
            <h1 className="text-gray-600 text-2xl font-bold">Dataset Class Images</h1>
            <h1 className="text-gray-400 text-lg mb-4">Class Uploaded</h1>

             {datasets_query.isLoading ? (
                <div className="h-[70%] w-full flex items-center justify-center">
                    <ThreeCircles color="#E53E3E" height={80} width={80} />
                </div>
            ) : (
                <>
                    {datasetclasses.length === 0 ? (
                        <div className="h-[70%] w-full flex items-center justify-center">
                            <div className="text-red-800 font-bold text-xl text-red-800 text-center">No dataset class images yet</div>
                        </div>
                    ) : (
                        <Chart
                            chartType="PieChart"
                            width="100%"
                            height="90%"
                            data={data}
                            options={options}
                        />
                    )}
                </>
            )}

        </div>
    );
}
