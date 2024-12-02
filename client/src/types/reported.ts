
export type ReportedCasesTypes = {
    report_id: number
    longitude: number,
    latitude: number,
    city: string,
    province: string,
    street: string,
    reportedAt: string
    durian_disease_type: string
    
    user_id: number
    status: string

    reporter_address: string
    reporter_name: string

}


export type YearlyReportPerCity = {
    city: string
    year: string,
    reports_count: number
}


export type YearlyReportPerStreet = {
    street: string
    year: string,
    reports_count: number
}

export type ReportsPerMollusk = {
    durian_disease_type: string,
    durian_disease_count: number
}