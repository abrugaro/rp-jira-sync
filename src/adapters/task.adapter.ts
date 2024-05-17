import { ReportPortalLaunch } from "../model/report-portal-launch";
import { ReportPortalItem } from "../model/report-portal-item";
import { ENV } from "../../env";

export function launchToTaskDescription(
  launch: ReportPortalLaunch,
  suiteItems: ReportPortalItem[]
): string {
  const attrKeys = launch.attributes.map(attr => attr.key).join('||');
  const attrValues = launch.attributes.map(attr => attr.value).join('|');
  const rpUrl = ENV.reportPortalApiUrl
    .replace("/api/", "/ui/")
    .concat(
      `/#${ENV.reportPortalProject}/launches/all/${launch.id}/${suiteItems[0].parent}`
    );

  let description = `*RP Suite errors URL (Please, analyze the failures in RP using the following link):* ${rpUrl}\n\n----\n\n
        *RP Run #${launch.number}*\n *Jenkins:* ${launch.description}\n\n
        *Launch Attributes*\n
        ||${attrKeys}|
        |${attrValues}|
    `;
  description += suiteItems.map((item) => item.description).join("\n");

  return description;
}
