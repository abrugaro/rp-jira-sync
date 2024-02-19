export interface ReportPortalItem {
    id: number
    uuid: string
    name: string
    parameters: any[]
    attributes: Attribute[]
    type: string
    startTime: number
    endTime: number
    status: string
    statistics: Statistics
    pathNames: PathNames
    hasChildren: boolean
    hasStats: boolean
    launchId: number
    uniqueId: string
    testCaseHash: number
    patternTemplates: any[]
    path: string
    description?: string
    parent?: number
    issue?: Issue
}

export interface Attribute {
    key: string
    value: string
}

export interface Statistics {
    executions: Executions
    defects: Defects
}

export interface Executions {
    total: number
    failed: number
}

export interface Defects {
    to_investigate: ToInvestigate
}

export interface ToInvestigate {
    total: number
}

export interface PathNames {
    launchPathName: LaunchPathName
    itemPaths?: ItemPath[]
}

export interface LaunchPathName {
    name: string
    number: number
}

export interface ItemPath {
    id: number
    name: string
}

export interface Issue {
    issueType: string
    comment: string
    autoAnalyzed: boolean
    ignoreAnalyzer: boolean
    externalSystemIssues: any[]
}

