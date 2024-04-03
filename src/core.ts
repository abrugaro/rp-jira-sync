import {createSubTask, createTask, search} from "./requests/jira";
import {getLaunchById, getLaunchFailedItems} from "./requests/report-portal";
import {ReportPortalItem} from "./model/report-portal-item";
import {Logger} from "./model/logger";
import {Response} from "./model/response";
import {OWNERS} from "../owners";

export const main = async (id: number, logger?: Logger) => {
    const itemsBySuite: { [key: string]: ReportPortalItem[] } = {};
    const apiResponse: Response<string> = {
        success: false,
        message: "Something failed, see the logs for more info",
        data: ""
    }

    // Check if a task already exists for the specified run
    try {
        const searchResult = await search(`summary ~ ${id}`);
        if (searchResult.total > 0) {
            logger.debug(`A task already exists for run ${id}`);
            apiResponse.data = logger.getLogs();
            return apiResponse;
        }
    } catch (e) {
        logger.error(e);
        apiResponse.data = logger.getLogs();
        return apiResponse;
    }

    // Get launch data
    const launchResponse = await getLaunchById(id);
    logger.debug(launchResponse);
    const launchId = launchResponse.content[0].id;

    // Get launch failed items details
    const launchFailedItems = await getLaunchFailedItems(launchId);
    logger.debug(launchFailedItems);
    if (!launchFailedItems) {
        logger.error("Launch Failed items error response");
        apiResponse.data = logger.getLogs();
        return apiResponse;
    }

    if (!launchFailedItems.content.length) {
        logger.info("No failed items found");
        apiResponse.data = logger.getLogs();
        return apiResponse;
    }

    // Map failed items by their test suite
    launchFailedItems.content.forEach((item: any) => {
        const suiteName = item.pathNames.itemPaths[0].name
        if (!itemsBySuite[suiteName]) {
            itemsBySuite[suiteName] = [];
        }
        itemsBySuite[suiteName].push(item);
    });

    let jiraTask = null;
    try {
        jiraTask = await createTask(
            `[QE] Fix JF for Report Portal run ${launchId}`,
            'To be defined',
            null
        );
    } catch (e) {
        logger.error("Error while creating Jira Task");
        logger.error(e);
        apiResponse.data = logger.getLogs();
        return apiResponse;
    }


    try {
        for (let suite of Object.keys(itemsBySuite)) {
            await createSubTask(
                jiraTask.key,
                `[QE] Fix JF for ${suite}`,
                itemsBySuite[suite].map(item => item.description).join('\n\n')
            );
        }
        apiResponse.success = true;
        apiResponse.message = "Ok";
        apiResponse.data = logger.getLogs();
        return apiResponse;
    } catch (e) {
        logger.error("Error while creating Jira SubTasks");
        logger.error(e);
        apiResponse.data = logger.getLogs();
        return apiResponse;
    }

}

export const findOwner = (suite: string) => {
    const owner = OWNERS[suite];
    if (owner) {
        return owner;
    }

    return Object.keys(OWNERS).find(suiteName => suiteName.toLowerCase().includes(suite.toLowerCase()));
}