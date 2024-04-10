import {ENV} from "../../env";

export interface JiraIssueResponse {
    id: string;
    key: string;
    self: string;
}

export interface JiraIssueParams {
    fields: JiraTaskFields
}

export interface JiraIssueUpdateParams {
    fields: Partial<JiraTaskFields>
}

export interface JiraTaskFields {
    project: { key: string; };
    summary: string;
    description: string;
    customfield_12310243?: number, // Story Points
    issuetype: { name: string; };
    parent?: { key: string };
    labels: string[];
    components: [{ name: string; }];
    assignee?: { name: string; };
}