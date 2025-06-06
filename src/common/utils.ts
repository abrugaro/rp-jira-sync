import { ReportPortalItem } from "../model/report-portal-item";
import { ENV, OWNERS } from "../../env";
import { getIssue, search } from "../requests/jira";
import { JiraStatuses } from "../enums/jira-statuses.enum";
import { JiraIssueResponse } from "../model/jira-issue";

const logger = require("./common");

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
 * Check if an element is marked as a bug
 * An element is considered "Marked with a bug" if its name starts with "Bug"
 * or if it is an after or before hook and includes '"bug' in the middle of its name
 * @param elementName failed test or suite name
 */
export const isElementMarkedAsBug = (elementName: string) => {
  elementName = elementName.trim().toLowerCase();
  return elementName.includes("bug ") && elementName.includes(":")
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
  // A task shouldn't be created if the suite or test is marked with a bug that is open in its name
  if (isElementMarkedAsBug(suiteName) && (await isBugOpen(suiteName))) {
    logger.debug(`Suite ${suiteName} is marked with a non verified bug`);
    return false;
  }

  if (isElementMarkedAsBug(item.name) && (await isBugOpen(item.name))) {
    logger.debug(`Test ${item.name} is marked with a non verified bug`);
    return false;
  }

  // A task shouldn't be created if the suite or test is marked as a product bug in Report Portal
  if (isMarkedAsProductBugInRP(item)) {
    logger.debug(`Test ${item.name} is marked as PB in RP`);
    return false;
  }

  // A task shouldn't be created if there is already an existing task for that specific suite
  const existingIssues = await search(
    `summary ~ "Fix JF for ${suiteName}" AND status in ("${JiraStatuses.New}", "${JiraStatuses.InProgress}")`
  );

  if (existingIssues.total) {
    // Jira does not perform an exact matching, because of that, a filter is needed here
    if (
      existingIssues.issues.find(
        (issue: JiraIssueResponse) =>
          issue.fields.summary === `[QE] Fix JF for ${suiteName}`
      )
    ) {
      logger.debug(`A non-finished task already exists for suite ${suiteName}`);
      return false;
    }
  }

  return true;
};

/**
 * A failure should be marked as PB in RP if
 * 1. It is marked as a Bug in the element name
 * 2. It is NOT already marked as a PB in RP
 * 3. The bug is open in Jira (or it is an external bug)
 * @param item
 */
export const shouldMarkAsPBinRP = async (
  item: ReportPortalItem
): Promise<boolean> => {
  return (
    isElementMarkedAsBug(item.name) &&
    !isMarkedAsProductBugInRP(item) &&
    (await isBugOpen(item.name))
  );
};

/**
 *
 * @param suiteOrTestName
 */
export const isBugOpen = async (suiteOrTestName: string) => {
  const bugId = getBugIdFromTestName(suiteOrTestName);

  if (!bugId) {
    /**
     * If the bug can't be extracted from the test name, it means that
     * it is not written in the correct format or it is from a different tracking system
     * TODO: Check if this can be improved
     */
    return true;
  }

  const issue = await getIssue(bugId);
  return !["verified", "closed", "on_qa"].includes(issue.fields.status.name.toLowerCase());
};

export const isMarkedAsProductBugInRP = (item: ReportPortalItem) => {
  return (
    item.statistics.defects.product_bug &&
    item.statistics.defects.product_bug.total > 0
  );
};

/**
 * Returns the bug link from a test or suite name
 * This method assumes that the bug is marked in the test name as "Bug JIRA_PROJECT_KEY-XXXX: Test name"
 * @param testName
 */
export function getBugIdFromTestName(testName: string): string {
  const match = testName.toLowerCase().match(/bug\s([a-z]+-\d+):/);
  if (!match || !match[1].toUpperCase().startsWith(ENV.jiraProject)) {
    return null;
  }

  return match[1].toUpperCase();
}
