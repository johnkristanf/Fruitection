import { useQueryClient } from 'react-query'
import { useEffect, useState, lazy, Suspense, useCallback, ChangeEvent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import { WS_URL_GO } from '../http/envPaths'
import { SideBar } from '../components/navigation/sidebar'
import { handleGenerateReport } from '../utils/generate-reports'

const ReportedCases = lazy(() => import('../components/reports/reported'))
const Map = lazy(() => import('../components/reports/map'))

const InitializeWSConnection = (
    setReports: React.Dispatch<React.SetStateAction<number | undefined>>
) => {
    let ws: WebSocket | null = null

    const connect = () => {
        ws = new WebSocket(`${WS_URL_GO}/ws/conn`)

        ws.onopen = () => {
            console.log('WebSocket Connected')
        }

        ws.onmessage = (event) => {
            const data: number = JSON.parse(event.data)
            setReports(data)
        }

        ws.onclose = (event) => {
            console.log(`WebSocket closed: ${event.reason}`)
            setTimeout(connect, 2000)
        }

        ws.onerror = (error) => {
            console.error('WebSocket error:', error)
            if (ws) ws.close()

            setTimeout(connect, 2000)
        }
    }

    connect()
}

const ReportsPage: React.FC = () => {
    const queryClient = useQueryClient()

    const [OpenReportsModal, setOpenReportsModal] = useState<boolean>(false)

    const [MapCoor, setMapCoor] = useState<number[]>([7.3087, 125.6841])
    const [Reports, setReports] = useState<number | undefined>()
    const [isSidebarOpen, setisSidebarOpen] = useState<boolean>(true)

    const [selectedFarm, setSelectedFarm] = useState('All')

    const handleFarmChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedFarm(event.target.value)
    }

    useEffect(() => {
        InitializeWSConnection(setReports)
    }, [])

    const refetchStaleCacheReports = useCallback(() => {
        queryClient.invalidateQueries('reported_cases')
        queryClient.invalidateQueries('perCity_reports')
        queryClient.invalidateQueries('perProvince_reports')
        queryClient.invalidateQueries('perMollusk_reports')
    }, [queryClient])

    useEffect(() => {
        if (Reports && Reports > 0) {
            Swal.close()

            Swal.fire({
                title: `Received New Reported Cases`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#800000',
                cancelButtonColor: '#000000',
                confirmButtonText: 'View Reports',
            }).then((result) => {
                if (result.isConfirmed) {
                    refetchStaleCacheReports()
                    setOpenReportsModal(true)
                }

                if (result.isDismissed || result.isDenied) {
                    refetchStaleCacheReports()
                    setOpenReportsModal(true)
                }
            })
        }
    }, [Reports, refetchStaleCacheReports])

    return (
        <div className="flex flex-col h-full w-full">
            {isSidebarOpen && <SideBar setisSidebarOpen={setisSidebarOpen} />}

            <Suspense fallback={<div>Loading...</div>}>
                {OpenReportsModal && (
                    <>
                        <div
                            className="bg-gray-950 fixed top-0 w-full h-full opacity-75"
                            style={{ zIndex: 6000 }}
                        ></div>
                        <div
                            className="flex fixed top-0 flex-col w-full h-full rounded-md p-5 gap-8"
                            style={{ zIndex: 7000 }}
                        >
                            <div className="flex flex-col gap-5 h-full w-full">
                                <div className="flex justify-between items-center">
                                    <h1 className="text-white font-bold text-3xl">
                                        Reported Cases
                                    </h1>

                                    <div className="w-[35%] flex items-center justify-end gap-3 font-semibold ">
                                        <select
                                            className="w-[40%] rounded-md p-3 focus:outline-none"
                                            value={selectedFarm}
                                            onChange={handleFarmChange}
                                        >
                                            <option value="All">All Farms</option>
                                            <option value="Maduao Farm">Maduao Farm</option>
                                            <option value="J.P.Laurel Farm">J.P.Laurel Farm</option>
                                        </select>

                                        <button
                                            onClick={handleGenerateReport}
                                            className="rounded-md p-2 text-white font-bold bg-blue-900 flex-1 hover:opacity-75 hover:cursor-pointer min-w-[120px] text-center"
                                        >
                                            Generate Reports
                                        </button>

                                        <button
                                            onClick={() => setOpenReportsModal(false)}
                                            className="bg-green-700 rounded-md p-3 text-white flex items-center gap-2 hover:opacity-75 hover:cursor-pointer"
                                        >
                                            <FontAwesomeIcon
                                                className="text-white"
                                                icon={faTimes}
                                            />{' '}
                                            Close
                                        </button>
                                    </div>
                                </div>
                                <ReportedCases
                                    setMapCoor={setMapCoor}
                                    setOpenReportsModal={setOpenReportsModal}
                                    selectedFarm={selectedFarm}
                                />
                            </div>
                        </div>
                    </>
                )}
            </Suspense>

            <FontAwesomeIcon
                onClick={() => setisSidebarOpen(true)}
                icon={faBars}
                className="fixed top-3 font-bold text-3xl hover:opacity-75 hover:cursor-pointer text-black p-2 rounded-md"
            />

            <div className="w-full sm:ml-40 h-full sm:w-full flex flex-col items-start sm:px-[11rem]">
                <Suspense
                    fallback={
                        <div className="w-full h-screen flex justify-center items-center ">
                            <div className="text-4xl font-bold">Loading Reports Map....</div>
                        </div>
                    }
                >
                    <Map
                        setMapCoor={setMapCoor}
                        MapCoor={MapCoor}
                        setOpenReportsModal={setOpenReportsModal}
                    />
                </Suspense>
            </div>
        </div>
    )
}

export default ReportsPage
