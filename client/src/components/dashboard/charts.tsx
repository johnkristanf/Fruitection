import  { Suspense, lazy } from "react";
import { useQuery } from "react-query";
import { ThreeCircles } from 'react-loader-spinner';
import { FetchDatasetClassesDashboard } from "../../http/get/datasets";
import { FetchReportsPerMollusk, FetchYearlyReportsPerStreet } from "../../http/get/reports";
import { ReportsPerMollusk, YearlyReportPerStreet } from "../../types/reported";
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
                    <ReportedPerStreet />
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


function ReportedPerStreet() {
    const reports_query = useQuery("perProvince_reports", FetchYearlyReportsPerStreet);
    const reports: YearlyReportPerStreet[] = Array.isArray(reports_query.data?.data) ? reports_query.data.data : [];
    
    const streets = Array.from(new Set(reports && reports.map(report => report.street)));
  
    const data: (string | number)[][] = [["Year", ...streets]];
  
    const reportsMap: { [year: string]: { [street: string]: number } } = {};
  
    reports.forEach((report) => {
        if (!reportsMap[report.year]) {
            reportsMap[report.year] = {};
        }
        reportsMap[report.year][report.street] = report.reports_count;
    });
  
    Object.keys(reportsMap).forEach((year) => {
        const row: (string | number)[] = [year];
        streets.forEach((street) => {
            row.push(reportsMap[year][street] || 0);
        });
        data.push(row);
    });
  
    const options = {
       

        colors: ["#16A34A", "#16A34A", "#16A34A", "#16A34A", "#16A34A"],

    };

    return (
        <div className="rounded-md bg-white p-4 h-full w-full">
            <h1 className="text-gray-600 font-bold text-2xl">Durian Disease Per Street</h1>
            <h1 className="text-gray-300 text-md mb-4">Yearly Reported Cases</h1>
            
            {reports_query.isLoading ? (
                <div className="h-[70%] w-full flex items-center justify-center">
                    <ThreeCircles color="#E53E3E" height={80} width={80} />
                </div>
            ) : (
                <>
                    {reports.length === 0 ? (
                        <div className="h-[70%] w-full flex items-center justify-center">
                            <div className="text-red-800 font-bold text-xl text-red-800 text-center">No reported cases yet</div>
                        </div>
                    ) : (
                        <Chart
                            chartType="Bar"
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

function ReportedDurianDiseaseTypes() {
    const reports_query = useQuery("perMollusk_reports", FetchReportsPerMollusk);
    const reports: ReportsPerMollusk[] = reports_query.data?.data ?? [];

    console.log("reports per mollusk", reports);

    const data = [
        ["Mollusk Type", "Report Count"]
    ];

    if (reports.length > 0) {
        reports.forEach((item) => {
            data.push([item.durian_disease_type, item.durian_disease_count.toString()]);
        });
    }

    const options = {
        

        legend: { position: "none" }, 
        colors: ["#16A34A", "#16A34A", "#16A34A", "#16A34A", "#16A34A"],

    };

    return (
        <div className="rounded-md bg-white p-4 h-full w-full"> 
            <h1 className="text-gray-600 font-bold text-2xl">Durian Disease Types</h1>
            <h1 className="text-gray-300 text-md mb-4">Yearly Reported Cases</h1>

             {reports_query.isLoading ? (
                <div className="h-[70%] w-full flex items-center justify-center">
                    <ThreeCircles color="#E53E3E" height={80} width={80} />
                </div>
            ) : (
                <>
                    {reports.length === 0 ? (
                        <div className="h-[70%] w-full flex items-center justify-center">
                            <div className="text-red-800 font-bold text-xl text-red-800 text-center">No reported cases yet</div>
                        </div>
                    ) : (
                        <Chart
                            chartType="Bar"
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


function DatasetClasses() {
    const datasets_query = useQuery("dataset_classes", FetchDatasetClassesDashboard);
    const datasetclasses: DatasetClassTypes[] = datasets_query.data?.data ?? [];

    const data = [["Class", "Count"]];

    if (datasetclasses) {
        datasetclasses.forEach((item) => {
            data.push([item.name, item.count]);
        });
    }

    const options = {
        chart: {
            title: "Reported Durian Disease Per District",
            subtitle: "Yearly Reported Cases",
        },

        is3D: true,
    };

    return (
        <div className="rounded-md p-4 h-[80%] w-full bg-white"> 
            <h1 className="text-gray-600 text-xl">Dataset Class Images</h1>
            <h1 className="text-gray-300 text-md mb-4">Class Uploaded</h1>

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
