export interface JiraServerInfo {
  baseUrl?: string;
  version?: string;
  versionNumbers?: number[];
  deploymentType?: string;
  buildNumber?: number;
  buildDate?: string;
  databaseBuildNumber?: number;
  scmInfo?: string;
  serverTitle?: string;
}
