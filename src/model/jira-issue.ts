export interface JiraIssueResponse {
  id: string;
  key: string;
  self: string;
  fields?: {
    project: { key: string };
    summary: string;
    description: string;
    customfield_12310243?: number; // Story Points
    customfield_12311140?: string; // Epic Link
    issuetype: { name: string };
    parent?: { key: string };
    labels: string[];
    components: [{ name: string }];
    assignee?: { name: string };
    status?: { name: string };
  };
}

export interface JiraIssueParams {
  fields: {
    project: { key: string };
    summary: string;
    description: string;
    customfield_12310243?: number; // Story Points
    customfield_12311140?: string; // Epic Link
    issuetype: { name: string };
    parent?: { key: string };
    labels: string[];
    components: [{ name: string }];
    assignee?: { name: string };
    status?: { name: string };
  };
}
