export interface ReportPortalLaunch {
    owner: string
    share: boolean
    description: string
    id: number
    uuid: string
    name: string
    number: number
    startTime: number
    endTime: number
    lastModified: number
    status: string
    statistics: Statistics
    attributes: Attribute[]
    mode: string
    analysing: any[]
    approximateDuration: number
    hasRetries: boolean
    rerun: boolean
}

export interface Statistics {
    executions: Executions
    defects: Defects
}

export interface Executions {
    total: number
    passed?: number
    skipped?: number
    failed?: number
}

export interface Defects {
    to_investigate?: ToInvestigate
}

export interface ToInvestigate {
    total: number
}

export interface Attribute {
    key: string
    value: string
}