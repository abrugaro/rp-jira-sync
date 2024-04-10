import {ENV} from "../../env";
import {JiraIssueParams, JiraIssueResponse} from "../model/jira-issue";
import {RecursivePartial} from "../model/common";

const headers = {
    Authorization: `Bearer ${ENV.jiraAccessToken}`,
    Accept: 'application/json',
    "Content-Type": "application/json"
}

// TODO merge with createSubTask
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

    return doIssuePostRequest<JiraIssueResponse>(data);
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

    return doIssuePostRequest(data);
}

export const updateIssue = async (issueId: string, data: RecursivePartial<JiraIssueParams> ) => {
    return doIssuePostRequest(data, issueId);
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
const doIssuePostRequest = async <T>(data: any, issueId?: string): Promise<T> => {
    let url = `${ENV.jiraApiUrl}/issue`;
    if (issueId) {
        url += `/${issueId}`
    }
    const response = await fetch(``, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
    });
    if (response.status >= 400) {
        throw new Error(`Status ${response.status} when creating or updating Issue wit error ${await response.text()}`);
    }

    return response.json();
}