import {ENV} from "../../env";

export interface JiraIssueResponse {
    id: string;
    key: string;
    self: string;
}

export interface JiraIssueParams {
    fields: {
        project: { key: string; };
        summary: string;
        description: string;
        issuetype: { name: string; };
        parent?: { key: string };
        labels: string[];
        components: [{ name: string; }];
        assignee?: { name: string; };
    };
}