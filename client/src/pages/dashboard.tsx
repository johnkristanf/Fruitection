import { useState } from "react";
import { Charts } from "../components/dashboard/charts";
import { SideBar } from "../components/navigation/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

function DashboardPage(){

    const [isSidebarOpen, setisSidebarOpen] = useState<boolean>(false)

    return (
        <div className="h-full w-full">

            { isSidebarOpen && <SideBar setisSidebarOpen={setisSidebarOpen} /> }
            

            <div className="h-full w-full p-8">

                <FontAwesomeIcon
                   onClick={() => setisSidebarOpen(true)} 
                   icon={faBars} 
                   className="fixed top-3 font-bold text-3xl hover:opacity-75 hover:cursor-pointer text-black p-2 rounded-md"
                />

                <div className="h-[120vh] w-full p-5 flex flex-col gap-8 bg-gray-100 mt-12 rounded-md">

                    <h1 className="text-green-600 font-bold text-4xl">Fruitection Dashboard</h1>
                    <Charts />

                </div>  

                 
            </div>

            

        </div>
    );
}

export default DashboardPage