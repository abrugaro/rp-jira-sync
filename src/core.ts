import { createIssue, search, updateIssue } from "./requests/jira";
import {
  getLaunchById,
  getLaunchFailedItems,
  updateIssueType,
} from "./requests/report-portal";
import { ReportPortalItem } from "./model/report-portal-item";
import { Logger } from "./model/logger";
import { Response } from "./model/response";
import { launchToTaskDescription } from "./adapters/task.adapter";
import { ParsedQs } from "qs";
import { findOwner, isMarkedAsProductBug, shouldCreateTask } from "./common/utils";
import { JiraIssueTypes } from "./enums/jira-issue-types.enum";
import { RpIssueTypes } from "./enums/rp-issue-types";

export const main = async (
  id: number,
  queryParams: ParsedQs,
  logger?: Logger
) => {
  if (!logger) {
    logger = new Logger();
  }
  const apiResponse: Response<string> = {
    success: false,
    message: "Something failed, see the logs for more info",
    data: "",
  };

  // Check if a task already exists for the specified run
  try {
    const searchResult = await search(`summary ~ ${id}`);
    if (searchResult.total > 0) {
      logger.debug(`A task already exists for run ${id}`);
      return apiResponse;
    }
  } catch (e) {
    logger.error(e);
    return apiResponse;
  }

  // Get launch data
  const launchResponse = await getLaunchById(id);
  logger.debug(launchResponse);
  if (!launchResponse.content || !launchResponse.content[0]) {
    logger.error("Launch Response error");
    return apiResponse;
  }
  const launchId = launchResponse.content[0].id;

  // Get launch failed items details
  const launchFailedItems = await getLaunchFailedItems(launchId);
  logger.debug(launchFailedItems);
  if (!launchFailedItems) {
    logger.error("Launch Failed items error response");
    return apiResponse;
  }

  if (!launchFailedItems.content.length) {
    logger.info("No failed items found");
    return apiResponse;
  }

  // Map failed items by their test suite
  const itemsBySuite: { [key: string]: ReportPortalItem[] } = {};
  try {
    launchFailedItems.content.forEach((item: ReportPortalItem) => {
      const suiteName = item.pathNames.itemPaths[0].name;

      if (item.name.toLowerCase().startsWith("bug") && !isMarkedAsProductBug(item)) {
        updateIssueType(item.id, RpIssueTypes.ProductBug);
        logger.info(`Mark ${item.id}: ${item.name} as PB in RP`);
      }

      if (!shouldCreateTask(suiteName, item)) {
        return true;
      }

      if (!itemsBySuite[suiteName]) {
        itemsBySuite[suiteName] = [];
      }
      itemsBySuite[suiteName].push(item);
    });
  } catch (e) {
    logger.error("Error while mapping suites");
    logger.error(e);
    return apiResponse;
  }

  let jiraTask = null;
  try {
    jiraTask = await createIssue(
      JiraIssueTypes.Task,
      `[QE] Fix JF for Report Portal run ${launchId}`,
      `Fix failures for RP Run ${launchResponse.content[0].number}\n ${launchResponse.content[0].description}`
    );

    if (queryParams.epic) {
      await updateIssue(jiraTask.id, {
        fields: { customfield_12311140: queryParams.epic as string },
      });
    }
  } catch (e) {
    logger.error("Error while creating or updating Jira Task");
    logger.error(e);
    return apiResponse;
  }

  try {
    for (let suite of Object.keys(itemsBySuite)) {
      const res = await createIssue(
        JiraIssueTypes.SubTask,
        `[QE] Fix JF for ${suite}`,
        launchToTaskDescription(launchResponse.content[0], itemsBySuite[suite]),
        findOwner(suite),
        jiraTask.key
      );
      await updateIssue((res as any).id, {
        fields: { customfield_12310243: 2 },
      });
    }
    apiResponse.success = true;
    apiResponse.message = "Ok";
    return apiResponse;
  } catch (e) {
    logger.error("Error while creating Jira SubTasks");
    logger.error(e);
    return apiResponse;
  }
};
