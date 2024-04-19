export interface ReportPortalItem {
  id: number
  uuid: string
  name: string
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
  product_bug?: { total: number }
  automation_bug?: { total: number }
  to_investigate?: { total: number }
  system_issue?: { total: number }
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
}
