import { ENV } from "../../env";

export const issueKeyToBrowseLink = (issueKey: string): string => {
  return `${ENV.jiraApiUrl.split("/rest")[0]}/browse/${issueKey}`;
};
