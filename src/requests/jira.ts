import { ENV } from "../../env";
import { JiraIssueParams, JiraIssueResponse } from "../model/jira-issue";
import { RecursivePartial } from "../model/common";
import { JiraIssueTypes } from "../enums/jira-issue-types.enum";
import { JiraServerInfo } from "../model/jira-server-info";

const headers = {
  Authorization: `Bearer ${ENV.jiraAccessToken}`,
  Accept: "application/json",
  "Content-Type": "application/json",
};

export const createIssue = async (
  type: JiraIssueTypes,
  title: string,
  description: string,
  assignee?: string,
  parent?: string
) => {
  const data: JiraIssueParams = {
    fields: {
      project: { key: ENV.jiraProject },
      summary: title,
      description: description,
      issuetype: { name: type },
      labels: ["qe-task"],
      components: [
        {
          name: "QE-Task",
        },
      ],
    },
  };

  if (parent) {
    data.fields.parent = { key: parent };
  }

  if (assignee) {
    data.fields.assignee = { name: assignee };
  }

  return doIssuePostRequest<JiraIssueResponse>(data);
};

export const getIssue = async (
  issueKey: string
): Promise<JiraIssueResponse> => {
  await new Promise(r => setTimeout(r, 700)); // sleep to accommodate to Jira API rate limits

  const response = await fetch(`${ENV.jiraApiUrl}/issue/${issueKey}`, {
    headers,
  });
  if (response.status >= 400) {
    throw new Error(
      `Status ${response.status} when getting issue ${issueKey} wit error ${await response.text()}`
    );
  }

  return response.json();
};

export const getJiraServerInfo = async (): Promise<JiraServerInfo> => {
  await new Promise(r => setTimeout(r, 700)); // sleep to accommodate to Jira API rate limits
  const response = await fetch(`${ENV.jiraApiUrl}/serverInfo`, {
    headers,
  });
  if (response.status >= 400) {
    throw new Error(
      `Cannot get server info ${await response.text()}`
    );
  }

  return response.json();
};

export const updateIssue = async (
  issueId: string,
  data: RecursivePartial<JiraIssueParams>
) => {
  return doIssuePutRequest(data, issueId);
};

export const search = async (searchTerm: string) => {
  const response = await fetch(
    `${ENV.jiraApiUrl}/search?jql=project=MTA AND ${searchTerm}`,
    {
      headers,
    }
  );
  if (response.status >= 400) {
    throw new Error(
      `Status ${response.status} when searching issues wit error ${await response.text()}`
    );
  }

  return response.json();
};

const doIssuePostRequest = async <T>(data: JiraIssueParams): Promise<T> => {
  await new Promise(r => setTimeout(r, 700)); // sleep to accommodate to Jira API rate limits
  const response = await fetch(`${ENV.jiraApiUrl}/issue`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (response.status >= 400) {
    throw new Error(
      `Status ${response.status} when creating or updating Issue wit error ${await response.text()}`
    );
  }

  return response.json();
};

const doIssuePutRequest = async (
  data: RecursivePartial<JiraIssueParams>,
  issueId: string
): Promise<string> => {
  await new Promise(r => setTimeout(r, 700)); // sleep to accommodate to Jira API rate limits
  const response = await fetch(`${ENV.jiraApiUrl}/issue/${issueId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });
  if (response.status >= 400) {
    throw new Error(
      `Status ${response.status} when creating or updating Issue wit error ${await response.text()}`
    );
  }

  return response.text();
};
