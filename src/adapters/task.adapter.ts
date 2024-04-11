import {ReportPortalLaunch} from "../model/report-portal-launch";
import {ReportPortalItem} from "../model/report-portal-item";
import {ENV} from "../../env";

export function launchToTaskDescription(launch: ReportPortalLaunch, suiteItems: ReportPortalItem[]): string {
    let rpUrl = ENV.reportPortalApiUrl.replace('/api/', '/ui/')
        .concat(`/#${ENV.reportPortalProject}/launches/all/${launch.id}/${suiteItems[0].parent}`);

    let description =  `*RP Run #${launch.number}*\n *Jenkins:* ${launch.description}
        \n\n*RP Suite errors URL:* ${rpUrl}\n\n----\n\n
    `;
    description += suiteItems.map(item => item.description).join('\n');

    return description;
}
