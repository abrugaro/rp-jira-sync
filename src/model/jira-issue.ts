export interface JiraIssueResponse {
  id: string
  key: string
  self: string
}

export interface JiraIssueParams {
  fields: {
    project: { key: string }
    summary: string
    description: string
    customfield_12310243?: number // Story Points
    issuetype: { name: string }
    parent?: { key: string }
    labels: string[]
    components: [{ name: string }]
    assignee?: { name: string }
  }
}
