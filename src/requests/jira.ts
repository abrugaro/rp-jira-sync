import {ENV} from "../../env";
import {JiraIssueParams, JiraIssueResponse} from "../model/jira-issue";

const headers = {
    Authorization: `Bearer ${ENV.jiraAccessToken}`,
    Accept: 'application/json',
    "Content-Type": "application/json"
}

export const createTask = async (title: string, description: string, assignee?: string) => {
    const data: JiraIssueParams = {
        fields: {
            project: {key: ENV.jiraProject},
            summary: title,
            description: description,
            issuetype: {name: "Task"},
            labels: ["qe-task"],
            components: [
                {
                    name: "QE-Task"
                }
            ]
        }
    }

    if (assignee) {
        data.fields.assignee = {name: assignee}
    }

    return doPostRequest<JiraIssueResponse>(data);
}

export const createSubTask = async (parent: string, title: string, description: string, assignee?: string) => {
    const data: JiraIssueParams = {
        fields: {
            project: {key: ENV.jiraProject},
            summary: title,
            description: description,
            customfield_12310243: 2,
            issuetype: {name: "Sub-task"},
            parent: {
                key: parent
            },
            labels: ["qe-task"],
            components: [
                {
                    name: "QE-Task"
                }
            ]
        }
    };

    if (assignee) {
        data.fields.assignee = {name: assignee}
    }

    return doPostRequest(data);
}

export const search = async (searchTerm: string) => {
    const response = await fetch(`${ENV.jiraApiUrl}/search?jql=project=MTA AND ${searchTerm}`, {
        headers,
    });
    if (response.status >= 400) {
        throw new Error(`Status ${response.status} when searching issues wit error ${await response.text()}`);
    }

    return response.json();
}

// TODO type data param
const doPostRequest = async <T>(data: any): Promise<T> => {
    const response = await fetch(`${ENV.jiraApiUrl}/issue`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
    });
    if (response.status >= 400) {
        throw new Error(`Status ${response.status} when creating Task wit error ${await response.text()}`);
    }

    return response.json();
}