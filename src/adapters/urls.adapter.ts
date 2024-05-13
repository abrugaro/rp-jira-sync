import { ReportPortalLaunch } from "../model/report-portal-launch";
import { ReportPortalItem } from "../model/report-portal-item";
import { ENV } from "../../env";

export const issueKeyToBrowseLink = (issueKey: string): string => {
  return `${ENV.jiraApiUrl.split("/rest")[0]}/browse/${issueKey}`;
}