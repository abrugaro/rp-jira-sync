import { createIssue, getIssue, search, updateIssue } from "./requests/jira";
import {
  getLaunchById,
  getLaunchFailedItems,
  updateIssueType,
} from "./requests/report-portal";
import { ReportPortalItem } from "./model/report-portal-item";
import { ExecutionResponseData, Response } from "./model/response";
import { launchToTaskDescription } from "./adapters/task.adapter";
import { ParsedQs } from "qs";
import {
  findOwner,
  getBugIdFromTestName,
  shouldCreateTask,
  shouldMarkAsPBinRP,
} from "./common/utils";
import { JiraIssueTypes } from "./enums/jira-issue-types.enum";
import { RpIssueTypes } from "./enums/rp-issue-types";
import { issueKeyToBrowseLink } from "./adapters/urls.adapter";
import { ENV } from "../env";

const logger = require("./common/common");

export const main = async (id: number, queryParams: ParsedQs) => {
  const apiResponse: Response<ExecutionResponseData> = {
    success: false,
    message: "Something failed, see the logs for more info",
    data: { mainTaskKey: null, mainTaskLink: null },
    logs: "",
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

  let jiraTask = null;
  // A parent task key has been passed
  if (queryParams.parentTask) {
    try {
      jiraTask = await getIssue(queryParams.parentTask as string);
    } catch (e) {
      logger.error(e);
      apiResponse.message = `Task ${queryParams.parentTask} not found, see logs for more info`;
      return apiResponse;
    }

    logger.info(`FOUND PASSED TASK: ${jiraTask.key}`);
    apiResponse.data.mainTaskKey = jiraTask.key;
    apiResponse.data.mainTaskLink =
      ENV.jiraApiUrl.replace("/rest/api/2", "/browse/") + jiraTask.key;

    await updateIssue(jiraTask.id, {
      fields: {
        summary: `${jiraTask.fields.summary} | RP id ${id}`,
      },
    });
  }

  // Get launch data
  const launchResponse = await getLaunchById(id);
  logger.debug(launchResponse);
  if (!launchResponse.content || !launchResponse.content[0]) {
    logger.error("Launch Response error");
    return apiResponse;
  }
  const launchId = launchResponse.content[0].id;

  // Map failed items by their test suite
  const itemsBySuite: { [key: string]: ReportPortalItem[] } = {};

  const launchFailedItemsResponse = await getLaunchFailedItems(launchId);
  for (let page = 0; page < launchFailedItemsResponse.page.totalPages; page++) {
    // Get launch failed items details, page count starts at 1
    const launchFailedItems = await getLaunchFailedItems(launchId, page + 1);
    logger.debug(`Launch failed items page ${page + 1}`);
    logger.debug(launchFailedItems);
    if (!launchFailedItems) {
      logger.error("Launch Failed items error response");
      return apiResponse;
    }

    if (!launchFailedItems.content.length) {
      logger.info("No failed items found");
      return apiResponse;
    }

    try {
      for (const item of launchFailedItems.content) {
        const suiteName = item.pathNames.itemPaths[0].name;

        // Check if failure should be marked as bug in RP
        if (await shouldMarkAsPBinRP(item)) {
          const bugId = getBugIdFromTestName(item.name);
          const bugLink = bugId ? issueKeyToBrowseLink(bugId) : "";

          updateIssueType(item.id, RpIssueTypes.ProductBug, bugLink);
          logger.info(`Marked ${item.id}: ${item.name} as PB in RP`);
        }

        if (!(await shouldCreateTask(suiteName, item))) {
          logger.debug(
            `Should not create a task for ${suiteName}: ${item.name}`
          );
          continue;
        }

        if (!itemsBySuite[suiteName]) {
          itemsBySuite[suiteName] = [];
        }
        itemsBySuite[suiteName].push(item);
      }
    } catch (e) {
      logger.error("Error while mapping suites");
      logger.error(e);
      return apiResponse;
    }
  }

  if (!jiraTask) {
    try {
      jiraTask = await createIssue(
        JiraIssueTypes.Task,
        `[QE] Fix JF for Report Portal run ${launchId}`,
        `Fix failures for RP Run ${launchResponse.content[0].number}\n ${launchResponse.content[0].description}`
      );

      logger.info(`CREATED MAIN TASK: ${jiraTask.key}`);
      apiResponse.data.mainTaskKey = jiraTask.key;
      apiResponse.data.mainTaskLink =
        ENV.jiraApiUrl.replace("/rest/api/2", "/browse/") + jiraTask.key;

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
