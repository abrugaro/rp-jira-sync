import { OWNERS } from "../../owners";
import { ReportPortalItem } from "../model/report-portal-item";
import { ENV } from "../../env";
import { getIssue } from "../requests/jira";

/**
 * Returns the owner of a test suite based on the OWNERS env param
 * @param suite
 */
export const findOwner = (suite: string) => {
  const owner = OWNERS[suite];
  if (owner) {
    return owner;
  }

  return OWNERS[
    Object.keys(OWNERS).find((suiteName) =>
      suite.toLowerCase().includes(suiteName.toLowerCase())
    )
  ];
};

/**
 * Checks if a task should be created based on different criteria
 * @param suiteName
 * @param item
 * @return boolean
 */
export const shouldCreateTask = (
  suiteName: string,
  item: ReportPortalItem
): boolean => {
  // A task shouldn't be created if the suite or test is marked with a bug in its name
  if (
    suiteName.toLowerCase().startsWith("bug") ||
    item.name.toLowerCase().startsWith("bug")
  ) {
    return false;
  }

  // A task shouldn't be created if the suite or test is marked as a product bug in Report Porta
  return !isMarkedAsProductBug(item);
};

export const isMarkedAsProductBug = async (item: ReportPortalItem) => {
  if (
    item.statistics.defects.product_bug &&
    item.statistics.defects.product_bug.total > 0
  ) {
    const issue = await getIssue(item.name);
    if (issue.status.name.toLowerCase() !== "verified") {
      return true;
    }
  }
  return false;
};

/**
 * Returns the bug link from a test or suite name
 * This method assumess that the bug is marked in the test name as "Bug XXXX: Test name"
 * @param testName
 */
export function getBugLinkFromTestName(testName: string): string {
  const first = testName.split(":")[0];
  if (!first) {
    return null;
  }

  const id = first[0].split(" ")[1];
  if (!id) {
    return null;
  }

  return `${ENV.jiraApiUrl.split("/rest")[0]}/browse/${id}`;
}
