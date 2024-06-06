export const ENV = {
  reportPortalToken: process.env.REPORT_PORTAL_TOKEN,
  reportPortalApiUrl: process.env.REPORT_PORTAL_API_URL,
  reportPortalProject: process.env.REPORT_PORTAL_PROJECT,
  jiraAccessToken: process.env.JIRA_ACCESS_TOKEN,
  jiraApiUrl: process.env.JIRA_API_URL,
  jiraProject: process.env.JIRA_PROJECT,
}

export const OWNERS: { [key: string]: string } = JSON.parse(process.env.OWNERS)
