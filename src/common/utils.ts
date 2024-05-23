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
export const shouldCreateTask = async (
  suiteName: string,
  item: ReportPortalItem
): Promise<boolean> => {
  // A task shouldn't be created if the suite or test is marked with a bug that is not verified in its name
  if (
    suiteName.toLowerCase().startsWith("bug") &&
    !(await isBugVerified(suiteName))
  ) {
    return false;
  }

  if (
    item.name.toLowerCase().startsWith("bug") &&
    !(await isBugVerified(item.name))
  ) {
    return false;
  }

  // A task shouldn't be created if the suite or test is marked as a product bug in Report Portal
  return !isMarkedAsProductBugInRP(item);
};

/**
 *
 * @param suiteOrTestName
 */
export const isBugVerified = async (suiteOrTestName: string) => {
  const bugId = getBugIdFromTestName(suiteOrTestName);

  if (!bugId) {
    /**
     * If the bug can't be extracted from the test name, it means that
     * it is not written in the correct format
     * TODO: Check if this can be improved
     */
    return true;
  }

  const issue = await getIssue(bugId);
  return issue.fields.status.name.toLowerCase() === "verified";
};

export const isMarkedAsProductBugInRP = (item: ReportPortalItem) => {
  return (
    item.statistics.defects.product_bug &&
    item.statistics.defects.product_bug.total > 0
  );
};

/**
 * Returns the bug link from a test or suite name
 * This method assumess that the bug is marked in the test name as "Bug XXXX: Test name"
 * @param testName
 */
export function getBugIdFromTestName(testName: string): string {
  const first = testName.split(":")[0];
  if (!first) {
    return null;
  }

  const id = first.split(" ")[1];

  return id ?? null;
}
