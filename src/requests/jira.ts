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

// TODO type data param
const doPostRequest = async <T>(data: any): Promise<T> => {
    const response = await fetch(ENV.jiraApiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
    });
    if (response.status >= 400) {
        throw new Error(`Status ${response.status} when creating Task wit error ${await response.text()}`);
    }

    return response.json();
}