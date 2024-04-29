import { OWNERS } from "../../owners"
import { ReportPortalItem } from "../model/report-portal-item"

/**
 * Returns the owner of a test suite based on the OWNERS env param
 * @param suite
 */
export const findOwner = (suite: string) => {
  const owner = OWNERS[suite]
  if (owner) {
    return owner
  }

  return OWNERS[
    Object.keys(OWNERS).find((suiteName) =>
      suite.toLowerCase().includes(suiteName.toLowerCase()),
    )
    ]
}

/**
 * Checks if a task should be created based on different criteria
 * @param suiteName
 * @param item
 * @return boolean
 */
export const shouldCreateTask = (
  suiteName: string,
  item: ReportPortalItem,
): boolean => {
  // A task shouldn't be created if the suite or test is marked with a bug in its name
  if (
    suiteName.toLowerCase().startsWith("bug") ||
    item.name.toLowerCase().startsWith("bug")
  ) {
    return false
  }

  // A task shouldn't be created if the suite or test is marked as a product bug in Report Porta
  return !isMarkedAsProductBug(item);
}

export const isMarkedAsProductBug = (item: ReportPortalItem) => {
  return item.statistics.defects.product_bug &&
    item.statistics.defects.product_bug.total > 0;
}