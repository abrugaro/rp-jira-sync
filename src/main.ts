import {createSubTask, createTask, search} from "./requests/jira";
import {getLatestLaunch, getLaunchById, getLaunchFailedItems} from "./requests/report-portal";
import {ReportPortalItem} from "./model/report-portal-item";


const itemsBySuite: {[key: string]: ReportPortalItem[]} = {};
// TODO move to args
const ID = 5233;

const main = async () => {
    try {
        const searchResult = await search(`summary ~ ${ID}`);
        if (searchResult.total > 0) {
            console.log(`A task already exists for run ${ID}`);
            return;
        }
    } catch (e) {
        console.error(e);
        return;
    }

    getLaunchById(ID).then(async (response) => {
        console.log(response);
        return response.content[0].id;
    }).then(async (launchId) => {
        const launchFailedItems = await getLaunchFailedItems(launchId);
        console.log(launchFailedItems);
        if (!launchFailedItems) {
            console.error("Launch Failed items error response");
            return;
        }


        if (!launchFailedItems.content.length) {
            console.info("No failed items found");
            return;
        }

        launchFailedItems.content.forEach(item => {
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
            console.error("Error while creating Jira Task", e);
            return;
        }


        try {
            for (let suite of Object.keys(itemsBySuite)) {
                await createSubTask(
                    jiraTask.key,
                    `[QE] Fix JF for ${suite}`,
                    itemsBySuite[suite].map(item => item.description).join('\n\n'),
                );
            }
        } catch (e) {
            console.error("Error while creating Jira SubTasks", e);
            return;
        }

    });
}

main();