import { useState } from "react";
import { Charts } from "../components/dashboard/charts";
import { SideBar } from "../components/navigation/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

function DashboardPage(){

    const [isSidebarOpen, setisSidebarOpen] = useState<boolean>(true)

    return (
        <div className="h-full w-full">

            { isSidebarOpen && <SideBar setisSidebarOpen={setisSidebarOpen} /> }
            

            <div className="h-full w-full p-8">

                <FontAwesomeIcon
                   onClick={() => setisSidebarOpen(true)} 
                   icon={faBars} 
                   className="fixed top-3 font-bold text-3xl hover:opacity-75 hover:cursor-pointer text-black p-2 rounded-md"
                />

                <div className="p-4 sm:ml-64">
                        <div className="p-4 rounded-lg dark:border-gray-700">
                            <h1 className="text-green-600 font-bold text-4xl bg-white p-3 rounded-md mb-5">
                                Fruitection Dashboard
                            </h1>

                            <Charts />

                        </div>
                    </div>

                 
            </div>

            

        </div>
    );
}

export default DashboardPage